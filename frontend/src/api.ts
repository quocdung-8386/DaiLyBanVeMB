const BASE_URL = 'http://localhost:8000/api/v1';

const fetchWithNoCache = async (url: string, options: any = {}) => {
  const ts = new Date().getTime();
  const separator = url.includes('?') ? '&' : '?';
  const finalUrl = `${url}${separator}t=${ts}`;
  return fetch(finalUrl, options);
};

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const res = await fetchWithNoCache(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Lỗi kết nối' }));
      throw new Error(err.detail || 'Đăng nhập thất bại');
    }
    return res.json();
  },
  getMe: async (userId: number) => {
    const res = await fetchWithNoCache(`${BASE_URL}/auth/me/${userId}`);
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return res.json();
  },

  // Flights
  getFlights: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/flights`);
    if (!res.ok) throw new Error('Failed to fetch flights');
    return res.json();
  },
  updateFlight: async (id: string, data: any) => {
    const payload = {
      gate: data.gate || data.cong_khoi_hanh,
      aircraft: data.aircraft || data.ma_may_bay,
      nha_ga: data.nha_ga,
      status: data.status || data.trang_thai,
      price: data.price || data.gia_ve
    };
    const res = await fetchWithNoCache(`${BASE_URL}/flights/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update flight');
    return res.json();
  },
  createFlight: async (data: any) => {
    const today = new Date().toISOString().split('T')[0];
    const payload = {
      ma_cb: data.flight || data.ma_cb,
      ma_tuyen: data.from && data.to ? `${data.from}-${data.to}` : data.ma_tuyen || "HAN-SGN",
      ma_hang: data.code || data.ma_hang || "VN",
      ngay_gio_di: data.dep ? `${today}T${data.dep}:00.000Z` : data.ngay_gio_di || new Date().toISOString(),
      ngay_gio_den: data.arr ? `${today}T${data.arr}:00.000Z` : data.ngay_gio_den || new Date().toISOString(),
      thoi_gian_bay: data.thoi_gian_bay || 120,
      ma_may_bay: data.aircraft || data.ma_may_bay || "Airbus A321",
      trang_thai: data.status || data.trang_thai || "Đang bán vé",
      cong_khoi_hanh: data.gate || data.cong_khoi_hanh || "--",
      nha_ga: data.nha_ga || "T1",
      gia_ve: data.price || data.gia_ve || 1500000,
      cap: data.cap || data.tong_so_ghe || 180
    };
    const res = await fetchWithNoCache(`${BASE_URL}/flights/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(`Failed to create flight: ${errData.detail || res.statusText}`);
    }
    return res.json();
  },
  deleteFlight: async (id: string) => {
    const res = await fetchWithNoCache(`${BASE_URL}/flights/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete flight');
    return res.json();
  },

  // Bookings
  getBookings: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/bookings`);
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },
  createBooking: async (data: any) => {
    const paxData = data.passengers || data.passengersList || [];
    const payload = {
      flight_id: data.flight || data.flight_id,
      customer_name: data.customer || data.customer_name || "Khách vãng lai",
      phone: data.phone || "0900000000",
      email: data.email,
      total_amount: data.tong_tien || (typeof data.total === 'string' ? parseFloat(data.total.replace(/,/g, '')) : data.total) || 0,
      status: data.trang_thai_tt || data.status || "Chờ thanh toán",
      fare_class: data.hang_ghe || data.fareClass || "Economy",
      passengers: paxData.map((p: any) => ({
        name: p.name || p.ten_hanh_khach,
        seat: p.seat || p.so_ghe,
        age_type: p.type || p.age_type || "Người lớn"
      }))
    };
    const res = await fetchWithNoCache(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({ detail: 'Unknown error' }));
      throw new Error(`Failed to create booking: ${errData.detail || res.statusText}`);
    }
    return res.json();
  },
  updateBooking: async (id: string, data: any) => {
    const payload = {
      status: data.trang_thai_tt || data.status,
      badge: data.badge,
      seat: data.seat
    };
    const res = await fetchWithNoCache(`${BASE_URL}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update booking');
    return res.json();
  },
  deleteBooking: async (id: string) => {
    const res = await fetchWithNoCache(`${BASE_URL}/bookings/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete booking');
    return res.json();
  },

  // Dashboard
  getStats: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/dashboard/stats`);
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  // Users/Finance
  getCustomers: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/customers`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    return res.json();
  },
  getStaff: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/staff`);
    if (!res.ok) throw new Error('Failed to fetch staff');
    return res.json();
  },
  createStaff: async (data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create staff');
    return res.json();
  },
  updateStaff: async (id: string, data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/staff/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update staff');
    return res.json();
  },
  deleteStaff: async (id: string) => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/staff/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete staff');
    return res.json();
  },
  getRoles: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/roles`);
    return res.json();
  },
  getPermissions: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/permissions`);
    return res.json();
  },
  getAgencies: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/agencies`);
    return res.json();
  },
  createRole: async (data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/roles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateRole: async (id: string, data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/users/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  getPayments: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/finance/payments`);
    return res.json();
  },
  createPayment: async (data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/finance/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        booking_id: data.ma_dat_cho || data.booking_id,
        method: data.phuong_thuc || data.method || 'Tien mat',
        amount: data.so_tien || data.amount || 0,
        notes: data.noi_dung || data.notes || ''
      }),
    });
    return res.json();
  },

  // ThanhToan: Cập nhật trạng thái thanh toán (dành cho Quản lý hoàn tiền)
  updatePayment: async (ma_gd: string, data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/finance/${ma_gd}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // HoaDon: Xuất hóa đơn
  getInvoices: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/finance/invoices`);
    return res.json();
  },
  createInvoice: async (data: any) => {
    const res = await fetchWithNoCache(`${BASE_URL}/finance/invoices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // HoaDon schema: ma_gd, so_hoa_don, ma_so_thue, noi_dung
      body: JSON.stringify({
        ma_gd: data.ma_gd,             // REFERENCES ThanhToan(ma_gd)
        so_hoa_don: data.so_hoa_don,   // so_hoa_don VARCHAR(50)
        ma_so_thue: data.ma_so_thue,   // ma_so_thue VARCHAR(20)
        noi_dung: data.noi_dung,       // noi_dung TEXT
        ...data
      }),
    });
    return res.json();
  },

  // DichVuBoSung: Lấy danh sách dịch vụ bổ sung
  getServices: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/services`);
    return res.json();
  },

  // Reports
  getReports: async () => {
    const res = await fetchWithNoCache(`${BASE_URL}/reports/full`);
    if (!res.ok) throw new Error('Failed to fetch reports data');
    return res.json();
  },
};
