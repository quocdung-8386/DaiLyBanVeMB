import React from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface ExchangeTicketPageProps {
  onNavigate?: (id: string) => void;
}

const ExchangeTicketPage: React.FC<ExchangeTicketPageProps> = ({ onNavigate }) => {
  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('tickets')}>Vé máy bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Đổi vé</span>
          </div>

          <div className="page-header mb-lg">
            <div>
              <h1>Đổi Vé Hành Khách</h1>
              <p>Thực hiện thao tác thay đổi lịch trình cho vé đã xuất.</p>
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
                  <h3>Tìm Vé Cần Đổi</h3>
                </div>
                <div className="search-booking-row">
                  <div className="input-with-icon flex-1">
                    <span className="material-icons-round">confirmation_number</span>
                    <input type="text" placeholder="Nhập số vé hoặc PNR..." defaultValue="738-29481726" />
                  </div>
                  <Button className="btn-primary-alt">Tìm vé</Button>
                </div>
              </Card>

              {/* Current Ticket Info */}
              <Card className="form-card mb-md">
                <div className="card-title">
                  <span className="material-icons-round text-warning">info</span>
                  <h3>Vé Hiện Tại</h3>
                </div>
                <div className="flight-details">
                  <div className="fd-row">
                    <div className="fd-item">
                      <p className="fd-label">Khách hàng</p>
                      <p className="fd-val">NGUYEN VAN AN</p>
                    </div>
                    <div className="fd-item">
                      <p className="fd-label">Hành trình</p>
                      <p className="fd-val">SGN - HAN</p>
                    </div>
                    <div className="fd-item">
                      <p className="fd-label">Ngày bay</p>
                      <p className="fd-val">24/10/2023 08:30</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Select New Flight */}
              <Card className="form-card">
                <div className="card-title">
                  <span className="material-icons-round text-success">flight_takeoff</span>
                  <h3>Chọn Chuyến Bay Mới</h3>
                </div>
                
                <div className="flight-list">
                  <div className="flight-card selected">
                    <div className="fc-left">
                      <div className="fc-code">VN256</div>
                      <div className="fc-seat">Thương gia</div>
                    </div>
                    <div className="fc-mid">
                      <span className="fc-time">15:00</span>
                      <div className="fc-line"><span className="material-icons-round">flight</span></div>
                      <span className="fc-time">16:50</span>
                    </div>
                    <div className="fc-right">
                      <span className="fc-price">3,250,000 đ</span>
                    </div>
                    <span className="material-icons-round check-icon">check_circle</span>
                  </div>
                </div>
              </Card>
            </div>

            <div className="side-col">
              <Card className="summary-card">
                <div className="summary-header">
                  <h3>Chi tiết phí đổi</h3>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <span>Giá vé mới</span>
                    <span>3,250,000 đ</span>
                  </div>
                  <div className="summary-row text-success">
                    <span>Giá vé cũ</span>
                    <span>- 3,250,000 đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí đổi vé cố định</span>
                    <span>360,000 đ</span>
                  </div>
                  <hr className="divider" />
                  <div className="summary-row total-row">
                    <span>Tổng thu thêm</span>
                    <span className="text-primary font-bold">360,000 đ</span>
                  </div>
                </div>
                <div className="summary-actions">
                  <Button className="w-full btn-primary-alt">
                    <span className="material-icons-round">published_with_changes</span>
                    Xác nhận Đổi vé
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

        .flight-list { display: flex; flex-direction: column; gap: 12px; }
        .flight-card { background: white; border: 2px solid var(--border); border-radius: 12px; padding: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; position: relative; }
        .flight-card.selected { border-color: var(--primary); background: #eff6ff; }
        .fc-left { min-width: 80px; }
        .fc-code { font-weight: 800; font-family: monospace; font-size: 15px; }
        .fc-seat { font-size: 11px; color: var(--text-muted); }
        .fc-mid { flex: 1; display: flex; align-items: center; gap: 8px; }
        .fc-time { font-size: 18px; font-weight: 700; }
        .fc-line { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; }
        .fc-line::before { content: ''; position: absolute; width: 100%; height: 1px; background: var(--primary); }
        .fc-line .material-icons-round { color: var(--primary); transform: rotate(45deg); z-index: 1; background: #eff6ff; }
        .fc-right { text-align: right; }
        .fc-price { font-weight: 800; color: var(--primary); font-size: 16px; }
        .check-icon { position: absolute; top: 12px; right: 12px; color: var(--success); }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: 20px; background: #fafbfc; border-bottom: 1px solid var(--border); }
        .summary-header h3 { font-size: 16px; margin: 0; font-weight: 600; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; }
        .total-row { font-size: 16px; margin-top: 8px; }
        .divider { border: 0; border-top: 1px dashed var(--border); margin: 8px 0; }
        .summary-actions { padding: 20px; border-top: 1px solid var(--border); background: white; }

        .w-full { width: 100%; }
        .flex-1 { flex: 1; }
        .mt-lg { margin-top: var(--space-lg); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .text-primary { color: var(--primary); }
        .text-success { color: var(--success); }
        .text-warning { color: #d97706; }
        .font-bold { font-weight: 700; }
      `}</style>
    </div>
  );
};

export default ExchangeTicketPage;
