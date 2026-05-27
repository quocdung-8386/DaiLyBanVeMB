import React, { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';
import { api } from '../../api';
import { aiChatStore, ChatMessage } from '../../store/aiChatStore';

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
  const [messages, setMessages] = useState<ChatMessage[]>(aiChatStore.getMessages());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // AI Configuration States
  const [aiConfig, setAiConfig] = useState<{ has_key: boolean; api_key_masked: string; model_name: string }>({
    has_key: false,
    api_key_masked: '',
    model_name: 'gemini-2.5-flash'
  });
  const [newApiKey, setNewApiKey] = useState('');
  const [newModelName, setNewModelName] = useState('gemini-2.5-flash');
  const [showApiKey, setShowApiKey] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = aiChatStore.subscribe(setMessages);
    return unsubscribe;
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConfig = async () => {
    try {
      const config = await api.getAiConfig();
      setAiConfig(config);
      setNewModelName(config.model_name);
    } catch (error) {
      console.error("Failed to fetch AI configuration:", error);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  useEffect(() => {
    if (activeTab === 'prediction' && !predictionData) {
      fetchPredictions();
    }
  }, [activeTab]);

  const fetchPredictions = async () => {
    setIsPredicting(true);
    setPredictionData(null); // Clear old data to show loading
    try {
      const data = await api.getAiPrediction();
      setPredictionData(data);
    } catch (error) {
      console.error("Failed to fetch predictions:", error);
      setPredictionData({ summary: "Lỗi khi tải dự báo từ AI. Vui lòng thử lại.", predictions: [] });
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setInputText('');
    aiChatStore.addMessage({ id: Date.now(), role: 'user', text: userMsg });
    setIsLoading(true);

    try {
      const res = await api.aiChat(userMsg);
      aiChatStore.addMessage({ id: Date.now() + 1, role: 'bot', text: res.response });
    } catch (error) {
      aiChatStore.addMessage({ id: Date.now() + 1, role: 'bot', text: 'Lỗi kết nối máy chủ AI. Vui lòng kiểm tra API Key hoặc backend.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAction = async (p: any, idx: number) => {
    if (!p.action_id) return;
    setActionLoading(`${idx}`);
    try {
      const res = await api.aiAction(p.action_id, p.params);
      alert(res.message || "Đã áp dụng thành công!");
    } catch (error) {
      alert("Lỗi khi thực hiện hành động.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleSaveConfig = async () => {
    if (!newApiKey.trim() && !aiConfig.has_key) {
      alert("Vui lòng điền GEMINI_API_KEY!");
      return;
    }
    setConfigSaving(true);
    try {
      const res = await api.updateAiConfig(newApiKey, newModelName);
      alert(res.message || "Đã cấu hình thành công!");
      setNewApiKey('');
      await fetchConfig();
    } catch (error) {
      console.error("Failed to save config:", error);
      alert("Có lỗi xảy ra khi lưu cấu hình.");
    } finally {
      setConfigSaving(false);
    }
  };

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
            <div 
              className="ai-status-pill" 
              style={{ 
                background: aiConfig.has_key ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                color: aiConfig.has_key ? '#10b981' : '#f59e0b', 
                border: aiConfig.has_key ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(245, 158, 11, 0.2)' 
              }}
            >
              <span className="pulse-dot" style={{ backgroundColor: aiConfig.has_key ? '#10b981' : '#f59e0b' }}></span>
              CORE AI ENGINE: {aiConfig.has_key ? 'ONLINE' : 'OFFLINE FALLBACK'}
            </div>
            <h1>Intelligence Command Center</h1>
            <p>Sử dụng trí tuệ nhân tạo để tối ưu hóa giá vé, dự báo nhu cầu và tự động hóa quy trình nghiệp vụ dựa trên dữ liệu thực tế.</p>
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
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`msg ${msg.role}`}>
                      {msg.role === 'bot' && (
                        <div className="bot-avatar"><span className="material-icons-round">smart_toy</span></div>
                      )}
                      <div className="msg-content">
                        {msg.role === 'bot' ? (
                          <div dangerouslySetInnerHTML={{
                            __html: msg.text
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:12px">$1</code>')
                              .replace(/\n/g, '<br/>')
                          }} />
                        ) : (
                          <p>{msg.text}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="msg bot">
                      <div className="bot-avatar"><span className="material-icons-round">smart_toy</span></div>
                      <div className="msg-content loading-dots">
                        <span>.</span><span>.</span><span>.</span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <div className="chat-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Hỏi AI về chiến lược kinh doanh..." 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button className="send-btn" onClick={handleSend} disabled={isLoading}>
                    <span className="material-icons-round">send</span>
                  </button>
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
                  <div className="gauge-val">{aiConfig.has_key ? '94.2%' : '80.0%'}</div>
                </div>
                <p>
                  Mô hình <b>{aiConfig.has_key ? aiConfig.model_name : 'Offline Fallback'}</b> đang hoạt động.
                </p>
              </Card>
              
              <Card className="ai-automation-list">
                <h3>Tự động hóa đang bật</h3>
                <div className="auto-item">
                  <div className="info"><p>Cân bằng Markup</p><span>Tự điều chỉnh theo giá sàn</span></div>
                  <div className="toggle active"></div>
                </div>
                <div className="auto-item">
                  <div className="info"><p>Quét giá cạnh tranh</p><span>Cập nhật mỗi 15 phút</span></div>
                  <div className="toggle"></div>
                </div>
              </Card>
            </aside>
          </div>
        )}

        {activeTab === 'prediction' && (
          <div className="ai-prediction-view">
            <Card className="prediction-main-card">
              <div className="card-header-with-action">
                <div>
                  <h2>Dự báo Nhu cầu & Gợi ý Giá</h2>
                  <p>Phân tích xu hướng thị trường và dữ liệu lịch sử để đưa ra đề xuất kinh doanh.</p>
                </div>
                <Button variant="outline" onClick={fetchPredictions} disabled={isPredicting}>
                  <span className="material-icons-round">{isPredicting ? 'sync' : 'refresh'}</span>
                  {isPredicting ? 'Đang phân tích...' : 'Cập nhật dự báo'}
                </Button>
              </div>

              {isPredicting ? (
                <div className="prediction-loading">
                  <div className="loader"></div>
                  <p>Đang sử dụng AI để phân tích dữ liệu hệ thống...</p>
                </div>
              ) : predictionData ? (
                <div className="prediction-results">
                  <div className="prediction-summary-box">
                    <span className="material-icons-round">lightbulb</span>
                    <p>{predictionData.summary}</p>
                  </div>
                  <div className="prediction-grid">
                    {predictionData.predictions.map((p: any, i: number) => (
                      <div key={i} className="prediction-item">
                        <div className="p-route">
                          <span className="material-icons-round">flight_takeoff</span>
                          {p.route}
                        </div>
                        <div className={`p-trend ${p.trend?.includes('Tăng') ? 'up' : 'down'}`}>
                          {p.trend}
                        </div>
                        <div className="p-reason"><strong>Lý do:</strong> {p.reason}</div>
                        <div className="p-suggestion"><strong>Hành động:</strong> {p.suggestion}</div>
                        {p.action_id && (
                          <Button 
                            className="p-apply-btn" 
                            size="sm" 
                            fullWidth
                            onClick={() => handleApplyAction(p, i)}
                            disabled={actionLoading === `${i}`}
                          >
                            {actionLoading === `${i}` ? 'Đang áp dụng...' : 'Áp dụng ngay'}
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="prediction-empty">
                  <p>Bấm "Cập nhật dự báo" để bắt đầu phân tích dữ liệu.</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="ai-settings-view">
            <div className="settings-grid">
              <Card className="settings-card">
                <h3>Cấu hình Model AI</h3>
                
                <div className="status-indicator-box" style={{ padding: '16px', borderRadius: '12px', background: aiConfig.has_key ? '#f0fdf4' : '#fffbeb', border: aiConfig.has_key ? '1px solid #bbf7d0' : '1px solid #fef3c7', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="material-icons-round" style={{ color: aiConfig.has_key ? '#16a34a' : '#d97706', fontSize: '28px' }}>
                    {aiConfig.has_key ? 'check_circle' : 'warning'}
                  </span>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: aiConfig.has_key ? '#14532d' : '#78350f' }}>
                      {aiConfig.has_key ? 'Đã cấu hình GEMINI_API_KEY' : 'Chưa cấu hình GEMINI_API_KEY'}
                    </h4>
                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: aiConfig.has_key ? '#166534' : '#92400e' }}>
                      {aiConfig.has_key 
                        ? `Khóa hiện tại: ${aiConfig.api_key_masked} (Model: ${aiConfig.model_name})` 
                        : 'Vui lòng nhập API Key để kích hoạt đầy đủ tính năng thông minh.'}
                    </p>
                  </div>
                </div>

                <div className="setting-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>GEMINI_API_KEY</label>
                  <div className="input-group-with-toggle" style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type={showApiKey ? "text" : "password"} 
                      className="input-field" 
                      placeholder={aiConfig.has_key ? "Nhập khóa mới để ghi đè..." : "Nhập khóa Google Gemini API Key của bạn..."} 
                      value={newApiKey}
                      onChange={(e) => setNewApiKey(e.target.value)}
                      style={{ flex: 1, padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none' }}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowApiKey(!showApiKey)}
                      style={{ border: '1px solid #e2e8f0', background: 'white', borderRadius: '10px', padding: '0 12px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      <span className="material-icons-round" style={{ fontSize: '20px', color: '#64748b' }}>
                        {showApiKey ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="setting-group" style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>Mô hình ngôn ngữ (LLM)</label>
                  <select 
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', outline: 'none', background: 'white' }}
                  >
                    <option value="gemini-2.5-flash">Google Gemini 2.5 Flash ✅ (Hiện tại)</option>
                    <option value="gemini-3.5-flash">Google Gemini 3.5 Flash ⭐ (Khuyến nghị)</option>
                    <option value="gemini-3-flash-preview">Google Gemini 3 Flash Preview</option>
                    <option value="gemini-2.0-flash">Google Gemini 2.0 Flash</option>
                    <option value="gemini-2.5-pro">Google Gemini 2.5 Pro (Nâng cao)</option>
                  </select>
                </div>

                <Button 
                  onClick={handleSaveConfig} 
                  disabled={configSaving} 
                  fullWidth
                >
                  {configSaving ? 'Đang lưu...' : 'Lưu cấu hình'}
                </Button>
              </Card>

              <Card className="settings-card">
                <h3>Nguồn dữ liệu Training</h3>
                <div className="data-source-list">
                  <div className="source-item">
                    <input type="checkbox" defaultChecked />
                    <div className="source-info"><p>Dữ liệu Bán vé</p><span>Đã kết nối</span></div>
                  </div>
                  <div className="source-item">
                    <input type="checkbox" defaultChecked />
                    <div className="source-info"><p>Dữ liệu Chuyến bay</p><span>Đã kết nối</span></div>
                  </div>
                </div>
                <Button variant="outline" fullWidth>Đồng bộ thủ công</Button>
              </Card>
            </div>
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
        .msg { display: flex; gap: 14px; max-width: 85%; }
        .msg.bot { align-self: flex-start; }
        .msg.user { align-self: flex-end; flex-direction: row-reverse; }
        .bot-avatar { width: 36px; height: 36px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .msg-content { padding: 14px 18px; border-radius: 16px; font-size: 14px; line-height: 1.6; box-shadow: 0 4px 12px rgba(0,0,0,0.05); white-space: pre-wrap; }
        .msg.bot .msg-content { background: white; color: #1e293b; border-top-left-radius: 4px; }
        .msg.user .msg-content { background: #1e293b; color: white; border-top-right-radius: 4px; }
        
        .loading-dots { display: flex; gap: 4px; }
        .loading-dots span { animation: blink 1.4s infinite both; font-size: 24px; line-height: 1; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }

        .chat-input-wrapper { padding: 20px 24px; border-top: 1px solid #f1f5f9; display: flex; gap: 12px; background: white; }
        .chat-input-wrapper input { flex: 1; border: 1px solid #e2e8f0; border-radius: 30px; padding: 12px 20px; font-size: 14px; outline: none; }
        .send-btn { width: 44px; height: 44px; border-radius: 50%; background: #2563eb; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .send-btn:disabled { background: #94a3b8; cursor: not-allowed; }

        .prediction-main-card { padding: 24px; border: none; }
        .card-header-with-action { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .prediction-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 0; }
        .loader { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #2563eb; border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 16px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .prediction-summary-box { background: #f0f7ff; border: 1px solid #dbeafe; padding: 20px; border-radius: 12px; display: flex; gap: 16px; margin-bottom: 24px; }
        .prediction-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
        .prediction-item { background: white; border: 1px solid #f1f5f9; padding: 20px; border-radius: 16px; transition: all 0.2s; }
        .p-route { display: flex; align-items: center; gap: 8px; font-weight: 700; margin-bottom: 12px; }
        .p-trend { display: inline-block; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; margin-bottom: 12px; }
        .p-trend.up { background: #ecfdf5; color: #059669; }
        .p-trend.down { background: #fef2f2; color: #dc2626; }
        .p-reason, .p-suggestion { font-size: 13px; color: #64748b; margin-bottom: 8px; line-height: 1.5; }
        .p-apply-btn { margin-top: 12px; }

        .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .settings-card { padding: 24px; border: none; }
        .setting-group { margin-bottom: 20px; }
        .setting-group label { display: block; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
        .setting-group select { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; }
        
        .data-source-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
        .source-item { display: flex; gap: 12px; align-items: center; padding: 12px; background: #f8fafc; border-radius: 10px; }
        .source-info p { font-size: 13px; font-weight: 700; }
        .source-info span { font-size: 11px; color: #94a3b8; }

        .ai-automation-list h3 { margin-bottom: 16px; font-size: 14px; font-weight: 700; }
        .auto-item { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: #f8fafc; border-radius: 10px; margin-bottom: 10px; }
        .auto-item .info p { font-size: 13px; font-weight: 700; margin: 0; }
        .auto-item .info span { font-size: 11px; color: #94a3b8; }
        .auto-item .toggle { width: 40px; height: 22px; border-radius: 11px; background: #e2e8f0; position: relative; flex-shrink: 0; cursor: pointer; transition: background 0.2s; }
        .auto-item .toggle::after { content: ''; position: absolute; width: 16px; height: 16px; border-radius: 50%; background: white; top: 3px; left: 3px; transition: transform 0.2s; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
        .auto-item .toggle.active { background: #2563eb; }
        .auto-item .toggle.active::after { transform: translateX(18px); }

        .ai-stat-card { padding: 24px; text-align: center; border: none; }
        .gauge-wrap { position: relative; width: 140px; margin: 10px auto; }
        .gauge-val { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); font-size: 20px; font-weight: 800; }
      `}</style>
    </AppLayout>
  );
};

export default AiAdminPage;
