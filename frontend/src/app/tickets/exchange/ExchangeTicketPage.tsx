import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import { showToast } from '../../../components/AppLayout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface ExchangeTicketPageProps {
  onNavigate?: (id: string) => void;
  ticketData?: any;
}

const ExchangeTicketPage: React.FC<ExchangeTicketPageProps> = ({ onNavigate, ticketData }) => {
  const [selectedFlight, setSelectedFlight] = useState<any>(null);

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

  const flights = [
    { id: 'VN256', dep: '15:00', arr: '17:15', price: 3250000, cls: 'Phổ thông linh hoạt' },
    { id: 'VN258', dep: '18:30', arr: '20:45', price: 3450000, cls: 'Phổ thông linh hoạt' },
  ];

  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Thay đổi lịch trình vé" />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('tickets')}>Vé máy bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Đổi vé</span>
          </div>

          <div className="page-header mb-lg">
            <div>
              <h1>Đổi Lịch Trình Vé</h1>
              <p>Thực hiện thay đổi chuyến bay cho PNR: <strong>{data.pnr}</strong></p>
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
                  <span className="material-icons-round text-warning">info</span>
                  <h3>Thông tin vé hiện tại</h3>
                </div>
                <div className="current-ticket">
                  <div className="t-row">
                    <span>Hành khách: <strong>{data.customer}</strong></span>
                    <span>Số hiệu: <strong>{data.flight}</strong></span>
                  </div>
                  <div className="t-route">
                    <span>{data.routeFrom}</span>
                    <span className="material-icons-round">east</span>
                    <span>{data.routeTo}</span>
                    <span className="t-date">{data.date} {data.time}</span>
                  </div>
                </div>
              </Card>

              <Card className="form-card">
                <div className="card-title">
                  <span className="material-icons-round text-primary">search</span>
                  <h3>Chọn chuyến bay mới</h3>
                </div>
                <div className="new-flights-list">
                  {flights.map(f => (
                    <div key={f.id} className={`f-card ${selectedFlight?.id === f.id ? 'active' : ''}`} onClick={() => setSelectedFlight(f)}>
                      <div className="f-info">
                        <p className="f-id">{f.id}</p>
                        <p className="f-cls">{f.cls}</p>
                      </div>
                      <div className="f-time-strip">
                        <span>{f.dep}</span>
                        <div className="f-line"></div>
                        <span>{f.arr}</span>
                      </div>
                      <div className="f-price">
                        {f.price.toLocaleString()} đ
                      </div>
                      {selectedFlight?.id === f.id && <span className="material-icons-round check">check_circle</span>}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="side-col">
              <Card className="summary-card">
                <div className="summary-header">
                  <h3>Chi phí thay đổi</h3>
                </div>
                <div className="summary-body">
                  <div className="summary-row">
                    <span>Chênh lệch giá vé</span>
                    <span>{selectedFlight ? '0 đ' : '--'}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí đổi vé cố định</span>
                    <span>350,000 đ</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí dịch vụ</span>
                    <span>50,000 đ</span>
                  </div>
                  <hr className="divider" />
                  <div className="summary-row total">
                    <span>Tổng cộng thu thêm</span>
                    <span className="text-primary">{selectedFlight ? '400,000 đ' : '--'}</span>
                  </div>
                </div>
                <div className="summary-actions">
                  <Button className="w-full" disabled={!selectedFlight} onClick={() => { showToast('Yêu cầu đổi vé đã được gửi!', 'success'); onNavigate?.('tickets'); }}>
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

        .current-ticket { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 16px; }
        .t-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
        .t-route { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 800; color: #92400e; }
        .t-date { font-size: 13px; font-weight: 500; margin-left: 10px; color: #b45309; }

        .new-flights-list { display: flex; flex-direction: column; gap: 12px; }
        .f-card { display: flex; align-items: center; gap: 20px; padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; position: relative; }
        .f-card:hover { border-color: #2563eb; }
        .f-card.active { border-color: #2563eb; background: #eff6ff; }
        .f-info { width: 120px; }
        .f-id { margin: 0; font-weight: 800; font-size: 15px; }
        .f-cls { margin: 2px 0 0; font-size: 11px; color: #64748b; }
        .f-time-strip { flex: 1; display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 700; }
        .f-line { flex: 1; height: 1px; background: #cbd5e1; position: relative; }
        .f-line::after { content: ''; position: absolute; right: 0; top: -3px; border-top: 4px solid transparent; border-bottom: 4px solid transparent; border-left: 6px solid #cbd5e1; }
        .f-price { font-weight: 800; color: #2563eb; }
        .check { position: absolute; top: -10px; right: -10px; color: #16a34a; background: white; border-radius: 50%; }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: 20px; background: #fafbfc; border-bottom: 1px solid #f1f5f9; }
        .summary-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; }
        .summary-row.total { margin-top: 8px; font-size: 18px; font-weight: 800; color: #0f172a; }
        .divider { border: 0; border-top: 1px dashed #e2e8f0; margin: 8px 0; }
        .summary-actions { padding: 20px; }
        .w-full { width: 100%; padding: 12px; background: #2563eb; color: white; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .w-full:disabled { opacity: 0.5; cursor: not-allowed; }
        
        .mb-md { margin-bottom: 16px; }
        .mb-lg { margin-bottom: 24px; }
        .text-primary { color: #2563eb; }
      `}</style>
    </div>
  );
};

export default ExchangeTicketPage;
