import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface CustomersPageProps {
  onNavigate?: (id: string) => void;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setShowCustomerModal(true);
  };

  const handleOpenEdit = (customer: any) => {
    setEditingCustomer(customer);
    setShowCustomerModal(true);
  };

  const metrics = [
    { title: 'Tổng Khách hàng', value: '1,248', change: '+12% so với tháng trước', icon: 'groups', color: 'primary' },
    { title: 'Khách hàng mới (Tuần)', value: '45', change: '+5% so với tuần trước', icon: 'person_add', color: 'success' },
    { title: 'Khách VIP / Hạng Thương gia', value: '186', change: 'Không đổi', icon: 'workspace_premium', color: 'warning' },
  ];

  const customers = [
    { id: 'CUS-001', name: 'Nguyễn Văn Trường', email: 'truong.nv@gmail.com', phone: '0901234567', tier: 'Gold', points: 15400, lastBooking: '12/10/2023', initials: 'NT', avatarBg: '#e0e7ff', avatarColor: '#3b82f6' },
    { id: 'CUS-002', name: 'Trần Thị Lan', email: 'lan.tran99@yahoo.com', phone: '0987654321', tier: 'Platinum', points: 32000, lastBooking: '15/10/2023', initials: 'TL', avatarBg: '#fce7f3', avatarColor: '#ec4899' },
    { id: 'CUS-003', name: 'Lê Quang Minh', email: 'minhlq.work@outlook.com', phone: '0912345678', tier: 'Silver', points: 5200, lastBooking: '05/09/2023', initials: 'LM', avatarBg: '#e0f2fe', avatarColor: '#0ea5e9' },
    { id: 'CUS-004', name: 'Phạm Thu Hà', email: 'hapham.arch@gmail.com', phone: '0934567890', tier: 'Member', points: 1200, lastBooking: '20/08/2023', initials: 'PH', avatarBg: '#f3f4f6', avatarColor: '#6b7280' },
    { id: 'CUS-005', name: 'Đoàn Nhật Nam', email: 'nam.doan@company.vn', phone: '0976543210', tier: 'Gold', points: 18500, lastBooking: '28/09/2023', initials: 'ĐN', avatarBg: '#fef3c7', avatarColor: '#f59e0b' },
  ];

  const getTierBadgeClass = (tier: string) => {
    switch(tier) {
      case 'Platinum': return 'bg-dark text-white border-dark';
      case 'Gold': return 'bg-warning-light text-warning-dark border-warning';
      case 'Silver': return 'bg-gray-light text-gray-dark border-gray';
      default: return 'bg-main text-secondary border-border';
    }
  };

  return (
    <div className="layout">
      <Sidebar activeItem="customers" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Khách hàng - Airline System" />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('dashboard')}>Dashboard</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Khách hàng</span>
          </div>

          <div className="page-header">
            <div>
              <h1>Quản lý Khách hàng</h1>
              <p>Tra cứu thông tin, quản lý hạng thẻ và lịch sử đặt vé của hành khách.</p>
            </div>
            <div className="flex-row gap-sm">
              <Button variant="outline">
                <span className="material-icons-round">cloud_upload</span>
                Nhập danh sách
              </Button>
              <Button onClick={handleOpenAdd}>
                <span className="material-icons-round">person_add</span>
                Thêm khách hàng
              </Button>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid mb-lg">
            {metrics.map((m, i) => (
              <Card key={i} className="metric-card">
                <div className={`metric-icon-box bg-${m.color}-light`}>
                  <span className={`material-icons-round text-${m.color}`}>{m.icon}</span>
                </div>
                <div className="metric-content">
                  <p className="metric-title">{m.title}</p>
                  <h3 className="metric-value">{m.value}</h3>
                  <p className="metric-change">
                    <span className="material-icons-round">trending_up</span> {m.change}
                  </p>
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
                  placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="input-with-icon select-wrapper flex-1">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">Tất cả hạng thẻ</option>
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="member">Member</option>
                </select>
                <span className="material-icons-round arrow">expand_more</span>
              </div>
              <Button className="btn-primary-alt">Lọc dữ liệu</Button>
            </div>
          </Card>

          {/* Table */}
          <Card className="table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Liên hệ</th>
                  <th>Hạng thẻ</th>
                  <th>Điểm tích lũy</th>
                  <th>Giao dịch gần nhất</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <div className="customer-cell">
                        <div className="avatar" style={{ backgroundColor: c.avatarBg, color: c.avatarColor }}>
                          {c.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-main">{c.name}</p>
                          <p className="text-xs text-muted">ID: {c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <p className="flex-center-gap"><span className="material-icons-round icon-xs">phone</span> {c.phone}</p>
                        <p className="flex-center-gap text-muted"><span className="material-icons-round icon-xs">mail</span> {c.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className={`tier-badge ${getTierBadgeClass(c.tier)}`}>
                        {c.tier === 'Platinum' && <span className="material-icons-round icon-xs mr-1">diamond</span>}
                        {c.tier === 'Gold' && <span className="material-icons-round icon-xs mr-1">stars</span>}
                        {c.tier}
                      </span>
                    </td>
                    <td><p className="font-bold text-main">{c.points.toLocaleString()} pts</p></td>
                    <td>
                      <p className="text-sm font-medium">{c.lastBooking}</p>
                    </td>
                    <td>
                      <div className="flex-row gap-xs">
                        <button className="action-btn" title="Xem chi tiết" onClick={() => setViewingItem(c)}><span className="material-icons-round text-primary">visibility</span></button>
                        <button className="action-btn" title="Chỉnh sửa" onClick={() => handleOpenEdit(c)}><span className="material-icons-round text-warning">edit</span></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <p>Hiển thị <strong>1-5</strong> trong số <strong>1,248</strong> khách hàng</p>
              <div className="page-controls">
                <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn dots">...</button>
                <button className="page-btn">250</button>
                <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* ══════════════ MODAL: Thêm/Sửa khách hàng ══════════════ */}
      {showCustomerModal && (
        <div className="cust-modal-backdrop" onClick={() => setShowCustomerModal(false)}>
          <div className="cust-modal-box" onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="cust-modal-header">
              <div className="cust-modal-title-row">
                <span className="cust-modal-icon"><span className="material-icons-round">{editingCustomer ? 'edit' : 'person_add'}</span></span>
                <div>
                  <h2>{editingCustomer ? 'Chỉnh Sửa Khách Hàng' : 'Thêm Khách Hàng Mới'}</h2>
                  <p>{editingCustomer ? `Đang chỉnh sửa khách hàng: ${editingCustomer.id}` : 'Nhập thông tin chi tiết để tạo hồ sơ khách hàng mới.'}</p>
                </div>
              </div>
              <button className="cust-close-btn" onClick={() => setShowCustomerModal(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>

            {/* Body */}
            <div className="cust-modal-body">

              {/* Section 1 */}
              <div className="cust-section">
                <div className="cust-section-title">
                  <span className="material-icons-round">manage_accounts</span>
                  Thông Tin Cơ Bản
                </div>
                <div className="cust-form-row">
                  <div className="cust-form-group span-2">
                    <label>HỌ VÀ TÊN <span className="req">*</span></label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">badge</span>
                      <input type="text" placeholder="VD: NGUYEN VAN A" defaultValue={editingCustomer?.name || ''} />
                    </div>
                  </div>
                  <div className="cust-form-group">
                    <label>GIỚI TÍNH</label>
                    <div className="cust-input-wrap select">
                      <span className="material-icons-round">people</span>
                      <select defaultValue="Nam">
                        <option>Nam</option>
                        <option>Nữ</option>
                        <option>Khác</option>
                      </select>
                      <span className="material-icons-round arrow">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="cust-form-row">
                  <div className="cust-form-group">
                    <label>NGÀY SINH</label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">calendar_month</span>
                      <input type="date" />
                    </div>
                  </div>
                  <div className="cust-form-group">
                    <label>HỘ CHIẾU / CCCD <span className="req">*</span></label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">perm_identity</span>
                      <input type="text" placeholder="Nhập số giấy tờ" defaultValue={editingCustomer?.id || ''} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2 */}
              <div className="cust-section">
                <div className="cust-section-title">
                  <span className="material-icons-round">contact_phone</span>
                  Thông Tin Liên Hệ
                </div>
                <div className="cust-form-row">
                  <div className="cust-form-group">
                    <label>SỐ ĐIỆN THOẠI <span className="req">*</span></label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">phone</span>
                      <input type="tel" placeholder="+84 901 234 567" defaultValue={editingCustomer?.phone || ''} />
                    </div>
                  </div>
                  <div className="cust-form-group">
                    <label>EMAIL</label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">mail</span>
                      <input type="email" placeholder="khachhang@email.com" defaultValue={editingCustomer?.email || ''} />
                    </div>
                  </div>
                </div>
                <div className="cust-form-row">
                  <div className="cust-form-group span-2">
                    <label>ĐỊA CHỈ</label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">home</span>
                      <input type="text" placeholder="Nhập địa chỉ đầy đủ" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3 */}
              <div className="cust-section">
                <div className="cust-section-title">
                  <span className="material-icons-round">tune</span>
                  Thông Tin Mở Rộng
                </div>
                <div className="cust-form-row">
                  <div className="cust-form-group">
                    <label>LOẠI KHÁCH HÀNG</label>
                    <div className="cust-input-wrap select">
                      <span className="material-icons-round">person</span>
                      <select defaultValue={editingCustomer?.tier || 'Cá Nhân (Phổ Thông)'}>
                        <option value="Member">Cá Nhân (Phổ Thông)</option>
                        <option value="Silver">Cá Nhân (Silver)</option>
                        <option value="Gold">Cá Nhân (Gold)</option>
                        <option value="Platinum">Cá Nhân (Platinum)</option>
                        <option value="Doanh Nghiệp">Doanh Nghiệp</option>
                      </select>
                      <span className="material-icons-round arrow">expand_more</span>
                    </div>
                  </div>
                  <div className="cust-form-group">
                    <label>ĐIỂM TÍCH LŨY THẺ</label>
                    <div className="cust-input-wrap">
                      <span className="material-icons-round">add_circle_outline</span>
                      <input type="number" defaultValue={editingCustomer?.points || 0} min={0} />
                    </div>
                  </div>
                </div>
                <div className="cust-form-row">
                  <div className="cust-form-group span-2">
                    <label>GHI CHÚ NỘI BỘ</label>
                    <div className="cust-input-wrap textarea-wrap">
                      <span className="material-icons-round">notes</span>
                      <textarea rows={3} placeholder="Yêu cầu đặc biệt, thói quen đặt vé, v.v."></textarea>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="cust-modal-footer">
              <button className="cust-btn-cancel" onClick={() => setShowCustomerModal(false)}>HỦY BỎ</button>
              <button className="cust-btn-save" onClick={() => setShowCustomerModal(false)}>
                <span className="material-icons-round">save</span>
                {editingCustomer ? 'CẬP NHẬT' : 'LƯU THÔNG TIN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Details Popup */}
      {viewingItem && (
        <div className="cust-modal-backdrop" onClick={() => setViewingItem(null)}>
          <div className="cust-modal-box" style={{ width: '480px' }} onClick={e => e.stopPropagation()}>
            <div className="cust-modal-header">
              <div className="cust-modal-title-row">
                <span className="cust-modal-icon"><span className="material-icons-round">person</span></span>
                <div>
                  <h2>Chi tiết Khách hàng</h2>
                  <p>Mã KH: <strong>{viewingItem.id}</strong></p>
                </div>
              </div>
              <button className="cust-close-btn" onClick={() => setViewingItem(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="cust-modal-body">
              <div className="cust-section" style={{ background: 'white' }}>
                <div className="cust-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Họ và tên:</span>
                    <strong style={{ color: '#1e293b' }}>{viewingItem.name}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Email:</span>
                    <strong style={{ color: '#1e293b' }}>{viewingItem.email}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>SĐT:</span>
                    <strong style={{ color: '#1e293b' }}>{viewingItem.phone}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Hạng thẻ:</span>
                    <strong style={{ color: '#1e293b' }}>{viewingItem.tier} ({viewingItem.points} điểm)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed #e2e8f0', paddingBottom: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Tổng chi tiêu:</span>
                    <strong style={{ color: '#1e293b' }}>{viewingItem.spent}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b', fontSize: '13px' }}>Ngày tham gia:</span>
                    <strong style={{ color: '#1e293b' }}>{viewingItem.joinDate}</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="cust-modal-footer">
              <button className="cust-btn-save" onClick={() => setViewingItem(null)}>ĐÓNG</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); overflow-x: hidden; }
        .content { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; width: 100%; }

        /* Typography & Colors */
        .text-primary { color: var(--primary); }
        .text-success { color: var(--success); }
        .text-warning { color: #d97706; }
        .text-danger { color: var(--danger); }
        .text-muted { color: var(--text-muted); }
        .text-main { color: var(--text-main); }
        .text-secondary { color: var(--text-secondary); }
        .text-white { color: white; }
        
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .font-medium { font-weight: 500; }
        .text-sm { font-size: 13px; }
        .text-xs { font-size: 11px; }

        .bg-primary-light { background: #e0e7ff; }
        .bg-success-light { background: #dcfce7; }
        .bg-warning-light { background: #fef3c7; }
        
        .bg-dark { background: #1f2937; }
        .border-dark { border: 1px solid #111827; }
        .text-warning-dark { color: #b45309; }
        .border-warning { border: 1px solid #fcd34d; }
        .bg-gray-light { background: #f3f4f6; }
        .text-gray-dark { color: #4b5563; }
        .border-gray { border: 1px solid #d1d5db; }
        .bg-main { background: white; }
        .border-border { border: 1px solid var(--border); }

        /* Helpers */
        .flex-row { display: flex; align-items: center; }
        .flex-center-gap { display: flex; align-items: center; gap: 6px; }
        .gap-xs { gap: 4px; }
        .gap-sm { gap: var(--space-sm); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }
        .mr-1 { margin-right: 4px; }
        .icon-xs { font-size: 14px; }

        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .breadcrumb .link { color: var(--primary); cursor: pointer; }
        .breadcrumb .separator { font-size: 16px; }
        .breadcrumb .current { color: var(--text-main); }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .page-header h1 { font-size: 24px; margin-bottom: 4px; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        /* Metrics */
        .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
        .metric-card { display: flex; align-items: center; gap: 20px; padding: 24px; }
        .metric-icon-box { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; }
        .metric-icon-box .material-icons-round { font-size: 28px; }
        .metric-content { flex: 1; }
        .metric-title { font-size: 13px; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; margin-bottom: 4px; }
        .metric-value { font-size: 28px; color: var(--text-main); margin-bottom: 4px; line-height: 1; }
        .metric-change { font-size: 12px; color: var(--success); display: flex; align-items: center; gap: 4px; font-weight: 500; }
        .metric-change .material-icons-round { font-size: 14px; }
        .metric-card:last-child .metric-change { color: var(--text-muted); }
        .metric-card:last-child .metric-change .material-icons-round { display: none; }

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
        .btn-primary-alt { background: #005a8c; color: white; border: none; padding: 10px 24px; font-size: 14px; border-radius: 8px; }

        /* Table */
        .table-card { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px var(--space-lg); font-size: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); background: #fcfcfc; text-transform: uppercase; }
        .data-table td { padding: 16px var(--space-lg); border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 14px; }
        
        .customer-cell { display: flex; align-items: center; gap: 12px; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; flex-shrink: 0; }
        
        .contact-info p { margin-bottom: 4px; font-size: 13px; }
        .contact-info p:last-child { margin-bottom: 0; }
        
        .tier-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .action-btn { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 50%; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
        .action-btn:hover { background: #f0f4ff; }

        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 16px var(--space-lg); font-size: 13px; color: var(--text-secondary); }
        .page-controls { display: flex; gap: 4px; }
        .page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: 8px; background: white; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; font-weight: 500; }
        .page-btn:hover:not(.dots) { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .page-btn.dots { border: none; background: transparent; cursor: default; }

        /* ══ ADD CUSTOMER MODAL ══ */
        .cust-modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.45); z-index: 2000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); animation: custFadeIn 0.15s ease; }
        @keyframes custFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .cust-modal-box { background: white; border-radius: 16px; width: 640px; max-width: 95vw; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 24px 64px rgba(0,0,0,0.18); animation: custSlideUp 0.2s ease; overflow: hidden; }
        @keyframes custSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        .cust-modal-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 24px 28px 20px; border-bottom: 1px solid var(--border); background: white; }
        .cust-modal-title-row { display: flex; align-items: center; gap: 14px; }
        .cust-modal-icon { width: 46px; height: 46px; border-radius: 12px; background: #e0e7ff; color: var(--primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cust-modal-icon .material-icons-round { font-size: 24px; }
        .cust-modal-header h2 { font-size: 18px; margin: 0 0 3px; color: var(--text-main); }
        .cust-modal-header p { font-size: 13px; color: var(--text-secondary); margin: 0; }
        .cust-close-btn { background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 8px; color: var(--text-muted); display: flex; transition: all 0.2s; }
        .cust-close-btn:hover { background: #f3f4f6; color: var(--text-main); }

        .cust-modal-body { padding: 20px 28px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 16px; }

        .cust-section { border: 1px solid var(--border); border-radius: 12px; padding: 18px; background: #f8f9fb; display: flex; flex-direction: column; gap: 14px; }
        .cust-section-title { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.6px; padding-bottom: 12px; border-bottom: 1px solid var(--border); }
        .cust-section-title .material-icons-round { font-size: 18px; color: var(--primary); }

        .cust-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cust-form-group { display: flex; flex-direction: column; gap: 6px; }
        .cust-form-group.span-2 { grid-column: 1 / -1; }
        .cust-form-group label { font-size: 11px; font-weight: 700; color: var(--text-secondary); letter-spacing: 0.5px; }
        .req { color: var(--danger); }

        .cust-input-wrap { display: flex; align-items: center; gap: 10px; border: 1px solid var(--border); border-radius: 8px; padding: 10px 14px; background: white; transition: border-color 0.2s; }
        .cust-input-wrap:focus-within { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(37,99,235,0.08); }
        .cust-input-wrap .material-icons-round { font-size: 18px; color: var(--text-muted); flex-shrink: 0; }
        .cust-input-wrap.arrow .material-icons-round:last-child { margin-left: auto; pointer-events: none; }
        .cust-input-wrap input, .cust-input-wrap select { flex: 1; border: none; outline: none; font-size: 14px; color: var(--text-main); background: transparent; min-width: 0; }
        .cust-input-wrap select { appearance: none; cursor: pointer; }
        .cust-input-wrap .arrow { margin-left: auto; pointer-events: none; font-size: 18px; }
        .cust-input-wrap.select { position: relative; }
        .cust-input-wrap.textarea-wrap { align-items: flex-start; }
        .cust-input-wrap textarea { flex: 1; border: none; outline: none; font-size: 14px; color: var(--text-main); background: transparent; resize: none; font-family: inherit; }

        .cust-modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 28px; border-top: 1px solid var(--border); background: #f8f9fb; }
        .cust-btn-cancel { padding: 10px 24px; border: 1px solid var(--border); border-radius: 8px; background: white; cursor: pointer; font-size: 13px; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.3px; transition: all 0.2s; }
        .cust-btn-cancel:hover { border-color: var(--text-secondary); color: var(--text-main); }
        .cust-btn-save { display: flex; align-items: center; gap: 8px; padding: 10px 24px; border: none; border-radius: 8px; background: var(--primary); color: white; cursor: pointer; font-size: 13px; font-weight: 700; letter-spacing: 0.3px; transition: background 0.2s; }
        .cust-btn-save:hover { background: #1d4ed8; }
        .cust-btn-save .material-icons-round { font-size: 18px; }
      `}</style>
    </div>
  );
};

export default CustomersPage;
