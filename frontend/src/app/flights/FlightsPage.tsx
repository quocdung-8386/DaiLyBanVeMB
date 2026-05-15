import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout, { showToast } from '../../components/AppLayout';
import DatePicker from '../../components/DatePicker';

interface FlightsPageProps {
  onNavigate?: (id: string) => void;
  onSelectFlight?: (flight: any) => void;
  flights: any[];
  bookings?: any[];
  onAddFlight?: (flight: any) => void;
  onUpdateFlight?: (id: string, aircraft: string, gate: string) => void;
  onDeleteFlight?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const airlineStyle: Record<string,{bg:string,color:string}> = {
  VN: { bg:'#005a8c', color:'white' }, VJ: { bg:'#ed1b24', color:'white' }, QH: { bg:'#00a563', color:'white' }
};

const FlightsPage: React.FC<FlightsPageProps> = ({ 
  onNavigate, onSelectFlight, flights, bookings = [], onAddFlight, onUpdateFlight, onDeleteFlight,
  currentUser, onLogout, bookingPendingCount, flightCount, passengerCount
}) => {
  const [stops, setStops] = useState<string[]>(['0']);
  const [airlines, setAirlines] = useState<string[]>(['VN', 'VJ', 'QH']);
  const [viewingFlight, setViewingFlight] = useState<any | null>(null);
  const [editingFlight, setEditingFlight] = useState<any | null>(null);
  const [deletingFlight, setDeletingFlight] = useState<any | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState<'price'|'dep'|'dur'>('price');
  const [showSearchModal, setShowSearchModal] = useState(false);
  
  // Search Form State
  const [searchForm, setSearchForm] = useState({
    from: 'HAN',
    to: 'SGN',
    date: new Date().toISOString().split('T')[0],
    pax: '1',
    class: 'Economy',
    airline: 'all'
  });

  // Flight Form State for Add/Edit — map tới ChuyenBay schema
  const [flightForm, setFlightForm] = useState({
    flight: '',          // ma_cb
    code: 'VNA',         // ma_hang
    from: 'HAN',         // ma_sb_di (via TuyenBay)
    to: 'SGN',           // ma_sb_den (via TuyenBay)
    dep: '08:00',        // ngay_gio_di (HH:MM)
    arr: '10:00',        // ngay_gio_den (HH:MM)
    price: 1500000,      // gia_co_ban
    cap: 180,            // tong_so_ghe
    status: 'Đang bán vé', // trang_thai
    aircraft: 'Airbus A321', // ma_may_bay
    gate: '--',          // cong_khoi_hanh
    nha_ga: 'T1',        // nha_ga
    thoi_gian_bay: 120,  // thoi_gian_bay (phút)
  });

  React.useEffect(() => {
    if (editingFlight) {
      setFlightForm({
        flight: editingFlight.flight || '',
        code: editingFlight.code || 'VNA',
        from: editingFlight.from || 'HAN',
        to: editingFlight.to || 'SGN',
        dep: editingFlight.dep || '08:00',
        arr: editingFlight.arr || '10:00',
        price: editingFlight.price || 0,
        cap: editingFlight.cap || 180,
        status: editingFlight.status || 'Đang bán vé',
        aircraft: editingFlight.aircraft || editingFlight.ma_may_bay || 'Airbus A321',
        gate: editingFlight.gate || editingFlight.cong_khoi_hanh || '--',
        nha_ga: editingFlight.nha_ga || 'T1',
        thoi_gian_bay: editingFlight.thoi_gian_bay || 120,
      });
    } else {
      setFlightForm({
        flight: '', code: 'VNA', from: 'HAN', to: 'SGN',
        dep: '08:00', arr: '10:00', price: 1500000, cap: 180,
        status: 'Đang bán vé', aircraft: 'Airbus A321',
        gate: '--', nha_ga: 'T1', thoi_gian_bay: 120,
      });
    }
  }, [editingFlight, showAddModal]);

  const handleSwapRoute = () => {
    setSearchForm(prev => ({ ...prev, from: prev.to, to: prev.from }));
  };

  const handleUpdateSearch = () => {
    // In a real app, this would trigger a new API call
    console.log('Updating search with:', searchForm);
    setShowSearchModal(false);
  };

  const toggleStop = (val: string) => setStops(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  const toggleAirline = (val: string) => setAirlines(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleSelectFlight = (f: any) => {
    if (onSelectFlight) {
      onSelectFlight({
        id: f.flight,
        airline: f.name,
        logo: f.code,
        bg: airlineStyle[f.code]?.bg || '#0e74be',
        departure: f.dep,
        arrival: f.arr,
        from: f.from,
        to: f.to,
        duration: f.dur,
        price: f.price,
        cls: searchForm.class || 'Economy',
        gate: f.gate,
        aircraft: f.aircraft
      });
    }
    if (onNavigate) {
      onNavigate('create_booking');
    }
  };

  const filteredFlights = (flights || [])
    .filter(f => airlines.includes(f.code))
    .filter(f => stops.includes(String(f.stops)))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'dep') return a.dep.localeCompare(b.dep);
      return a.dur.localeCompare(b.dur);
    });

  const validFlights = [...filteredFlights].filter(f => (f.cap - f.seatsSold) > 0);
  const cheapest = validFlights.length > 0 ? [...validFlights].sort((a,b) => a.price - b.price)[0] : null;

