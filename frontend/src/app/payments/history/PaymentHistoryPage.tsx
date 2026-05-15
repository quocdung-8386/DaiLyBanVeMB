import React, { useState } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import AppLayout from '../../../components/AppLayout';
import { api } from '../../../api';

interface PaymentHistoryPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const parseAmount = (val: any): number => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') return parseFloat(val.replace(/[^0-9.-]+/g, '')) || 0;
  return 0;
};

const formatAmount = (val: any): string => {
  const num = parseAmount(val);
  return num.toLocaleString('vi-VN') + 'đ';
};

const PaymentHistoryPage: React.FC<PaymentHistoryPageProps> = ({ 
  onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount 
}) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tất cả');

  React.useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.getPayments();
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
    const intervalId = setInterval(fetchPayments, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const PAID_STATUSES = ['Đã thanh toán', 'Hoàn tất'];
  const PENDING_STATUSES = ['Chờ thanh toán'];

  const totalRevenue = transactions.reduce((sum, tx) =>
    sum + (PAID_STATUSES.includes(tx.status) ? parseAmount(tx.amount) : 0), 0);

  const pendingRevenue = transactions.reduce((sum, tx) =>
    sum + (PENDING_STATUSES.includes(tx.status) ? parseAmount(tx.amount) : 0), 0);

  const filterMap: Record<string, string[] | null> = {
    'Tất cả': null,
    'Hoàn tất': ['Đã thanh toán', 'Hoàn tất'],
    'Chờ duyệt': ['Chờ thanh toán'],
    'Thất bại': ['Thất bại', 'Đã hủy']
  };

  const filtered = transactions.filter(tx => {
    const allowed = filterMap[activeFilter];
    const statusMatch = !allowed || allowed.includes(tx.status);
    const q = search.toLowerCase();
    const searchMatch = !q ||
      (tx.id || '').toLowerCase().includes(q) ||
      (tx.bookingId || '').toLowerCase().includes(q) ||
      (tx.customer || '').toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  return (
    <AppLayout 
      activeItem="payment_history" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
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
            <Button variant="outline"><span className="material-icons-round">calendar_today</span> {new Date().toLocaleDateString('vi-VN', {month:'long', year:'numeric'})}</Button>
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
              <p>Tổng doanh thu</p>
              <h3>{totalRevenue >= 1000000 ? (totalRevenue/1000000).toFixed(1)+'M' : totalRevenue.toLocaleString('vi-VN')+'đ'}</h3>
            </div>
          </Card>
          <Card className="finance-pill">
            <div className="icon-box" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
              <span className="material-icons-round">account_balance</span>
            </div>
            <div className="data">
              <p>Chờ thanh toán</p>
              <h3>{pendingRevenue >= 1000000 ? (pendingRevenue/1000000).toFixed(1)+'M' : pendingRevenue.toLocaleString('vi-VN')+'đ'}</h3>
            </div>
          </Card>
          <Card className="finance-pill">
            <div className="icon-box" style={{ background: '#fee2e2', color: '#b91c1c' }}>
              <span className="material-icons-round">error_outline</span>
            </div>
            <div className="data">
              <p>Số lượng GD</p>
              <h3>{transactions.length}</h3>
            </div>
          </Card>
        </div>

        {/* ── TRANSACTION TABLE ── */}
        <Card className="transaction-card">
          <div className="toolbar">
            <div className="search-box">
              <span className="material-icons-round">search</span>
              <input type="text" placeholder="Tìm theo mã giao dịch, PNR, khách hàng..." value={search} onChange={e => setSearch(e.target.value)} />
              {search && <span className="material-icons-round" style={{cursor:'pointer',fontSize:16,color:'#94a3b8'}} onClick={()=>setSearch('')}>close</span>}
            </div>
            <div className="filter-chips">
              {(['Tất cả','Hoàn tất','Chờ duyệt','Thất bại'] as const).map(f => (
                <span key={f} className={`chip${activeFilter===f?' active':''}`} onClick={()=>setActiveFilter(f)}>{f}</span>
              ))}
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
                {loading ? (
                  Array.from({length: 5}).map((_,i) => (
                    <tr key={i}>
                      {Array.from({length:7}).map((_,j) => (
                        <td key={j}><div style={{height:16,background:'#f1f5f9',borderRadius:4,width:'80%',animation:'pulse 1.5s infinite'}} /></td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{textAlign:'center',padding:'40px',color:'#94a3b8'}}>
                    <span className="material-icons-round" style={{fontSize:36,display:'block',marginBottom:8}}>receipt_long</span>
                    {search || activeFilter !== 'Tất cả' ? 'Không tìm thấy giao dịch phù hợp' : 'Chưa có giao dịch nào'}
                  </td></tr>
                ) : filtered.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div className="time-cell">
                        <b>{tx.date ? tx.date.split('T')[1]?.substring(0,5) ?? '--:--' : '--:--'}</b>
                        <span>{tx.date ? tx.date.split('T')[0] : '----/--/--'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="tx-cell">
                        <code className="id-code">{tx.id}</code>
                        <span className="pnr-link">Booking: {tx.bookingId}</span>
                      </div>
                    </td>
                    <td><b>{tx.customer || 'N/A'}</b></td>
                    <td>
                      <div className="method-cell">
                        <span className="material-icons-round">account_balance_wallet</span>
                        <div><p>{tx.method || 'Tiền mặt'}</p></div>
                      </div>
                    </td>
                    <td><b className="amount-text">{formatAmount(tx.amount)}</b></td>
                    <td>
                      <span className={`status-pill ${tx.status === 'Đã thanh toán' || tx.status === 'Hoàn tất' ? 'completed' : tx.status === 'Chờ thanh toán' ? 'pending' : 'failed'}`}>
                        <i className="dot"></i>{tx.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-row">
                        <button className="icon-btn" title="In biên lai"><span className="material-icons-round">print</span></button>
                        <button className="icon-btn" title="Chi tiết"><span className="material-icons-round">info</span></button>
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
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
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
