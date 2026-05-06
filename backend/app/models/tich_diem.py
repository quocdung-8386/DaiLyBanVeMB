"""
models/tich_diem.py
Nhóm: Chương trình tích điểm (Loyalty Program)
Bảng: LichSuTichDiem
"""
from datetime import datetime
from sqlalchemy import String, Integer, TIMESTAMP, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class LichSuTichDiem(Base):
    __tablename__ = "lichsutich_diem"

    ma_ls: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ma_kh: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("khachhang.ma_kh", ondelete="CASCADE")
    )
    loai_gd: Mapped[str] = mapped_column(String(20), nullable=False)  # CỘNG hoặc TRỪ
    so_diem: Mapped[int] = mapped_column(Integer, nullable=False)
    ly_do: Mapped[str | None] = mapped_column(String(255))
    ngay_gd: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())

    # Relationships
    khach_hang: Mapped["KhachHang | None"] = relationship(back_populates="lich_su_tich_diems")


# Import cuối để tránh circular import
from app.models.quan_tri import KhachHang
