"""
models/nghiep_vu.py
Nhóm: Nghiệp vụ Đặt chỗ & Bán vé
Bảng: DatCho, VeMayBay, Ve_DichVu
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import (
    String, Integer, Numeric, TIMESTAMP, ForeignKey, func, ForeignKeyConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DatCho(Base):
    __tablename__ = "datcho"

    ma_dat_cho: Mapped[str] = mapped_column(String(20), primary_key=True)
    ma_kh: Mapped[int | None] = mapped_column(Integer, ForeignKey("khachhang.ma_kh"))
    ma_nv: Mapped[int | None] = mapped_column(Integer, ForeignKey("nhanvien.ma_nv"))
    ngay_dat: Mapped[datetime] = mapped_column(TIMESTAMP, server_default=func.now())
    tong_tien: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))
    trang_thai_tt: Mapped[str] = mapped_column(String(20), default="Cho thanh toan")

    # Relationships
    khach_hang: Mapped["KhachHang | None"] = relationship(back_populates="dat_chos")
    nhan_vien: Mapped["NhanVien | None"] = relationship(back_populates="dat_chos")
    ve_may_bays: Mapped[list["VeMayBay"]] = relationship(
        back_populates="dat_cho", cascade="all, delete-orphan"
    )
    thanh_toan: Mapped["ThanhToan | None"] = relationship(back_populates="dat_cho")


class VeMayBay(Base):
    __tablename__ = "vemaybay"
    __table_args__ = (
        ForeignKeyConstraint(
            ["ma_cb", "hang_ghe"],
            ["chitiethangghe.ma_cb", "chitiethangghe.hang_ghe"],
        ),
    )

    ma_ve: Mapped[str] = mapped_column(String(20), primary_key=True)
    ma_dat_cho: Mapped[str] = mapped_column(
        String(20), ForeignKey("datcho.ma_dat_cho", ondelete="CASCADE"), nullable=False
    )
    ma_cb: Mapped[str | None] = mapped_column(String(20), ForeignKey("chuyenbay.ma_cb"))
    ten_hanh_khach: Mapped[str | None] = mapped_column(String(100))
    so_ghe: Mapped[str | None] = mapped_column(String(10))
    hang_ghe: Mapped[str | None] = mapped_column(String(30))
    gia_ve: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))
    trang_thai_ve: Mapped[str] = mapped_column(String(20), default="Da xac nhan")

    # Relationships
    dat_cho: Mapped["DatCho"] = relationship(back_populates="ve_may_bays")
    chuyen_bay: Mapped["ChuyenBay | None"] = relationship(back_populates="ve_may_bays")
    chi_tiet_hang_ghe: Mapped["ChiTietHangGhe | None"] = relationship(
        back_populates="ve_may_bays",
        foreign_keys=[ma_cb, hang_ghe],
        primaryjoin="and_(VeMayBay.ma_cb==ChiTietHangGhe.ma_cb, VeMayBay.hang_ghe==ChiTietHangGhe.hang_ghe)"
    )
    dich_vus: Mapped[list["Ve_DichVu"]] = relationship(
        back_populates="ve", cascade="all, delete-orphan"
    )


class Ve_DichVu(Base):
    """Bảng trung gian: vé mua kèm dịch vụ bổ sung (Composite PK)"""
    __tablename__ = "ve_dichvu"

    ma_ve: Mapped[str] = mapped_column(
        String(20), ForeignKey("vemaybay.ma_ve", ondelete="CASCADE"), primary_key=True
    )
    ma_dv: Mapped[str] = mapped_column(
        String(20), ForeignKey("dichvubosung.ma_dv"), primary_key=True
    )
    so_luong: Mapped[int] = mapped_column(Integer, default=1)
    tong_tien: Mapped[Decimal | None] = mapped_column(Numeric(18, 2))

    # Relationships
    ve: Mapped["VeMayBay"] = relationship(back_populates="dich_vus")
    dich_vu: Mapped["DichVuBoSung"] = relationship(back_populates="ve_dich_vus")


# Import để tránh circular import
from app.models.quan_tri import KhachHang, NhanVien
from app.models.danh_muc import ChuyenBay, ChiTietHangGhe, DichVuBoSung
from app.models.tai_chinh import ThanhToan
