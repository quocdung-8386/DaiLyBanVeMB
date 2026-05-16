from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta
import logging

from app.core.database import get_db
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.tai_chinh import ThanhToan
from app.models.quan_tri import KhachHang
from app.models.danh_muc import ChuyenBay, ChiTietHangGhe, TuyenBay

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
        revenue = float(revenue_res.scalar() or 0)

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

        # Priority Alerts (Hold bookings nearing expiry < 2 hours)
        priority_alerts = []
        now = datetime.now()
        
        # Get pending bookings with their flight info for routing
        alert_query = select(
            DatCho, ChuyenBay, TuyenBay
        ).outerjoin(
            VeMayBay, DatCho.ma_dat_cho == VeMayBay.ma_dat_cho
        ).outerjoin(
            ChuyenBay, VeMayBay.ma_cb == ChuyenBay.ma_cb
        ).outerjoin(
            TuyenBay, ChuyenBay.ma_tuyen == TuyenBay.ma_tuyen
        ).where(
            DatCho.trang_thai_tt == 'Chờ thanh toán'
        ).distinct()
        
        alert_res = await db.execute(alert_query)
        for dc, cb, tb in alert_res.all():
            if dc.ngay_dat:
                expiry = dc.ngay_dat + timedelta(hours=24)
                diff = expiry - now
                diff_min = int(diff.total_seconds() / 60)
                
                # If expiring within 2 hours (120 mins)
                if 0 < diff_min < 120:
                    priority_alerts.append({
                        "pnr": dc.ma_dat_cho.split('_')[-1] if '_' in dc.ma_dat_cho else dc.ma_dat_cho,
                        "from": tb.ma_sb_di if tb else (cb.ma_tuyen.split('-')[0] if cb and cb.ma_tuyen else "SGN"),
                        "to": tb.ma_sb_den if tb else (cb.ma_tuyen.split('-')[1] if cb and cb.ma_tuyen and '-' in cb.ma_tuyen else "HAN"),
                        "total": float(dc.tong_tien or 0),
                        "diffMin": diff_min
                    })
        
        # Sort by urgency
        priority_alerts.sort(key=lambda x: x['diffMin'])

        return {
            "total_bookings": total_bookings,
            "active_bookings": active_bookings,
            "pending_bookings": hold_bookings,
            "cancelled_bookings": cancelled_bookings,
            "total_revenue": revenue,
            "total_passengers": total_passengers,
            "available_seats": int(available_seats),
            "priority_alerts": priority_alerts[:5] # Limit to top 5
        }
    except Exception as e:
        logger.error(f"Error fetching dashboard stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))
