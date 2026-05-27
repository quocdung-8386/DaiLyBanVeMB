from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List
import logging
from datetime import datetime, timedelta
import random
import string

from app.core.database import get_db
from app.models.nghiep_vu import DatCho, VeMayBay
from app.models.quan_tri import KhachHang, NguoiDung
from app.models.danh_muc import ChuyenBay, TuyenBay, HangHangKhong, ChiTietHangGhe
from app.schemas.booking import BookingCreate, BookingUpdate

router = APIRouter()
logger = logging.getLogger(__name__)

# Mapping tên hạng vé từ frontend → tên chuẩn trong DB (chitiethangghe.hang_ghe)
FARE_CLASS_MAP = {
    "economy": "Economy",
    "premium economy": "Premium Economy",
    "business": "Business",
    "first class": "First Class",
    "eco": "Economy",
    "biz": "Business",
}

def normalize_fare_class(fare_class: str | None) -> str:
    """Chuẩn hóa tên hạng vé về đúng giá trị lưu trong DB."""
    if not fare_class:
        return "Economy"
    return FARE_CLASS_MAP.get(fare_class.strip().lower(), fare_class.strip())

# --- UTILS ---
def generate_id(prefix="BK", length=6):
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
    return f"{prefix}_{suffix}"

def get_status_badge(status: str) -> str:
    status_map = {
        "Đã thanh toán": "success",
        "Đã xuất vé": "success",
        "Đã Check-in": "success",
        "Boarded": "success",
        "Chờ thanh toán": "hold",
        "Đã hủy": "danger",
        "Hết hạn": "danger",
        "Đã Void": "default",
        "Yêu cầu hoàn": "warning",
        "Đã hoàn tiền": "warning"
    }
    return status_map.get(status, "default")

# --- ENDPOINTS ---

@router.get("/", response_model=List[dict])
async def get_bookings(db: AsyncSession = Depends(get_db)):
    """Fetch all bookings with comprehensive details and aggregated passengers."""
    try:
        query = select(
            DatCho, KhachHang, VeMayBay, ChuyenBay, TuyenBay, HangHangKhong
        ).outerjoin(
            KhachHang, DatCho.ma_kh == KhachHang.ma_kh
        ).outerjoin(
            VeMayBay, DatCho.ma_dat_cho == VeMayBay.ma_dat_cho
        ).outerjoin(
            ChuyenBay, VeMayBay.ma_cb == ChuyenBay.ma_cb
        ).outerjoin(
            TuyenBay, ChuyenBay.ma_tuyen == TuyenBay.ma_tuyen
        ).outerjoin(
            HangHangKhong, ChuyenBay.ma_hang == HangHangKhong.ma_hang
        ).order_by(DatCho.ngay_dat.desc())

        result = await db.execute(query)
        rows = result.all()
        
        bookings_map = {}
        
        for dc, kh, ve, cb, tb, hhk in rows:
            if not dc: continue
            bid = dc.ma_dat_cho
            
            if bid not in bookings_map:
                badge = get_status_badge(dc.trang_thai_tt)
                
                # Expiry logic
                expiry = None
                if badge == "hold" and dc.ngay_dat:
                    expiry = (dc.ngay_dat + timedelta(hours=24)).isoformat()
                
                bookings_map[bid] = {
                    "id": dc.ma_dat_cho,
                    "pnr": dc.ma_dat_cho.split('_')[-1] if '_' in dc.ma_dat_cho else dc.ma_dat_cho,
                    "customer": kh.ho_ten if kh else "Khách vãng lai",
                    "flight": cb.ma_cb if cb else "N/A",
                    "airline": hhk.ten_hang if hhk else "Vietnam Airlines",
                    "from": tb.ma_sb_di if tb else (cb.ma_tuyen.split('-')[0] if cb and cb.ma_tuyen else "SGN"),
                    "to": tb.ma_sb_den if tb else (cb.ma_tuyen.split('-')[1] if cb and cb.ma_tuyen and '-' in cb.ma_tuyen else "HAN"),
                    "airportFrom": f"Sân bay {tb.ma_sb_di if tb else 'SGN'}",
                    "airportTo": f"Sân bay {tb.ma_sb_den if tb else 'HAN'}",
                    "date": cb.ngay_gio_di.strftime("%d/%m/%Y") if cb and cb.ngay_gio_di else "---",
                    "time": cb.ngay_gio_di.strftime("%H:%M") if cb and cb.ngay_gio_di else "---",
                    "total": f"{dc.tong_tien:,.0f}" if dc.tong_tien else "0",
                    "pax": 0,
                    "status": dc.trang_thai_tt or "Chờ thanh toán",
                    "badge": badge,
                    "type": "Một chiều",
                    "timeLimit": expiry,
                    "gate": (cb.cong_khoi_hanh if cb else "--") or "--",
                    "terminal": (cb.nha_ga if cb and hasattr(cb, 'nha_ga') else "T1") or "T1",
                    "seat": "",
                    "fareClass": "Economy", # Default
                    "bookingDate": dc.ngay_dat.strftime("%d/%m/%Y %H:%M") if dc.ngay_dat else "---",
                    "boarding": (cb.ngay_gio_di - timedelta(minutes=40)).strftime("%H:%M") if cb and cb.ngay_gio_di else "---",
                    "passengersList": []
                }
            
            if ve:
                bookings_map[bid]["pax"] += 1
                if not bookings_map[bid].get("fareClass") or bookings_map[bid]["fareClass"] == "Economy":
                    bookings_map[bid]["fareClass"] = ve.hang_ghe or "Economy"
                bookings_map[bid]["passengersList"].append({
                    "name": ve.ten_hanh_khach,
                    "seat": ve.so_ghe or "--",
                    "type": "Người lớn", # Default
                    "fare_class": ve.hang_ghe or "ECO"
                })
                
                # Aggregated seat display
                seats = [p["seat"] for p in bookings_map[bid]["passengersList"] if p["seat"] != "--"]
                bookings_map[bid]["seat"] = ", ".join(seats) if seats else "--"

        return list(bookings_map.values())
    except Exception as e:
        logger.error(f"Error fetching bookings: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/", response_model=dict)
