-- Seed Data for Airline Ticket Agency Management
-- Dữ liệu mẫu đầy đủ cho tất cả các bảng trong hệ thống

-- Xóa dữ liệu cũ nếu có (theo thứ tự ngược lại của khóa ngoại)
TRUNCATE TABLE 
    ChinhSach, QuyTacGiaVe, LichSuTichDiem, ThongBao, NguoiDung_VaiTro, 
    VaiTro_QuyenHan, QuyenHan, VaiTro, HeThongGoiY, NhatKyHeThong, 
    HoaDon, ThanhToan, Ve_DichVu, VeMayBay, DatCho, DichVuBoSung, 
    ChiTietHangGhe, ChuyenBay, TuyenBay, SanBay, HangHangKhong, 
    KhachHang, QuanLy, NhanVien, NguoiDung, DaiLy 
CASCADE;

-- ──────────────────────────────────────────
-- 1. NHÓM: QUẢN TRỊ & NGƯỜI DÙNG
-- ──────────────────────────────────────────

-- Đại lý
INSERT INTO DaiLy (ma_daily, ten_daily, dia_chi, sdt, loai_daily) VALUES 
('DAILY_01', 'Đại lý vé máy bay Skyward - Trụ sở chính', '123 Nguyễn Huệ, Quận 1, TP.HCM', '02838222333', 'Trụ sở chính'),
('DAILY_02', 'Skyward Portal - Chi nhánh Hà Nội', '45 Lý Thường Kiệt, Hoàn Kiếm, Hà Nội', '02439444555', 'Chi nhánh');

-- Người dùng (Passwords are placeholders, in real app should be hashed)
-- ma_nd: 1-2 (Admin/Manager), 3-5 (Staff), 6-10 (Customers)
INSERT INTO NguoiDung (ma_nd, tai_khoan, mat_khau, email, sdt) VALUES 
(1, 'admin', 'pbkdf2_sha256$123456$admin123', 'admin@skyward.com', '0901234567'),
(2, 'manager_dung', 'pbkdf2_sha256$123456$dung123', 'dung.manager@skyward.com', '0912345678'),
(3, 'staff_hoa', 'pbkdf2_sha256$123456$hoa123', 'hoa.staff@skyward.com', '0923456789'),
(4, 'staff_minh', 'pbkdf2_sha256$123456$minh123', 'minh.staff@skyward.com', '0934567890'),
(5, 'staff_lan', 'pbkdf2_sha256$123456$lan123', 'lan.staff@skyward.com', '0945678901'),
(6, 'khach_an', 'pbkdf2_sha256$123456$an123', 'an.nguyen@gmail.com', '0988111222'),
(7, 'khach_binh', 'pbkdf2_sha256$123456$binh123', 'binh.le@gmail.com', '0988222333'),
(8, 'khach_chi', 'pbkdf2_sha256$123456$chi123', 'chi.pham@gmail.com', '0988333444'),
(9, 'khach_duong', 'pbkdf2_sha256$123456$duong123', 'duong.trinh@gmail.com', '0988444555'),
(10, 'khach_em', 'pbkdf2_sha256$123456$em123', 'em.vo@gmail.com', '0988555666');

-- Reset sequence cho NguoiDung
SELECT setval('nguoidung_ma_nd_seq', (SELECT MAX(ma_nd) FROM NguoiDung));

-- Nhân viên
INSERT INTO NhanVien (ma_nv, phong_ban, ngay_vao_lam, ma_daily) VALUES 
(1, 'Quản trị hệ thống', '2025-01-01', 'DAILY_01'),
(2, 'Ban Giám đốc', '2025-01-10', 'DAILY_01'),
(3, 'Phòng Kinh doanh', '2025-02-01', 'DAILY_01'),
(4, 'Phòng Chăm sóc khách hàng', '2025-02-15', 'DAILY_02'),
(5, 'Phòng Kế toán', '2025-03-01', 'DAILY_01');

-- Quản lý
INSERT INTO QuanLy (ma_ql, cap_do_ql, pham_vi_ql) VALUES 
(1, 'Admin', 'Toàn bộ hệ thống và phân quyền'),
(2, 'Manager', 'Quản lý nhân sự và báo cáo tài chính');

-- Khách hàng
INSERT INTO KhachHang (ma_kh, ho_ten, loai_khach, diem_tich_luy) VALUES 
(6, 'Nguyễn Văn An', 'VIP', 5000),
(7, 'Lê Thị Bình', 'Standard', 1200),
(8, 'Phạm Thành Chi', 'Gold', 3500),
(9, 'Trịnh Công Dương', 'Standard', 450),
(10, 'Võ Thị Em', 'Standard', 0);

-- ──────────────────────────────────────────
-- 2. NHÓM: DANH MỤC & HÀNH TRÌNH
-- ──────────────────────────────────────────

