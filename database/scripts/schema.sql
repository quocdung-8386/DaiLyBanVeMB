-- Database Schema for Airline Ticket Agency Management
-- Khởi tạo Database cho Đại lý vé máy bay

-- ──────────────────────────────────────────
-- Nhóm: Quản trị & Người dùng
-- ──────────────────────────────────────────
CREATE TABLE DaiLy (
    ma_daily VARCHAR(20) PRIMARY KEY,
    ten_daily VARCHAR(100) NOT NULL,
    dia_chi TEXT,
    sdt VARCHAR(15),
    loai_daily VARCHAR(50), -- Ví dụ: Cấp 1, Cấp 2, Chi nhánh nội bộ...
    ngay_dang_ky DATE DEFAULT CURRENT_DATE
);

CREATE TABLE NguoiDung (
    ma_nd SERIAL PRIMARY KEY,
    tai_khoan VARCHAR(50) UNIQUE NOT NULL,
    mat_khau VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    sdt VARCHAR(15),
    trang_thai_hd BOOLEAN DEFAULT TRUE
);

CREATE TABLE NhanVien (
    ma_nv INT PRIMARY KEY REFERENCES NguoiDung(ma_nd),
    phong_ban VARCHAR(50),
    ngay_vao_lam DATE,
    ma_daily VARCHAR(20) REFERENCES DaiLy(ma_daily)
);

CREATE TABLE QuanLy (
    ma_ql INT PRIMARY KEY REFERENCES NhanVien(ma_nv),
    cap_do_ql VARCHAR(30),
    pham_vi_ql TEXT
);

CREATE TABLE KhachHang (
    ma_kh INT PRIMARY KEY REFERENCES NguoiDung(ma_nd),
    ho_ten VARCHAR(100),
    loai_khach VARCHAR(20),
    diem_tich_luy INT DEFAULT 0
);

-- ──────────────────────────────────────────
-- Nhóm: Danh mục & Hành trình
-- ──────────────────────────────────────────
CREATE TABLE HangHangKhong (
    ma_hang VARCHAR(10) PRIMARY KEY,
    ten_hang VARCHAR(100),
    logo VARCHAR(255),
    quoc_gia VARCHAR(50)
);

CREATE TABLE SanBay (
    ma_sb VARCHAR(10) PRIMARY KEY,
    ten_sb VARCHAR(100),
    thanh_pho VARCHAR(50),
    quoc_gia VARCHAR(50)
);

CREATE TABLE TuyenBay (
    ma_tuyen VARCHAR(10) PRIMARY KEY,
    ten_tuyen VARCHAR(100),
    ma_sb_di VARCHAR(10) REFERENCES SanBay(ma_sb),
    ma_sb_den VARCHAR(10) REFERENCES SanBay(ma_sb),
    khoang_cach FLOAT
);

CREATE TABLE ChuyenBay (
    ma_cb VARCHAR(20) PRIMARY KEY,
    ma_tuyen VARCHAR(10) REFERENCES TuyenBay(ma_tuyen),
    ma_hang VARCHAR(10) REFERENCES HangHangKhong(ma_hang),
    ngay_gio_di TIMESTAMP,
    ngay_gio_den TIMESTAMP,
    thoi_gian_bay INT,
    nha_ga VARCHAR(20),
    cong_khoi_hanh VARCHAR(20),
    trang_thai VARCHAR(20) DEFAULT 'Scheduled',
    ma_may_bay VARCHAR(50)
);

-- Bảng lưu chi tiết từng hạng ghế cho chuyến bay
CREATE TABLE ChiTietHangGhe (
    ma_cb VARCHAR(20) REFERENCES ChuyenBay(ma_cb) ON DELETE CASCADE,
    hang_ghe VARCHAR(30), -- Economy, Business, First
    tong_so_ghe INT NOT NULL CHECK (tong_so_ghe >= 0),
    so_ghe_trong INT NOT NULL CHECK (so_ghe_trong >= 0),
    gia_co_ban DECIMAL(18, 2) NOT NULL,
    PRIMARY KEY (ma_cb, hang_ghe)
);

-- Dịch vụ bổ sung (Hành lý, Suất ăn, Wifi...)
CREATE TABLE DichVuBoSung (
    ma_dv VARCHAR(20) PRIMARY KEY,
    ten_dv VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    gia_tien DECIMAL(18, 2) NOT NULL
);

-- ──────────────────────────────────────────
-- Nhóm: Nghiệp vụ Đặt chỗ & Bán vé
-- ──────────────────────────────────────────
CREATE TABLE DatCho (
    ma_dat_cho VARCHAR(20) PRIMARY KEY,
    ma_kh INT REFERENCES KhachHang(ma_kh),
    ma_nv INT REFERENCES NhanVien(ma_nv),
    ngay_dat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tong_tien DECIMAL(18, 2),
    trang_thai_tt VARCHAR(20) DEFAULT 'Cho thanh toan'
);

CREATE TABLE VeMayBay (
    ma_ve VARCHAR(20) PRIMARY KEY,
    ma_dat_cho VARCHAR(20) NOT NULL REFERENCES DatCho(ma_dat_cho) ON DELETE CASCADE,
    ma_cb VARCHAR(20) REFERENCES ChuyenBay(ma_cb),
    ten_hanh_khach VARCHAR(100),
    so_ghe VARCHAR(10),
    hang_ghe VARCHAR(30),
    gia_ve DECIMAL(18, 2),
    trang_thai_ve VARCHAR(20) DEFAULT 'Da xac nhan',
    FOREIGN KEY (ma_cb, hang_ghe) REFERENCES ChiTietHangGhe(ma_cb, hang_ghe)
);

