import React from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface DashboardProps {
  onNavigate?: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const metrics = [
    { title: 'Tổng doanh thu hôm nay', value: '1.250.000.000 VNĐ', change: '+12% so với hôm qua', icon: 'payments', trend: 'up' },
    { title: 'Tổng số vé đã bán', value: '850 vé', change: '+5% so với hôm qua', icon: 'confirmation_number', trend: 'up' },
    { title: 'Tổng số Booking', value: '1,240 booking', change: '+8% so với hôm qua', icon: 'event_seat', trend: 'up' },
    { title: 'Khách hàng mới', value: '125 khách', change: '+15% so với hôm qua', icon: 'person_add', trend: 'up' },
  ];

  const recentBookings = [
    { id: 'BK-9921', customer: 'Trần Văn B', status: 'Đã thanh toán', amount: '4.500.000 VNĐ', badge: 'success' },
    { id: 'BK-9920', customer: 'Lê Thị C', status: 'Đang xử lý', amount: '2.100.000 VNĐ', badge: 'info' },
    { id: 'BK-9919', customer: 'Phạm Văn D', status: 'Hủy', amount: '0 VNĐ', badge: 'danger' },
  ];

  const upcomingFlights = [
    { id: 'VN-214', route: 'SGN → HAN', time: '14:30', status: 'Đúng giờ', badge: 'success' },
    { id: 'VJ-881', route: 'HAN → PQC', time: '15:45', status: 'Delay', badge: 'warning' },
    { id: 'QH-112', route: 'DAD → SGN', time: '16:15', status: 'Đúng giờ', badge: 'success' },
  ];

  return (
    <div className="layout">
      <Sidebar activeItem="dashboard" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Dashboard - Hệ thống Quản lý Bán vé Máy bay" />
        
        <main className="content">
          <div className="welcome-section">
            <h1>Tổng quan hệ thống</h1>
            <p>Cập nhật nhanh tình hình kinh doanh hôm nay.</p>
          </div>

          <div className="ai-insight">
            <div className="ai-icon">
              <span className="material-icons-round">smart_toy</span>
            </div>
            <div className="ai-content">
              <h3>AI Insight</h3>
              <p>"Tuyến bay Hà Nội - Phú Quốc đang có nhu cầu tăng cao 40% trong tuần tới. Đề xuất tăng cường quảng bá gói vé gia đình."</p>
            </div>
          </div>

          <div className="metrics-grid">
            {metrics.map((m, i) => (
              <Card key={i} className="metric-card">
                <div className="metric-header">
                  <span className="material-icons-round metric-icon">{m.icon}</span>
                  <p className="metric-title">{m.title}</p>
                </div>
                <h2 className="metric-value">{m.value}</h2>
                <p className={`metric-change ${m.trend}`}>
                  <span className="material-icons-round">{m.trend === 'up' ? 'trending_up' : 'trending_down'}</span>
                  {m.change}
                </p>
              </Card>
            ))}
          </div>

          <div className="data-grid">
            <div className="left-panel">
              <Card title="Biểu đồ Doanh thu" headerAction={
                <div className="btn-group">
                  <Button variant="outline" size="sm">Tuần</Button>
                  <Button variant="outline" size="sm">Tháng</Button>
                </div>
              }>
                <div className="chart-placeholder">
                  <div className="bar-chart">
                    <div className="bar" style={{height: '40%'}}></div>
                    <div className="bar" style={{height: '60%'}}></div>
                    <div className="bar" style={{height: '45%'}}></div>
                    <div className="bar" style={{height: '80%'}}></div>
                    <div className="bar" style={{height: '55%'}}></div>
                  </div>
                </div>
              </Card>

              <Card title="Danh sách Booking gần nhất" headerAction={<Button variant="secondary" size="sm">Xem tất cả</Button>}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã Booking</th>
                      <th>Khách hàng</th>
                      <th>Trạng thái</th>
                      <th>Tổng tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((b, i) => (
                      <tr key={i}>
                        <td><strong>{b.id}</strong></td>
                        <td>{b.customer}</td>
                        <td><span className={`badge badge-${b.badge}`}>{b.status}</span></td>
                        <td>{b.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>

            <div className="right-panel">
              <Card title="Phân loại khách hàng">
                <div className="pie-chart-container">
                  <div className="pie-chart-placeholder"></div>
                  <ul className="legend">
                    <li><span className="dot dot-primary"></span> Khách lẻ <span>45%</span></li>
                    <li><span className="dot dot-info"></span> Đại lý <span>30%</span></li>
                    <li><span className="dot dot-muted"></span> VIP <span>25%</span></li>
                  </ul>
                </div>
              </Card>

              <Card title="Chuyến bay sắp khởi hành" headerAction={<a href="#" className="link-text">Lịch trình bay</a>}>
                <div className="flight-list">
                  {upcomingFlights.map((f, i) => (
                    <div key={i} className="flight-item">
                      <div className="flight-info">
                        <div className="flight-icon">
                          <span className="material-icons-round">flight_takeoff</span>
                        </div>
                        <div>
                          <p className="flight-id">{f.id}</p>
                          <p className="flight-route">{f.route}</p>
                        </div>
                      </div>
                      <div className="flight-status-container">
                        <p className="flight-time">{f.time}</p>
                        <span className={`badge badge-${f.badge}`}>{f.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Round" rel="stylesheet" />

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); }
        .content { padding: var(--space-xl); max-width: 1400px; margin: 0 auto; width: 100%; }

        .welcome-section { margin-bottom: var(--space-xl); }
        .welcome-section h1 { font-size: 28px; margin-bottom: 4px; }
        .welcome-section p { color: var(--text-secondary); }

        .ai-insight {
          background: linear-gradient(135deg, #1a73e8 0%, #1557b0 100%);
          color: white;
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          box-shadow: 0 4px 20px rgba(26, 115, 232, 0.3);
        }
        .ai-icon {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ai-icon .material-icons-round { font-size: 32px; }
        .ai-content h3 { color: white; font-size: 18px; margin-bottom: 4px; }
        .ai-content p { font-style: italic; opacity: 0.9; }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }
        .metric-header { display: flex; align-items: center; gap: var(--space-sm); margin-bottom: var(--space-md); }
        .metric-icon { color: var(--primary); font-size: 24px; }
        .metric-title { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
        .metric-value { font-size: 24px; margin-bottom: var(--space-sm); }
        .metric-change { font-size: 12px; display: flex; align-items: center; gap: 4px; }
        .metric-change.up { color: var(--success); }
        .metric-change .material-icons-round { font-size: 16px; }

        .data-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-xl); }
        .left-panel, .right-panel { display: flex; flex-direction: column; gap: var(--space-xl); }

        .btn-group { display: flex; border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; }
        .btn-group :global(.btn) { border: none; border-radius: 0; border-right: 1px solid var(--border); }
        .btn-group :global(.btn:last-child) { border-right: none; }

        .chart-placeholder { height: 200px; display: flex; align-items: flex-end; padding-top: var(--space-lg); }
        .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; width: 100%; height: 100%; gap: var(--space-md); }
        .bar { background: var(--primary-light); width: 100%; border-radius: 4px 4px 0 0; transition: background 0.3s; }
        .bar:hover { background: var(--primary); }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 12px; font-size: 12px; color: var(--text-muted); border-bottom: 1px solid var(--border); }
        .data-table td { padding: 16px 12px; font-size: 14px; border-bottom: 1px solid var(--border); }

        .pie-chart-container { display: flex; align-items: center; gap: var(--space-xl); }
        .pie-chart-placeholder {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: conic-gradient(var(--primary) 0% 45%, var(--primary-light) 45% 75%, #eee 75% 100%);
        }
        .legend { flex: 1; }
        .legend li { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 13px; }
        .legend li span:last-child { margin-left: auto; font-weight: 600; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot-primary { background: var(--primary); }
        .dot-info { background: var(--primary-light); }
        .dot-muted { background: #eee; }

        .link-text { font-size: 12px; color: var(--primary); font-weight: 500; }
        .flight-list { display: flex; flex-direction: column; gap: var(--space-md); }
        .flight-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: var(--bg-main); border-radius: var(--radius-md); }
        .flight-info { display: flex; align-items: center; gap: var(--space-md); }
        .flight-icon { width: 36px; height: 36px; border-radius: var(--radius-sm); background: white; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .flight-id { font-size: 14px; font-weight: 600; margin: 0; }
        .flight-route { font-size: 12px; color: var(--text-muted); margin: 0; }
        .flight-status-container { text-align: right; }
        .flight-time { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
