import React, { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface CreateBookingPageProps {
  onNavigate: (page: string) => void;
  initialFlight?: any;
}

const CreateBookingPage: React.FC<CreateBookingPageProps> = ({ onNavigate, initialFlight }) => {
  const [currentStep, setCurrentStep] = useState(initialFlight ? 2 : 1);
  const [searchParams, setSearchParams] = useState({
    from: 'HAN',
    to: 'SGN',
    date: '2026-06-01',
    passengers: 1
  });
  const [selectedFlight, setSelectedFlight] = useState<any>(initialFlight || null);

  // Mock data
  const mockFlights = [
    {
      id: 'VN123',
      airline: 'Vietnam Airlines',
      logo: 'VNA',
      bg: '#005f9e',
      departure: '08:00',
      arrival: '10:10',
      duration: '2h 10m',
      classes: [
        { name: 'Economy', price: 1500000, seats: 150 },
        { name: 'Business', price: 4500000, seats: 20 }
      ]
    },
    {
      id: 'VJ456',
      airline: 'VietJet Air',
      logo: 'VJ',
      bg: '#ed1b24',
      departure: '14:00',
      arrival: '16:00',
      duration: '2h 00m',
      classes: [
        { name: 'Economy', price: 800000, seats: 200 }
      ]
    }
  ];

  const renderStep1 = () => (
    <div className="booking-step">
      <h2 className="step-title">Tìm kiếm chuyến bay</h2>
      <Card className="search-card">
        <div className="search-grid">
          <div className="input-group">
            <label>Điểm đi</label>
            <div className="input-with-icon">
              <span className="material-icons-round">flight_takeoff</span>
              <select value={searchParams.from} onChange={(e) => setSearchParams({...searchParams, from: e.target.value})}>
                <option value="HAN">Hà Nội (HAN)</option>
                <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                <option value="DAD">Đà Nẵng (DAD)</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Điểm đến</label>
            <div className="input-with-icon">
              <span className="material-icons-round">flight_land</span>
              <select value={searchParams.to} onChange={(e) => setSearchParams({...searchParams, to: e.target.value})}>
                <option value="SGN">TP. Hồ Chí Minh (SGN)</option>
                <option value="HAN">Hà Nội (HAN)</option>
                <option value="DAD">Đà Nẵng (DAD)</option>
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Ngày đi</label>
            <div className="input-with-icon">
              <span className="material-icons-round">calendar_month</span>
              <input type="date" value={searchParams.date} onChange={(e) => setSearchParams({...searchParams, date: e.target.value})} />
            </div>
          </div>
          <div className="input-group">
            <label>Hành khách</label>
            <div className="input-with-icon">
              <span className="material-icons-round">group</span>
              <input type="number" min="1" value={searchParams.passengers} onChange={(e) => setSearchParams({...searchParams, passengers: parseInt(e.target.value)})} />
            </div>
          </div>
        </div>
        <div className="search-actions">
          <button className="btn-search">
            <span className="material-icons-round">search</span>
            Tìm chuyến bay
          </button>
        </div>
      </Card>

      <div className="flight-results">
        <h3 className="results-title">Kết quả tìm kiếm ({mockFlights.length} chuyến bay)</h3>
        {mockFlights.map((flight) => (
          <Card key={flight.id} className="flight-card">
            <div className="flight-info-main">
              <div className="airline-logo" style={{ background: flight.bg }}>{flight.logo}</div>
              <div className="flight-times">
                <div className="time-block">
                  <h4>{flight.departure}</h4>
                  <p>{searchParams.from}</p>
                </div>
                <div className="flight-duration">
                  <span className="duration-line"></span>
                  <span className="material-icons-round">flight</span>
                  <p>{flight.duration}</p>
                </div>
                <div className="time-block">
                  <h4>{flight.arrival}</h4>
                  <p>{searchParams.to}</p>
                </div>
              </div>
            </div>
            
            <div className="flight-classes">
              {flight.classes.map((cls) => (
                <div 
                  key={cls.name} 
                  className={`class-card ${selectedFlight?.id === flight.id && selectedFlight?.cls === cls.name ? 'selected' : ''}`}
                  onClick={() => setSelectedFlight({ ...flight, cls: cls.name, price: cls.price })}
                >
                  <p className="class-name">{cls.name}</p>
                  <p className="class-price">{cls.price.toLocaleString()} VND</p>
                  <p className="class-seats">Còn {cls.seats} ghế</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      
      <div className="step-footer">
        <Button onClick={() => {
          if (initialFlight) {
            onNavigate('flights');
          } else {
            onNavigate('dashboard');
          }
        }} variant="secondary">Hủy</Button>
        <Button onClick={() => setCurrentStep(2)} disabled={!selectedFlight}>Tiếp tục</Button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="booking-step">
      <h2 className="step-title">Thông tin hành khách</h2>
      {Array.from({ length: searchParams.passengers }).map((_, idx) => (
        <Card key={idx} className="passenger-card">
          <h3>Hành khách {idx + 1}</h3>
          <div className="form-grid">
            <div className="input-group">
              <label>Danh xưng</label>
              <select><option>Ông</option><option>Bà</option><option>Anh</option><option>Chị</option></select>
            </div>
            <div className="input-group">
              <label>Họ và Tên</label>
              <input type="text" placeholder="VD: NGUYEN VAN A" />
            </div>
            <div className="input-group">
              <label>Ngày sinh</label>
              <input type="date" />
            </div>
            <div className="input-group">
              <label>CCCD / Hộ chiếu</label>
              <input type="text" />
            </div>
          </div>
        </Card>
      ))}

      <Card className="contact-card">
        <h3>Thông tin liên hệ</h3>
        <div className="form-grid">
          <div className="input-group">
            <label>Email</label>
            <input type="email" placeholder="email@example.com" />
          </div>
          <div className="input-group">
            <label>Số điện thoại</label>
            <input type="tel" placeholder="090..." />
          </div>
        </div>
      </Card>

      <div className="step-footer">
        <Button onClick={() => {
          if (initialFlight) {
            // Quay lại trang FlightsPage để chọn lại chuyến bay
            onNavigate('flights');
          } else {
            setCurrentStep(1);
          }
        }} variant="secondary">Quay lại</Button>
        <Button onClick={() => setCurrentStep(3)}>Tiếp tục</Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="booking-step">
      <h2 className="step-title">Dịch vụ bổ sung</h2>
      <Card className="services-card">
        <div className="service-item">
          <div className="service-info">
            <span className="material-icons-round">luggage</span>
            <div>
              <h4>Hành lý ký gửi 20kg</h4>
              <p>Gói hành lý tiêu chuẩn cho các chuyến bay nội địa</p>
            </div>
          </div>
          <div className="service-action">
            <span className="price">+ 300,000 VND</span>
            <input type="checkbox" className="service-checkbox" />
          </div>
        </div>
        <div className="service-item">
          <div className="service-info">
            <span className="material-icons-round">restaurant</span>
            <div>
              <h4>Suất ăn nóng</h4>
              <p>Suất ăn chính (Cơm/Mì) phục vụ trên chuyến bay</p>
            </div>
          </div>
          <div className="service-action">
            <span className="price">+ 150,000 VND</span>
            <input type="checkbox" className="service-checkbox" />
          </div>
        </div>
      </Card>

      <div className="step-footer">
        <Button onClick={() => setCurrentStep(2)} variant="secondary">Quay lại</Button>
        <Button onClick={() => setCurrentStep(4)}>Xem tóm tắt</Button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="booking-step">
      <h2 className="step-title">Xác nhận Đặt chỗ</h2>
      <div className="summary-layout">
        <div className="summary-left">
          <Card className="summary-flight">
            <h3>Thông tin chuyến bay</h3>
            <div className="summary-route">
              <span className="airport">{searchParams.from}</span>
              <span className="material-icons-round">arrow_right_alt</span>
              <span className="airport">{searchParams.to}</span>
            </div>
            <p className="flight-detail-text">Chuyến bay: <strong>{selectedFlight?.id}</strong> ({selectedFlight?.airline})</p>
            <p className="flight-detail-text">Khởi hành: <strong>{searchParams.date}</strong> | {selectedFlight?.departure} - {selectedFlight?.arrival}</p>
            <p className="flight-detail-text">Hạng ghế: <strong className="class-badge">{selectedFlight?.cls}</strong></p>
          </Card>
          <Card className="summary-passengers">
            <h3>Danh sách hành khách</h3>
            <ul className="passenger-list">
              <li>
                <span className="material-icons-round">person</span>
                1. NGUYEN VAN A (Người lớn)
              </li>
            </ul>
          </Card>
        </div>
        <div className="summary-right">
          <Card className="price-summary">
            <h3>Chi tiết giá</h3>
            <div className="price-row">
              <span>Giá vé ({searchParams.passengers} x Khách)</span>
              <span>{(selectedFlight?.price * searchParams.passengers).toLocaleString()} VND</span>
            </div>
            <div className="price-row">
              <span>Thuế, phí sân bay</span>
              <span>120,000 VND</span>
            </div>
            <div className="price-row">
              <span>Dịch vụ bổ sung</span>
              <span>0 VND</span>
            </div>
            <div className="price-divider"></div>
            <div className="price-row total">
              <span>Tổng cộng</span>
              <span className="total-amount">{(selectedFlight?.price * searchParams.passengers + 120000).toLocaleString()} VND</span>
            </div>
            <button className="btn-confirm-booking" onClick={() => onNavigate('booking')}>
              <span className="material-icons-round">check_circle</span>
              Tạo Đặt Chỗ (Hold)
            </button>
            <button className="btn-pay-now" onClick={() => onNavigate('payments')}>
              <span className="material-icons-round">credit_card</span>
              Thanh toán ngay
            </button>
          </Card>
        </div>
      </div>
      <div className="step-footer" style={{ marginTop: '20px' }}>
        <Button onClick={() => setCurrentStep(3)} variant="secondary">Quay lại sửa</Button>
      </div>
    </div>
  );

  return (
    <div className="create-booking-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('dashboard')}>
          <span className="material-icons-round">arrow_back</span>
        </button>
        <div className="header-titles">
          <h1>Tạo Đặt Chỗ Mới</h1>
          <p>Tìm kiếm chuyến bay và đặt vé cho khách hàng</p>
        </div>
      </div>

      <div className="wizard-progress">
        {['Tìm chuyến bay', 'Hành khách', 'Dịch vụ', 'Xác nhận'].map((step, idx) => (
          <div key={idx} className={`progress-step ${currentStep > idx + 1 ? 'completed' : ''} ${currentStep === idx + 1 ? 'active' : ''}`}>
            <div className="step-number">{currentStep > idx + 1 ? <span className="material-icons-round">check</span> : idx + 1}</div>
            <span className="step-label">{step}</span>
            {idx < 3 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      <div className="wizard-content">
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
      </div>

      <style>{`
        .create-booking-page { padding: 24px 32px; max-width: 1200px; margin: 0 auto; }
        
        .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
        .back-btn { background: white; border: 1px solid #e2e8f0; border-radius: 8px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #475569; transition: all 0.2s; }
        .back-btn:hover { background: #f8fafc; color: #0e74be; }
        .header-titles h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
        .header-titles p { font-size: 14px; color: #64748b; margin: 0; }

        /* Wizard Progress */
        .wizard-progress { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; background: white; padding: 20px 40px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .progress-step { display: flex; align-items: center; flex: 1; position: relative; }
        .progress-step:last-child { flex: none; }
        .step-number { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; z-index: 2; transition: all 0.3s; }
        .step-label { margin-left: 12px; font-size: 14px; font-weight: 600; color: #64748b; white-space: nowrap; transition: color 0.3s; }
        .step-line { position: absolute; top: 16px; left: 40px; right: 20px; height: 2px; background: #e2e8f0; z-index: 1; transition: background 0.3s; }
        
        .progress-step.active .step-number { background: #0e74be; color: white; box-shadow: 0 0 0 4px rgba(14, 116, 190, 0.1); }
        .progress-step.active .step-label { color: #0e74be; }
        
        .progress-step.completed .step-number { background: #10b981; color: white; }
        .progress-step.completed .step-label { color: #10b981; }
        .progress-step.completed .step-line { background: #10b981; }
        .progress-step.completed .step-number .material-icons-round { font-size: 18px; }

        /* Step Content Common */
        .booking-step { animation: fadeIn 0.4s ease-out; }
        .step-title { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 20px; }
        .step-footer { display: flex; justify-content: space-between; margin-top: 32px; border-top: 1px solid #e2e8f0; padding-top: 24px; }
        
        /* Step 1: Search */
        .search-card { padding: 24px; margin-bottom: 32px; }
        .search-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 12px; font-weight: 600; color: #475569; }
        .input-with-icon { position: relative; display: flex; align-items: center; }
        .input-with-icon .material-icons-round { position: absolute; left: 12px; color: #94a3b8; font-size: 20px; }
        .input-with-icon select, .input-with-icon input { width: 100%; padding: 10px 12px 10px 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; outline: none; transition: border-color 0.2s; background: white; font-family: inherit; }
        .input-with-icon select:focus, .input-with-icon input:focus { border-color: #0e74be; }
        
        .search-actions { display: flex; justify-content: flex-end; }
        .btn-search { display: inline-flex; align-items: center; gap: 8px; background: #0e74be; color: white; border: none; border-radius: 8px; padding: 10px 24px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-search:hover { background: #0b5a94; }

        .results-title { font-size: 16px; font-weight: 600; color: #475569; margin-bottom: 16px; }
        .flight-card { padding: 20px; margin-bottom: 16px; display: flex; align-items: center; gap: 32px; transition: transform 0.2s, box-shadow 0.2s; }
        .flight-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .flight-info-main { display: flex; align-items: center; gap: 24px; flex: 1; }
        .airline-logo { width: 48px; height: 48px; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; }
        .flight-times { display: flex; align-items: center; gap: 24px; flex: 1; }
        .time-block h4 { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
        .time-block p { font-size: 13px; color: #64748b; margin: 0; font-weight: 500; }
        .flight-duration { display: flex; flex-direction: column; align-items: center; position: relative; width: 100px; }
        .duration-line { position: absolute; top: 10px; width: 100%; height: 2px; background: #e2e8f0; z-index: 1; }
        .flight-duration .material-icons-round { background: white; color: #0e74be; z-index: 2; padding: 0 4px; font-size: 20px; }
        .flight-duration p { font-size: 12px; color: #64748b; margin: 4px 0 0 0; font-weight: 500; }

        .flight-classes { display: flex; gap: 12px; }
        .class-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; cursor: pointer; transition: all 0.2s; min-width: 120px; text-align: center; }
        .class-card:hover { border-color: #93c5fd; background: #f8fafc; }
        .class-card.selected { border-color: #0e74be; background: #eff6ff; box-shadow: 0 4px 12px rgba(14, 116, 190, 0.1); }
        .class-name { font-size: 13px; font-weight: 600; color: #475569; margin: 0 0 4px 0; }
        .class-price { font-size: 16px; font-weight: 700; color: #0e74be; margin: 0 0 4px 0; }
        .class-seats { font-size: 11px; color: #10b981; margin: 0; font-weight: 500; }

        /* Step 2: Passengers */
        .passenger-card, .contact-card { padding: 24px; margin-bottom: 24px; }
        .passenger-card h3, .contact-card h3 { font-size: 16px; font-weight: 600; color: #1e293b; margin: 0 0 20px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .form-grid input, .form-grid select { padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; width: 100%; box-sizing: border-box; outline: none; }
        .form-grid input:focus, .form-grid select:focus { border-color: #0e74be; }

        /* Step 3: Services */
        .services-card { padding: 16px; }
        .service-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 16px; transition: all 0.2s; }
        .service-item:hover { border-color: #cbd5e1; }
        .service-info { display: flex; align-items: center; gap: 16px; }
        .service-info .material-icons-round { font-size: 28px; color: #0e74be; background: #eff6ff; padding: 12px; border-radius: 12px; }
        .service-info h4 { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0 0 4px 0; }
        .service-info p { font-size: 13px; color: #64748b; margin: 0; }
        .service-action { display: flex; align-items: center; gap: 16px; }
        .service-action .price { font-size: 15px; font-weight: 700; color: #1e293b; }
        .service-checkbox { width: 20px; height: 20px; cursor: pointer; accent-color: #0e74be; }

        /* Step 4: Summary */
        .summary-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; }
        .summary-flight, .summary-passengers, .price-summary { padding: 24px; }
        .summary-flight h3, .summary-passengers h3, .price-summary h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        
        .summary-route { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
        .airport { font-size: 24px; font-weight: 800; color: #0e74be; }
        .summary-route .material-icons-round { color: #94a3b8; }
        .flight-detail-text { font-size: 14px; color: #475569; margin: 0 0 8px 0; }
        .class-badge { background: #eff6ff; color: #0e74be; padding: 2px 8px; border-radius: 4px; font-size: 12px; border: 1px solid #bfdbfe; }
        
        .passenger-list { list-style: none; padding: 0; margin: 0; }
        .passenger-list li { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #1e293b; font-weight: 500; margin-bottom: 12px; }
        .passenger-list li .material-icons-round { color: #94a3b8; font-size: 18px; }

        .price-row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #475569; }
        .price-divider { height: 1px; background: #e2e8f0; margin: 16px 0; }
        .price-row.total { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 24px; }
        .total-amount { color: #ef4444; font-size: 20px; }
        
        .btn-confirm-booking, .btn-pay-now { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 14px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; margin-bottom: 12px; }
        .btn-confirm-booking { background: white; border: 1px solid #0e74be; color: #0e74be; }
        .btn-confirm-booking:hover { background: #eff6ff; }
        .btn-pay-now { background: #10b981; border: none; color: white; }
        .btn-pay-now:hover { background: #059669; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default CreateBookingPage;
