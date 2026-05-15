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
        query = select(KhachHang, NguoiDung).outerjoin(NguoiDung, KhachHang.ma_kh == NguoiDung.ma_nd)
        result = await db.execute(query)
        customers = []
        for kh, nd in result.all():
            if not kh: continue
            customers.append({
                "id": kh.ma_kh,
                "name": kh.ho_ten,
                "email": nd.email if nd else "N/A",
                "phone": nd.sdt if nd else "N/A",
                "type": kh.loai_khach,
                "points": kh.diem_tich_luy,
                "status": ("Active" if nd.trang_thai_hd else "Inactive") if nd else "N/A"
            })
        return customers
    except Exception as e:
        logger.error(f"Error fetching customers: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/staff", response_model=List[dict])
async def get_staff(db: AsyncSession = Depends(get_db)):
    """Fetch all staff members."""
    try:
        query = select(NhanVien, NguoiDung).outerjoin(NguoiDung, NhanVien.ma_nv == NguoiDung.ma_nd)
        result = await db.execute(query)
        staff = []
        for nv, nd in result.all():
            if not nv: continue
            staff.append({
                "id": nv.ma_nv,
                "username": nd.tai_khoan if nd else "Unknown",
                "email": nd.email if nd else "N/A",
                "phone": nd.sdt if nd else "N/A",
                "department": nv.phong_ban,
                "joinDate": nv.ngay_vao_lam.isoformat() if nv.ngay_vao_lam else None,
                "agency": nv.ma_daily,
                "status": "Hoạt động" if (nd and nd.trang_thai_hd) else "Khóa"
            })
        return staff
    except Exception as e:
        logger.error(f"Error fetching staff: {e}")
        raise HTTPException(status_code=500, detail=str(e))

from pydantic import BaseModel
from datetime import date
from typing import Optional

class StaffCreate(BaseModel):
    username: str
    password: str = "123456" # Default
    email: Optional[str] = None
    phone: Optional[str] = None
    department: Optional[str] = None
    agency: Optional[str] = None

@router.post("/staff", response_model=dict)
async def create_staff(staff: StaffCreate, db: AsyncSession = Depends(get_db)):
    try:
        # Create NguoiDung first
        new_nd = NguoiDung(
            tai_khoan=staff.username,
            mat_khau=staff.password,
            email=staff.email,
            sdt=staff.phone,
            trang_thai_hd=True
        )
        db.add(new_nd)
        await db.flush() # to get ma_nd
        
        # Create NhanVien
        new_nv = NhanVien(
            ma_nv=new_nd.ma_nd,
            phong_ban=staff.department,
            ngay_vao_lam=date.today(),
            ma_daily=staff.agency
        )
        db.add(new_nv)
        await db.commit()
        
        return {
            "id": new_nv.ma_nv,
            "username": new_nd.tai_khoan,
            "department": new_nv.phong_ban,
            "agency": new_nv.ma_daily,
            "status": "Hoạt động"
        }
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating staff: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class StaffUpdate(BaseModel):
    username: Optional[str] = None
    department: Optional[str] = None
    agency: Optional[str] = None
    status: Optional[str] = None

@router.patch("/staff/{id}", response_model=dict)
async def update_staff(id: int, staff_update: StaffUpdate, db: AsyncSession = Depends(get_db)):
    try:
        query_nd = select(NguoiDung).where(NguoiDung.ma_nd == id)
        res_nd = await db.execute(query_nd)
        nd = res_nd.scalar_one_or_none()
        
        query_nv = select(NhanVien).where(NhanVien.ma_nv == id)
        res_nv = await db.execute(query_nv)
        nv = res_nv.scalar_one_or_none()
        
        if not nd or not nv:
            raise HTTPException(status_code=404, detail="Staff not found")
            
        if staff_update.username is not None:
            nd.tai_khoan = staff_update.username
        if staff_update.status is not None:
            nd.trang_thai_hd = (staff_update.status == "Hoạt động")
            
        if staff_update.department is not None:
            nv.phong_ban = staff_update.department
        if staff_update.agency is not None:
            nv.ma_daily = staff_update.agency
            
        await db.commit()
        return {"success": True}
    except HTTPException as he:
        raise he
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating staff: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/staff/{id}")
async def delete_staff(id: int, db: AsyncSession = Depends(get_db)):
    try:
        query = select(NguoiDung).where(NguoiDung.ma_nd == id)
        result = await db.execute(query)
        nd = result.scalar_one_or_none()
        
        if not nd:
            raise HTTPException(status_code=404, detail="Staff not found")
            
        await db.delete(nd) # Cascade should handle NhanVien if configured, otherwise we delete NhanVien manually.
        await db.commit()
        return {"success": True}
    except Exception as e:
        await db.rollback()
        # Manually delete NhanVien first just in case cascade is not set up
        try:
            query_nv = select(NhanVien).where(NhanVien.ma_nv == id)
            res_nv = await db.execute(query_nv)
            nv = res_nv.scalar_one_or_none()
            if nv:
                await db.delete(nv)
            query_nd = select(NguoiDung).where(NguoiDung.ma_nd == id)
            res_nd = await db.execute(query_nd)
            nd = res_nd.scalar_one_or_none()
            if nd:
                await db.delete(nd)
            await db.commit()
            return {"success": True}
        except Exception as inner_e:
            await db.rollback()
            logger.error(f"Error deleting staff: {inner_e}")
            raise HTTPException(status_code=500, detail=str(inner_e))

