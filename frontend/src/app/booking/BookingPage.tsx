import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface BookingPageProps {
  onNavigate?: (id: string) => void;
  initialFlight?: any;
  onCheckout?: (ticket: any) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onNavigate, initialFlight, onCheckout }) => {
  const [view, setView] = useState<'list' | 'create'>(initialFlight ? 'create' : 'list');
  const [flightData, setFlightData] = useState<any>(initialFlight || null);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [actionType, setActionType] = useState<'hold' | 'delete' | 'success' | null>(null);

  const [bookingsList, setBookingsList] = useState([
    { id: 'BKG-8A2F9', customer: 'Nguyễn Văn Trường', phone: '0901234567', routeFrom: 'SGN', routeTo: 'HAN', flightId: 'VN-214', flightClass: 'Phổ thông', date: '12 Thg 10, 2023', time: '08:30 AM', total: '3,250,000', status: 'Đã xác nhận', badge: 'success', initials: 'NT' },
    { id: 'BKG-7X1M4', customer: 'Trần Thị Lan', phone: '0987654321', routeFrom: 'DAD', routeTo: 'SGN', flightId: 'VJ-102', flightClass: 'Thương gia', date: '15 Thg 10, 2023', time: '14:00 PM', total: '5,100,000', status: 'Chờ xử lý', badge: 'warning', initials: 'TL' },
    { id: 'BKG-2K9P0', customer: 'Lê Văn Đạt', phone: '0912345678', routeFrom: 'HAN', routeTo: 'PQC', flightId: 'QH-305', flightClass: 'Phổ thông', date: '10 Thg 10, 2023', time: '09:15 AM', total: '2,800,000', status: 'Đã hủy', badge: 'danger', initials: 'LĐ' },
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleHoldBooking = () => {
    const newBooking = {
      id: `BKG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      customer: customerName || 'Khách hàng mới',
      phone: customerPhone || 'Chưa cung cấp',
      routeFrom: flightData?.from || 'SGN',
      routeTo: flightData?.to || 'HAN',
      flightId: flightData?.id || 'VN-204',
      flightClass: flightData?.cls || 'Phổ thông',
      date: 'Hôm nay', // Fake current date
      time: flightData?.departure || '08:00 AM',
      total: ((flightData?.price || 1850000) * 1.1).toLocaleString('vi'),
      status: 'Chờ xử lý',
      badge: 'warning',
      initials: (customerName || 'KH').substring(0, 2).toUpperCase()
    };
    setBookingsList([newBooking, ...bookingsList]);
    setActionType('hold');
    setTimeout(() => {
      setActionType(null);
      setView('list');
      setCustomerName('');
      setCustomerPhone('');
    }, 2000);
  };

  const handleConfirmBooking = () => {
    if (onCheckout) {
      onCheckout({
        id: `BKG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
        customer: customerName || 'Khách hàng mới',
        routeFrom: flightData?.from || 'SGN',
        routeTo: flightData?.to || 'HAN',
        airportFrom: flightData?.from === 'HAN' ? 'Nội Bài' : 'Tân Sơn Nhất',
        airportTo: flightData?.to === 'HAN' ? 'Nội Bài' : 'Tân Sơn Nhất',
        date: 'Hôm nay',
        total: ((flightData?.price || 1850000) * 1.1).toLocaleString('vi'),
        gate: '--',
        terminal: 'T1',
        seat: '--',
        boarding: flightData?.departure || '08:00 AM',
        badge: 'info',
        status: 'Chờ thanh toán'
      });
    } else if (onNavigate) {
      onNavigate('payments');
    }
  };

  return (
    <div className="layout">
      <Sidebar activeItem="booking" onNavigate={onNavigate} />
      <div className="main-container">
        <Header />
        
        <main className="content">
          {view === 'list' ? (
            <>
              {/* Breadcrumb List View */}
              <div className="breadcrumb">
                <span className="link" onClick={() => onNavigate && onNavigate('dashboard')}>Dashboard</span>
                <span className="material-icons-round separator">chevron_right</span>
                <span className="current">Quản lý Đặt chỗ</span>
              </div>

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
                <div className="table-responsive">
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
                    {bookingsList.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <div className="booking-id">{b.id.substring(0, 4)}<br/>{b.id.substring(4)}</div>
                        </td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-avatar">{b.initials}</div>
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
                          <div className="action-buttons">
                            <button className="action-btn view" title="Xem chi tiết" onClick={() => setViewingItem(b)}><span className="material-icons-round">visibility</span></button>
                            <button className="action-btn issue" title="Xuất vé" onClick={() => onNavigate && onNavigate('issue_ticket')}><span className="material-icons-round">receipt</span></button>
                            <button className="action-btn edit" title="Chỉnh sửa" onClick={() => setEditingBooking(b)}><span className="material-icons-round">edit</span></button>
                            <button className="action-btn delete" title="Xóa" onClick={() => setActionType('delete')}><span className="material-icons-round">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
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
                <Button variant="outline" onClick={() => {
                  if (initialFlight) {
                    onNavigate && onNavigate('flights');
                  } else {
                    setView('list');
                  }
                }}>
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
                        <span className="airline-logo" style={{ background: flightData?.bg || '#005a8c' }}>{flightData?.logo || 'VN'}</span>
                        <div>
                          <p className="name">{flightData?.airline || 'Vietnam Airlines'}</p>
                          <p className="plane">{flightData?.id || 'VN-204'} • {flightData?.aircraft || 'Airbus A321'}</p>
                        </div>
                      </div>
                      <span className="status-label">KHỞI HÀNH ĐÚNG GIỜ</span>
                    </div>
                    <div className="flight-summary-route">
                      <div className="loc">
                        <h2>{flightData?.from || 'SGN'}</h2>
                        <p>{flightData?.from === 'HAN' ? 'Hà Nội' : flightData?.from === 'SGN' ? 'TP. Hồ Chí Minh' : flightData?.from === 'DAD' ? 'Đà Nẵng' : 'Điểm đi'}</p>
                        <h3>{flightData?.departure || '08:00'}</h3>
                      </div>
                      <div className="dur">
                        <p>{flightData?.duration || '2h 15m'}</p>
                        <div className="line"><span className="material-icons-round">flight</span></div>
                        <p className="type">Bay thẳng</p>
                      </div>
                      <div className="loc text-right">
                        <h2>{flightData?.to || 'HAN'}</h2>
                        <p>{flightData?.to === 'HAN' ? 'Hà Nội' : flightData?.to === 'SGN' ? 'TP. Hồ Chí Minh' : flightData?.to === 'DAD' ? 'Đà Nẵng' : 'Điểm đến'}</p>
                        <h3>{flightData?.arrival || '10:15'}</h3>
                      </div>
                    </div>
                    <div className="flight-summary-price">
                      <span>Giá vé cơ bản (1 Người lớn)</span>
                      <span className="price-val text-primary">{(flightData?.price || 1850000).toLocaleString('vi')}đ</span>
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
                          <input type="text" placeholder="NGUYEN VAN A" value={customerName} onChange={e => setCustomerName(e.target.value)} />
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
                          <input type="text" placeholder="090 123 4567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
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
                        <span>{(flightData?.price || 1850000).toLocaleString('vi')} đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Hành lý thêm</span>
                        <span>0 đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Thuế & Phí (10%)</span>
                        <span>{((flightData?.price || 1850000) * 0.1).toLocaleString('vi')} đ</span>
                      </div>
                    </div>
                    <div className="summary-total">
                      <span>Tổng cộng</span>
                      <h2>{((flightData?.price || 1850000) * 1.1).toLocaleString('vi')} đ</h2>
                    </div>
                    <div className="summary-actions">
                      <Button className="w-full mb-sm btn-primary-alt" onClick={handleConfirmBooking}>
                        <span className="material-icons-round">check_circle</span>
                        Xác nhận Booking
                      </Button>
                      <Button variant="outline" className="w-full text-primary border-primary" onClick={handleHoldBooking}>
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

      {/* Edit Booking Popup */}
      {editingBooking && (
        <div className="popup-overlay" onClick={() => setEditingBooking(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <div className="popup-icon"><span className="material-icons-round text-primary">edit</span></div>
                <div>
                  <h3>Chỉnh sửa Đặt chỗ</h3>
                  <p>Mã: <strong>{editingBooking.id}</strong></p>
                </div>
              </div>
              <button className="popup-close" onClick={() => setEditingBooking(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="popup-body">
              <div className="form-group mb-sm">
                <label>Trạng thái</label>
                <select defaultValue={editingBooking.status}>
                  <option value="Đã xác nhận">Đã xác nhận</option>
                  <option value="Chờ xử lý">Chờ xử lý</option>
                  <option value="Đã hủy">Đã hủy</option>
                </select>
              </div>
              <div className="form-group mb-sm">
                <label>Họ và Tên khách hàng</label>
                <input type="text" defaultValue={editingBooking.customer} />
              </div>
              <div className="form-group mb-sm">
                <label>Số điện thoại</label>
                <input type="text" defaultValue={editingBooking.phone} />
              </div>
              <div className="form-group">
                <label>Ghi chú thay đổi</label>
                <textarea rows={3} placeholder="Nhập lý do hoặc chi tiết thay đổi..." style={{ width: '100%', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px', outline: 'none', resize: 'vertical' }}></textarea>
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn-cancel" onClick={() => setEditingBooking(null)}>Hủy</button>
              <button className="btn-save" onClick={() => setEditingBooking(null)}>
                <span className="material-icons-round" style={{fontSize: 18}}>save</span>
                Cập nhật thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Popup */}
      {viewingItem && (
        <div className="popup-overlay" onClick={() => setViewingItem(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <div className="popup-icon" style={{ background: '#e0e7ff', color: 'var(--primary)' }}><span className="material-icons-round">visibility</span></div>
                <div>
                  <h3>Chi tiết Đặt chỗ</h3>
                  <p>Mã: <strong>{viewingItem.id}</strong></p>
                </div>
              </div>
              <button className="popup-close" onClick={() => setViewingItem(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="popup-body">
              <div className="form-grid" style={{ gridTemplateColumns: '1fr', gap: '12px' }}>
                <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Khách hàng:</span>
                  <strong style={{ color: '#1e293b' }}>{viewingItem.customer} ({viewingItem.phone})</strong>
                </div>
                <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Hành trình:</span>
                  <strong style={{ color: '#1e293b' }}>{viewingItem.routeFrom} ➔ {viewingItem.routeTo}</strong>
                </div>
                <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Chuyến bay:</span>
                  <strong style={{ color: '#1e293b' }}>{viewingItem.flightId} ({viewingItem.flightClass})</strong>
                </div>
                <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Thời gian:</span>
                  <strong style={{ color: '#1e293b' }}>{viewingItem.time} - {viewingItem.date}</strong>
                </div>
                <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748b' }}>Tổng tiền:</span>
                  <strong style={{ color: 'var(--primary)', fontSize: '16px' }}>{viewingItem.total} đ</strong>
                </div>
                <div className="detail-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Trạng thái:</span>
                  <strong style={{ color: viewingItem.badge === 'success' ? '#10b981' : viewingItem.badge === 'warning' ? '#f59e0b' : '#ef4444' }}>{viewingItem.status}</strong>
                </div>
              </div>
            </div>
            <div className="popup-footer">
              <button className="btn-save" onClick={() => setViewingItem(null)}>Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modals */}
      {actionType && (
        <div className="popup-overlay" onClick={() => setActionType(null)}>
          <div className="popup-card" style={{ width: 380 }} onClick={e => e.stopPropagation()}>
            <div className="popup-body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div style={{ 
                width: 64, height: 64, borderRadius: '50%', 
                background: actionType === 'delete' ? '#fee2e2' : '#dcfce7', 
                color: actionType === 'delete' ? '#dc2626' : '#16a34a',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px', fontSize: 32
              }}>
                <span className="material-icons-round">{actionType === 'delete' ? 'delete_forever' : 'check_circle'}</span>
              </div>
              <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>{actionType === 'delete' ? 'Xác nhận xóa?' : 'Thành công!'}</h3>
              <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
                {actionType === 'delete' ? 'Bạn có chắc chắn muốn xóa yêu cầu đặt chỗ này không?' : actionType === 'hold' ? 'Hệ thống đã ghi nhận giữ chỗ trong vòng 24h.' : 'Thao tác đã được thực hiện.'}
              </p>
            </div>
            <div className="popup-footer" style={{ background: 'white', justifyContent: 'center', paddingBottom: 24 }}>
              {actionType === 'delete' ? (
                <>
                  <button className="btn-cancel" onClick={() => setActionType(null)}>Hủy bỏ</button>
                  <button className="btn-save" style={{ background: '#dc2626' }} onClick={() => setActionType(null)}>Xác nhận xóa</button>
                </>
              ) : (
                <button className="btn-save" onClick={() => setActionType(null)}>Đã hiểu</button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tdSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* Edit Popup Styles */
        .popup-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(3px); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: tdFadeIn 0.2s ease; }
        .popup-card { background: white; border-radius: 16px; width: 480px; max-width: 90vw; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: tdSlideUp 0.2s ease; overflow: hidden; }
        .popup-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: white; }
        .popup-title { display: flex; gap: 12px; align-items: center; }
        .popup-icon { width: 40px; height: 40px; border-radius: 10px; background: #eff6ff; display: flex; align-items: center; justify-content: center; }
        .popup-title h3 { font-size: 17px; margin: 0 0 2px; color: #1e293b; font-weight: 700; }
        .popup-title p { font-size: 13px; color: #64748b; margin: 0; }
        .popup-close { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #94a3b8; display: flex; transition: all 0.2s; }
        .popup-close:hover { background: #f1f5f9; color: #1e293b; }
        .popup-body { padding: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #334155; }
        .form-group input, .form-group select { width: 100%; padding: 10px 14px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; background: white; }
        .form-group input:focus, .form-group select:focus { border-color: var(--primary); }
        .popup-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #f8fafc; }
        .btn-cancel { padding: 10px 20px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; font-size: 14px; font-weight: 600; color: #64748b; transition: all 0.2s; }
        .btn-cancel:hover { border-color: #94a3b8; color: #1e293b; }
        .btn-save { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border: none; border-radius: 8px; background: var(--primary); color: white; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s; }
        .btn-save:hover { background: #1d4ed8; }

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
        .page-header h1 { font-size: 24px; margin-bottom: 4px; font-weight: 700; }
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
        .table-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        .table-responsive { width: 100%; overflow-x: auto; }
        .booking-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 1000px; }
        .booking-table th { padding: 16px var(--space-lg); font-size: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); background: #fcfcfc; text-transform: uppercase; white-space: nowrap; }
        .booking-table td { padding: 16px var(--space-lg); border-bottom: 1px solid var(--border); vertical-align: middle; white-space: nowrap; }
        
        .booking-id { font-family: monospace; font-size: 13px; font-weight: 600; background: #f5f5f5; padding: 6px 12px; border-radius: 4px; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; color: var(--text-main); border: 1px solid #e0e0e0; }
        
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .customer-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; flex-shrink: 0; }
        .customer-info .name { font-size: 14px; font-weight: 600; margin-bottom: 2px; color: var(--text-main); }
        .customer-info .phone { font-size: 12px; color: var(--text-muted); }
        
        .flight-info .route { font-size: 14px; display: flex; align-items: center; gap: 4px; margin-bottom: 2px; }
        .flight-info .route .material-icons-round { font-size: 14px; color: var(--text-muted); }
        .flight-info .details { font-size: 12px; color: var(--text-muted); }
        
        .date-info .date { font-size: 14px; font-weight: 500; margin-bottom: 2px; }
        .date-info .time { font-size: 12px; color: var(--text-muted); }
        
        .price { font-size: 14px; font-weight: 600; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; white-space: nowrap; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef08a; color: #854d0e; }
        .status-badge.warning .dot { background: #854d0e; }
        .status-badge.danger { background: #fecaca; color: #991b1b; }
        .status-badge.danger .dot { background: #991b1b; }
        
        .action-buttons { display: flex; gap: 4px; }
        .action-btn { display: flex; align-items: center; justify-content: center; color: var(--text-muted); padding: 6px; border-radius: 6px; transition: all 0.2s; border: none; background: transparent; cursor: pointer; }
        .action-btn .material-icons-round { font-size: 18px; }
        .action-btn.view:hover { background: #e0e7ff; color: var(--primary); }
        .action-btn.issue:hover { background: #e6f4ea; color: #137333; }
        .action-btn.edit:hover { background: #fef7e0; color: #b06000; }
        .action-btn.delete:hover { background: #fce8e6; color: #c5221f; }

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
        .summary-card { padding: 0; overflow: hidden; border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.04); border-radius: 20px; background: white; }
        .summary-header { display: flex; justify-content: space-between; align-items: center; padding: 24px; background: #fafbfc; border-bottom: 1px solid #f1f5f9; }
        .summary-header h3 { font-size: 17px; font-weight: 700; color: #1e293b; margin: 0; }
        .summary-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; border-bottom: 1px dashed #e2e8f0; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #64748b; font-weight: 500; }
        .summary-row span:last-child { color: #1e293b; font-weight: 600; }
        .summary-total { padding: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; text-align: center; background: #f8faff; }
        .summary-total span { font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
        .summary-total h2 { font-size: 32px; color: var(--primary); margin: 0; line-height: 1; font-weight: 800; }
        .summary-actions { padding: 24px; background: white; display: flex; flex-direction: column; gap: 12px; }
        .btn-primary-alt { background: linear-gradient(135deg, #005a8c, #003d5c); color: white; border: none; height: 48px; border-radius: 12px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,90,140,0.2); }
        .btn-primary-alt:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0,90,140,0.3); }
        .border-primary { border: 2px solid var(--primary); color: var(--primary); height: 48px; border-radius: 12px; font-weight: 700; }
        .border-primary:hover { background: #eff6ff; }
      `}</style>
    </div>
  );
};

export default BookingPage;
