import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';

interface ReportsPageProps {
  onNavigate: (page: string) => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onNavigate }) => {
  const [dateRange, setDateRange] = useState('Tháng này');

  return (
    <AppLayout activeItem="reports" onNavigate={onNavigate} breadcrumb={[{ label: 'Báo Cáo Thống Kê' }]}>
      <div className="reports-page">
      <div className="page-header">
        <div className="header-titles">
          <h1>Báo Cáo Thống Kê</h1>
          <p>Phân tích doanh thu và hiệu suất bán hàng của đại lý</p>
        </div>
        <div className="header-actions">
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-select">
            <option>Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
          <button className="btn-export">
            <span className="material-icons-round">download</span>
            Xuất Excel
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <Card className="kpi-card highlight">
          <div className="kpi-icon"><span className="material-icons-round">payments</span></div>
          <div className="kpi-info">
            <p className="kpi-label">Tổng Doanh Thu</p>
            <h3 className="kpi-value">1,250,000,000 đ</h3>
            <p className="kpi-trend positive"><span className="material-icons-round">trending_up</span> +15.3% so với kỳ trước</p>
          </div>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-icon blue"><span className="material-icons-round">confirmation_number</span></div>
          <div className="kpi-info">
            <p className="kpi-label">Vé Đã Bán</p>
            <h3 className="kpi-value">856</h3>
            <p className="kpi-trend positive"><span className="material-icons-round">trending_up</span> +5.2% so với kỳ trước</p>
          </div>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-icon orange"><span className="material-icons-round">cancel</span></div>
          <div className="kpi-info">
            <p className="kpi-label">Vé Đã Hủy / Hoàn</p>
            <h3 className="kpi-value">24</h3>
            <p className="kpi-trend negative"><span className="material-icons-round">trending_down</span> -2.1% so với kỳ trước</p>
          </div>
        </Card>
        <Card className="kpi-card">
          <div className="kpi-icon green"><span className="material-icons-round">account_balance_wallet</span></div>
          <div className="kpi-info">
            <p className="kpi-label">Hoa Hồng Đại Lý</p>
            <h3 className="kpi-value">125,000,000 đ</h3>
            <p className="kpi-trend positive"><span className="material-icons-round">trending_up</span> +12.4% so với kỳ trước</p>
          </div>
        </Card>
      </div>

      <div className="charts-container">
        <Card className="chart-card main-chart">
          <h3>Biểu đồ Doanh Thu Theo Ngày</h3>
          <div className="chart-placeholder">
            {/* Giả lập biểu đồ cột/đường */}
            <div className="bar" style={{height: '40%'}}><span>01/06</span></div>
            <div className="bar" style={{height: '60%'}}><span>02/06</span></div>
            <div className="bar" style={{height: '30%'}}><span>03/06</span></div>
            <div className="bar" style={{height: '80%'}}><span>04/06</span></div>
            <div className="bar" style={{height: '90%'}}><span>05/06</span></div>
            <div className="bar" style={{height: '50%'}}><span>06/06</span></div>
            <div className="bar" style={{height: '75%'}}><span>07/06</span></div>
          </div>
        </Card>

        <Card className="chart-card sub-chart">
          <h3>Tỷ Trọng Hãng Bay</h3>
          <div className="donut-placeholder">
            <div className="donut-circle"></div>
            <div className="legend">
              <div className="legend-item"><span className="dot vna"></span> Vietnam Airlines (55%)</div>
              <div className="legend-item"><span className="dot vj"></span> VietJet Air (30%)</div>
              <div className="legend-item"><span className="dot qh"></span> Bamboo Airways (15%)</div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="table-card">
        <h3>Top Tuyến Bay Bán Chạy</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã Tuyến</th>
              <th>Hành Trình</th>
              <th>Số Vé Đã Bán</th>
              <th>Doanh Thu</th>
              <th>Tăng Trưởng</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="mono-code">HAN-SGN</span></td>
              <td>Hà Nội - TP.Hồ Chí Minh</td>
              <td>450</td>
              <td>650,000,000 đ</td>
              <td className="trend-up">+12%</td>
            </tr>
            <tr>
              <td><span className="mono-code">SGN-DAD</span></td>
              <td>TP.Hồ Chí Minh - Đà Nẵng</td>
              <td>210</td>
              <td>250,000,000 đ</td>
              <td className="trend-up">+5%</td>
            </tr>
            <tr>
              <td><span className="mono-code">HAN-DAD</span></td>
              <td>Hà Nội - Đà Nẵng</td>
              <td>150</td>
              <td>180,000,000 đ</td>
              <td className="trend-down">-2%</td>
            </tr>
          </tbody>
        </table>
      </Card>

      <style>{`
        .reports-page { padding: 24px 32px; max-width: 1400px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }
        
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
        .header-titles h1 { font-size: 26px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
        .header-titles p { font-size: 15px; color: #64748b; margin: 0; }
        
        .header-actions { display: flex; gap: 16px; }
        .date-select { padding: 10px 16px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-weight: 600; color: #1e293b; outline: none; background: white; cursor: pointer; }
        .btn-export { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-export:hover { background: #059669; }

        .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 32px; }
        .kpi-card { display: flex; align-items: center; gap: 20px; padding: 24px; }
        .kpi-card.highlight { background: linear-gradient(135deg, #0e74be, #0284c7); color: white; }
        .kpi-card.highlight .kpi-label { color: rgba(255,255,255,0.8); }
        .kpi-card.highlight .kpi-value { color: white; }
        .kpi-card.highlight .kpi-icon { background: rgba(255,255,255,0.2); color: white; }
        
        .kpi-icon { width: 56px; height: 56px; border-radius: 16px; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 28px; }
        .kpi-icon.blue { background: #eff6ff; color: #0e74be; }
        .kpi-icon.orange { background: #fff7ed; color: #f97316; }
        .kpi-icon.green { background: #ecfdf5; color: #10b981; }
        
        .kpi-info { flex: 1; }
        .kpi-label { font-size: 13px; font-weight: 600; color: #64748b; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; }
        .kpi-value { font-size: 24px; font-weight: 800; color: #1e293b; margin: 0 0 8px 0; }
        .kpi-trend { font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px; margin: 0; }
        .kpi-trend.positive { color: #10b981; }
        .kpi-trend.negative { color: #ef4444; }
        .kpi-card.highlight .kpi-trend.positive { color: #6ee7b7; }

        .charts-container { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 32px; }
        .chart-card { padding: 24px; }
        .chart-card h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 24px 0; }
        
        .chart-placeholder { height: 250px; display: flex; align-items: flex-end; gap: 12%; padding-top: 20px; border-bottom: 2px solid #f1f5f9; position: relative; }
        .bar { width: 40px; background: #0e74be; border-radius: 6px 6px 0 0; position: relative; transition: height 1s ease-out; }
        .bar:hover { background: #3b82f6; }
        .bar span { position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%); font-size: 12px; color: #64748b; font-weight: 500; }

        .donut-placeholder { height: 250px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 24px; }
        .donut-circle { width: 140px; height: 140px; border-radius: 50%; border: 24px solid #f1f5f9; border-top-color: #0e74be; border-right-color: #f97316; border-bottom-color: #10b981; transform: rotate(45deg); }
        .legend { width: 100%; display: flex; flex-direction: column; gap: 12px; }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #475569; }
        .dot { width: 12px; height: 12px; border-radius: 4px; }
        .dot.vna { background: #0e74be; }
        .dot.vj { background: #f97316; }
        .dot.qh { background: #10b981; }

        .table-card { padding: 24px; }
        .table-card h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 12px 16px; font-size: 13px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
        .data-table td { padding: 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; font-weight: 500; }
        .mono-code { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 4px; color: #0e74be; font-weight: 600; }
        .trend-up { color: #10b981; font-weight: 600; }
        .trend-down { color: #ef4444; font-weight: 600; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      </div>
    </AppLayout>
  );
};

export default ReportsPage;
