import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface UsersPageProps {
  onNavigate: (page: string) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setShowUserPopup(true);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setShowUserPopup(true);
  };

  const mockUsers = [
    { id: 'NV001', name: 'Nguyễn Văn Admin', username: 'admin_dung', role: 'Quản trị hệ thống', agency: 'Trụ sở chính', status: 'Hoạt động' },
    { id: 'NV002', name: 'Trần Thị Kế Toán', username: 'ketoan_01', role: 'Kế toán', agency: 'Trụ sở chính', status: 'Hoạt động' },
    { id: 'NV003', name: 'Lê Văn Bán Vé', username: 'agent_le', role: 'Nhân viên bán vé', agency: 'Chi nhánh Quận 1', status: 'Khóa' },
  ];

  const mockRoles = [
    { id: 'R01', name: 'Quản trị hệ thống', usersCount: 2, desc: 'Toàn quyền truy cập mọi tính năng' },
    { id: 'R02', name: 'Kế toán', usersCount: 3, desc: 'Chỉ xem báo cáo, quản lý thanh toán, hóa đơn' },
    { id: 'R03', name: 'Nhân viên bán vé', usersCount: 15, desc: 'Tạo đặt chỗ, xuất vé, hủy vé cơ bản' },
  ];

  return (
    <AppLayout activeItem="users" onNavigate={onNavigate} breadcrumb={[{ label: 'Quản Lý Nhân Sự & Phân Quyền' }]}>
      <div className="users-page">
      <div className="page-header">
        <div className="header-titles">
          <h1>Quản Lý Nhân Sự & Phân Quyền</h1>
          <p>Thiết lập tài khoản và phân quyền truy cập cho nhân viên đại lý</p>
        </div>
      </div>

      <div className="tab-bar">
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <span className="material-icons-round">manage_accounts</span>
          Tài khoản Nhân viên
        </button>
        <button 
          className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          <span className="material-icons-round">admin_panel_settings</span>
          Vai trò & Phân quyền
        </button>
      </div>

      {activeTab === 'users' && (
        <Card className="tab-content">
          <div className="toolbar">
            <div className="search-box">
              <span className="material-icons-round">search</span>
              <input type="text" placeholder="Tìm tên, tài khoản..." />
            </div>
            <div className="spacer"></div>
            <Button onClick={handleOpenAdd}>
              <span className="material-icons-round">add</span>
              Thêm nhân viên
            </Button>
          </div>

          <div className="table-responsive">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Nhân viên</th>
                <th>Vai trò</th>
                <th>Đại lý / Chi nhánh</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="tx-id">{u.id}</div>
                  </td>
                  <td>
                    <div className="customer-info">
                      <div className="customer-avatar">{u.name.split(' ').map(w => w[0]).slice(-2).join('')}</div>
                      <div>
                        <p className="name">{u.name}</p>
                        <p className="subtext">@{u.username}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="role-badge">{u.role}</span></td>
                  <td><span className="agency-text">{u.agency}</span></td>
                  <td>
                    <span className={`status-badge ${u.status === 'Hoạt động' ? 'success' : 'danger'}`}>
                      <span className="dot"></span>
                      {u.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" title="Chỉnh sửa" onClick={() => handleOpenEdit(u)}>
                        <span className="material-icons-round">edit</span>
                      </button>
                      <button className="action-btn delete" title="Khóa/Mở khóa"><span className="material-icons-round">lock</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Card>
      )}

      {activeTab === 'roles' && (
        <Card className="tab-content">
          <div className="toolbar">
            <div className="spacer"></div>
            <Button onClick={() => alert('Mở popup tạo vai trò')}>
              <span className="material-icons-round">add_moderator</span>
              Tạo vai trò mới
            </Button>
          </div>

          <div className="roles-grid">
            {mockRoles.map(r => (
              <div key={r.id} className="role-card">
                <div className="role-header">
                  <h3>{r.name}</h3>
                  <span className="users-count">{r.usersCount} nhân viên</span>
                </div>
                <p className="role-desc">{r.desc}</p>
                <div className="role-actions">
                  <button className="edit-role-btn">Chỉnh sửa quyền</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <style>{`
        .users-page { padding: 24px 32px; max-width: 1400px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }
        
        .page-header { margin-bottom: 24px; }
        .header-titles h1 { font-size: 26px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
        .header-titles p { font-size: 15px; color: #64748b; margin: 0; }

        .tab-bar { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: transparent; border: none; font-size: 15px; font-weight: 600; color: #64748b; cursor: pointer; border-radius: 8px; transition: all 0.2s; }
        .tab-btn:hover { background: #f1f5f9; color: #1e293b; }
        .tab-btn.active { background: #eff6ff; color: #0e74be; }

        .tab-content { padding: 24px; }
        
        .toolbar { display: flex; gap: 16px; margin-bottom: 24px; align-items: center; }
        .search-box { display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 8px 16px; width: 300px; }
        .search-box .material-icons-round { color: #94a3b8; font-size: 20px; margin-right: 8px; }
        .search-box input { border: none; background: transparent; outline: none; width: 100%; font-size: 14px; font-family: inherit; }
        .spacer { flex: 1; }

        .table-responsive { width: 100%; overflow-x: auto; }
        .booking-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 900px; }
        .booking-table th { padding: 16px var(--space-lg, 24px); font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #fcfcfc; text-transform: uppercase; white-space: nowrap; }
        .booking-table td { padding: 16px var(--space-lg, 24px); border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
        .booking-table tr:hover td { background: #f8fafc; }
        
        .tx-id { font-family: monospace; font-size: 13px; font-weight: 700; color: #475569; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; }
        
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .customer-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; text-transform: uppercase; }
        .customer-info .name { font-size: 14px; font-weight: 600; margin: 0 0 2px 0; color: #1e293b; }
        .customer-info .subtext { font-size: 12px; color: #64748b; margin: 0; }
        
        .role-badge { display: inline-block; padding: 4px 12px; border-radius: 6px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 600; }
        .agency-text { font-size: 14px; color: #1e293b; font-weight: 500; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef08a; color: #854d0e; }
        .status-badge.warning .dot { background: #854d0e; }
        .status-badge.danger { background: #fecaca; color: #991b1b; }
        .status-badge.danger .dot { background: #991b1b; }
        
        .action-buttons { display: flex; gap: 4px; }
        .action-btn { display: flex; align-items: center; justify-content: center; color: #64748b; padding: 6px; border-radius: 6px; transition: all 0.2s; border: none; background: transparent; cursor: pointer; }
        .action-btn .material-icons-round { font-size: 18px; }
        .action-btn.edit:hover { background: #fef7e0; color: #b06000; }
        .action-btn.delete:hover { background: #fce8e6; color: #c5221f; }

        .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .role-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; transition: all 0.2s; }
        .role-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .role-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .role-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .users-count { font-size: 12px; font-weight: 600; color: #0e74be; background: #eff6ff; padding: 4px 10px; border-radius: 12px; }
        .role-desc { font-size: 14px; color: #64748b; margin: 0 0 20px 0; line-height: 1.5; height: 42px; }
        .edit-role-btn { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; }
        .edit-role-btn:hover { border-color: #0e74be; color: #0e74be; background: #f8fafc; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* User Popup CSS */
        .user-popup-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); animation: fadeInPopup 0.2s; }
        .user-popup-card { background: white; border-radius: 16px; width: 500px; max-width: 90vw; box-shadow: 0 24px 80px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; }
        .user-popup-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .user-popup-header h3 { margin: 0; font-size: 18px; color: #1e293b; font-weight: 700; }
        .user-popup-close { background: transparent; border: none; font-size: 24px; color: #64748b; cursor: pointer; display: flex; align-items: center; justify-content: center; border-radius: 6px; padding: 4px; }
        .user-popup-close:hover { background: #e2e8f0; color: #1e293b; }
        
        .user-popup-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; max-height: 70vh; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #475569; }
        .form-group input, .form-group select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; transition: border-color 0.2s; }
        .form-group input:focus, .form-group select:focus { border-color: #0e74be; }
        
        .user-popup-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 12px; background: white; }
        .btn-cancel { padding: 10px 20px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; font-weight: 600; color: #475569; cursor: pointer; font-family: inherit; font-size: 14px; }
        .btn-cancel:hover { background: #f8fafc; }
        .btn-save { padding: 10px 20px; border: none; border-radius: 8px; background: #0e74be; font-weight: 600; color: white; cursor: pointer; font-family: inherit; font-size: 14px; display: flex; align-items: center; gap: 8px; }
        .btn-save:hover { background: #0b5a94; }

        @keyframes fadeInPopup { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
      
      {/* Thêm/Sửa Popup */}
      {showUserPopup && (
        <div className="user-popup-overlay" onClick={() => setShowUserPopup(false)}>
          <div className="user-popup-card" onClick={e => e.stopPropagation()}>
            <div className="user-popup-header">
              <h3>{editingUser ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</h3>
              <button className="user-popup-close" onClick={() => setShowUserPopup(false)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="user-popup-body">
              <div className="form-group">
                <label>Họ và Tên</label>
                <input type="text" defaultValue={editingUser?.name || ''} placeholder="VD: Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label>Tên đăng nhập</label>
                <input type="text" defaultValue={editingUser?.username || ''} placeholder="VD: nguyenva" disabled={!!editingUser} style={{ backgroundColor: editingUser ? '#f1f5f9' : 'transparent' }} />
              </div>
              {!editingUser && (
                <div className="form-group">
                  <label>Mật khẩu tạm</label>
                  <input type="password" placeholder="Nhập mật khẩu" />
                </div>
              )}
              <div className="form-group">
                <label>Vai trò</label>
                <select defaultValue={editingUser?.role || 'Nhân viên bán vé'}>
                  <option>Nhân viên bán vé</option>
                  <option>Kế toán</option>
                  <option>Quản trị hệ thống</option>
                </select>
              </div>
              <div className="form-group">
                <label>Chi nhánh trực thuộc</label>
                <select defaultValue={editingUser?.agency || 'Trụ sở chính'}>
                  <option>Trụ sở chính</option>
                  <option>Chi nhánh Quận 1</option>
                  <option>Chi nhánh Tân Bình</option>
                </select>
              </div>
              {editingUser && (
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select defaultValue={editingUser.status}>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Khóa">Khóa</option>
                  </select>
                </div>
              )}
            </div>
            <div className="user-popup-footer">
              <button className="btn-cancel" onClick={() => setShowUserPopup(false)}>Hủy</button>
              <button className="btn-save" onClick={() => setShowUserPopup(false)}>
                <span className="material-icons-round" style={{fontSize: 18}}>save</span>
                {editingUser ? 'Cập nhật' : 'Lưu nhân viên'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
};

export default UsersPage;
