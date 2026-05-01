-- Stored Procedures for Airline Ticket Agency Management

-- 1. Procedure Đặt chỗ (Xử lý kiểm tra và trừ chỗ trống theo hạng ghế)
CREATE OR REPLACE PROCEDURE sp_DatCho(
    p_ma_dat_cho VARCHAR,
    p_ma_cb VARCHAR,
    p_hang_ghe VARCHAR,
    p_ma_kh INT,
    p_ma_nv INT,
    p_gia_ve DECIMAL
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_ghe_trong INT;
BEGIN
    -- Kiểm tra số ghế trống hiện tại của hạng ghế
    SELECT so_ghe_trong INTO v_ghe_trong
    FROM ChiTietHangGhe
    WHERE ma_cb = p_ma_cb AND hang_ghe = p_hang_ghe
    FOR UPDATE; -- Khóa row để tránh Race Condition

    IF v_ghe_trong IS NULL THEN
        RAISE EXCEPTION 'Chuyen bay % hoac hang ghe % khong ton tai.', p_ma_cb, p_hang_ghe;
    END IF;

    IF v_ghe_trong <= 0 THEN
        RAISE EXCEPTION 'Da het ghe % tren chuyen bay %.', p_hang_ghe, p_ma_cb;
    END IF;

    -- Thêm bản ghi Đặt chỗ
    INSERT INTO DatCho (ma_dat_cho, ma_kh, ma_nv, tong_tien, trang_thai_tt)
    VALUES (p_ma_dat_cho, p_ma_kh, p_ma_nv, p_gia_ve, 'Cho thanh toan');

    -- Giảm số ghế trống
    UPDATE ChiTietHangGhe 
    SET so_ghe_trong = so_ghe_trong - 1 
    WHERE ma_cb = p_ma_cb AND hang_ghe = p_hang_ghe;
    
    -- Ghi log
    INSERT INTO NhatKyHeThong(ma_nv, hanh_dong, bang_tac_dong, ghi_chu)
    VALUES (p_ma_nv, 'Tao dat cho', 'DatCho', 'Ma Dat Cho: ' || p_ma_dat_cho);

    -- LƯU Ý: Không dùng COMMIT trong Procedure này để giao dịch (Transaction) được quản lý bởi Backend (FastAPI).
END;
$$;


-- 2. Procedure Phê duyệt hoàn tiền (Dành cho Quản lý)
CREATE OR REPLACE PROCEDURE sp_PheDuyetHoanTien(
    p_ma_gd VARCHAR,
    p_ma_ql INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE ThanhToan 
    SET trang_thai = 'Da hoan tien', 
        ma_ql_duyet = p_ma_ql 
    WHERE ma_gd = p_ma_gd;
    
    -- Ghi log
    INSERT INTO NhatKyHeThong(ma_nv, hanh_dong, bang_tac_dong, ghi_chu)
    VALUES ((SELECT ma_nv FROM QuanLy WHERE ma_ql = p_ma_ql), 'Phe duyet hoan tien', 'ThanhToan', 'Ma Giao Dich: ' || p_ma_gd);

    -- LƯU Ý: Không dùng COMMIT
END;
$$;
