from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import logging

from app.core.database import get_db
from app.models.he_thong import NhatKyHeThong
from app.models.quan_tri import NhanVien, NguoiDung

router = APIRouter()
logger = logging.getLogger(__name__)


class AuditLogCreate(BaseModel):
    hanh_dong: str
    bang_tac_dong: Optional[str] = None
    ghi_chu: Optional[str] = None
    ma_nv: Optional[int] = None


@router.get("/", response_model=List[dict])
async def get_audit_logs(limit: int = 100, db: AsyncSession = Depends(get_db)):
    """Lấy danh sách nhật ký hoạt động hệ thống, mới nhất trước."""
    try:
        query = (
            select(NhatKyHeThong, NguoiDung.tai_khoan)
            .outerjoin(NhanVien, NhatKyHeThong.ma_nv == NhanVien.ma_nv)
            .outerjoin(NguoiDung, NhanVien.ma_nv == NguoiDung.ma_nd)
            .order_by(desc(NhatKyHeThong.thoi_gian))
            .limit(limit)
        )
        result = await db.execute(query)
        logs = []
        for log, username in result.all():
            logs.append({
                "id": f"LOG-{log.ma_log}",
                "ma_log": log.ma_log,
                "user": username or "system",
                "action": log.hanh_dong,
                "module": log.bang_tac_dong or "SYSTEM",
                "target": log.ghi_chu or "-",
                "time": log.thoi_gian.strftime("%H:%M:%S %d/%m") if log.thoi_gian else "",
                "type": _classify_action(log.hanh_dong),
            })
        return logs
    except Exception as e:
        logger.error(f"Error fetching audit logs: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/", response_model=dict)
async def create_audit_log(payload: AuditLogCreate, db: AsyncSession = Depends(get_db)):
    """Ghi một thao tác vào nhật ký hệ thống."""
    try:
        new_log = NhatKyHeThong(
            ma_nv=payload.ma_nv,
            hanh_dong=payload.hanh_dong,
            bang_tac_dong=payload.bang_tac_dong,
            ghi_chu=payload.ghi_chu,
            thoi_gian=datetime.now(),
        )
        db.add(new_log)
        await db.commit()
        await db.refresh(new_log)
        return {"success": True, "id": new_log.ma_log}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating audit log: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def _classify_action(action: str) -> str:
    """Phân loại hành động thành info / warning / danger."""
    action_lower = action.lower()
    danger_keywords = ["xóa", "hủy", "delete", "cancel", "lỗi", "error"]
    warning_keywords = ["hoàn", "đổi", "sửa", "update", "refund", "khóa"]
    for kw in danger_keywords:
        if kw in action_lower:
            return "danger"
    for kw in warning_keywords:
        if kw in action_lower:
            return "warning"
    return "info"
