from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from typing import List
import logging
from datetime import datetime
import random
import string

from app.core.database import get_db
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.quan_tri import KhachHang
from app.models.danh_muc import ChuyenBay, TuyenBay, HangHangKhong
from app.schemas.booking import BookingCreate, BookingUpdate

router = APIRouter()
logger = logging.getLogger(__name__)

def generate_id(prefix="BK", length=6):
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"{prefix}_{suffix}"

@router.get("/", response_model=List[dict])
async def get_bookings(db: AsyncSession = Depends(get_db)):
    """Fetch all bookings with details."""
    try:
        query = select(
            DatCho, KhachHang, VeMayBay, ChuyenBay, TuyenBay, HangHangKhong
        ).join(
            KhachHang, DatCho.ma_kh == KhachHang.ma_kh
        ).join(
            VeMayBay, DatCho.ma_dat_cho == VeMayBay.ma_dat_cho
        ).join(
            ChuyenBay, VeMayBay.ma_cb == ChuyenBay.ma_cb
        ).join(
            TuyenBay, ChuyenBay.ma_tuyen == TuyenBay.ma_tuyen
        ).join(
            HangHangKhong, ChuyenBay.ma_hang == HangHangKhong.ma_hang
        )

        result = await db.execute(query)
        bookings_data = []
        seen_bookings = set()

        for dc, kh, ve, cb, tb, hhk in result.all():
            if dc.ma_dat_cho in seen_bookings:
                continue
            seen_bookings.add(dc.ma_dat_cho)
            
            status_map = {
                "Đã thanh toán": "success",
                "Chờ thanh toán": "hold",
                "Đã hủy": "danger",
                "Hết hạn": "danger",
                "Đã Void": "default",
                "Yêu cầu hoàn": "warning"
            }
            badge = status_map.get(dc.trang_thai_tt, "default")
            
            bookings_data.append({
                "id": dc.ma_dat_cho,
                "pnr": dc.ma_dat_cho.replace("BK_", "").replace("BOOK_", ""),
                "customer": kh.ho_ten or "Unknown",
                "flight": cb.ma_cb,
                "airline": hhk.ten_hang,
                "from": tb.ma_sb_di,
                "to": tb.ma_sb_den,
                "airportFrom": "Sân bay " + tb.ma_sb_di,
                "airportTo": "Sân bay " + tb.ma_sb_den,
                "date": cb.ngay_gio_di.strftime("%d/%m/%Y") if cb.ngay_gio_di else "N/A",
                "time": cb.ngay_gio_di.strftime("%H:%M") if cb.ngay_gio_di else "N/A",
                "total": f"{dc.tong_tien:,.0f}" if dc.tong_tien else "0",
                "pax": 1,
                "status": dc.trang_thai_tt,
                "badge": badge,
                "type": "Một chiều",
                "timeLimit": cb.ngay_gio_di.isoformat() if cb.ngay_gio_di and badge == "hold" else None,
                "gate": cb.cong_khoi_hanh or "--",
                "terminal": cb.nha_ga or "T1",
                "seat": ve.so_ghe or "--",
                "boarding": cb.ngay_gio_di.strftime("%H:%M") if cb.ngay_gio_di else "N/A"
            })
        return bookings_data
    except Exception as e:
        logger.error(f"Error fetching bookings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db)):
    """Create a new booking."""
    try:
        # 1. Ensure customer exists (or create one)
        # For simplicity, we create a new one or find by name (Better to have customer ID from frontend)
        cust_query = select(KhachHang).where(KhachHang.ho_ten == booking.customer_name)
        cust_result = await db.execute(cust_query)
        kh = cust_result.scalars().first()
        
        if not kh:
            # Create a mock customer if not found
            # In real app, this should be linked to authenticated user
            kh = KhachHang(ho_ten=booking.customer_name, loai_khach="Vãng lai")
            db.add(kh)
            await db.flush()

        # 2. Create DatCho
        booking_id = generate_id("BK")
        new_datcho = DatCho(
            ma_dat_cho=booking_id,
            ma_kh=kh.ma_kh,
            tong_tien=booking.total_amount,
            trang_thai_tt=booking.status
        )
        db.add(new_datcho)

        # 3. Create VeMayBay for each passenger
        for i, pax in enumerate(booking.passengers):
            new_ve = VeMayBay(
                ma_ve=generate_id("VE"),
                ma_dat_cho=booking_id,
                ma_cb=booking.flight_id,
                ten_hanh_khach=pax.name,
                so_ghe=pax.seat,
                hang_ghe=booking.fare_class,
                gia_ve=booking.total_amount / len(booking.passengers)
            )
            db.add(new_ve)

        await db.commit()
        return {"id": booking_id, "status": "success", "message": "Booking created successfully"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{booking_id}", response_model=dict)
async def update_booking(booking_id: str, update_data: BookingUpdate, db: AsyncSession = Depends(get_db)):
    """Update booking status or details."""
    try:
        stmt = update(DatCho).where(DatCho.ma_dat_cho == booking_id)
        
        if update_data.status:
            stmt = stmt.values(trang_thai_tt=update_data.status)
        
        await db.execute(stmt)
        
        if update_data.seat:
            # Update seat for the first ticket in this booking for now
            ve_stmt = update(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id).values(so_ghe=update_data.seat)
            await db.execute(ve_stmt)

        await db.commit()
        return {"status": "success", "message": "Booking updated successfully"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@router.delete("/{booking_id}", response_model=dict)
async def delete_booking(booking_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a booking and its associated tickets."""
    try:
        from sqlalchemy import delete
        # 1. Delete associated tickets first
        await db.execute(delete(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id))
        # 2. Delete the booking
        await db.execute(delete(DatCho).where(DatCho.ma_dat_cho == booking_id))
        
        await db.commit()
        return {"status": "success", "message": f"Booking {booking_id} deleted successfully"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))
