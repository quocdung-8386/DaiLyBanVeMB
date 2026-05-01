import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';

interface AuditLogPageProps {
  onNavigate: (page: string) => void;
}

const AuditLogPage: React.FC<AuditLogPageProps> = ({ onNavigate }) => {
  const [filterAction, setFilterAction] = useState('all');

  const logs = [
    { id: 1, nv: 'admin_dung', action: 'Tao dat cho', table: 'DatCho', note: 'Mã: BKG-8892', time: '2026-06-01 08:12:34', color: 'blue' },
    { id: 2, nv: 'ketoan_01', action: 'Phe duyet hoan tien', table: 'ThanhToan', note: 'Mã GD: TXN-221', time: '2026-06-01 09:04:11', color: 'orange' },
    { id: 3, nv: 'agent_le', action: 'Huy ve', table: 'VeMayBay', note: 'Mã vé: TKT-112', time: '2026-06-01 10:33:00', color: 'red' },
    { id: 4, nv: 'admin_dung', action: 'Cap nhat chuyen bay', table: 'ChuyenBay', note: 'Mã CB: VN123', time: '2026-06-01 11:55:44', color: 'green' },
    { id: 5, nv: 'ketoan_01', action: 'Xuat hoa don', table: 'HoaDon', note: 'Mã HD: INV-5581', time: '2026-06-01 13:20:05', color: 'blue' },
  ];

  const colorMap: Record<string, string> = {
    blue: '#0e74be', orange: '#f97316', red: '#ef4444', green: '#10b981',
  };

  return (
    <AppLayout activeItem="audit-log" onNavigate={onNavigate} breadcrumb={[{ label: 'Nhật Ký Hệ Thống' }]}>
      <div className="audit-page">
        <div className="page-header">
          <div className="header-titles">
            <h1>Nhật Ký Hệ Thống (Audit Log)</h1>
            <p>Theo dõi toàn bộ thao tác của nhân viên trên hệ thống</p>
          </div>
          <div className="header-actions">
            <select className="filter-select" value={filterAction} onChange={e => setFilterAction(e.target.value)}>
              <option value="all">Tất cả hành động</option>
              <option value="dat_cho">Tạo đặt chỗ</option>
              <option value="huy">Hủy vé</option>
              <option value="hoan_tien">Hoàn tiền</option>
            </select>
            <button className="btn-export">
              <span className="material-icons-round">download</span> Xuất Log
            </button>
          </div>
        </div>

        <Card className="log-table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Thời gian</th>
                <th>Nhân viên</th>
                <th>Hành động</th>
                <th>Bảng tác động</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td className="muted">{log.id}</td>
                  <td className="mono-text">{log.time}</td>
                  <td><span className="agent-tag">{log.nv}</span></td>
                  <td>
                    <span className="action-badge" style={{ background: `${colorMap[log.color]}18`, color: colorMap[log.color] }}>
                      {log.action}
                    </span>
                  </td>
                  <td><span className="table-tag">{log.table}</span></td>
                  <td className="muted">{log.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <style>{`
        .audit-page { padding: 24px 32px; animation: fadeIn 0.4s ease-out; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 28px; }
        .header-titles h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; }
        .header-titles p { font-size: 14px; color: #64748b; margin: 0; }
        .header-actions { display: flex; gap: 12px; align-items: center; }
        .filter-select { padding: 9px 14px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; font-weight: 600; color: #1e293b; outline: none; background: white; cursor: pointer; font-family: inherit; }
        .btn-export { display: flex; align-items: center; gap: 6px; padding: 9px 18px; background: #0e74be; color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .btn-export:hover { background: #0b5a94; }

        .log-table-card { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 14px 20px; font-size: 12px; font-weight: 700; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #f8fafc; text-transform: uppercase; letter-spacing: 0.5px; }
        .data-table td { padding: 16px 20px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: #f8fafc; }

        .muted { color: #94a3b8 !important; font-size: 13px !important; }
        .mono-text { font-family: monospace; font-size: 13px !important; }
        .agent-tag { background: #f1f5f9; color: #334155; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; font-family: monospace; }
        .action-badge { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; }
        .table-tag { background: #eff6ff; color: #0e74be; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default AuditLogPage;
