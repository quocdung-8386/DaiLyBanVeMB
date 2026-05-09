import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface GateManagementPageProps {
  onNavigate: (id: string) => void;
  bookings: any[];
  onUpdateStatus?: (id: string, status: string, badge: string) => void;
}

const GateManagementPage: React.FC<GateManagementPageProps> = ({ onNavigate, bookings, onUpdateStatus }) => {
  const [gateStatus, setGateStatus] = useState<'OPEN' | 'BOARDING' | 'CLOSED'>('OPEN');
  
  // Filter bookings for a specific flight (simulated VN234 for demo)
  const flightBookings = bookings.filter(b => b.status === 'Đã xuất vé' || b.status === 'Boarded');
  const boardedCount = flightBookings.filter(b => b.status === 'Boarded').length;

  const handleScanBoarding = (id: string) => {
    if (onUpdateStatus) {
      onUpdateStatus(id, 'Boarded', 'success');
      alert('Đã quét thẻ lên máy bay thành công!');
    }
  };

  return (
    <AppLayout activeItem="gate-management" onNavigate={onNavigate}>
      <div className="gate-dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="flight-info">
            <div className="flight-number">VN234</div>
            <div className="flight-details">
              <h1>Hà Nội (HAN) <span className="material-icons-round">flight_takeoff</span> Hồ Chí Minh (SGN)</h1>
              <p>Lịch trình: 14:30 • Cửa: 04 • Tàu bay: A321</p>
            </div>
          </div>
          
          <div className="status-controls">
            <button 
              className={`status-btn ${gateStatus === 'OPEN' ? 'active open' : ''}`}
              onClick={() => setGateStatus('OPEN')}
            >
              Mở cửa
            </button>
            <button 
              className={`status-btn ${gateStatus === 'BOARDING' ? 'active boarding' : ''}`}
              onClick={() => setGateStatus('BOARDING')}
            >
              Đang lên tàu
            </button>
            <button 
              className={`status-btn ${gateStatus === 'CLOSED' ? 'active closed' : ''}`}
              onClick={() => setGateStatus('CLOSED')}
            >
              Đóng cửa
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-icon checked">
              <span className="material-icons-round">how_to_reg</span>
            </div>
            <div className="stat-info">
              <h3>Đã Check-in</h3>
              <div className="stat-value">245 <span className="text-muted">/ 280</span></div>
            </div>
          </Card>
          
          <Card className="stat-card">
            <div className="stat-icon pending">
              <span className="material-icons-round">pending_actions</span>
            </div>
            <div className="stat-info">
              <h3>Chưa Check-in</h3>
              <div className="stat-value">35</div>
            </div>
          </Card>
          
          <Card className="stat-card highlight">
            <div className="stat-icon boarded">
              <span className="material-icons-round">airplane_ticket</span>
            </div>
            <div className="stat-info">
              <h3>Đã Lên tàu</h3>
              <div className="stat-value">120 <span className="text-muted">/ 245</span></div>
            </div>
            <div className="progress-bar">
              <div className="progress" style={{ width: '48%' }}></div>
            </div>
          </Card>
        </div>

        {/* Main Workspace */}
        <div className="main-workspace">
          <Card className="passenger-panel" noPadding>
            <div className="panel-header">
              <h2>Danh sách Hành khách</h2>
              <div className="search-box">
                <span className="material-icons-round">search</span>
                <input type="text" placeholder="Tìm tên, ghế hoặc số TT..." />
              </div>
            </div>
            <div className="table-responsive">
              <table className="manifest-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ghế</th>
                    <th>Tên Hành khách</th>
                    <th>Nhóm</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {flightBookings.map((b, i) => (
                    <tr key={b.id}>
                      <td>{String(i + 1).padStart(3, '0')}</td>
                      <td><div className="seat-badge">{b.seat}</div></td>
                      <td>
                        <strong>{b.customer}</strong>
                        <span className="sub-text">PNR: {b.pnr}</span>
                      </td>
                      <td>Nhóm {i % 3 + 1}</td>
                      <td>
                        <span className={`badge badge-${b.status === 'Boarded' ? 'success' : 'primary'}`}>
                          {b.status === 'Boarded' ? 'Đã Lên tàu' : 'Đã Check-in'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="icon-btn scan-btn" 
                          title="Quét Thẻ Lên Máy Bay"
                          disabled={b.status === 'Boarded'}
                          onClick={() => handleScanBoarding(b.id)}
                        >
                          <span className="material-icons-round">qr_code_scanner</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {flightBookings.length === 0 && (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                        Chưa có hành khách nào hoàn tất check-in cho chuyến bay này.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="sidebar-workspace">
            <Card className="scanner-card">
              <div className="scanner-simulation">
                <div className="scanner-viewport">
                  <div className="scan-line"></div>
                  <span className="material-icons-round">qr_code_2</span>
                  <p>Sẵn sàng Quét</p>
                </div>
              </div>
              <Button variant="outline" fullWidth>Nhập Thủ công</Button>
            </Card>

            <Card className="alerts-card" title="Cảnh báo Gần đây">
              <div className="alert-list">
                <div className="alert-item warning">
                  <div className="alert-icon"><span className="material-icons-round">luggage</span></div>
                  <div className="alert-content">
                    <strong>Hành lý quá cước</strong>
                    <p>Ghế 14C - Chờ thanh toán phí hành lý quá cước.</p>
                  </div>
                </div>
                <div className="alert-item info">
                  <div className="alert-icon"><span className="material-icons-round">accessible</span></div>
                  <div className="alert-content">
                    <strong>Hỗ trợ Xe lăn</strong>
                    <p>Cần hỗ trợ tại Cửa cho Hành khách 15D.</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .gate-dashboard {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: white;
          padding: 24px;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .flight-info { display: flex; align-items: center; gap: 20px; }
        .flight-number { background: #0A192F; color: white; font-size: 24px; font-weight: 800; padding: 12px 16px; border-radius: 12px; letter-spacing: 1px; }
        .flight-details h1 { margin: 0 0 4px 0; font-size: 20px; color: #0f172a; display: flex; align-items: center; gap: 8px; }
        .flight-details h1 .material-icons-round { color: #94a3b8; font-size: 20px; transform: rotate(90deg); }
        .flight-details p { margin: 0; color: #64748b; font-weight: 500; font-size: 14px; }

        .status-controls {
          display: flex;
          gap: 8px;
          background: #f8fafc;
          padding: 6px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .status-btn {
          padding: 10px 20px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 700;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-btn.active.open { background: white; color: #10b981; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .status-btn.active.boarding { background: white; color: #2563eb; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
        .status-btn.active.closed { background: white; color: #ef4444; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .stat-card .card-content { display: flex; align-items: center; gap: 16px; padding: 24px; position: relative; }
        .stat-card.highlight { background: linear-gradient(135deg, #0A192F, #112240); border: none; }
        .stat-card.highlight * { color: white !important; }

        .stat-icon {
          width: 56px; height: 56px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
        }
        .stat-icon .material-icons-round { font-size: 28px; }
        .stat-icon.checked { background: #dcfce7; color: #15803d; }
        .stat-icon.pending { background: #fef3c7; color: #b45309; }
        .stat-icon.boarded { background: rgba(255,255,255,0.1); color: #00B4D8; }

        .stat-info h3 { margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .stat-value { font-size: 28px; font-weight: 800; color: #0f172a; }
        .stat-value .text-muted { font-size: 16px; font-weight: 600; color: #94a3b8; }

        .progress-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: rgba(255,255,255,0.1); }
        .progress { height: 100%; background: #00B4D8; }

        .main-workspace {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }

        .panel-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: #fafbfc;
        }
        .panel-header h2 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }

        .search-box {
          display: flex; align-items: center; gap: 8px;
          background: white; padding: 8px 16px; border-radius: 8px;
          border: 1px solid #cbd5e1;
        }
        .search-box input { border: none; background: transparent; outline: none; width: 220px; font-size: 13px; }
        .search-box .material-icons-round { color: #94a3b8; font-size: 18px; }

        .manifest-table { width: 100%; border-collapse: collapse; }
        .manifest-table th { text-align: left; padding: 12px 24px; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #e2e8f0; background: #fafbfc; }
        .manifest-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        
        .seat-badge { background: #f8fafc; border: 1px solid #cbd5e1; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 13px; color: #0f172a; display: inline-block; }
        .manifest-table td strong { display: block; font-size: 14px; color: #0f172a; margin-bottom: 2px; }
        .manifest-table td .sub-text { font-size: 12px; color: #64748b; }

        .icon-btn { width: 36px; height: 36px; border-radius: 8px; border: none; background: transparent; cursor: pointer; color: #cbd5e1; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn.scan-btn { background: #eff6ff; color: #2563eb; }
        .icon-btn.scan-btn:hover { background: #2563eb; color: white; transform: scale(1.05); }

        .sidebar-workspace { display: flex; flex-direction: column; gap: 24px; }

        .scanner-simulation {
          background: #f8fafc;
          border: 2px dashed #cbd5e1;
          border-radius: 12px;
          padding: 40px 20px;
          text-align: center;
          margin-bottom: 16px;
        }
        .scanner-viewport { position: relative; margin-bottom: 16px; display: inline-block; }
        .scanner-viewport .material-icons-round { font-size: 80px; color: #94a3b8; opacity: 0.5; }
        .scanner-viewport p { margin: 12px 0 0; font-weight: 600; color: #64748b; font-size: 14px; }
        .scan-line {
          position: absolute; top: 0; left: -10px; right: -10px;
          height: 2px; background: #10b981;
          box-shadow: 0 0 12px 2px rgba(16, 185, 129, 0.6);
          animation: scan 2s infinite linear;
        }
        @keyframes scan { 0% { top: 10%; } 50% { top: 90%; } 100% { top: 10%; } }

        .alert-list { display: flex; flex-direction: column; gap: 12px; }
        .alert-item { display: flex; gap: 12px; padding: 12px; border-radius: 8px; border-left: 4px solid transparent; }
        .alert-item.warning { background: #fffbeb; border-left-color: #f59e0b; }
        .alert-item.info { background: #eff6ff; border-left-color: #2563eb; }
        
        .alert-icon { margin-top: 2px; }
        .alert-item.warning .alert-icon { color: #f59e0b; }
        .alert-item.info .alert-icon { color: #2563eb; }
        
        .alert-content strong { display: block; font-size: 14px; color: #1e293b; margin-bottom: 2px; }
        .alert-content p { margin: 0; font-size: 13px; color: #64748b; line-height: 1.4; }
      `}</style>
    </AppLayout>
  );
};

export default GateManagementPage;
