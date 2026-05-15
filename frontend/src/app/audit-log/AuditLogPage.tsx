import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';

interface AuditLogPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const AuditLogPage: React.FC<AuditLogPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const logs = [
    { id: 'LOG-4829', user: 'admin_dung', action: 'Phát hành vé', module: 'Tickets', target: '738-29481726', time: '10:12:34 24/10', type: 'info' },
    { id: 'LOG-4830', user: 'agent_an', action: 'Hủy đặt chỗ', module: 'Booking', target: 'G7X9PQ', time: '11:04:11 24/10', type: 'warning' },
    { id: 'LOG-4831', user: 'admin_dung', action: 'Thay đổi giá vé', module: 'Flights', target: 'QH-202', time: '13:45:00 24/10', type: 'danger' },
    { id: 'LOG-4832', user: 'sys_bot', action: 'Tự động khóa PNR', module: 'System', target: 'PNR-EXP-01', time: '15:20:05 24/10', type: 'info' },
    { id: 'LOG-4833', user: 'agent_an', action: 'Hoàn tiền', module: 'Refund', target: 'RFD-1022', time: '16:10:22 24/10', type: 'warning' },
  ];

  return (
    <AppLayout 
      activeItem="audit_log" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      breadcrumb={[{ label: 'Hệ thống', page: 'dashboard' }, { label: 'Nhật ký hoạt động' }]}
    >
      <div className="audit-log-page">
        
        {/* ── HEADER ── */}
        <div className="page-header-flex">
          <div>
            <h1>Nhật ký Hoạt động Hệ thống</h1>
            <p>Truy vết mọi thao tác và thay đổi dữ liệu trên toàn hệ thống.</p>
          </div>
          <div className="action-buttons">
            <Button variant="outline"><span className="material-icons-round">filter_list</span> Bộ lọc nâng cao</Button>
            <Button><span className="material-icons-round">cloud_download</span> Tải tệp nhật ký</Button>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="audit-stats">
          <Card className="mini-stat">
            <p>Tổng log hôm nay</p>
            <h3>1,248</h3>
          </Card>
          <Card className="mini-stat">
            <p>Cảnh báo bảo mật</p>
            <h3 className="text-warning">12</h3>
          </Card>
          <Card className="mini-stat">
            <p>Lỗi hệ thống</p>
            <h3 className="text-danger">0</h3>
          </Card>
        </div>

        {/* ── LOG TABLE ── */}
        <Card className="log-card">
          <div className="log-toolbar">
            <div className="search-box">
              <span className="material-icons-round">search</span>
              <input type="text" placeholder="Tìm theo ID, người dùng, hành động..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            </div>
            <div className="type-filters">
              <span className="badge active">Tất cả</span>
              <span className="badge info">Thông tin</span>
              <span className="badge warning">Cảnh báo</span>
              <span className="badge danger">Nghiêm trọng</span>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>THỜI GIAN</th>
                  <th>NGƯỜI DÙNG</th>
                  <th>HÀNH ĐỘNG</th>
                  <th>MODULE</th>
                  <th>ĐỐI TƯỢNG TÁC ĐỘNG</th>
                  <th>MÃ LOG</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td><div className="time-cell"><span className="material-icons-round">schedule</span> {log.time}</div></td>
                    <td><span className="user-tag">{log.user}</span></td>
                    <td>
                      <div className="action-cell">
                        <i className={`dot ${log.type}`}></i>
                        {log.action}
                      </div>
                    </td>
                    <td><span className="module-tag">{log.module}</span></td>
                    <td><b>{log.target}</b></td>
                    <td><code className="log-id">{log.id}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <span>Trang 1 của 42</span>
            <div className="btns">
              <button disabled><span className="material-icons-round">chevron_left</span></button>
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
              <button><span className="material-icons-round">chevron_right</span></button>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        .audit-log-page { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 24px; color: #1e293b; }
        .page-header-flex p { font-size: 14px; color: #64748b; }
        
        .audit-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
        .mini-stat { padding: 16px 20px; border: none; }
        .mini-stat p { font-size: 12px; color: #94a3b8; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
        .mini-stat h3 { font-size: 24px; color: #1e293b; }
        .text-warning { color: #f59e0b; }
        .text-danger { color: #ef4444; }

        .log-card { padding: 0; overflow: hidden; border: none; }
        .log-toolbar { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        .search-box { display: flex; align-items: center; gap: 10px; background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 6px 14px; width: 320px; }
        .search-box input { border: none; outline: none; font-size: 13px; width: 100%; }
        .type-filters { display: flex; gap: 8px; }
        .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; cursor: pointer; color: #64748b; border: 1px solid #e2e8f0; }
        .badge.active { background: #1e293b; color: white; border-color: #1e293b; }
        .badge.info:hover { color: #2563eb; background: #eff6ff; }
        .badge.warning:hover { color: #f59e0b; background: #fffbeb; }
        .badge.danger:hover { color: #ef4444; background: #fef2f2; }

        .table-wrapper { width: 100%; overflow-x: auto; }
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 14px 24px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 14px 24px; border-bottom: 1px solid #f1f5f9; font-size: 13px; vertical-align: middle; }
        
        .time-cell { display: flex; align-items: center; gap: 8px; color: #64748b; font-weight: 500; }
        .time-cell .material-icons-round { font-size: 16px; color: #cbd5e1; }
        
        .user-tag { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: 700; font-size: 12px; }
        
        .action-cell { display: flex; align-items: center; gap: 10px; font-weight: 600; color: #1e293b; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.info { background: #3b82f6; }
        .dot.warning { background: #f59e0b; }
        .dot.danger { background: #ef4444; }
        
        .module-tag { color: #2563eb; font-weight: 700; }
        .log-id { background: #f8fafc; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; font-family: monospace; color: #94a3b8; }

        .pagination { padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; background: #fafbfc; }
        .pagination span { font-size: 12px; color: #94a3b8; font-weight: 600; }
        .btns { display: flex; gap: 4px; }
        .btns button { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .btns button.active { background: #2563eb; color: white; border-color: #2563eb; }
        .btns button:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>
    </AppLayout>
  );
};

export default AuditLogPage;
