import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from services.instagram_service import decrypt_token
import asyncpg

async def main():
    # Connect directly with asyncpg to disable prepared statement cache to fix Supabase pooler issue
    db_url = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    conn = await asyncpg.connect(db_url, statement_cache_size=0)
    
    # Get the user's connected account
    account = await conn.fetchrow("SELECT id, platform_user_id, access_token_encrypted FROM connected_accounts LIMIT 1;")
    if not account:
        print("No connected accounts found")
        return
        
    acc_id = account['id']
    ig_user_id = account['platform_user_id']
    enc_token = account['access_token_encrypted']
    
    token = decrypt_token(enc_token)
    print(f"IG User ID: {ig_user_id}")
    
    # 1. Fetch Media
    media_url = f"https://graph.facebook.com/v21.0/{ig_user_id}/media"
    params = {
        "fields": "id,caption,media_type,media_url,like_count",
        "access_token": token,
        "limit": 5
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(media_url, params=params)
        media_data = resp.json().get("data", [])
        print(f"\nFound {len(media_data)} media items.")
        
        for m in media_data:
            m_id = m['id']
            m_type = m['media_type']
            caption = m.get('caption', '')[:30].replace('\n', ' ')
            likes = m.get('like_count', 0)
            print(f"\nMedia: {m_id} ({m_type}) - Likes: {likes} - {caption}...")
            
            # Fetch Insights for Carousel
            metrics = "carousel_album_impressions,carousel_album_reach,carousel_album_saved" if m_type == "CAROUSEL_ALBUM" else "impressions,reach,saved"
            
            ins_url = f"https://graph.facebook.com/v21.0/{m_id}/insights"
            ins_params = {
                "metric": metrics,
                "access_token": token
            }
            ins_resp = await client.get(ins_url, params=ins_params)
            print(f"Insights Request 1: {metrics}")
            print(f"Status: {ins_resp.status_code}")
            if ins_resp.status_code != 200:
                print(f"Error: {ins_resp.text}")
            else:
                print(f"Success: {ins_resp.json()}")
                
            if m_type == "CAROUSEL_ALBUM":
                metrics2 = "views,reach,saved"
                ins_params2 = {"metric": metrics2, "access_token": token}
                ins_resp2 = await client.get(ins_url, params=ins_params2)
                print(f"\nInsights Request 2: {metrics2}")
                print(f"Status: {ins_resp2.status_code}")
                if ins_resp2.status_code != 200:
                    print(f"Error: {ins_resp2.text}")
                else:
                    print(f"Success: {ins_resp2.json()}")
                    
    await conn.close()

asyncio.run(main())