-- Bảng trung gian lưu vé mua kèm dịch vụ gì
CREATE TABLE Ve_DichVu (
    ma_ve VARCHAR(20) REFERENCES VeMayBay(ma_ve) ON DELETE CASCADE,
    ma_dv VARCHAR(20) REFERENCES DichVuBoSung(ma_dv),
    so_luong INT DEFAULT 1,
    tong_tien DECIMAL(18, 2),
    PRIMARY KEY (ma_ve, ma_dv)
);

-- ──────────────────────────────────────────
-- Nhóm: Tài chính & Hóa đơn
-- ──────────────────────────────────────────
CREATE TABLE ThanhToan (
    ma_gd VARCHAR(20) PRIMARY KEY,
    ma_dat_cho VARCHAR(20) UNIQUE REFERENCES DatCho(ma_dat_cho),
    ma_ql_duyet INT REFERENCES QuanLy(ma_ql),
    phuong_thuc VARCHAR(50),
    so_tien DECIMAL(18, 2),
    ngay_gd TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    trang_thai VARCHAR(20) DEFAULT 'Hoan tat'
);

CREATE TABLE HoaDon (
    ma_hd VARCHAR(20) PRIMARY KEY,
    ma_gd VARCHAR(20) UNIQUE REFERENCES ThanhToan(ma_gd),
    so_hoa_don VARCHAR(50),
    ma_so_thue VARCHAR(20),
    ngay_xuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    noi_dung TEXT
);

-- ──────────────────────────────────────────
-- Nhóm: Hệ thống & Audit Log
-- ──────────────────────────────────────────
CREATE TABLE NhatKyHeThong (
    ma_log SERIAL PRIMARY KEY,
    ma_nv INT REFERENCES NhanVien(ma_nv),
    hanh_dong VARCHAR(100) NOT NULL,
    bang_tac_dong VARCHAR(50),
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ghi_chu TEXT
);

-- ──────────────────────────────────────────
-- Nhóm: AI & Hệ thống gợi ý
-- ──────────────────────────────────────────
CREATE TABLE HeThongGoiY (
    ma_goi_y VARCHAR(20) PRIMARY KEY,
    ma_kh INT REFERENCES KhachHang(ma_kh) ON DELETE CASCADE,
    lich_su_tim_kiem JSONB, -- Dùng JSONB chuẩn của PostgreSQL thay cho NVARCHAR(MAX)
    ngay_cap_nhat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────
-- Nhóm: Phân quyền động (Roles & Permissions)
-- ──────────────────────────────────────────
CREATE TABLE VaiTro (
    ma_vai_tro VARCHAR(20) PRIMARY KEY,
    ten_vai_tro VARCHAR(50) NOT NULL,
    mo_ta TEXT
);

CREATE TABLE QuyenHan (
    ma_quyen VARCHAR(20) PRIMARY KEY,
    ten_quyen VARCHAR(50) NOT NULL, -- VD: VIEW_FLIGHT, CANCEL_TICKET
    mo_ta TEXT
);

CREATE TABLE VaiTro_QuyenHan (
    ma_vai_tro VARCHAR(20) REFERENCES VaiTro(ma_vai_tro) ON DELETE CASCADE,
    ma_quyen VARCHAR(20) REFERENCES QuyenHan(ma_quyen) ON DELETE CASCADE,
    PRIMARY KEY (ma_vai_tro, ma_quyen)
);

CREATE TABLE NguoiDung_VaiTro (
    ma_nd INT REFERENCES NguoiDung(ma_nd) ON DELETE CASCADE,
    ma_vai_tro VARCHAR(20) REFERENCES VaiTro(ma_vai_tro) ON DELETE CASCADE,
    PRIMARY KEY (ma_nd, ma_vai_tro)
);

-- ──────────────────────────────────────────
-- Nhóm: Thông báo (Notifications)
-- ──────────────────────────────────────────
CREATE TABLE ThongBao (
    ma_tb SERIAL PRIMARY KEY,
    ma_nd INT REFERENCES NguoiDung(ma_nd) ON DELETE CASCADE,
    tieu_de VARCHAR(200) NOT NULL,
    noi_dung TEXT NOT NULL,
    loai_tb VARCHAR(50), -- VD: HE_THONG, KHACH_HANG, GIAO_DICH
    da_doc BOOLEAN DEFAULT FALSE,
    ngay_tao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────
-- Nhóm: Chương trình tích điểm (Loyalty Program)
-- ──────────────────────────────────────────
CREATE TABLE LichSuTichDiem (
    ma_ls SERIAL PRIMARY KEY,
    ma_kh INT REFERENCES KhachHang(ma_kh) ON DELETE CASCADE,
    loai_gd VARCHAR(20) NOT NULL, -- CỘNG hoặc TRỪ
    so_diem INT NOT NULL,
    ly_do VARCHAR(255),
    ngay_gd TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ──────────────────────────────────────────
-- Nhóm: Quy tắc & Chính sách (Fare Rules & Policies)
-- ──────────────────────────────────────────
CREATE TABLE QuyTacGiaVe (
    ma_quy_tac VARCHAR(20) PRIMARY KEY,
    hang_ghe VARCHAR(30) NOT NULL, -- Economy, Business...
    phi_doi_ve DECIMAL(18, 2) DEFAULT 0,
    duoc_hoan_tien BOOLEAN DEFAULT FALSE,
    phi_hoan_tien DECIMAL(18, 2) DEFAULT 0,
    mo_ta TEXT
);

CREATE TABLE ChinhSach (
    ma_cs VARCHAR(20) PRIMARY KEY,
    ten_cs VARCHAR(100) NOT NULL,
    noi_dung TEXT NOT NULL,
    ngay_ban_hanh DATE DEFAULT CURRENT_DATE,
    trang_thai BOOLEAN DEFAULT TRUE
);