from app.models.phan_quyen import VaiTro

@router.get("/roles", response_model=List[dict])
async def get_roles(db: AsyncSession = Depends(get_db)):
    try:
        from sqlalchemy import func
        from app.models.phan_quyen import VaiTro_QuyenHan, NguoiDung_VaiTro
        
        # Query roles with user count
        query = select(
            VaiTro, 
            func.count(NguoiDung_VaiTro.ma_nd).label("users_count")
        ).outerjoin(
            NguoiDung_VaiTro, VaiTro.ma_vai_tro == NguoiDung_VaiTro.ma_vai_tro
        ).group_by(VaiTro.ma_vai_tro)
        
        result = await db.execute(query)
        roles = []
        for vt, count in result.all():
            # Get permissions for this role
            perm_query = select(VaiTro_QuyenHan.ma_quyen).where(VaiTro_QuyenHan.ma_vai_tro == vt.ma_vai_tro)
            perm_result = await db.execute(perm_query)
            perms = perm_result.scalars().all()
            
            roles.append({
                "id": vt.ma_vai_tro,
                "name": vt.ten_vai_tro,
                "desc": vt.mo_ta,
                "usersCount": count,
                "permissions": list(perms)
            })
        return roles
    except Exception as e:
        logger.error(f"Error fetching roles: {e}")
        raise HTTPException(status_code=500, detail=str(e))

class RoleCreate(BaseModel):
    id: str
    name: str
    desc: Optional[str] = None
    permissions: List[str] = []

@router.post("/roles", response_model=dict)
async def create_role(role: RoleCreate, db: AsyncSession = Depends(get_db)):
    try:
        from app.models.phan_quyen import VaiTro_QuyenHan
        
        new_role = VaiTro(
            ma_vai_tro=role.id,
            ten_vai_tro=role.name,
            mo_ta=role.desc
        )
        db.add(new_role)
        
        # Add permissions
        for p_id in role.permissions:
            db.add(VaiTro_QuyenHan(ma_vai_tro=role.id, ma_quyen=p_id))
            
        await db.commit()
        return {"success": True, "id": role.id}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error creating role: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/roles/{id}", response_model=dict)
async def update_role(id: str, role_update: RoleCreate, db: AsyncSession = Depends(get_db)):
    try:
        from sqlalchemy import delete
        from app.models.phan_quyen import VaiTro_QuyenHan
        
        query = select(VaiTro).where(VaiTro.ma_vai_tro == id)
        res = await db.execute(query)
        vt = res.scalar_one_or_none()
        if not vt:
            raise HTTPException(status_code=404, detail="Role not found")
            
        vt.ten_vai_tro = role_update.name
        vt.mo_ta = role_update.desc
        
        # Update permissions: delete old and insert new
        await db.execute(delete(VaiTro_QuyenHan).where(VaiTro_QuyenHan.ma_vai_tro == id))
        for p_id in role_update.permissions:
            db.add(VaiTro_QuyenHan(ma_vai_tro=id, ma_quyen=p_id))
            
        await db.commit()
        return {"success": True}
    except Exception as e:
        await db.rollback()
        logger.error(f"Error updating role: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/permissions", response_model=List[dict])
async def get_permissions(db: AsyncSession = Depends(get_db)):
    """Fetch all available permissions."""
    try:
        from app.models.phan_quyen import QuyenHan
        query = select(QuyenHan)
        result = await db.execute(query)
        return [{"id": q.ma_quyen, "label": q.ten_quyen, "desc": q.mo_ta} for q in result.scalars().all()]
    except Exception as e:
        logger.error(f"Error fetching permissions: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/agencies", response_model=List[dict])
async def get_agencies(db: AsyncSession = Depends(get_db)):
    """Fetch all agencies."""
    try:
        from app.models.quan_tri import DaiLy
        query = select(DaiLy)
        result = await db.execute(query)
        return [{"id": d.ma_daily, "name": d.ten_daily} for d in result.scalars().all()]
    except Exception as e:
        logger.error(f"Error fetching agencies: {e}")
        raise HTTPException(status_code=500, detail=str(e))
