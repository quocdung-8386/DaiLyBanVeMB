# ✈️ Hệ thống Quản lý Đại lý Bán Vé Máy Bay

<div align="center">

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)
![License](https://img.shields.io/badge/License-MIT-green)

**Hệ thống quản lý toàn diện cho đại lý bán vé máy bay**  
Bao gồm quản lý chuyến bay, đặt chỗ, vé, khách hàng, thanh toán và báo cáo.

</div>

---

## 📋 Mục lục

- [Tổng quan](#-tổng-quan)
- [Tính năng chính](#-tính-năng-chính)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Hướng dẫn cài đặt](#-hướng-dẫn-cài-đặt)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Giao diện hệ thống](#-giao-diện-hệ-thống)
- [API Documentation](#-api-documentation)
- [Đóng góp](#-đóng-góp)

---

## 🌟 Tổng quan

**QL Đại lý bán vé máy bay** là hệ thống phần mềm quản lý nghiệp vụ cho các đại lý bán vé máy bay. Hệ thống hỗ trợ toàn bộ quy trình từ tìm kiếm chuyến bay, đặt chỗ, xuất vé, thu tiền đến báo cáo doanh thu — tất cả trong một giao diện hiện đại, chuyên nghiệp.

---

## 🚀 Tính năng chính

### 📊 Dashboard
- Tổng quan doanh thu, số vé bán, chuyến bay hôm nay
- Biểu đồ thống kê theo thời gian thực
- Thông báo và cảnh báo hệ thống

### ✈️ Quản lý Chuyến bay
- Tìm kiếm chuyến bay theo tuyến, ngày, hạng vé
- Xem thông tin chi tiết: số hiệu, máy bay, sân bay, giờ bay
- Quản lý trạng thái chuyến bay (Hoạt động / Tạm ngừng / Code-share)
- Thêm / sửa / xóa chuyến bay với đầy đủ trường dữ liệu

### 🎟️ Đặt chỗ (Booking)
- Tìm kiếm và chọn chuyến bay
- Nhập thông tin hành khách
- Chọn hạng vé (Economy / Business / First Class)
- Lựa chọn hành lý và dịch vụ bổ sung

### 🎫 Quản lý Vé máy bay
- Danh sách vé đã xuất với trạng thái (Hiệu lực / Đã hủy / Đã hoàn tiền)
- **Boarding Pass** đầy đủ: mã sân bay, cổng soát vé, nhà ga, số ghế, giờ lên máy bay
- **Đổi vé** 2 bước: chọn chuyến mới → xác nhận phí đổi
- Tính phí đổi vé tự động (chênh lệch giá + phí dịch vụ)
- In boarding pass / xuất PDF

### 👥 Quản lý Khách hàng
- Hồ sơ khách hàng: thông tin cá nhân, liên hệ, CCCD/hộ chiếu
- Phân hạng khách hàng (Thường / Silver / Gold / Platinum)
- Lịch sử giao dịch và điểm tích lũy
- Thêm / sửa thông tin khách hàng

### 💳 Thanh toán
- Hỗ trợ nhiều phương thức: VNPay, MoMo, Visa/Mastercard, Tiền mặt
- Lịch sử giao dịch với bộ lọc đa chiều
- Màn hình xác nhận thanh toán thành công
- Xuất & in vé sau thanh toán

### 🏢 Quản lý Hệ thống (Admin)
- **Hãng bay**: Thêm, sửa, xóa hãng hàng không
- **Sân bay**: Quản lý danh sách sân bay theo mã IATA
- **Tuyến bay**: Định nghĩa các tuyến bay hoạt động
- **Chuyến bay**: Lập lịch bay chi tiết (máy bay, ghế, giá, trạng thái)

### 📈 Báo cáo
- Báo cáo doanh thu theo ngày/tuần/tháng
- Thống kê theo tuyến bay, hãng bay, hạng vé
- Xuất báo cáo Excel/PDF

---

## 🛠️ Công nghệ sử dụng

| Tầng | Công nghệ | Phiên bản |
|------|-----------|-----------|
| **Frontend** | Next.js (App Router) | 16.x |
| **UI** | Vanilla CSS, Material Icons | — |
| **Backend** | FastAPI | Latest |
| **Database** | PostgreSQL | 14+ |
| **ORM** | SQLAlchemy + Alembic | Latest |
| **Validation** | Pydantic | v2 |
| **Runtime** | Python | 3.10+ |
| **Package Manager** | npm | 9+ |
| **Container** | Docker + Docker Compose | — |

---

## 📁 Cấu trúc dự án

```
DaiLyBanVeMB/
├── frontend/                        # Next.js 16 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout (Global Design Tokens)
│   │   │   ├── page.tsx             # Home Router & Module Switcher
│   │   │   ├── dashboard/           # Trung tâm Điều hành (Dashboard)
│   │   │   ├── flights/             # Tìm kiếm & Quản lý Chuyến bay
│   │   │   ├── booking/             # Quy trình Đặt chỗ (Booking & Seat Map)
│   │   │   ├── tickets/             # Kho vé (Boarding Pass & Issue)
│   │   │   ├── customers/           # CRM Khách hàng
│   │   │   ├── loyalty/             # Chương trình Thành viên
│   │   │   ├── payments/            # Thanh toán & Lịch sử Giao dịch
│   │   │   ├── reports/             # Báo cáo BI & Doanh thu
│   │   │   ├── ai-admin/            # AI Command Center
│   │   │   ├── audit-log/           # Nhật ký Hoạt động (Traceability)
│   │   │   ├── settings/            # Cấu hình Hệ thống & Hãng bay
│   │   │   ├── users/               # Quản lý Nhân sự & Phân quyền
│   │   │   ├── profile/             # Thông tin Cá nhân
│   │   │   └── refund-management/   # Xử lý Hoàn/Hủy vé
│   │   ├── components/              # Premium Shared Components
│   │   │   ├── AppLayout.tsx        # Enterprise Layout Wrapper
│   │   │   ├── Sidebar.tsx          # Professional Sidebar
│   │   │   ├── Header.tsx           # Dashboard Header
│   │   │   ├── Card.tsx             # Standardized Card Component
│   │   │   └── Button.tsx           # Standardized Button Component
│   │   └── index.css                # Core Design System Tokens
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                         # FastAPI Backend
│   ├── app/
│   │   ├── main.py                  # Entry point
│   │   ├── api/                     # REST Endpoints
│   │   ├── models/                  # DB Models
│   │   └── services/                # Business Logic
│   └── requirements.txt
│
├── database/                        # PostgreSQL Resources
├── docker/                          # Containerization (Dev/Prod)
└── README.md
```


---

## ⚙️ Yêu cầu hệ thống

| Phần mềm | Phiên bản tối thiểu |
|----------|---------------------|
| Node.js  | 18.x trở lên        |
| npm      | 9.x trở lên         |
| Python   | 3.10 trở lên        |
| PostgreSQL | 14 trở lên        |
| Docker (tùy chọn) | 20.x trở lên |

---

## 🔧 Hướng dẫn cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/your-username/DaiLyBanVeMB.git
cd DaiLyBanVeMB
```

### 2. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 3. Cài đặt Backend

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

### 4. Cài đặt Database

```bash
# Tạo database PostgreSQL
psql -U postgres -c "CREATE DATABASE airline_db;"

# Chạy migration
cd backend
alembic upgrade head
```

---

## 🔑 Cấu hình môi trường

Tạo file `.env` ở thư mục gốc:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/airline_db

# Security
SECRET_KEY=your_super_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# App
ENVIRONMENT=development
DEBUG=true
```

> ⚠️ **Lưu ý:** Không commit file `.env` lên git. File này đã được thêm vào `.gitignore`.

---

## ▶️ Chạy ứng dụng

### Chạy thủ công (Development)

**Terminal 1 — Frontend:**
```bash
cd frontend
npm run dev
```
Truy cập: `http://localhost:3000`

**Terminal 2 — Backend:**
```bash
cd backend
.venv\Scripts\activate   # Windows
uvicorn app.main:app --reload --port 8000
```
API: `http://localhost:8000`  
Swagger Docs: `http://localhost:8000/docs`

### Chạy bằng Docker Compose

```bash
# Build và khởi động toàn bộ hệ thống
docker compose -f docker/docker-compose.yml up --build

# Chạy nền
docker compose -f docker/docker-compose.yml up -d
```

| Dịch vụ | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |
| PostgreSQL | localhost:5432 |

---

## 🖥️ Giao diện hệ thống

| Module | Mô tả |
|--------|-------|
| 🏠 Dashboard | Tổng quan KPI, biểu đồ doanh thu |
| ✈️ Chuyến bay | Tìm kiếm, lọc, quản lý lịch bay |
| 📋 Đặt chỗ | Quy trình đặt vé multi-step |
| 🎫 Vé máy bay | Boarding pass, đổi vé, in vé |
| 💳 Thanh toán | Checkout, lịch sử, hóa đơn |
| 👤 Khách hàng | CRM khách hàng, phân hạng |
| ⚙️ Quản lý hệ thống | Hãng bay, sân bay, tuyến bay, chuyến bay |
| 📊 Báo cáo | Thống kê, xuất file |

---

## 📡 API Documentation

Sau khi chạy backend, truy cập tài liệu API tự động:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Các nhóm API chính

| Endpoint | Mô tả |
|----------|-------|
| `GET /api/flights` | Danh sách chuyến bay |
| `POST /api/bookings` | Tạo đặt chỗ mới |
| `GET /api/tickets/{id}` | Chi tiết vé |
| `POST /api/tickets/{id}/change` | Đổi vé |
| `GET /api/customers` | Danh sách khách hàng |
| `POST /api/payments` | Xử lý thanh toán |
| `GET /api/reports/revenue` | Báo cáo doanh thu |

---

## 🧪 Chạy Tests

```bash
cd backend
pytest tests/ -v

# Coverage report
pytest tests/ --cov=app --cov-report=html
```

---

## 🤝 Đóng góp

1. Fork dự án
2. Tạo branch mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m "feat: mô tả tính năng"`
4. Push lên branch: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

### Quy ước commit

| Prefix | Mô tả |
|--------|-------|
| `feat:` | Tính năng mới |
| `fix:` | Sửa lỗi |
| `style:` | Thay đổi UI/CSS |
| `refactor:` | Refactor code |
| `docs:` | Cập nhật tài liệu |
| `test:` | Thêm/sửa tests |

---

## 📄 License

Dự án được phát hành theo giấy phép [MIT](LICENSE).

---

<div align="center">

Được xây dựng với ❤️ cho môn học **Bài tập lớn Python**

**[⬆ Về đầu trang](#️-hệ-thống-quản-lý-đại-lý-bán-vé-máy-bay)**

</div>