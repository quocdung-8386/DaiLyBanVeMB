# ✈️ Skyward Portal - Hệ thống Quản lý Đại lý Bán Vé Máy Bay

<div align="center">

![Next.js](https://img.shields.io/badge/Frontend-Next.js%2016-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-316192?logo=postgresql)
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python)
![License](https://img.shields.io/badge/License-MIT-green)

**Nền tảng Quản lý Hàng không chuyên nghiệp (Ticket-Centric Airline Management)**  
Giao diện UI/UX hiện đại (Dark-Navy Aesthetic), tập trung vào vòng đời vé, quy trình đặt chỗ và vận hành đại lý.

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

**Skyward Portal** là phiên bản nâng cấp toàn diện của Hệ thống Quản lý Đại lý Bán Vé Máy Bay, chuyển đổi từ mô hình CRM truyền thống sang kiến trúc **Ticket-Centric** (Lấy vé làm trung tâm). Hệ thống mang lại trải nghiệm chuyên nghiệp, mượt mà với giao diện Dark-Navy cao cấp, tối ưu hóa cho tốc độ và khả năng phản hồi.

Hệ thống hỗ trợ toàn bộ quy trình: từ tìm kiếm chuyến bay, thao tác đặt chỗ đa bước (multi-step booking), xuất vé, quản lý hành khách cho đến thanh toán và báo cáo doanh thu.

---

## 🚀 Tính năng chính

### 📊 Dashboard (Trung tâm Điều hành)
- Tổng quan doanh thu, số vé bán, chuyến bay hôm nay.
- Biểu đồ thống kê theo thời gian thực (Real-time Analytics).
- Giao diện Card hiện đại mang phong cách chuyên nghiệp.

### ✈️ Quản lý Chuyến bay (Flights)
- Tìm kiếm chuyến bay theo tuyến, ngày, hạng vé.
- Xem thông tin chi tiết: số hiệu, máy bay, sân bay, giờ bay.
- Quản lý trạng thái chuyến bay chuyên sâu (Hoạt động / Tạm ngừng / Code-share).

### 🎟️ Quy trình Đặt chỗ (Booking)
- Trải nghiệm đặt chỗ liền mạch với quy trình đa bước.
- Lựa chọn sơ đồ ghế ngồi (Seat Map).
- Nhập thông tin hành khách linh hoạt, hỗ trợ đặt cho nhiều người cùng lúc.

### 🎫 Quản lý Vé (Tickets - Core Module)
- **Ticket-Centric Workflow**: Mọi giao dịch, hành khách, dịch vụ đều xoay quanh vòng đời của Vé.
- Quản lý Boarding Pass đầy đủ thông tin: mã sân bay, cổng soát vé, nhà ga, số ghế.
- Đổi vé, tính phí tự động, xuất PDF & In vé trực tiếp từ hệ thống.

### 👥 Quản lý Hành khách & Khách hàng (Passengers & Customers)
- Quản lý chi tiết Hành khách (Passengers) đi kèm vé.
- Quản lý Khách hàng / Đại lý (Customers / Bookers) thực hiện thanh toán.
- Hồ sơ chi tiết: thông tin cá nhân, CCCD/Hộ chiếu, hạng thành viên.

### 💳 Thanh toán (Payments)
- Hỗ trợ đa phương thức: VNPay, MoMo, Visa/Mastercard, Tiền mặt.
- Đồng bộ tự động trạng thái thanh toán và xuất vé ngay khi hoàn tất.
- Lịch sử giao dịch chi tiết, cho phép lọc đa chiều và kiểm tra đối soát.

---

## 🛠️ Công nghệ sử dụng

| Tầng | Công nghệ | Phiên bản |
|------|-----------|-----------|
| **Frontend** | Next.js (App Router) | 16.x |
| **UI/UX** | Vanilla CSS, Modern Dark-Navy Aesthetic | — |
| **Backend** | FastAPI | Latest |
| **Database** | PostgreSQL | 14+ |
| **ORM** | SQLAlchemy + Alembic | Latest |
| **Validation** | Pydantic | v2 |
| **Runtime** | Python | 3.10+ |

---

## 📁 Cấu trúc dự án

Kiến trúc thư mục được quy hoạch chuẩn mực theo mô hình App Router của Next.js 16:

```text
DaiLyBanVeMB/
├── frontend/                        # Next.js 16 App Router (Skyward Portal UI)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # Root layout (Global Design Tokens - Dark Navy)
│   │   │   ├── page.tsx             # Home Router & Module Switcher
│   │   │   ├── login/               # Đăng nhập & Xác thực
│   │   │   ├── dashboard/           # Trung tâm Điều hành (Dashboard)
│   │   │   ├── flights/             # Tìm kiếm & Quản lý Chuyến bay
│   │   │   ├── booking/             # Quy trình Đặt chỗ (Booking Workflow)
│   │   │   ├── seat-map/            # Sơ đồ ghế ngồi tương tác
│   │   │   ├── tickets/             # Quản lý Vé (Ticket-Centric Hub)
│   │   │   ├── passengers/          # Quản lý Hành khách
│   │   │   ├── customers/           # Quản lý Khách hàng / Đại lý
│   │   │   ├── payments/            # Thanh toán & Lịch sử Giao dịch
│   │   │   ├── loyalty/             # Chương trình Thành viên
│   │   │   ├── reports/             # Báo cáo BI & Doanh thu
│   │   │   ├── settings/            # Cấu hình Hệ thống & Hãng bay
│   │   │   ├── users/               # Quản lý Nhân sự & Phân quyền
│   │   │   └── refund-management/   # Xử lý Hoàn/Hủy vé
│   │   ├── components/              # Premium Shared Components (Dark-Navy System)
│   │   │   ├── AppLayout.tsx        # Enterprise Layout Wrapper
│   │   │   ├── Sidebar.tsx          # Professional Sidebar
│   │   │   ├── Header.tsx           # Dashboard Header
│   │   │   ├── Card.tsx             # Standardized Card Component
│   │   │   └── ...                  # Reusable UI Elements
│   │   └── index.css                # Core Design System Tokens (Navy/Blue)
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
| 🎫 Vé máy bay | Quản lý vé, đổi vé, in Boarding Pass |
| 💳 Thanh toán | Xử lý thanh toán vé, quản lý hóa đơn |
| 👥 Hành khách | Quản lý thông tin hành khách theo từng vé |
| 👤 Khách hàng | CRM đại lý/khách hàng, chương trình thành viên |
| ⚙️ Hệ thống | Quản lý cấu hình, hãng bay, tuyến bay |
| 📊 Báo cáo | Phân tích số liệu, xuất file |

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

**[⬆ Về đầu trang](#-skyward-portal---hệ-thống-quản-lý-đại-lý-bán-vé-máy-bay)**

</div>