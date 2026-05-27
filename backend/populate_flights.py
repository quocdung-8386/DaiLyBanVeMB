import asyncio
from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.models.danh_muc import ChuyenBay, TuyenBay, HangHangKhong, ChiTietHangGhe
from app.models.nghiep_vu import VeMayBay, DatCho

async def populate():
    async_url = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
    engine = create_async_engine(async_url)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # 1. Ensure routes exist
        routes = [
            ('HAN-SGN', 'Hà Nội - TP.HCM', 'HAN', 'SGN', 1150),
            ('SGN-HAN', 'TP.HCM - Hà Nội', 'SGN', 'HAN', 1150),
            ('HAN-DAD', 'Hà Nội - Đà Nẵng', 'HAN', 'DAD', 600),
            ('DAD-SGN', 'Đà Nẵng - TP.HCM', 'DAD', 'SGN', 600),
        ]
        
        for code, name, start, end, dist in routes:
            res = await session.execute(select(TuyenBay).where(TuyenBay.ma_tuyen == code))
            if not res.scalar():
                session.add(TuyenBay(ma_tuyen=code, ten_tuyen=name, ma_sb_di=start, ma_sb_den=end, khoang_cach=dist))
        
        await session.flush()
        
        # 2. Add some flights for today and tomorrow
        airlines = ['VN', 'VJ', 'QH']
        base_times = ['08:00', '12:00', '16:00', '20:00']
        
        for i in range(2): # Today and Tomorrow
            date = datetime.now() + timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            
            for airline in airlines:
                for time in base_times:
                    ma_cb = f"{airline}{date.strftime('%d%m')}{time.replace(':', '')}"
                    
                    # Check if exists
                    res = await session.execute(select(ChuyenBay).where(ChuyenBay.ma_cb == ma_cb))
                    if not res.scalar():
                        dep_dt = datetime.strptime(f"{date_str} {time}", "%Y-%m-%d %H:%M")
                        arr_dt = dep_dt + timedelta(minutes=120)
                        
                        cb = ChuyenBay(
                            ma_cb=ma_cb,
                            ma_tuyen='HAN-SGN' if airline == 'VN' else 'SGN-HAN',
                            ma_hang=airline,
                            ngay_gio_di=dep_dt,
                            ngay_gio_den=arr_dt,
                            thoi_gian_bay=120,
                            nha_ga='T1',
                            cong_khoi_hanh='A1',
                            trang_thai='Đang bán vé',
                            ma_may_bay='Airbus A321'
                        )
                        session.add(cb)
                        await session.flush()
                        
                        # Add Seating
                        for hang, multiplier, cap in [('Economy', 1, 150), ('Premium Economy', 1.5, 30), ('Business', 2.5, 20), ('First Class', 4.5, 10)]:
                            # Count actual tickets sold
                            tickets_res = await session.execute(select(VeMayBay).where(VeMayBay.ma_cb == ma_cb, VeMayBay.hang_ghe == hang))
                            sold = len(tickets_res.scalars().all())
                            
                            session.add(ChiTietHangGhe(
                                ma_cb=ma_cb,
                                hang_ghe=hang,
                                tong_so_ghe=cap,
                                so_ghe_trong=cap - sold,
                                gia_co_ban=Decimal('1200000') * Decimal(str(multiplier))
                            ))
        
        await session.commit()
    print("Database populated with full flights successfully!")

if __name__ == "__main__":
    asyncio.run(populate())
