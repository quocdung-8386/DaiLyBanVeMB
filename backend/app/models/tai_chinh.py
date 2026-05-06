"""
models/tai_chinh.py
Nhóm: Tài chính & Hóa đơn
Bảng: ThanhToan, HoaDon
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Integer, Numeric, TIMESTAMP, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class ThanhToan(Base):
    __tablename__ = "thanhtoan"

    ma_gd: Mapped[str] = mapped_column(String(20), primary_key=True)
    ma_dat_cho: Mapped[str | None] = mapped_column(
        String(20), ForeignKey("datcho.ma_dat_cho"), unique=True
    )
    ma_ql_duyet: Mapped[int | None] = mapped_column(Integer, ForeignKey("quanly.ma_ql"))
    phuong_thuc: Mapped[str | None] = mapped_column(String(50))
    so_tien: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))
    ngay_gd: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    trang_thai: Mapped[str] = mapped_column(String(20), default="Hoan tat")

    # Relationships
    dat_cho: Mapped["DatCho | None"] = relationship(back_populates="thanh_toan")
    quan_ly: Mapped["QuanLy | None"] = relationship(back_populates="thanh_toans")
    hoa_don: Mapped["HoaDon | None"] = relationship(back_populates="thanh_toan")


class HoaDon(Base):
    __tablename__ = "hoadon"

    ma_hd: Mapped[str] = mapped_column(String(20), primary_key=True)
    ma_gd: Mapped[str | None] = mapped_column(
        String(20), ForeignKey("thanhtoan.ma_gd"), unique=True
    )
    so_hoa_don: Mapped[str | None] = mapped_column(String(50))
    ma_so_thue: Mapped[str | None] = mapped_column(String(20))
    ngay_xuat: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    noi_dung: Mapped[str | None] = mapped_column(Text)

    # Relationships
    thanh_toan: Mapped["ThanhToan | None"] = relationship(back_populates="hoa_don")


# Import cuối để tránh circular import
from app.models.nghiep_vu import DatCho
from app.models.quan_tri import QuanLy
