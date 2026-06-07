from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.connection import get_db
from database.models import User, AIRecommendation, InstagramMedia
from routers.auth import get_current_user
from routers.analytics import get_profile_for_user
from services.ai_engine import generate_recommendations

router = APIRouter(prefix="/api/recommendations", tags=["recommendations"])

@router.get("/")
async def get_recommendations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = await get_profile_for_user(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="No Instagram profile connected.")
        
    res = await db.execute(select(AIRecommendation).where(AIRecommendation.profile_id == profile.id))
    return res.scalars().all()

@router.post("/generate")
async def trigger_recommendations(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    profile = await get_profile_for_user(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="No Instagram profile connected.")
        
    # Get media to analyze
    media_res = await db.execute(select(InstagramMedia).where(InstagramMedia.profile_id == profile.id).limit(50))
    media_data = media_res.scalars().all()
    
    recs = generate_recommendations(profile, media_data)
    
    # Delete old recs
    await db.execute(AIRecommendation.__table__.delete().where(AIRecommendation.profile_id == profile.id))
    
    # Save new
    new_recs = []
    for r in recs:
        rec_obj = AIRecommendation(
            profile_id=profile.id,
            recommendation_type=r["type"],
            title=r["title"],
            description=r["description"],
            metric_basis=r["basis"]
        )
        db.add(rec_obj)
        new_recs.append(rec_obj)
        
    await db.commit()
    return {"status": "success", "count": len(new_recs)}
