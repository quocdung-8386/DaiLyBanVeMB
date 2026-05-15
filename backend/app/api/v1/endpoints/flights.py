from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, func
from typing import List, Optional
import logging
from datetime import datetime
from pydantic import BaseModel

from app.core.database import get_db
from app.models.danh_muc import ChuyenBay, TuyenBay, HangHangKhong, ChiTietHangGhe
from app.models.nghiep_vu import VeMayBay

router = APIRouter()
logger = logging.getLogger(__name__)

class FlightCreate(BaseModel):
    ma_cb: str
    ma_tuyen: str
    ma_hang: str
    ngay_gio_di: str
    ngay_gio_den: str
    thoi_gian_bay: int
    ma_may_bay: Optional[str] = None
    trang_thai: Optional[str] = "Đang bán vé"
    cong_khoi_hanh: Optional[str] = "--"
    nha_ga: Optional[str] = "T1"
    gia_ve: float
    cap: int

class FlightUpdate(BaseModel):
    gate: Optional[str] = None
    aircraft: Optional[str] = None
    nha_ga: Optional[str] = None
    status: Optional[str] = None
    price: Optional[float] = None
    dep_time: Optional[str] = None
    arr_time: Optional[str] = None

@router.get("/", response_model=List[dict])
async def get_flights(db: AsyncSession = Depends(get_db)):
    """Fetch all flights with their route and airline information."""
    try:
        query = select(
            ChuyenBay, TuyenBay, HangHangKhong
        ).outerjoin(
            TuyenBay, ChuyenBay.ma_tuyen == TuyenBay.ma_tuyen
        ).outerjoin(
            HangHangKhong, ChuyenBay.ma_hang == HangHangKhong.ma_hang
        )
        
        result = await db.execute(query)
        flights_data = []
        
        for cb, tb, hhk in result.all():
            if not cb: continue
            
            capacity_query = select(ChiTietHangGhe).where(ChiTietHangGhe.ma_cb == cb.ma_cb)
            cap_result = await db.execute(capacity_query)
            caps = cap_result.scalars().all()
            
            total_cap = sum(c.tong_so_ghe for c in caps) if caps else 180
            
            # Count actual tickets sold from VeMayBay table
            tickets_query = select(func.count(VeMayBay.ma_ve)).where(
                VeMayBay.ma_cb == cb.ma_cb,
                VeMayBay.trang_thai_ve != 'Đã hủy'
            )
            tickets_result = await db.execute(tickets_query)
            seats_sold = tickets_result.scalar() or 0
            
            min_price = float(min(c.gia_co_ban for c in caps)) if caps else 1500000.0
            
            flights_data.append({
                "id": cb.ma_cb,
                "code": hhk.ma_hang if hhk else (cb.ma_hang or "VN"),
                "name": hhk.ten_hang if hhk else "Unknown Airline",
                "flight": cb.ma_cb,
                "aircraft": cb.ma_may_bay or "Airbus A321",
                "dep": cb.ngay_gio_di.strftime("%H:%M") if cb.ngay_gio_di else "00:00",
                "arr": cb.ngay_gio_den.strftime("%H:%M") if cb.ngay_gio_den else "00:00",
                "date": cb.ngay_gio_di.strftime("%Y-%m-%d") if cb.ngay_gio_di else "2023-10-24",
                "from": tb.ma_sb_di if tb else (cb.ma_tuyen.split('-')[0] if cb.ma_tuyen else "HAN"),
                "to": tb.ma_sb_den if tb else (cb.ma_tuyen.split('-')[1] if cb.ma_tuyen and '-' in cb.ma_tuyen else "SGN"),
                "dur": f"{cb.thoi_gian_bay // 60}h {cb.thoi_gian_bay % 60}m" if cb.thoi_gian_bay else "2h 00m",
                "stops": 0,
                "price": min_price,
                "seatsSold": seats_sold,
                "cap": total_cap,
                "status": cb.trang_thai or "Scheduled",
                "gate": cb.cong_khoi_hanh or "--"
            })
            
        return flights_data
    except Exception as e:
        logger.error(f"Error fetching flights: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
async def create_flight(flight: FlightCreate, db: AsyncSession = Depends(get_db)):
    """Create a new flight and its seating details."""
    try:
        new_cb = ChuyenBay(
            ma_cb=flight.ma_cb,
            ma_tuyen=flight.ma_tuyen,
            ma_hang=flight.ma_hang,
            ngay_gio_di=datetime.fromisoformat(flight.ngay_gio_di.replace("Z", "+00:00")).replace(tzinfo=None),
            ngay_gio_den=datetime.fromisoformat(flight.ngay_gio_den.replace("Z", "+00:00")).replace(tzinfo=None),
            thoi_gian_bay=flight.thoi_gian_bay,
            ma_may_bay=flight.ma_may_bay,
            trang_thai=flight.trang_thai,
            cong_khoi_hanh=flight.cong_khoi_hanh,
            nha_ga=flight.nha_ga
        )
        db.add(new_cb)
        await db.flush()
        
        # Create default seating for Economy, Business, First Class
        for hang, multiplier in [('Economy', 1), ('Business', 2.5), ('First Class', 4.5)]:
            new_seat = ChiTietHangGhe(
                ma_cb=flight.ma_cb,
                hang_ghe=hang,
                tong_so_ghe=flight.cap // 3 if flight.cap else 50,
                so_ghe_trong=flight.cap // 3 if flight.cap else 50,
                gia_co_ban=flight.gia_ve * multiplier
            )
            db.add(new_seat)
        
        await db.commit()
        return {"status": "success", "id": flight.ma_cb}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating flight: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{flight_id}", response_model=dict)
async def update_flight(flight_id: str, update_data: FlightUpdate, db: AsyncSession = Depends(get_db)):
    """Update flight details."""
    try:
        stmt = update(ChuyenBay).where(ChuyenBay.ma_cb == flight_id)
        values = {}
        if update_data.gate: values["cong_khoi_hanh"] = update_data.gate
        if update_data.aircraft: values["ma_may_bay"] = update_data.aircraft
        if update_data.nha_ga: values["nha_ga"] = update_data.nha_ga
        if update_data.status: values["trang_thai"] = update_data.status
        
        if values:
            await db.execute(stmt.values(**values))
        
        if update_data.price:
            ve_stmt = update(ChiTietHangGhe).where(ChiTietHangGhe.ma_cb == flight_id).values(gia_co_ban=update_data.price)
            await db.execute(ve_stmt)
            
        await db.commit()
        return {"status": "success", "message": f"Flight {flight_id} updated successfully"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating flight: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{flight_id}", response_model=dict)
async def delete_flight(flight_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a flight."""
    try:
        from sqlalchemy import delete
        # Seating details will be deleted automatically if cascade is set, but let's be explicit if needed
        await db.execute(delete(ChiTietHangGhe).where(ChiTietHangGhe.ma_cb == flight_id))
        await db.execute(delete(ChuyenBay).where(ChuyenBay.ma_cb == flight_id))
        await db.commit()
        return {"status": "success", "message": f"Flight {flight_id} deleted"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting flight: {e}")
        raise HTTPException(status_code=500, detail=str(e))
