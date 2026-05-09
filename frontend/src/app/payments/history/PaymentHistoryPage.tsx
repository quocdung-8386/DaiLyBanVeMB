import React, { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import AppLayout from '../../../components/AppLayout';

interface PaymentHistoryPageProps {
  onNavigate?: (id: string) => void;
}

const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const transactions = [
    { id: 'TXN-8829', booking: 'G7X9PQ', customer: 'Nguyễn Văn Trường', method: 'Chuyển khoản', amount: '2,450,000 đ', status: 'completed', date: '24/10/2023 10:12', bank: 'MB Bank' },
    { id: 'TXN-8830', booking: 'A2B4C6', customer: 'Trần Thị Lan', method: 'Tiền mặt', amount: '1,890,000 đ', status: 'completed', date: '24/10/2023 11:30', bank: 'Quầy SGN' },
    { id: 'TXN-8831', booking: 'L9M1N2', customer: 'Lê Quang Minh', method: 'Thẻ POS', amount: '4,100,000 đ', status: 'pending', date: '24/10/2023 14:15', bank: 'Visa ****42' },
    { id: 'TXN-8832', booking: 'X7Y8Z9', customer: 'Phạm Thu Hà', method: 'Chuyển khoản', amount: '3,200,000 đ', status: 'failed', date: '24/10/2023 15:20', bank: 'Vietcombank' },
  ];

  return (
    <AppLayout 
      activeItem="payments" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Hệ thống', page: 'dashboard' }, { label: 'Lịch sử giao dịch' }]}
    >
      <div className="payment-history-content">
        
        {/* ── HEADER ── */}
        <div className="page-header-flex">
          <div>
            <h1>Nhật ký Giao dịch Tài chính</h1>
            <p>Quản lý dòng tiền, đối soát thanh toán và biên lai điện tử.</p>
          </div>
          <div className="action-buttons">
            <Button variant="outline"><span className="material-icons-round">calendar_today</span> Tháng 10, 2023</Button>
            <Button><span className="material-icons-round">cloud_download</span> Xuất báo cáo tài chính</Button>
          </div>
        </div>

        {/* ── SUMMARY STATS ── */}
        <div className="finance-stats">
          <Card className="finance-pill">
            <div className="icon-box" style={{ background: '#dcfce7', color: '#15803d' }}>
              <span className="material-icons-round">payments</span>
            </div>
            <div className="data">
              <p>Tổng thu hôm nay</p>
              <h3>42.8M</h3>
            </div>
          </Card>
          <Card className="finance-pill">
            <div className="icon-box" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <span className="material-icons-round">account_balance</span>
            </div>
            <div className="data">
              <p>Chuyển khoản chờ duyệt</p>
              <h3>8.5M</h3>
            </div>
          </Card>
          <Card className="finance-pill">
            <div className="icon-box" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              <span className="material-icons-round">error_outline</span>
            </div>
            <div className="data">
              <p>Giao dịch thất bại</p>
              <h3>2.1M</h3>
            </div>
          </Card>
        </div>

        {/* ── TRANSACTION TABLE ── */}
        <Card className="transaction-card">
          <div className="toolbar">
            <div className="search-box">
              <span className="material-icons-round">search</span>
              <input type="text" placeholder="Tìm theo mã giao dịch, PNR, khách hàng..." />
            </div>
            <div className="filter-chips">
              <span className="chip active">Tất cả</span>
              <span className="chip">Hoàn tất</span>
              <span className="chip">Chờ duyệt</span>
              <span className="chip">Thất bại</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>THỜI GIAN</th>
                  <th>GIAO DỊCH</th>
                  <th>KHÁCH HÀNG</th>
                  <th>PHƯƠNG THỨC</th>
                  <th>SỐ TIỀN</th>
                  <th>TRẠNG THÁI</th>
                  <th>HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div className="time-cell">
                        <b>{tx.date.split(' ')[1]}</b>
                        <span>{tx.date.split(' ')[0]}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tx-cell">
                        <code className="id-code">{tx.id}</code>
                        <span className="pnr-link">PNR: {tx.booking}</span>
                      </div>
                    </td>
                    <td><b>{tx.customer}</b></td>
                    <td>
                      <div className="method-cell">
                        <span className="material-icons-round">account_balance_wallet</span>
                        <div>
                          <p>{tx.method}</p>
                          <span>{tx.bank}</span>
                        </div>
                      </div>
                    </td>
                    <td><b className="amount-text">{tx.amount}</b></td>
                    <td>
                      <span className={`status-pill ${tx.status}`}>
                        <i className="dot"></i>
                        {tx.status === 'completed' ? 'Hoàn tất' : tx.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                      </span>
                    </td>
                    <td>
                      <div className="action-row">
                        <button className="icon-btn"><span className="material-icons-round">print</span></button>
                        <button className="icon-btn"><span className="material-icons-round">info</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <style>{`
        .payment-history-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 24px; color: #1e293b; }
        .page-header-flex p { font-size: 14px; color: #64748b; }

        .finance-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
        .finance-pill { padding: 20px; border: none; display: flex; align-items: center; gap: 16px; }
        .icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .data p { font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .data h3 { font-size: 22px; color: #1e293b; }

        .transaction-card { padding: 0; overflow: hidden; border: none; }
        .toolbar { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        .search-box { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 6px 14px; width: 320px; }
        .search-box input { border: none; outline: none; font-size: 13px; width: 100%; }
        .filter-chips { display: flex; gap: 8px; }
        .chip { padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; color: #64748b; cursor: pointer; border: 1px solid #e2e8f0; }
        .chip.active { background: #1e293b; color: white; border-color: #1e293b; }

        .table-wrapper { width: 100%; overflow-x: auto; }
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 14px 24px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        
        .time-cell { display: flex; flex-direction: column; }
        .time-cell b { font-size: 14px; color: #1e293b; }
        .time-cell span { font-size: 11px; color: #94a3b8; font-weight: 600; }
        
        .tx-cell { display: flex; flex-direction: column; gap: 2px; }
        .id-code { font-family: monospace; font-weight: 700; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; display: inline-block; width: fit-content; }
        .pnr-link { font-size: 11px; color: #2563eb; font-weight: 800; }
        
        .method-cell { display: flex; align-items: center; gap: 10px; }
        .method-cell .material-icons-round { color: #94a3b8; font-size: 20px; }
        .method-cell p { font-weight: 600; color: #1e293b; margin-bottom: 2px; }
        .method-cell span { font-size: 11px; color: #94a3b8; }
        
        .amount-text { font-size: 15px; color: #1e293b; }
        
        .status-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
        .status-pill .dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-pill.completed { background: #dcfce7; color: #15803d; }
        .status-pill.completed .dot { background: #15803d; }
        .status-pill.pending { background: #fef3c7; color: #b45309; }
        .status-pill.pending .dot { background: #b45309; }
        .status-pill.failed { background: #fee2e2; color: #b91c1c; }
        .status-pill.failed .dot { background: #b91c1c; }
        
        .icon-btn { width: 32px; height: 32px; border: none; background: transparent; color: #94a3b8; cursor: pointer; transition: all 0.2s; }
        .icon-btn:hover { color: #2563eb; background: #eff6ff; border-radius: 6px; }
      `}</style>
    </AppLayout>
  );
};

export default PaymentHistoryPage;
