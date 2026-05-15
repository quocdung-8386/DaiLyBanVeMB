import React from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import { showToast } from '../../../components/AppLayout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface IssueTicketPageProps {
  onNavigate?: (id: string) => void;
  ticketData?: any;
}

const IssueTicketPage: React.FC<IssueTicketPageProps> = ({ onNavigate, ticketData }) => {
  // Mock data if no ticketData is provided
  const data = ticketData || {
    id: 'VE-001',
    pnr: 'G7X9PQ',
    customer: 'Nguyễn Văn An',
    routeFrom: 'SGN',
    routeTo: 'HAN',
    flight: 'VN123',
    date: '24/10/2023',
    time: '08:30',
    total: '6,500,000'
  };

  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Xuất vé máy bay" />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('tickets')}>Vé máy bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Xuất vé</span>
          </div>

          <div className="page-header mb-lg">
            <div>
              <h1>Xuất Vé Máy Bay</h1>
              <p>Hệ thống đang chuẩn bị xuất vé cho booking <strong>{data.pnr}</strong>.</p>
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
                  <span className="material-icons-round text-primary">confirmation_number</span>
                  <h3>Thông tin Booking</h3>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <p className="label">Mã Booking</p>
                    <p className="val">{data.id}</p>
                  </div>
                  <div className="info-item">
                    <p className="label">PNR</p>
                    <p className="val" style={{ color: '#2563eb', fontWeight: 800 }}>{data.pnr}</p>
                  </div>
                  <div className="info-item">
                    <p className="label">Người đặt</p>
                    <p className="val">{data.customer}</p>
                  </div>
                </div>
              </Card>

              <Card className="form-card">
                <div className="card-title">
                  <span className="material-icons-round text-primary">flight_takeoff</span>
                  <h3>Thông tin Hành trình & Hành khách</h3>
                </div>
                <div className="flight-strip">
                   <div className="route">
                      <div className="point">
                        <p className="city">{data.routeFrom}</p>
                        <p className="airport">Sân bay khởi hành</p>
                      </div>
                      <div className="arrow">
                        <span className="material-icons-round">flight</span>
                        <div className="line"></div>
                      </div>
                      <div className="point">
                        <p className="city">{data.routeTo}</p>
                        <p className="airport">Sân bay đến</p>
                      </div>
                   </div>
                   <div className="meta">
                      <p>Chuyến bay: <strong>{data.flight}</strong></p>
                      <p>Khởi hành: <strong>{data.date} {data.time}</strong></p>
                   </div>
                </div>

                <div className="passenger-list mt-lg">
                  <h4>Danh sách hành khách (1)</h4>
                  <div className="p-item">
                    <div className="p-avatar">AN</div>
                    <div className="p-info">
                      <p className="p-name">{data.customer}</p>
                      <p className="p-sub">Người lớn · {data.fareClass || data.hang_ghe || 'Phổ thông'} · 20kg ký gửi</p>
                    </div>
                    <div className="p-status">
                       <span className="badge success">Đã thanh toán</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="side-col">
              <Card className="summary-card">
                <div className="summary-header">
                  <h3>Thanh toán & Xuất vé</h3>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <span>Tổng tiền vé</span>
                    <span>{data.total} đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí dịch vụ</span>
                    <span>100,000 đ</span>
                  </div>
                  <hr className="divider" />
                  <div className="summary-row total">
                    <span>Tổng thu</span>
                    <span className="text-primary">{data.total} đ</span>
                  </div>
                  <div className="payment-status success">
                    <span className="material-icons-round">check_circle</span>
                    Đã thanh toán đầy đủ
                  </div>
                </div>
                <div className="summary-actions">
                  <Button className="w-full" onClick={() => { showToast('Vé đã được xuất thành công!', 'success'); onNavigate?.('tickets'); }}>
                    <span className="material-icons-round">receipt_long</span>
                    Xác nhận Xuất vé
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <style>{`
        .layout { display: flex; min-height: 100vh; background: #f4f7fa; }
        .main-container { flex: 1; display: flex; flexDirection: column; }
        .content { padding: 32px; max-width: 1200px; margin: 0 auto; width: 100%; }
        
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #64748b; margin-bottom: 16px; }
        .breadcrumb .link { color: #2563eb; cursor: pointer; }
        .breadcrumb .current { color: #1e293b; font-weight: 600; }
        
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .page-header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .page-header p { margin: 4px 0 0; color: #64748b; }

        .flex-layout { display: flex; gap: 24px; margin-top: 32px; }
        .main-col { flex: 1; }
        .side-col { width: 350px; }

        .form-card { padding: 24px; }
        .card-title { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px; }
        .card-title h3 { margin: 0; font-size: 16px; font-weight: 700; }

        .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .info-item .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; margin-bottom: 4px; font-weight: 700; }
        .info-item .val { font-size: 15px; font-weight: 600; color: #1e293b; margin: 0; }

        .flight-strip { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
        .route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .point .city { font-size: 20px; font-weight: 800; margin: 0; color: #0f172a; }
        .point .airport { font-size: 12px; color: #64748b; margin: 2px 0 0; }
        .arrow { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; padding: 0 20px; }
        .arrow .material-icons-round { color: #2563eb; transform: rotate(45deg); background: #f8fafc; padding: 0 10px; z-index: 1; }
        .arrow .line { position: absolute; width: 100%; height: 1px; background: #cbd5e1; top: 50%; }
        .meta { display: flex; gap: 24px; font-size: 14px; color: #475569; }

        .p-item { display: flex; align-items: center; gap: 16px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
        .p-avatar { width: 40px; height: 40px; background: #eff6ff; color: #2563eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; }
        .p-info { flex: 1; }
        .p-name { margin: 0; font-weight: 700; color: #1e293b; }
        .p-sub { margin: 2px 0 0; fontSize: 12px; color: #64748b; }
        .badge { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
        .badge.success { background: #dcfce7; color: #16a34a; }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: 20px; background: #fafbfc; border-bottom: 1px solid #f1f5f9; }
        .summary-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; }
        .summary-row.total { margin-top: 8px; font-size: 18px; font-weight: 800; color: #0f172a; }
        .divider { border: 0; border-top: 1px dashed #e2e8f0; margin: 8px 0; }
        .payment-status { display: flex; align-items: center; gap: 8px; background: #f0fdf4; color: #16a34a; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 700; margin-top: 12px; }
        .summary-actions { padding: 20px; }
        .w-full { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        
        .mb-md { margin-bottom: 16px; }
        .mb-lg { margin-bottom: 24px; }
        .mt-lg { margin-top: 24px; }
        .text-primary { color: #2563eb; }
      `}</style>
    </div>
  );
};

export default IssueTicketPage;
