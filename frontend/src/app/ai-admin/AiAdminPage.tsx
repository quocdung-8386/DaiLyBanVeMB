import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';

interface AiAdminPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const AiAdminPage: React.FC<AiAdminPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [activeTab, setActiveTab] = useState<'assistant' | 'prediction' | 'settings'>('assistant');

  return (
    <AppLayout 
      activeItem="ai_admin" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      breadcrumb={[{ label: 'Hệ thống', page: 'dashboard' }, { label: 'Quản trị AI & Tự động hóa' }]}
    >
      <div className="ai-admin-page-content">
        
        {/* ── HERO HEADER ── */}
        <div className="ai-hero-banner">
          <div className="ai-hero-content">
            <div className="ai-status-pill">
              <span className="pulse-dot"></span>
              CORE AI ENGINE: ONLINE
            </div>
            <h1>Intelligence Command Center</h1>
            <p>Sử dụng trí tuệ nhân tạo để tối ưu hóa giá vé, dự báo nhu cầu và tự động hóa quy trình nghiệp vụ.</p>
          </div>
          <div className="ai-hero-visual">
            <div className="neural-network-mock">
              <div className="node n1"></div>
              <div className="node n2"></div>
              <div className="node n3"></div>
              <div className="line l1"></div>
              <div className="line l2"></div>
            </div>
          </div>
        </div>

        {/* ── TABS ── */}
        <div className="ai-tabs">
          <button className={`ai-tab ${activeTab === 'assistant' ? 'active' : ''}`} onClick={() => setActiveTab('assistant')}>
            <span className="material-icons-round">psychology</span>
            <span>Trợ lý AI Chiến lược</span>
          </button>
          <button className={`ai-tab ${activeTab === 'prediction' ? 'active' : ''}`} onClick={() => setActiveTab('prediction')}>
            <span className="material-icons-round">query_stats</span>
            <span>Dự báo Nhu cầu & Giá</span>
          </button>
          <button className={`ai-tab ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <span className="material-icons-round">settings_suggest</span>
            <span>Cấu hình Model</span>
          </button>
        </div>

        {activeTab === 'assistant' && (
          <div className="ai-assistant-view">
            <div className="chat-interface">
              <Card className="chat-container">
                <div className="chat-messages">
                  <div className="msg bot">
                    <div className="bot-avatar"><span className="material-icons-round">smart_toy</span></div>
                    <div className="msg-content">
                      <p>Chào Admin! Dựa trên phân tích 24h qua, tôi nhận thấy nhu cầu bay <strong>Hà Nội - Phú Quốc</strong> đang tăng đột biến 15% cho tuần tới.</p>
                      <div className="ai-suggestion-box">
                        <p>💡 Gợi ý: Tăng Markup thêm <b>25,000đ</b> cho các booking thực hiện từ 20h - 23h.</p>
                        <Button size="sm">Áp dụng ngay</Button>
                      </div>
                    </div>
                  </div>
                  <div className="msg user">
                    <div className="msg-content">
                      <p>Cho tôi báo cáo hiệu quả của đợt khuyến mãi Vietnam Airlines vừa qua.</p>
                    </div>
                  </div>
                  <div className="msg bot">
                    <div className="bot-avatar"><span className="material-icons-round">smart_toy</span></div>
                    <div className="msg-content">
                      <p>Đang trích xuất dữ liệu...</p>
                      <div className="mini-report">
                        <div className="report-stat"><span>Vé phát hành:</span> <b>+142 vé</b></div>
                        <div className="report-stat"><span>Doanh thu:</span> <b>+215.4M</b></div>
                        <div className="report-stat"><span>Tỷ lệ lấp đầy:</span> <b>88%</b></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="chat-input-wrapper">
                  <input type="text" placeholder="Hỏi AI về chiến lược kinh doanh hoặc cấu hình tự động..." />
                  <button className="send-btn"><span className="material-icons-round">send</span></button>
                </div>
              </Card>
            </div>
            
            <aside className="ai-side-panel">
              <Card className="ai-stat-card">
                <h3>Độ chính xác Model</h3>
                <div className="gauge-wrap">
                  <svg viewBox="0 0 100 50">
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="8"></path>
                    <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#2563eb" strokeWidth="8" strokeDasharray="125 125" strokeDashoffset="25"></path>
                  </svg>
                  <div className="gauge-val">94.2%</div>
                </div>
                <p>Mô hình <b>Dynamic Pricing v2.4</b> đang hoạt động ổn định.</p>
              </Card>
              
              <Card className="ai-automation-list">
                <h3>Tự động hóa đang bật</h3>
                <div className="auto-item">
                  <div className="info">
                    <p>Cân bằng Markup</p>
                    <span>Tự điều chỉnh theo giá sàn</span>
                  </div>
                  <div className="toggle active"></div>
                </div>
                <div className="auto-item">
                  <div className="info">
                    <p>Thông báo PNR sắp hết hạn</p>
                    <span>Gửi SMS nhắc khách tự động</span>
                  </div>
                  <div className="toggle active"></div>
                </div>
                <div className="auto-item">
                  <div className="info">
                    <p>Quét giá cạnh tranh</p>
                    <span>Cập nhật mỗi 15 phút</span>
                  </div>
                  <div className="toggle"></div>
                </div>
              </Card>
            </aside>
          </div>
        )}
      </div>

      <style>{`
        .ai-admin-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .ai-hero-banner { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px; border-radius: 20px; margin-bottom: 24px; color: white; border: 1px solid rgba(255,255,255,0.1); position: relative; overflow: hidden; }
        .ai-status-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 20px; }
        .pulse-dot { width: 8px; height: 8px; background: #10b981; border-radius: 50%; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
        .ai-hero-content h1 { font-size: 32px; margin-bottom: 12px; }
        .ai-hero-content p { font-size: 15px; color: #94a3b8; max-width: 500px; line-height: 1.6; }
        
        .ai-tabs { display: flex; gap: 12px; margin-bottom: 24px; }
        .ai-tab { flex: 1; display: flex; align-items: center; justify-content: center; gap: 12px; padding: 16px; border: none; border-radius: 12px; background: white; color: #64748b; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
        .ai-tab.active { background: #2563eb; color: white; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
        .ai-tab .material-icons-round { font-size: 24px; }

        .ai-assistant-view { display: grid; grid-template-columns: 1fr 340px; gap: 24px; height: 600px; }
        .chat-interface { height: 100%; }
        .chat-container { height: 100%; padding: 0; display: flex; flex-direction: column; overflow: hidden; border: none; }
        .chat-messages { flex: 1; padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; background: #fdfdfd; }
        .msg { display: flex; gap: 14px; max-width: 80%; }
        .msg.bot { align-self: flex-start; }
        .msg.user { align-self: flex-end; flex-direction: row-reverse; }
        .bot-avatar { width: 36px; height: 36px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; }
        .msg-content { padding: 14px 18px; border-radius: 16px; font-size: 14px; line-height: 1.6; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .msg.bot .msg-content { background: white; color: #1e293b; border-top-left-radius: 4px; }
        .msg.user .msg-content { background: #1e293b; color: white; border-top-right-radius: 4px; }
        
        .ai-suggestion-box { margin-top: 12px; background: #f0f7ff; border: 1px solid #dbeafe; padding: 12px; border-radius: 12px; }
        .ai-suggestion-box p { font-size: 13px; color: #1e40af; margin-bottom: 10px; }
        
        .mini-report { margin-top: 10px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .report-stat { background: #f8fafc; padding: 8px 12px; border-radius: 8px; font-size: 12px; display: flex; flex-direction: column; }
        .report-stat b { font-size: 14px; color: #1e293b; }

        .chat-input-wrapper { padding: 20px 24px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; background: white; }
        .chat-input-wrapper input { flex: 1; border: 1px solid #e2e8f0; border-radius: 30px; padding: 12px 20px; font-size: 14px; outline: none; }
        .send-btn { width: 44px; height: 44px; border-radius: 50%; background: #2563eb; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

        .ai-stat-card { padding: 24px; text-align: center; border: none; }
        .gauge-wrap { position: relative; width: 160px; margin: 20px auto; }
        .gauge-val { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 24px; font-weight: 800; color: #1e293b; }
        .ai-stat-card h3 { font-size: 15px; color: #64748b; margin-bottom: 10px; }
        .ai-stat-card p { font-size: 13px; color: #64748b; margin-top: 12px; line-height: 1.5; }

        .ai-automation-list { padding: 20px; border: none; }
        .ai-automation-list h3 { font-size: 15px; color: #1e293b; margin-bottom: 16px; }
        .auto-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f1f5f9; }
        .auto-item:last-child { border-bottom: none; }
        .auto-item .info p { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 2px; }
        .auto-item .info span { font-size: 11px; color: #94a3b8; }
        .toggle { width: 40px; height: 20px; background: #e2e8f0; border-radius: 10px; position: relative; cursor: pointer; transition: all 0.2s; }
        .toggle::after { content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: all 0.2s; }
        .toggle.active { background: #10b981; }
        .toggle.active::after { left: 22px; }
      `}</style>
    </AppLayout>
  );
};

export default AiAdminPage;
