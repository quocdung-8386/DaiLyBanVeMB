"""
models/chinh_sach.py
Nhóm: Quy tắc & Chính sách (Fare Rules & Policies)
Bảng: QuyTacGiaVe, ChinhSach
"""
from datetime import date
from decimal import Decimal
from sqlalchemy import String, Boolean, Numeric, Date, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class QuyTacGiaVe(Base):
    __tablename__ = "quytacgiave"

    ma_quy_tac: Mapped[str] = mapped_column(String(20), primary_key=True)
    hang_ghe: Mapped[str] = mapped_column(String(30), nullable=False)  # Economy, Business...
    phi_doi_ve: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    duoc_hoan_tien: Mapped[bool] = mapped_column(Boolean, default=False)
    phi_hoan_tien: Mapped[Decimal] = mapped_column(Numeric(18, 2), default=0)
    mo_ta: Mapped[str | None] = mapped_column(Text)


class ChinhSach(Base):
    __tablename__ = "chinhsach"

    ma_cs: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_cs: Mapped[str] = mapped_column(String(100), nullable=False)
    noi_dung: Mapped[str] = mapped_column(Text, nullable=False)
    ngay_ban_hanh: Mapped[date] = mapped_column(Date, server_default=func.current_date())
    trang_thai: Mapped[bool] = mapped_column(Boolean, default=True)