  return (
    <AppLayout 
      activeItem="flights" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      bookings={bookings}
      breadcrumb={[{ label: 'Điều hành', page: 'dashboard' }, { label: 'Quản lý Chuyến bay' }]}
    >
      <div className="flights-page-content">
        
        {/* ── OPERATION HEADER ── */}
        <div className="operation-header">
          <div className="header-meta">
            <h1>Điều hành Chuyến bay</h1>
            <p>Quản lý lịch bay, tình trạng ghế và danh sách hành khách thời gian thực.</p>
          </div>
          <div className="header-actions">
            <Button variant="outline">
              <span className="material-icons-round">sync</span>
              Làm mới dữ liệu
            </Button>
            <Button className="btn-primary-gradient" onClick={() => setShowAddModal(true)}>
              <span className="material-icons-round">add</span>
              Tạo chuyến mới
            </Button>
          </div>
        </div>

        {/* ── QUICK SEARCH BAR ── */}
        <Card className="quick-search-bar">
          <div className="q-search-grid">
            <div className="q-input-group">
              <label>HÀNH TRÌNH</label>
              <div className="q-route-display">
                <span className="code">{searchForm.from}</span>
                <span className="material-icons-round separator">multiple_stop</span>
                <span className="code">{searchForm.to}</span>
              </div>
            </div>
            <div className="q-input-group">
              <label>NGÀY BAY</label>
              <div className="q-val">{new Date(searchForm.date).toLocaleDateString('vi-VN')}</div>
            </div>
            <div className="q-input-group">
              <label>HÀNG KHÔNG</label>
              <div className="q-val">{searchForm.airline === 'all' ? 'Tất cả hãng' : searchForm.airline}</div>
            </div>
            <div className="q-action">
              <button className="edit-search-btn" onClick={() => setShowSearchModal(true)}>
                <span className="material-icons-round">edit</span>
                Thay đổi tìm kiếm
              </button>
            </div>
          </div>
        </Card>

        <div className="flights-main-layout">
          
          {/* ── LEFT: Filters ── */}
          <aside className="flights-sidebar">
            <Card className="filter-card">
              <div className="f-header">
                <h3>Bộ lọc nâng cao</h3>
                <button onClick={() => { setAirlines(['VN','VJ','QH']); setStops(['0']); }}>Đặt lại</button>
              </div>

              <div className="f-section">
                <label className="f-label">Hãng hàng không</label>
                <div className="f-list">
                  {Object.keys(airlineStyle).map(code => (
                    <label key={code} className="f-checkbox">
                      <input type="checkbox" checked={airlines.includes(code)} onChange={() => toggleAirline(code)} />
                      <div className="f-check-ui" style={{ '--accent': airlineStyle[code].bg } as any}></div>
                      <span className="f-text">{code === 'VN' ? 'Vietnam Airlines' : code === 'VJ' ? 'Vietjet Air' : 'Bamboo Airways'}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="f-section">
                <label className="f-label">Kiểu hành trình</label>
                <div className="f-list">
                  <label className="f-checkbox">
                    <input type="checkbox" checked={stops.includes('0')} onChange={() => toggleStop('0')} />
                    <div className="f-check-ui"></div>
                    <span className="f-text">Bay thẳng (Non-stop)</span>
                  </label>
                  <label className="f-checkbox">
                    <input type="checkbox" checked={stops.includes('1')} onChange={() => toggleStop('1')} />
                    <div className="f-check-ui"></div>
                    <span className="f-text">1 điểm dừng</span>
                  </label>
                </div>
              </div>

              <div className="f-promo-box">
                <span className="material-icons-round">bolt</span>
                <p>Ưu tiên các chuyến bay <b>mở bán sớm</b> để có giá tốt nhất cho đại lý.</p>
              </div>
            </Card>
          </aside>

          {/* ── RIGHT: Main Area ── */}
          <div className="flights-body">
            
            <div className="body-top-nav">
              <div className="flight-counter">
                Tìm thấy <b>{filteredFlights.length}</b> chuyến bay
              </div>
              <div className="sort-switcher">
                {[
                  { id: 'price', label: 'Giá thấp nhất', icon: 'payments' },
                  { id: 'dep', label: 'Khởi hành sớm', icon: 'schedule' },
                  { id: 'dur', label: 'Bay nhanh nhất', icon: 'speed' },
                ].map(tab => (
                  <button 
                    key={tab.id} 
                    className={sortBy === tab.id ? 'active' : ''} 
                    onClick={() => setSortBy(tab.id as any)}
                  >
                    <span className="material-icons-round">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flight-grid">
              {filteredFlights.map(f => {
                // Calculate dynamic seatsSold from global bookings prop
                const flightBookings = (bookings || []).filter(b => 
                  (b.flight === f.flight || b.flight === f.id) && 
                  b.status !== 'Đã hủy'
                );
                const dynamicSeatsSold = flightBookings.reduce((sum, b) => sum + (b.passengersList?.length || b.pax || 1), 0);
                const currentSeatsSold = dynamicSeatsSold || f.seatsSold || 0;
                const currentCap = f.cap || 180;

                return (
                  <Card key={f.id} className={`flight-card-premium ${f.status === 'Đã đóng chuyến' ? 'is-closed' : ''}`}>
                  <div className="f-top">
                    <div className="f-airline-info">
                      <div className="f-logo-wrapper" style={{ background: airlineStyle[f.code]?.bg }}>
                        <span className="material-icons-round">airplanemode_active</span>
                      </div>
                      <div>
                        <div className="f-airline-row">
                          <span className="f-name">{f.name}</span>
                          <span className="f-code-tag">{f.flight}</span>
                        </div>
                        <span className="f-aircraft">{f.aircraft}</span>
                      </div>
                    </div>
                    <div className="f-badges">
                      {f.badge && <span className="f-badge premium">{f.badge}</span>}
                      <span className={`f-status-tag ${f.status === 'Đã đóng chuyến' ? 'danger' : 'success'}`}>
                        {f.status}
                      </span>
                    </div>
                  </div>

                  <div className="f-main-route">
                    <div className="route-node">
                      <h2 className="time">{f.dep}</h2>
                      <p className="airport">{f.from}</p>
                    </div>
                    <div className="route-visual">
                      <span className="duration">{f.dur}</span>
                      <div className="path-ui">
                        <div className="dot"></div>
                        <div className="line"></div>
                        <span className="material-icons-round">flight_takeoff</span>
                        <div className="line"></div>
                        <div className="dot"></div>
                      </div>
                      <span className="stop-info">Non-stop</span>
                    </div>
                    <div className="route-node text-right">
                      <h2 className="time">{f.arr}</h2>
                      <p className="airport">{f.to}</p>
                    </div>
                  </div>

                  <div className="f-footer">
                    <div className="f-meta-stats">
                      <div className="stat">
                        <span className="material-icons-round">groups</span>
                        <span className="stat-label"><b>{currentSeatsSold}</b>/{currentCap} ghế</span>
                      </div>
                      <div className="stat-progress">
                         <div className="progress-bar">
                             <div className="progress-fill" style={{ width: `${(currentSeatsSold / currentCap) * 100}%` }}></div>
                         </div>
                      </div>
                    </div>
                    <div className="f-pricing-block">
                      <div className="price-group">
                        <span className="label">Chỉ từ</span>
                        <h2 className="price-val">{f.price.toLocaleString('vi')} đ</h2>
                      </div>
                      <div className="f-actions">
                        <button className="btn-icon-alt" title="Chỉnh sửa" onClick={() => setEditingFlight(f)}><span className="material-icons-round">edit</span></button>
                        <button className="btn-icon-alt danger" title="Hủy chuyến" onClick={() => setDeletingFlight(f)}><span className="material-icons-round">delete</span></button>
                        <button className="btn-details" onClick={() => setViewingFlight(f)}>Chi tiết</button>
                         {currentCap - currentSeatsSold > 0 ? (
                          <button className="btn-book" onClick={() => handleSelectFlight(f)}>Đặt chỗ</button>
                        ) : (
                          <button className="btn-sold-out" disabled>Hết vé</button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Search Edit Modal ── */}
      {showSearchModal && (
        <div className="modal-backdrop search-backdrop" onClick={() => setShowSearchModal(false)}>
          <div className="search-edit-modal-premium" onClick={e => e.stopPropagation()}>
            <div className="s-modal-left">
               <div className="s-modal-tag">CÀI ĐẶT TÌM KIẾM</div>
               <h2>Cập nhật hành trình</h2>
               <p>Thay đổi điểm đến, thời gian hoặc hãng hàng không để tìm kiếm chuyến bay phù hợp nhất.</p>
               
               <div className="s-modal-illustration">
                  <span className="material-icons-round">travel_explore</span>
               </div>
            </div>

            <div className="s-modal-right">
              <button className="s-close-btn" onClick={() => setShowSearchModal(false)}>
                <span className="material-icons-round">close</span>
              </button>
              
              <div className="s-form-container">
                <div className="s-form-group-full">
                   <label>ĐIỂM ĐI & ĐIỂM ĐẾN</label>
                   <div className="s-route-picker-box">
                      <div className="s-loc-field">
                         <span className="material-icons-round">flight_takeoff</span>
                         <select 
                           value={searchForm.from} 
                           onChange={e => setSearchForm(prev => ({...prev, from: e.target.value}))}
                         >
                            <option value="HAN">Hà Nội (HAN)</option>
                            <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                            <option value="DAD">Đà Nẵng (DAD)</option>
                            <option value="PQC">Phú Quốc (PQC)</option>
                         </select>
                      </div>
                      <button className="s-swap-btn" onClick={handleSwapRoute}>
                        <span className="material-icons-round">sync_alt</span>
                      </button>
                      <div className="s-loc-field">
                         <span className="material-icons-round">flight_land</span>
                         <select 
                           value={searchForm.to} 
                           onChange={e => setSearchForm(prev => ({...prev, to: e.target.value}))}
                         >
                            <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                            <option value="HAN">Hà Nội (HAN)</option>
                            <option value="DAD">Đà Nẵng (DAD)</option>
                            <option value="PQC">Phú Quốc (PQC)</option>
                         </select>
                      </div>
                   </div>
                </div>

                <div className="s-grid-2">
                  <div className="s-form-group">
                    <label>NGÀY KHỞI HÀNH</label>
                    <div className="s-input-wrapper">
                        <span className="material-icons-round">calendar_today</span>
                        <div style={{ flex: 1 }}>
                          <DatePicker 
                            value={searchForm.date}
                            onChange={(val) => setSearchForm(prev => ({...prev, date: val}))}
                          />
                        </div>
                    </div>
                  </div>
                  <div className="s-form-group">
                    <label>HÀNH KHÁCH</label>
                    <div className="s-input-wrapper">
                        <span className="material-icons-round">person_add</span>
                        <select 
                          value={searchForm.pax}
                          onChange={e => setSearchForm(prev => ({...prev, pax: e.target.value}))}
                        >
                           <option value="1">1 Người lớn</option>
                           <option value="2">2 Người lớn</option>
                           <option value="3">3 Người lớn</option>
                           <option value="4">4 Người lớn</option>
                        </select>
                    </div>
                  </div>
                </div>

                <div className="s-grid-2">
                  <div className="s-form-group">
                    <label>HẠNG DỊCH VỤ</label>
                    <div className="s-input-wrapper">
                        <span className="material-icons-round">airline_seat_recline_extra</span>
                        <select 
                          value={searchForm.class}
                          onChange={e => setSearchForm(prev => ({...prev, class: e.target.value}))}
                        >
                          <option value="Economy">Economy</option>
                          <option value="Premium Economy">Premium Economy</option>
                          <option value="Business">Business</option>
                          <option value="First Class">First Class</option>
                        </select>
                    </div>
                  </div>
                  <div className="s-form-group">
                    <label>HÃNG BAY ƯU TIÊN</label>
                    <div className="s-input-wrapper">
                        <span className="material-icons-round">verified</span>
                        <select 
                          value={searchForm.airline}
                          onChange={e => setSearchForm(prev => ({...prev, airline: e.target.value}))}
                        >
                          <option value="all">Tất cả hãng</option>
                          <option value="VN">Vietnam Airlines</option>
                          <option value="VJ">Vietjet Air</option>
                          <option value="QH">Bamboo Airways</option>
                        </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="s-modal-footer">
                <button className="btn-cancel-flat" onClick={() => setShowSearchModal(false)}>Hủy bỏ</button>
                <button className="btn-update-premium" onClick={handleUpdateSearch}>
                   CẬP NHẬT TÌM KIẾM
                   <span className="material-icons-round">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Flight Details Sidebar/Modal ── */}
      {viewingFlight && (
        <div className="modal-backdrop" onClick={() => setViewingFlight(null)}>
          <div className="flight-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title">
                <div className="d-icon" style={{ background: airlineStyle[viewingFlight.code]?.bg }}>
                  <span className="material-icons-round">analytics</span>
                </div>
                <div>
                  <h3>Chi tiết vận hành</h3>
                  <p>Chuyến bay {viewingFlight.flight} • {viewingFlight.from} → {viewingFlight.to}</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setViewingFlight(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>

            <div className="drawer-content">
              {/* Manifest Overview */}
              <div className="manifest-header">
                 <div className="m-stat">
                    <label>Tổng ghế</label>
                    <p>{viewingFlight.cap}</p>
                 </div>
                 <div className="m-stat">
                    <label>Đã bán</label>
                    <p className="text-primary">{viewingFlight.seatsSold}</p>
                 </div>
                 <div className="m-stat">
                    <label>Còn lại</label>
                    <p className="text-success">{viewingFlight.cap - viewingFlight.seatsSold}</p>
                 </div>
                 <div className="m-stat">
                    <label>Tỉ lệ lấp đầy</label>
                    <p>{Math.round((viewingFlight.seatsSold / viewingFlight.cap) * 100)}%</p>
                 </div>
              </div>

              <div className="manifest-table-box">
                <div className="table-title">
                   <h4>Danh sách hành khách (Manifest)</h4>
                   <div className="table-actions">
                      <button><span className="material-icons-round">download</span> Xuất Excel</button>
                      <button><span className="material-icons-round">print</span> In danh sách</button>
                   </div>
                </div>
                <table className="manifest-table-premium">
                  <thead>
                    <tr>
                      <th>Hành khách</th>
                      <th>Hạng vé</th>
                      <th>Ghế</th>
                      <th>Mã vé</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const manifest: any[] = [];
                      bookings.forEach(b => {
                        if (b.flight === viewingFlight.flight || b.flight === viewingFlight.id) {
                          if (b.passengersList && b.passengersList.length > 0) {
                            b.passengersList.forEach((p: any) => {
                              manifest.push({
                                name: p.name || b.customer,
                                class: p.hang_ghe || b.fareClass || 'Economy',
                                seat: p.seat || '---',
                                ticketNum: p.ma_ve || b.pnr || '---',
                                status: p.trang_thai_ve || 'Đã xác nhận'
                              });
                            });
                          } else {
                            manifest.push({
                              name: b.customer,
                              class: b.fareClass || 'Economy',
                              seat: b.seat || '---',
                              ticketNum: b.pnr || '---',
                              status: 'Đã xác nhận'
                            });
                          }
                        }
                      });

                      if (manifest.length === 0) {
                        return (
                          <tr>
                            <td colSpan={5} style={{textAlign: 'center', padding: '20px', color: '#64748b'}}>Chưa có hành khách đặt chỗ trên chuyến bay này.</td>
                          </tr>
                        );
                      }

                      return manifest.map((pax, idx) => (
                        <tr key={idx}>
                          <td>
                            <div className="pax-cell">
                              <div className="pax-avatar">{pax.name.charAt(0).toUpperCase()}</div>
                              <div>
                                 <p className="pax-name">{pax.name.toUpperCase()}</p>
                                 <p className="pax-meta">Hành khách</p>
                              </div>
                            </div>
                          </td>
                          <td><span className="cls-tag">{pax.class}</span></td>
                          <td><b className="seat-num">{pax.seat}</b></td>
                          <td><span className="ticket-num">{pax.ticketNum}</span></td>
                          <td><span className={`status-dot-tag ${pax.status === 'Đã hủy' ? 'failed' : 'active'}`}>{pax.status}</span></td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="drawer-footer">
              <Button variant="outline" onClick={() => setViewingFlight(null)}>Đóng chi tiết</Button>
              <Button onClick={() => handleSelectFlight(viewingFlight)}>Tiếp tục đặt chỗ</Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add/Edit Flight Premium Modal ── */}
      {(showAddModal || editingFlight) && (
        <div className="modal-backdrop search-backdrop" onClick={() => { setShowAddModal(false); setEditingFlight(null); }}>
          <div className="premium-admin-modal" onClick={e => e.stopPropagation()}>
             <div className="pa-sidebar">
                <div className="pa-tag">{editingFlight ? 'HIỆU CHỈNH' : 'TẠO MỚI'}</div>
                <h2>{editingFlight ? 'Cập nhật chuyến bay' : 'Thêm chuyến bay mới'}</h2>
                <p>Nhập thông tin chi tiết để thiết lập lịch trình bay và giá vé cho hệ thống.</p>
                
                <div className="pa-steps">
                   <div className="pa-step active">
                      <div className="step-num">1</div>
                      <div className="step-text">Thông tin cơ bản</div>
                   </div>
                   <div className="pa-step">
                      <div className="step-num">2</div>
                      <div className="step-text">Lịch trình & Giá</div>
                   </div>
                </div>
                
                <div className="pa-illustration">
                   <span className="material-icons-round">flight_takeoff</span>
                </div>
             </div>

             <div className="pa-main">
                <button className="pa-close" onClick={() => { setShowAddModal(false); setEditingFlight(null); }}>
                   <span className="material-icons-round">close</span>
                </button>

                <div className="pa-form-scroll">
                   {/* ── Nhóm 1: THÔNG TIN CHUNG ── */}
                   <div className="pa-section">
                      <h4>THÔNG TIN CHUNG</h4>
                      <div className="pa-grid">
                         <div className="pa-field">
                            <label>HÃNG HÀNG KHÔNG</label>
                            <select value={flightForm.code} onChange={e => setFlightForm({...flightForm, code: e.target.value})}>
                               <option value="VNA">Vietnam Airlines</option>
                               <option value="VJ">Vietjet Air</option>
                               <option value="QH">Bamboo Airways</option>
                               <option value="VN">Vietravel Airlines</option>
                            </select>
                         </div>
                         <div className="pa-field">
                            <label>SỐ HIỆU CHUYẾN BAY</label>
                            <input type="text" placeholder="VD: VN123"
                              value={flightForm.flight}
                              onChange={e => setFlightForm({...flightForm, flight: e.target.value})}
                              disabled={!!editingFlight}
                            />
                         </div>
                      </div>
                      <div className="pa-grid">
                         <div className="pa-field">
                            <label>ĐIỂM ĐI</label>
                            <select value={flightForm.from} onChange={e => setFlightForm({...flightForm, from: e.target.value})}>
                               <option value="HAN">Hà Nội (HAN)</option>
                               <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                               <option value="DAD">Đà Nẵng (DAD)</option>
                               <option value="PQC">Phú Quốc (PQC)</option>
                            </select>
                         </div>
                         <div className="pa-field">
                            <label>ĐIỂM ĐẾN</label>
                            <select value={flightForm.to} onChange={e => setFlightForm({...flightForm, to: e.target.value})}>
                               <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                               <option value="HAN">Hà Nội (HAN)</option>
                               <option value="DAD">Đà Nẵng (DAD)</option>
                               <option value="PQC">Phú Quốc (PQC)</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   {/* ── Nhóm 2: LỊCH TRÌNH & GIÁ ── */}
                   <div className="pa-section">
                      <h4>LỊCH TRÌNH &amp; GIÁ</h4>
                      <div className="pa-grid">
                         <div className="pa-field">
                            <label>GIỜ CẤT CÁNH</label>
                            <input type="text" placeholder="HH:MM"
                              value={flightForm.dep}
                              onChange={e => setFlightForm({...flightForm, dep: e.target.value})}
                            />
                         </div>
                         <div className="pa-field">
                            <label>GIỜ HẠ CÁNH</label>
                            <input type="text" placeholder="HH:MM"
                              value={flightForm.arr}
                              onChange={e => setFlightForm({...flightForm, arr: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="pa-grid">
                         <div className="pa-field">
                            <label>THỜI GIAN BAY (phút)</label>
                            <input type="number" placeholder="120"
                              value={flightForm.thoi_gian_bay}
                              onChange={e => setFlightForm({...flightForm, thoi_gian_bay: parseInt(e.target.value) || 0})}
                            />
                         </div>
                         <div className="pa-field">
                            <label>TỔNG SỐ GHẾ</label>
                            <input type="number" placeholder="180"
                              value={flightForm.cap}
                              onChange={e => setFlightForm({...flightForm, cap: parseInt(e.target.value) || 180})}
                            />
                         </div>
                      </div>
                      <div className="pa-grid">
                         <div className="pa-field">
                            <label>GIÁ VÉ CƠ BẢN (VNĐ)</label>
                            <input type="number" placeholder="0"
                              value={flightForm.price}
                              onChange={e => setFlightForm({...flightForm, price: parseInt(e.target.value) || 0})}
                            />
                         </div>
                         <div className="pa-field">
                            <label>MÁY BAY</label>
                            <input type="text" placeholder="VD: Airbus A321"
                              value={flightForm.aircraft}
                              onChange={e => setFlightForm({...flightForm, aircraft: e.target.value})}
                            />
                         </div>
                      </div>
                   </div>

                   {/* ── Nhóm 3: CẢNG & NHÀ GA ── */}
                   <div className="pa-section">
                      <h4>CẢNG KHỞI HÀNH &amp; NHÀ GA</h4>
                      <div className="pa-grid">
                         <div className="pa-field">
                            <label>CỔNG KHỞI HÀNH</label>
                            <input type="text" placeholder="VD: A01, B12, --"
                              value={flightForm.gate}
                              onChange={e => setFlightForm({...flightForm, gate: e.target.value})}
                            />
                         </div>
                         <div className="pa-field">
                            <label>NHÀ GA</label>
                            <select value={flightForm.nha_ga} onChange={e => setFlightForm({...flightForm, nha_ga: e.target.value})}>
                               <option value="T1">T1 — Nhà ga quốc nội</option>
                               <option value="T2">T2 — Nhà ga quốc tế</option>
                               <option value="T3">T3 — Nhà ga mới</option>
                               <option value="--">Chưa xác định</option>
                            </select>
                         </div>
                      </div>
                   </div>

                   {/* ── Nhóm 4: TRẠNG THÁI ── */}
                   <div className="pa-section">
                      <h4>TRẠNG THÁI VẬN HÀNH</h4>
                      <div className="pa-field">
                         <div className="pa-status-options">
                            {['Đang bán vé', 'Hết vé', 'Hủy chuyến', 'Delayed', 'Cancelled'].map(st => (
                               <label className={`pa-status-chip ${flightForm.status === st ? 'active' : ''}`} key={st}>
                                  <input type="radio" name="flight_status"
                                    checked={flightForm.status === st}
                                    onChange={() => setFlightForm({...flightForm, status: st})}
                                  />
                                  <span>{st}</span>
                               </label>
                            ))}
                         </div>
                      </div>
                    </div>
                 </div>

                 <div className="pa-footer">
                    <button className="btn-pa-cancel" onClick={() => { setShowAddModal(false); setEditingFlight(null); }}>Hủy bỏ</button>
                    <button className="btn-pa-submit" onClick={async () => {
                       if (!flightForm.flight || !flightForm.from || !flightForm.to || !flightForm.dep || !flightForm.arr || !flightForm.price) {
                          showToast('Vui lòng nhập đầy đủ thông tin bắt buộc!', 'error');
                          return;
                       }
                       let success = false;
                       if (editingFlight) {
                         await onUpdateFlight?.(editingFlight.flight, flightForm.aircraft, flightForm.gate);
                         success = true;
                       } else {
                         const res = await (onAddFlight as any)?.({
                           ...flightForm,
                           ma_may_bay: flightForm.aircraft,
                           cong_khoi_hanh: flightForm.gate,
                         });
                         success = !!res;
                       }
                       if (success) {
                         showToast(editingFlight ? 'Cập nhật thành công!' : 'Thêm chuyến bay thành công!', 'success');
                         setShowAddModal(false); setEditingFlight(null);
                       } else {
                         showToast('Thao tác thất bại. Vui lòng kiểm tra lại!', 'error');
                       }
                    }}>
                       {editingFlight ? 'CẬP NHẬT CHUYẾN BAY' : 'XÁC NHẬN THÊM MỚI'}
                       <span className="material-icons-round">check_circle</span>
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingFlight && (
        <div className="modal-backdrop search-backdrop" onClick={() => setDeletingFlight(null)}>
          <div className="confirm-modal-premium" onClick={e => e.stopPropagation()}>
             <div className="confirm-header-danger">
                <span className="material-icons-round">warning</span>
             </div>
             <div className="confirm-body">
                <h2>Xác nhận hủy chuyến?</h2>
                <p>Bạn đang yêu cầu hủy chuyến bay <strong>{deletingFlight.flight}</strong>. Hành động này sẽ thông báo tới tất cả đại lý và bắt đầu quy trình hoàn tiền cho hành khách.</p>
             </div>
             
             <div className="confirm-footer-vertical">
                <button className="btn-danger-large" onClick={() => { showToast('Đã hủy chuyến bay thành công!', 'success'); setDeletingFlight(null); }}>
                   XÁC NHẬN HỦY CHUYẾN BAY
                </button>
                <button className="btn-ghost-large" onClick={() => setDeletingFlight(null)}>QUAY LẠI</button>
             </div>
          </div>
        </div>
      )}

      <style>{`
        .flights-page-content { animation: fadeIn 0.4s ease-out; }
        
        /* ── OPERATION HEADER ── */
        .operation-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .header-meta h1 { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
        .header-meta p { font-size: 14px; color: #64748b; margin-top: 4px; }
        .header-actions { display: flex; gap: 12px; }
        .btn-primary-gradient { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; }

        /* ── QUICK SEARCH BAR ── */
        .quick-search-bar { padding: 16px 24px; border: none; background: #ffffff; box-shadow: 0 4px 20px rgba(0,0,0,0.05); margin-bottom: 32px; border-radius: 20px; }
        .q-search-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 32px; align-items: center; }
        .q-input-group label { display: block; font-size: 10px; font-weight: 800; color: #94a3b8; margin-bottom: 6px; letter-spacing: 1px; }
        .q-route-display { display: flex; align-items: center; gap: 12px; }
        .q-route-display .code { font-size: 18px; font-weight: 800; color: #1e293b; font-family: monospace; }
        .q-route-display .separator { color: #2563eb; font-size: 20px; }
        .q-val { font-size: 15px; font-weight: 700; color: #1e293b; }
        .edit-search-btn { display: flex; align-items: center; gap: 8px; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; padding: 10px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .edit-search-btn:hover { background: #dbeafe; }

        /* ── MAIN LAYOUT ── */
        .flights-main-layout { display: flex; gap: 32px; }
        .flights-sidebar { width: 300px; flex-shrink: 0; }
        .flights-body { flex: 1; min-width: 0; }

        /* ── SIDEBAR FILTERS ── */
        .filter-card { padding: 24px; border-radius: 20px; position: sticky; top: 24px; }
        .f-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .f-header h3 { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0; }
        .f-header button { background: none; border: none; color: #2563eb; font-size: 13px; font-weight: 700; cursor: pointer; }
        .f-section { margin-bottom: 28px; }
        .f-label { display: block; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; }
        .f-list { display: flex; flex-direction: column; gap: 14px; }
        .f-checkbox { display: flex; align-items: center; gap: 12px; cursor: pointer; position: relative; }
        .f-checkbox input { display: none; }
        .f-check-ui { width: 22px; height: 22px; border: 2px solid #e2e8f0; border-radius: 6px; position: relative; transition: all 0.2s; background: white; }
        .f-checkbox input:checked + .f-check-ui { background: var(--accent, #2563eb); border-color: var(--accent, #2563eb); }
        .f-checkbox input:checked + .f-check-ui::after { content: 'check'; font-family: 'Material Icons Round'; font-size: 16px; color: white; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); }
        .f-text { font-size: 14px; font-weight: 600; color: #334155; }
        .f-promo-box { background: #fefce8; border: 1px solid #fef08a; padding: 16px; border-radius: 16px; display: flex; gap: 12px; margin-top: 32px; }
        .f-promo-box .material-icons-round { color: #eab308; }
        .f-promo-box p { font-size: 12px; color: #854d0e; line-height: 1.6; margin: 0; }

        /* ── BODY AREA ── */
        .body-top-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .flight-counter { font-size: 15px; color: #64748b; }
        .flight-counter b { color: #0f172a; font-weight: 800; }
        .sort-switcher { display: flex; gap: 4px; background: #f1f5f9; padding: 4px; border-radius: 12px; }
        .sort-switcher button { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: none; border-radius: 8px; font-size: 13px; font-weight: 700; color: #64748b; background: transparent; cursor: pointer; transition: all 0.2s; }
        .sort-switcher button.active { background: #ffffff; color: #2563eb; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1); }
        .sort-switcher button .material-icons-round { font-size: 18px; }

        /* ── FLIGHT CARD PREMIUM ── */
        .flight-grid { display: flex; flex-direction: column; gap: 20px; }
        .flight-card-premium { padding: 24px; border-radius: 24px; border: 1px solid #e2e8f0; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); cursor: default; position: relative; overflow: hidden; }
        .flight-card-premium:hover { border-color: #2563eb; transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); }
        .flight-card-premium.is-closed { opacity: 0.7; background: #f8fafc; }
        
        .f-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .f-airline-info { display: flex; align-items: center; gap: 16px; }
        .f-logo-wrapper { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .f-airline-row { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }
        .f-name { font-size: 15px; font-weight: 800; color: #0f172a; }
        .f-code-tag { font-size: 11px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 2px 8px; border-radius: 6px; }
        .f-aircraft { font-size: 12px; color: #94a3b8; font-weight: 600; }
        
        .f-badges { display: flex; gap: 8px; }
        .f-badge { font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; }
        .f-badge.premium { background: #fef3c7; color: #b45309; }
        .f-status-tag { font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 8px; }
        .f-status-tag.success { background: #dcfce7; color: #15803d; }
        .f-status-tag.danger { background: #fee2e2; color: #dc2626; }

        .f-main-route { display: flex; align-items: center; gap: 40px; background: #f8fafc; padding: 24px; border-radius: 20px; margin-bottom: 24px; }
        .route-node .time { font-size: 32px; font-weight: 900; color: #0f172a; margin: 0; line-height: 1; }
        .route-node .airport { font-size: 14px; color: #64748b; font-weight: 700; margin-top: 6px; font-family: monospace; }
        .route-visual { flex: 1; text-align: center; }
        .route-visual .duration { font-size: 12px; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: block; }
        .path-ui { display: flex; align-items: center; gap: 8px; margin: 8px 0; }
        .path-ui .line { flex: 1; height: 1.5px; background: #e2e8f0; }
        .path-ui .dot { width: 5px; height: 5px; border-radius: 50%; background: #cbd5e1; }
        .path-ui .material-icons-round { color: #2563eb; font-size: 24px; transform: rotate(45deg); }
        .stop-info { font-size: 11px; font-weight: 800; color: #10b981; }

        .f-footer { display: flex; justify-content: space-between; align-items: flex-end; }
        .f-meta-stats { display: flex; flex-direction: column; gap: 12px; }
        .stat { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 13px; font-weight: 600; }
        .stat .material-icons-round { font-size: 18px; color: #94a3b8; }
        .stat-label { font-size: 14px; font-weight: 700; color: #475569; }
        .stat-label b { color: #1e293b; font-size: 16px; }
        .stat-progress { width: 160px; margin-top: 8px; }
        .progress-bar { height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden; box-shadow: inset 0 1px 2px rgba(0,0,0,0.05); }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #2563eb); border-radius: 10px; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }

        .f-pricing-block { text-align: right; }
        .price-group { margin-bottom: 12px; }
        .price-group .label { font-size: 11px; font-weight: 800; color: #94a3b8; display: block; margin-bottom: 2px; }
        .price-val { font-size: 26px; font-weight: 900; color: #ef4444; margin: 0; }
        .f-actions { display: flex; gap: 12px; }
        .btn-details { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 24px; border-radius: 12px; font-size: 14px; font-weight: 700; color: #475569; cursor: pointer; transition: all 0.2s; }
        .btn-details:hover { background: #f1f5f9; border-color: #cbd5e1; }
        .btn-icon-alt { width: 42px; height: 42px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btn-icon-alt:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
        .btn-icon-alt.danger:hover { border-color: #ef4444; color: #ef4444; background: #fee2e2; }
        .btn-book { background: linear-gradient(135deg, #2563eb, #1d4ed8); border: none; padding: 10px 32px; border-radius: 12px; font-size: 14px; font-weight: 800; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3); transition: all 0.2s; }
        .btn-book:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4); }
        .btn-sold-out { background: #f1f5f9; border: none; padding: 10px 32px; border-radius: 12px; font-size: 14px; font-weight: 800; color: #94a3b8; cursor: not-allowed; }

        /* ── DRAWER / MODAL ── */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 2000; display: flex; justify-content: flex-end; animation: fadeIn 0.3s; }
        .flight-drawer { width: 700px; background: white; height: 100%; box-shadow: -10px 0 50px rgba(0,0,0,0.2); display: flex; flex-direction: column; animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        
        .drawer-header { padding: 32px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: flex-start; }
        .drawer-title { display: flex; gap: 20px; }
        .d-icon { width: 56px; height: 56px; border-radius: 18px; display: flex; align-items: center; justify-content: center; color: white; }
        .d-icon .material-icons-round { font-size: 28px; }
        .drawer-title h3 { font-size: 22px; font-weight: 900; color: #0f172a; margin: 0; }
        .drawer-title p { font-size: 14px; color: #64748b; margin-top: 6px; }
        .close-btn { width: 40px; height: 40px; border-radius: 50%; border: none; background: #f1f5f9; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .drawer-content { flex: 1; overflow-y: auto; padding: 32px; }
        .manifest-header { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .m-stat { padding: 16px; background: #f8fafc; border-radius: 16px; border: 1px solid #f1f5f9; }
        .m-stat label { display: block; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px; }
        .m-stat p { font-size: 20px; font-weight: 900; color: #1e293b; margin: 0; }
        .text-primary { color: #2563eb !important; }
        .text-success { color: #10b981 !important; }

        .manifest-table-box { border-radius: 20px; border: 1px solid #e2e8f0; overflow: hidden; background: white; }
        .table-title { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .table-title h4 { font-size: 14px; font-weight: 800; color: #0f172a; margin: 0; text-transform: uppercase; }
        .table-actions { display: flex; gap: 10px; }
        .table-actions button { background: none; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        
        .manifest-table-premium { width: 100%; border-collapse: collapse; }
        .manifest-table-premium th { text-align: left; padding: 16px 24px; background: #f8fafc; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .manifest-table-premium td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .pax-cell { display: flex; align-items: center; gap: 12px; }
        .pax-avatar { width: 36px; height: 36px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 13px; }
        .pax-name { font-weight: 700; color: #1e293b; margin: 0; }
        .pax-meta { font-size: 11px; color: #94a3b8; margin: 2px 0 0; }
        .cls-tag { font-size: 11px; font-weight: 700; background: #f1f5f9; color: #475569; padding: 2px 8px; border-radius: 6px; }
        .seat-num { font-size: 15px; color: #0f172a; font-family: monospace; }
        .ticket-num { font-size: 13px; color: #64748b; font-family: monospace; }
        .status-dot-tag { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; }
        .status-dot-tag.active { color: #10b981; }
        .status-dot-tag.active::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: #10b981; }

        .drawer-footer { padding: 32px; border-top: 1px solid #f1f5f9; background: #fafbfc; display: flex; justify-content: flex-end; gap: 16px; }

        /* ── SEARCH EDIT MODAL PREMIUM ── */
        .search-backdrop { background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(12px); }
        .search-edit-modal-premium { display: flex; width: 780px; max-width: 95%; background: white; border-radius: 28px; box-shadow: 0 40px 100px rgba(0,0,0,0.3); animation: slideUpLarge 0.5s cubic-bezier(0.16, 1, 0.3, 1); margin: auto; }
        @keyframes slideUpLarge { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .s-modal-left { width: 280px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 36px; color: white; display: flex; flex-direction: column; justify-content: center; position: relative; border-top-left-radius: 28px; border-bottom-left-radius: 28px; }
        .s-modal-tag { font-size: 11px; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.15); padding: 6px 14px; border-radius: 20px; width: fit-content; margin-bottom: 24px; letter-spacing: 1px; }
        .s-modal-left h2 { font-size: 28px; font-weight: 900; margin-bottom: 16px; line-height: 1.2; color: white; }
        .s-modal-left p { font-size: 15px; color: #94a3b8; line-height: 1.6; }
        .s-modal-illustration { margin-top: 40px; opacity: 0.2; }
        .s-modal-illustration .material-icons-round { font-size: 120px; color: #3b82f6; }

        .s-modal-right { flex: 1; padding: 36px; position: relative; display: flex; flex-direction: column; background: #ffffff; border-top-right-radius: 28px; border-bottom-right-radius: 28px; }
        .s-close-btn { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: none; background: #f8fafc; color: #64748b; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .s-close-btn:hover { background: #fee2e2; color: #ef4444; }

        .s-form-container { display: flex; flex-direction: column; gap: 24px; flex: 1; }
        .s-form-group-full { width: 100%; }
        .s-form-group label, .s-form-group-full label { display: block; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.5px; }
        
        .s-route-picker-box { display: flex; align-items: center; background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 20px; padding: 6px; }
        .s-loc-field { flex: 1; display: flex; align-items: center; gap: 14px; padding: 14px 20px; }
        .s-loc-field select { border: none; background: transparent; outline: none; font-size: 15px; font-weight: 800; color: #0f172a; width: 100%; cursor: pointer; }
        .s-loc-field .material-icons-round { color: #2563eb; font-size: 24px; }
        .s-swap-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: #ffffff; color: #2563eb; box-shadow: 0 4px 12px rgba(0,0,0,0.1); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; z-index: 2; margin: 0 -22px; }
        .s-swap-btn:hover { background: #2563eb; color: white; transform: rotate(180deg); }

        .s-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .s-input-wrapper { display: flex; align-items: center; gap: 14px; background: #f8fafc; border: 2px solid #f1f5f9; border-radius: 16px; padding: 14px 20px; transition: border-color 0.2s; }
        .s-input-wrapper:focus-within { border-color: #2563eb; background: white; }
        .s-input-wrapper input, .s-input-wrapper select { border: none; background: transparent; outline: none; font-size: 15px; font-weight: 700; color: #0f172a; width: 100%; cursor: pointer; }
        .s-input-wrapper .material-icons-round { color: #94a3b8; font-size: 22px; }
        
        .s-modal-footer { margin-top: 48px; display: flex; justify-content: flex-end; align-items: center; gap: 24px; }
        .btn-cancel-flat { background: none; border: none; color: #94a3b8; font-size: 15px; font-weight: 700; cursor: pointer; transition: color 0.2s; }
        .btn-cancel-flat:hover { color: #1e293b; }
        .btn-update-premium { display: flex; align-items: center; gap: 12px; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; border: none; padding: 16px 36px; border-radius: 16px; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3); transition: all 0.3s; }
        .btn-update-premium:hover { transform: translateY(-2px); box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4); }
        .btn-update-premium .material-icons-round { font-size: 20px; }

        /* ── PREMIUM ADMIN MODAL ── */
        .premium-admin-modal { display: flex; width: 840px; max-width: 95%; height: auto; max-height: 90vh; background: white; border-radius: 28px; box-shadow: 0 50px 100px rgba(0,0,0,0.4); animation: slideUpLarge 0.5s cubic-bezier(0.16, 1, 0.3, 1); margin: auto; }
        
        .pa-sidebar { width: 280px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 36px; color: white; display: flex; flex-direction: column; position: relative; border-top-left-radius: 28px; border-bottom-left-radius: 28px; }
        .pa-tag { font-size: 11px; font-weight: 800; color: #3b82f6; background: rgba(59, 130, 246, 0.1); padding: 6px 14px; border-radius: 20px; width: fit-content; margin-bottom: 24px; letter-spacing: 1px; border: 1px solid rgba(59, 130, 246, 0.2); }
        .pa-sidebar h2 { font-size: 26px; font-weight: 900; margin-bottom: 16px; line-height: 1.2; color: white; }
        .pa-sidebar p { font-size: 14px; color: #94a3b8; line-height: 1.6; }
        
        .pa-steps { margin-top: 40px; display: flex; flex-direction: column; gap: 24px; }
        .pa-step { display: flex; align-items: center; gap: 16px; opacity: 0.4; }
        .pa-step.active { opacity: 1; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; }
        .step-text { font-size: 14px; font-weight: 700; }
        
        .pa-illustration { position: absolute; bottom: -20px; right: -20px; opacity: 0.1; }
        .pa-illustration .material-icons-round { font-size: 200px; color: #3b82f6; }

        .pa-main { flex: 1; padding: 36px 40px; position: relative; display: flex; flex-direction: column; background: #ffffff; border-top-right-radius: 28px; border-bottom-right-radius: 28px; }
        .pa-close { position: absolute; top: 16px; right: 16px; width: 40px; height: 40px; border-radius: 50%; border: none; background: #f8fafc; color: #64748b; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .pa-close:hover { background: #fee2e2; color: #ef4444; }

        .pa-form-scroll { flex: 1; overflow-y: auto; padding-right: 12px; margin-right: -12px; }
        .pa-form-scroll::-webkit-scrollbar { width: 6px; }
        .pa-form-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }

        .pa-section { margin-bottom: 32px; }
        .pa-section h4 { font-size: 12px; font-weight: 800; color: #94a3b8; letter-spacing: 1px; margin-bottom: 20px; border-left: 3px solid #2563eb; padding-left: 12px; }
        
        .pa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 20px; }
        .pa-field label { display: block; font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 10px; }
        .pa-field input, .pa-field select { width: 100%; padding: 14px 18px; border-radius: 14px; border: 2px solid #f1f5f9; background: #f8fafc; font-size: 15px; font-weight: 700; color: #1e293b; outline: none; transition: all 0.2s; }
        .pa-field input:focus, .pa-field select:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1); }
        
        .pa-status-options { display: flex; gap: 12px; }
        .pa-status-chip { flex: 1; position: relative; cursor: pointer; }
        .pa-status-chip input { position: absolute; opacity: 0; }
        .pa-status-chip span { display: block; text-align: center; padding: 12px; border-radius: 12px; border: 2px solid #f1f5f9; font-size: 13px; font-weight: 700; color: #64748b; transition: all 0.2s; }
        .pa-status-chip input:checked + span { border-color: #2563eb; background: #eff6ff; color: #2563eb; }

        .pa-footer { margin-top: 32px; padding-top: 32px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; align-items: center; gap: 24px; }
        .btn-pa-cancel { background: none; border: none; color: #94a3b8; font-size: 15px; font-weight: 700; cursor: pointer; }
        .btn-pa-cancel:hover { color: #1e293b; }
        .btn-pa-submit { display: flex; align-items: center; gap: 12px; background: #2563eb; color: white; border: none; padding: 16px 32px; border-radius: 16px; font-size: 15px; font-weight: 800; cursor: pointer; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2); transition: all 0.2s; }
        .btn-pa-submit:hover { background: #1d4ed8; transform: translateY(-2px); }

        /* ── CONFIRM MODAL PREMIUM ── */
        .confirm-modal-premium { width: 440px; background: white; border-radius: 32px; overflow: hidden; box-shadow: 0 40px 80px rgba(0,0,0,0.3); animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); margin: auto; }
        .confirm-header-danger { height: 120px; background: #fee2e2; display: flex; align-items: center; justify-content: center; }
        .confirm-header-danger .material-icons-round { font-size: 56px; color: #ef4444; animation: shake 0.5s ease-in-out infinite alternate; }
        @keyframes shake { from { transform: rotate(-5deg); } to { transform: rotate(5deg); } }
        
        .confirm-body { padding: 40px; text-align: center; }
        .confirm-body h2 { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 16px; }
        .confirm-body p { font-size: 15px; color: #64748b; line-height: 1.6; }
        
        .confirm-footer-vertical { padding: 0 40px 40px; display: flex; flex-direction: column; gap: 12px; }
        .btn-danger-large { background: #ef4444; color: white; border: none; padding: 18px; border-radius: 16px; font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .btn-danger-large:hover { background: #dc2626; box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3); }
        .btn-ghost-large { background: #f8fafc; color: #64748b; border: none; padding: 16px; border-radius: 16px; font-size: 14px; font-weight: 700; cursor: pointer; }
        .btn-ghost-large:hover { background: #f1f5f9; color: #1e293b; }
      `}</style>
    </AppLayout>
  );
};

export default FlightsPage;
