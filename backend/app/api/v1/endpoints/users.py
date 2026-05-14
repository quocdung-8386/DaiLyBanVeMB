from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from app.core.database import get_db
from app.models.quan_tri import KhachHang, NhanVien, NguoiDung

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/customers", response_model=List[dict])
async def get_customers(db: AsyncSession = Depends(get_db)):
    """Fetch all customers for the Users/Passengers interface."""
    try:
        query = select(KhachHang, NguoiDung).join(NguoiDung, KhachHang.ma_kh == NguoiDung.ma_nd)
        result = await db.execute(query)
        customers = []
        for kh, nd in result.all():
            customers.append({
                "id": kh.ma_kh,
                "name": kh.ho_ten,
                "email": nd.email,
                "phone": nd.sdt,
                "type": kh.loai_khach,
                "points": kh.diem_tich_luy,
                "status": "Active" if nd.trang_thai_hd else "Inactive"
            })
        return customers
    except Exception as e:
        logger.error(f"Error fetching customers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/staff", response_model=List[dict])
async def get_staff(db: AsyncSession = Depends(get_db)):
    """Fetch all staff members."""
    try:
        query = select(NhanVien, NguoiDung).join(NguoiDung, NhanVien.ma_nv == NguoiDung.ma_nd)
        result = await db.execute(query)
        staff = []
        for nv, nd in result.all():
            staff.append({
                "id": nv.ma_nv,
                "username": nd.tai_khoan,
                "email": nd.email,
                "phone": nd.sdt,
                "department": nv.phong_ban,
                "joinDate": nv.ngay_vao_lam.isoformat() if nv.ngay_vao_lam else None,
                "agency": nv.ma_daily
            })
        return staff
    except Exception as e:
        logger.error(f"Error fetching staff: {e}")
        raise HTTPException(status_code=500, detail=str(e))
