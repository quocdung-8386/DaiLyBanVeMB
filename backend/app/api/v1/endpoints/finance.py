from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import logging

from app.core.database import get_db
from app.models.tai_chinh import ThanhToan
from app.models.nghiep_vu import DatCho

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/payments", response_model=List[dict])
async def get_payments(db: AsyncSession = Depends(get_db)):
    """Fetch all payment transactions."""
    try:
        query = select(ThanhToan, DatCho).join(DatCho, ThanhToan.ma_dat_cho == DatCho.ma_dat_cho)
        result = await db.execute(query)
        payments = []
        for tt, dc in result.all():
            payments.append({
                "id": tt.ma_gd,
                "bookingId": tt.ma_dat_cho,
                "amount": f"{tt.so_tien:,.0f}đ" if tt.so_tien else "0đ",
                "method": tt.phuong_thuc,
                "date": tt.ngay_gd.isoformat() if tt.ngay_gd else None,
                "status": tt.trang_thai,
                "customer": dc.ma_kh # Can join more if needed
            })
        return payments
    except Exception as e:
        logger.error(f"Error fetching payments: {e}")
        raise HTTPException(status_code=500, detail=str(e))
