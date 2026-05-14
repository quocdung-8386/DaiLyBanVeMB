"""
models/danh_muc.py
Nhóm: Danh mục & Hành trình
Bảng: HangHangKhong, SanBay, TuyenBay, ChuyenBay, ChiTietHangGhe, DichVuBoSung
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    String, Integer, Float, Numeric, TIMESTAMP, ForeignKey,
    Text, CheckConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class HangHangKhong(Base):
    __tablename__ = "hanghangkhong"

    ma_hang: Mapped[str] = mapped_column(String(10), primary_key=True)
    ten_hang: Mapped[str | None] = mapped_column(String(100))
    logo: Mapped[str | None] = mapped_column(String(255))
    quoc_gia: Mapped[str | None] = mapped_column(String(50))

    # Relationships
    chuyen_bays: Mapped[list["ChuyenBay"]] = relationship(back_populates="hang_hang_khong")


class SanBay(Base):
    __tablename__ = "sanbay"

    ma_sb: Mapped[str] = mapped_column(String(10), primary_key=True)
    ten_sb: Mapped[str | None] = mapped_column(String(100))
    thanh_pho: Mapped[str | None] = mapped_column(String(50))
    quoc_gia: Mapped[str | None] = mapped_column(String(50))

    # Relationships
    tuyen_bays_di: Mapped[list["TuyenBay"]] = relationship(
        foreign_keys="TuyenBay.ma_sb_di", back_populates="san_bay_di"
    )
    tuyen_bays_den: Mapped[list["TuyenBay"]] = relationship(
        foreign_keys="TuyenBay.ma_sb_den", back_populates="san_bay_den"
    )


class TuyenBay(Base):
    __tablename__ = "tuyenbay"

    ma_tuyen: Mapped[str] = mapped_column(String(10), primary_key=True)
    ten_tuyen: Mapped[str | None] = mapped_column(String(100))
    ma_sb_di: Mapped[str | None] = mapped_column(String(10), ForeignKey("sanbay.ma_sb"))
    ma_sb_den: Mapped[str | None] = mapped_column(String(10), ForeignKey("sanbay.ma_sb"))
    khoang_cach: Mapped[float | None] = mapped_column(Float)

    # Relationships
    san_bay_di: Mapped["SanBay | None"] = relationship(
        foreign_keys=[ma_sb_di], back_populates="tuyen_bays_di"
    )
    san_bay_den: Mapped["SanBay | None"] = relationship(
        foreign_keys=[ma_sb_den], back_populates="tuyen_bays_den"
    )
    chuyen_bays: Mapped[list["ChuyenBay"]] = relationship(back_populates="tuyen_bay")


class ChuyenBay(Base):
    __tablename__ = "chuyenbay"

    ma_cb: Mapped[str] = mapped_column(String(20), primary_key=True)
    ma_tuyen: Mapped[str | None] = mapped_column(String(10), ForeignKey("tuyenbay.ma_tuyen"))
    ma_hang: Mapped[str | None] = mapped_column(String(10), ForeignKey("hanghangkhong.ma_hang"))
    ngay_gio_di: Mapped[datetime | None] = mapped_column(TIMESTAMP)
    ngay_gio_den: Mapped[datetime | None] = mapped_column(TIMESTAMP)
    thoi_gian_bay: Mapped[int | None] = mapped_column(Integer)
    nha_ga: Mapped[str | None] = mapped_column(String(20))
    cong_khoi_hanh: Mapped[str | None] = mapped_column(String(20))
    trang_thai: Mapped[str] = mapped_column(String(20), default="Scheduled")
    ma_may_bay: Mapped[str | None] = mapped_column(String(50))

    # Relationships
    tuyen_bay: Mapped["TuyenBay | None"] = relationship(back_populates="chuyen_bays")
    hang_hang_khong: Mapped["HangHangKhong | None"] = relationship(back_populates="chuyen_bays")
    chi_tiet_hang_ghes: Mapped[list["ChiTietHangGhe"]] = relationship(
        back_populates="chuyen_bay", cascade="all, delete-orphan"
    )
    ve_may_bays: Mapped[list["VeMayBay"]] = relationship(back_populates="chuyen_bay")


class ChiTietHangGhe(Base):
    """Lưu chi tiết từng hạng ghế cho chuyến bay (Composite PK)"""
    __tablename__ = "chitiethangghe"
    __table_args__ = (
        CheckConstraint("tong_so_ghe >= 0", name="ck_tong_so_ghe"),
        CheckConstraint("so_ghe_trong >= 0", name="ck_so_ghe_trong"),
    )

    ma_cb: Mapped[str] = mapped_column(
        String(20), ForeignKey("chuyenbay.ma_cb", ondelete="CASCADE"), primary_key=True
    )
    hang_ghe: Mapped[str] = mapped_column(String(30), primary_key=True)
    tong_so_ghe: Mapped[int] = mapped_column(Integer, nullable=False)
    so_ghe_trong: Mapped[int] = mapped_column(Integer, nullable=False)
    gia_co_ban: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)

    # Relationships
    chuyen_bay: Mapped["ChuyenBay"] = relationship(back_populates="chi_tiet_hang_ghes")
    ve_may_bays: Mapped[list["VeMayBay"]] = relationship(
        back_populates="chi_tiet_hang_ghe",
        foreign_keys="[VeMayBay.ma_cb, VeMayBay.hang_ghe]"
    )


class DichVuBoSung(Base):
    __tablename__ = "dichvubosung"

    ma_dv: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_dv: Mapped[str] = mapped_column(String(100), nullable=False)
    mo_ta: Mapped[str | None] = mapped_column(Text)
    gia_tien: Mapped[Decimal] = mapped_column(Numeric(18, 2), nullable=False)

    # Relationships
    ve_dich_vus: Mapped[list["Ve_DichVu"]] = relationship(back_populates="dich_vu")


# Import để tránh circular import
from app.models.nghiep_vu import VeMayBay, Ve_DichVu
