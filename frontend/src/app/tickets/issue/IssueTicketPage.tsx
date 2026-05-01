import React from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface IssueTicketPageProps {
  onNavigate?: (id: string) => void;
}

const IssueTicketPage: React.FC<IssueTicketPageProps> = ({ onNavigate }) => {
  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('tickets')}>Vé máy bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Xuất vé</span>
          </div>

          <div className="page-header mb-lg">
            <div>
              <h1>Xuất Vé Máy Bay</h1>
              <p>Thực hiện xuất vé cho các booking đã thanh toán thành công.</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate && onNavigate('tickets')}>
              <span className="material-icons-round">arrow_back</span>
              Quay lại
            </Button>
          </div>

          <div className="flex-layout">
            <div className="main-col">
              <Card className="form-card mb-md">
                <div className="card-title">
                  <span className="material-icons-round text-primary">search</span>
                  <h3>Tìm kiếm Booking</h3>
                </div>
                <div className="search-booking-row">
                  <div className="input-with-icon flex-1">
                    <span className="material-icons-round">tag</span>
                    <input type="text" placeholder="Nhập mã Booking hoặc PNR..." defaultValue="BKG-8A2F9" />
                  </div>
                  <Button className="btn-primary-alt">Tìm kiếm</Button>
                </div>
              </Card>

              <Card className="form-card">
                <div className="card-title">
                  <span className="material-icons-round text-primary">flight_takeoff</span>
                  <h3>Thông tin Hành trình</h3>
                </div>
                <div className="flight-details">
                  <div className="fd-row">
                    <div className="fd-item">
                      <p className="fd-label">Chuyến bay</p>
                      <p className="fd-val">VN-214 (Vietnam Airlines)</p>
                    </div>
                    <div className="fd-item">
                      <p className="fd-label">Hành trình</p>
                      <p className="fd-val">SGN - HAN</p>
                    </div>
                    <div className="fd-item">
                      <p className="fd-label">Ngày bay</p>
                      <p className="fd-val">12 Thg 10, 2023 - 08:30 AM</p>
                    </div>
                  </div>
                </div>

                <div className="card-title mt-lg">
                  <span className="material-icons-round text-primary">group</span>
                  <h3>Hành khách</h3>
                </div>
                <table className="passenger-table">
                  <thead>
                    <tr>
                      <th>Hành khách</th>
                      <th>Loại</th>
                      <th>Hành lý</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>NGUYEN VAN TRUONG</strong></td>
                      <td>Người lớn</td>
                      <td>20kg Ký gửi</td>
                      <td><span className="status-badge success"><span className="dot"></span>Đã thanh toán</span></td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>

            <div className="side-col">
              <Card className="summary-card">
                <div className="summary-header">
                  <h3>Xác nhận xuất vé</h3>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <span>Tổng tiền</span>
                    <span>3,250,000 đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Thanh toán</span>
                    <span className="text-success font-bold">Đã thu đủ</span>
                  </div>
                </div>
                <div className="summary-actions">
                  <Button className="w-full btn-primary-alt">
                    <span className="material-icons-round">check_circle</span>
                    Tiến hành xuất vé
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .flex-layout { display: flex; gap: var(--space-xl); align-items: flex-start; }
        .main-col { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .side-col { width: 340px; flex-shrink: 0; position: sticky; top: 20px; }

        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .breadcrumb .link { color: var(--primary); cursor: pointer; }
        .breadcrumb .separator { font-size: 16px; }
        .breadcrumb .current { color: var(--text-main); }
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .page-header h1 { font-size: 24px; margin-bottom: 4px; font-weight: 700; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        .form-card { padding: var(--space-lg); }
        .card-title { display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-lg); border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .card-title h3 { font-size: 16px; margin: 0; font-weight: 600; }

        .search-booking-row { display: flex; gap: var(--space-md); }
        .input-with-icon { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: var(--radius-md); padding: 10px 14px; background: white; }
        .input-with-icon input { border: none; outline: none; flex: 1; font-size: 14px; }
        .btn-primary-alt { background: linear-gradient(135deg, #005a8c, #003d5c); color: white; border: none; }

        .flight-details { background: #f8fafc; border-radius: 8px; padding: 16px; border: 1px solid #e2e8f0; }
        .fd-row { display: flex; justify-content: space-between; }
        .fd-item { flex: 1; }
        .fd-label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; font-weight: 600; }
        .fd-val { font-size: 14px; font-weight: 600; color: var(--text-main); }

        .passenger-table { width: 100%; border-collapse: collapse; text-align: left; }
        .passenger-table th { padding: 12px; border-bottom: 1px solid var(--border); font-size: 12px; color: var(--text-secondary); }
        .passenger-table td { padding: 16px 12px; border-bottom: 1px solid var(--border); font-size: 14px; }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: 20px; background: #fafbfc; border-bottom: 1px solid var(--border); }
        .summary-header h3 { font-size: 16px; margin: 0; font-weight: 600; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; }
        .summary-actions { padding: 20px; border-top: 1px solid var(--border); background: white; }
        
        .w-full { width: 100%; }
        .flex-1 { flex: 1; }
        .mt-lg { margin-top: var(--space-lg); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .text-primary { color: var(--primary); }
        .text-success { color: var(--success); }
        .font-bold { font-weight: 700; }

        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
      `}</style>
    </div>
  );
};

export default IssueTicketPage;
