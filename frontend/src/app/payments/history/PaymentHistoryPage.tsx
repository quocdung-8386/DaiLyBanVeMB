import React, { useState } from 'react';
import AppLayout from '../../../components/AppLayout';
import Card from '../../../components/Card';

interface PaymentHistoryPageProps {
  onNavigate: (page: string) => void;
}

const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ onNavigate }) => {
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const transactions = [
    { id: 'TXN-2201', booking: 'BKG-8892', customer: 'Nguyễn Văn A', method: 'Chuyển khoản', amount: 4500000, status: 'Hoàn tất', badge: 'success', date: '2026-06-01 08:30', approvedBy: 'admin_dung' },
    { id: 'TXN-2200', booking: 'BKG-8880', customer: 'Trần Thị B', method: 'Tiền mặt', amount: 1500000, status: 'Chờ xử lý', badge: 'warning', date: '2026-06-01 07:15', approvedBy: '—' },
    { id: 'TXN-2199', booking: 'BKG-8871', customer: 'Lê Văn C', method: 'Thẻ ngân hàng', amount: 8000000, status: 'Đã hủy', badge: 'danger', date: '2026-05-31 16:40', approvedBy: 'ketoan_01' },
    { id: 'TXN-2198', booking: 'BKG-8860', customer: 'Phạm Thị D', method: 'Ví điện tử', amount: 2100000, status: 'Hoàn tất', badge: 'success', date: '2026-05-31 14:20', approvedBy: 'admin_dung' },
  ];

  const statusStyle: Record<string, React.CSSProperties> = {
    'Hoàn tất': { backgroundColor: '#dcfce7', color: '#166534' },
    'Chờ xử lý': { backgroundColor: '#fef08a', color: '#854d0e' },
    'Đã hủy': { backgroundColor: '#fecaca', color: '#991b1b' },
  };

  return (
    <AppLayout activeItem="payments" onNavigate={onNavigate} breadcrumb={[{ label: 'Thanh toán', page: 'payments' }, { label: 'Lịch sử giao dịch' }]}>
      <div className="payment-history-page">
        <div className="page-header">
          <div className="header-titles">
            <h1>Lịch Sử Giao Dịch</h1>
            <p>Toàn bộ các giao dịch thanh toán đã được xử lý</p>
          </div>
          <div className="header-actions">
            <input type="date" className="date-input" defaultValue="2026-06-01" />
            <button className="btn-export">
              <span className="material-icons-round">download</span> Xuất Excel
            </button>
          </div>
        </div>

        <div className="filter-tabs">
          <button className="filter-tab active">Tất cả giao dịch</button>
          <button className="filter-tab">Hoàn tất</button>
          <button className="filter-tab">Chờ xử lý</button>
          <button className="filter-tab">Đã hủy</button>
        </div>

        <div className="stats-row">
          {[
            { label: 'Tổng giao dịch', value: '4', icon: 'receipt_long', color: '#0e74be' },
            { label: 'Tổng thu', value: '16,100,000 đ', icon: 'payments', color: '#10b981' },
            { label: 'Đã hủy', value: '8,000,000 đ', icon: 'cancel', color: '#ef4444' },
            { label: 'Chờ xử lý', value: '1', icon: 'pending', color: '#f97316' },
          ].map((s, i) => (
            <Card key={i} className="stat-card">
              <span className="material-icons-round stat-icon" style={{ color: s.color }}>{s.icon}</span>
              <div>
                <p className="stat-label">{s.label}</p>
                <h3 className="stat-value">{s.value}</h3>
              </div>
            </Card>
          ))}
        </div>

        <Card className="table-card">
          <div className="table-responsive">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Mã GD</th>
                <th>Mã Booking</th>
                <th>Khách hàng</th>
                <th>Phương thức</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
                <th>Ngày GD</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td>
                    <div className="tx-id">{tx.id.substring(0, 4)}<br/>{tx.id.substring(4)}</div>
                  </td>
                  <td>
                    <div className="booking-id blue-border">{tx.booking.substring(0, 4)}<br/>{tx.booking.substring(4)}</div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">{tx.customer.split(' ').map(w => w[0]).slice(-2).join('')}</div>
                      <div>
                        <p className="name">{tx.customer}</p>
                      </div>
                    </div>
                  </td>
                  <td><p className="text-muted">{tx.method}</p></td>
                  <td><p className="price">{tx.amount.toLocaleString()} đ</p></td>
                  <td>
                    <span className={`status-badge ${tx.badge}`}>
                      <span className="dot"></span>
                      {tx.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <p className="date">{tx.date.split(' ')[0]}</p>
                      <p className="time">{tx.date.split(' ')[1]}</p>
                    </div>
                  </td>
                  <td>
                    <button className="action-btn view" onClick={() => setSelectedTx(tx)}>
                      <span className="material-icons-round">visibility</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>

        {/* Detail Popup */}
        {selectedTx && (
          <div className="popup-overlay" onClick={() => setSelectedTx(null)}>
            <div className="popup-card" onClick={e => e.stopPropagation()}>
              <div className="popup-header">
                <h3>Chi tiết giao dịch</h3>
                <button className="popup-close" onClick={() => setSelectedTx(null)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>
              <div className="td-info-list">
                <div className="td-info-row">
                  <span className="material-icons-round">receipt_long</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Mã giao dịch</p>
                    <p className="td-ival">{selectedTx.id}</p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">airplane_ticket</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Mã Booking</p>
                    <p className="td-ival"><span className="mono-code blue">{selectedTx.booking}</span></p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">person</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Khách hàng</p>
                    <p className="td-ival">{selectedTx.customer}</p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">account_balance_wallet</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Phương thức</p>
                    <p className="td-ival">{selectedTx.method}</p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">payments</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Số tiền</p>
                    <p className="td-ival amount-big">{selectedTx.amount.toLocaleString()} VND</p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">info</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Trạng thái</p>
                    <p className="td-ival">
                      <span className={`status-badge ${selectedTx.badge}`}>
                        <span className="dot"></span>
                        {selectedTx.status}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">event</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Ngày giao dịch</p>
                    <p className="td-ival">{selectedTx.date}</p>
                  </div>
                </div>
                <div className="td-info-row">
                  <span className="material-icons-round">verified_user</span>
                  <div className="td-row-content">
                    <p className="td-ikey">Người duyệt</p>
                    <p className="td-ival">{selectedTx.approvedBy}</p>
                  </div>
                </div>
              </div>
              <div className="popup-footer">
                <button className="btn-print">
                  <span className="material-icons-round">print</span> In hóa đơn
                </button>
                <button className="btn-close-popup" onClick={() => setSelectedTx(null)}>Đóng</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .payment-history-page { padding: 24px 32px; animation: fadeIn 0.4s ease-out; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
        .header-titles h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; }
        .header-titles p { font-size: 14px; color: #64748b; margin: 0; }
        .header-actions { display: flex; gap: 12px; align-items: center; }
        .date-input { padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; }
        .btn-export { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: #10b981; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; }

        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 28px; }
        .stat-card { display: flex; align-items: center; gap: 16px; padding: 20px 24px; }
        .stat-icon { font-size: 32px; }
        .stat-label { font-size: 12px; font-weight: 600; color: #64748b; margin: 0 0 4px 0; text-transform: uppercase; }
        .stat-value { font-size: 20px; font-weight: 800; color: #1e293b; margin: 0; }

        .filter-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 1px; }
        .filter-tab { background: transparent; border: none; padding: 10px 16px; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.2s; }
        .filter-tab:hover { color: #0e74be; }
        .filter-tab.active { color: #0e74be; border-bottom-color: #0e74be; }

        .table-card { padding: 0; overflow: hidden; }
        .table-responsive { width: 100%; overflow-x: auto; }
        .booking-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 1000px; }
        .booking-table th { padding: 16px var(--space-lg, 24px); font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #fcfcfc; text-transform: uppercase; white-space: nowrap; }
        .booking-table td { padding: 16px var(--space-lg, 24px); border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
        .booking-table tr:hover td { background: #f8fafc; }
        
        .tx-id { font-family: monospace; font-size: 13px; font-weight: 700; color: #475569; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; }
        .booking-id { font-family: monospace; font-size: 13px; font-weight: 700; background: #f0f4ff; color: #0e74be; padding: 6px 12px; border-radius: 6px; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; border: 1px solid #bfdbfe; }
        
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .customer-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; text-transform: uppercase; }
        .customer-info .name { font-size: 14px; font-weight: 600; margin: 0; color: #1e293b; }
        
        .date-info .date { font-size: 14px; font-weight: 500; margin: 0 0 2px 0; color: #1e293b; }
        .date-info .time { font-size: 12px; color: #64748b; margin: 0; }
        
        .price { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }
        .text-muted { color: #64748b; margin: 0; font-size: 14px; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef08a; color: #854d0e; }
        .status-badge.warning .dot { background: #854d0e; }
        .status-badge.danger { background: #fecaca; color: #991b1b; }
        .status-badge.danger .dot { background: #991b1b; }
        
        .action-btn { display: flex; align-items: center; justify-content: center; color: #0e74be; padding: 6px; border-radius: 6px; transition: all 0.2s; border: none; background: #eff6ff; cursor: pointer; }
        .action-btn .material-icons-round { font-size: 18px; }
        .action-btn.view:hover { background: #dbeafe; color: #1e40af; }

        /* Popup */
        .popup-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); animation: fadeIn 0.2s; }
        .popup-card { background: white; border-radius: 16px; padding: 32px; width: 500px; max-width: 95vw; box-shadow: 0 24px 80px rgba(0,0,0,0.2); }
        .popup-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
        .popup-header h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0; }
        .popup-close { background: none; border: none; cursor: pointer; color: #64748b; display: flex; padding: 4px; border-radius: 6px; }
        .popup-close:hover { background: #f1f5f9; }
        .td-info-list { display: flex; flex-direction: column; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
        .td-info-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid #f1f5f9; background: white; transition: background 0.15s; }
        .td-info-row:last-child { border-bottom: none; }
        .td-info-row:hover { background: #f8faff; }
        .td-info-row .material-icons-round { font-size: 20px; color: #94a3b8; flex-shrink: 0; }
        .td-row-content { display: flex; justify-content: space-between; align-items: center; flex: 1; }
        .td-ikey { font-size: 13px; color: #64748b; font-weight: 500; margin: 0; }
        .td-ival { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0; text-align: right; }
        .amount-big { color: #0e74be; font-size: 18px; font-weight: 800; }
        .popup-footer { display: flex; gap: 12px; justify-content: flex-end; border-top: 1px solid #f1f5f9; padding-top: 20px; }
        .btn-print { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 14px; font-weight: 600; cursor: pointer; color: #475569; }
        .btn-close-popup { padding: 10px 24px; border: none; border-radius: 8px; background: #0e74be; color: white; font-size: 14px; font-weight: 600; cursor: pointer; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default PaymentHistoryPage;
