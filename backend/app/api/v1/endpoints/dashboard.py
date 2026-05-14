from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import logging

from app.core.database import get_db
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.quan_tri import KhachHang
from app.models.danh_muc import ChuyenBay

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/stats")
async def get_dashboard_stats(db: AsyncSession = Depends(get_db)):
    """
    Fetch summary statistics for the dashboard.
    """
    try:
        # Total Bookings
        total_bookings_query = select(func.count(DatCho.ma_dat_cho))
        total_bookings_res = await db.execute(total_bookings_query)
        total_bookings = total_bookings_res.scalar()

        # Active (Paid) Bookings
        active_bookings_query = select(func.count(DatCho.ma_dat_cho)).where(DatCho.trang_thai_tt == 'Đã thanh toán')
        active_bookings_res = await db.execute(active_bookings_query)
        active_bookings = active_bookings_res.scalar()

        # Canceled/Hold Bookings
        hold_bookings_query = select(func.count(DatCho.ma_dat_cho)).where(DatCho.trang_thai_tt == 'Chờ thanh toán')
        hold_bookings_res = await db.execute(hold_bookings_query)
        hold_bookings = hold_bookings_res.scalar()

        # Total Revenue
        revenue_query = select(func.sum(DatCho.tong_tien)).where(DatCho.trang_thai_tt == 'Đã thanh toán')
        revenue_res = await db.execute(revenue_query)
        revenue = revenue_res.scalar() or 0

        # Total Customers
        total_customers_query = select(func.count(KhachHang.ma_kh))
        total_customers_res = await db.execute(total_customers_query)
        total_customers = total_customers_res.scalar()

        return {
            "totalBookings": total_bookings,
            "activeBookings": active_bookings,
            "holdBookings": hold_bookings,
            "totalRevenue": f"{revenue:,.0f}đ",
            "totalCustomers": total_customers
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
