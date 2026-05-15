import React, { useState } from 'react';
import AppLayout, { showToast } from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../api';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  onUpdateUser?: (user: any) => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate, currentUser, onLogout, onUpdateUser, bookingPendingCount, flightCount, passengerCount }) => {
  const user = currentUser || JSON.parse(localStorage.getItem('currentUser') || '{}');

  const [fullName, setFullName] = useState(user.fullName || user.username || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.phone || '');
  const [saving, setSaving] = useState(false);

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  const handleSaveInfo = async () => {
    setSaving(true);
    try {
      // Update localStorage with new info
      const updated = { ...user, fullName, email, phone };
      localStorage.setItem('currentUser', JSON.stringify(updated));
      if (onUpdateUser) onUpdateUser(updated);
      showToast('Cập nhật thông tin thành công!', 'success');
    } catch {
      showToast('Lỗi khi lưu thông tin', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!curPw || !newPw || !confirmPw) {
      showToast('Vui lòng điền đầy đủ thông tin mật khẩu', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      showToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }
    if (newPw.length < 6) {
      showToast('Mật khẩu mới phải ít nhất 6 ký tự', 'error');
      return;
    }
    setPwSaving(true);
    try {
      showToast('Thay đổi mật khẩu thành công!', 'success');
      setCurPw(''); setNewPw(''); setConfirmPw('');
    } catch {
      showToast('Lỗi khi đổi mật khẩu', 'error');
    } finally {
      setPwSaving(false);
    }
  };

  const initials = (user.fullName || user.username || 'U').slice(0, 2).toUpperCase();

  return (
    <AppLayout 
      activeItem="profile" 
      onNavigate={onNavigate} 
      breadcrumb={[{ label: 'Hồ Sơ Cá Nhân' }]} 
      currentUser={user} 
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
    >
      <div className="profile-page">
        <div className="page-header">
          <div className="header-titles">
            <h1>Hồ Sơ Cá Nhân</h1>
            <p>Quản lý thông tin tài khoản và bảo mật</p>
          </div>
          {onLogout && (
            <button onClick={onLogout} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 18px', background:'#fef2f2', border:'1px solid #fecaca', borderRadius:10, color:'#dc2626', fontWeight:700, fontSize:13, cursor:'pointer' }}>
              <span className="material-icons-round" style={{fontSize:18}}>logout</span>
              Đăng xuất
            </button>
          )}
        </div>

        <div className="profile-layout">
          <div className="profile-sidebar">
            <Card className="user-overview">
              <div className="avatar-section">
                <div className="avatar-circle">
                  <span style={{ fontSize:40, fontWeight:900, color:'white' }}>{initials}</span>
                </div>
              </div>
              <h2 className="user-name">{user.fullName || user.username || 'Người dùng'}</h2>
              <p className="user-role">{user.role || 'Nhân viên'}</p>
              <div className="user-badges">
                <span className="badge agency-badge">
                  {user.agency ? `Đại lý: ${user.agency}` : user.department || 'Hệ thống'}
                </span>
                <span className="badge status-badge">
                  {user.status || 'Đang hoạt động'}
                </span>
              </div>
              {user.joinDate && (
                <p style={{ fontSize:12, color:'#94a3b8', marginTop:12 }}>
                  Ngày vào làm: {new Date(user.joinDate).toLocaleDateString('vi-VN')}
                </p>
              )}
            </Card>
          </div>

          <div className="profile-main">
            <Card className="settings-section">
              <div className="section-header">
                <h3>Thông tin cơ bản</h3>
                <Button variant="secondary" onClick={handleSaveInfo}>
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Họ và Tên</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">badge</span>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Tên đăng nhập (Tài khoản)</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">account_circle</span>
                    <input type="text" value={user.username || ''} disabled className="disabled-input" />
                  </div>
                  <small className="hint-text">Không thể thay đổi tên đăng nhập</small>
                </div>
                <div className="input-group">
                  <label>Email liên hệ</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">email</span>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Số điện thoại</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">phone</span>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="settings-section">
              <div className="section-header">
                <h3>Bảo mật &amp; Mật khẩu</h3>
                <Button variant="secondary" onClick={handleChangePassword}>
                  {pwSaving ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                </Button>
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Mật khẩu hiện tại</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">password</span>
                    <input type="password" placeholder="••••••••" value={curPw} onChange={e => setCurPw(e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Mật khẩu mới</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">key</span>
                    <input type="password" placeholder="Nhập mật khẩu mới" value={newPw} onChange={e => setNewPw(e.target.value)} />
                  </div>
                </div>
                <div className="input-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <div className="input-with-icon">
                    <span className="material-icons-round">key</span>
                    <input type="password" placeholder="Nhập lại mật khẩu mới" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <style>{`
          .profile-page { padding: 24px 32px; max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }

          .page-header { margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; }
          .header-titles h1 { font-size: 26px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
          .header-titles p { font-size: 15px; color: #64748b; margin: 0; }

          .profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 32px; }

          .user-overview { padding: 32px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; }
          .avatar-section { position: relative; margin-bottom: 20px; }
          .avatar-circle { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #0e74be, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; border: 4px solid #eff6ff; box-shadow: 0 4px 12px rgba(14, 116, 190, 0.2); }

          .user-name { font-size: 20px; font-weight: 700; color: #1e293b; margin: 0 0 4px 0; }
          .user-role { font-size: 14px; color: #64748b; margin: 0 0 16px 0; font-weight: 500; }

          .user-badges { display: flex; flex-direction: column; gap: 8px; width: 100%; }
          .badge { padding: 8px 12px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; }
          .agency-badge { background: #f1f5f9; color: #475569; }
          .status-badge { background: #dcfce7; color: #166534; }

          .settings-section { padding: 24px; margin-bottom: 24px; }
          .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid #f1f5f9; padding-bottom: 16px; }
          .section-header h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0; }

          .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          .input-group { display: flex; flex-direction: column; gap: 8px; }
          .input-group label { font-size: 13px; font-weight: 600; color: #475569; }

          .input-with-icon { position: relative; display: flex; align-items: center; }
          .input-with-icon .material-icons-round { position: absolute; left: 12px; color: #94a3b8; font-size: 20px; }
          .input-with-icon input { width: 100%; padding: 10px 12px 10px 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; color: #1e293b; outline: none; transition: border-color 0.2s; background: white; font-family: inherit; box-sizing: border-box; }
          .input-with-icon input:focus { border-color: #0e74be; }
          .input-with-icon input.disabled-input { background: #f8fafc; color: #94a3b8; cursor: not-allowed; }

          .hint-text { font-size: 12px; color: #94a3b8; margin-top: 4px; }

          @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
