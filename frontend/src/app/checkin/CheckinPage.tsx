import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import SeatMap from '../../components/SeatMap';

interface CheckinPageProps {
  onNavigate: (id: string) => void;
}

const CheckinPage: React.FC<CheckinPageProps> = ({ onNavigate }) => {
  const [pnr, setPnr] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'search' | 'passengers' | 'baggage' | 'boarding_pass'>('search');

  const [selectedPassengers, setSelectedPassengers] = useState<string[]>(['p1']);
  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [passengerSeats, setPassengerSeats] = useState<Record<string, string>>({
    'p1': '12A',
    'p2': '12B'
  });
  const [editingPassengerSeat, setEditingPassengerSeat] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr || !lastName) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('passengers');
    }, 1200);
  };

  const togglePassenger = (id: string) => {
    if (selectedPassengers.includes(id)) {
      setSelectedPassengers(selectedPassengers.filter(p => p !== id));
    } else {
      setSelectedPassengers([...selectedPassengers, id]);
    }
  };

  return (
    <AppLayout activeItem="checkin" onNavigate={onNavigate}>
      <div className="checkin-wrapper">
        <div className="checkin-hero">
          <div className="hero-content">
            <h1>Check-in Trực tuyến</h1>
            <p>Tiết kiệm thời gian tại sân bay. Check-in trực tuyến từ 24 giờ đến 60 phút trước chuyến bay.</p>
          </div>
        </div>

        <div className="checkin-container">
          {/* Stepper */}
          {step !== 'search' && (
            <div className="stepper">
              <div className={`step ${step === 'passengers' ? 'active' : 'completed'}`}>
                <div className="step-circle">1</div>
                <span>Hành khách</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step === 'baggage' ? 'active' : (step === 'boarding_pass' ? 'completed' : '')}`}>
                <div className="step-circle">2</div>
                <span>Dịch vụ thêm</span>
              </div>
              <div className="step-line"></div>
              <div className={`step ${step === 'boarding_pass' ? 'active' : ''}`}>
                <div className="step-circle">3</div>
                <span>Thẻ lên máy bay</span>
              </div>
            </div>
          )}

          {step === 'search' && (
            <div className="search-form-wrapper">
              <Card title="Tìm kiếm Đặt chỗ" subtitle="Nhập thông tin vé của bạn để bắt đầu check-in">
                <form onSubmit={handleSearch}>
                  <div className="form-group">
                    <label>Mã Đặt chỗ (PNR)</label>
                    <input 
                      type="text" 
                      placeholder="VD: R2K9L1" 
                      value={pnr}
                      onChange={(e) => setPnr(e.target.value.toUpperCase())}
                      maxLength={6}
                      required
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group" style={{ marginTop: '20px' }}>
                    <label>Họ (Last Name)</label>
                    <input 
                      type="text" 
                      placeholder="VD: NGUYEN" 
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value.toUpperCase())}
                      required
                      className="form-control"
                    />
                  </div>

                  <Button type="submit" fullWidth size="lg" className="mt-8" disabled={!pnr || !lastName || isLoading}>
                    {isLoading ? 'Đang tìm kiếm...' : 'Tiếp tục'}
                    {!isLoading && <span className="material-icons-round" style={{ fontSize: '18px' }}>arrow_forward</span>}
                  </Button>
                </form>
              </Card>
            </div>
          )}

          {step === 'passengers' && (
            <Card title="Chọn Hành khách" subtitle={`Tìm thấy mã: ${pnr} • Chuyến bay VN234`}>
              <div className="flight-summary-banner">
                <div className="route">
                  <h3>HAN</h3>
                  <span className="material-icons-round">flight_takeoff</span>
                  <h3>SGN</h3>
                </div>
                <div className="f-details">
                  <p><strong>Ngày bay:</strong> 15 Thg 10 2026</p>
                  <p><strong>Giờ bay:</strong> 14:30 - 16:45</p>
                </div>
              </div>

              <h4 className="section-heading">Ai sẽ làm thủ tục check-in hôm nay?</h4>
              <div className="passenger-list">
                <label className={`passenger-item ${selectedPassengers.includes('p1') ? 'selected' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedPassengers.includes('p1')} 
                    onChange={() => togglePassenger('p1')}
                  />
                  <div className="p-info">
                    <strong>NGUYEN VAN A</strong>
                    <span>Số vé: 738-1234567890</span>
                  </div>
                  <div className="p-seat">Ghế {passengerSeats['p1']}</div>
                </label>
                <label className={`passenger-item ${selectedPassengers.includes('p2') ? 'selected' : ''}`}>
                  <input 
                    type="checkbox" 
                    checked={selectedPassengers.includes('p2')} 
                    onChange={() => togglePassenger('p2')}
                  />
                  <div className="p-info">
                    <strong>TRAN THI B</strong>
                    <span>Số vé: 738-1234567891</span>
                  </div>
                  <div className="p-seat">Ghế {passengerSeats['p2']}</div>
                </label>
              </div>

              <div className="action-row">
                <Button variant="outline" onClick={() => setStep('search')}>Quay lại</Button>
                <Button onClick={() => setStep('baggage')} disabled={selectedPassengers.length === 0}>
                  Tiếp tục đến Dịch vụ
                </Button>
              </div>
            </Card>
          )}

          {step === 'baggage' && (
            <Card title="Thêm Dịch vụ" subtitle="Nâng tầm trải nghiệm bay của bạn">
              <div className="extras-grid">
                <div className="extra-card">
                  <span className="material-icons-round icon">luggage</span>
                  <h4>Hành lý ký gửi</h4>
                  <p>Mua trước hành lý trực tuyến để tiết kiệm tới 50% so với mua tại sân bay.</p>
                  <Button variant="outline" size="sm" className="mt-4">Thêm Hành lý</Button>
                </div>
                <div className="extra-card">
                  <span className="material-icons-round icon">event_seat</span>
                  <h4>Thay đổi chỗ ngồi</h4>
                  <p>Bạn muốn ngồi gần cửa sổ hoặc có thêm chỗ để chân? Chọn ghế ngay bây giờ.</p>
                  <Button variant="outline" size="sm" className="mt-4" onClick={() => {
                    setEditingPassengerSeat('p1'); // Default editing first selected passenger for demo
                    setIsSeatMapOpen(true);
                  }}>Đổi Ghế</Button>
                </div>
                <div className="extra-card">
                  <span className="material-icons-round icon">restaurant</span>
                  <h4>Suất ăn trên máy bay</h4>
                  <p>Đặt trước suất ăn yêu thích của bạn cho chuyến bay.</p>
                  <Button variant="outline" size="sm" className="mt-4">Xem Thực đơn</Button>
                </div>
              </div>

              <div className="declaration-box">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>Tôi xác nhận rằng tôi không mang theo bất kỳ hàng hóa nguy hiểm hoặc vật phẩm bị cấm nào trong hành lý của mình.</span>
                </label>
              </div>

              <div className="action-row">
                <Button variant="outline" onClick={() => setStep('passengers')}>Quay lại</Button>
                <Button onClick={() => setStep('boarding_pass')}>Hoàn tất Check-in</Button>
              </div>
            </Card>
          )}

          {step === 'boarding_pass' && (
            <div className="success-wrapper">
              <div className="success-header">
                <span className="material-icons-round check-icon">check_circle</span>
                <h2>Check-in Thành công!</h2>
                <p>Bạn đã hoàn tất thủ tục. Chúc bạn có một chuyến bay tốt đẹp.</p>
              </div>

              <div className="boarding-passes">
                {selectedPassengers.map(p => (
                  <div key={p} className="boarding-pass-card">
                    <div className="bp-header">
                      <div className="bp-airline">SKYWARD AIRLINES</div>
                      <div className="bp-class">PHỔ THÔNG</div>
                    </div>
                    <div className="bp-body">
                      <div className="bp-route">
                        <div>
                          <h2>HAN</h2>
                          <span>Hà Nội</span>
                        </div>
                        <span className="material-icons-round">flight_takeoff</span>
                        <div>
                          <h2>SGN</h2>
                          <span>Hồ Chí Minh</span>
                        </div>
                      </div>
                      
                      <div className="bp-details">
                        <div className="detail-item">
                          <span>Hành khách</span>
                          <strong>{p === 'p1' ? 'NGUYEN VAN A' : 'TRAN THI B'}</strong>
                        </div>
                        <div className="detail-item">
                          <span>Chuyến bay</span>
                          <strong>VN234</strong>
                        </div>
                        <div className="detail-item">
                          <span>Ngày</span>
                          <strong>15 Thg 10</strong>
                        </div>
                      </div>

                      <div className="bp-highlights">
                        <div className="h-item">
                          <span>Cửa (Gate)</span>
                          <strong>04</strong>
                        </div>
                        <div className="h-item">
                          <span>Giờ lên tàu</span>
                          <strong>13:45</strong>
                        </div>
                        <div className="h-item">
                          <span>Ghế</span>
                          <strong>{passengerSeats[p]}</strong>
                        </div>
                        <div className="h-item">
                          <span>Nhóm (Zone)</span>
                          <strong>2</strong>
                        </div>
                      </div>
                    </div>
                    <div className="bp-footer">
                      <div className="barcode-placeholder">
                        <span className="material-icons-round">qr_code_2</span>
                      </div>
                      <div className="bp-actions">
                        <Button variant="outline" size="sm"><span className="material-icons-round">download</span> Tải PDF</Button>
                        <Button variant="primary" size="sm"><span className="material-icons-round">smartphone</span> Gửi đến Điện thoại</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '32px' }}>
                <Button variant="outline" onClick={() => onNavigate('dashboard')}>Về Bảng Điều Khiển</Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isSeatMapOpen && (
        <SeatMap 
          flightNumber="VN234"
          initialSelectedSeat={editingPassengerSeat ? passengerSeats[editingPassengerSeat] : undefined}
          onConfirm={(seat) => {
            if (editingPassengerSeat) {
              setPassengerSeats(prev => ({ ...prev, [editingPassengerSeat]: seat }));
            }
            setIsSeatMapOpen(false);
            setEditingPassengerSeat(null);
          }}
          onCancel={() => {
            setIsSeatMapOpen(false);
            setEditingPassengerSeat(null);
          }}
        />
      )}

      <style>{`
        .checkin-wrapper { position: relative; min-height: calc(100vh - 80px); }
        .checkin-hero {
          height: 280px;
          background: linear-gradient(135deg, #0A192F 0%, #112240 100%);
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center;
        }
        .checkin-hero::before {
          content: ''; position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80');
          background-size: cover; background-position: center;
          opacity: 0.15; mix-blend-mode: luminosity;
        }
        .hero-content { position: relative; z-index: 1; text-align: center; color: white; padding: 0 24px; }
        .hero-content h1 { font-size: 36px; font-weight: 800; margin-bottom: 12px; }
        .hero-content p { color: #94a3b8; font-size: 16px; }

        .checkin-container {
          max-width: 680px; margin: -60px auto 40px;
          position: relative; z-index: 10; padding: 0 20px;
        }

        .search-form-wrapper { max-width: 480px; margin: 0 auto; }
        .form-control {
          width: 100%; padding: 14px 16px; border: 1px solid #cbd5e1; border-radius: 12px;
          font-size: 16px; transition: all 0.2s; outline: none; background: #f8fafc;
        }
        .form-control:focus { border-color: #2563eb; background: white; box-shadow: 0 0 0 3px rgba(37,99,235,0.1); }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 8px; }
        .mt-8 { margin-top: 32px; }
        .mt-4 { margin-top: 16px; }

        .stepper { display: flex; align-items: center; justify-content: center; margin-bottom: 32px; background: white; padding: 16px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .step { display: flex; flex-direction: column; align-items: center; gap: 8px; opacity: 0.5; }
        .step.active, .step.completed { opacity: 1; }
        .step-circle { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #64748b; }
        .step.active .step-circle { background: #2563eb; color: white; box-shadow: 0 0 0 4px rgba(37,99,235,0.2); }
        .step.completed .step-circle { background: #10b981; color: white; }
        .step span { font-size: 12px; font-weight: 600; color: #1e293b; }
        .step-line { flex: 1; height: 2px; background: #e2e8f0; margin: 0 16px; transform: translateY(-10px); max-width: 100px; }

        .flight-summary-banner { background: #eff6ff; border-radius: 12px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .route { display: flex; align-items: center; gap: 16px; color: #1e293b; }
        .route h3 { font-size: 24px; margin: 0; }
        .route .material-icons-round { color: #2563eb; }
        .f-details p { margin: 4px 0; font-size: 13px; color: #475569; }

        .section-heading { margin: 0 0 16px 0; font-size: 16px; color: #1e293b; }
        .passenger-list { display: flex; flex-direction: column; gap: 12px; }
        .passenger-item { display: flex; align-items: center; gap: 16px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; }
        .passenger-item.selected { border-color: #2563eb; background: #eff6ff; }
        .passenger-item input[type="checkbox"] { width: 20px; height: 20px; accent-color: #2563eb; }
        .p-info { flex: 1; }
        .p-info strong { display: block; font-size: 15px; color: #0f172a; }
        .p-info span { font-size: 13px; color: #64748b; }
        .p-seat { background: white; border: 1px solid #cbd5e1; padding: 4px 12px; border-radius: 8px; font-weight: 600; font-size: 13px; color: #0f172a; }

        .action-row { display: flex; justify-content: space-between; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px; }

        .extras-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .extra-card { border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; text-align: center; transition: all 0.2s; }
        .extra-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transform: translateY(-2px); }
        .extra-card .icon { font-size: 32px; color: #2563eb; margin-bottom: 12px; }
        .extra-card h4 { margin: 0 0 8px 0; font-size: 15px; color: #1e293b; }
        .extra-card p { font-size: 12px; color: #64748b; margin: 0; line-height: 1.5; }

        .declaration-box { background: #fffbeb; border: 1px solid #fde68a; padding: 16px; border-radius: 12px; }
        .checkbox-label { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; }
        .checkbox-label input { margin-top: 3px; }
        .checkbox-label span { font-size: 13px; color: #92400e; font-weight: 500; line-height: 1.5; }

        .success-wrapper { animation: slideUp 0.5s ease; }
        .success-header { text-align: center; margin-bottom: 40px; }
        .check-icon { font-size: 64px; color: #10b981; margin-bottom: 16px; }
        .success-header h2 { font-size: 28px; color: #0f172a; margin-bottom: 8px; }
        .success-header p { color: #64748b; }

        .boarding-passes { display: flex; flex-direction: column; gap: 24px; align-items: center; }
        .boarding-pass-card { width: 100%; max-width: 400px; background: white; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); overflow: hidden; }
        .bp-header { background: #0A192F; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
        .bp-airline { font-weight: 800; letter-spacing: 1px; font-size: 14px; }
        .bp-class { font-size: 12px; font-weight: 700; background: rgba(255,255,255,0.2); padding: 4px 8px; border-radius: 4px; }
        
        .bp-body { padding: 24px; border-bottom: 2px dashed #e2e8f0; position: relative; }
        .bp-body::before, .bp-body::after { content: ''; position: absolute; bottom: -10px; width: 20px; height: 20px; background: #f8fafc; border-radius: 50%; }
        .bp-body::before { left: -10px; }
        .bp-body::after { right: -10px; }

        .bp-route { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .bp-route h2 { font-size: 32px; margin: 0; color: #0f172a; }
        .bp-route span { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 600; }
        .bp-route .material-icons-round { color: #cbd5e1; font-size: 32px; transform: rotate(90deg); }

        .bp-details { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
        .detail-item span { display: block; font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; }
        .detail-item strong { display: block; font-size: 14px; color: #1e293b; }

        .bp-highlights { display: grid; grid-template-columns: repeat(4, 1fr); background: #eff6ff; border-radius: 12px; padding: 12px; text-align: center; }
        .h-item span { display: block; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
        .h-item strong { display: block; font-size: 18px; color: #2563eb; }

        .bp-footer { padding: 24px; text-align: center; background: white; }
        .barcode-placeholder { padding: 20px; background: #f8fafc; border-radius: 12px; margin-bottom: 16px; }
        .barcode-placeholder .material-icons-round { font-size: 64px; color: #1e293b; }
        .bp-actions { display: flex; gap: 12px; justify-content: center; }
      `}</style>
    </AppLayout>
  );
};

export default CheckinPage;
