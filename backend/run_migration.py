import asyncio
import asyncpg
import sys

async def run_migration():
    # Use the DIRECT_URL for migrations
    conn_str = "postgresql://postgres.qplmwpbejtrmjxxzjjef:ItQDHukN6XH3iX2p@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres"
    
    try:
        print("Connecting to database...")
        conn = await asyncpg.connect(conn_str)
        print("Connected successfully.")
        
        with open("database/migrations/001_initial.sql", "r") as f:
            sql = f.read()
            
        print("Executing migration...")
        await conn.execute(sql)
        print("Migration executed successfully.")
        
        await conn.close()
    except Exception as e:
        print(f"Error executing migration: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(run_migration())
