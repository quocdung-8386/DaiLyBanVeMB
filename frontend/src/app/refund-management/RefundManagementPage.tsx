import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface RefundManagementPageProps {
  onNavigate?: (id: string) => void;
}

const RefundManagementPage: React.FC<RefundManagementPageProps> = ({ onNavigate }) => {
  const [selectedRefund, setSelectedRefund] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refunds, setRefunds] = useState([
    { id: 'REF-83921', ticket: '112-55443322', customer: 'Lê Hữu Đạt', amount: 3500000, date: '2023-10-29 10:15', method: 'Chuyển khoản NH', status: 'pending' },
    { id: 'REF-83918', ticket: '738-99283741', customer: 'Trần Thị Bé', amount: 1890000, date: '2023-10-28 14:30', method: 'Thẻ tín dụng', status: 'completed' },
    { id: 'REF-83905', ticket: '112-11223344', customer: 'Nguyễn Văn Nam', amount: 2100000, date: '2023-10-25 09:00', method: 'Chuyển khoản NH', status: 'rejected' },
    { id: 'REF-83925', ticket: '738-12345678', customer: 'Phạm Thu Hương', amount: 4200000, date: '2023-10-29 15:45', method: 'Ví Momo', status: 'pending' },
    { id: 'REF-83910', ticket: '738-87654321', customer: 'Hoàng Quốc Việt', amount: 1500000, date: '2023-10-27 11:20', method: 'Chuyển khoản NH', status: 'completed' },
  ]);

  // Dynamic Metrics
  const metrics = [
    { 
      title: 'Yêu cầu chờ xử lý', 
      value: refunds.filter(r => r.status === 'pending').length.toString(), 
      icon: 'pending_actions', 
      color: 'warning' 
    },
    { 
      title: 'Đã hoàn (Tháng này)', 
      value: (refunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0) / 1000000).toFixed(0) + 'tr', 
      icon: 'check_circle', 
      color: 'success' 
    },
    { 
      title: 'Từ chối (Tháng này)', 
      value: refunds.filter(r => r.status === 'rejected').length.toString(), 
      icon: 'cancel', 
      color: 'danger' 
    },
  ];

  const handleProcessRefund = (id: string, newStatus: 'completed' | 'rejected') => {
    setRefunds(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setSelectedRefund(null);
    // In a real app, this would be an API call
  };

  const filteredRefunds = refunds.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.ticket.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusDisplay = (status: string) => {
    switch(status) {
      case 'pending': return { label: 'Chờ xử lý', badge: 'warning' };
      case 'completed': return { label: 'Đã hoàn tiền', badge: 'success' };
      case 'rejected': return { label: 'Từ chối', badge: 'danger' };
      default: return { label: 'Không xác định', badge: 'default' };
    }
  };

  return (
    <AppLayout 
      activeItem="refund-management" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Điều hành', page: 'dashboard' }, { label: 'Quản lý Hoàn tiền' }]}
    >
      <div className="refund-page-content">
        <div className="page-header">
          <div>
            <h1>Yêu cầu Hoàn tiền</h1>
            <p>Theo dõi và xử lý các yêu cầu hoàn vé, hoàn tiền cho khách hàng.</p>
          </div>
          <div className="flex-row gap-sm">
            <Button variant="outline">
              <span className="material-icons-round">download</span>
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="metrics-grid mb-lg">
          {metrics.map((m, i) => (
            <Card key={i} className="metric-card">
              <div className={`metric-icon-box bg-${m.color}-light`}>
                <span className={`material-icons-round text-${m.color}`}>{m.icon}</span>
              </div>
              <div className="metric-content">
                <p className="metric-title">{m.title}</p>
                <h3 className="metric-value">{m.value}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card className="filter-card mb-lg">
          <div className="filter-row">
            <div className="input-with-icon flex-2">
              <span className="material-icons-round">search</span>
              <input 
                type="text" 
                placeholder="Tìm theo mã yêu cầu, mã vé hoặc tên khách hàng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="input-with-icon select-wrapper flex-1">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Trạng thái: Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="completed">Đã hoàn tiền</option>
                <option value="rejected">Từ chối</option>
              </select>
              <span className="material-icons-round arrow">expand_more</span>
            </div>
            <div className="input-with-icon flex-1">
              <span className="material-icons-round">calendar_today</span>
              <input type="text" placeholder="Khoảng thời gian" readOnly />
            </div>
            <Button className="btn-primary-alt" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}>Xóa lọc</Button>
          </div>
        </Card>

        {/* Data Table */}
        <Card className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mã YC</th>
                  <th>Khách hàng</th>
                  <th>Thông tin vé</th>
                  <th>Số tiền hoàn</th>
                  <th>Ngày yêu cầu</th>
                  <th>Phương thức</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.length > 0 ? filteredRefunds.map((r, i) => {
                  const statusInfo = getStatusDisplay(r.status);
                  return (
                    <tr key={i}>
                      <td><span className="code-badge">{r.id}</span></td>
                      <td>
                        <p className="font-semibold text-main">{r.customer}</p>
                      </td>
                      <td>
                        <p className="font-medium text-main">{r.ticket}</p>
                      </td>
                      <td>
                        <p className="font-bold text-primary">{r.amount.toLocaleString('vi-VN')} đ</p>
                      </td>
                      <td>
                        <p className="text-sm">{r.date.split(' ')[0]}</p>
                        <p className="text-xs text-muted">{r.date.split(' ')[1]}</p>
                      </td>
                      <td><span className="method-chip">{r.method}</span></td>
                      <td>
                        <span className={`status-badge ${statusInfo.badge}`}>
                          <span className="dot"></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {r.status === 'pending' ? (
                            <button className="action-btn process" title="Xử lý hoàn tiền" onClick={() => setSelectedRefund(r.id)}>
                              <span className="material-icons-round">rule</span>
                            </button>
                          ) : (
                            <button className="action-btn view" title="Xem chi tiết" onClick={() => setSelectedRefund(r.id)}>
                              <span className="material-icons-round">visibility</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="empty-row">
                      <div className="empty-state">
                        <span className="material-icons-round">history_toggle_off</span>
                        <p>Không tìm thấy yêu cầu hoàn tiền nào khớp với bộ lọc.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="pagination">
            <p>Hiển thị <strong>{filteredRefunds.length}</strong> trong số <strong>{refunds.length}</strong> yêu cầu</p>
            <div className="page-controls">
              <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
              <button className="page-btn active">1</button>
              <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
            </div>
          </div>
        </Card>

        {/* Detail/Process Modal */}
        {selectedRefund && (() => {
        const refund = refunds.find(r => r.id === selectedRefund);
        if(!refund) return null;
        
        return (
          <div className="modal-backdrop" onClick={() => setSelectedRefund(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title-row">
                  <div className={`modal-icon-box bg-${refund.status === 'pending' ? 'warning' : 'primary'}-light`}>
                    <span className={`material-icons-round text-${refund.status === 'pending' ? 'warning' : 'primary'}`}>
                      {refund.status === 'pending' ? 'rule' : 'receipt_long'}
                    </span>
                  </div>
                  <div>
                    <h2>{refund.status === 'pending' ? 'Xử lý Hoàn tiền' : 'Chi tiết Hoàn tiền'}</h2>
                    <p>Mã YC: <strong>{refund.id}</strong></p>
                  </div>
                </div>
                <button className="modal-close" onClick={() => setSelectedRefund(null)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>
              
              <div className="modal-body">
                <div className="info-grid mb-md">
                  <div className="info-item">
                    <label>Khách hàng</label>
                    <p>{refund.customer}</p>
                  </div>
                  <div className="info-item">
                    <label>Số vé</label>
                    <p className="font-mono">{refund.ticket}</p>
                  </div>
                  <div className="info-item">
                    <label>Ngày yêu cầu</label>
                    <p>{refund.date}</p>
                  </div>
                  <div className="info-item">
                    <label>Phương thức</label>
                    <p>{refund.method}</p>
                  </div>
                </div>
                
                <div className="amount-box mb-md">
                  <div className="amount-row">
                    <span>Số tiền cần hoàn</span>
                    <span className="amount-val">{refund.amount.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>

                {refund.status === 'pending' && (
                  <div className="process-form">
                    <div className="form-group mb-sm">
                      <label>Ghi chú xử lý</label>
                      <textarea rows={3} placeholder="Nhập mã giao dịch ngân hàng hoặc lý do từ chối..."></textarea>
                    </div>
                    <div className="form-group">
                      <label>Tải lên chứng từ (Ủy nhiệm chi / Biên lai)</label>
                      <div className="upload-box">
                        <span className="material-icons-round text-muted">cloud_upload</span>
                        <p>Kéo thả file hoặc <strong>nhấn để chọn</strong></p>
                      </div>
                    </div>
                  </div>
                )}
                
                {refund.status !== 'pending' && (
                  <div className="history-box">
                    <label>Lịch sử xử lý</label>
                    <div className="history-item">
                      <span className="material-icons-round text-success">check_circle</span>
                      <div>
                        <p><strong>Kế toán viên (NV_012)</strong> đã duyệt và chuyển khoản.</p>
                        <span className="time">28/10/2023 16:20</span>
                      </div>
                    </div>
                    <div className="history-item">
                      <span className="material-icons-round text-muted">note_add</span>
                      <div>
                        <p><strong>Hệ thống</strong> tạo yêu cầu tự động từ Đơn Hủy Vé.</p>
                        <span className="time">{refund.date}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => setSelectedRefund(null)}>Đóng</button>
                {refund.status === 'pending' && (
                  <>
                    <button className="btn-reject" onClick={() => handleProcessRefund(refund.id, 'rejected')}>
                      <span className="material-icons-round">cancel</span> Từ chối
                    </button>
                    <button className="btn-save" onClick={() => handleProcessRefund(refund.id, 'completed')}>
                      <span className="material-icons-round">check_circle</span> Xác nhận đã hoàn tiền
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        /* Empty State */
        .empty-row { padding: 80px 0 !important; text-align: center; background: #fafafa !important; }
        .empty-state { display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--text-muted); }
        .empty-state .material-icons-round { font-size: 48px; opacity: 0.5; }
        .empty-state p { font-size: 14px; font-weight: 500; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        /* Typography & Utilities */
        .text-primary { color: var(--primary); }
        .text-success { color: var(--success); }
        .text-warning { color: #d97706; }
        .text-danger { color: var(--danger); }
        .text-muted { color: var(--text-muted); }
        .text-main { color: var(--text-main); }
        .text-secondary { color: var(--text-secondary); }
        
        .bg-primary-light { background: #e0e7ff; }
        .bg-success-light { background: #dcfce7; }
        .bg-warning-light { background: #fef3c7; }
        .bg-danger-light { background: #fee2e2; }

        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .font-mono { font-family: monospace; letter-spacing: 0.5px; }
        .text-sm { font-size: 13px; }
        .text-xs { font-size: 11px; }

        .flex-row { display: flex; align-items: center; }
        .gap-sm { gap: var(--space-sm); }
        .mb-sm { margin-bottom: var(--space-sm); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }

        /* Layout & Header */
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .breadcrumb .link { color: var(--primary); cursor: pointer; }
        .breadcrumb .separator { font-size: 16px; }
        .breadcrumb .current { color: var(--text-main); }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .page-header h1 { font-size: 24px; margin-bottom: 4px; font-weight: 700; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        /* Metrics */
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
        .metric-card { display: flex; align-items: center; gap: 20px; padding: 24px; }
        .metric-icon-box { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .metric-icon-box .material-icons-round { font-size: 28px; }
        .metric-content { flex: 1; }
        .metric-title { font-size: 13px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
        .metric-value { font-size: 28px; color: var(--text-main); margin-bottom: 4px; line-height: 1; font-weight: 800; }

        /* Filter */
        .filter-card { padding: 16px var(--space-lg); }
        .filter-row { display: flex; gap: var(--space-md); align-items: center; }
        .input-with-icon { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; background: white; font-size: 14px; transition: border-color 0.2s; }
        .input-with-icon:focus-within { border-color: var(--primary); }
        .input-with-icon input { border: none; background: transparent; outline: none; width: 100%; color: var(--text-main); }
        .input-with-icon .material-icons-round { color: var(--text-muted); font-size: 20px; }
        .select-wrapper { position: relative; }
        .select-wrapper select { width: 100%; border: none; background: transparent; outline: none; appearance: none; padding-right: 20px; cursor: pointer; color: var(--text-main); font-weight: 500; }
        .select-wrapper .arrow { position: absolute; right: 12px; pointer-events: none; }
        .btn-primary-alt { background: linear-gradient(135deg, #005a8c, #003d5c); color: white; border: none; padding: 10px 24px; font-size: 14px; border-radius: 8px; font-weight: 600; cursor: pointer; }

        /* Table */
        .table-card { padding: 0; overflow: hidden; }
        .table-responsive { width: 100%; overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; table-layout: auto; }
        .data-table th { padding: 16px 20px; font-size: 11px; font-weight: 700; color: #5f6368; border-bottom: 1px solid var(--border); background: #f8f9fa; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }
        .data-table td { padding: 16px 20px; border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 14px; white-space: nowrap; }
        
        .code-badge { background: #f3f4f6; color: #374151; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-size: 13px; font-weight: 600; }
        .method-chip { display: inline-block; padding: 4px 10px; background: #eef2ff; color: #4338ca; border-radius: 20px; font-size: 12px; font-weight: 600; }

        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef08a; color: #854d0e; }
        .status-badge.warning .dot { background: #854d0e; }
        .status-badge.danger { background: #fecaca; color: #991b1b; }
        .status-badge.danger .dot { background: #991b1b; }
        
        .action-buttons { display: flex; gap: 4px; }
        .action-btn { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; color: var(--text-muted); }
        .action-btn .material-icons-round { font-size: 18px; }
        .action-btn.view:hover { background: #e0e7ff; color: var(--primary); }
        .action-btn.process:hover { background: #fef7e0; color: #b06000; }

        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 16px var(--space-lg); font-size: 13px; color: var(--text-secondary); }
        .page-controls { display: flex; gap: 4px; }
        .page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 8px; background: white; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .page-btn:hover:not(.dots) { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .page-btn.dots { border: none; background: transparent; cursor: default; }

        /* Modal */
        .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.45); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); animation: tdFadeIn 0.15s ease; padding: 20px; }
        .modal-box { background: white; border-radius: 16px; width: 560px; max-width: 100%; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: tdSlideUp 0.2s ease; overflow: hidden; }
        
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 28px 20px; border-bottom: 1px solid var(--border); background: white; flex-shrink: 0; }
        .modal-title-row { display: flex; align-items: center; gap: 14px; }
        .modal-icon-box { width: 46px; height: 46px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .modal-icon-box .material-icons-round { font-size: 24px; }
        .modal-header h2 { font-size: 18px; margin: 0 0 3px; color: var(--text-main); font-weight: 700; }
        .modal-header p { font-size: 13px; color: var(--text-secondary); margin: 0; }
        .modal-close { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: var(--text-muted); display: flex; transition: all 0.2s; }
        .modal-close:hover { background: #f3f4f6; color: var(--text-main); }

        .modal-body { padding: 24px 28px; overflow-y: auto; flex: 1; }
        
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid var(--border); }
        .info-item label { display: block; font-size: 11px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 4px; }
        .info-item p { font-size: 14px; color: var(--text-main); font-weight: 500; margin: 0; }
        
        .amount-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 20px; }
        .amount-row { display: flex; justify-content: space-between; align-items: center; }
        .amount-row span:first-child { font-size: 14px; font-weight: 600; color: #92400e; }
        .amount-val { font-size: 24px; font-weight: 800; color: #d97706; }

        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--text-main); }
        .form-group textarea { padding: 12px; border: 1px solid var(--border); border-radius: 8px; font-family: inherit; font-size: 14px; resize: none; outline: none; }
        .form-group textarea:focus { border-color: var(--primary); }
        
        .upload-box { border: 2px dashed var(--border); border-radius: 8px; padding: 24px; text-align: center; cursor: pointer; background: #fafbfc; transition: all 0.2s; }
        .upload-box:hover { border-color: var(--primary); background: #f0f4ff; }
        .upload-box .material-icons-round { font-size: 32px; margin-bottom: 8px; }
        .upload-box p { font-size: 13px; color: var(--text-secondary); margin: 0; }
        
        .history-box { display: flex; flex-direction: column; gap: 12px; }
        .history-box label { font-size: 14px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
        .history-item { display: flex; gap: 12px; align-items: flex-start; }
        .history-item p { font-size: 13px; color: var(--text-main); margin: 0 0 2px; }
        .history-item .time { font-size: 11px; color: var(--text-muted); }

        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border); background: #f8f9fb; flex-shrink: 0; }
        .btn-cancel { padding: 10px 24px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--text-secondary); transition: all 0.2s; }
        .btn-cancel:hover { border-color: var(--text-secondary); color: var(--text-main); }
        .btn-reject { display: flex; align-items: center; gap: 6px; padding: 10px 20px; border: none; border-radius: 8px; background: #fee2e2; color: #dc2626; cursor: pointer; font-size: 13px; font-weight: 700; transition: background 0.2s; }
        .btn-reject:hover { background: #fca5a5; }
        .btn-save { display: flex; align-items: center; gap: 6px; padding: 10px 24px; border: none; border-radius: 8px; background: var(--primary); color: white; cursor: pointer; font-size: 13px; font-weight: 700; transition: background 0.2s; }
        .btn-save:hover { background: #1d4ed8; }
        .btn-save .material-icons-round, .btn-reject .material-icons-round { font-size: 18px; }
      `}</style>
      </div>
    </AppLayout>
  );
};

export default RefundManagementPage;
