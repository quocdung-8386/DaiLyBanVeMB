import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';
import { api } from '../../api';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'info' | 'warning' | 'danger'>('all');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await api.getAuditLogs(200);
      setLogs(data);
    } catch {
      // Fallback empty
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.module || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = activeFilter === 'all' || log.type === activeFilter;
    return matchSearch && matchType;
  });

  const totalToday = logs.length;
  const warningCount = logs.filter(l => l.type === 'warning').length;
  const dangerCount = logs.filter(l => l.type === 'danger').length;

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
            <h3>{totalToday}</h3>
          </Card>
          <Card className="mini-stat">
            <p>Cảnh báo</p>
            <h3 className="text-warning">{warningCount}</h3>
          </Card>
          <Card className="mini-stat">
            <p>Lỗi nghiêm trọng</p>
            <h3 className="text-danger">{dangerCount}</h3>
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
              {(['all', 'info', 'warning', 'danger'] as const).map(f => (
                <span
                  key={f}
                  className={`badge ${f !== 'all' ? f : ''} ${activeFilter === f ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f === 'all' ? 'Tất cả' : f === 'info' ? 'Thông tin' : f === 'warning' ? 'Cảnh báo' : 'Nghiêm trọng'}
                </span>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <span className="material-icons-round" style={{ fontSize: 48, marginBottom: 12 }}>hourglass_top</span>
              <p>Đang tải nhật ký...</p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
              <span className="material-icons-round" style={{ fontSize: 48, marginBottom: 12 }}>search_off</span>
              <p>Không tìm thấy log nào phù hợp.</p>
            </div>
          ) : (

          <div className="table-wrapper">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>THỜI GIAN</th>
                  <th>NGƯỜI DÙNG</th>
                  <th>HÀNH ĐỘNG</th>
                  <th>MODULE</th>
                  <th>GHI CHÚ</th>
                  <th>MÃ LOG</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
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
          )}

          <div className="pagination">
            <span>Tổng: {filteredLogs.length} bản ghi</span>
            <Button variant="outline" size="sm" onClick={fetchLogs}>
              <span className="material-icons-round" style={{ fontSize: 16 }}>refresh</span> Làm mới
            </Button>
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
