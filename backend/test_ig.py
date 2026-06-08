import asyncio
import os
import httpx
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("NO DB URL")
    exit()

engine = create_async_engine(DATABASE_URL)
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from services.instagram_service import decrypt_token

async def main():
    async with async_session() as db:
        # Get the first connected account
        result = await db.execute(text("SELECT id, platform_account_id, encrypted_access_token FROM connected_accounts LIMIT 1;"))
        account = result.fetchone()
        if not account:
            print("No connected accounts found in DB")
            return
        
        acc_id, ig_user_id, enc_token = account
        token = decrypt_token(enc_token)
        print(f"IG User ID: {ig_user_id}")
        
        # 1. Fetch Media
        media_url = f"https://graph.facebook.com/v21.0/{ig_user_id}/media"
        params = {
            "fields": "id,caption,media_type,media_url",
            "access_token": token,
            "limit": 5
        }
        async with httpx.AsyncClient() as client:
            resp = await client.get(media_url, params=params)
            media_data = resp.json().get("data", [])
            print(f"Found {len(media_data)} media items.")
            
            for m in media_data:
                m_id = m['id']
                m_type = m['media_type']
                print(f"\nMedia: {m_id} ({m_type}) - {m.get('caption', '')[:30]}...")
                
                # Fetch Insights
                metrics = "impressions,reach,saved,shares"
                ins_url = f"https://graph.facebook.com/v21.0/{m_id}/insights"
                ins_params = {
                    "metric": metrics,
                    "access_token": token
                }
                ins_resp = await client.get(ins_url, params=ins_params)
                print(f"Insights Status: {ins_resp.status_code}")
                if ins_resp.status_code != 200:
                    print(f"Error: {ins_resp.text}")
                else:
                    print(f"Success: {ins_resp.json()}")

asyncio.run(main())
