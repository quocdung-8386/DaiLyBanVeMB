"""
models/he_thong.py
Nhóm: Hệ thống & Audit Log + AI Gợi ý
Bảng: NhatKyHeThong, HeThongGoiY
"""
from datetime import datetime
from sqlalchemy import String, Integer, TIMESTAMP, ForeignKey, Text, func
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class NhatKyHeThong(Base):
    """Audit Log ghi lại mọi hành động của nhân viên"""
    __tablename__ = "nhatkyhe_thong"

    ma_log: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ma_nv: Mapped[int | None] = mapped_column(Integer, ForeignKey("nhanvien.ma_nv"))
    hanh_dong: Mapped[str] = mapped_column(String(100), nullable=False)
    bang_tac_dong: Mapped[str | None] = mapped_column(String(50))
    thoi_gian: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    ghi_chu: Mapped[str | None] = mapped_column(Text)

    # Relationships
    nhan_vien: Mapped["NhanVien | None"] = relationship(back_populates="nhat_kys")


class HeThongGoiY(Base):
    """Lưu lịch sử tìm kiếm và gợi ý AI cho khách hàng"""
    __tablename__ = "hethonggoi_y"

    ma_goi_y: Mapped[str] = mapped_column(String(20), primary_key=True)
    ma_kh: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("khachhang.ma_kh", ondelete="CASCADE")
    )
    lich_su_tim_kiem: Mapped[dict | None] = mapped_column(JSONB)  # JSONB native PostgreSQL
    ngay_cap_nhat: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())

    # Relationships
    khach_hang: Mapped["KhachHang | None"] = relationship(back_populates="goi_ys")


# Import cuối để tránh circular import
from app.models.quan_tri import NhanVien, KhachHang
