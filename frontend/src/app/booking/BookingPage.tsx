import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface BookingPageProps {
  onNavigate?: (id: string) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onNavigate }) => {
  const [view, setView] = useState<'list' | 'create'>('list');

  const bookings = [
    { id: 'BKG-8A2F9', customer: 'Nguyễn Văn Trường', phone: '0901234567', routeFrom: 'SGN', routeTo: 'HAN', flightId: 'VN-214', flightClass: 'Phổ thông', date: '12 Thg 10, 2023', time: '08:30 AM', total: '3,250,000', status: 'Đã xác nhận', badge: 'success', initials: 'NT' },
    { id: 'BKG-7X1M4', customer: 'Trần Thị Lan', phone: '0987654321', routeFrom: 'DAD', routeTo: 'SGN', flightId: 'VJ-102', flightClass: 'Thương gia', date: '15 Thg 10, 2023', time: '14:00 PM', total: '5,100,000', status: 'Chờ xử lý', badge: 'warning', initials: 'TL' },
    { id: 'BKG-2K9P0', customer: 'Lê Văn Đạt', phone: '0912345678', routeFrom: 'HAN', routeTo: 'PQC', flightId: 'QH-305', flightClass: 'Phổ thông', date: '10 Thg 10, 2023', time: '09:15 AM', total: '2,800,000', status: 'Đã hủy', badge: 'danger', initials: 'LĐ' },
  ];

  return (
    <div className="layout">
      <Sidebar activeItem="booking" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title={view === 'list' ? "Danh sách Booking - Airline System" : "Tạo mới Booking - Airline System"} />
        
        <main className="content">
          {view === 'list' ? (
            <>
              {/* Header List View */}
              <div className="page-header">
                <div>
                  <h1>Quản lý Đặt chỗ</h1>
                  <p>Quản lý và theo dõi tất cả các yêu cầu đặt vé chuyến bay.</p>
                </div>
                <Button onClick={() => setView('create')}>
                  <span className="material-icons-round">add</span>
                  Tạo mới
                </Button>
              </div>

              {/* Filters */}
              <Card className="filter-card">
                <div className="filter-row">
                  <div className="filter-group flex-2">
                    <label>TÌM KIẾM</label>
                    <div className="input-with-icon">
                      <span className="material-icons-round">search</span>
                      <input type="text" placeholder="Nhập mã đặt chỗ hoặc tên khách..." />
                    </div>
                  </div>
                  <div className="filter-group flex-1">
                    <label>NGÀY BAY</label>
                    <div className="input-with-icon">
                      <span className="material-icons-round">calendar_today</span>
                      <input type="text" placeholder="Chọn ngày..." />
                    </div>
                  </div>
                  <div className="filter-group flex-1">
                    <label>TRẠNG THÁI</label>
                    <div className="input-with-icon select-wrapper">
                      <select defaultValue="all">
                        <option value="all">Tất cả trạng thái</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="cancelled">Đã hủy</option>
                      </select>
                      <span className="material-icons-round arrow">expand_more</span>
                    </div>
                  </div>
                  <div className="filter-actions">
                    <Button variant="outline" className="btn-reset">Làm mới</Button>
                    <Button variant="outline" className="btn-filter">
                      <span className="material-icons-round">filter_list</span>
                      Lọc
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Table */}
              <Card className="table-card">
                <table className="booking-table">
                  <thead>
                    <tr>
                      <th>Mã Booking</th>
                      <th>Khách hàng</th>
                      <th>Chuyến bay</th>
                      <th>Ngày bay</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <div className="booking-id">{b.id.substring(0, 4)}<br/>{b.id.substring(4)}</div>
                        </td>
                        <td>
                          <div className="customer-info">
                            <div className="avatar">{b.initials}</div>
                            <div>
                              <p className="name">{b.customer}</p>
                              <p className="phone">{b.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="flight-info">
                            <p className="route"><strong>{b.routeFrom}</strong> <span className="material-icons-round">flight_takeoff</span> <strong>{b.routeTo}</strong></p>
                            <p className="details">{b.flightId} • {b.flightClass}</p>
                          </div>
                        </td>
                        <td>
                          <div className="date-info">
                            <p className="date">{b.date}</p>
                            <p className="time">{b.time}</p>
                          </div>
                        </td>
                        <td>
                          <p className="price">{b.total}</p>
                        </td>
                        <td>
                          <span className={`status-badge ${b.badge}`}>
                            <span className="dot"></span>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          <button className="action-btn"><span className="material-icons-round">more_vert</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <p>Hiển thị <strong>1</strong> đến <strong>10</strong> trong số <strong>97</strong> kết quả</p>
                  <div className="page-controls">
                    <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn dots">...</button>
                    <button className="page-btn">10</button>
                    <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
                  </div>
                </div>
              </Card>
            </>
          ) : (
            <>
              {/* Header Create View */}
              <div className="breadcrumb">
                <span className="link" onClick={() => onNavigate && onNavigate('flights')}>Chuyến bay</span>
                <span className="material-icons-round separator">chevron_right</span>
                <span className="current">Đặt chỗ</span>
              </div>
              <div className="page-header mb-lg">
                <div>
                  <h1>Tạo mới Booking</h1>
                  <p>Điền thông tin chi tiết để hoàn tất quá trình đặt chỗ.</p>
                </div>
                <Button variant="outline" onClick={() => setView('list')}>
                  <span className="material-icons-round">arrow_back</span>
                  Quay lại
                </Button>
              </div>

              <div className="create-layout">
                {/* Left Column */}
                <div className="create-main">
                  {/* Flight Summary Card */}
                  <Card className="form-card mb-md">
                    <div className="flight-summary-header">
                      <div className="f-airline">
                        <span className="airline-logo vn">VN</span>
                        <div>
                          <p className="name">Vietnam Airlines</p>
                          <p className="plane">VN-204 • Airbus A321</p>
                        </div>
                      </div>
                      <span className="status-label">KHỞI HÀNH ĐÚNG GIỜ</span>
                    </div>
                    <div className="flight-summary-route">
                      <div className="loc">
                        <h2>SGN</h2>
                        <p>TP. Hồ Chí Minh</p>
                        <h3>08:00</h3>
                      </div>
                      <div className="dur">
                        <p>2h 15m</p>
                        <div className="line"><span className="material-icons-round">flight</span></div>
                        <p className="type">Bay thẳng</p>
                      </div>
                      <div className="loc text-right">
                        <h2>HAN</h2>
                        <p>Hà Nội</p>
                        <h3>10:15</h3>
                      </div>
                    </div>
                    <div className="flight-summary-price">
                      <span>Giá vé cơ bản (1 Người lớn)</span>
                      <span className="price-val text-primary">1.850.000đ</span>
                    </div>
                  </Card>

                  {/* Passenger Info Card */}
                  <Card className="form-card mb-md">
                    <div className="card-heading">
                      <div className="title-with-icon">
                        <span className="material-icons-round text-primary">person</span>
                        <h3>Thông tin hành khách</h3>
                      </div>
                      <span className="badge-gray">Hành khách 1</span>
                    </div>
                    <div className="form-grid">
                      <div className="form-field full-width">
                        <label>Họ và Tên (In hoa không dấu)</label>
                        <div className="input-box">
                          <span className="material-icons-round">badge</span>
                          <input type="text" placeholder="NGUYEN VAN A" />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Ngày sinh</label>
                        <div className="input-box">
                          <span className="material-icons-round">calendar_today</span>
                          <input type="text" placeholder="dd/mm/yyyy" />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Giới tính</label>
                        <div className="input-box select-wrapper">
                          <select defaultValue="nam">
                            <option value="nam">Nam</option>
                            <option value="nu">Nữ</option>
                          </select>
                          <span className="material-icons-round arrow">expand_more</span>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>CMND / Passport</label>
                        <div className="input-box">
                          <span className="material-icons-round">branding_watermark</span>
                          <input type="text" placeholder="Nhập số giấy tờ" />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Quốc tịch</label>
                        <div className="input-box select-wrapper">
                          <select defaultValue="vn">
                            <option value="vn">Việt Nam</option>
                            <option value="other">Khác</option>
                          </select>
                          <span className="material-icons-round arrow">expand_more</span>
                        </div>
                      </div>
                    </div>
                    <button className="add-passenger-btn">
                      <span className="material-icons-round">add</span>
                      Thêm hành khách
                    </button>
                  </Card>

                  {/* Additional Info Card */}
                  <Card className="form-card">
                    <div className="card-heading">
                      <div className="title-with-icon">
                        <span className="material-icons-round text-primary">tune</span>
                        <h3>Thông tin bổ sung</h3>
                      </div>
                    </div>
                    <div className="form-grid">
                      <div className="form-field">
                        <label>Hạng vé</label>
                        <div className="input-box select-wrapper">
                          <select defaultValue="eco">
                            <option value="eco">Phổ thông (Economy)</option>
                            <option value="biz">Thương gia (Business)</option>
                          </select>
                          <span className="material-icons-round arrow">expand_more</span>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Hành lý ký gửi</label>
                        <div className="input-box select-wrapper">
                          <select defaultValue="0">
                            <option value="0">Không mua thêm (0kg)</option>
                            <option value="15">Mua thêm 15kg</option>
                            <option value="20">Mua thêm 20kg</option>
                          </select>
                          <span className="material-icons-round arrow">expand_more</span>
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Số điện thoại liên hệ</label>
                        <div className="input-box">
                          <span className="material-icons-round">phone</span>
                          <input type="text" placeholder="090 123 4567" />
                        </div>
                      </div>
                      <div className="form-field">
                        <label>Email nhận vé</label>
                        <div className="input-box">
                          <span className="material-icons-round">mail</span>
                          <input type="email" placeholder="example@email.com" />
                        </div>
                      </div>
                      <div className="form-field full-width">
                        <label>Ghi chú (Tùy chọn)</label>
                        <textarea className="text-area" placeholder="Yêu cầu suất ăn đặc biệt, hỗ trợ xe lăn..."></textarea>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Right Column - Summary */}
                <div className="create-sidebar">
                  <Card className="summary-card">
                    <div className="summary-header">
                      <h3>Tóm tắt thanh toán</h3>
                      <span className="material-icons-round text-primary">receipt_long</span>
                    </div>
                    <div className="summary-body">
                      <div className="summary-row">
                        <span>Giá vé cơ bản (x1)</span>
                        <span>1.850.000 đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Hành lý thêm</span>
                        <span>0 đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Thuế & Phí (10%)</span>
                        <span>185.000 đ</span>
                      </div>
                    </div>
                    <div className="summary-total">
                      <span>Tổng cộng</span>
                      <h2>2.035.000 đ</h2>
                    </div>
                    <div className="summary-actions">
                      <Button className="w-full mb-sm btn-primary-alt">
                        <span className="material-icons-round">check_circle</span>
                        Xác nhận Booking
                      </Button>
                      <Button variant="outline" className="w-full text-primary border-primary">
                        <span className="material-icons-round">hourglass_empty</span>
                        Giữ chỗ (24h)
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); overflow-x: hidden; }
        .content { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; width: 100%; }

        /* Helpers */
        .text-primary { color: var(--primary); }
        .text-right { text-align: right; }
        .w-full { width: 100%; }
        .mb-sm { margin-bottom: var(--space-sm); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        
        /* Typography */
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .page-header h1 { font-size: 24px; margin-bottom: 4px; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        /* List View: Filters */
        .filter-card { margin-bottom: var(--space-lg); padding: var(--space-md) var(--space-lg); }
        .filter-row { display: flex; gap: var(--space-lg); align-items: flex-end; }
        .filter-group { display: flex; flex-direction: column; gap: 8px; }
        .filter-group label { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }
        .input-with-icon { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px 12px; background: white; transition: border-color 0.2s; position: relative; }
        .input-with-icon:focus-within { border-color: var(--primary); }
        .input-with-icon .material-icons-round { color: var(--text-muted); font-size: 18px; }
        .input-with-icon input { border: none; outline: none; flex: 1; font-size: 14px; background: transparent; width: 100%; }
        .select-wrapper select { width: 100%; border: none; outline: none; appearance: none; background: transparent; font-size: 14px; padding-right: 24px; cursor: pointer; color: var(--text-main); }
        .select-wrapper .arrow { position: absolute; right: 12px; pointer-events: none; }
        .filter-actions { display: flex; gap: var(--space-sm); margin-bottom: 2px; }
        .btn-reset { color: var(--text-secondary); border-color: var(--border); background: var(--bg-main); }
        .btn-filter { color: var(--primary); border-color: var(--primary-light); background: #f0f4ff; }

        /* List View: Table */
        .table-card { padding: 0; overflow: hidden; }
        .booking-table { width: 100%; border-collapse: collapse; text-align: left; }
        .booking-table th { padding: 16px var(--space-lg); font-size: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); background: #fcfcfc; text-transform: uppercase; }
        .booking-table td { padding: 16px var(--space-lg); border-bottom: 1px solid var(--border); vertical-align: middle; }
        
        .booking-id { font-family: monospace; font-size: 13px; font-weight: 600; background: #f5f5f5; padding: 4px 8px; border-radius: 4px; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; color: var(--text-main); border: 1px solid #e0e0e0; }
        
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
        .customer-info .name { font-size: 14px; font-weight: 600; margin-bottom: 2px; color: var(--text-main); }
        .customer-info .phone { font-size: 12px; color: var(--text-muted); }
        
        .flight-info .route { font-size: 14px; display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
        .flight-info .route .material-icons-round { font-size: 14px; color: var(--text-muted); }
        .flight-info .details { font-size: 12px; color: var(--text-muted); }
        
        .date-info .date { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
        .date-info .time { font-size: 12px; color: var(--text-muted); }
        
        .price { font-size: 14px; font-weight: 600; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef7e0; color: #b06000; }
        .status-badge.warning .dot { background: #b06000; }
        .status-badge.danger { background: #fce8e6; color: #c5221f; }
        .status-badge.danger .dot { background: #c5221f; }
        
        .action-btn { color: var(--text-muted); padding: 4px; border-radius: 50%; transition: background 0.2s; }
        .action-btn:hover { background: var(--bg-main); color: var(--text-main); }

        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 16px var(--space-lg); border-top: 1px solid var(--border); font-size: 13px; color: var(--text-secondary); }
        .pagination strong { color: var(--text-main); }
        .page-controls { display: flex; gap: 4px; }
        .page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: var(--radius-sm); background: white; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .page-btn:hover:not(.dots) { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .page-btn.dots { border: none; background: transparent; cursor: default; }

        /* Create View: Layout */
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .breadcrumb .link { color: var(--primary); cursor: pointer; }
        .breadcrumb .link:hover { text-decoration: underline; }
        .breadcrumb .separator { font-size: 16px; }
        .breadcrumb .current { color: var(--text-main); }
        
        .create-layout { display: flex; gap: var(--space-xl); align-items: flex-start; }
        .create-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .create-sidebar { width: 340px; flex-shrink: 0; position: sticky; top: 88px; }

        .form-card { padding: var(--space-lg); }
        .card-heading { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .title-with-icon { display: flex; align-items: center; gap: 8px; }
        .title-with-icon h3 { font-size: 16px; margin: 0; }
        .title-with-icon .material-icons-round { font-size: 20px; }
        .badge-gray { background: #f0f0f0; color: var(--text-secondary); font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight: 500; }

        /* Flight Summary Card inside Create */
        .flight-summary-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
        .f-airline { display: flex; align-items: center; gap: 12px; }
        .f-airline .name { font-size: 14px; font-weight: 600; }
        .f-airline .plane { font-size: 12px; color: var(--text-muted); }
        .airline-logo { width: 32px; height: 32px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; color: white; }
        .airline-logo.vn { background: #005a8c; }
        .status-label { background: #e8f0fe; color: var(--primary); font-size: 10px; padding: 4px 8px; border-radius: 12px; font-weight: 700; letter-spacing: 0.5px; }
        
        .flight-summary-route { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--border); padding-bottom: var(--space-md); margin-bottom: var(--space-md); }
        .loc h2 { font-size: 28px; line-height: 1.1; }
        .loc p { font-size: 12px; color: var(--text-secondary); margin-bottom: 4px; }
        .loc h3 { font-size: 18px; font-weight: 700; }
        .dur { flex: 1; text-align: center; padding: 0 20px; }
        .dur p { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .dur .line { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; }
        .dur .line::before { content: ''; position: absolute; width: 100%; height: 1px; background: var(--border); z-index: 1; }
        .dur .line .material-icons-round { background: white; padding: 0 4px; z-index: 2; font-size: 18px; color: var(--primary); }
        
        .flight-summary-price { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-secondary); background: #f8fbff; padding: 12px; border-radius: var(--radius-md); }
        .price-val { font-size: 18px; font-weight: 700; }

        /* Form Grid */
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md); margin-bottom: var(--space-lg); }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field.full-width { grid-column: 1 / -1; }
        .form-field label { font-size: 12px; font-weight: 500; color: var(--text-main); }
        .input-box { display: flex; align-items: center; gap: 10px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px 12px; background: white; transition: border-color 0.2s; }
        .input-box:focus-within { border-color: var(--primary); }
        .input-box .material-icons-round { color: var(--text-muted); font-size: 18px; }
        .input-box input { border: none; outline: none; flex: 1; font-size: 14px; background: transparent; width: 100%; }
        .input-box input::placeholder { color: #aaa; }
        
        .add-passenger-btn { width: 100%; border: 1px dashed var(--primary); background: transparent; color: var(--primary); padding: 12px; border-radius: var(--radius-md); font-weight: 500; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: background 0.2s; }
        .add-passenger-btn:hover { background: #f0f4ff; }
        
        .text-area { width: 100%; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px; font-size: 14px; font-family: inherit; resize: vertical; min-height: 80px; outline: none; transition: border-color 0.2s; }
        .text-area:focus { border-color: var(--primary); }

        /* Summary Sidebar */
        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-md) var(--space-lg); background: #fcfcfc; border-bottom: 1px solid var(--border); }
        .summary-header h3 { font-size: 16px; margin: 0; }
        .summary-body { padding: var(--space-lg); display: flex; flex-direction: column; gap: 12px; border-bottom: 1px dashed var(--border); }
        .summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); }
        .summary-total { padding: var(--space-lg); display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
        .summary-total span { font-size: 13px; color: var(--text-secondary); }
        .summary-total h2 { font-size: 28px; color: var(--primary); margin: 0; line-height: 1.2; }
        .summary-actions { padding: 0 var(--space-lg) var(--space-lg) var(--space-lg); }
        .btn-primary-alt { background: #005a8c; color: white; display: flex; justify-content: center; align-items: center; }
        .btn-primary-alt:hover { background: #00426b; }
        .border-primary { border-color: var(--primary); }
      `}</style>
    </div>
  );
};

export default BookingPage;
