import React from 'react';
import AppLayout, { showToast } from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  return (
    <AppLayout activeItem="profile" onNavigate={onNavigate} breadcrumb={[{ label: 'Hồ Sơ Cá Nhân' }]}>
      <div className="profile-page">
      <div className="page-header">
        <div className="header-titles">
          <h1>Hồ Sơ Cá Nhân</h1>
          <p>Quản lý thông tin tài khoản và bảo mật</p>
        </div>
      </div>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <Card className="user-overview">
            <div className="avatar-section">
              <div className="avatar-circle">
                <span className="material-icons-round">person</span>
              </div>
              <button className="change-avatar-btn">
                <span className="material-icons-round">photo_camera</span>
              </button>
            </div>
            <h2 className="user-name">Nguyễn Văn Admin</h2>
            <p className="user-role">Quản trị hệ thống</p>
            <div className="user-badges">
              <span className="badge agency-badge">Đại lý: Trụ sở chính</span>
              <span className="badge status-badge">Đang hoạt động</span>
            </div>
          </Card>
        </div>

        <div className="profile-main">
          <Card className="settings-section">
            <div className="section-header">
              <h3>Thông tin cơ bản</h3>
              <Button variant="secondary" onClick={() => showToast('Cập nhật thông tin cơ bản thành công!', 'success')}>Lưu thay đổi</Button>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Họ và Tên</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">badge</span>
                  <input type="text" defaultValue="Nguyễn Văn Admin" />
                </div>
              </div>
              <div className="input-group">
                <label>Tên đăng nhập (Tài khoản)</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">account_circle</span>
                  <input type="text" defaultValue="admin_dung" disabled className="disabled-input" />
                </div>
                <small className="hint-text">Không thể thay đổi tên đăng nhập</small>
              </div>
              <div className="input-group">
                <label>Email liên hệ</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">email</span>
                  <input type="email" defaultValue="dung@agency.com" />
                </div>
              </div>
              <div className="input-group">
                <label>Số điện thoại</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">phone</span>
                  <input type="tel" defaultValue="0901234567" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="settings-section">
            <div className="section-header">
              <h3>Bảo mật &amp; Mật khẩu</h3>
              <Button variant="secondary" onClick={() => showToast('Thay đổi mật khẩu thành công!', 'success')}>Cập nhật mật khẩu</Button>
            </div>
            <div className="form-grid">
              <div className="input-group">
                <label>Mật khẩu hiện tại</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">password</span>
                  <input type="password" placeholder="••••••••" />
                </div>
              </div>
              <div className="input-group">
                <label>Mật khẩu mới</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">key</span>
                  <input type="password" placeholder="Nhập mật khẩu mới" />
                </div>
              </div>
              <div className="input-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="input-with-icon">
                  <span className="material-icons-round">key</span>
                  <input type="password" placeholder="Nhập lại mật khẩu mới" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .profile-page { padding: 24px 32px; max-width: 1200px; margin: 0 auto; animation: fadeIn 0.4s ease-out; }

        .page-header { margin-bottom: 32px; }
        .header-titles h1 { font-size: 26px; font-weight: 700; color: #1e293b; margin: 0 0 8px 0; }
        .header-titles p { font-size: 15px; color: #64748b; margin: 0; }

        .profile-layout { display: grid; grid-template-columns: 300px 1fr; gap: 32px; }

        .user-overview { padding: 32px 24px; display: flex; flex-direction: column; align-items: center; text-align: center; }
        .avatar-section { position: relative; margin-bottom: 20px; }
        .avatar-circle { width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #0e74be, #3b82f6); display: flex; align-items: center; justify-content: center; color: white; border: 4px solid #eff6ff; box-shadow: 0 4px 12px rgba(14, 116, 190, 0.2); }
        .avatar-circle .material-icons-round { font-size: 64px; }
        .change-avatar-btn { position: absolute; bottom: 0; right: 0; width: 36px; height: 36px; border-radius: 50%; background: white; border: 1px solid #e2e8f0; color: #475569; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: all 0.2s; }
        .change-avatar-btn:hover { color: #0e74be; border-color: #0e74be; }

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
