import React from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface CancelTicketPageProps {
  onNavigate?: (id: string) => void;
}

const CancelTicketPage: React.FC<CancelTicketPageProps> = ({ onNavigate }) => {
  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('tickets')}>Vé máy bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Hủy / Hoàn vé</span>
          </div>

          <div className="page-header mb-lg">
            <div>
              <h1>Hủy & Hoàn Vé</h1>
              <p>Xử lý yêu cầu hủy vé của khách hàng và tính toán hoàn tiền.</p>
            </div>
            <Button variant="outline" onClick={() => onNavigate && onNavigate('tickets')}>
              <span className="material-icons-round">arrow_back</span>
              Quay lại
            </Button>
          </div>

          <div className="flex-layout">
            <div className="main-col">
              {/* Search Ticket */}
              <Card className="form-card mb-md">
                <div className="card-title">
                  <span className="material-icons-round text-primary">search</span>
                  <h3>Tìm Vé Cần Hủy</h3>
                </div>
                <div className="search-booking-row">
                  <div className="input-with-icon flex-1">
                    <span className="material-icons-round">confirmation_number</span>
                    <input type="text" placeholder="Nhập số vé hoặc PNR..." defaultValue="112-55443322" />
                  </div>
                  <Button className="btn-primary-alt">Tìm vé</Button>
                </div>
              </Card>

              {/* Current Ticket Info */}
              <Card className="form-card mb-md">
                <div className="card-title">
                  <span className="material-icons-round text-danger">cancel</span>
                  <h3>Vé Sắp Hủy</h3>
                </div>
                <div className="flight-details">
                  <div className="fd-row">
                    <div className="fd-item">
                      <p className="fd-label">Khách hàng</p>
                      <p className="fd-val">LE HUU DAT</p>
                    </div>
                    <div className="fd-item">
                      <p className="fd-label">Hành trình</p>
                      <p className="fd-val">HAN - PQC</p>
                    </div>
                    <div className="fd-item">
                      <p className="fd-label">Ngày bay</p>
                      <p className="fd-val">28/10/2023 09:40</p>
                    </div>
                  </div>
                </div>

                <div className="policy-box mt-md">
                  <div className="policy-icon"><span className="material-icons-round">policy</span></div>
                  <div>
                    <h4>Chính sách Hoàn vé (Hạng Thương gia)</h4>
                    <p>Được phép hoàn vé. Phí hoàn: <strong>500,000 đ</strong>. Tiền hoàn sẽ được chuyển về tài khoản ban đầu sau 3-5 ngày làm việc.</p>
                  </div>
                </div>
                
                <div className="form-group mt-lg">
                  <label>Lý do hủy vé</label>
                  <select className="reason-select">
                    <option>Khách hàng yêu cầu hủy</option>
                    <option>Hãng hàng không thay đổi lịch</option>
                    <option>Lý do sức khỏe / Cá nhân</option>
                    <option>Khác</option>
                  </select>
                </div>
              </Card>
            </div>

            <div className="side-col">
              <Card className="summary-card">
                <div className="summary-header">
                  <h3>Tính toán hoàn tiền</h3>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <span>Giá trị vé gốc</span>
                    <span>4,100,000 đ</span>
                  </div>
                  <div className="summary-row text-danger">
                    <span>Phí hủy vé</span>
                    <span>- 500,000 đ</span>
                  </div>
                  <div className="summary-row text-danger">
                    <span>Phí dịch vụ đại lý</span>
                    <span>- 100,000 đ</span>
                  </div>
                  <hr className="divider" />
                  <div className="summary-row total-row">
                    <span>Tổng tiền hoàn</span>
                    <span className="text-primary font-bold">3,500,000 đ</span>
                  </div>
                </div>
                <div className="summary-actions">
                  <Button className="w-full btn-danger">
                    <span className="material-icons-round">delete_forever</span>
                    Xác nhận Hủy & Hoàn
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

        .policy-box { display: flex; gap: 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; color: #92400e; }
        .policy-icon .material-icons-round { color: #d97706; font-size: 24px; }
        .policy-box h4 { font-size: 14px; margin: 0 0 4px; font-weight: 700; }
        .policy-box p { font-size: 13px; margin: 0; line-height: 1.5; }
        
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
        .reason-select { padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 14px; outline: none; }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: 20px; background: #fafbfc; border-bottom: 1px solid var(--border); }
        .summary-header h3 { font-size: 16px; margin: 0; font-weight: 600; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; }
        .total-row { font-size: 16px; margin-top: 8px; }
        .divider { border: 0; border-top: 1px dashed var(--border); margin: 8px 0; }
        .summary-actions { padding: 20px; border-top: 1px solid var(--border); background: white; }

        .btn-danger { background: var(--danger); color: white; border: none; }
        .btn-danger:hover { background: #b91c1c; }

        .w-full { width: 100%; }
        .flex-1 { flex: 1; }
        .mt-lg { margin-top: var(--space-lg); }
        .mt-md { margin-top: var(--space-md); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .text-primary { color: var(--primary); }
        .text-danger { color: var(--danger); }
        .font-bold { font-weight: 700; }
      `}</style>
    </div>
  );
};

export default CancelTicketPage;
