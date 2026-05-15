import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../api';

interface UsersPageProps {
  onNavigate: (page: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const UsersPage: React.FC<UsersPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingRole, setEditingRole] = useState<any>(null);

  const fetchStaff = async () => {
    try {
      const data = await api.getStaff();
      setUsersList(data.map((s: any) => ({
        id: String(s.id),
        name: s.username,
        username: s.username,
        role: s.department || 'STAFF',
        agency: s.agency || 'DAILY_01',
        status: s.status || 'Hoạt động'
      })));
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const [rolesList, setRolesList] = useState<any[]>([]);

  const fetchRoles = async () => {
    try {
      const data = await api.getRoles();
      setRolesList(data.map((r: any) => ({
        id: r.id,
        name: r.name,
        desc: r.desc,
        usersCount: r.usersCount,
        permissions: r.permissions || []
      })));
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const [availablePermissions, setAvailablePermissions] = useState<any[]>([]);

  const fetchPermissions = async () => {
    try {
      const data = await api.getPermissions();
      setAvailablePermissions(data);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
    }
  };

  const [agenciesList, setAgenciesList] = useState<any[]>([]);

  const fetchAgencies = async () => {
    try {
      const data = await api.getAgencies();
      setAgenciesList(data);
    } catch (error) {
      console.error("Failed to fetch agencies:", error);
    }
  };

  React.useEffect(() => {
    fetchStaff();
    fetchRoles();
    fetchPermissions();
    fetchAgencies();
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ name: '', username: '', role: 'STAFF', agency: 'DAILY_01', status: 'Hoạt động', password: '' });

  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const handleOpenEdit = (user: any) => {
    setEditingUser(user);
    setFormData({ ...user });
    setShowUserPopup(true);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({ name: '', username: '', role: 'STAFF', agency: 'DAILY_01', status: 'Hoạt động', password: '' });
    setShowUserPopup(true);
  };

  const handleOpenAddRole = () => {
    setEditingRole({ name: '', desc: '', permissions: [] });
    setShowRolePopup(true);
  };

  const handleOpenEditRole = (role: any) => {
    setEditingRole({ ...role });
    setShowRolePopup(true);
  };

  const handleToggleLock = async (user: any) => {
    const isLocked = user.status === 'Khóa';
    const newStatus = isLocked ? 'Hoạt động' : 'Khóa';
    try {
      await api.updateStaff(user.id, { status: newStatus });
      setUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      showToast(`Đã ${isLocked ? 'mở khóa' : 'khóa'} tài khoản ${user.username} thành công!`, isLocked ? 'success' : 'error');
    } catch (error) {
      showToast('Có lỗi xảy ra khi cập nhật trạng thái.', 'error');
    }
  };

  const confirmDelete = (id: string) => {
    setShowDeleteConfirm(id);
  };

  const handleDeleteUser = async () => {
    if (showDeleteConfirm) {
      try {
        await api.deleteStaff(showDeleteConfirm);
        setUsersList(prev => prev.filter(u => u.id !== showDeleteConfirm));
        setShowDeleteConfirm(null);
        showToast('Đã xóa nhân viên khỏi hệ thống.', 'success');
      } catch (error) {
        showToast('Có lỗi xảy ra khi xóa nhân viên.', 'error');
      }
    }
  };


  const handleSaveRole = async () => {
    try {
      const isExisting = rolesList.some(r => r.id === editingRole.id);
      if (isExisting) {
        await api.updateRole(editingRole.id, editingRole);
        setRolesList(prev => prev.map(r => r.id === editingRole.id ? editingRole : r));
      } else {
        await api.createRole(editingRole);
        setRolesList(prev => [...prev, editingRole]);
      }
      setShowRolePopup(false);
      showToast('Đã cập nhật quyền hạn cho vai trò thành công!', 'success');
    } catch (error) {
      showToast('Có lỗi xảy ra khi lưu vai trò.', 'error');
    }
  };

  const handleSaveUser = async () => {
    if (!formData.name || !formData.username) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc.', 'error');
      return;
    }

    try {
      const roleId = rolesList.find(r => r.name === formData.role)?.id || formData.role;
      const agencyId = agenciesList.find(a => a.name === formData.agency)?.id || formData.agency;

      if (editingUser) {
        await api.updateStaff(editingUser.id, {
          username: formData.username,
          department: roleId,
          agency: agencyId,
          status: formData.status
        });
        setUsersList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData, role: roleId, agency: agencyId } : u));
      } else {
        await api.createStaff({
          username: formData.username,
          password: formData.password || 'password123',
          department: roleId,
          agency: agencyId
        });
      }
      fetchStaff();

      setShowUserPopup(false);
      showToast(editingUser ? 'Cập nhật nhân viên thành công!' : 'Đã thêm nhân viên mới!', 'success');
    } catch (error) {
      showToast('Có lỗi xảy ra khi lưu thông tin.', 'error');
    }
  };

