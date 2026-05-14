import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from dotenv import load_dotenv

# Load env from root
env_path = os.path.join(os.getcwd(), '..', '.env')
load_dotenv(env_path)

DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL and DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

async def seed():
    engine = create_async_engine(DATABASE_URL, echo=True)
    
    seed_file = os.path.join(os.getcwd(), '..', 'database', 'scripts', 'seed.sql')
    with open(seed_file, 'r', encoding='utf-8') as f:
        sql_commands = f.read()

    # Split by semicolon but be careful with multi-line statements or comments
    # A better way is to execute the whole block if the driver supports it
    # asyncpg supports multiple statements in one execute call via underlying connection
    
    async with engine.begin() as conn:
        print("Executing seed.sql...")
        # Split by semicolon and filter out empty strings
        commands = [c.strip() for c in sql_commands.split(';') if c.strip()]
        for command in commands:
            await conn.execute(text(command))
        print(f"Seed completed successfully ({len(commands)} commands executed).")
    
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(seed())
