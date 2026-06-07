import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database.connection import get_db
from database.models import User, ConnectedAccount, InstagramProfile, InstagramMedia, InstagramInsight
from routers.auth import get_current_user
from services import instagram_service

router = APIRouter(prefix="/api/instagram", tags=["instagram"])

import urllib.parse

@router.get("/connect")
async def get_connect_url():
    app_id = instagram_service.INSTAGRAM_APP_ID
    redirect_uri = instagram_service.INSTAGRAM_REDIRECT_URI
    
    # Validate that env vars are actually set
    if not app_id or app_id == "your_app_id_here":
        raise HTTPException(status_code=500, detail="INSTAGRAM_APP_ID is not configured in backend/.env")
    if not redirect_uri:
        raise HTTPException(status_code=500, detail="INSTAGRAM_REDIRECT_URI is not configured in backend/.env")
    
    # Scopes required for Instagram Graph API (Facebook Login for Business)
    scopes = [
        "instagram_basic",
        "instagram_manage_insights",
        "pages_show_list",
        "pages_read_engagement",
        "business_management",
    ]
    
    print(f"DEBUG OAuth -> App ID: {app_id}")
    print(f"DEBUG OAuth -> Redirect URI: {redirect_uri}")
    print(f"DEBUG OAuth -> App Secret configured: {'YES' if instagram_service.INSTAGRAM_APP_SECRET and instagram_service.INSTAGRAM_APP_SECRET != 'your_app_secret_here' else 'NO - TOKEN EXCHANGE WILL FAIL'}")
    
    params = {
        "client_id": app_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": ",".join(scopes),
        "state": "aixmedia_oauth_state",
    }
    
    query_string = urllib.parse.urlencode(params)
    url = f"https://www.facebook.com/v21.0/dialog/oauth?{query_string}"
    
    print(f"DEBUG OAuth -> Final URL: {url}")
    return {"url": url, "app_id": app_id}

@router.post("/callback")
async def handle_callback(code: str, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # 1. Exchange code for short-lived token
    token_data = await instagram_service.exchange_code_for_token(code)
    short_token = token_data.get("access_token")
    
    # 2. Exchange for long-lived token
    long_token_data = await instagram_service.get_long_lived_token(short_token)
    long_token = long_token_data.get("access_token")
    
    # 3. Get Instagram accounts linked to user's FB pages
    ig_accounts = await instagram_service.get_instagram_accounts(long_token)
    if not ig_accounts:
        raise HTTPException(
            status_code=400, 
            detail="No Instagram Professional accounts linked to Facebook Pages were found. Please ensure your Instagram is a Business or Creator account and is linked to a Facebook Page you admin."
        )
        
    # 4. Temporarily save token without activating
    result = await db.execute(select(ConnectedAccount).where(ConnectedAccount.user_id == current_user.id))
    connected_account = result.scalars().first()
    
    encrypted_token = instagram_service.encrypt_token(long_token)
    
    if connected_account:
        connected_account.access_token_encrypted = encrypted_token
        connected_account.is_active = False # Require explicit selection
    else:
        connected_account = ConnectedAccount(
            user_id=current_user.id,
            access_token_encrypted=encrypted_token,
            is_active=False
        )
        db.add(connected_account)
    
    await db.commit()
    await db.refresh(connected_account)
    
    return {
        "status": "success",
        "message": "Token saved. Please select an account.",
        "accounts": ig_accounts
    }

from pydantic import BaseModel
class SelectAccountRequest(BaseModel):
    instagram_id: str

@router.post("/select-account")
async def select_account(req: SelectAccountRequest, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ConnectedAccount).where(ConnectedAccount.user_id == current_user.id))
    connected_account = result.scalars().first()
    
    if not connected_account:
        raise HTTPException(status_code=404, detail="No pending connection found.")
        
    connected_account.platform_user_id = req.instagram_id
    connected_account.is_active = True
    
    await db.commit()
    
    # Trigger an initial sync now that we have the ID
    await sync_instagram_data(db, current_user)
    
    return {"status": "success", "message": "Account connected successfully."}

@router.get("/profile")
async def get_profile(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(ConnectedAccount).where(ConnectedAccount.user_id == current_user.id, ConnectedAccount.is_active == True))
    account = result.scalars().first()
    if not account:
        raise HTTPException(status_code=404, detail="Instagram not connected")
        
    prof_result = await db.execute(select(InstagramProfile).where(InstagramProfile.connected_account_id == account.id))
    profile = prof_result.scalars().first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile data not synced yet")
        
    return profile

