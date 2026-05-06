"""
models/phan_quyen.py
Nhóm: Phân quyền động (Roles & Permissions)
Bảng: VaiTro, QuyenHan, VaiTro_QuyenHan, NguoiDung_VaiTro
"""
from sqlalchemy import String, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class VaiTro(Base):
    __tablename__ = "vaitro"

    ma_vai_tro: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_vai_tro: Mapped[str] = mapped_column(String(50), nullable=False)
    mo_ta: Mapped[str | None] = mapped_column(Text)

    # Relationships
    quyen_hans: Mapped[list["VaiTro_QuyenHan"]] = relationship(back_populates="vai_tro")
    nguoi_dungs: Mapped[list["NguoiDung_VaiTro"]] = relationship(back_populates="vai_tro")


class QuyenHan(Base):
    __tablename__ = "quyenhan"

    ma_quyen: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_quyen: Mapped[str] = mapped_column(String(50), nullable=False)
    mo_ta: Mapped[str | None] = mapped_column(Text)

    # Relationships
    vai_tros: Mapped[list["VaiTro_QuyenHan"]] = relationship(back_populates="quyen_han")


class VaiTro_QuyenHan(Base):
    """Bảng trung gian Role – Permission (Composite PK)"""
    __tablename__ = "vaitro_quyenhan"

    ma_vai_tro: Mapped[str] = mapped_column(
        String(20), ForeignKey("vaitro.ma_vai_tro", ondelete="CASCADE"), primary_key=True
    )
    ma_quyen: Mapped[str] = mapped_column(
        String(20), ForeignKey("quyenhan.ma_quyen", ondelete="CASCADE"), primary_key=True
    )

    # Relationships
    vai_tro: Mapped["VaiTro"] = relationship(back_populates="quyen_hans")
    quyen_han: Mapped["QuyenHan"] = relationship(back_populates="vai_tros")


class NguoiDung_VaiTro(Base):
    """Bảng trung gian User – Role (Composite PK)"""
    __tablename__ = "nguoidung_vaitro"

    ma_nd: Mapped[int] = mapped_column(
        Integer, ForeignKey("nguoidung.ma_nd", ondelete="CASCADE"), primary_key=True
    )
    ma_vai_tro: Mapped[str] = mapped_column(
        String(20), ForeignKey("vaitro.ma_vai_tro", ondelete="CASCADE"), primary_key=True
    )

    # Relationships
    nguoi_dung: Mapped["NguoiDung"] = relationship(back_populates="vai_tros")
    vai_tro: Mapped["VaiTro"] = relationship(back_populates="nguoi_dungs")


# Import cuối để tránh circular import
from app.models.quan_tri import NguoiDung
