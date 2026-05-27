"""
endpoints/loyalty.py
CRUD cho chương trình tích điểm: lấy thành viên, điều chỉnh điểm, xem lịch sử
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc, func
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import logging

from app.core.database import get_db
from app.models.quan_tri import KhachHang, NguoiDung
from app.models.tich_diem import LichSuTichDiem

router = APIRouter()
logger = logging.getLogger(__name__)


def _classify_tier(points: int) -> str:
    if points >= 30000:
        return "Platinum"
    elif points >= 10000:
        return "Gold"
    elif points >= 2000:
        return "Silver"
    return "Member"


@router.get("/members", response_model=List[dict])
async def get_loyalty_members(db: AsyncSession = Depends(get_db)):
    """Lấy danh sách thành viên loyalty từ bảng KhachHang."""
    try:
        query = (
            select(KhachHang, NguoiDung)
            .outerjoin(NguoiDung, KhachHang.ma_kh == NguoiDung.ma_nd)
            .order_by(desc(KhachHang.diem_tich_luy))
        )
        result = await db.execute(query)
        members = []
        for kh, nd in result.all():
            if not kh:
                continue
            name = kh.ho_ten or "N/A"
            initials = "".join([w[0].upper() for w in name.split() if w])[:2]
            points = kh.diem_tich_luy or 0
            sdt = nd.sdt if nd and nd.sdt else "Chưa cập nhật"
            members.append({
                "id": f"CUS-{kh.ma_kh:03d}",
                "ma_kh": kh.ma_kh,
                "name": name,
                "tier": _classify_tier(points),
                "points": points,
                "loai_khach": kh.loai_khach,
                "joined": "N/A",
                "initials": initials or "KH",
                "sdt": sdt,
            })
        return members
    except Exception as e:
        logger.error(f"Error fetching loyalty members: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats", response_model=dict)
async def get_loyalty_stats(db: AsyncSession = Depends(get_db)):
    """Thống kê số thành viên theo từng hạng."""
    try:
        result = await db.execute(select(KhachHang.diem_tich_luy))
        all_points = [r[0] or 0 for r in result.all()]
        stats = {"Platinum": 0, "Gold": 0, "Silver": 0, "Member": 0}
        for p in all_points:
            stats[_classify_tier(p)] += 1
        return stats
    except Exception as e:
        logger.error(f"Error fetching loyalty stats: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{ma_kh}", response_model=List[dict])
async def get_points_history(ma_kh: int, db: AsyncSession = Depends(get_db)):
    """Lấy lịch sử tích điểm của một khách hàng."""
    try:
        result = await db.execute(
            select(LichSuTichDiem)
            .where(LichSuTichDiem.ma_kh == ma_kh)
            .order_by(desc(LichSuTichDiem.ngay_gd))
            .limit(50)
        )
        return [
            {
                "id": r.ma_ls,
                "type": r.loai_gd,
                "points": r.so_diem,
                "reason": r.ly_do,
                "date": r.ngay_gd.strftime("%d/%m/%Y %H:%M") if r.ngay_gd else "",
            }
            for r in result.scalars().all()
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class AdjustPointsPayload(BaseModel):
    loai_gd: str  # "CONG" or "TRU"
    so_diem: int
    ly_do: Optional[str] = None


@router.post("/members/{ma_kh}/adjust", response_model=dict)
async def adjust_points(ma_kh: int, payload: AdjustPointsPayload, db: AsyncSession = Depends(get_db)):
    """Cộng hoặc trừ điểm cho thành viên."""
    try:
        result = await db.execute(select(KhachHang).where(KhachHang.ma_kh == ma_kh))
        kh = result.scalar_one_or_none()
        if not kh:
            raise HTTPException(status_code=404, detail="Customer not found")

        delta = payload.so_diem if payload.loai_gd == "CONG" else -payload.so_diem
        kh.diem_tich_luy = max(0, (kh.diem_tich_luy or 0) + delta)

        log = LichSuTichDiem(
            ma_kh=ma_kh,
            loai_gd=payload.loai_gd,
            so_diem=payload.so_diem,
            ly_do=payload.ly_do,
            ngay_gd=datetime.now(),
        )
        db.add(log)
        await db.commit()
        return {
            "success": True,
            "new_points": kh.diem_tich_luy,
            "new_tier": _classify_tier(kh.diem_tich_luy),
        }
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