-- Hãng hàng không
INSERT INTO HangHangKhong (ma_hang, ten_hang, logo, quoc_gia) VALUES 
('VNA', 'Vietnam Airlines', 'https://upload.wikimedia.org/wikipedia/en/3/3c/Vietnam_Airlines_logo.svg', 'Vietnam'),
('VJ', 'VietJet Air', 'https://upload.wikimedia.org/wikipedia/vi/2/2e/VietJet_Air_logo.svg', 'Vietnam'),
('QH', 'Bamboo Airways', 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Bamboo_Airways_logo.svg', 'Vietnam'),
('VN', 'Vietravel Airlines', 'https://upload.wikimedia.org/wikipedia/vi/b/b3/Vietravel_Airlines_logo.png', 'Vietnam');

-- Sân bay
INSERT INTO SanBay (ma_sb, ten_sb, thanh_pho, quoc_gia) VALUES 
('HAN', 'Sân bay quốc tế Nội Bài', 'Hà Nội', 'Vietnam'),
('SGN', 'Sân bay quốc tế Tân Sơn Nhất', 'TP.HCM', 'Vietnam'),
('DAD', 'Sân bay quốc tế Đà Nẵng', 'Đà Nẵng', 'Vietnam'),
('CXR', 'Sân bay quốc tế Cam Ranh', 'Nha Trang', 'Vietnam'),
('PQC', 'Sân bay quốc tế Phú Quốc', 'Phú Quốc', 'Vietnam'),
('HUI', 'Sân bay quốc tế Phú Bài', 'Huế', 'Vietnam');

-- Tuyến bay
INSERT INTO TuyenBay (ma_tuyen, ten_tuyen, ma_sb_di, ma_sb_den, khoang_cach) VALUES 
('HAN-SGN', 'Hà Nội đi TP.HCM', 'HAN', 'SGN', 1160),
('SGN-HAN', 'TP.HCM đi Hà Nội', 'SGN', 'HAN', 1160),
('SGN-DAD', 'TP.HCM đi Đà Nẵng', 'SGN', 'DAD', 600),
('HAN-DAD', 'Hà Nội đi Đà Nẵng', 'HAN', 'DAD', 630),
('SGN-PQC', 'TP.HCM đi Phú Quốc', 'SGN', 'PQC', 300),
('HAN-PQC', 'Hà Nội đi Phú Quốc', 'HAN', 'PQC', 1200),
('HAN-CXR', 'Hà Nội đi Nha Trang', 'HAN', 'CXR', 1000);

-- Chuyến bay
INSERT INTO ChuyenBay (ma_cb, ma_tuyen, ma_hang, ngay_gio_di, ngay_gio_den, thoi_gian_bay, nha_ga, cong_khoi_hanh, trang_thai) VALUES 
('VN123', 'HAN-SGN', 'VNA', '2026-06-01 08:00:00', '2026-06-01 10:15:00', 135, 'T1', 'Gate 5', 'Scheduled'),
('VJ456', 'SGN-DAD', 'VJ', '2026-06-02 14:00:00', '2026-06-02 15:20:00', 80, 'T2', 'Gate 10', 'Scheduled'),
('QH202', 'HAN-PQC', 'QH', '2026-06-03 09:00:00', '2026-06-03 11:15:00', 135, 'T1', 'Gate 2', 'Scheduled'),
('VN789', 'SGN-HAN', 'VNA', '2026-06-04 20:00:00', '2026-06-04 22:15:00', 135, 'T2', 'Gate 12', 'Scheduled'),
('VU555', 'SGN-PQC', 'VN', '2026-06-05 07:00:00', '2026-06-05 08:05:00', 65, 'T1', 'Gate 3', 'Scheduled');

-- Chi tiết hạng ghế
INSERT INTO ChiTietHangGhe (ma_cb, hang_ghe, tong_so_ghe, so_ghe_trong, gia_co_ban) VALUES 
('VN123', 'Economy', 150, 140, 1500000),
('VN123', 'Business', 20, 18, 4500000),
('VJ456', 'Economy', 180, 160, 800000),
('QH202', 'Economy', 160, 150, 1200000),
('QH202', 'Business', 12, 10, 3800000),
('VN789', 'Economy', 200, 190, 1450000),
('VN789', 'Business', 30, 25, 4200000),
('VU555', 'Economy', 140, 120, 950000);

-- Dịch vụ bổ sung
INSERT INTO DichVuBoSung (ma_dv, ten_dv, mo_ta, gia_tien) VALUES 
('LUG20', 'Hành lý ký gửi 20kg', 'Gói hành lý trả trước 20kg', 250000),
('LUG30', 'Hành lý ký gửi 30kg', 'Gói hành lý trả trước 30kg', 400000),
('MEAL_VN', 'Suất ăn nóng (Vietnamese)', 'Cơm thịt kho tàu + Trái cây', 120000),
('MEAL_EN', 'Suất ăn nóng (Western)', 'Mì Ý sốt bò bằm', 150000),
('WIFI', 'Wifi Premium', 'Truy cập internet tốc độ cao suốt chuyến bay', 100000),
('LOUNGE', 'Phòng chờ thương gia', 'Sử dụng phòng chờ tại sân bay', 500000);

-- ──────────────────────────────────────────
-- 3. NHÓM: NGHIỆP VỤ ĐẶT CHỖ & BÁN VÉ
-- ──────────────────────────────────────────

-- Đặt chỗ
INSERT INTO DatCho (ma_dat_cho, ma_kh, ma_nv, ngay_dat, tong_tien, trang_thai_tt) VALUES 
('BOOK_001', 6, 3, '2026-05-10 10:00:00', 6250000, 'Đã thanh toán'),
('BOOK_002', 7, 3, '2026-05-11 15:30:00', 800000, 'Chờ thanh toán'),
('BOOK_003', 8, 4, '2026-05-12 09:15:00', 4320000, 'Đã thanh toán'),
('BOOK_004', 9, 3, '2026-05-12 11:00:00', 1450000, 'Chờ thanh toán');

-- Vé máy bay
INSERT INTO VeMayBay (ma_ve, ma_dat_cho, ma_cb, ten_hanh_khach, so_ghe, hang_ghe, gia_ve, trang_thai_ve) VALUES 
('VE_001', 'BOOK_001', 'VN123', 'Nguyễn Văn An', '12A', 'Business', 4500000, 'Đã xác nhận'),
('VE_002', 'BOOK_001', 'VN123', 'Trần Thị Thảo', '12B', 'Business', 4500000, 'Đã xác nhận'),
('VE_003', 'BOOK_002', 'VJ456', 'Lê Thị Bình', '25F', 'Economy', 800000, 'Đã xác nhận'),
('VE_004', 'BOOK_003', 'QH202', 'Phạm Thành Chi', '05A', 'Business', 3800000, 'Đã xác nhận'),
('VE_005', 'BOOK_004', 'VN789', 'Trịnh Công Dương', '18C', 'Economy', 1450000, 'Đã xác nhận');

-- Vé & Dịch vụ
INSERT INTO Ve_DichVu (ma_ve, ma_dv, so_luong, tong_tien) VALUES 
('VE_001', 'LUG20', 1, 250000),
('VE_001', 'MEAL_VN', 1, 120000),
('VE_004', 'LOUNGE', 1, 500000),
('VE_004', 'WIFI', 1, 20000);

-- ──────────────────────────────────────────
-- 4. NHÓM: TÀI CHÍNH & HÓA ĐƠN
-- ──────────────────────────────────────────

-- Thanh toán
INSERT INTO ThanhToan (ma_gd, ma_dat_cho, ma_ql_duyet, phuong_thuc, so_tien, ngay_gd, trang_thai) VALUES 
('GD_001', 'BOOK_001', 2, 'Chuyển khoản', 6250000, '2026-05-10 10:15:00', 'Hoàn tất'),
('GD_002', 'BOOK_003', 2, 'Tiền mặt', 4320000, '2026-05-12 09:30:00', 'Hoàn tất');

-- Hóa đơn
INSERT INTO HoaDon (ma_hd, ma_gd, so_hoa_don, ma_so_thue, ngay_xuat, noi_dung) VALUES 
('HD_001', 'GD_001', 'VAT-2026-0001', '0101234567', '2026-05-10 10:20:00', 'Thanh toán vé máy bay đi SGN'),
('HD_002', 'GD_002', 'VAT-2026-0002', '0309876543', '2026-05-12 09:45:00', 'Thanh toán vé máy bay đi PQC');

-- ──────────────────────────────────────────
-- 5. NHÓM: HỆ THỐNG & PHÂN QUYỀN
-- ──────────────────────────────────────────

-- Vai trò
INSERT INTO VaiTro (ma_vai_tro, ten_vai_tro, mo_ta) VALUES 
('ADMIN', 'Quản trị viên', 'Toàn quyền quản lý hệ thống'),
('MANAGER', 'Quản lý', 'Quản lý đại lý, nhân viên và báo cáo'),
('STAFF', 'Nhân viên', 'Bán vé, chăm sóc khách hàng'),
('CUSTOMER', 'Khách hàng', 'Người dùng cuối đặt vé');

-- Quyền hạn
INSERT INTO QuyenHan (ma_quyen, ten_quyen, mo_ta) VALUES 
('SYS_ALL', 'Toàn quyền', 'Quyền cao nhất'),
('FLIGHT_VIEW', 'Xem chuyến bay', 'Xem danh sách và lịch bay'),
('FLIGHT_MANAGE', 'Quản lý chuyến bay', 'Thêm/Sửa/Xóa chuyến bay'),
('TICKET_BOOK', 'Đặt vé', 'Thực hiện đặt chỗ mới'),
('TICKET_CANCEL', 'Hủy vé', 'Hủy yêu cầu đặt chỗ'),
('REPORT_VIEW', 'Xem báo cáo', 'Xem báo cáo doanh thu');

-- Vai trò - Quyền hạn
INSERT INTO VaiTro_QuyenHan (ma_vai_tro, ma_quyen) VALUES 
('ADMIN', 'SYS_ALL'),
('MANAGER', 'FLIGHT_VIEW'),
('MANAGER', 'FLIGHT_MANAGE'),
('MANAGER', 'REPORT_VIEW'),
('STAFF', 'FLIGHT_VIEW'),
('STAFF', 'TICKET_BOOK'),
('STAFF', 'TICKET_CANCEL'),
('CUSTOMER', 'FLIGHT_VIEW'),
('CUSTOMER', 'TICKET_BOOK');

-- Người dùng - Vai trò
INSERT INTO NguoiDung_VaiTro (ma_nd, ma_vai_tro) VALUES 
(1, 'ADMIN'),
(2, 'MANAGER'),
(3, 'STAFF'),
(4, 'STAFF'),
(5, 'STAFF'),
(6, 'CUSTOMER'),
(7, 'CUSTOMER'),
(8, 'CUSTOMER'),
(9, 'CUSTOMER'),
(10, 'CUSTOMER');

-- Nhật ký hệ thống
INSERT INTO NhatKyHeThong (ma_nv, hanh_dong, bang_tac_dong, thoi_gian, ghi_chu) VALUES 
(1, 'LOGIN', 'NguoiDung', '2026-05-12 08:00:00', 'Admin đăng nhập hệ thống'),
(3, 'INSERT', 'DatCho', '2026-05-12 11:00:00', 'Nhân viên Hoa tạo đặt chỗ mới BOOK_004');

-- ──────────────────────────────────────────
-- 6. NHÓM: THÔNG BÁO & AI
-- ──────────────────────────────────────────

-- Thông báo
INSERT INTO ThongBao (ma_nd, tieu_de, noi_dung, loai_tb, da_doc) VALUES 
(1, 'Cảnh báo hệ thống', 'Dung lượng database sắp đầy (85%)', 'HE_THONG', FALSE),
(6, 'Xác nhận đặt chỗ', 'Đặt chỗ BOOK_001 của bạn đã được thanh toán thành công.', 'GIAO_DICH', TRUE),
(7, 'Nhắc nhở thanh toán', 'Vui lòng hoàn tất thanh toán cho BOOK_002 trước 24h hôm nay.', 'KHACH_HANG', FALSE);

-- Hệ thống gợi ý (JSON Data)
INSERT INTO HeThongGoiY (ma_goi_y, ma_kh, lich_su_tim_kiem) VALUES 
('GY_001', 6, '{"recent_searches": ["SGN-HAN", "SGN-DAD"], "preferred_class": "Business", "last_visit": "2026-05-12"}'),
('GY_002', 7, '{"recent_searches": ["HAN-PQC"], "budget_range": [800000, 1500000], "last_visit": "2026-05-11"}');

-- ──────────────────────────────────────────
-- 7. NHÓM: TÍCH ĐIỂM & CHÍNH SÁCH
-- ──────────────────────────────────────────

-- Lịch sử tích điểm
INSERT INTO LichSuTichDiem (ma_kh, loai_gd, so_diem, ly_do) VALUES 
(6, 'CỘNG', 500, 'Tích điểm từ giao dịch GD_001'),
(8, 'CỘNG', 350, 'Tích điểm từ giao dịch GD_002');

-- Quy tắc giá vé
INSERT INTO QuyTacGiaVe (ma_quy_tac, hang_ghe, phi_doi_ve, duoc_hoan_tien, phi_hoan_tien, mo_ta) VALUES 
('RULE_ECON', 'Economy', 350000, FALSE, 0, 'Vé giá rẻ, không được hoàn tiền, đổi vé mất phí'),
('RULE_BUSI', 'Business', 0, TRUE, 150000, 'Hạng thương gia, miễn phí đổi vé, phí hoàn tiền thấp');

-- Chính sách
INSERT INTO ChinhSach (ma_cs, ten_cs, noi_dung, trang_thai) VALUES 
('POL_01', 'Chính sách bảo mật', 'Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng...', TRUE),
('POL_02', 'Điều khoản vận chuyển', 'Quy định về hành lý nguy hiểm và vật phẩm cấm mang lên máy bay...', TRUE);

-- HOÀN TẤT
COMMIT;