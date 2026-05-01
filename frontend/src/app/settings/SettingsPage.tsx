import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface SettingsPageProps {
  onNavigate?: (id: string) => void;
}

type TabType = 'airlines' | 'airports' | 'routes' | 'flights';

const flights = [
  { code: 'VN248', route: 'VN-201', from: 'SGN', to: 'HAN', airline: 'VN', depart: '06:00', arrive: '08:05', aircraft: 'Boeing 787', seats: 280, available: 45, date: '24/10/2023', status: 'active' },
  { code: 'VJ411', route: 'VJ-411', from: 'HAN', to: 'DAD', airline: 'VJ', depart: '09:30', arrive: '10:50', aircraft: 'Airbus A320', seats: 180, available: 92, date: '24/10/2023', status: 'active' },
  { code: 'VN465', route: 'VN-465', from: 'SGN', to: 'PQC', airline: 'VN', depart: '14:00', arrive: '15:05', aircraft: 'Airbus A321', seats: 200, available: 0, date: '25/10/2023', status: 'full' },
  { code: 'QH201', route: 'QH-201', from: 'HAN', to: 'HPH', airline: 'QH', depart: '07:00', arrive: '07:40', aircraft: 'Embraer 190', seats: 100, available: 12, date: '26/10/2023', status: 'active' },
  { code: 'VJ599', route: 'VJ-599', from: 'SGN', to: 'CXR', airline: 'VJ', depart: '17:30', arrive: '18:40', aircraft: 'Airbus A320', seats: 180, available: 180, date: '26/10/2023', status: 'inactive' },
];

/* ─────────────────── DATA ─────────────────── */
const airlines = [
  { logo: 'VN', bg: '#e0e7ff', color: '#3b82f6', name: 'Vietnam Airlines', subtitle: 'Lotus', iata: 'VN', country: 'Việt Nam', status: 'active' },
  { logo: 'VJ', bg: '#fce7f3', color: '#ec4899', name: 'VietJet Air', subtitle: 'Low Cost', iata: 'VJ', country: 'Việt Nam', status: 'active' },
  { logo: 'QH', bg: '#dcfce7', color: '#16a34a', name: 'Bamboo Airways', subtitle: 'Hybrid', iata: 'QH', country: 'Việt Nam', status: 'inactive' },
  { logo: 'SQ', bg: '#fef3c7', color: '#d97706', name: 'Singapore Airlines', subtitle: 'Premium', iata: 'SQ', country: 'Singapore', status: 'active' },
];

const airports = [
  { code: 'SGN', name: 'Sân bay Tân Sơn Nhất', city: 'TP. Hồ Chí Minh', country: 'Việt Nam', type: 'Quốc tế', terminals: 2, status: 'active' },
  { code: 'HAN', name: 'Sân bay Nội Bài', city: 'Hà Nội', country: 'Việt Nam', type: 'Quốc tế', terminals: 2, status: 'active' },
  { code: 'DAD', name: 'Sân bay Đà Nẵng', city: 'Đà Nẵng', country: 'Việt Nam', type: 'Quốc tế', terminals: 1, status: 'active' },
  { code: 'PQC', name: 'Sân bay Phú Quốc', city: 'Kiên Giang', country: 'Việt Nam', type: 'Quốc tế', terminals: 1, status: 'active' },
  { code: 'HPH', name: 'Sân bay Cát Bi', city: 'Hải Phòng', country: 'Việt Nam', type: 'Nội địa', terminals: 1, status: 'active' },
  { code: 'CXR', name: 'Sân bay Cam Ranh', city: 'Khánh Hoà', country: 'Việt Nam', type: 'Quốc tế', terminals: 1, status: 'inactive' },
];

const routes = [
  { code: 'VN-201', from: 'SGN', to: 'HAN', airline: 'VN', distance: '1,137 km', duration: '2h 05m', frequency: 'Hàng ngày', baseFare: '890,000 đ', status: 'active' },
  { code: 'VJ-411', from: 'HAN', to: 'DAD', airline: 'VJ', distance: '764 km', duration: '1h 20m', frequency: 'Hàng ngày', baseFare: '650,000 đ', status: 'active' },
  { code: 'VN-465', from: 'SGN', to: 'PQC', airline: 'VN', distance: '422 km', duration: '1h 05m', frequency: '5 lần/tuần', baseFare: '750,000 đ', status: 'active' },
  { code: 'QH-201', from: 'HAN', to: 'HPH', airline: 'QH', distance: '105 km', duration: '0h 40m', frequency: '3 lần/tuần', baseFare: '320,000 đ', status: 'inactive' },
  { code: 'VJ-599', from: 'SGN', to: 'CXR', airline: 'VJ', distance: '448 km', duration: '1h 10m', frequency: 'Hàng ngày', baseFare: '680,000 đ', status: 'active' },
];

