from typing import List, Optional
from datetime import datetime
from sqlalchemy import select, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from app.models.danh_muc import ChuyenBay, TuyenBay, SanBay, HangHangKhong, ChiTietHangGhe


class FlightRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def search_flights(
        self, 
        origin: str, 
        destination: str, 
        departure_date: datetime,
        seat_class: str = "Economy"
    ) -> List[dict]:
        """
        Tìm kiếm chuyến bay dựa trên điểm đi, điểm đến và ngày khởi hành.
        Trả về danh sách các dict chứa đầy đủ thông tin join.
        """
        # 1. Tìm tuyến bay phù hợp
        stmt = (
            select(ChuyenBay)
            .join(TuyenBay, ChuyenBay.ma_tuyen == TuyenBay.ma_tuyen)
            .join(HangHangKhong, ChuyenBay.ma_hang == HangHangKhong.ma_hang)
            .join(ChiTietHangGhe, ChuyenBay.ma_cb == ChiTietHangGhe.ma_cb)
            .options(
                joinedload(ChuyenBay.tuyen_bay).joinedload(TuyenBay.san_bay_di),
                joinedload(ChuyenBay.tuyen_bay).joinedload(TuyenBay.san_bay_den),
                joinedload(ChuyenBay.hang_hang_khong),
                joinedload(ChuyenBay.chi_tiet_hang_ghes)
            )
            .where(
                and_(
                    TuyenBay.ma_sb_di == origin,
                    TuyenBay.ma_sb_den == destination,
                    # So sánh ngày (bỏ qua giờ nếu cần, hoặc tìm trong khoảng ngày)
                    ChuyenBay.ngay_gio_di >= departure_date.replace(hour=0, minute=0, second=0),
                    ChuyenBay.ngay_gio_di <= departure_date.replace(hour=23, minute=59, second=59),
                    ChiTietHangGhe.hang_ghe == seat_class,
                    ChiTietHangGhe.so_ghe_trong > 0
                )
            )
        )
        
        result = await self.session.execute(stmt)
        flights = result.unique().scalars().all()
        
        # Format lại kết quả trả về để map với schema
        formatted_results = []
        for f in flights:
            # Lấy thông tin hạng ghế cụ thể
            target_class = next((c for c in f.chi_tiet_hang_ghes if c.hang_ghe == seat_class), None)
            
            if target_class:
                formatted_results.append({
                    "ma_cb": f.ma_cb,
                    "ma_hang": f.ma_hang,
                    "ten_hang": f.hang_hang_khong.ten_hang,
                    "logo": f.hang_hang_khong.logo,
                    "ma_tuyen": f.ma_tuyen,
                    "ma_sb_di": f.tuyen_bay.ma_sb_di,
                    "ten_sb_di": f.tuyen_bay.san_bay_di.ten_sb,
                    "ma_sb_den": f.tuyen_bay.ma_sb_den,
                    "ten_sb_den": f.tuyen_bay.san_bay_den.ten_sb,
                    "ngay_gio_di": f.ngay_gio_di,
                    "ngay_gio_den": f.ngay_gio_den,
                    "thoi_gian_bay": f.thoi_gian_bay,
                    "nha_ga": f.nha_ga,
                    "cong_khoi_hanh": f.cong_khoi_hanh,
                    "trang_thai": f.trang_thai,
                    "hang_ghe": target_class.hang_ghe,
                    "so_ghe_trong": target_class.so_ghe_trong,
                    "gia_ve": target_class.gia_co_ban,
                    # Fixed mock data for now
                    "carry_on": "7kg" if target_class.hang_ghe == "Economy" else "12kg",
                    "checked_baggage": "20kg" if target_class.hang_ghe == "Economy" else "30kg",
                    "aircraft": "Boeing 787" if f.ma_hang == "VNA" else "Airbus A321"
                })
                
        return formatted_results

    async def get_all_airports(self) -> List[SanBay]:
        stmt = select(SanBay)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_all_airlines(self) -> List[HangHangKhong]:
        stmt = select(HangHangKhong)
        result = await self.session.execute(stmt)
        return result.scalars().all()
