import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface FlightsPageProps {
  onNavigate?: (id: string) => void;
  onSelectFlight?: (flight: any) => void;
}

const flightData = [
  { id: 1, code: 'QH', name: 'Bamboo Airways', flight: 'QH-202', aircraft: 'Boeing 787', dep: '11:00', arr: '13:05', from: 'HAN', to: 'SGN', dur: '2h 05m', stops: 0, price: 1950000, oldPrice: 2100000, carry: '7kg', checked: '20kg', seats: 12, badge: 'Bay nhanh nhất' },
  { id: 2, code: 'VN', name: 'Vietnam Airlines', flight: 'VN-214', aircraft: 'Airbus A321', dep: '14:00', arr: '16:15', from: 'HAN', to: 'SGN', dur: '2h 15m', stops: 0, price: 2150000, carry: '10kg', checked: '23kg', seats: 45 },
  { id: 3, code: 'VJ', name: 'VietJet Air', flight: 'VJ-123', aircraft: 'Airbus A320', dep: '06:30', arr: '08:40', from: 'HAN', to: 'SGN', dur: '2h 10m', stops: 0, price: 1250000, carry: '7kg', checked: '20kg', seats: 3, badge: 'Tiết kiệm nhất' },
  { id: 4, code: 'VN', name: 'Vietnam Airlines', flight: 'VN-380', aircraft: 'Boeing 787', dep: '19:00', arr: '21:10', from: 'HAN', to: 'SGN', dur: '2h 10m', stops: 0, price: 1890000, carry: '10kg', checked: '23kg', seats: 28 },
  { id: 5, code: 'QH', name: 'Bamboo Airways', flight: 'QH-204', aircraft: 'Airbus A320', dep: '08:15', arr: '10:25', from: 'HAN', to: 'SGN', dur: '2h 10m', stops: 0, price: 1750000, carry: '7kg', checked: '20kg', seats: 0 },
];

const airlineStyle: Record<string,{bg:string,color:string}> = {
  VN: { bg:'#005a8c', color:'white' }, VJ: { bg:'#ed1b24', color:'white' }, QH: { bg:'#00a563', color:'white' }
};