@router.post("/sync")
async def manual_sync(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    await sync_instagram_data(db, current_user)
    return {"status": "success"}

async def sync_instagram_data(db: AsyncSession, current_user: User):
    result = await db.execute(select(ConnectedAccount).where(ConnectedAccount.user_id == current_user.id, ConnectedAccount.is_active == True))
    account = result.scalars().first()
    if not account:
        return
        
    access_token = instagram_service.decrypt_token(account.access_token_encrypted)
    ig_user_id = account.platform_user_id
    
    # Fetch Profile
    prof_data = await instagram_service.get_instagram_profile(ig_user_id, access_token)
    
    prof_result = await db.execute(select(InstagramProfile).where(InstagramProfile.connected_account_id == account.id))
    profile = prof_result.scalars().first()
    
    if profile:
        profile.username = prof_data.get("username", profile.username)
        profile.name = prof_data.get("name", profile.name)
        profile.bio = prof_data.get("biography", profile.bio)
        profile.profile_picture_url = prof_data.get("profile_picture_url", profile.profile_picture_url)
        profile.followers_count = prof_data.get("followers_count", profile.followers_count)
        profile.following_count = prof_data.get("follows_count", profile.following_count)
        profile.media_count = prof_data.get("media_count", profile.media_count)
        profile.website = prof_data.get("website", profile.website)
        profile.last_synced_at = datetime.datetime.utcnow()
    else:
        profile = InstagramProfile(
            connected_account_id=account.id,
            instagram_id=prof_data["id"],
            username=prof_data.get("username", ""),
            name=prof_data.get("name"),
            bio=prof_data.get("biography"),
            profile_picture_url=prof_data.get("profile_picture_url"),
            followers_count=prof_data.get("followers_count", 0),
            following_count=prof_data.get("follows_count", 0),
            media_count=prof_data.get("media_count", 0),
            website=prof_data.get("website"),
            last_synced_at=datetime.datetime.utcnow()
        )
        db.add(profile)
        await db.flush()
        
    # Fetch Media
    media_data = await instagram_service.get_instagram_media(ig_user_id, access_token)
    for m_item in media_data:
        m_id = m_item["id"]
        med_result = await db.execute(select(InstagramMedia).where(InstagramMedia.instagram_media_id == m_id))
        media_obj = med_result.scalars().first()
        
        # Parse timestamp string properly
        dt = datetime.datetime.strptime(m_item["timestamp"], "%Y-%m-%dT%H:%M:%S%z")
        # Ensure naïve datetime for DB
        dt = dt.replace(tzinfo=None)
        
        if media_obj:
            media_obj.like_count = m_item.get("like_count", media_obj.like_count)
            media_obj.comments_count = m_item.get("comments_count", media_obj.comments_count)
        else:
            media_obj = InstagramMedia(
                profile_id=profile.id,
                instagram_media_id=m_id,
                media_type=m_item.get("media_type", "IMAGE"),
                media_url=m_item.get("media_url"),
                thumbnail_url=m_item.get("thumbnail_url"),
                caption=m_item.get("caption"),
                permalink=m_item.get("permalink"),
                like_count=m_item.get("like_count", 0),
                comments_count=m_item.get("comments_count", 0),
                timestamp=dt,
                is_reel=m_item.get("media_type") == "VIDEO" # Simplify logic
            )
            db.add(media_obj)
            await db.flush()
            
        # Insights for media
        insights_data = await instagram_service.get_media_insights(m_id, access_token)
        if insights_data:
            ins_result = await db.execute(select(InstagramInsight).where(InstagramInsight.media_id == media_obj.id))
            insight_obj = ins_result.scalars().first()
            
            engagement = insights_data.get("reach", 0) + insights_data.get("saved", 0) + insights_data.get("shares", 0)
            
            if insight_obj:
                insight_obj.reach = insights_data.get("reach", insight_obj.reach)
                insight_obj.impressions = insights_data.get("impressions", insight_obj.impressions)
                insight_obj.saved = insights_data.get("saved", insight_obj.saved)
                insight_obj.shares = insights_data.get("shares", insight_obj.shares)
                insight_obj.engagement = engagement
            else:
                insight_obj = InstagramInsight(
                    media_id=media_obj.id,
                    profile_id=profile.id,
                    reach=insights_data.get("reach", 0),
                    impressions=insights_data.get("impressions", 0),
                    saved=insights_data.get("saved", 0),
                    shares=insights_data.get("shares", 0),
                    engagement=engagement,
                    insight_date=datetime.date.today()
                )
                db.add(insight_obj)

    await db.commit()
