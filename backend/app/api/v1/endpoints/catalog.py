"""
endpoints/catalog.py
CRUD cho HangHangKhong (Airlines), SanBay (Airports), TuyenBay (Routes)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional
from pydantic import BaseModel
import logging

from app.core.database import get_db
from app.models.danh_muc import HangHangKhong, SanBay, TuyenBay

router = APIRouter()
logger = logging.getLogger(__name__)


# ─── AIRLINES (HangHangKhong) ──────────────────────────────────────────────

class AirlineCreate(BaseModel):
    ma_hang: str
    ten_hang: str
    quoc_gia: Optional[str] = "Vietnam"
    logo: Optional[str] = None

class AirlineUpdate(BaseModel):
    ten_hang: Optional[str] = None
    quoc_gia: Optional[str] = None
    logo: Optional[str] = None


@router.get("/airlines", response_model=List[dict])
async def get_airlines(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(HangHangKhong))
        return [
            {
                "id": r.ma_hang,
                "iata": r.ma_hang,
                "name": r.ten_hang or "",
                "country": r.quoc_gia or "Vietnam",
                "logo": r.logo,
                "status": "active",
                "type": "Full Service",
            }
            for r in result.scalars().all()
        ]
    except Exception as e:
        logger.error(f"Error fetching airlines: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/airlines", response_model=dict)
async def create_airline(data: AirlineCreate, db: AsyncSession = Depends(get_db)):
    try:
        obj = HangHangKhong(
            ma_hang=data.ma_hang.upper(),
            ten_hang=data.ten_hang,
            quoc_gia=data.quoc_gia,
            logo=data.logo,
        )
        db.add(obj)
        await db.commit()
        return {"success": True, "id": obj.ma_hang}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/airlines/{id}", response_model=dict)
async def update_airline(id: str, data: AirlineUpdate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(HangHangKhong).where(HangHangKhong.ma_hang == id))
        obj = result.scalar_one_or_none()
        if not obj:
            raise HTTPException(status_code=404, detail="Airline not found")
        if data.ten_hang is not None:
            obj.ten_hang = data.ten_hang
        if data.quoc_gia is not None:
            obj.quoc_gia = data.quoc_gia
        if data.logo is not None:
            obj.logo = data.logo
        await db.commit()
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/airlines/{id}", response_model=dict)
async def delete_airline(id: str, db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(HangHangKhong).where(HangHangKhong.ma_hang == id))
        await db.commit()
        return {"success": True}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ─── AIRPORTS (SanBay) ─────────────────────────────────────────────────────

class AirportCreate(BaseModel):
    ma_sb: str
    ten_sb: str
    thanh_pho: Optional[str] = None
    quoc_gia: Optional[str] = "Vietnam"

class AirportUpdate(BaseModel):
    ten_sb: Optional[str] = None
    thanh_pho: Optional[str] = None
    quoc_gia: Optional[str] = None


@router.get("/airports", response_model=List[dict])
async def get_airports(db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(SanBay))
        return [
            {
                "id": r.ma_sb,
                "code": r.ma_sb,
                "name": r.ten_sb or "",
                "city": r.thanh_pho or "",
                "country": r.quoc_gia or "Vietnam",
                "terminals": "T1",
                "status": "active",
            }
            for r in result.scalars().all()
        ]
    except Exception as e:
        logger.error(f"Error fetching airports: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/airports", response_model=dict)
async def create_airport(data: AirportCreate, db: AsyncSession = Depends(get_db)):
    try:
        obj = SanBay(
            ma_sb=data.ma_sb.upper(),
            ten_sb=data.ten_sb,
            thanh_pho=data.thanh_pho,
            quoc_gia=data.quoc_gia,
        )
        db.add(obj)
        await db.commit()
        return {"success": True, "id": obj.ma_sb}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/airports/{id}", response_model=dict)
async def update_airport(id: str, data: AirportUpdate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(SanBay).where(SanBay.ma_sb == id))
        obj = result.scalar_one_or_none()
        if not obj:
            raise HTTPException(status_code=404, detail="Airport not found")
        if data.ten_sb is not None:
            obj.ten_sb = data.ten_sb
        if data.thanh_pho is not None:
            obj.thanh_pho = data.thanh_pho
        if data.quoc_gia is not None:
            obj.quoc_gia = data.quoc_gia
        await db.commit()
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/airports/{id}", response_model=dict)
async def delete_airport(id: str, db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(SanBay).where(SanBay.ma_sb == id))
        await db.commit()
        return {"success": True}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


# ─── ROUTES (TuyenBay) ─────────────────────────────────────────────────────

class RouteCreate(BaseModel):
    ma_tuyen: str
    ten_tuyen: Optional[str] = None
    ma_sb_di: str
    ma_sb_den: str
    khoang_cach: Optional[float] = None

class RouteUpdate(BaseModel):
    ten_tuyen: Optional[str] = None
    khoang_cach: Optional[float] = None


@router.get("/routes", response_model=List[dict])
async def get_routes(db: AsyncSession = Depends(get_db)):
    try:
        query = (
            select(TuyenBay, SanBay, SanBay)
            .outerjoin(SanBay, TuyenBay.ma_sb_di == SanBay.ma_sb)
        )
        result = await db.execute(select(TuyenBay))
        routes = []
        for r in result.scalars().all():
            dist = r.khoang_cach
            dur_min = int(dist / 800 * 60) if dist else 120
            routes.append({
                "id": r.ma_tuyen,
                "from": r.ma_sb_di or "",
                "to": r.ma_sb_den or "",
                "name": r.ten_tuyen or f"{r.ma_sb_di}-{r.ma_sb_den}",
                "distance": f"{int(dist):,} km" if dist else "N/A",
                "duration": f"{dur_min // 60}h {dur_min % 60}m",
                "type": "Quốc tế" if r.khoang_cach and r.khoang_cach > 2000 else "Nội địa",
                "status": "active",
            })
        return routes
    except Exception as e:
        logger.error(f"Error fetching routes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/routes", response_model=dict)
async def create_route(data: RouteCreate, db: AsyncSession = Depends(get_db)):
    try:
        obj = TuyenBay(
            ma_tuyen=data.ma_tuyen.upper(),
            ten_tuyen=data.ten_tuyen or f"{data.ma_sb_di}-{data.ma_sb_den}",
            ma_sb_di=data.ma_sb_di.upper(),
            ma_sb_den=data.ma_sb_den.upper(),
            khoang_cach=data.khoang_cach,
        )
        db.add(obj)
        await db.commit()
        return {"success": True, "id": obj.ma_tuyen}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/routes/{id}", response_model=dict)
async def update_route(id: str, data: RouteUpdate, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(TuyenBay).where(TuyenBay.ma_tuyen == id))
        obj = result.scalar_one_or_none()
        if not obj:
            raise HTTPException(status_code=404, detail="Route not found")
        if data.ten_tuyen is not None:
            obj.ten_tuyen = data.ten_tuyen
        if data.khoang_cach is not None:
            obj.khoang_cach = data.khoang_cach
        await db.commit()
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/routes/{id}", response_model=dict)
async def delete_route(id: str, db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(delete(TuyenBay).where(TuyenBay.ma_tuyen == id))
        await db.commit()
        return {"success": True}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
