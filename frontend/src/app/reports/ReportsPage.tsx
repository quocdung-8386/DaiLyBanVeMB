import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout, { showToast } from '../../components/AppLayout';

interface ReportsPageProps {
  onNavigate?: (id: string) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [dateRange, setDateRange] = useState('Tháng này');
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('Đã xuất báo cáo PDF thành công!', 'success');
    }, 1500);
  };

  const handleShare = () => {
    setIsSharing(true);
    setTimeout(() => {
      setIsSharing(false);
      showToast('Link báo cáo đã được sao chép vào bộ nhớ tạm!', 'success');
    }, 800);
  };

  const stats = [
    { label: 'Tổng doanh thu (Gross)', value: '1,250,000,000 đ', change: '+12.5%', icon: 'payments', color: '#2563eb' },
    { label: 'Lợi nhuận ròng (Net)', value: '185,000,000 đ', change: '+18.2%', icon: 'account_balance_wallet', color: '#10b981' },
    { label: 'Số vé đã phát hành', value: '856', change: '+5.4%', icon: 'confirmation_number', color: '#f59e0b' },
    { label: 'Tỷ lệ hoàn/hủy', value: '1.2%', change: '-0.5%', icon: 'assignment_return', color: '#ef4444' },
  ];

  return (
    <AppLayout 
      activeItem="reports" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Hệ thống', page: 'dashboard' }, { label: 'Báo cáo & Thống kê' }]}
    >
      <div className="reports-page-content">
        
        {/* ── HEADER ── */}
        <div className="page-header-flex">
          <div>
            <h1>Trung tâm Phân tích Dữ liệu</h1>
            <p>Theo dõi hiệu suất kinh doanh và dòng tiền theo thời gian thực.</p>
          </div>
          <div className="action-buttons">
            <div className="date-picker-mini">
              <span className="material-icons-round">calendar_today</span>
              <select value={dateRange} onChange={e => setDateRange(e.target.value)}>
                <option>Hôm nay</option>
                <option>Tuần này</option>
                <option>Tháng này</option>
                <option>Năm nay</option>
              </select>
            </div>
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={isExporting}
            >
              <span className={`material-icons-round ${isExporting ? 'animate-spin' : ''}`}>{isExporting ? 'sync' : 'file_download'}</span> 
              {isExporting ? 'Đang xử lý...' : 'Xuất PDF'}
            </Button>
            <Button 
              onClick={handleShare}
              disabled={isSharing}
            >
              <span className={`material-icons-round ${isSharing ? 'animate-spin' : ''}`}>{isSharing ? 'sync' : 'share'}</span> 
              {isSharing ? 'Đang gửi...' : 'Chia sẻ báo cáo'}
            </Button>
          </div>
        </div>

        {/* ── KPI GRID ── */}
        <div className="kpi-grid">
          {stats.map((s, i) => (
            <Card key={i} className="kpi-card">
              <div className="kpi-header">
                <div className="kpi-icon" style={{ background: `${s.color}15`, color: s.color }}>
                  <span className="material-icons-round">{s.icon}</span>
                </div>
                <span className={`kpi-trend ${s.change.startsWith('+') ? 'up' : 'down'}`}>
                  {s.change}
                </span>
              </div>
              <div className="kpi-body">
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
              <div className="kpi-chart-mini">
                <div className="mini-bar" style={{ height: '40%' }}></div>
                <div className="mini-bar" style={{ height: '60%' }}></div>
                <div className="mini-bar" style={{ height: '30%' }}></div>
                <div className="mini-bar" style={{ height: '80%' }}></div>
                <div className="mini-bar" style={{ height: '50%' }}></div>
              </div>
            </Card>
          ))}
        </div>

        {/* ── CHARTS SECTION ── */}
        <div className="charts-main-grid">
          <Card className="chart-large">
            <div className="card-header-flex">
              <h3>Biểu đồ Doanh thu & Lợi nhuận</h3>
              <div className="chart-legend">
                <span><i className="dot rev"></i> Doanh thu</span>
                <span><i className="dot prof"></i> Lợi nhuận</span>
              </div>
            </div>
            <div className="visual-chart-area">
              <div className="y-axis">
                <span>1.5B</span><span>1B</span><span>500M</span><span>0</span>
              </div>
              <div className="chart-bars">
                {[40, 65, 45, 90, 75, 55, 85].map((h, i) => (
                  <div key={i} className="bar-group">
                    <div className="bar rev" style={{ height: `${h}%` }}></div>
                    <div className="bar prof" style={{ height: `${h * 0.3}%` }}></div>
                    <span className="label">Th {i+1}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="chart-side">
            <h3>Cơ cấu Hãng hàng không</h3>
            <div className="donut-container">
              <svg viewBox="0 0 100 100" className="donut-svg">
                <circle className="donut-ring" cx="50" cy="50" r="40" fill="transparent" stroke="#f1f5f9" strokeWidth="12"></circle>
                <circle className="donut-segment vna" cx="50" cy="50" r="40" fill="transparent" stroke="#005a8c" strokeWidth="12" strokeDasharray="60 40" strokeDashoffset="25"></circle>
                <circle className="donut-segment vj" cx="50" cy="50" r="40" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray="25 75" strokeDashoffset="-35"></circle>
                <circle className="donut-segment qh" cx="50" cy="50" r="40" fill="transparent" stroke="#10b981" strokeWidth="12" strokeDasharray="15 85" strokeDashoffset="-60"></circle>
                <text x="50" y="55" textAnchor="middle" className="donut-text">Tickets</text>
              </svg>
            </div>
            <div className="donut-legend">
              <div className="legend-row"><span>Vietnam Airlines</span><b>60%</b></div>
              <div className="legend-row"><span>VietJet Air</span><b>25%</b></div>
              <div className="legend-row"><span>Bamboo Airways</span><b>15%</b></div>
            </div>
          </Card>
        </div>

        {/* ── TOP ROUTES TABLE ── */}
        <Card className="routes-table-card">
          <div className="card-header-flex">
            <h3>Top 5 Tuyến bay Hiệu quả nhất</h3>
            <Button size="sm" variant="outline" onClick={() => onNavigate?.('flights')}>Xem chi tiết</Button>
          </div>
          <table className="premium-table">
            <thead>
              <tr>
                <th>TUYẾN BAY</th>
                <th>SỐ LƯỢNG VÉ</th>
                <th>DOANH THU</th>
                <th>LỢI NHUẬN</th>
                <th>TĂNG TRƯỞNG</th>
              </tr>
            </thead>
            <tbody>
              {[
                { route: 'HAN - SGN', count: 425, rev: '650.4M', prof: '42.5M', trend: '+12%' },
                { route: 'SGN - DAD', count: 210, rev: '280.2M', prof: '18.4M', trend: '+8%' },
                { route: 'HAN - PQC', count: 185, rev: '310.5M', prof: '22.1M', trend: '+15%' },
                { route: 'SGN - VII', count: 120, rev: '145.8M', prof: '9.2M', trend: '-2%' },
                { route: 'DAD - HAN', count: 95, rev: '112.4M', prof: '7.8M', trend: '+5%' },
              ].map((r, i) => (
                <tr key={i}>
                  <td><div className="route-cell"><span className="material-icons-round">flight_takeoff</span> {r.route}</div></td>
                  <td><b>{r.count}</b></td>
                  <td>{r.rev} đ</td>
                  <td><b className="text-success">{r.prof} đ</b></td>
                  <td><span className={`trend-pill ${r.trend.startsWith('+') ? 'up' : 'down'}`}>{r.trend}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <style>{`
        .reports-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 24px; color: #1e293b; }
        .page-header-flex p { font-size: 14px; color: #64748b; }
        .action-buttons { display: flex; gap: 12px; align-items: center; }

        .date-picker-mini { display: flex; align-items: center; gap: 8px; background: white; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 10px; }
        .date-picker-mini .material-icons-round { font-size: 18px; color: #94a3b8; }
        .date-picker-mini select { border: none; outline: none; font-size: 13px; font-weight: 600; color: #1e293b; background: transparent; cursor: pointer; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 24px; }
        .kpi-card { padding: 20px; border: none; position: relative; overflow: hidden; }
        .kpi-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .kpi-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .kpi-trend { font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 20px; }
        .kpi-trend.up { background: #dcfce7; color: #15803d; }
        .kpi-trend.down { background: #fee2e2; color: #b91c1c; }
        .kpi-body h3 { font-size: 20px; color: #1e293b; margin-bottom: 4px; }
        .kpi-body p { font-size: 12px; color: #64748b; font-weight: 600; }
        .kpi-chart-mini { display: flex; align-items: flex-end; gap: 4px; height: 30px; position: absolute; bottom: 0; left: 0; right: 0; padding: 0 20px; opacity: 0.3; }
        .mini-bar { flex: 1; background: #cbd5e1; border-radius: 2px 2px 0 0; }

        .charts-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 24px; }
        .chart-large, .chart-side { padding: 24px; border: none; }
        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .chart-legend { display: flex; gap: 16px; }
        .chart-legend span { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; font-weight: 600; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.rev { background: #2563eb; }
        .dot.prof { background: #10b981; }

        .visual-chart-area { display: flex; height: 260px; padding-top: 10px; }
        .y-axis { display: flex; flex-direction: column; justify-content: space-between; padding-right: 16px; border-right: 1px solid #f1f5f9; font-size: 10px; color: #94a3b8; font-weight: 700; }
        .chart-bars { flex: 1; display: flex; align-items: flex-end; justify-content: space-around; padding: 0 20px; }
        .bar-group { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; height: 100%; justify-content: flex-end; }
        .bar { width: 12px; border-radius: 4px 4px 0 0; transition: height 0.6s ease; }
        .bar.rev { background: #2563eb; }
        .bar.prof { background: #10b981; }
        .bar-group .label { margin-top: 12px; font-size: 10px; color: #94a3b8; font-weight: 700; }

        .donut-container { height: 180px; display: flex; justify-content: center; align-items: center; margin: 20px 0; }
        .donut-svg { height: 100%; transform: rotate(-90deg); }
        .donut-text { transform: rotate(90deg); font-size: 10px; font-weight: 800; fill: #64748b; }
        .donut-legend { display: flex; flex-direction: column; gap: 10px; }
        .legend-row { display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
        .legend-row b { color: #1e293b; }

        .routes-table-card { padding: 0; overflow: hidden; border: none; }
        .routes-table-card .card-header-flex { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; margin-bottom: 0; }
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 14px 24px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .route-cell { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #1e293b; }
        .route-cell .material-icons-round { color: #3b82f6; font-size: 18px; }
        .trend-pill { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .trend-pill.up { background: #dcfce7; color: #15803d; }
        .trend-pill.down { background: #fee2e2; color: #b91c1c; }
        .text-success { color: #10b981 !important; }

        .material-icons-round.animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AppLayout>
  );
};

export default ReportsPage;
