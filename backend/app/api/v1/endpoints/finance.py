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
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class PaymentCreate(BaseModel):
    booking_id: str
    amount: float
    method: str
    notes: Optional[str] = None

@router.post("/", response_model=dict)
async def create_payment(payment: PaymentCreate, db: AsyncSession = Depends(get_db)):
    """Record a new payment transaction."""
    try:
        import random
        import string
        
        # Generate a transaction ID (PAY_XXX)
        query_tt = select(ThanhToan.ma_gd).where(ThanhToan.ma_gd.like('PAY_%')).order_by(ThanhToan.ma_gd.desc()).limit(1)
        res_tt = await db.execute(query_tt)
        last_tt = res_tt.scalar()
        if last_tt:
            try:
                num_tt = int(last_tt.split('_')[1]) + 1
            except:
                num_tt = 1
        else:
            num_tt = 1
        ma_gd = f"PAY_{num_tt:03d}"
        
        new_tt = ThanhToan(
            ma_gd=ma_gd,
            ma_dat_cho=payment.booking_id,
            phuong_thuc=payment.method,
            so_tien=payment.amount,
            ngay_gd=datetime.now(),
            trang_thai="Hoàn tất"
        )
        db.add(new_tt)
        
        # Also update DatCho status
        stmt = select(DatCho).where(DatCho.ma_dat_cho == payment.booking_id)
        res = await db.execute(stmt)
        dc = res.scalar_one_or_none()
        if dc:
            dc.trang_thai_tt = "Đã thanh toán"
            
        await db.commit()
        return {"success": True, "transactionId": ma_gd}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating payment: {e}")
        raise HTTPException(status_code=500, detail=str(e))
