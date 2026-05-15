from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import logging

from app.core.database import get_db
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.tai_chinh import ThanhToan
from app.models.quan_tri import KhachHang
from app.models.danh_muc import ChuyenBay, ChiTietHangGhe

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

        # Total Revenue (from ThanhToan table for consistency with finance)
        revenue_query = select(func.sum(ThanhToan.so_tien)).where(ThanhToan.trang_thai.in_(['Hoàn tất', 'Đã thanh toán']))
        revenue_res = await db.execute(revenue_query)
        revenue = revenue_res.scalar() or 0

        # Total Passengers
        total_passengers_query = select(func.count(VeMayBay.ma_ve))
        total_passengers_res = await db.execute(total_passengers_query)
        total_passengers = total_passengers_res.scalar()

        # Cancelled Bookings
        cancelled_bookings_query = select(func.count(DatCho.ma_dat_cho)).where(DatCho.trang_thai_tt == 'Đã hủy')
        cancelled_bookings_res = await db.execute(cancelled_bookings_query)
        cancelled_bookings = cancelled_bookings_res.scalar()

        # Available Seats
        available_seats_query = select(func.sum(ChiTietHangGhe.so_ghe_trong))
        available_seats_res = await db.execute(available_seats_query)
        available_seats = available_seats_res.scalar() or 0

        return {
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "pending_bookings": hold_bookings,
            "cancelled_bookings": cancelled_bookings,
            "total_revenue": revenue,
            "total_passengers": total_passengers,
            "available_seats": int(available_seats)
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
