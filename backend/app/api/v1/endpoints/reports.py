from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from typing import List, Dict, Any
import logging
from datetime import datetime, timedelta

from app.core.database import get_db
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.tai_chinh import ThanhToan
from app.models.danh_muc import ChuyenBay, TuyenBay, HangHangKhong

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/full")
async def get_full_reports(db: AsyncSession = Depends(get_db)):
    """
    Fetch comprehensive analytics data for the Reports page.
    """
    try:
        # 1. KPI Stats
        # Total Revenue (Paid)
        rev_query = select(func.sum(ThanhToan.so_tien)).where(ThanhToan.trang_thai.in_(['Hoàn tất', 'Đã thanh toán', 'Hoan tat']))
        rev_res = await db.execute(rev_query)
        total_revenue = float(rev_res.scalar() or 0)

        # Total Tickets
        ticket_query = select(func.count(VeMayBay.ma_ve)).where(VeMayBay.trang_thai_ve != 'Đã hủy')
        ticket_res = await db.execute(ticket_query)
        total_tickets = ticket_res.scalar() or 0

        # Cancellation Rate
        all_bookings_query = select(func.count(DatCho.ma_dat_cho))
        all_bookings_res = await db.execute(all_bookings_query)
        total_bookings = all_bookings_res.scalar() or 1
        
        cancelled_query = select(func.count(DatCho.ma_dat_cho)).where(DatCho.trang_thai_tt == 'Đã hủy')
        cancelled_res = await db.execute(cancelled_query)
        cancelled_count = cancelled_res.scalar() or 0
        cancel_rate = (cancelled_count / total_bookings) * 100

        # Assume 15% net profit margin
        net_profit = total_revenue * 0.15

        # 2. Monthly Stats (Last 7 months)
        monthly_stats = []
        for i in range(6, -1, -1):
            date = datetime.now() - timedelta(days=i*30)
            month = date.month
            year = date.year
            
            m_rev_query = select(func.sum(ThanhToan.so_tien)).where(
                extract('month', ThanhToan.ngay_gd) == month,
                extract('year', ThanhToan.ngay_gd) == year,
                ThanhToan.trang_thai.in_(['Hoàn tất', 'Đã thanh toán', 'Hoan tat'])
            )
            m_rev_res = await db.execute(m_rev_query)
            m_rev = float(m_rev_res.scalar() or 0)
            
            monthly_stats.append({
                "month": f"Tháng {month}",
                "revenue": m_rev,
                "profit": m_rev * 0.15
            })

        # 3. Airline Share
        airline_query = select(
            HangHangKhong.ten_hang, 
            func.count(VeMayBay.ma_ve)
        ).join(
            ChuyenBay, VeMayBay.ma_cb == ChuyenBay.ma_cb
        ).join(
            HangHangKhong, ChuyenBay.ma_hang == HangHangKhong.ma_hang
        ).where(
            VeMayBay.trang_thai_ve != 'Đã hủy'
        ).group_by(HangHangKhong.ten_hang)
        
        airline_res = await db.execute(airline_query)
        airline_share = []
        total_tickets_airline = 0
        rows = airline_res.all()
        for name, count in rows:
            total_tickets_airline += count
            
        for name, count in rows:
            percentage = (count / total_tickets_airline * 100) if total_tickets_airline > 0 else 0
            airline_share.append({
                "name": name,
                "count": count,
                "percentage": round(percentage, 1)
            })

        # 4. Top Routes
        route_query = select(
            TuyenBay.ma_sb_di,
            TuyenBay.ma_sb_den,
            func.count(VeMayBay.ma_ve),
            func.sum(VeMayBay.gia_ve)
        ).join(
            ChuyenBay, VeMayBay.ma_cb == ChuyenBay.ma_cb
        ).join(
            TuyenBay, ChuyenBay.ma_tuyen == TuyenBay.ma_tuyen
        ).where(
            VeMayBay.trang_thai_ve != 'Đã hủy'
        ).group_by(
            TuyenBay.ma_sb_di, TuyenBay.ma_sb_den
        ).order_by(func.count(VeMayBay.ma_ve).desc()).limit(5)
        
        route_res = await db.execute(route_query)
        top_routes = []
        for start, end, count, rev in route_res.all():
            top_routes.append({
                "route": f"{start} - {end}",
                "count": count,
                "revenue": float(rev or 0),
                "profit": float(rev or 0) * 0.15,
                "trend": "+5%" # Mock trend for now
            })

        return {
            "kpis": {
                "total_revenue": total_revenue,
                "net_profit": net_profit,
                "total_tickets": total_tickets,
                "cancel_rate": round(cancel_rate, 1)
            },
            "monthly_stats": monthly_stats,
            "airline_share": airline_share,
            "top_routes": top_routes
        }
    except Exception as e:
        logger.error(f"Error generating reports: {e}")
        raise HTTPException(status_code=500, detail=str(e))
