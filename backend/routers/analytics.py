from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.connection import get_db
from database.models import User, ConnectedAccount, InstagramProfile, InstagramMedia, InstagramInsight
from routers.auth import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

async def get_profile_for_user(db: AsyncSession, user_id):
    result = await db.execute(select(ConnectedAccount).where(ConnectedAccount.user_id == user_id, ConnectedAccount.is_active == True))
    account = result.scalars().first()
    if not account:
        return None
    prof_result = await db.execute(select(InstagramProfile).where(InstagramProfile.connected_account_id == account.id))
    return prof_result.scalars().first()

@router.get("/dashboard")
async def get_dashboard_data(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = await get_profile_for_user(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="No Instagram profile connected.")
        
    # Get recent media
    media_res = await db.execute(select(InstagramMedia).where(InstagramMedia.profile_id == profile.id).order_by(InstagramMedia.timestamp.desc()).limit(10))
    media = media_res.scalars().all()
    
    # Calculate simple aggregate stats
    total_likes = sum(m.like_count for m in media)
    total_comments = sum(m.comments_count for m in media)
    
    return {
        "followers": profile.followers_count,
        "following": profile.following_count,
        "media_count": profile.media_count,
        "recent_engagement": total_likes + total_comments,
        "top_posts": [{"id": m.instagram_media_id, "likes": m.like_count, "url": m.media_url, "type": m.media_type} for m in media[:3]]
    }
