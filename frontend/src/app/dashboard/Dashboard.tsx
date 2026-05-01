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
        <Header />
        <main className="content">
          <div className="breadcrumb">
            <span className="current">Dashboard</span>
          </div>

          <div className="page-header">
            <div>
              <h1>Tổng quan hệ thống</h1>
              <p>Cập nhật nhanh tình hình kinh doanh hôm nay.</p>
            </div>
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
                  <p className="metric-title">{m.title}</p>
                  <div className="metric-icon-box">
                    <span className="material-icons-round metric-icon">{m.icon}</span>
                  </div>
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
                    <div className="bar" style={{ height: '40%' }}></div>
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '45%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar" style={{ height: '55%' }}></div>
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
        .page-header h1 { margin-bottom: 4px; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        .ai-insight {
          background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
          color: white;
          padding: 24px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: var(--space-xl);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
          position: relative;
          overflow: hidden;
        }
        .ai-insight::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
        }
        .ai-icon {
          width: 52px;
          height: 52px;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-icon .material-icons-round { font-size: 28px; }
        .ai-content h3 { color: white; font-size: 17px; font-weight: 700; margin-bottom: 4px; }
        .ai-content p { font-size: 14px; opacity: 0.9; line-height: 1.5; font-weight: 500; }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
        }
        .metric-card { padding: 24px; }
        .metric-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .metric-icon-box {
          width: 44px;
          height: 44px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .metric-icon { font-size: 22px; }
        .metric-title { font-size: 13px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .metric-value { font-size: 26px; font-weight: 800; color: var(--text-main); margin-bottom: 8px; letter-spacing: -0.02em; }
        .metric-change { font-size: 13px; display: flex; align-items: center; gap: 4px; font-weight: 600; }
        .metric-change.up { color: var(--success); }
        .metric-change .material-icons-round { font-size: 16px; }

        .data-grid { display: grid; grid-template-columns: 2fr 1fr; gap: var(--space-xl); }
        .left-panel, .right-panel { display: flex; flex-direction: column; gap: var(--space-xl); }

        .chart-placeholder { height: 220px; display: flex; align-items: flex-end; padding: 20px 0 10px; }
        .bar-chart { display: flex; align-items: flex-end; justify-content: space-between; width: 100%; height: 100%; gap: 12px; }
        .bar { 
          background: linear-gradient(to top, var(--primary-light), var(--primary)); 
          width: 100%; 
          border-radius: 6px 6px 2px 2px; 
          transition: all 0.3s;
          opacity: 0.8;
        }
        .bar:hover { opacity: 1; transform: scaleX(1.05); }

        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; border-bottom: 1px solid var(--border); }
        .data-table td { padding: 16px; font-size: 14px; border-bottom: 1px solid var(--border); color: var(--text-main); }
        .data-table tr:last-child td { border-bottom: none; }

        .pie-chart-container { display: flex; flex-direction: column; align-items: center; gap: 24px; padding: 10px 0; }
        .pie-chart-placeholder {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: conic-gradient(var(--primary) 0% 45%, #60a5fa 45% 75%, #e2e8f0 75% 100%);
          box-shadow: inset 0 0 0 30px white;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .pie-chart-placeholder::after {
          content: '45%';
          font-size: 20px;
          font-weight: 800;
          color: var(--text-main);
        }
        .legend { width: 100%; display: flex; flex-direction: column; gap: 10px; }
        .legend li { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 500; color: var(--text-secondary); }
        .legend li span:last-child { margin-left: auto; font-weight: 700; color: var(--text-main); }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .dot-primary { background: var(--primary); }
        .dot-info { background: #60a5fa; }
        .dot-muted { background: #e2e8f0; }

        .flight-list { display: flex; flex-direction: column; gap: 12px; }
        .flight-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #f1f5f9; transition: all 0.2s; }
        .flight-item:hover { border-color: var(--primary-light); background: white; shadow: var(--shadow-sm); }
        .flight-info { display: flex; align-items: center; gap: 16px; }
        .flight-icon { width: 40px; height: 40px; border-radius: 10px; background: white; display: flex; align-items: center; justify-content: center; color: var(--primary); border: 1px solid #e2e8f0; }
        .flight-id { font-size: 14px; font-weight: 700; color: var(--text-main); margin: 0; }
        .flight-route { font-size: 12px; color: var(--text-secondary); margin: 2px 0 0; font-weight: 500; }
        .flight-status-container { text-align: right; }
        .flight-time { font-size: 15px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
      `}</style>
    </div>
  );
};

export default Dashboard;