  const filteredUsers = usersList.filter(u =>
    (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(u.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout
      activeItem="users"
      onNavigate={onNavigate}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      bookings={[]}
      breadcrumb={[{ label: 'Quản Lý Nhân Sự & Phân Quyền' }]}
    >
      <div className="users-page">
        <div className="page-header">
          <div className="header-titles">
            <h1>Quản Lý Nhân Sự & Phân Quyền</h1>
            <p>Thiết lập tài khoản và phân quyền truy cập cho nhân viên đại lý</p>
          </div>
        </div>

        <div className="tab-bar">
          <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <span className="material-icons-round">manage_accounts</span> Tài khoản Nhân viên
          </button>
          <button className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`} onClick={() => setActiveTab('roles')}>
            <span className="material-icons-round">admin_panel_settings</span> Vai trò & Phân quyền
          </button>
        </div>

        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>
            <span className="material-icons-round" style={{ animation: 'spin 1s linear infinite', fontSize: 32 }}>sync</span>
            <p style={{ marginTop: 12, fontWeight: 600 }}>Đang tải dữ liệu nhân sự...</p>
          </div>
        ) : activeTab === 'users' && (
          <Card className="tab-content">
            <div className="toolbar">
              <div className="search-box">
                <span className="material-icons-round">search</span>
                <input type="text" placeholder="Tìm tên, tài khoản..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="spacer"></div>
              <Button onClick={handleOpenAdd}>
                <span className="material-icons-round">add</span> Thêm nhân viên
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
                  {filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td><div className="tx-id">{u.id}</div></td>
                      <td>
                        <div className="customer-info">
                          <div className="customer-avatar">
                            {(() => {
                              const nameStr = String(u.name || '').trim();
                              if (!nameStr) return '??';
                              const parts = nameStr.split(/\s+/).filter(Boolean);
                              if (parts.length === 0) return '??';
                              if (parts.length === 1) return parts[0][0].toUpperCase();
                              return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase();
                            })()}
                          </div>
                          <div>
                            <p className="name">{u.name}</p>
                            <p className="subtext">@{u.username}</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="role-badge">{rolesList.find(r => r.id === u.role)?.name || u.role}</span></td>
                      <td><span className="agency-text">{agenciesList.find(a => a.id === u.agency)?.name || u.agency}</span></td>
                      <td>
                        <span className={`status-badge ${u.status === 'Hoạt động' ? 'success' : 'danger'}`}>
                          <span className="dot"></span> {u.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="action-btn edit" title="Chỉnh sửa" onClick={() => handleOpenEdit(u)}>
                            <span className="material-icons-round">edit</span>
                          </button>
                          <button className="action-btn delete" title={u.status === 'Hoạt động' ? 'Khóa' : 'Mở khóa'} onClick={() => handleToggleLock(u)}>
                            <span className="material-icons-round">{u.status === 'Hoạt động' ? 'lock' : 'lock_open'}</span>
                          </button>
                          <button className="action-btn delete" title="Xóa nhân viên" onClick={() => confirmDelete(u.id)}>
                            <span className="material-icons-round">delete</span>
                          </button>
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
              <Button onClick={handleOpenAddRole}>
                <span className="material-icons-round">add_moderator</span> Tạo vai trò mới
              </Button>
            </div>
            <div className="roles-grid">
              {rolesList.map(r => (
                <div key={r.id} className="role-card">
                  <div className="role-header">
                    <h3>{r.name}</h3>
                    <span className="users-count">{r.usersCount} nhân viên</span>
                  </div>
                  <p className="role-desc">{r.desc}</p>
                  <div className="role-actions">
                    <button className="edit-role-btn" onClick={() => handleOpenEditRole(r)}>Chỉnh sửa quyền</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* User Popup */}
        {showUserPopup && (
          <div className="user-popup-overlay" onClick={() => setShowUserPopup(false)}>
            <div className="user-popup-card" onClick={e => e.stopPropagation()}>
              <div className="user-popup-header">
                <h3>{editingUser ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}</h3>
                <button className="user-popup-close" onClick={() => setShowUserPopup(false)}><span className="material-icons-round">close</span></button>
              </div>
              <div className="user-popup-body">
                <div className="form-group">
                  <label>Họ và Tên <span className="required">*</span></label>
                  <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="VD: Nguyễn Văn A" />
                </div>
                <div className="form-group">
                  <label>Tên đăng nhập <span className="required">*</span></label>
                  <input type="text" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} placeholder="VD: nguyenva" disabled={!!editingUser} style={{ backgroundColor: editingUser ? '#f1f5f9' : 'transparent' }} />
                </div>
                {!editingUser && (
                  <div className="form-group">
                    <label>Mật khẩu tạm</label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      placeholder="Nhập mật khẩu"
                    />
                  </div>
                )}
                <div className="form-group">
                  <label>Vai trò</label>
                  <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                    {rolesList.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Chi nhánh trực thuộc</label>
                  <select value={formData.agency} onChange={e => setFormData({ ...formData, agency: e.target.value })}>
                    {agenciesList.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>
                {editingUser && (
                  <div className="form-group">
                    <label>Trạng thái</label>
                    <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="Hoạt động">Hoạt động</option>
                      <option value="Khóa">Khóa</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="user-popup-footer">
                <button className="btn-cancel" onClick={() => setShowUserPopup(false)}>Hủy</button>
                <button className="btn-save" onClick={handleSaveUser}><span className="material-icons-round" style={{ fontSize: 18 }}>save</span> {editingUser ? 'Cập nhật' : 'Lưu nhân viên'}</button>
              </div>
            </div>
          </div>
        )}

        {/* Role Popup */}
        {showRolePopup && editingRole && (
          <div className="user-popup-overlay" onClick={() => setShowRolePopup(false)}>
            <div className="user-popup-card" onClick={e => e.stopPropagation()} style={{ width: '600px' }}>
              <div className="user-popup-header">
                <h3>Chỉnh Sửa Quyền Hạn: {editingRole.name || 'Vai trò mới'}</h3>
                <button className="user-popup-close" onClick={() => setShowRolePopup(false)}><span className="material-icons-round">close</span></button>
              </div>
              <div className="user-popup-body">
                <div className="form-group">
                  <label>Tên vai trò</label>
                  <input type="text" value={editingRole.name} onChange={e => setEditingRole({ ...editingRole, name: e.target.value })} placeholder="VD: Trưởng phòng vé" />
                </div>
                <div className="form-group">
                  <label>Danh sách quyền hạn</label>
                  <div className="permission-list">
                    {availablePermissions.map(p => (
                      <div key={p.id} className={`permission-item ${editingRole.permissions.includes(p.id) ? 'active' : ''}`}
                        onClick={() => {
                          const newPerms = editingRole.permissions.includes(p.id) ? editingRole.permissions.filter((id: any) => id !== p.id) : [...editingRole.permissions, p.id];
                          setEditingRole({ ...editingRole, permissions: newPerms });
                        }}>
                        <span className="material-icons-round check-icon" style={{ fontSize: 18 }}>check_circle</span>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600 }}>{p.label}</p>
                          <p style={{ margin: 0, fontSize: 11, opacity: 0.7 }}>{p.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
              <div className="user-popup-footer">
                <button className="btn-cancel" onClick={() => setShowRolePopup(false)}>Hủy</button>
                <button className="btn-save" onClick={handleSaveRole}><span className="material-icons-round" style={{ fontSize: 18 }}>save</span> Lưu quyền hạn</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {showDeleteConfirm && (
          <div className="user-popup-overlay">
            <div className="delete-confirm-card">
              <div className="delete-icon-circle"><span className="material-icons-round" style={{ fontSize: 32 }}>delete_forever</span></div>
              <h3>Xác nhận xóa?</h3>
              <p>Hành động này không thể hoàn tác.</p>
              <div className="delete-actions">
                <button className="btn-delete-cancel" onClick={() => setShowDeleteConfirm(null)}>Bỏ qua</button>
                <button className="btn-delete-confirm" onClick={handleDeleteUser}>Đồng ý xóa</button>
              </div>
            </div>
          </div>
        )}

        {toast.visible && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="material-icons-round">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, visible: false })}><span className="material-icons-round" style={{ fontSize: 18 }}>close</span></button>
          </div>
        )}
      </div>

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
        .booking-table th { padding: 16px 24px; font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #fcfcfc; text-transform: uppercase; white-space: nowrap; }
        .booking-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
        .booking-table tr:hover td { background: #f8fafc; }
        .tx-id { font-family: monospace; font-size: 13px; font-weight: 700; color: #475569; letter-spacing: 1px; }
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .customer-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; text-transform: uppercase; }
        .customer-info .name { font-size: 14px; font-weight: 600; margin: 0 0 2px 0; color: #1e293b; }
        .customer-info .subtext { font-size: 12px; color: #64748b; margin: 0; }
        .role-badge { display: inline-block; padding: 4px 12px; border-radius: 6px; background: #f1f5f9; color: #475569; font-size: 12px; font-weight: 600; }
        .agency-text { font-size: 14px; color: #1e293b; font-weight: 500; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.danger { background: #fecaca; color: #991b1b; }
        .status-badge.danger .dot { background: #991b1b; }
        .action-buttons { display: flex; gap: 4px; }
        .action-btn { display: flex; align-items: center; justify-content: center; color: #64748b; padding: 6px; border-radius: 6px; border: none; background: transparent; cursor: pointer; transition: 0.2s; }
        .action-btn .material-icons-round { font-size: 18px; }
        .action-btn.edit:hover { background: #fef7e0; color: #b06000; }
        .action-btn.delete:hover { background: #fce8e6; color: #c5221f; }
        .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .role-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; transition: 0.2s; }
        .role-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .role-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .role-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }
        .users-count { font-size: 12px; font-weight: 600; color: #0e74be; background: #eff6ff; padding: 4px 10px; border-radius: 12px; }
        .role-desc { font-size: 14px; color: #64748b; margin: 0 0 20px 0; line-height: 1.5; height: 42px; }
        .edit-role-btn { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: 0.2s; }
        .edit-role-btn:hover { border-color: #0e74be; color: #0e74be; background: #f8fafc; }
        .user-popup-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
        .user-popup-card { background: white; border-radius: 16px; width: 500px; max-width: 90vw; box-shadow: 0 24px 80px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; }
        .user-popup-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .user-popup-header h3 { margin: 0; font-size: 18px; color: #1e293b; font-weight: 700; }
        .user-popup-close { background: transparent; border: none; font-size: 24px; color: #64748b; cursor: pointer; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .user-popup-close:hover { background: #e2e8f0; }
        .user-popup-body { padding: 24px; display: flex; flex-direction: column; gap: 16px; overflow-y: auto; max-height: 70vh; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #475569; }
        .required { color: #ef4444; }
        .form-group input, .form-group select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; outline: none; transition: 0.2s; }
        .form-group input:focus, .form-group select:focus { border-color: #0e74be; }
        .user-popup-footer { padding: 16px 24px; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; gap: 12px; background: white; }
        .btn-cancel { padding: 10px 20px; border: 1px solid #cbd5e1; border-radius: 8px; background: white; font-weight: 600; color: #475569; cursor: pointer; }
        .btn-save { padding: 10px 20px; border: none; border-radius: 8px; background: #0e74be; font-weight: 600; color: white; cursor: pointer; display: flex; align-items: center; gap: 8px; }
        .toast-notification { position: fixed; bottom: 24px; right: 24px; padding: 16px 24px; border-radius: 12px; display: flex; align-items: center; gap: 12px; color: white; font-weight: 600; z-index: 10000; animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .toast-notification.success { background: #10b981; }
        .toast-notification.error { background: #ef4444; }
        .toast-notification button { background: none; border: none; color: white; cursor: pointer; opacity: 0.8; margin-left: 24px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.2); }
        .permission-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 10px; }
        .permission-item { display: flex; align-items: center; gap: 10px; padding: 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; cursor: pointer; }
        .permission-item.active { border-color: #0e74be; background: #eff6ff; }
        .permission-item .check-icon { color: #0e74be; visibility: hidden; }
        .permission-item.active .check-icon { visibility: visible; }
        .delete-confirm-card { background: white; border-radius: 16px; width: 400px; padding: 32px; text-align: center; }
        .delete-icon-circle { width: 64px; height: 64px; background: #fef2f2; color: #ef4444; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .delete-actions { display: flex; gap: 12px; margin-top: 24px; }
        .btn-delete-confirm { flex: 1; padding: 12px; border: none; border-radius: 8px; background: #ef4444; color: white; font-weight: 700; cursor: pointer; }
        .btn-delete-cancel { flex: 1; padding: 12px; border: 1px solid #e2e8f0; border-radius: 8px; background: white; color: #64748b; font-weight: 700; cursor: pointer; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default UsersPage;
