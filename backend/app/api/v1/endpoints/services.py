from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel
import logging

from app.core.database import get_db
from app.models.danh_muc import DichVuBoSung

router = APIRouter()
logger = logging.getLogger(__name__)

class ServiceResponse(BaseModel):
    ma_dv: str
    ten_dv: str
    mo_ta: str | None
    gia_tien: float

@router.get("/", response_model=List[ServiceResponse])
async def get_services(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(DichVuBoSung))
        services = result.scalars().all()
        return [
            ServiceResponse(
                ma_dv=s.ma_dv,
                ten_dv=s.ten_dv,
                mo_ta=s.mo_ta,
                gia_tien=float(s.gia_tien)
            )
            for s in services
        ]
    except Exception as e:
        logger.error(f"Error fetching services: {e}")
        raise HTTPException(status_code=500, detail=str(e))
