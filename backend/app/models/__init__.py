"""
models/__init__.py
Export tất cả models để Alembic và init_db có thể import
"""
from app.models.quan_tri import DaiLy, NguoiDung, NhanVien, QuanLy, KhachHang
from app.models.danh_muc import HangHangKhong, SanBay, TuyenBay, ChuyenBay, ChiTietHangGhe, DichVuBoSung
from app.models.nghiep_vu import DatCho, VeMayBay, Ve_DichVu
from app.models.tai_chinh import ThanhToan, HoaDon
from app.models.he_thong import NhatKyHeThong, HeThongGoiY
from app.models.phan_quyen import VaiTro, QuyenHan, VaiTro_QuyenHan, NguoiDung_VaiTro
from app.models.thong_bao import ThongBao
from app.models.tich_diem import LichSuTichDiem
from app.models.chinh_sach import QuyTacGiaVe, ChinhSach

__all__ = [
    "DaiLy", "NguoiDung", "NhanVien", "QuanLy", "KhachHang",
    "HangHangKhong", "SanBay", "TuyenBay", "ChuyenBay", "ChiTietHangGhe", "DichVuBoSung",
    "DatCho", "VeMayBay", "Ve_DichVu",
    "ThanhToan", "HoaDon",
    "NhatKyHeThong", "HeThongGoiY",
    "VaiTro", "QuyenHan", "VaiTro_QuyenHan", "NguoiDung_VaiTro",
    "ThongBao",
    "LichSuTichDiem",
    "QuyTacGiaVe", "ChinhSach",
]
