import os
import httpx
from cryptography.fernet import Fernet
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv()

# The encryption key must be 32 URL-safe base64-encoded bytes.
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY")
if not ENCRYPTION_KEY:
    # Just for development/fallback if not set
    ENCRYPTION_KEY = Fernet.generate_key().decode('utf-8')

fernet = Fernet(ENCRYPTION_KEY.encode('utf-8'))

INSTAGRAM_APP_ID = os.getenv("INSTAGRAM_APP_ID", "").strip()
INSTAGRAM_APP_SECRET = os.getenv("INSTAGRAM_APP_SECRET", "").strip()
INSTAGRAM_REDIRECT_URI = os.getenv("INSTAGRAM_REDIRECT_URI", "").strip()
GRAPH_API_VERSION = "v21.0"  # Current stable Graph API version
GRAPH_URL = f"https://graph.facebook.com/{GRAPH_API_VERSION}"

def encrypt_token(token: str) -> str:
    return fernet.encrypt(token.encode('utf-8')).decode('utf-8')

def decrypt_token(encrypted_token: str) -> str:
    return fernet.decrypt(encrypted_token.encode('utf-8')).decode('utf-8')

async def exchange_code_for_token(code: str) -> dict:
    url = f"{GRAPH_URL}/oauth/access_token"
    params = {
        "client_id": INSTAGRAM_APP_ID,
        "client_secret": INSTAGRAM_APP_SECRET,
        "redirect_uri": INSTAGRAM_REDIRECT_URI,
        "code": code
    }
    
    print(f"DEBUG Token Exchange -> App ID: {INSTAGRAM_APP_ID}")
    print(f"DEBUG Token Exchange -> Redirect URI: {INSTAGRAM_REDIRECT_URI}")
    print(f"DEBUG Token Exchange -> App Secret set: {'YES' if INSTAGRAM_APP_SECRET and INSTAGRAM_APP_SECRET != 'your_app_secret_here' else 'NO'}")
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        print(f"DEBUG Token Exchange -> Response status: {response.status_code}")
        print(f"DEBUG Token Exchange -> Response body: {response.text}")
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to exchange token: {response.text}")
        return response.json()

async def get_long_lived_token(short_lived_token: str) -> dict:
    url = f"{GRAPH_URL}/oauth/access_token"
    params = {
        "grant_type": "fb_exchange_token",
        "client_id": INSTAGRAM_APP_ID,
        "client_secret": INSTAGRAM_APP_SECRET,
        "fb_exchange_token": short_lived_token
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to get long-lived token: {response.text}")
        return response.json()

async def get_instagram_accounts(access_token: str) -> list:
    url = f"{GRAPH_URL}/me/accounts"
    params = {
        "access_token": access_token,
        "fields": "instagram_business_account,name,id"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch accounts: {response.text}")
        data = response.json()
        
        ig_accounts = []
        for page in data.get("data", []):
            if "instagram_business_account" in page:
                ig_accounts.append({
                    "page_id": page["id"],
                    "page_name": page["name"],
                    "instagram_id": page["instagram_business_account"]["id"]
                })
        return ig_accounts

async def get_instagram_profile(ig_user_id: str, access_token: str) -> dict:
    url = f"{GRAPH_URL}/{ig_user_id}"
    params = {
        "fields": "id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count,website",
        "access_token": access_token
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch IG profile: {response.text}")
        return response.json()

async def get_instagram_media(ig_user_id: str, access_token: str, limit: int = 50) -> list:
    url = f"{GRAPH_URL}/{ig_user_id}/media"
    params = {
        "fields": "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,like_count,comments_count",
        "access_token": access_token,
        "limit": limit
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail=f"Failed to fetch IG media: {response.text}")
        return response.json().get("data", [])

async def get_media_insights(media_id: str, access_token: str) -> dict:
    url = f"{GRAPH_URL}/{media_id}/insights"
    params = {
        "metric": "impressions,reach,saved,shares",
        "access_token": access_token
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code != 200:
            # Some media (like old posts) might not have these insights available, handle gracefully
            return {}
        data = response.json().get("data", [])
        insights = {}
        for item in data:
            insights[item["name"]] = item["values"][0]["value"]
        return insights
