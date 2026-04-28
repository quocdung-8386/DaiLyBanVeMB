import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface FlightsPageProps {
  onNavigate?: (id: string) => void;
}

const FlightsPage: React.FC<FlightsPageProps> = ({ onNavigate }) => {
  const [stops, setStops] = useState<string[]>(['0']);
  const [airlines, setAirlines] = useState<string[]>(['VN', 'VJ', 'QH']);

  const toggleStop = (val: string) => {
    setStops(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  const toggleAirline = (val: string) => {
    setAirlines(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);
  };

  return (
    <div className="layout">
      <Sidebar activeItem="flights" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Tìm kiếm chuyến bay - Hệ thống Quản lý Đại lý" />
        
        <main className="content">
          {/* Stepper */}
          <div className="stepper-container">
            <div className="step active">
              <div className="step-circle">1</div>
              <p>Tìm kiếm</p>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-circle">2</div>
              <p>Hành khách</p>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-circle">3</div>
              <p>Thanh toán</p>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className="step-circle">4</div>
              <p>Hoàn tất</p>
            </div>
          </div>

          {/* Search Box */}
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
                <p>Hiển thị <strong>36</strong> chuyến bay</p>
                <div className="sort-box">
                  Sắp xếp theo: <strong>Giá thấp nhất</strong>
                  <span className="material-icons-round">expand_more</span>
                </div>
              </div>

              <div className="suggestions-section">
                <h3><span className="material-icons-round text-warning">auto_awesome</span> Gợi ý tốt nhất cho bạn</h3>
                <div className="suggestion-cards">
                  <Card className="suggestion-card best-match">
                    <div className="badge-top">PHÙ HỢP NHẤT</div>
                    <div className="s-header">
                      <span className="airline-logo vn">VN</span>
                      <div>
                        <p className="s-airline">Vietnam Airlines</p>
                        <p className="s-plane">VN-280 • Airbus A321</p>
                      </div>
                    </div>
                    <div className="s-route">
                      <div className="time">
                        <h4>08:00</h4>
                        <p>HAN</p>
                      </div>
                      <div className="duration">
                        <p>2h 15m</p>
                        <div className="line-plane"><span className="material-icons-round">flight</span></div>
                        <p className="text-success">Bay thẳng</p>
                      </div>
                      <div className="time text-right">
                        <h4>10:15</h4>
                        <p>SGN</p>
                      </div>
                    </div>
                    <div className="s-footer">
                      <h3 className="price text-danger">1,850,000 đ</h3>
                      <Button size="sm">Chọn</Button>
                    </div>
                  </Card>

                  <Card className="suggestion-card cheapest">
                    <div className="badge-top bg-success">TIẾT KIỆM NHẤT</div>
                    <div className="s-header">
                      <span className="airline-logo vj">VJ</span>
                      <div>
                        <p className="s-airline">Vietjet Air</p>
                        <p className="s-plane">VJ-123 • Airbus A320</p>
                      </div>
                    </div>
                    <div className="s-route">
                      <div className="time">
                        <h4>06:30</h4>
                        <p>HAN</p>
                      </div>
                      <div className="duration">
                        <p>2h 10m</p>
                        <div className="line-plane"><span className="material-icons-round text-success">flight</span></div>
                        <p className="text-success">Bay thẳng</p>
                      </div>
                      <div className="time text-right">
                        <h4>08:40</h4>
                        <p>SGN</p>
                      </div>
                    </div>
                    <div className="s-footer">
                      <h3 className="price text-danger">1,250,000 đ</h3>
                      <Button size="sm" className="btn-success">Chọn</Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div className="flight-list-section">
                {/* Flight Card 1 */}
                <Card className="flight-list-card">
                  <div className="badge-float">
                    <span className="material-icons-round">flash_on</span> Bay nhanh nhất
                  </div>
                  <div className="f-main">
                    <div className="f-airline-col">
                      <span className="airline-logo qh">QH</span>
                      <div>
                        <p className="f-airline-name">Bamboo Airways</p>
                        <p className="f-plane-info">QH-202 • Boeing 787</p>
                      </div>
                    </div>
                    <div className="f-route-col">
                      <div className="f-time">
                        <h3>11:00</h3>
                        <p>HAN</p>
                      </div>
                      <div className="f-duration">
                        <p>2h 05m</p>
                        <div className="f-line"><span className="material-icons-round">flight</span></div>
                        <p className="text-success">Bay thẳng</p>
                      </div>
                      <div className="f-time text-right">
                        <h3>13:05</h3>
                        <p>SGN</p>
                      </div>
                    </div>
                    <div className="f-price-col">
                      <p className="f-old-price">2,100,000</p>
                      <h2 className="f-price text-danger">1,950,000</h2>
                      <p className="f-unit">/ khách</p>
                      <Button variant="outline" className="select-flight-btn">Chọn chuyến</Button>
                    </div>
                  </div>
                  <div className="f-footer">
                    <div className="f-baggage">
                      <span><span className="material-icons-round">work_outline</span> 7kg xách tay</span>
                      <span><span className="material-icons-round">luggage</span> 20kg ký gửi</span>
                    </div>
                    <button className="f-details-btn">Chi tiết chuyến bay <span className="material-icons-round">expand_more</span></button>
                  </div>
                </Card>

                {/* Flight Card 2 */}
                <Card className="flight-list-card">
                  <div className="f-main">
                    <div className="f-airline-col">
                      <span className="airline-logo vn">VN</span>
                      <div>
                        <p className="f-airline-name">Vietnam Airlines</p>
                        <p className="f-plane-info">VN-214 • Airbus A321</p>
                      </div>
                    </div>
                    <div className="f-route-col">
                      <div className="f-time">
                        <h3>14:00</h3>
                        <p>HAN</p>
                      </div>
                      <div className="f-duration">
                        <p>2h 15m</p>
                        <div className="f-line"><span className="material-icons-round">flight</span></div>
                        <p className="text-success">Bay thẳng</p>
                      </div>
                      <div className="f-time text-right">
                        <h3>16:15</h3>
                        <p>SGN</p>
                      </div>
                    </div>
                    <div className="f-price-col">
                      <h2 className="f-price text-danger">2,150,000</h2>
                      <p className="f-unit">/ khách</p>
                      <Button variant="outline" className="select-flight-btn">Chọn chuyến</Button>
                    </div>
                  </div>
                  <div className="f-footer">
                    <div className="f-baggage">
                      <span><span className="material-icons-round">work_outline</span> 10kg xách tay</span>
                      <span><span className="material-icons-round">luggage</span> 23kg ký gửi</span>
                    </div>
                    <button className="f-details-btn">Chi tiết chuyến bay <span className="material-icons-round">expand_more</span></button>
                  </div>
                </Card>

                <div className="load-more">
                  <button className="load-more-btn">Hiển thị thêm chuyến bay <span className="material-icons-round">expand_more</span></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); }
        .content { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; width: 100%; }

        .text-primary { color: var(--primary); }
        .text-success { color: var(--success); }
        .text-danger { color: var(--danger); }
        .text-warning { color: var(--warning); }
        .text-right { text-align: right; }
        .bg-success { background: var(--success) !important; }

        /* Stepper */
        .stepper-container { display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-xl); max-width: 600px; margin-left: auto; margin-right: auto; }
        .step { display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; background: white; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 600; color: var(--text-muted); z-index: 2; }
        .step p { font-size: 13px; font-weight: 500; color: var(--text-muted); }
        .step.active .step-circle { background: var(--primary); border-color: var(--primary); color: white; }
        .step.active p { color: var(--primary); }
        .step-line { flex: 1; height: 2px; background: var(--border); margin: 0 10px; margin-bottom: 24px; }
        .step.active + .step-line { background: var(--primary); }

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

        /* Flight List */
        .flight-list-section { display: flex; flex-direction: column; gap: var(--space-md); }
        .flight-list-card { position: relative; }
        .badge-float { position: absolute; top: -12px; left: 24px; background: var(--bg-main); border: 1px solid var(--border); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; display: flex; align-items: center; gap: 4px; color: var(--text-secondary); }
        .badge-float .material-icons-round { font-size: 14px; color: var(--text-main); }
        
        .f-main { display: flex; padding: var(--space-lg); gap: var(--space-xl); align-items: center; }
        .f-airline-col { display: flex; align-items: center; gap: 12px; width: 220px; flex-shrink: 0; }
        .f-airline-name { font-size: 14px; font-weight: 600; }
        .f-plane-info { font-size: 12px; color: var(--text-muted); }
        
        .f-route-col { flex: 1; display: flex; align-items: center; justify-content: center; gap: var(--space-xl); }
        .f-time h3 { font-size: 20px; font-weight: 600; margin-bottom: 4px; }
        .f-time p { font-size: 14px; color: var(--text-secondary); font-weight: 500; }
        .f-duration { width: 140px; text-align: center; }
        .f-duration p { font-size: 12px; color: var(--text-muted); margin-bottom: 4px; }
        .f-line { display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 4px; }
        .f-line::before { content: ''; position: absolute; width: 100%; height: 2px; background: var(--border); z-index: 1; }
        .f-line .material-icons-round { background: white; padding: 0 4px; z-index: 2; font-size: 20px; color: var(--text-muted); transform: rotate(90deg); }
        
        .f-price-col { width: 160px; text-align: right; flex-shrink: 0; }
        .f-old-price { font-size: 12px; color: var(--text-muted); text-decoration: line-through; margin-bottom: 2px; }
        .f-price { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
        .f-unit { font-size: 11px; color: var(--text-muted); margin-bottom: 12px; }
        .select-flight-btn { width: 100%; }

        .f-footer { display: flex; justify-content: space-between; align-items: center; padding: 12px var(--space-lg); background: #fafafa; border-top: 1px solid var(--border); border-radius: 0 0 var(--radius-lg) var(--radius-lg); }
        .f-baggage { display: flex; gap: var(--space-lg); font-size: 12px; color: var(--text-secondary); }
        .f-baggage span { display: flex; align-items: center; gap: 6px; }
        .f-baggage .material-icons-round { font-size: 16px; }
        .f-details-btn { font-size: 13px; color: var(--primary); font-weight: 500; display: flex; align-items: center; gap: 4px; }
        
        .load-more { text-align: center; margin-top: var(--space-xl); }
        .load-more-btn { font-size: 14px; color: var(--primary); font-weight: 500; display: inline-flex; align-items: center; gap: 4px; padding: 8px 16px; border-radius: 20px; transition: background 0.2s; }
        .load-more-btn:hover { background: var(--primary-light); }
      `}</style>
    </div>
  );
};

export default FlightsPage;
