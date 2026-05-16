import React, { useState } from 'react';
import AppLayout, { showToast } from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface RefundManagementPageProps {
  onNavigate?: (id: string) => void;
  bookings?: any[];
  onUpdateStatus?: (id: string, status: string, badge: any, method?: string) => Promise<boolean> | void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const RefundManagementPage: React.FC<RefundManagementPageProps> = ({ 
  onNavigate, bookings = [], onUpdateStatus,
  currentUser, onLogout, bookingPendingCount, flightCount, passengerCount 
}) => {
  const [selectedRefundId, setSelectedRefundId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Combine global bookings that are 'Cancelled' or 'Refunding' with static mock data
  const [localRefunds, setLocalRefunds] = useState([
    { id: 'REF-83921', ticket: 'BK-002', customer: 'Trần Thị Bé', amount: 1890000, date: '2023-10-29 10:15', method: 'Chuyển khoản NH', status: 'pending', isGlobal: false },
    { id: 'REF-83918', ticket: 'VE-998', customer: 'Lê Hữu Đạt', amount: 3500000, date: '2023-10-28 14:30', method: 'Thẻ tín dụng', status: 'completed', isGlobal: false },
  ]);

  // Derived refunds from global state
  const globalRefundRequests = bookings
    .filter(b => b.status === 'Đã hủy' || b.status === 'Yêu cầu hoàn')
    .map(b => ({
      id: `REF-${b.id}`,
      ticket: b.id,
      customer: b.customer,
      amount: parseInt(b.total?.replace(/\D/g, '') || '0'),
      date: b.date + ' ' + b.time,
      method: 'Chuyển khoản NH',
      status: b.status === 'Đã hủy' ? 'pending' : (b.status === 'Đã hoàn tiền' ? 'completed' : 'pending'),
      isGlobal: true
    }));

  const allRefunds = [...globalRefundRequests, ...localRefunds];

  // Dynamic Metrics
  const metrics = [
    { 
      title: 'Yêu cầu chờ xử lý', 
      value: allRefunds.filter(r => r.status === 'pending').length.toString(), 
      icon: 'pending_actions', 
      color: 'warning' 
    },
    { 
      title: 'Đã hoàn (Tháng này)', 
      value: (allRefunds.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.amount, 0) / 1000000).toFixed(1) + 'tr', 
      icon: 'check_circle', 
      color: 'success' 
    },
    { 
      title: 'Tổng số yêu cầu', 
      value: allRefunds.length.toString(), 
      icon: 'history', 
      color: 'primary' 
    },
  ];

  const handleProcessRefund = (id: string, newStatus: 'completed' | 'rejected') => {
    const refund = allRefunds.find(r => r.id === id);
    if (!refund) return;

    if (refund.isGlobal && onUpdateStatus) {
      const finalStatus = newStatus === 'completed' ? 'Đã hoàn tiền' : 'Từ chối hoàn';
      const finalBadge = newStatus === 'completed' ? 'success' : 'danger';
      onUpdateStatus(refund.ticket, finalStatus, finalBadge);
    } else {
      setLocalRefunds(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    }
    showToast(`Đã ${newStatus === 'completed' ? 'phê duyệt' : 'từ chối'} yêu cầu hoàn tiền thành công!`, 'success');
    setSelectedRefundId(null);
  };

  const filteredRefunds = allRefunds.filter(r => {
    const matchesSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          r.ticket.toLowerCase().includes(searchTerm.toLowerCase());
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
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      breadcrumb={[{ label: 'Điều hành', page: 'dashboard' }, { label: 'Quản lý Hoàn tiền' }]}
    >
      <div className="refund-page-content">
        <div className="page-header">
          <div className="header-title-area">
            <div className="icon-badge bg-primary-light">
              <span className="material-icons-round text-primary">assignment_return</span>
            </div>
            <div>
              <h1>Trung tâm Quản lý Hoàn tiền</h1>
              <p>Phê duyệt và theo dõi các yêu cầu hoàn trả tài chính cho khách hàng.</p>
            </div>
          </div>
          <div className="header-actions">
            <Button variant="outline" className="btn-modern">
              <span className="material-icons-round">history</span>
              Nhật ký xử lý
            </Button>
            <Button className="btn-primary-alt shadow-sm">
              <span className="material-icons-round">file_download</span>
              Xuất báo cáo
            </Button>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="metrics-grid">
          {metrics.map((m, i) => (
            <Card key={i} className="metric-card-premium">
              <div className="metric-top">
                <div className={`metric-icon bg-${m.color}-light`}>
                  <span className={`material-icons-round text-${m.color}`}>{m.icon}</span>
                </div>
                <div className="metric-trend up">
                  <span className="material-icons-round">trending_up</span>
                  <span>12%</span>
                </div>
              </div>
              <div className="metric-info">
                <h3 className="metric-val">{m.value}</h3>
                <p className="metric-lbl">{m.title}</p>
              </div>
              <div className="metric-progress">
                <div className={`progress-bar bg-${m.color}`} style={{ width: '65%' }}></div>
              </div>
            </Card>
          ))}
        </div>

        {/* Filter Section */}
        <div className="table-controls-row">
          <div className="search-box-modern">
            <span className="material-icons-round">search</span>
            <input 
              type="text" 
              placeholder="Tìm theo PNR, Tên khách, Mã yêu cầu..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <div className="select-modern">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">⏳ Chờ xử lý</option>
                <option value="completed">✅ Đã hoàn tiền</option>
                <option value="rejected">❌ Từ chối</option>
              </select>
            </div>
            <Button variant="outline" className="btn-icon-only" title="Lọc theo ngày">
              <span className="material-icons-round">calendar_month</span>
            </Button>
            <Button variant="outline" className="btn-icon-only" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} title="Làm mới">
              <span className="material-icons-round">refresh</span>
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <Card className="table-container-premium">
          <div className="table-header-info">
            <p>Hiển thị <strong>{filteredRefunds.length}</strong> yêu cầu phù hợp</p>
          </div>
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>MÃ YÊU CẦU</th>
                  <th>KHÁCH HÀNG</th>
                  <th>MÃ ĐẶT CHỖ / VÉ</th>
                  <th>SỐ TIỀN HOÀN</th>
                  <th>NGÀY GỬI</th>
                  <th>TRẠNG THÁI</th>
                  <th className="text-right">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredRefunds.length > 0 ? filteredRefunds.map((r, i) => {
                  const statusInfo = getStatusDisplay(r.status);
                  return (
                    <tr key={i} className="table-row-hover">
                      <td><span className="code-tag">{r.id}</span></td>
                      <td>
                        <div className="user-cell">
                          <div className="refund-table-avatar">{r.customer.charAt(0)}</div>
                          <span className="user-name">{r.customer}</span>
                        </div>
                      </td>
                      <td>
                        <div className="ticket-cell">
                          <span className="pnr-tag">{r.ticket}</span>
                          <span className="method-sub">{r.method}</span>
                        </div>
                      </td>
                      <td><span className="amount-text">{r.amount.toLocaleString('vi-VN')} đ</span></td>
                      <td>
                        <div className="date-cell">
                          <span className="d-date">{r.date.split(' ')[0]}</span>
                          <span className="d-time">{r.date.split(' ')[1]}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${statusInfo.badge}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="text-right">
                        <div className="action-flex">
                          {r.status === 'pending' ? (
                            <button className="btn-action-primary" onClick={() => setSelectedRefundId(r.id)}>
                              Xử lý ngay
                            </button>
                          ) : (
                            <button className="btn-action-view" onClick={() => setSelectedRefundId(r.id)}>
                              <span className="material-icons-round">visibility</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={7} className="empty-table-cell">
                      <div className="empty-state-modern">
                        <div className="empty-icon-circle">
                          <span className="material-icons-round">sentiment_dissatisfied</span>
                        </div>
                        <h3>Không tìm thấy yêu cầu nào</h3>
                        <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Process Modal */}
        {selectedRefundId && (() => {
          const refund = allRefunds.find(r => r.id === selectedRefundId);
          if(!refund) return null;
          
          return (
            <div className="modal-overlay-modern" onClick={() => setSelectedRefundId(null)}>
              <div className="modal-content-modern" onClick={e => e.stopPropagation()}>
                <div className="modal-top-bar">
                  <div className="modal-title-group">
                    <span className="material-icons-round">verified_user</span>
                    <h3>Chi tiết & Phê duyệt Hoàn tiền</h3>
                  </div>
                  <button className="close-x" onClick={() => setSelectedRefundId(null)}>
                    <span className="material-icons-round">close</span>
                  </button>
                </div>
                
                <div className="modal-inner">
                  <div className="refund-summary-card">
                    <div className="s-row">
                      <span className="s-label">Khách hàng:</span>
                      <span className="s-val">{refund.customer}</span>
                    </div>
                    <div className="s-row">
                      <span className="s-label">Mã vé/Booking:</span>
                      <span className="s-val font-mono">{refund.ticket}</span>
                    </div>
                    <div className="s-row">
                      <span className="s-label">Phương thức:</span>
                      <span className="s-val">{refund.method}</span>
                    </div>
                    <div className="s-divider"></div>
                    <div className="s-row total">
                      <span className="s-label">TỔNG TIỀN HOÀN:</span>
                      <span className="s-val-price">{refund.amount.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>

                  <div className="modal-form-section">
                    <h4>Ghi chú xử lý <span className="required">*</span></h4>
                    <textarea 
                      placeholder="Nhập nội dung phản hồi cho khách hàng hoặc ghi chú nội bộ..."
                      className="modern-textarea"
                      rows={3}
                    ></textarea>
                    
                    <div className="evidence-section mt-lg">
                      <h4>Chứng từ thanh toán (UNC/Biên lai)</h4>
                      <div className="upload-dropzone">
                        <span className="material-icons-round">cloud_upload</span>
                        <p>Kéo thả file vào đây hoặc <strong>Bấm để chọn file</strong></p>
                        <span className="file-hint">Định dạng hỗ trợ: JPG, PNG, PDF (Max 5MB)</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="modal-bottom-actions">
                  <button className="btn-m-secondary" onClick={() => setSelectedRefundId(null)}>Hủy bỏ</button>
                  {refund.status === 'pending' && (
                    <div className="flex-row gap-md">
                      <button className="btn-m-danger" onClick={() => handleProcessRefund(refund.id, 'rejected')}>
                        <span className="material-icons-round">block</span> Từ chối
                      </button>
                      <button className="btn-m-success" onClick={() => handleProcessRefund(refund.id, 'completed')}>
                        <span className="material-icons-round">check_circle</span> Xác nhận & Hoàn tiền
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

      </div>

      <style>{`
        .refund-page-content { animation: slideUpIn 0.4s ease-out; }
        @keyframes slideUpIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .header-title-area { display: flex; align-items: center; gap: 14px; }
        .icon-badge { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .header-title-area h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px; }
        .header-title-area p { font-size: 13px; color: #64748b; margin: 2px 0 0; }
        .header-actions { display: flex; gap: 10px; }
        .btn-modern { border-radius: 8px; font-weight: 700; font-size: 12px; padding: 8px 16px; }

        /* Background Utils */
        .bg-primary-light { background: #eff6ff; }
        .bg-success-light { background: #ecfdf5; }
        .bg-warning-light { background: #fffbeb; }
        .bg-danger-light { background: #fef2f2; }
        .bg-primary { background: #2563eb; }
        .bg-success { background: #059669; }
        .bg-warning { background: #d97706; }
        .bg-danger { background: #dc2626; }

        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
        .metric-card-premium { padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; transition: all 0.2s; position: relative; overflow: hidden; background: white; }
        .metric-card-premium:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .metric-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .metric-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .metric-trend { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 20px; }
        .metric-trend.up { background: #dcfce7; color: #15803d; }
        .metric-info h3 { font-size: 26px; font-weight: 900; color: #0f172a; margin: 0; line-height: 1.1; }
        .metric-lbl { font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase; margin: 4px 0 12px; letter-spacing: 0.5px; }
        .metric-progress { height: 4px; background: #f1f5f9; border-radius: 2px; overflow: hidden; }
        .progress-bar { height: 100%; border-radius: 2px; }

        .table-controls-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; gap: 16px; }
        .search-box-modern { flex: 1; position: relative; display: flex; align-items: center; }
        .search-box-modern .material-icons-round { position: absolute; left: 14px; color: #94a3b8; font-size: 20px; }
        .search-box-modern input { width: 100%; padding: 10px 14px 10px 42px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 13px; transition: all 0.2s; background: white; }
        .search-box-modern input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .filter-group { display: flex; gap: 8px; align-items: center; }
        .select-modern select { padding: 10px 14px; border-radius: 10px; border: 1px solid #e2e8f0; outline: none; font-size: 13px; font-weight: 600; color: #475569; background: white; cursor: pointer; }
        .btn-icon-only { width: 38px; height: 38px; padding: 0 !important; display: flex; align-items: center; justify-content: center; border-radius: 10px; }

        .table-container-premium { padding: 0; overflow: hidden; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 1px 2px rgba(0,0,0,0.03); background: white; }
        .table-header-info { padding: 12px 20px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: 600; }
        .modern-table { width: 100%; border-collapse: collapse; }
        .modern-table th { padding: 12px 20px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .modern-table td { padding: 14px 20px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; font-size: 13px; }
        .table-row-hover:hover { background: #f8fafc; }

        .code-tag { background: #f1f5f9; color: #475569; padding: 3px 6px; border-radius: 4px; font-family: monospace; font-size: 11px; font-weight: 700; border: 1px solid #e2e8f0; }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .refund-table-avatar { width: 36px; height: 36px; border-radius: 10px; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 800; }
        .user-name { font-size: 13px; font-weight: 700; color: #1e293b; }
        .ticket-cell { display: flex; flex-direction: column; gap: 1px; }
        .pnr-tag { font-size: 12px; font-weight: 800; color: #2563eb; }
        .method-sub { font-size: 10px; color: #94a3b8; font-weight: 500; }
        .amount-text { font-size: 14px; font-weight: 800; color: #0f172a; }
        .date-cell { display: flex; flex-direction: column; }
        .d-date { font-size: 12px; font-weight: 600; color: #475569; }
        .d-time { font-size: 10px; color: #94a3b8; }
        .status-pill { padding: 4px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; white-space: nowrap; display: inline-flex; }
        .status-pill.warning { background: #fffbeb; color: #b45309; }
        .status-pill.success { background: #ecfdf5; color: #059669; }
        .status-pill.danger { background: #fef2f2; color: #dc2626; }

        .action-flex { display: flex; justify-content: flex-end; gap: 6px; }
        .btn-action-primary { padding: 6px 12px; background: #2563eb; color: white; border: none; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
        .btn-action-primary:hover { background: #1d4ed8; }
        .btn-action-view { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: all 0.2s; }
        .btn-action-view:hover { background: #f1f5f9; color: #2563eb; }

        /* Modal Modern Styles */
        .modal-overlay-modern { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeInModal 0.2s ease-out; }
        .modal-content-modern { background: white; border-radius: 16px; width: 100%; max-width: 520px; max-height: 85vh; display: flex; flex-direction: column; box-shadow: 0 20px 40px -12px rgba(0,0,0,0.15); overflow: hidden; animation: zoomInModal 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeInModal { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomInModal { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .modal-top-bar { padding: 20px 24px; background: #f8fafc; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; }
        .modal-title-group { display: flex; align-items: center; gap: 10px; }
        .modal-title-group .material-icons-round { color: #2563eb; font-size: 20px; }
        .modal-title-group h3 { margin: 0; font-size: 16px; font-weight: 800; color: #0f172a; }
        .close-x { background: transparent; border: none; cursor: pointer; color: #94a3b8; padding: 4px; border-radius: 50%; display: flex; transition: all 0.2s; }
        .close-x:hover { background: #f1f5f9; color: #ef4444; }

        .modal-inner { padding: 24px; overflow-y: auto; flex: 1; }
        .refund-summary-card { background: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #e2e8f0; }
        .s-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .s-label { color: #64748b; font-weight: 600; }
        .s-val { color: #1e293b; font-weight: 700; }
        .s-divider { height: 1px; background: #e2e8f0; margin: 12px 0; border-style: dashed; }
        .s-row.total { margin-bottom: 0; }
        .s-val-price { font-size: 20px; font-weight: 900; color: #d97706; }

        .modal-form-section h4 { font-size: 12px; font-weight: 800; color: #475569; text-transform: uppercase; margin: 0 0 10px; letter-spacing: 0.5px; }
        .required { color: #ef4444; }
        .modern-textarea { width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; padding: 12px; outline: none; font-family: inherit; font-size: 13px; transition: all 0.2s; }
        .modern-textarea:focus { border-color: #2563eb; }

        .upload-dropzone { border: 2px dashed #cbd5e1; border-radius: 12px; padding: 24px; text-align: center; background: #f8fafc; cursor: pointer; transition: all 0.2s; }
        .upload-dropzone:hover { border-color: #2563eb; background: #f0f7ff; }
        .upload-dropzone .material-icons-round { font-size: 32px; color: #94a3b8; margin-bottom: 8px; }
        .upload-dropzone p { font-size: 13px; color: #475569; margin: 0 0 4px; }
        .file-hint { font-size: 10px; color: #94a3b8; font-weight: 500; }

        .modal-bottom-actions { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; }
        .btn-m-secondary { padding: 10px 20px; border: 1px solid #e2e8f0; background: white; border-radius: 8px; font-size: 13px; font-weight: 700; color: #64748b; cursor: pointer; }
        .btn-m-danger { padding: 10px 20px; border: none; background: #fef2f2; color: #dc2626; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .btn-m-success { padding: 10px 20px; border: none; background: #2563eb; color: white; border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(37,99,235,0.2); }

        .empty-state-modern { padding: 40px 0; text-align: center; }
        .empty-icon-circle { width: 52px; height: 52px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        .empty-icon-circle .material-icons-round { font-size: 28px; color: #94a3b8; }
        .empty-state-modern h3 { font-size: 16px; font-weight: 800; color: #1e293b; margin: 0 0 4px; }
        .empty-state-modern p { font-size: 13px; color: #64748b; margin: 0; }

        /* Toast Styles */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-notification.success { background: #10b981; }
        .toast-notification.error { background: #ef4444; }
        .toast-notification button { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; opacity: 0.8; margin-left: 24px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.2); }
        .toast-notification button:hover { opacity: 1; }
      `}</style>
    </AppLayout>
  );
};

export default RefundManagementPage;
