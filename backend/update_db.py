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
import datetime

async def main():
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
    
    # Get profile id
    profile = await conn.fetchrow("SELECT id FROM instagram_profiles WHERE connected_account_id = $1", acc_id)
    if not profile:
        print("No profile found")
        return
    prof_id = profile['id']
    
    # 1. Fetch Media
    media_url = f"https://graph.facebook.com/v21.0/{ig_user_id}/media"
    params = {
        "fields": "id,caption,media_type,media_url,like_count",
        "access_token": token,
        "limit": 10
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(media_url, params=params)
        media_data = resp.json().get("data", [])
        
        for m in media_data:
            m_id = m['id']
            m_type = m['media_type']
            likes = m.get('like_count', 0)
            print(f"Fetching insights for {m_id} ({m_type})")
            
            metrics = "views,reach,saved"
            ins_url = f"https://graph.facebook.com/v21.0/{m_id}/insights"
            ins_params = {
                "metric": metrics,
                "access_token": token
            }
            ins_resp = await client.get(ins_url, params=ins_params)
            
            if ins_resp.status_code == 200:
                data = ins_resp.json().get('data', [])
                insights = {}
                for item in data:
                    name = item['name']
                    if name == 'views': name = 'impressions'
                    insights[name] = item['values'][0]['value']
                    
                reach = insights.get('reach', 0)
                impressions = insights.get('impressions', 0)
                saved = insights.get('saved', 0)
                engagement = reach + saved + likes # Rough calc
                
                # Check if media exists in DB
                media_row = await conn.fetchrow("SELECT id FROM instagram_media WHERE instagram_media_id = $1", m_id)
                if media_row:
                    db_m_id = media_row['id']
                    
                    # Update or Insert insight
                    insight_row = await conn.fetchrow("SELECT id FROM instagram_insights WHERE media_id = $1", db_m_id)
                    if insight_row:
                        await conn.execute("""
                            UPDATE instagram_insights 
                            SET reach=$1, impressions=$2, saved=$3, engagement=$4
                            WHERE id=$5
                        """, reach, impressions, saved, engagement, insight_row['id'])
                        print(f"Updated insight for {m_id}: Reach={reach}, Imp={impressions}")
                    else:
                        await conn.execute("""
                            INSERT INTO instagram_insights (media_id, profile_id, insight_date, reach, impressions, saved, shares, engagement)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                        """, db_m_id, prof_id, datetime.date.today(), reach, impressions, saved, 0, engagement)
                        print(f"Inserted insight for {m_id}: Reach={reach}, Imp={impressions}")
            else:
                print(f"Failed to fetch insights for {m_id}: {ins_resp.text}")
                
    await conn.close()

asyncio.run(main())
