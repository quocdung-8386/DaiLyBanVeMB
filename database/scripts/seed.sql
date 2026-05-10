-- Seed Data for Airline Ticket Agency Management

-- 1. Dữ liệu mẫu Đại lý (Cần tạo trước vì Nhân viên tham chiếu khóa ngoại)
INSERT INTO DaiLy (ma_daily, ten_daily, dia_chi, loai_daily) VALUES 
('DAILY_01', 'Đại lý vé máy bay Skyward - Trụ sở chính', '123 Nguyen Hue, TP.HCM', 'Cấp 1');

-- 2. Dữ liệu mẫu Danh mục Hàng không
INSERT INTO SanBay (ma_sb, ten_sb, thanh_pho, quoc_gia) VALUES 
('HAN', 'Noi Bai International Airport', 'Ha Noi', 'Vietnam'),
('SGN', 'Tan Son Nhat International Airport', 'TP.HCM', 'Vietnam'),
('DAD', 'Da Nang International Airport', 'Da Nang', 'Vietnam'),
('PQC', 'Phu Quoc International Airport', 'Phu Quoc', 'Vietnam'),
('VII', 'Van Don International Airport', 'Quang Ninh', 'Vietnam');

INSERT INTO TuyenBay (ma_tuyen, ten_tuyen, ma_sb_di, ma_sb_den, khoang_cach) VALUES 
('HAN-SGN', 'Ha Noi to TP.HCM', 'HAN', 'SGN', 1160),
('SGN-DAD', 'TP.HCM to Da Nang', 'SGN', 'DAD', 600),
('HAN-PQC', 'Ha Noi to Phu Quoc', 'HAN', 'PQC', 1200),
('SGN-VII', 'TP.HCM to Van Don', 'SGN', 'VII', 1400),
('DAD-HAN', 'Da Nang to Ha Noi', 'DAD', 'HAN', 600);

INSERT INTO HangHangKhong (ma_hang, ten_hang, logo, quoc_gia) VALUES 
('VNA', 'Vietnam Airlines', 'vna_logo.png', 'Vietnam'),
('VJ', 'VietJet Air', 'vj_logo.png', 'Vietnam'),
('QH', 'Bamboo Airways', 'qh_logo.png', 'Vietnam');

-- 3. Dữ liệu mẫu Chuyến bay & Hạng ghế
INSERT INTO ChuyenBay (ma_cb, ma_tuyen, ma_hang, ngay_gio_di, ngay_gio_den, thoi_gian_bay, nha_ga, cong_khoi_hanh, trang_thai) VALUES 
('VN123', 'HAN-SGN', 'VNA', '2026-06-01 08:00:00', '2026-06-01 10:10:00', 130, 'T1', 'Gate 5', 'Scheduled'),
('VJ456', 'SGN-DAD', 'VJ', '2026-06-02 14:00:00', '2026-06-02 15:20:00', 80, 'T2', 'Gate 10', 'Scheduled'),
('QH202', 'HAN-PQC', 'QH', '2026-06-03 09:00:00', '2026-06-03 11:15:00', 135, 'T1', 'Gate 2', 'Scheduled'),
('QH303', 'SGN-VII', 'QH', '2026-06-04 15:00:00', '2026-06-04 17:15:00', 135, 'T1', 'Gate 6', 'Scheduled');

INSERT INTO ChiTietHangGhe (ma_cb, hang_ghe, tong_so_ghe, so_ghe_trong, gia_co_ban) VALUES 
('VN123', 'Economy', 150, 150, 1500000),
('VN123', 'Business', 20, 20, 4500000),
('VN123', 'First Class', 8, 8, 8000000),
('VJ456', 'Economy', 200, 200, 800000),
('VJ456', 'Business', 12, 12, 2500000),
('QH202', 'Economy', 180, 180, 1200000),
('QH202', 'Business', 16, 16, 3500000),
('QH303', 'Economy', 180, 180, 1100000);

-- 4. Dịch vụ bổ sung
INSERT INTO DichVuBoSung (ma_dv, ten_dv, mo_ta, gia_tien) VALUES 
('LUG20', 'Hanh ly ky gui 20kg', 'Goi hanh ly 20kg', 300000),
('MEAL1', 'Suat an nong', 'Suat an chinh tren chuyen bay', 150000),
('WIFI1', 'Wifi chuyen bay', 'Truy cap internet trong suot chuyen bay', 100000);

-- 5. Dữ liệu mẫu Người dùng & Nhân sự
-- (Gán cứng ID = 1, 2 để test dễ dàng hơn)
INSERT INTO NguoiDung (ma_nd, tai_khoan, mat_khau, email, sdt) VALUES 
(1, 'admin_dung', 'hash_pass_123', 'dung@agency.com', '0901234567'),
(2, 'khach_an', 'hash_pass_456', 'an@gmail.com', '0988111222');

-- Cập nhật lại chuỗi SEQUENCE để tránh lỗi khóa chính
SELECT setval('nguoidung_ma_nd_seq', (SELECT MAX(ma_nd) FROM NguoiDung));

INSERT INTO NhanVien (ma_nv, phong_ban, ngay_vao_lam, ma_daily) VALUES 
(1, 'Kinh Doanh', '2026-01-01', 'DAILY_01');

INSERT INTO QuanLy (ma_ql, cap_do_ql, pham_vi_ql) VALUES 
(1, 'Admin', 'Toan He Thong');

INSERT INTO KhachHang (ma_kh, ho_ten, loai_khach, diem_tich_luy) VALUES 
(2, 'Nguyen Van An', 'Standard', 100);