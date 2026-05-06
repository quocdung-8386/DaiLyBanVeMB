"""
models/quan_tri.py
Nhóm: Quản trị & Người dùng
Bảng: DaiLy, NguoiDung, NhanVien, QuanLy, KhachHang
"""
from datetime import date
from sqlalchemy import (
    String, Integer, Boolean, Date, ForeignKey, Text
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class DaiLy(Base):
    __tablename__ = "daily"

    ma_daily: Mapped[str] = mapped_column(String(20), primary_key=True)
    ten_daily: Mapped[str] = mapped_column(String(100), nullable=False)
    dia_chi: Mapped[str | None] = mapped_column(Text)
    sdt: Mapped[str | None] = mapped_column(String(15))
    loai_daily: Mapped[str | None] = mapped_column(String(50))
    ngay_dang_ky: Mapped[date | None] = mapped_column(Date, default=date.today)

    # Relationships
    nhan_viens: Mapped[list["NhanVien"]] = relationship(back_populates="dai_ly")


class NguoiDung(Base):
    __tablename__ = "nguoidung"

    ma_nd: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    tai_khoan: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    mat_khau: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[str | None] = mapped_column(String(100))
    sdt: Mapped[str | None] = mapped_column(String(15))
    trang_thai_hd: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    nhan_vien: Mapped["NhanVien | None"] = relationship(back_populates="nguoi_dung")
    khach_hang: Mapped["KhachHang | None"] = relationship(back_populates="nguoi_dung")
    vai_tros: Mapped[list["NguoiDung_VaiTro"]] = relationship(back_populates="nguoi_dung")
    thong_baos: Mapped[list["ThongBao"]] = relationship(back_populates="nguoi_dung")


class NhanVien(Base):
    __tablename__ = "nhanvien"

    ma_nv: Mapped[int] = mapped_column(
        Integer, ForeignKey("nguoidung.ma_nd"), primary_key=True
    )
    phong_ban: Mapped[str | None] = mapped_column(String(50))
    ngay_vao_lam: Mapped[date | None] = mapped_column(Date)
    ma_daily: Mapped[str | None] = mapped_column(
        String(20), ForeignKey("daily.ma_daily")
    )

    # Relationships
    nguoi_dung: Mapped["NguoiDung"] = relationship(back_populates="nhan_vien")
    dai_ly: Mapped["DaiLy | None"] = relationship(back_populates="nhan_viens")
    quan_ly: Mapped["QuanLy | None"] = relationship(back_populates="nhan_vien")
    dat_chos: Mapped[list["DatCho"]] = relationship(back_populates="nhan_vien")
    nhat_kys: Mapped[list["NhatKyHeThong"]] = relationship(back_populates="nhan_vien")


class QuanLy(Base):
    __tablename__ = "quanly"

    ma_ql: Mapped[int] = mapped_column(
        Integer, ForeignKey("nhanvien.ma_nv"), primary_key=True
    )
    cap_do_ql: Mapped[str | None] = mapped_column(String(30))
    pham_vi_ql: Mapped[str | None] = mapped_column(Text)

    # Relationships
    nhan_vien: Mapped["NhanVien"] = relationship(back_populates="quan_ly")
    thanh_toans: Mapped[list["ThanhToan"]] = relationship(back_populates="quan_ly")


class KhachHang(Base):
    __tablename__ = "khachhang"

    ma_kh: Mapped[int] = mapped_column(
        Integer, ForeignKey("nguoidung.ma_nd"), primary_key=True
    )
    ho_ten: Mapped[str | None] = mapped_column(String(100))
    loai_khach: Mapped[str | None] = mapped_column(String(20))
    diem_tich_luy: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    nguoi_dung: Mapped["NguoiDung"] = relationship(back_populates="khach_hang")
    dat_chos: Mapped[list["DatCho"]] = relationship(back_populates="khach_hang")
    lich_su_tich_diems: Mapped[list["LichSuTichDiem"]] = relationship(back_populates="khach_hang")
    goi_ys: Mapped[list["HeThongGoiY"]] = relationship(back_populates="khach_hang")


# Import cuối để tránh circular import
from app.models.nghiep_vu import DatCho
from app.models.he_thong import NhatKyHeThong, HeThongGoiY
from app.models.tai_chinh import ThanhToan
from app.models.phan_quyen import NguoiDung_VaiTro
from app.models.thong_bao import ThongBao
from app.models.tich_diem import LichSuTichDiem
