import React, { useState } from 'react';
import Sidebar from '../../../components/Sidebar';
import Header from '../../../components/Header';
import { showToast } from '../../../components/AppLayout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';

interface CancelTicketPageProps {
  onNavigate?: (id: string) => void;
  ticketData?: any;
}

const CancelTicketPage: React.FC<CancelTicketPageProps> = ({ onNavigate, ticketData }) => {
  const [reason, setReason] = useState('Khách hàng yêu cầu hủy');

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

  // Calculate refund (mock)
  const baseAmount = parseInt(data.total.replace(/,/g, ''));
  const cancelFee = 500000;
  const serviceFee = 100000;
  const refundAmount = baseAmount - cancelFee - serviceFee;

  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Hủy & Hoàn vé" />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('tickets')}>Vé máy bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Hủy vé</span>
          </div>

          <div className="page-header mb-lg">
            <div>
              <h1>Hủy & Hoàn Vé</h1>
              <p>Thực hiện thao tác hoàn tiền cho vé PNR: <strong>{data.pnr}</strong></p>
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
                  <span className="material-icons-round text-danger">cancel</span>
                  <h3>Thông tin vé cần hủy</h3>
                </div>
                <div className="current-ticket">
                  <div className="t-row">
                    <span>Số vé: <strong>{data.id}</strong></span>
                    <span>Hành khách: <strong>{data.customer}</strong></span>
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
                  <span className="material-icons-round text-primary">policy</span>
                  <h3>Lý do và Chính sách</h3>
                </div>
                <div className="policy-note">
                   <span className="material-icons-round">info</span>
                   <p>Theo chính sách của hãng hàng không, vé này thuộc diện <strong>Được phép hoàn</strong>. Phí hoàn vé sẽ được trừ trực tiếp vào giá trị vé gốc.</p>
                </div>

                <div className="reason-section mt-lg">
                   <label>Lý do hoàn vé</label>
                   <select className="reason-select" value={reason} onChange={e => setReason(e.target.value)}>
                      <option>Khách hàng yêu cầu hủy</option>
                      <option>Hãng hàng không thay đổi lịch bay</option>
                      <option>Lý do sức khỏe (Cần minh chứng)</option>
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
                    <span>{data.total} đ</span>
                  </div>
                  <div className="summary-row text-danger">
                    <span>Phí hủy vé</span>
                    <span>- {cancelFee.toLocaleString()} đ</span>
                  </div>
                  <div className="summary-row text-danger">
                    <span>Phí dịch vụ đại lý</span>
                    <span>- {serviceFee.toLocaleString()} đ</span>
                  </div>
                  <hr className="divider" />
                  <div className="summary-row total">
                    <span>Tổng tiền hoàn lại</span>
                    <span className="text-primary">{refundAmount.toLocaleString()} đ</span>
                  </div>
                  <p className="refund-note">Tiền sẽ được hoàn về phương thức thanh toán ban đầu của khách hàng.</p>
                </div>
                <div className="summary-actions">
                  <Button className="w-full btn-danger" onClick={() => { showToast('Yêu cầu hoàn vé đã được xử lý!', 'success'); onNavigate?.('tickets'); }}>
                    <span className="material-icons-round">assignment_return</span>
                    Xác nhận Hoàn vé
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

        .current-ticket { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 16px; }
        .t-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; color: #991b1b; }
        .t-route { display: flex; align-items: center; gap: 12px; font-size: 18px; font-weight: 800; color: #7f1d1d; }
        .t-date { font-size: 13px; font-weight: 500; margin-left: 10px; color: #b91c1c; }

        .policy-note { display: flex; gap: 12px; background: #eff6ff; padding: 16px; border-radius: 12px; border: 1px solid #bfdbfe; color: #1e40af; }
        .policy-note p { margin: 0; font-size: 14px; line-height: 1.5; }
        
        .reason-section label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .reason-select { width: 100%; padding: 12px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; outline: none; }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: 20px; background: #fafbfc; border-bottom: 1px solid #f1f5f9; }
        .summary-header h3 { margin: 0; font-size: 16px; font-weight: 700; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; }
        .summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; }
        .summary-row.total { margin-top: 8px; font-size: 18px; font-weight: 800; color: #0f172a; }
        .divider { border: 0; border-top: 1px dashed #e2e8f0; margin: 8px 0; }
        .refund-note { font-size: 12px; color: #94a3b8; margin-top: 8px; line-height: 1.4; }

        .summary-actions { padding: 20px; }
        .w-full { width: 100%; padding: 12px; border: none; border-radius: 10px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-danger { background: #dc2626; color: white; }
        
        .mb-md { margin-bottom: 16px; }
        .mb-lg { margin-bottom: 24px; }
        .mt-lg { margin-top: 24px; }
        .text-primary { color: #2563eb; }
        .text-danger { color: #dc2626; }
      `}</style>
    </div>
  );
};

export default CancelTicketPage;