/* ─────────────────── COMPONENT ─────────────────── */
const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('airlines');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'custom'>('today');
  const [modal, setModal] = useState<'airline' | 'airport' | 'route' | 'flight' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [flightStep, setFlightStep] = useState(1);
  const [airlineStep, setAirlineStep] = useState(1);
  const [airportStep, setAirportStep] = useState(1);
  const [routeStep, setRouteStep] = useState(1);

  const handleOpenAdd = (type: 'airline' | 'airport' | 'route' | 'flight') => {
    setEditingItem(null);
    setModal(type);
    setFlightStep(1);
    setAirlineStep(1);
    setAirportStep(1);
    setRouteStep(1);
  };

  const handleOpenEdit = (type: 'airline' | 'airport' | 'route' | 'flight', item: any) => {
    setEditingItem(item);
    setModal(type);
    setFlightStep(1);
    setAirlineStep(1);
    setAirportStep(1);
    setRouteStep(1);
  };

  const closeModal = () => {
    setModal(null);
    setEditingItem(null);
    setFlightStep(1);
    setAirlineStep(1);
    setAirportStep(1);
    setRouteStep(1);
  };

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'airlines', label: 'Hãng hàng không', icon: 'flight' },
    { id: 'airports', label: 'Sân bay', icon: 'connecting_airports' },
    { id: 'routes', label: 'Tuyến bay', icon: 'route' },
    { id: 'flights', label: 'Chuyến bay', icon: 'airplanemode_active' },
  ];

  const dateFilters = [
    { id: 'today', label: 'Hôm nay' },
    { id: 'week', label: 'Tuần này' },
    { id: 'month', label: 'Tháng này' },
    { id: 'custom', label: 'Tuỳ chỉnh' },
  ];

  const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { label: string; class: string }> = {
      active: { label: 'Hoạt động', class: 'success' },
      inactive: { label: 'Tạm ngừng', class: 'inactive' },
      pending: { label: 'Chờ xử lý', class: 'warning' },
      cancelled: { label: 'Đã hủy', class: 'danger' },
      full: { label: 'Hết ghế', class: 'danger' },
    };
    const s = config[status] || { label: status, class: 'inactive' };
    return (
      <span className={`status-pill ${s.class}`}>
        <span className="dot" />
        {s.label}
      </span>
    );
  };

  const airlineLogoColor = (iata: string) => {
    const map: Record<string, { bg: string; color: string }> = {
      VN: { bg: '#e0e7ff', color: '#3b82f6' },
      VJ: { bg: '#fce7f3', color: '#ec4899' },
      QH: { bg: '#dcfce7', color: '#16a34a' },
      SQ: { bg: '#fef3c7', color: '#d97706' },
    };
    return map[iata] || { bg: '#f3f4f6', color: '#6b7280' };
  };

  return (
    <div className="layout">
      <Sidebar activeItem="settings" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Quản lý Danh mục – Dữ liệu gốc" />

        <main className="content">
          {/* Page Header */}
          <div className="page-top-bar">
            <div>
              <h1>Quản lý Danh mục <span className="subtitle-badge">(Dữ liệu gốc)</span></h1>
              <p className="subtitle-text">Dữ liệu cập nhật theo thời gian thực</p>
            </div>
            <div className="date-filter-group">
              {dateFilters.map((f) => (
                <button
                  key={f.id}
                  className={`date-btn ${dateFilter === f.id ? 'active' : ''}`}
                  onClick={() => setDateFilter(f.id as typeof dateFilter)}
                >
                  {f.id === 'custom' && <span className="material-icons-round">calendar_today</span>}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="tabs-nav">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`tab-btn ${activeTab === t.id ? 'active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span className="material-icons-round">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ─── Airlines Tab ─── */}
          {activeTab === 'airlines' && (
            <Card className="tab-card">
              <div className="toolbar">
                <div className="search-box">
                  <span className="material-icons-round">search</span>
                  <input type="text" placeholder="Tìm tên, mã hãng..." />
                </div>
                <button className="filter-btn">
                  <span className="material-icons-round">tune</span>
                  Lọc
                </button>
                <div className="spacer" />
                <Button onClick={() => handleOpenAdd('airline')}>
                  <span className="material-icons-round">add</span>
                  Thêm hãng bay
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Tên hãng</th>
                      <th>Mã (IATA)</th>
                      <th>Quốc gia</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {airlines.map((a, i) => (
                      <tr key={i}>
                        <td>
                          <span className="airline-logo" style={{ background: a.bg, color: a.color }}>
                            {a.logo}
                          </span>
                        </td>
                        <td>
                          <p className="font-semibold">{a.name}</p>
                          <p className="text-xs text-muted">{a.subtitle}</p>
                        </td>
                        <td><span className="mono-code">{a.iata}</span></td>
                        <td>{a.country}</td>
                        <td><StatusBadge status={a.status} /></td>
                        <td>
                          <div className="action-row">
                            <button className="icon-btn edit" onClick={() => handleOpenEdit('airline', a)}><span className="material-icons-round">edit</span></button>
                            <button className="icon-btn delete"><span className="material-icons-round">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <p>Hiển thị 1 đến 4 trong <strong>120</strong> kết quả</p>
                <div className="page-controls">
                  <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn dots">...</button>
                  <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
                </div>
              </div>
            </Card>
          )}

          {/* ─── Airports Tab ─── */}
          {activeTab === 'airports' && (
            <Card className="tab-card">
              <div className="toolbar">
                <div className="search-box">
                  <span className="material-icons-round">search</span>
                  <input type="text" placeholder="Tìm mã IATA, tên sân bay, thành phố..." />
                </div>
                <button className="filter-btn">
                  <span className="material-icons-round">tune</span>
                  Lọc
                </button>
                <div className="spacer" />
                <Button onClick={() => handleOpenAdd('airport')}>
                  <span className="material-icons-round">add</span>
                  Thêm sân bay
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Sân bay (IATA)</th>
                      <th>Tên sân bay</th>
                      <th>Thành phố</th>
                      <th>Quốc gia</th>
                      <th>Loại</th>
                      <th>Nhà ga</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {airports.map((ap, i) => (
                      <tr key={i}>
                        <td>
                          <span className="airport-code">{ap.code}</span>
                        </td>
                        <td>
                          <p className="font-semibold">{ap.name}</p>
                        </td>
                        <td>{ap.city}</td>
                        <td>{ap.country}</td>
                        <td>
                          <span className={`type-badge ${ap.type === 'Quốc tế' ? 'intl' : 'dom'}`}>
                            {ap.type}
                          </span>
                        </td>
                        <td>
                          <span className="terminal-badge">
                            <span className="material-icons-round">business</span>
                            {ap.terminals}
                          </span>
                        </td>
                        <td><StatusBadge status={ap.status} /></td>
                        <td>
                          <div className="action-row">
                            <button className="icon-btn edit" onClick={() => handleOpenEdit('airport', ap)}><span className="material-icons-round">edit</span></button>
                            <button className="icon-btn delete"><span className="material-icons-round">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <p>Hiển thị 1 đến 6 trong <strong>85</strong> kết quả</p>
                <div className="page-controls">
                  <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn dots">...</button>
                  <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
                </div>
              </div>
            </Card>
          )}

          {/* ─── Routes Tab ─── */}
          {activeTab === 'routes' && (
            <Card className="tab-card">
              <div className="toolbar">
                <div className="search-box">
                  <span className="material-icons-round">search</span>
                  <input type="text" placeholder="Tìm mã tuyến, sân bay đi/đến..." />
                </div>
                <div className="select-filter">
                  <select defaultValue="all">
                    <option value="all">Tất cả hãng</option>
                    <option value="VN">Vietnam Airlines</option>
                    <option value="VJ">VietJet Air</option>
                    <option value="QH">Bamboo Airways</option>
                  </select>
                  <span className="material-icons-round arrow-icon">expand_more</span>
                </div>
                <div className="spacer" />
                <Button onClick={() => handleOpenAdd('route')}>
                  <span className="material-icons-round">add</span>
                  Thêm tuyến bay
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã tuyến</th>
                      <th>Hành trình</th>
                      <th>Hãng bay</th>
                      <th>Khoảng cách</th>
                      <th>Thời gian</th>
                      <th>Tần suất</th>
                      <th>Giá cơ bản</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {routes.map((r, i) => {
                      const lc = airlineLogoColor(r.airline);
                      return (
                        <tr key={i}>
                          <td><span className="mono-code primary">{r.code}</span></td>
                          <td>
                            <div className="route-cell">
                              <span className="airport-chip">{r.from}</span>
                              <span className="material-icons-round route-arrow">flight_takeoff</span>
                              <span className="airport-chip">{r.to}</span>
                            </div>
                          </td>
                          <td>
                            <span className="airline-logo sm" style={{ background: lc.bg, color: lc.color }}>
                              {r.airline}
                            </span>
                          </td>
                          <td className="text-muted">{r.distance}</td>
                          <td className="font-medium">{r.duration}</td>
                          <td className="text-muted">{r.frequency}</td>
                          <td className="font-bold text-primary">{r.baseFare}</td>
                          <td><StatusBadge status={r.status} /></td>
                          <td>
                            <div className="action-row">
                              <button className="icon-btn edit" onClick={() => handleOpenEdit('route', r)}><span className="material-icons-round">edit</span></button>
                              <button className="icon-btn delete"><span className="material-icons-round">delete</span></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <p>Hiển thị 1 đến 5 trong <strong>230</strong> kết quả</p>
                <div className="page-controls">
                  <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <button className="page-btn dots">...</button>
                  <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
                </div>
              </div>
            </Card>
          )}
          {/* ─── Flights Tab ─── */}
          {activeTab === 'flights' && (
            <Card className="tab-card">
              <div className="toolbar">
                <div className="search-box">
                  <span className="material-icons-round">search</span>
                  <input type="text" placeholder="Tìm mã chuyến, tuyến bay..." />
                </div>
                <div className="select-filter">
                  <select defaultValue="all">
                    <option value="all">Tất cả hãng</option>
                    <option value="VN">Vietnam Airlines</option>
                    <option value="VJ">VietJet Air</option>
                    <option value="QH">Bamboo Airways</option>
                  </select>
                  <span className="material-icons-round arrow-icon">expand_more</span>
                </div>
                <div className="input-date">
                  <span className="material-icons-round">calendar_today</span>
                  <input type="date" />
                </div>
                <div className="spacer" />
                <Button onClick={() => handleOpenAdd('flight')}>
                  <span className="material-icons-round">add</span>
                  Thêm chuyến bay
                </Button>
              </div>

              <div className="table-responsive">
                <table className="data-table" style={{ minWidth: '1200px' }}>
                  <thead>
                    <tr>
                      <th>Chuyến bay / Hãng</th>
                      <th>Hành trình (Route)</th>
                      <th>Lịch trình</th>
                      <th>Tàu bay</th>
                      <th>Tình trạng ghế</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flights.map((f, i) => {
                      const lc = airlineLogoColor(f.airline);
                      const seatPct = Math.round(((f.seats - f.available) / f.seats) * 100);
                      return (
                        <tr key={i}>
                          <td>
                            <div className="flight-cell">
                              <span className="airline-logo sm" style={{ background: lc.bg, color: lc.color }}>{f.airline}</span>
                              <div>
                                <p className="mono-code primary" style={{ fontSize: '14px' }}>{f.code}</p>
                                <p className="text-xs text-muted">{ { VN: 'Vietnam Airlines', VJ: 'VietJet Air', QH: 'Bamboo Airways', SQ: 'Singapore Airlines' }[f.airline] || f.airline }</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="route-cell-v2">
                              <div className="rt-node">
                                <span className="rt-code">{f.from}</span>
                              </div>
                              <div className="rt-line-box">
                                <div className="rt-line"></div>
                                <span className="material-icons-round">flight</span>
                              </div>
                              <div className="rt-node">
                                <span className="rt-code">{f.to}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="schedule-cell">
                              <div className="sch-date">
                                <span className="material-icons-round">calendar_today</span>
                                {f.date}
                              </div>
                              <div className="sch-time">
                                <span className="font-bold">{f.depart}</span>
                                <span className="material-icons-round">arrow_forward</span>
                                <span className="text-muted">{f.arrive}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="aircraft-cell">
                              <span className="material-icons-round">airplanemode_active</span>
                              <div>
                                <p className="font-medium">{f.aircraft}</p>
                                <p className="text-xs text-muted">A321-200</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="seat-info-v2">
                              <div className="seat-label">
                                <span>{f.available} / {f.seats}</span>
                                <span className="pct">{100 - seatPct}%</span>
                              </div>
                              <div className="seat-bar">
                                <div className="seat-fill" style={{ width: `${100 - seatPct}%`, background: seatPct >= 90 ? '#ef4444' : seatPct > 70 ? '#f59e0b' : '#10b981' }}></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-pill ${f.status === 'active' ? 'success' : f.status === 'full' ? 'danger' : 'inactive'}`}>
                              <span className="dot" />
                              {f.status === 'active' ? 'Sẵn sàng' : f.status === 'full' ? 'Hết ghế' : 'Tạm dừng'}
                            </span>
                          </td>
                          <td>
                            <div className="action-row">
                              <button className="icon-btn edit" title="Sửa" onClick={() => handleOpenEdit('flight', f)}><span className="material-icons-round">edit</span></button>
                              <button className="icon-btn delete" title="Xóa"><span className="material-icons-round">delete</span></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <p>Hiển thị 1 đến 5 trong <strong>312</strong> chuyến bay</p>
                <div className="page-controls">
                  <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn dots">...</button>
                  <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
                </div>
              </div>
            </Card>
          )}
        </main>
      </div>
      {modal === 'flight' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box modal-xl" style={{ display:'flex', flexDirection:'column', maxHeight:'90vh' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon-box bg-green"><span className="material-icons-round">airplanemode_active</span></span>
                <div>
                  <h2>{editingItem ? 'Cập nhật chuyến bay' : 'Thêm chuyến bay mới'}</h2>
                  <p>{editingItem ? `Đang chỉnh sửa chuyến bay ${editingItem.code}` : 'Khai báo đầy đủ thông tin chuyến bay vào hệ thống'}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}><span className="material-icons-round">close</span></button>
            </div>
            <div className="wizard-stepper">
              <div className={`wizard-step ${flightStep === 1 ? 'active' : flightStep > 1 ? 'completed' : ''}`} onClick={() => setFlightStep(1)}>
                <span className="step-num">{flightStep > 1 ? <span className="material-icons-round">check</span> : '1'}</span>
                <span className="step-label">Cơ bản</span>
              </div>
              <div className={`step-line${flightStep > 1 ? ' done' : ''}`} />
              <div className={`wizard-step ${flightStep === 2 ? 'active' : flightStep > 2 ? 'completed' : ''}`} onClick={() => setFlightStep(2)}>
                <span className="step-num">{flightStep > 2 ? <span className="material-icons-round">check</span> : '2'}</span>
                <span className="step-label">Lịch trình</span>
              </div>
              <div className={`step-line${flightStep > 2 ? ' done' : ''}`} />
              <div className={`wizard-step ${flightStep === 3 ? 'active' : flightStep > 3 ? 'completed' : ''}`} onClick={() => setFlightStep(3)}>
                <span className="step-num">{flightStep > 3 ? <span className="material-icons-round">check</span> : '3'}</span>
                <span className="step-label">Tàu bay</span>
              </div>
              <div className={`step-line${flightStep > 3 ? ' done' : ''}`} />
              <div className={`wizard-step ${flightStep === 4 ? 'active' : flightStep > 4 ? 'completed' : ''}`} onClick={() => setFlightStep(4)}>
                <span className="step-num">{flightStep > 4 ? <span className="material-icons-round">check</span> : '4'}</span>
                <span className="step-label">Giá vé</span>
              </div>
              <div className={`step-line${flightStep > 4 ? ' done' : ''}`} />
              <div className={`wizard-step ${flightStep === 5 ? 'active' : ''}`} onClick={() => setFlightStep(5)}>
                <span className="step-num">5</span>
                <span className="step-label">Ghi chú</span>
              </div>
            </div>
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {flightStep === 1 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">info</span>Thông tin cơ bản</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Mã chuyến bay <span className="required">*</span></label>
                      <input type="text" placeholder="VD: VN248" className="mono-input" defaultValue={editingItem?.code || ''} />
                    </div>
                    <div className="form-group">
                      <label>Hãng khai thác <span className="required">*</span></label>
                      <select defaultValue={editingItem?.airline || 'VN'}>
                        <option value="VN">Vietnam Airlines (VN)</option>
                        <option value="VJ">VietJet Air (VJ)</option>
                        <option value="QH">Bamboo Airways (QH)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tuyến bay (Route) <span className="required">*</span></label>
                    <select>
                      <option>VN-201 (SGN → HAN)</option>
                      <option>VJ-411 (HAN → DAD)</option>
                      <option>VN-465 (SGN → PQC)</option>
                      <option>QH-201 (HAN → HPH)</option>
                    </select>
                  </div>
                </div>
              )}
              {flightStep === 2 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">schedule</span>Ngày & Giờ bay</p>
                  <div className="form-row form-row-3">
                    <div className="form-group">
                      <label>Ngày bay <span className="required">*</span></label>
                      <input type="date" />
                    </div>
                    <div className="form-group">
                      <label>Giờ khởi hành <span className="required">*</span></label>
                      <input type="time" defaultValue={editingItem?.depart || ''} />
                    </div>
                    <div className="form-group">
                      <label>Giờ dự kiến đến <span className="required">*</span></label>
                      <input type="time" defaultValue={editingItem?.arrive || ''} />
                    </div>
                  </div>
                </div>
              )}
              {flightStep === 3 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">airline_seat_recline_normal</span>Tàu bay & Ghế ngồi</p>
                  <div className="form-row form-row-3" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Loại tàu bay <span className="required">*</span></label>
                      <select>
                        <option>Boeing 787 Dreamliner</option>
                        <option>Airbus A321</option>
                        <option>Airbus A320</option>
                        <option>Embraer 190</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Số hiệu tàu</label>
                      <input type="text" placeholder="VD: VN-A851" className="mono-input" />
                    </div>
                    <div className="form-group">
                      <label>Tổng số ghế <span className="required">*</span></label>
                      <input type="number" placeholder="280" min={1} defaultValue={editingItem?.seats || 280} />
                    </div>
                  </div>
                  <div className="form-row form-row-3">
                    <div className="form-group">
                      <label>Ghế Hạng Nhất (First)</label>
                      <input type="number" placeholder="0" min={0} />
                    </div>
                    <div className="form-group">
                      <label>Ghế Thương gia (Business)</label>
                      <input type="number" placeholder="0" min={0} />
                    </div>
                    <div className="form-group">
                      <label>Ghế Phổ thông (Economy) <span className="required">*</span></label>
                      <input type="number" placeholder="250" min={1} />
                    </div>
                  </div>
                </div>
              )}
              {flightStep === 4 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">attach_money</span>Giá vé cơ bản (VNĐ)</p>
                  <div className="form-row form-row-3">
                    <div className="form-group">
                      <label>Economy <span className="required">*</span></label>
                      <div className="input-prefix"><span>đ</span><input type="number" placeholder="890000" min={0} /></div>
                    </div>
                    <div className="form-group">
                      <label>Business</label>
                      <div className="input-prefix"><span>đ</span><input type="number" placeholder="3500000" min={0} /></div>
                    </div>
                    <div className="form-group">
                      <label>First Class</label>
                      <div className="input-prefix"><span>đ</span><input type="number" placeholder="8000000" min={0} /></div>
                    </div>
                  </div>
                </div>
              )}
              {flightStep === 5 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">settings</span>Cài đặt & Ghi chú</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Trạng thái chuyến bay</label>
                      <div className="radio-group">
                        <label className={`radio-opt ${(!editingItem || editingItem.status === 'active') ? 'active-opt' : ''}`}>
                          <input type="radio" name="fl-status" defaultChecked={!editingItem || editingItem.status === 'active'} />
                          <span className="material-icons-round">check_circle</span> Hoạt động
                        </label>
                        <label className={`radio-opt ${editingItem?.status === 'inactive' ? 'active-opt' : ''}`}>
                          <input type="radio" name="fl-status" defaultChecked={editingItem?.status === 'inactive'} />
                          <span className="material-icons-round">pause_circle</span> Tạm ngừng
                        </label>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Loại khai thác</label>
                      <div className="radio-group">
                        <label className="radio-opt"><input type="radio" name="fl-codeshare" defaultChecked /><span className="material-icons-round">flight</span> Độc lập</label>
                        <label className="radio-opt"><input type="radio" name="fl-codeshare" /><span className="material-icons-round">compare_arrows</span> Code-share</label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Ghi chú nội bộ</label>
                    <textarea placeholder="Nhập ghi chú cho chuyến bay này..." rows={3} className="form-textarea"></textarea>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <div className="spacer" />
              {flightStep > 1 && (
                <button className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setFlightStep(s => s - 1)}>
                  <span className="material-icons-round">arrow_back</span> Quay lại
                </button>
              )}
              {flightStep < 5 ? (
                <button className="btn-save" onClick={() => setFlightStep(s => s + 1)}>
                  Tiếp theo <span className="material-icons-round">arrow_forward</span>
                </button>
              ) : (
                <button className="btn-save" onClick={closeModal}>
                  <span className="material-icons-round">save</span> {editingItem ? 'Cập nhật' : 'Lưu chuyến bay'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL: Thêm hãng bay ══════════════ */}
      {modal === 'airline' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box modal-xl modal-wizard" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon-box"><span className="material-icons-round">flight</span></span>
                <div>
                  <h2>{editingItem ? 'Cập nhật hãng hàng không' : 'Thêm hãng hàng không'}</h2>
                  <p>{editingItem ? `Đang chỉnh sửa hãng ${editingItem.name}` : 'Điền thông tin hãng bay mới vào hệ thống'}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}><span className="material-icons-round">close</span></button>
            </div>
            <div className="wizard-stepper">
              <div className={`wizard-step ${airlineStep === 1 ? 'active' : airlineStep > 1 ? 'completed' : ''}`} onClick={() => setAirlineStep(1)}>
                <span className="step-num">{airlineStep > 1 ? <span className="material-icons-round">check</span> : '1'}</span>
                <span className="step-label">Thông tin cơ bản</span>
              </div>
              <div className={`step-line${airlineStep > 1 ? ' done' : ''}`} />
              <div className={`wizard-step ${airlineStep === 2 ? 'active' : ''}`} onClick={() => setAirlineStep(2)}>
                <span className="step-num">2</span>
                <span className="step-label">Nhận diện & Trạng thái</span>
              </div>
            </div>
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {airlineStep === 1 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">business</span>Thông tin hãng</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Tên hãng bay <span className="required">*</span></label>
                      <input type="text" placeholder="VD: Vietnam Airlines" defaultValue={editingItem?.name || ''} />
                    </div>
                    <div className="form-group">
                      <label>Mã IATA <span className="required">*</span></label>
                      <input type="text" placeholder="VD: VN" maxLength={3} className="mono-input" defaultValue={editingItem?.iata || ''} />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Phân loại hãng</label>
                      <select defaultValue={editingItem?.subtitle || 'Full Service'}>
                        <option>Full Service</option>
                        <option>Low Cost</option>
                        <option>Hybrid</option>
                        <option>Premium</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quốc gia <span className="required">*</span></label>
                      <input type="text" placeholder="VD: Việt Nam" defaultValue={editingItem?.country || ''} />
                    </div>
                  </div>
                </div>
              )}
              {airlineStep === 2 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">palette</span>Nhận diện & Trạng thái</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Logo màu nền</label>
                      <input type="color" defaultValue={editingItem?.bg || "#e0e7ff"} className="color-input" />
                    </div>
                    <div className="form-group">
                      <label>Logo màu chữ</label>
                      <input type="color" defaultValue={editingItem?.color || "#3b82f6"} className="color-input" />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Trạng thái</label>
                    <div className="radio-group" style={{ marginTop: 8 }}>
                      <label className="radio-opt active-opt">
                        <input type="radio" name="al-status" defaultChecked />
                        <span className="material-icons-round">check_circle</span> Hoạt động
                      </label>
                      <label className="radio-opt">
                        <input type="radio" name="al-status" />
                        <span className="material-icons-round">pause_circle</span> Tạm ngừng
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <div className="spacer" />
              {airlineStep > 1 && (
                <button className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setAirlineStep(s => s - 1)}>
                  <span className="material-icons-round">arrow_back</span> Quay lại
                </button>
              )}
              {airlineStep < 2 ? (
                <button className="btn-save" onClick={() => setAirlineStep(s => s + 1)}>
                  Tiếp theo <span className="material-icons-round">arrow_forward</span>
                </button>
              ) : (
                <button className="btn-save" onClick={closeModal}>
                  <span className="material-icons-round">save</span> {editingItem ? 'Cập nhật' : 'Lưu hãng bay'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL: Thêm sân bay ══════════════ */}
      {modal === 'airport' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box modal-xl modal-wizard" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon-box"><span className="material-icons-round">connecting_airports</span></span>
                <div>
                  <h2>{editingItem ? 'Cập nhật sân bay' : 'Thêm sân bay'}</h2>
                  <p>{editingItem ? `Đang chỉnh sửa sân bay ${editingItem.code}` : 'Khai báo sân bay mới vào danh mục hệ thống'}</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}><span className="material-icons-round">close</span></button>
            </div>
            <div className="wizard-stepper">
              <div className={`wizard-step ${airportStep === 1 ? 'active' : airportStep > 1 ? 'completed' : ''}`} onClick={() => setAirportStep(1)}>
                <span className="step-num">{airportStep > 1 ? <span className="material-icons-round">check</span> : '1'}</span>
                <span className="step-label">Vị trí</span>
              </div>
              <div className={`step-line${airportStep > 1 ? ' done' : ''}`} />
              <div className={`wizard-step ${airportStep === 2 ? 'active' : ''}`} onClick={() => setAirportStep(2)}>
                <span className="step-num">2</span>
                <span className="step-label">Cấu hình</span>
              </div>
            </div>
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {airportStep === 1 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">location_on</span>Địa điểm</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Tên sân bay <span className="required">*</span></label>
                      <input type="text" placeholder="VD: Sân bay Tân Sơn Nhất" defaultValue={editingItem?.name || ''} />
                    </div>
                    <div className="form-group">
                      <label>Mã IATA <span className="required">*</span></label>
                      <input type="text" placeholder="VD: SGN" maxLength={3} className="mono-input" defaultValue={editingItem?.code || ''} />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Thành phố / Tỉnh <span className="required">*</span></label>
                      <input type="text" placeholder="VD: TP. Hồ Chí Minh" defaultValue={editingItem?.city || ''} />
                    </div>
                    <div className="form-group">
                      <label>Quốc gia <span className="required">*</span></label>
                      <input type="text" placeholder="VD: Việt Nam" defaultValue={editingItem?.country || 'Việt Nam'} />
                    </div>
                  </div>
                </div>
              )}
              {airportStep === 2 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">settings</span>Cấu hình & Trạng thái</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Loại sân bay</label>
                      <select defaultValue={editingItem?.type || 'Quốc tế'}>
                        <option>Quốc tế</option>
                        <option>Nội địa</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Số nhà ga</label>
                      <input type="number" min={1} defaultValue={editingItem?.terminals || 1} />
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Trạng thái hoạt động</label>
                    <div className="radio-group" style={{ marginTop: 8 }}>
                      <label className="radio-opt active-opt">
                        <input type="radio" name="ap-status" defaultChecked />
                        <span className="material-icons-round">check_circle</span> Hoạt động
                      </label>
                      <label className="radio-opt">
                        <input type="radio" name="ap-status" />
                        <span className="material-icons-round">pause_circle</span> Tạm ngừng
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <div className="spacer" />
              {airportStep > 1 && (
                <button className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setAirportStep(s => s - 1)}>
                  <span className="material-icons-round">arrow_back</span> Quay lại
                </button>
              )}
              {airportStep < 2 ? (
                <button className="btn-save" onClick={() => setAirportStep(s => s + 1)}>
                  Tiếp theo <span className="material-icons-round">arrow_forward</span>
                </button>
              ) : (
                <button className="btn-save" onClick={closeModal}>
                  <span className="material-icons-round">save</span> {editingItem ? 'Cập nhật' : 'Lưu sân bay'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ MODAL: Thêm tuyến bay ══════════════ */}
      {modal === 'route' && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="modal-box modal-xl modal-wizard" style={{ maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-icon-box"><span className="material-icons-round">route</span></span>
                <div>
                  <h2>Thêm tuyến bay</h2>
                  <p>Thiết lập tuyến đường bay mới trong hệ thống</p>
                </div>
              </div>
              <button className="modal-close" onClick={closeModal}><span className="material-icons-round">close</span></button>
            </div>
            <div className="wizard-stepper">
              <div className={`wizard-step ${routeStep === 1 ? 'active' : routeStep > 1 ? 'completed' : ''}`} onClick={() => setRouteStep(1)}>
                <span className="step-num">{routeStep > 1 ? <span className="material-icons-round">check</span> : '1'}</span>
                <span className="step-label">Hành trình</span>
              </div>
              <div className={`step-line${routeStep > 1 ? ' done' : ''}`} />
              <div className={`wizard-step ${routeStep === 2 ? 'active' : routeStep > 2 ? 'completed' : ''}`} onClick={() => setRouteStep(2)}>
                <span className="step-num">{routeStep > 2 ? <span className="material-icons-round">check</span> : '2'}</span>
                <span className="step-label">Thông số</span>
              </div>
              <div className={`step-line${routeStep > 2 ? ' done' : ''}`} />
              <div className={`wizard-step ${routeStep === 3 ? 'active' : ''}`} onClick={() => setRouteStep(3)}>
                <span className="step-num">3</span>
                <span className="step-label">Trạng thái</span>
              </div>
            </div>
            <div className="modal-body" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div className="route-preview-bar" style={{ marginBottom: '20px' }}>
                <div className="rp-airport">
                  <span className="material-icons-round">flight_takeoff</span>
                  <div>
                    <p className="rp-label">Điểm khởi hành</p>
                    <p className="rp-code">SGN</p>
                  </div>
                </div>
                <div className="rp-divider">
                  <div className="rp-line"></div>
                  <span className="material-icons-round">flight</span>
                  <div className="rp-line"></div>
                </div>
                <div className="rp-airport">
                  <span className="material-icons-round">flight_land</span>
                  <div>
                    <p className="rp-label">Điểm đến</p>
                    <p className="rp-code">HAN</p>
                  </div>
                </div>
              </div>

              {routeStep === 1 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">route</span>Thông tin hành trình</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Sân bay đi <span className="required">*</span></label>
                      <select>
                        <option value="SGN">SGN – Tân Sơn Nhất</option>
                        <option value="HAN">HAN – Nội Bài</option>
                        <option value="DAD">DAD – Đà Nẵng</option>
                        <option value="PQC">PQC – Phú Quốc</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Sân bay đến <span className="required">*</span></label>
                      <select>
                        <option value="HAN">HAN – Nội Bài</option>
                        <option value="SGN">SGN – Tân Sơn Nhất</option>
                        <option value="DAD">DAD – Đà Nẵng</option>
                        <option value="PQC">PQC – Phú Quốc</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Hãng khai thác <span className="required">*</span></label>
                      <select>
                        <option>Vietnam Airlines (VN)</option>
                        <option>VietJet Air (VJ)</option>
                        <option>Bamboo Airways (QH)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Mã tuyến <span className="required">*</span></label>
                      <input type="text" placeholder="VD: VN-201" className="mono-input" />
                    </div>
                  </div>
                </div>
              )}
              {routeStep === 2 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">analytics</span>Thông số & Giá vé</p>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Khoảng cách (km)</label>
                      <input type="number" placeholder="VD: 1137" />
                    </div>
                    <div className="form-group">
                      <label>Thời gian bay</label>
                      <input type="text" placeholder="VD: 2h 05m" />
                    </div>
                  </div>
                  <div className="form-row" style={{ marginBottom: 14 }}>
                    <div className="form-group">
                      <label>Tần suất</label>
                      <select>
                        <option>Hàng ngày</option>
                        <option>5 lần/tuần</option>
                        <option>3 lần/tuần</option>
                        <option>Theo mùa</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Giá vé cơ bản (đ) <span className="required">*</span></label>
                      <input type="number" placeholder="VD: 890000" />
                    </div>
                  </div>
                </div>
              )}
              {routeStep === 3 && (
                <div className="wizard-page">
                  <p className="wiz-section-title"><span className="material-icons-round">toggle_on</span>Trạng thái</p>
                  <div className="form-group" style={{ marginBottom: 14 }}>
                    <label>Trạng thái hoạt động</label>
                    <div className="radio-group" style={{ marginTop: 8 }}>
                      <label className="radio-opt active-opt">
                        <input type="radio" name="rt-status" defaultChecked />
                        <span className="material-icons-round">check_circle</span> Hoạt động
                      </label>
                      <label className="radio-opt">
                        <input type="radio" name="rt-status" />
                        <span className="material-icons-round">pause_circle</span> Tạm ngừng
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <div className="spacer" />
              {routeStep > 1 && (
                <button className="btn-cancel" style={{ display: 'flex', alignItems: 'center', gap: 6 }} onClick={() => setRouteStep(s => s - 1)}>
                  <span className="material-icons-round">arrow_back</span> Quay lại
                </button>
              )}
              {routeStep < 3 ? (
                <button className="btn-save" onClick={() => setRouteStep(s => s + 1)}>
                  Tiếp theo <span className="material-icons-round">arrow_forward</span>
                </button>
              ) : (
                <button className="btn-save" onClick={closeModal}>
                  <span className="material-icons-round">save</span> {editingItem ? 'Cập nhật' : 'Lưu tuyến bay'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); overflow-x: hidden; }
        .content { padding: var(--space-xl); max-width: 1300px; margin: 0 auto; width: 100%; }

        /* Page Header */
        .page-top-bar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: 16px; }
        .page-top-bar h1 { font-size: 24px; margin-bottom: 4px; display: flex; align-items: center; gap: 10px; }
        .subtitle-badge { font-size: 16px; font-weight: 400; color: var(--text-secondary); }
        .subtitle-text { font-size: 13px; color: var(--text-muted); }

        .date-filter-group { display: flex; gap: 4px; background: #f1f3f5; border-radius: 10px; padding: 4px; }
        .date-btn { padding: 7px 16px; border-radius: 8px; border: none; background: transparent; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-secondary); display: flex; align-items: center; gap: 6px; transition: all 0.2s; }
        .date-btn:hover { background: white; color: var(--text-main); }
        .date-btn.active { background: white; color: var(--primary); box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
        .date-btn .material-icons-round { font-size: 16px; }

        /* Tabs */
        .tabs-nav { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 2px; overflow-x: auto; scrollbar-width: none; }
        .tabs-nav::-webkit-scrollbar { display: none; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; background: transparent; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-secondary); border-bottom: 2px solid transparent; margin-bottom: -2px; border-radius: 6px 6px 0 0; transition: all 0.2s; white-space: nowrap; }
        .tab-btn:hover { background: #f5f7fa; color: var(--primary); }
        .tab-btn.active { color: var(--primary); border-bottom-color: var(--primary); background: #f0f4ff; }
        .tab-btn .material-icons-round { font-size: 18px; }

        /* Table Card */
        .tab-card { padding: 0; overflow: hidden; }
        .toolbar { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid var(--border); background: #fafbfc; }
        .search-box { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; background: white; min-width: 280px; transition: border-color 0.2s; }
        .search-box:focus-within { border-color: var(--primary); }
        .search-box .material-icons-round { color: var(--text-muted); font-size: 18px; }
        .search-box input { border: none; outline: none; background: transparent; font-size: 13px; width: 100%; }
        .filter-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-secondary); transition: all 0.2s; }
        .filter-btn:hover { border-color: var(--primary); color: var(--primary); }
        .filter-btn .material-icons-round { font-size: 18px; }
        .spacer { flex: 1; }
        .select-filter { position: relative; display: flex; align-items: center; border: 1px solid var(--border); border-radius: 8px; background: white; padding: 8px 14px; }
        .select-filter select { border: none; outline: none; background: transparent; font-size: 13px; padding-right: 20px; appearance: none; cursor: pointer; color: var(--text-main); }
        .select-filter .arrow-icon { position: absolute; right: 10px; pointer-events: none; font-size: 18px; color: var(--text-muted); }

        /* Data Table */
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 12px 20px; font-size: 11px; font-weight: 700; color: var(--text-secondary); background: #f8f9fa; border-bottom: 1px solid var(--border); text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table td { padding: 14px 20px; border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 13px; color: var(--text-main); }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: #fafbff; }

        /* Airline Logo */
        .airline-logo { display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 10px; font-weight: 800; font-size: 13px; letter-spacing: 0.5px; }
        .airline-logo.sm { width: 32px; height: 32px; font-size: 11px; border-radius: 8px; }

        /* Status */
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-pill .dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-pill.success { background: #e6f4ea; color: #137333; }
        .status-pill.success .dot { background: #137333; }
        .status-pill.warning { background: #fef7e0; color: #b06000; }
        .status-pill.warning .dot { background: #b06000; }
        .status-pill.danger { background: #fce8e6; color: #c5221f; }
        .status-pill.danger .dot { background: #c5221f; }
        .status-pill.inactive { background: #f1f3f4; color: #5f6368; }
        .status-pill.inactive .dot { background: #5f6368; }

        /* Misc badges */
        .mono-code { font-family: monospace; font-size: 13px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.5px; }
        .mono-code.primary { color: var(--primary); }
        .font-semibold { font-weight: 600; }
        .font-medium { font-weight: 500; }
        .font-bold { font-weight: 700; }
        .text-xs { font-size: 11px; }
        .text-muted { color: var(--text-muted); }
        .text-primary { color: var(--primary); }

        .airport-code { font-weight: 800; font-size: 16px; color: var(--primary); font-family: monospace; background: #f0f4ff; padding: 4px 10px; border-radius: 6px; }
        .type-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        .type-badge.intl { background: #e0e7ff; color: #3730a3; }
        .type-badge.dom { background: #e0f2fe; color: #0369a1; }
        .terminal-badge { display: inline-flex; align-items: center; gap: 4px; font-weight: 600; color: var(--text-secondary); }
        .terminal-badge .material-icons-round { font-size: 14px; }

        /* Route cell */
        .route-cell { display: flex; align-items: center; gap: 8px; }
        .airport-chip { font-family: monospace; font-weight: 700; font-size: 14px; background: #f3f4f6; padding: 2px 8px; border-radius: 4px; }
        .route-arrow { font-size: 16px; color: var(--primary); transform: rotate(45deg); }

        /* Action buttons */
        .action-row { display: flex; gap: 4px; }
        .icon-btn { background: transparent; border: none; cursor: pointer; width: 30px; height: 30px; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .icon-btn .material-icons-round { font-size: 18px; }
        .icon-btn.edit { color: var(--text-secondary); }
        .icon-btn.edit:hover { background: #e0e7ff; color: var(--primary); }
        .icon-btn.delete { color: var(--text-muted); }
        .icon-btn.delete:hover { background: #fce8e6; color: var(--danger); }

        /* Pagination */
        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 14px 20px; font-size: 13px; color: var(--text-secondary); background: #fafbfc; border-top: 1px solid var(--border); }
        .page-controls { display: flex; gap: 4px; }
        .page-btn { min-width: 32px; height: 32px; padding: 0 8px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 8px; background: white; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .page-btn:hover:not(.dots) { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .page-btn.dots { border: none; background: transparent; cursor: default; }

        /* ══ MODAL ══ */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(2px); animation: fadeIn 0.15s ease; padding: 16px; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-box { background: white; border-radius: 16px; width: 560px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,0.2); animation: slideUp 0.2s ease; overflow: hidden; }
        .modal-box.modal-lg { width: 700px; }
        @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 24px 16px; border-bottom: 1px solid var(--border); }
        .modal-title-row { display: flex; align-items: center; gap: 14px; }
        .modal-icon-box { width: 44px; height: 44px; border-radius: 12px; background: #e0e7ff; color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .modal-icon-box .material-icons-round { font-size: 22px; }
        .modal-header h2 { font-size: 18px; margin: 0 0 2px; }
        .modal-header p { font-size: 13px; color: var(--text-secondary); margin: 0; }
        .modal-close { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: var(--text-muted); transition: all 0.2s; display: flex; }
        .modal-close:hover { background: #f3f4f6; color: var(--text-main); }

        .modal-body { padding: 20px 24px; overflow-y: auto; overflow-x: hidden; flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--text-secondary); }
        .required { color: var(--danger); }
        .form-group input, .form-group select { padding: 10px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; transition: border-color 0.2s; color: var(--text-main); background: white; box-sizing: border-box; width: 100%; }
        .form-group input:focus, .form-group select:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .mono-input { font-family: monospace; font-weight: 700; letter-spacing: 1px; }
        .color-input { padding: 4px; height: 40px; cursor: pointer; border-radius: 8px; }

        .radio-group { display: flex; gap: 12px; }
        .radio-opt { display: flex; align-items: center; gap: 8px; padding: 10px 16px; border: 1px solid var(--border); border-radius: 10px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s; flex: 1; }
        .radio-opt input { display: none; }
        .radio-opt:hover { border-color: var(--primary); background: #f4f8ff; }
        .radio-opt .material-icons-round { font-size: 18px; color: var(--text-muted); }
        .active-opt { color: #137333; }
        .active-opt .material-icons-round { color: #137333; }

        /* Route preview bar */
        .route-preview-bar { display: flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #f0f4ff, #e0f2fe); border-radius: 12px; padding: 16px 20px; margin-bottom: 4px; }
        .rp-airport { display: flex; align-items: center; gap: 10px; flex: 1; }
        .rp-airport .material-icons-round { font-size: 24px; color: var(--primary); }
        .rp-label { font-size: 11px; color: var(--text-secondary); margin-bottom: 2px; }
        .rp-code { font-size: 22px; font-weight: 800; font-family: monospace; color: var(--text-main); }
        .rp-divider { display: flex; align-items: center; gap: 6px; flex: 1; }
        .rp-line { flex: 1; height: 1px; border-top: 2px dashed #93c5fd; }
        .rp-divider .material-icons-round { font-size: 22px; color: var(--primary); transform: rotate(45deg); }

        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid var(--border); background: #fafbfc; border-radius: 0 0 16px 16px; }
        .btn-cancel { padding: 10px 20px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--text-secondary); transition: all 0.2s; }
        .btn-cancel:hover { border-color: var(--text-secondary); color: var(--text-main); }
        .btn-save { display: flex; align-items: center; gap: 6px; padding: 10px 24px; border: none; border-radius: 8px; background: var(--primary); color: white; cursor: pointer; font-size: 14px; font-weight: 600; transition: background 0.2s; }
        .btn-save:hover { background: #1d4ed8; }
        .btn-save .material-icons-round { font-size: 18px; }

        /* Toolbar button fix */
        .toolbar button { white-space: nowrap; flex-shrink: 0; }
        .toolbar .spacer + button, .toolbar .spacer + .btn { margin-left: auto; }

        /* Flight tab extras */
        .input-date { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 8px; padding: 8px 14px; background: white; }
        .input-date .material-icons-round { color: var(--text-muted); font-size: 18px; }
        .input-date input { border: none; outline: none; font-size: 13px; background: transparent; color: var(--text-main); }
        .text-sm { font-size: 13px; }
        .status-pill.danger { background: #fce8e6; color: #c5221f; }
        .status-pill.danger .dot { background: #c5221f; }
        .seat-info { display: flex; flex-direction: column; gap: 4px; min-width: 100px; }
        .seat-bar { height: 6px; background: #e5e7eb; border-radius: 99px; overflow: hidden; }
        .seat-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }

        /* Modal XL */
        .modal-box.modal-xl { width: 760px; }
        .bg-green { background: #dcfce7 !important; color: #16a34a !important; }

        /* Form sections (Accordion style as requested) */
        .form-section { border: 1px solid #e2e8f0; border-radius: 16px; padding: 0; background: white; overflow: hidden; margin-bottom: 12px; transition: all 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.02); }
        .form-section:hover { border-color: var(--primary); box-shadow: 0 4px 12px rgba(37,99,235,0.05); }
        .form-section-title { display: flex; align-items: center; gap: 12px; font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; padding: 20px 24px; cursor: pointer; user-select: none; }
        .form-section-title .material-icons-round { font-size: 22px; color: var(--primary); }
        .form-section-content { padding: 0 24px 24px; }
        .form-row-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
        .input-prefix { display: flex; align-items: center; border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: white; transition: all 0.2s; box-sizing: border-box; }
        .input-prefix:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .input-prefix span { padding: 10px 14px; background: #f8fafc; color: #64748b; font-weight: 700; font-size: 13px; border-right: 1px solid var(--border); flex-shrink: 0; }
        .input-prefix input { flex: 1; border: none; outline: none; padding: 10px 12px; font-size: 14px; background: transparent; min-width: 0; width: 100%; box-sizing: border-box; font-weight: 500; }
        .form-textarea { width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 10px; font-size: 14px; outline: none; resize: vertical; font-family: inherit; transition: all 0.2s; box-sizing: border-box; background: white; }
        .form-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .form-textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }

        /* Enhanced List Styles */
        .flight-cell { display: flex; align-items: center; gap: 12px; }
        .route-cell-v2 { display: flex; align-items: center; gap: 8px; background: #f8fafc; padding: 6px 12px; border-radius: 8px; border: 1px solid #e2e8f0; width: fit-content; }
        .rt-code { font-family: monospace; font-weight: 800; font-size: 15px; color: var(--primary); }
        .rt-line-box { display: flex; align-items: center; gap: 4px; color: #94a3b8; }
        .rt-line { width: 30px; height: 1px; background: #cbd5e1; position: relative; }
        .rt-line-box .material-icons-round { font-size: 16px; transform: rotate(90deg); }
        
        .schedule-cell { display: flex; flex-direction: column; gap: 4px; }
        .sch-date { font-size: 12px; color: #64748b; display: flex; align-items: center; gap: 4px; font-weight: 500; }
        .sch-date .material-icons-round { font-size: 14px; }
        .sch-time { display: flex; align-items: center; gap: 6px; font-size: 14px; }
        .sch-time .material-icons-round { font-size: 14px; color: #94a3b8; }

        .aircraft-cell { display: flex; align-items: center; gap: 10px; }
        .aircraft-cell .material-icons-round { color: #64748b; font-size: 20px; }

        .seat-info-v2 { width: 120px; }
        .seat-label { display: flex; justify-content: space-between; font-size: 11px; font-weight: 600; color: #475569; margin-bottom: 6px; }
        .seat-label .pct { color: #64748b; }
        .seat-bar { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; border: 1px solid #e2e8f0; }
        .seat-fill { height: 100%; border-radius: 10px; transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1); }

        /* Wizard Styles */
        .modal-wizard { padding: 0 !important; display: flex; flex-direction: column; overflow: hidden; }
        .wizard-stepper { display: flex; align-items: center; justify-content: space-between; padding: 24px 40px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
        .wizard-step { display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; position: relative; z-index: 2; transition: all 0.2s; min-width: 60px; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; background: white; border: 2px solid #cbd5e1; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #64748b; transition: all 0.2s; }
        .step-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .wizard-step.active .step-num { border-color: var(--primary); background: var(--primary); color: white; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .wizard-step.active .step-label { color: var(--primary); }
        .wizard-step.completed .step-num { border-color: #10b981; background: #10b981; color: white; }
        .wizard-step.completed .step-label { color: #10b981; }
        .wizard-step.completed .material-icons-round { font-size: 18px; }

        .step-line { flex: 1; height: 2px; background: #e2e8f0; margin: 0 10px; margin-bottom: 22px; position: relative; }
        .step-line.done { background: #10b981; }

        .wizard-content-wrapper { flex: 1; overflow-y: auto; padding: 24px; min-height: 380px; position: relative; background: #fff; }
        .wizard-page { animation: slideInRight 0.3s ease-out; }
        @keyframes slideInRight { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .wiz-section-title { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: var(--primary); margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 2px solid #e0e7ff; }
        .wiz-section-title .material-icons-round { font-size: 20px; }

        /* Horizontal Scroll fix for table */
        .table-responsive { width: 100%; overflow-x: auto; scrollbar-width: thin; scrollbar-color: #cbd5e1 transparent; margin-bottom: 12px; }
        .table-responsive::-webkit-scrollbar { height: 6px; }
        .table-responsive::-webkit-scrollbar-track { background: transparent; }
        .table-responsive::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .table-responsive::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
    </div>
  );
};

export default SettingsPage;