const FlightsPage: React.FC<FlightsPageProps> = ({ onNavigate, onSelectFlight }) => {
  const [stops, setStops] = useState<string[]>(['0']);
  const [airlines, setAirlines] = useState<string[]>(['VN', 'VJ', 'QH']);
  const [viewingFlight, setViewingFlight] = useState<any | null>(null);
  const [sortBy, setSortBy] = useState<'price'|'dep'|'dur'>('price');

  const toggleStop = (val: string) => setStops(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  const toggleAirline = (val: string) => setAirlines(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const handleSelectFlight = (f: typeof flightData[0]) => {
    // Truyền dữ liệu chuyến bay qua hệ thống routing (state của page.tsx)
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
        cls: 'Phổ thông'
      });
    }

    // Chuyển sang trang tạo booking
    if (onNavigate) {
      onNavigate('create_booking');
    }
  };

  // 1. Lọc và sắp xếp chuyến bay thực tế
  const filteredFlights = flightData
    .filter(f => airlines.includes(f.code))
    .filter(f => stops.includes(String(f.stops)))
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'dep') return a.dep.localeCompare(b.dep);
      return a.dur.localeCompare(b.dur);
    });

  // 2. Tìm gợi ý tốt nhất từ danh sách đã lọc
  const validFlights = [...filteredFlights].filter(f => f.seats > 0);
  const cheapest = validFlights.length > 0 ? [...validFlights].sort((a,b) => a.price - b.price)[0] : null;
  const fastest = validFlights.length > 0 ? [...validFlights].sort((a,b) => a.dur.localeCompare(b.dur))[0] : null;

  return (
    <div className="layout">
      <Sidebar activeItem="flights" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Tìm kiếm chuyến bay" />
        <main className="content">
          <Card className="search-box-card">
          <div className="search-box-header">
              <span className="material-icons-round text-primary">flight_takeoff</span>
              <h2>Tìm chuyến bay</h2>
            </div>
            <div className="search-form">
              {/* Row 1: Origin & Destination */}
              <div className="search-row">
                <div className="form-group location-group">
                  <div className="input-field">
                    <label>ĐIỂM ĐI</label>
                    <div className="input-wrapper">
                      <span className="material-icons-round">flight_takeoff</span>
                      <input type="text" defaultValue="Hà Nội (HAN)" />
                    </div>
                  </div>
                  <button className="swap-btn"><span className="material-icons-round">swap_horiz</span></button>
                  <div className="input-field">
                    <label>ĐIỂM ĐẾN</label>
                    <div className="input-wrapper">
                      <span className="material-icons-round">flight_land</span>
                      <input type="text" defaultValue="TP. Hồ Chí Minh (SGN)" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Row 2: Dates + Passengers */}
              <div className="search-row">
                <div className="input-field">
                  <label>NGÀY ĐI</label>
                  <div className="input-wrapper">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="text" defaultValue="24 Thg 10, 2023" />
                  </div>
                </div>
                <div className="input-field disabled">
                  <div className="label-row">
                    <label>NGÀY VỀ</label>
                    <span className="sub-label">MỘT CHIỀU</span>
                  </div>
                  <div className="input-wrapper">
                    <span className="material-icons-round">calendar_today</span>
                    <input type="text" placeholder="Thêm ngày về" disabled />
                  </div>
                </div>
                <div className="input-field">
                  <label>HÀNH KHÁCH & HẠNG GHẾ</label>
                  <div className="input-wrapper">
                    <span className="material-icons-round">person</span>
                    <input type="text" defaultValue="1 Người lớn, Phổ thông" readOnly />
                    <span className="material-icons-round arrow">expand_more</span>
                  </div>
                </div>
                <div className="search-btn-inline">
                  <Button size="lg" className="search-btn-full">
                    <span className="material-icons-round">search</span>
                    Tìm chuyến bay
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Results Layout */}
          <div className="results-layout">
            {/* Filters */}
            <div className="filters-sidebar">
              <Card>
                <div className="filter-header">
                  <h3>Bộ lọc</h3>
                  <button className="reset-btn">ĐẶT LẠI</button>
                </div>
                
                <div className="filter-section">
                  <h4>Giá vé</h4>
                  <div className="range-slider">
                    <div className="slider-track">
                      <div className="slider-fill" style={{ left: '10%', right: '20%' }}></div>
                      <div className="slider-thumb" style={{ left: '10%' }}></div>
                      <div className="slider-thumb" style={{ right: '20%' }}></div>
                    </div>
                    <div className="slider-labels">
                      <span>1.2M</span>
                      <span>3.5M</span>
                    </div>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Số điểm dừng</h4>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={stops.includes('0')} onChange={() => toggleStop('0')} />
                    <span>Bay thẳng</span>
                    <span className="count">24</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={stops.includes('1')} onChange={() => toggleStop('1')} />
                    <span>1 điểm dừng</span>
                    <span className="count">12</span>
                  </label>
                </div>

                <div className="filter-section">
                  <h4>Giờ khởi hành</h4>
                  <div className="time-buttons">
                    <button className="time-btn active">
                      <span className="material-icons-round">wb_sunny</span>
                      Sáng (00-12)
                    </button>
                    <button className="time-btn">
                      <span className="material-icons-round">light_mode</span>
                      Chiều (12-18)
                    </button>
                    <button className="time-btn">
                      <span className="material-icons-round">nights_stay</span>
                      Tối (18-24)
                    </button>
                  </div>
                </div>

                <div className="filter-section">
                  <h4>Hãng hàng không</h4>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={airlines.includes('VN')} onChange={() => toggleAirline('VN')} />
                    <span className="airline-logo vn">VN</span>
                    <span>Vietnam Airlines</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={airlines.includes('VJ')} onChange={() => toggleAirline('VJ')} />
                    <span className="airline-logo vj">VJ</span>
                    <span>Vietjet Air</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" checked={airlines.includes('QH')} onChange={() => toggleAirline('QH')} />
                    <span className="airline-logo qh">QH</span>
                    <span>Bamboo Airways</span>
                  </label>
                </div>
              </Card>
            </div>

            {/* Main Results */}
            <div className="results-main">
              <div className="results-header">
                <p>Hiển thị <strong>{filteredFlights.length}</strong> chuyến bay</p>
                <div className="sort-box">
                  Sắp xếp theo: <strong>Giá thấp nhất</strong>
                  <span className="material-icons-round">expand_more</span>
                </div>
              </div>

              {(fastest || cheapest) && (
                <div className="suggestions-section">
                  <h3><span className="material-icons-round text-warning">auto_awesome</span> Gợi ý tốt nhất cho bạn</h3>
                  <div className="suggestion-cards">
                  {fastest && (
                    <Card className="suggestion-card best-match">
                      <div className="badge-top">PHÙ HỢP NHẤT</div>
                      <div className="s-header">
                        <span className="airline-logo" style={{ background: airlineStyle[fastest.code]?.bg, color: 'white' }}>{fastest.code}</span>
                        <div>
                          <p className="s-airline">{fastest.name}</p>
                          <p className="s-plane">{fastest.flight} • {fastest.aircraft}</p>
                        </div>
                      </div>
                      <div className="s-route">
                        <div className="time">
                          <h4>{fastest.dep}</h4>
                          <p>{fastest.from}</p>
                        </div>
                        <div className="duration">
                          <p>{fastest.dur}</p>
                          <div className="line-plane"><span className="material-icons-round">flight</span></div>
                          <p className="text-success">{fastest.stops === 0 ? 'Bay thẳng' : '1 điểm dừng'}</p>
                        </div>
                        <div className="time text-right">
                          <h4>{fastest.arr}</h4>
                          <p>{fastest.to}</p>
                        </div>
                      </div>
                      <div className="s-footer">
                        <h3 className="price text-danger">{fastest.price.toLocaleString('vi')} đ</h3>
                        <Button size="sm" onClick={() => handleSelectFlight(fastest)}>Chọn</Button>
                      </div>
                    </Card>
                  )}

                  {cheapest && cheapest.id !== fastest?.id && (
                    <Card className="suggestion-card cheapest">
                      <div className="badge-top bg-success">TIẾT KIỆM NHẤT</div>
                      <div className="s-header">
                        <span className="airline-logo" style={{ background: airlineStyle[cheapest.code]?.bg, color: 'white' }}>{cheapest.code}</span>
                        <div>
                          <p className="s-airline">{cheapest.name}</p>
                          <p className="s-plane">{cheapest.flight} • {cheapest.aircraft}</p>
                        </div>
                      </div>
                      <div className="s-route">
                        <div className="time">
                          <h4>{cheapest.dep}</h4>
                          <p>{cheapest.from}</p>
                        </div>
                        <div className="duration">
                          <p>{cheapest.dur}</p>
                          <div className="line-plane"><span className="material-icons-round text-success">flight</span></div>
                          <p className="text-success">{cheapest.stops === 0 ? 'Bay thẳng' : '1 điểm dừng'}</p>
                        </div>
                        <div className="time text-right">
                          <h4>{cheapest.arr}</h4>
                          <p>{cheapest.to}</p>
                        </div>
                      </div>
                      <div className="s-footer">
                        <h3 className="price text-danger">{cheapest.price.toLocaleString('vi')} đ</h3>
                        <Button size="sm" className="btn-success" onClick={() => handleSelectFlight(cheapest)}>Chọn</Button>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
              )}

              {/* Sort pills */}
              <div className="sort-pills">
                <span className="sort-label">Sắp xếp:</span>
                <button className={`sort-pill${sortBy==='price'?' active':''}`} onClick={()=>setSortBy('price')}>💰 Giá thấp nhất</button>
                <button className={`sort-pill${sortBy==='dep'?' active':''}`} onClick={()=>setSortBy('dep')}>🕐 Khởi hành sớm</button>
                <button className={`sort-pill${sortBy==='dur'?' active':''}`} onClick={()=>setSortBy('dur')}>⚡ Bay nhanh nhất</button>
              </div>

              <div className="flight-list-section">
                {filteredFlights.length === 0 ? (
                  <div className="no-results" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
                    <span className="material-icons-round" style={{ fontSize: 48, color: 'var(--border)', marginBottom: 12 }}>flight_off</span>
                    <p>Không tìm thấy chuyến bay phù hợp. Vui lòng thay đổi bộ lọc.</p>
                  </div>
                ) : filteredFlights.map(f => (
                  <Card key={f.id} className="flight-list-card">
                    {f.badge && <div className="badge-float"><span className="material-icons-round">flash_on</span>{f.badge}</div>}
                    <div className="f-main">
                      <div className="f-airline-col">
                        <span className="f-logo" style={{ background: airlineStyle[f.code]?.bg, color: airlineStyle[f.code]?.color }}>{f.code}</span>
                        <div>
                          <p className="f-airline-name">{f.name}</p>
                          <p className="f-plane-info">{f.flight} • {f.aircraft}</p>
                        </div>
                      </div>
                      <div className="f-route-col">
                        <div className="f-time"><h3>{f.dep}</h3><p>{f.from}</p></div>
                        <div className="f-duration">
                          <p>{f.dur}</p>
                          <div className="f-line"><span className="material-icons-round">flight</span></div>
                          <p className="text-success">Bay thẳng</p>
                        </div>
                        <div className="f-time text-right"><h3>{f.arr}</h3><p>{f.to}</p></div>
                      </div>
                      <div className="f-price-col">
                        {f.oldPrice && <p className="f-old-price">{f.oldPrice.toLocaleString('vi')}</p>}
                        <h2 className="f-price text-danger">{f.price.toLocaleString('vi')}</h2>
                        <p className="f-unit">đ / khách</p>
                        {f.seats === 0 ? (
                          <span className="sold-out-tag">Hết chỗ</span>
                        ) : f.seats <= 5 ? (
                          <p className="seats-warn">⚠ Còn {f.seats} chỗ!</p>
                        ) : null}
                        <Button variant={f.seats===0?'outline':'primary'} className="select-flight-btn"
                          onClick={()=>f.seats>0&&handleSelectFlight(f)}
                          style={f.seats===0?{opacity:0.5,cursor:'not-allowed'}:{}}>
                          {f.seats===0 ? 'Hết chỗ' : 'Chọn chuyến'}
                        </Button>
                      </div>
                    </div>
                    <div className="f-footer">
                      <div className="f-baggage">
                        <span><span className="material-icons-round">work_outline</span>{f.carry} xách tay</span>
                        <span><span className="material-icons-round">luggage</span>{f.checked} ký gửi</span>
                      </div>
                      <button className="f-details-btn" onClick={() => setViewingFlight(f)} title="Xem chi tiết">
                        Chi tiết <span className="material-icons-round">visibility</span>
                      </button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Flight Detail Popup */}
      {viewingFlight && (
        <div className="popup-overlay" onClick={() => setViewingFlight(null)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <div className="popup-title">
                <div className="popup-icon" style={{ background: airlineStyle[viewingFlight.code]?.bg || '#0e74be', color: 'white' }}>
                  <span className="material-icons-round">airplanemode_active</span>
                </div>
                <div>
                  <h3>Chi tiết chuyến bay</h3>
                  <p>Số hiệu: <strong>{viewingFlight.flight}</strong> ({viewingFlight.name})</p>
                </div>
              </div>
              <button className="popup-close" onClick={() => setViewingFlight(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="popup-body">
              <div className="f-detail-grid">
                <div className="f-detail-item">
                  <span className="material-icons-round">flight_takeoff</span>
                  <div>
                    <p className="fd-label">Khởi hành</p>
                    <p className="fd-val"><strong>{viewingFlight.dep}</strong> – {viewingFlight.from}</p>
                    <p className="fd-sub">Sân bay Nội Bài</p>
                  </div>
                </div>
                <div className="f-detail-line">
                  <div className="line"></div>
                  <span className="material-icons-round">schedule</span>
                  <span>{viewingFlight.dur}</span>
                </div>
                <div className="f-detail-item">
                  <span className="material-icons-round">flight_land</span>
                  <div>
                    <p className="fd-label">Hạ cánh</p>
                    <p className="fd-val"><strong>{viewingFlight.arr}</strong> – {viewingFlight.to}</p>
                    <p className="fd-sub">Sân bay Tân Sơn Nhất</p>
                  </div>
                </div>
              </div>

              <div className="f-amenities">
                <div className="amenity">
                  <span className="material-icons-round">work_outline</span>
                  <span>{viewingFlight.carry} Xách tay</span>
                </div>
                <div className="amenity">
                  <span className="material-icons-round">luggage</span>
                  <span>{viewingFlight.checked} Ký gửi</span>
                </div>
                <div className="amenity">
                  <span className="material-icons-round">event_seat</span>
                  <span>{viewingFlight.seats} Ghế trống</span>
                </div>
                <div className="amenity">
                  <span className="material-icons-round">airplane_ticket</span>
                  <span>{viewingFlight.aircraft}</span>
                </div>
              </div>
            </div>
            <div className="popup-footer">
              <Button variant="outline" onClick={() => setViewingFlight(null)}>Đóng</Button>
              <Button onClick={() => handleSelectFlight(viewingFlight)}>Chọn chuyến này</Button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); }
        .content { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; width: 100%; }

        @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tdSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .popup-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.45); backdrop-filter: blur(3px); z-index: 2000; display: flex; align-items: center; justify-content: center; animation: tdFadeIn 0.2s ease; }
        .popup-card { background: white; border-radius: 16px; width: 500px; max-width: 95vw; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: tdSlideUp 0.2s ease; overflow: hidden; }
        .popup-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: white; }
        .popup-title { display: flex; gap: 12px; align-items: center; }
        .popup-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .popup-title h3 { font-size: 18px; margin: 0 0 2px; color: #1e293b; font-weight: 700; }
        .popup-title p { font-size: 13px; color: #64748b; margin: 0; }
        .popup-close { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: #94a3b8; display: flex; transition: all 0.2s; }
        .popup-close:hover { background: #f1f5f9; color: #1e293b; }
        .popup-body { padding: 24px; }
        .popup-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #f1f5f9; background: #f8fafc; }

        .f-detail-grid { display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px; }
        .f-detail-item { display: flex; gap: 16px; align-items: flex-start; }
        .f-detail-item .material-icons-round { font-size: 24px; color: var(--primary); background: #eff6ff; padding: 10px; border-radius: 12px; }
        .fd-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .fd-val { font-size: 15px; color: #1e293b; margin: 0; }
        .fd-sub { font-size: 12px; color: #64748b; margin: 2px 0 0; }
        .f-detail-line { display: flex; align-items: center; gap: 12px; padding-left: 22px; color: #94a3b8; font-size: 12px; font-weight: 600; }
        .f-detail-line .line { width: 2px; height: 30px; background: #e2e8f0; margin-left: 21px; position: absolute; margin-top: -45px; }

        .f-amenities { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .amenity { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #475569; }
        .amenity .material-icons-round { font-size: 18px; color: #64748b; }

        .text-primary { color: var(--primary); }
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }
        .text-warning { color: var(--warning); }
        .text-right { text-align: right; }
        .bg-success { background: var(--success) !important; }

        /* Search Box */
        .search-box-card { margin-bottom: var(--space-xl); padding: var(--space-lg); overflow: hidden; }
        .search-box-header { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-lg); }
        .search-box-header h2 { font-size: 20px; }
        .search-form { display: flex; flex-direction: column; gap: var(--space-md); }
        .search-row { display: flex; gap: var(--space-md); align-items: flex-end; }
        .form-group { display: flex; gap: var(--space-sm); min-width: 0; flex: 1; }
        .location-group { display: flex; align-items: flex-end; gap: var(--space-sm); flex: 1; position: relative; }
        .swap-btn { flex-shrink: 0; align-self: flex-end; margin-bottom: 2px; background: white; border: 1px solid var(--border); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; color: var(--primary); box-shadow: var(--shadow-sm); cursor: pointer; }
        .input-field { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
        .input-field label { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .sub-label { font-size: 10px; color: var(--text-muted); }
        .input-wrapper { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 16px; background: white; transition: border-color 0.2s; min-width: 0; overflow: hidden; }
        .input-wrapper:hover, .input-wrapper:focus-within { border-color: var(--primary); }
        .input-wrapper .material-icons-round { color: var(--text-muted); font-size: 20px; flex-shrink: 0; }
        .input-wrapper input { border: none; outline: none; flex: 1; font-size: 14px; font-weight: 500; color: var(--text-main); background: transparent; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .input-wrapper input:disabled { color: var(--text-muted); }
        .input-field.disabled .input-wrapper { background: var(--bg-main); border-color: transparent; }
        .search-btn-inline { display: flex; align-items: flex-end; flex-shrink: 0; }
        .search-btn-full { font-size: 15px; padding: 12px 28px; white-space: nowrap; }

        /* Results Layout */
        .results-layout { display: flex; gap: var(--space-xl); align-items: flex-start; }
        .filters-sidebar { width: 280px; flex-shrink: 0; }
        .results-main { flex: 1; min-width: 0; }

        /* Filters */
        .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg); }
        .filter-header h3 { font-size: 16px; }
        .reset-btn { font-size: 12px; color: var(--primary); font-weight: 600; background: transparent; border: none; cursor: pointer; }
        .filter-section { border-top: 1px solid var(--border); padding: var(--space-lg) 0; }
        .filter-section h4 { font-size: 14px; margin-bottom: var(--space-md); }
        .checkbox-label { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-size: 14px; cursor: pointer; }
        .checkbox-label input[type="checkbox"] { width: 16px; height: 16px; accent-color: var(--primary); }
        .checkbox-label .count { margin-left: auto; color: var(--text-muted); font-size: 12px; }
        
        .airline-logo { width: 24px; height: 24px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: white; }
        .airline-logo.vn { background: #005a8c; }
        .airline-logo.vj { background: #ed1b24; }
        .airline-logo.qh { background: #00a563; }

        .time-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        .time-btn { flex: 1; min-width: 80px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 12px 8px; background: white; font-size: 11px; color: var(--text-secondary); transition: all 0.2s; }
        .time-btn .material-icons-round { font-size: 20px; }
        .time-btn.active { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
        .time-btn:hover:not(.active) { background: var(--bg-main); }

        .range-slider { padding: 10px 0; }
        .slider-track { height: 4px; background: var(--border); border-radius: 2px; position: relative; margin-bottom: 12px; }
        .slider-fill { position: absolute; height: 100%; background: var(--primary); }
        .slider-thumb { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 16px; height: 16px; border-radius: 50%; background: var(--primary); border: 2px solid white; box-shadow: var(--shadow-sm); cursor: pointer; }
        .slider-labels { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-secondary); }

        /* Results Header */
        .results-header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 12px 20px; border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: var(--space-xl); }
        .results-header p { font-size: 14px; }
        .sort-box { display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--text-secondary); cursor: pointer; }
        .sort-box strong { color: var(--text-main); }

        /* Suggestions */
        .suggestions-section { margin-bottom: var(--space-xl); }
        .suggestions-section h3 { display: flex; align-items: center; gap: 8px; font-size: 16px; margin-bottom: var(--space-md); }
        .suggestion-cards { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); }
        .suggestion-card { position: relative; padding-top: 36px; border: 2px solid transparent; }
        .suggestion-card.best-match { border-color: var(--primary-light); background: #f8fbff; }
        .suggestion-card.cheapest { border-color: #e6f4ea; background: #f9fdfa; }
        .badge-top { position: absolute; top: 0; right: 0; background: var(--primary); color: white; font-size: 10px; font-weight: 700; padding: 6px 12px; border-radius: 0 8px 0 8px; }
        .s-header { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .s-airline { font-size: 14px; font-weight: 600; }
        .s-plane { font-size: 11px; color: var(--text-muted); }
        .s-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .time h4 { font-size: 24px; margin-bottom: 2px; }
        .time p { font-size: 12px; color: var(--text-secondary); font-weight: 500; }
        .duration { flex: 1; text-align: center; padding: 0 16px; }
        .duration p { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .line-plane { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; }
        .line-plane::before { content: ''; position: absolute; width: 100%; height: 1px; background: var(--border); z-index: 1; }
        .line-plane .material-icons-round { background: inherit; padding: 0 4px; z-index: 2; font-size: 16px; color: var(--primary); }
        .suggestion-card.cheapest .line-plane .material-icons-round { color: var(--success); }
        .s-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); padding-top: 16px; }
        .s-footer .price { font-size: 20px; }
        .btn-success { background: var(--success) !important; }

        /* Sort pills */
        .sort-pills { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
        .sort-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }
        .sort-pill { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: white; font-size: 13px; cursor: pointer; color: var(--text-secondary); transition: all 0.2s; }
        .sort-pill.active { background: var(--primary); color: white; border-color: var(--primary); }
        .sort-pill:hover:not(.active) { border-color: var(--primary); color: var(--primary); }

        /* Flight card - fix overflow */
        .f-logo { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; flex-shrink: 0; }
        .f-logo.sm { width: 36px; height: 36px; border-radius: 8px; font-size: 11px; }
        .f-main { display: flex; padding: 16px 20px; gap: 12px; align-items: center; min-width: 0; }
        .f-airline-col { display: flex; align-items: center; gap: 10px; width: 180px; flex-shrink: 0; min-width: 0; }
        .f-airline-name { font-size: 13px; font-weight: 700; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .f-plane-info { font-size: 11px; color: var(--text-muted); white-space: nowrap; }
        .f-route-col { flex: 1; display: flex; align-items: center; justify-content: center; gap: 12px; min-width: 0; }
        .f-time h3 { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
        .f-time p { font-size: 13px; color: var(--text-secondary); font-weight: 600; }
        .f-duration { flex: 1; text-align: center; min-width: 80px; }
        .f-duration p { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; }
        .f-line { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; }
        .f-line::before { content: ''; position: absolute; width: 100%; height: 2px; background: var(--border); z-index: 1; }
        .f-line .material-icons-round { background: white; padding: 0 4px; z-index: 2; font-size: 18px; color: var(--primary); transform: rotate(90deg); }
        .f-price-col { width: 150px; text-align: right; flex-shrink: 0; }
        .f-old-price { font-size: 11px; color: var(--text-muted); text-decoration: line-through; margin-bottom: 2px; }
        .f-price { font-size: 18px; font-weight: 800; margin-bottom: 2px; color: #e53e3e; }
        .f-unit { font-size: 10px; color: var(--text-muted); margin-bottom: 4px; }
        .select-flight-btn { width: 100%; margin-top: 8px; font-size: 13px; padding: 8px 10px; }
        .sold-out-tag { display: inline-block; background: #fee2e2; color: #dc2626; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 20px; }
        .seats-warn { font-size: 11px; color: #f59e0b; font-weight: 700; }

        .f-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px 24px; background: #fafbfc; border-top: 1px solid var(--border); }
        .f-baggage { display: flex; gap: 20px; font-size: 12px; color: var(--text-secondary); }
        .f-baggage span { display: flex; align-items: center; gap: 6px; }
        .f-baggage .material-icons-round { font-size: 16px; }
        .f-details-btn { font-size: 13px; color: var(--primary); font-weight: 600; display: flex; align-items: center; gap: 4px; background: none; border: none; cursor: pointer; }

        .f-detail-panel { padding: 16px 20px; background: #f8faff; border-top: 1px solid #e0e7ff; }
        .f-detail-row { display: flex; gap: 12px; flex-wrap: wrap; }
        .f-detail-item { display: flex; align-items: center; gap: 10px; flex: 1; min-width: 160px; background: white; padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border); }
        .f-detail-item .material-icons-round { font-size: 20px; color: var(--primary); }
        .fd-label { font-size: 10px; color: var(--text-muted); font-weight: 600; text-transform: uppercase; margin-bottom: 2px; }
        .fd-val { font-size: 12px; font-weight: 600; color: var(--text-main); }

      `}</style>
    </div>
  );
};

export default FlightsPage;
