"""
models/thong_bao.py
Nhóm: Thông báo (Notifications)
Bảng: ThongBao
"""
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, TIMESTAMP, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ThongBao(Base):
    __tablename__ = "thongbao"

    ma_tb: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ma_nd: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("nguoidung.ma_nd", ondelete="CASCADE")
    )
    tieu_de: Mapped[str] = mapped_column(String(200), nullable=False)
    noi_dung: Mapped[str] = mapped_column(Text, nullable=False)
    loai_tb: Mapped[str | None] = mapped_column(String(50))  # HE_THONG, KHACH_HANG, GIAO_DICH
    da_doc: Mapped[bool] = mapped_column(Boolean, default=False)
    ngay_tao: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())

    # Relationships
    nguoi_dung: Mapped["NguoiDung | None"] = relationship(back_populates="thong_baos")


# Import cuối để tránh circular import
from app.models.quan_tri import NguoiDung
