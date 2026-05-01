import React, { useState } from 'react';

interface LoginPageProps {
  onNavigate?: (page: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="login-container">
      {/* ─── Left Panel (Branding) ─── */}
      <div className="login-left">
        <div className="login-brand">
          <span className="material-icons-round">flight_takeoff</span>
          <span>Skyward Portal</span>
        </div>
        
        <div className="login-hero">
          <h1>Nâng tầm quản lý,<br/>tối ưu vận hành.</h1>
          <p>Hệ thống quản lý vé máy bay tin cậy, an toàn và hiệu quả hàng đầu.</p>
        </div>

        <div className="login-stats">
          <div className="stat-item">
            <span className="stat-value">99.9%</span>
            <span className="stat-label">ĐỘ TIN CẬY THỜI GIAN HOẠT ĐỘNG</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">256-bit</span>
            <span className="stat-label">TIÊU CHUẨN MÃ HÓA</span>
          </div>
        </div>
      </div>

      {/* ─── Right Panel (Form) ─── */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-card">
            <h2>Hệ thống Quản lý Đại lý Bán vé<br/>Máy bay</h2>
            <p className="login-subtitle">Yêu cầu thực thi giao thức. Vui lòng xác thực.</p>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>TÊN ĐĂNG NHẬP HOẶC EMAIL</label>
                <div className="input-with-icon">
                  <span className="material-icons-round icon-left">person_outline</span>
                  <input 
                    type="email" 
                    placeholder="abc@gmail.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>MẬT KHẨU</label>
                <div className="input-with-icon">
                  <span className="material-icons-round icon-left">lock_outline</span>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span 
                    className="material-icons-round icon-right cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </div>
              </div>

              <div className="form-actions-row">
                <label className="checkbox-container">
                  <input type="checkbox" />
                  <span className="checkmark"></span>
                  Ghi nhớ đăng nhập
                </label>
                <a href="#" className="forgot-password">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="btn-login">
                Đăng nhập <span className="material-icons-round">login</span>
              </button>
            </form>

            <div className="support-section">
              <p>Bạn cần hỗ trợ kỹ thuật?</p>
              <div className="support-buttons">
                <button className="btn-outline">
                  <span className="material-icons-round">help_outline</span> Trung tâm hỗ trợ
                </button>
                <button className="btn-outline">
                  <span className="material-icons-round">language</span> Khu vực
                </button>
              </div>
            </div>
          </div>

          <p className="security-notice">
            CHỈ DÀNH CHO NHÂN VIÊN ĐƯỢC ỦY Q. MỌI TRUY CẬP ĐỀU ĐƯỢC<br/>GHI NHẬT KÝ VÀ GIÁM SÁT.
          </p>
        </div>
      </div>

      <style>{`
        .login-container {
          display: flex;
          min-height: 100vh;
          width: 100%;
          background: #f8fafc;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          box-sizing: border-box;
        }

        /* ─── Left Panel ─── */
        .login-left {
          flex: 1;
          background: linear-gradient(180deg, rgba(14, 116, 190, 0.9) 0%, rgba(14, 116, 190, 0.95) 100%), url('https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=2070&auto=format&fit=crop') center/cover no-repeat;
          color: white;
          padding: 80px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          position: relative;
        }

        .login-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
          font-weight: 700;
          letter-spacing: -0.5px;
        }
        
        .login-brand .material-icons-round {
          font-size: 32px;
        }

        .login-hero h1 {
          font-size: 46px;
          line-height: 1.25;
          font-weight: 700;
          margin: 0 0 24px 0;
          letter-spacing: -1px;
        }

        .login-hero p {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.85);
          max-width: 420px;
          line-height: 1.6;
          margin: 0;
        }

        .login-stats {
          display: flex;
          gap: 40px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }

        .stat-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 1px;
        }

        /* ─── Right Panel ─── */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .login-form-wrapper {
          width: 100%;
          max-width: 440px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .login-card {
          background: white;
          width: 100%;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.04);
          padding: 48px;
          box-sizing: border-box;
          margin-bottom: 32px;
        }

        .login-card h2 {
          font-size: 22px;
          font-weight: 700;
          color: #1e293b;
          margin: 0 0 10px 0;
          line-height: 1.35;
          letter-spacing: -0.3px;
        }

        .login-subtitle {
          font-size: 13.5px;
          color: #64748b;
          margin: 0 0 32px 0;
        }

        .form-group {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 11px;
          font-weight: 700;
          color: #475569;
          letter-spacing: 0.5px;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-with-icon .icon-left {
          position: absolute;
          left: 14px;
          color: #94a3b8;
          font-size: 20px;
        }

        .input-with-icon .icon-right {
          position: absolute;
          right: 14px;
          color: #94a3b8;
          font-size: 20px;
          transition: color 0.2s;
        }
        
        .input-with-icon .icon-right.cursor-pointer:hover {
          color: #0e74be;
        }

        .input-with-icon input {
          width: 100%;
          padding: 13px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14.5px;
          color: #1e293b;
          outline: none;
          transition: all 0.2s;
          box-sizing: border-box;
          font-family: inherit;
        }

        .input-with-icon input:focus {
          border-color: #0e74be;
          box-shadow: 0 0 0 3px rgba(14, 116, 190, 0.1);
        }

        .input-with-icon input::placeholder {
          color: #cbd5e1;
        }

        .form-actions-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #64748b;
          cursor: pointer;
        }

        .forgot-password {
          font-size: 13px;
          font-weight: 600;
          color: #0e74be;
          text-decoration: none;
        }

        .forgot-password:hover {
          text-decoration: underline;
        }

        .btn-login {
          width: 100%;
          background: #0e74be;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s;
          margin-bottom: 40px;
        }

        .btn-login:hover {
          background: #0b5a94;
        }

        .btn-login .material-icons-round {
          font-size: 18px;
        }

        .support-section {
          text-align: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 24px;
        }

        .support-section p {
          font-size: 13px;
          color: #64748b;
          margin: 0 0 16px 0;
        }

        .support-buttons {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn-outline {
          display: flex;
          align-items: center;
          gap: 6px;
          background: white;
          border: 1px solid #e2e8f0;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-outline:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
          color: #1e293b;
        }

        .btn-outline .material-icons-round {
          font-size: 16px;
        }

        .security-notice {
          text-align: center;
          font-size: 10.5px;
          color: #94a3b8;
          line-height: 1.6;
          letter-spacing: 0.8px;
          margin: 0;
          text-transform: uppercase;
        }

        @media (max-width: 900px) {
          .login-container {
            flex-direction: column;
          }
          
          .login-left {
            padding: 40px;
            flex: none;
            height: auto;
          }

          .login-hero h1 {
            font-size: 32px;
          }
          
          .login-right {
            padding: 20px;
          }

          .login-card {
            padding: 30px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