async def create_booking(booking: BookingCreate, db: AsyncSession = Depends(get_db)):
    """Create a new booking and manage inventory."""
    try:
        # 1. Customer Handling
        cust_query = select(KhachHang).where(KhachHang.ho_ten == booking.customer_name)
        cust_result = await db.execute(cust_query)
        kh = cust_result.scalars().first()
        
        if not kh:
            new_nd = NguoiDung(
                tai_khoan=f"user_{''.join(random.choices(string.digits, k=6))}",
                mat_khau="pbkdf2:sha256:...", 
                trang_thai_hd=True
            )
            db.add(new_nd)
            await db.flush()
            
            kh = KhachHang(ma_kh=new_nd.ma_nd, ho_ten=booking.customer_name, loai_khach="Vãng lai")
            db.add(kh)
            await db.flush()

        # 2. Create DatCho (Booking)
        query_dc = select(DatCho.ma_dat_cho).where(DatCho.ma_dat_cho.like('BOOK_%')).order_by(DatCho.ma_dat_cho.desc()).limit(1)
        res_dc = await db.execute(query_dc)
        last_dc = res_dc.scalar()
        if last_dc:
            try:
                num_dc = int(last_dc.split('_')[1]) + 1
            except:
                num_dc = 1
        else:
            num_dc = 1
        booking_id = f"BOOK_{num_dc:03d}"
        
        new_datcho = DatCho(
            ma_dat_cho=booking_id,
            ma_kh=kh.ma_kh,
            tong_tien=booking.total_amount,
            trang_thai_tt=booking.status or "Chờ thanh toán"
        )
        db.add(new_datcho)

        # 3. Create VeMayBay (Tickets)
        query_ve = select(VeMayBay.ma_ve).where(VeMayBay.ma_ve.like('TKT_%')).order_by(VeMayBay.ma_ve.desc()).limit(1)
        res_ve = await db.execute(query_ve)
        last_ve = res_ve.scalar()
        if last_ve:
            try:
                ve_num = int(last_ve.split('_')[1]) + 1
            except:
                ve_num = 1
        else:
            ve_num = 1

        for pax in booking.passengers:
            new_ve = VeMayBay(
                ma_ve=f"TKT_{ve_num:03d}",
                ma_dat_cho=booking_id,
                ma_cb=booking.flight_id,
                ten_hanh_khach=pax.name.upper(),
                so_ghe=pax.seat,
                hang_ghe=normalize_fare_class(booking.fare_class),
                gia_ve=booking.total_amount / len(booking.passengers) if len(booking.passengers) > 0 else booking.total_amount,
                trang_thai_ve="Đã xác nhận"
            )
            db.add(new_ve)
            ve_num += 1
            
        # 4. Inventory Management
        normalized_fare = normalize_fare_class(booking.fare_class)
        seat_query = select(ChiTietHangGhe).where(
            ChiTietHangGhe.ma_cb == booking.flight_id,
            ChiTietHangGhe.hang_ghe == normalized_fare
        )
        seat_result = await db.execute(seat_query)
        seat_detail = seat_result.scalar_one_or_none()
        
        if seat_detail:
            num_pax = len(booking.passengers)
            if seat_detail.so_ghe_trong < num_pax:
                raise HTTPException(status_code=400, detail="Chuyến bay đã hết chỗ ở hạng vé này.")
            seat_detail.so_ghe_trong -= num_pax
            
        await db.commit()
        return {"id": booking_id, "status": "success", "message": "Đặt chỗ thành công!"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.patch("/{booking_id}", response_model=dict)
async def update_booking(booking_id: str, update_data: BookingUpdate, db: AsyncSession = Depends(get_db)):
    """Cập nhật trạng thái booking bằng SQL trực tiếp để đảm bảo lưu 100%."""
    print(f"\n>>>> [FORCE UPDATE] ID: {booking_id} | MỚI: {update_data.status}")
    
    try:
        # Check current booking status before updating it
        current_booking_query = select(DatCho).where(DatCho.ma_dat_cho == booking_id)
        current_booking_res = await db.execute(current_booking_query)
        dc = current_booking_res.scalar_one_or_none()
        
        if not dc:
            print(f">>>> ❌ KHÔNG TÌM THẤY BOOKING CHO ID: {booking_id}")
            raise HTTPException(status_code=404, detail="Không tìm thấy booking")

        # 1. Cập nhật trạng thái Booking bằng câu lệnh SQL trực tiếp
        if update_data.status:
            cancelled_statuses = ["Đã hủy", "Hết hạn", "Đã Void"]
            # If transitioning to a cancelled status from an active status, restore seats
            if update_data.status in cancelled_statuses and dc.trang_thai_tt not in cancelled_statuses:
                # Retrieve tickets to get flight and class details
                ve_query = select(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id)
                ve_res = await db.execute(ve_query)
                tickets = ve_res.scalars().all()
                if tickets:
                    flight_id = tickets[0].ma_cb
                    fare_class = tickets[0].hang_ghe
                    num_pax = len(tickets)
                    
                    # Restore seats in ChiTietHangGhe
                    await db.execute(update(ChiTietHangGhe).where(
                        ChiTietHangGhe.ma_cb == flight_id,
                        ChiTietHangGhe.hang_ghe == fare_class
                    ).values(so_ghe_trong=ChiTietHangGhe.so_ghe_trong + num_pax))
                    
                    # Set ticket status to "Đã hủy"
                    await db.execute(update(VeMayBay).where(
                        VeMayBay.ma_dat_cho == booking_id
                    ).values(trang_thai_ve="Đã hủy"))

            stmt = update(DatCho).where(DatCho.ma_dat_cho == booking_id).values(trang_thai_tt=update_data.status)
            res = await db.execute(stmt)
            
            # 2. Nếu Xuất vé -> Cập nhật toàn bộ vé thành Đã xác nhận
            if update_data.status in ["Đã xuất vé", "Đã thanh toán"]:
                ve_stmt = update(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id).values(trang_thai_ve="Đã xác nhận")
                await db.execute(ve_stmt)

        # 3. Cập nhật số ghế nếu có
        if update_data.seat:
            ve_seat_stmt = update(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id).values(so_ghe=update_data.seat)
            await db.execute(ve_seat_stmt)

        await db.commit()
        print(f">>>> ✅ ĐÃ LƯU THÀNH CÔNG VÀO DATABASE CHO {booking_id}\n")
        return {"status": "success", "message": "Updated successfully"}
        
    except Exception as e:
        await db.rollback()
        print(f">>>> 💥 LỖI SQL: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
        
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error(f"💥 Lỗi nghiêm trọng khi cập nhật booking: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{booking_id}", response_model=dict)
async def delete_booking(booking_id: str, db: AsyncSession = Depends(get_db)):
    """Delete a booking and restore inventory if it wasn't already canceled."""
    try:
        # Load tickets to restore seats
        ve_query = select(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id)
        ve_res = await db.execute(ve_query)
        tickets = ve_res.scalars().all()
        
        # Load booking to check status
        dc_query = select(DatCho).where(DatCho.ma_dat_cho == booking_id)
        dc_res = await db.execute(dc_query)
        dc = dc_res.scalar_one_or_none()
        
        if dc and dc.trang_thai_tt not in ["Đã hủy", "Hết hạn"] and tickets:
            # Restore seats
            flight_id = tickets[0].ma_cb
            fare_class = tickets[0].hang_ghe
            num_pax = len(tickets)
            await db.execute(update(ChiTietHangGhe).where(
                ChiTietHangGhe.ma_cb == flight_id,
                ChiTietHangGhe.hang_ghe == fare_class
            ).values(so_ghe_trong=ChiTietHangGhe.so_ghe_trong + num_pax))

        # Delete tickets then booking
        await db.execute(delete(VeMayBay).where(VeMayBay.ma_dat_cho == booking_id))
        await db.execute(delete(DatCho).where(DatCho.ma_dat_cho == booking_id))
        
        await db.commit()
        return {"status": "success", "message": "Xóa booking thành công!"}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error deleting booking: {e}")
        raise HTTPException(status_code=500, detail=str(e))
