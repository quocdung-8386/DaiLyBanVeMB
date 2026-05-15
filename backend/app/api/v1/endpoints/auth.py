from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import Optional
import logging

from app.core.database import get_db
from app.models.quan_tri import NguoiDung, NhanVien, QuanLy, DaiLy

router = APIRouter()
logger = logging.getLogger(__name__)


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(body: LoginRequest, db: AsyncSession = Depends(get_db)):
    """Xác thực người dùng và trả về thông tin hồ sơ."""
    try:
        # Tìm NguoiDung theo tai_khoan hoặc email
        query = select(NguoiDung).where(
            (NguoiDung.tai_khoan == body.username) |
            (NguoiDung.email == body.username)
        )
        result = await db.execute(query)
        nd = result.scalar_one_or_none()

        if not nd:
            raise HTTPException(status_code=401, detail="Tài khoản không tồn tại")

        # So sánh mật khẩu (plain text — dự án demo)
        if nd.mat_khau != body.password:
            raise HTTPException(status_code=401, detail="Mật khẩu không đúng")

        if not nd.trang_thai_hd:
            raise HTTPException(status_code=403, detail="Tài khoản đã bị khóa")

        # Lấy thêm thông tin NhanVien và DaiLy
        nv_query = select(NhanVien).where(NhanVien.ma_nv == nd.ma_nd)
        nv_res = await db.execute(nv_query)
        nv = nv_res.scalar_one_or_none()

        agency_name = None
        if nv and nv.ma_daily:
            dl_query = select(DaiLy).where(DaiLy.ma_daily == nv.ma_daily)
            dl_res = await db.execute(dl_query)
            dl = dl_res.scalar_one_or_none()
            agency_name = dl.ten_daily if dl else nv.ma_daily

        # Kiểm tra vai trò QuanLy
        ql_query = select(QuanLy).where(QuanLy.ma_ql == nd.ma_nd)
        ql_res = await db.execute(ql_query)
        ql = ql_res.scalar_one_or_none()

        role = "Quản lý" if ql else ("Nhân viên" if nv else "Người dùng")

        return {
            "id": nd.ma_nd,
            "username": nd.tai_khoan,
            "email": nd.email or "",
            "phone": nd.sdt or "",
            "fullName": nv.phong_ban and f"{nd.tai_khoan}" or nd.tai_khoan,
            "department": nv.phong_ban if nv else None,
            "agency": agency_name,
            "agencyId": nv.ma_daily if nv else None,
            "role": role,
            "status": "Đang hoạt động",
            "joinDate": nv.ngay_vao_lam.isoformat() if nv and nv.ngay_vao_lam else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/me/{user_id}")
async def get_me(user_id: int, db: AsyncSession = Depends(get_db)):
    """Lấy thông tin người dùng theo ID."""
    try:
        query = select(NguoiDung).where(NguoiDung.ma_nd == user_id)
        result = await db.execute(query)
        nd = result.scalar_one_or_none()

        if not nd:
            raise HTTPException(status_code=404, detail="Không tìm thấy người dùng")

        nv_query = select(NhanVien).where(NhanVien.ma_nv == nd.ma_nd)
        nv_res = await db.execute(nv_query)
        nv = nv_res.scalar_one_or_none()

        agency_name = None
        if nv and nv.ma_daily:
            dl_query = select(DaiLy).where(DaiLy.ma_daily == nv.ma_daily)
            dl_res = await db.execute(dl_query)
            dl = dl_res.scalar_one_or_none()
            agency_name = dl.ten_daily if dl else nv.ma_daily

        ql_query = select(QuanLy).where(QuanLy.ma_ql == nd.ma_nd)
        ql_res = await db.execute(ql_query)
        ql = ql_res.scalar_one_or_none()
        role = "Quản lý" if ql else ("Nhân viên" if nv else "Người dùng")

        return {
            "id": nd.ma_nd,
            "username": nd.tai_khoan,
            "email": nd.email or "",
            "phone": nd.sdt or "",
            "fullName": nd.tai_khoan,
            "department": nv.phong_ban if nv else None,
            "agency": agency_name,
            "agencyId": nv.ma_daily if nv else None,
            "role": role,
            "status": "Đang hoạt động" if nd.trang_thai_hd else "Đã khóa",
            "joinDate": nv.ngay_vao_lam.isoformat() if nv and nv.ngay_vao_lam else None,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get me error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
