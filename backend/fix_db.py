import asyncio
from sqlalchemy import update, insert
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from app.models.danh_muc import ChiTietHangGhe, ChuyenBay
from sqlalchemy.future import select

async def fix():
    async_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    engine = create_async_engine(async_url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # 1. Add Economy, Business, First Class if they don't exist
        result = await session.execute(select(ChuyenBay))
        flights = result.scalars().all()
        for f in flights:
            # Check existing ECO price to use as base
            res_eco = await session.execute(select(ChiTietHangGhe).where(ChiTietHangGhe.ma_cb == f.ma_cb, ChiTietHangGhe.hang_ghe == 'ECO'))
            eco = res_eco.scalar()
            base_price = float(eco.gia_co_ban) if eco else 1500000
            
            for h, m in [('Economy', 1), ('Business', 2.5), ('First Class', 4.5)]:
                res = await session.execute(select(ChiTietHangGhe).where(ChiTietHangGhe.ma_cb == f.ma_cb, ChiTietHangGhe.hang_ghe == h))
                if not res.scalar():
                    session.add(ChiTietHangGhe(
                        ma_cb=f.ma_cb,
                        hang_ghe=h,
                        tong_so_ghe=50,
                        so_ghe_trong=50,
                        gia_co_ban=base_price * m
                    ))
        await session.flush()
        
        # 2. Update VeMayBay to point to Economy instead of ECO
        from app.models.nghiep_vu import VeMayBay
        stmt2 = update(VeMayBay).where(VeMayBay.hang_ghe == 'ECO').values(hang_ghe='Economy')
        await session.execute(stmt2)
        await session.flush()
        
        # 3. Delete old ECO records
        from sqlalchemy import delete
        stmt3 = delete(ChiTietHangGhe).where(ChiTietHangGhe.hang_ghe == 'ECO')
        await session.execute(stmt3)
        
        await session.commit()
    print("Database fixed successfully!")

if __name__ == "__main__":
    asyncio.run(fix())
