import asyncio
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

async def main():
    engine = create_async_engine('postgresql+asyncpg://postgres:postgres@localhost:5432/airline_db')
    async with engine.connect() as conn:
        result = await conn.execute(text("SELECT ma_cb FROM chuyenbay LIMIT 1"))
        flights = [r[0] for r in result.all()]
        print('FLIGHTS:', flights)
    await engine.dispose()

asyncio.run(main())
