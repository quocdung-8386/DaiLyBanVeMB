import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';

interface AiAdminPageProps {
  onNavigate: (page: string) => void;
}

const AiAdminPage: React.FC<AiAdminPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'config'>('recommendations');

  const mockRecommendations = [
    { customer: 'Nguyễn Văn A', history: ['HAN→SGN', 'SGN→DAD'], suggested: 'VN123 - 01/07/2026', confidence: 92 },
    { customer: 'Trần Thị B', history: ['SGN→HAN'], suggested: 'VJ456 - 05/07/2026', confidence: 85 },
    { customer: 'Lê Văn C', history: ['HAN→SGN', 'HAN→DAD', 'HAN→PQC'], suggested: 'QH112 - 08/07/2026', confidence: 78 },
  ];

  return (
    <AppLayout activeItem="ai-admin" onNavigate={onNavigate} breadcrumb={[{ label: 'Quản Trị AI' }]}>
      <div className="ai-admin-page">
        <div className="page-header">
          <div className="header-titles">
            <div className="ai-badge">
              <span className="material-icons-round">smart_toy</span>
              <span>AI Admin</span>
            </div>
            <h1>Quản Trị Hệ Thống AI</h1>
            <p>Cấu hình và theo dõi AI gợi ý, chatbot hỗ trợ khách hàng</p>
          </div>
          <div className="ai-status-card">
            <div className="status-dot active"></div>
            <span>AI Engine đang hoạt động</span>
          </div>
        </div>

        <div className="tab-bar">
          {[
            { key: 'recommendations', label: 'Gợi ý chuyến bay', icon: 'recommend' },
            { key: 'config', label: 'Cấu hình AI', icon: 'tune' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key as any)}
            >
              <span className="material-icons-round">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'recommendations' && (
          <div className="tab-content">
            <div className="metrics-row">
              {[
                { label: 'Khách có lịch sử tìm kiếm', value: '3,281', icon: 'people' },
                { label: 'Gợi ý đã gửi hôm nay', value: '428', icon: 'send' },
                { label: 'Tỷ lệ chuyển đổi', value: '18.4%', icon: 'trending_up' },
              ].map((m, i) => (
                <Card key={i} className="mini-stat">
                  <span className="material-icons-round" style={{ color: '#0e74be' }}>{m.icon}</span>
                  <div>
                    <p className="stat-label">{m.label}</p>
                    <h3 className="stat-value">{m.value}</h3>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="rec-table-card">
              <h3>Danh sách gợi ý cá nhân hóa</h3>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Lịch sử tìm kiếm</th>
                    <th>AI gợi ý</th>
                    <th>Độ tin cậy</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRecommendations.map((r, i) => (
                    <tr key={i}>
                      <td className="font-semibold">{r.customer}</td>
                      <td>
                        <div className="tag-list">
                          {r.history.map((h, j) => (
                            <span key={j} className="route-tag">{h}</span>
                          ))}
                        </div>
                      </td>
                      <td className="suggested-flight">{r.suggested}</td>
                      <td>
                        <div className="confidence-bar-wrap">
                          <div className="confidence-bar" style={{ width: `${r.confidence}%` }}></div>
                          <span>{r.confidence}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn-send-rec">
                          <span className="material-icons-round">send</span> Gửi gợi ý
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}

        {activeTab === 'config' && (
          <Card className="config-card">
            <h3>Cấu hình tham số AI</h3>
            <div className="config-grid">
              <div className="config-item">
                <label>Ngưỡng độ tin cậy gợi ý (%)</label>
                <input type="number" defaultValue={75} min={0} max={100} />
                <small>Gợi ý chỉ được gửi khi AI đạt ngưỡng này</small>
              </div>
              <div className="config-item">
                <label>Số lịch sử tìm kiếm lưu tối đa</label>
                <input type="number" defaultValue={50} />
                <small>Số lần tìm kiếm cuối cùng để AI phân tích</small>
              </div>
              <div className="config-item">
                <label>Kênh gửi gợi ý</label>
                <select defaultValue="email">
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="both">Cả hai</option>
                </select>
              </div>
              <div className="config-item">
                <label>Trạng thái Chatbot</label>
                <select defaultValue="on">
                  <option value="on">Đang bật</option>
                  <option value="off">Tắt</option>
                  <option value="test">Chế độ test</option>
                </select>
              </div>
            </div>
            <button className="btn-save-config">
              <span className="material-icons-round">save</span>
              Lưu cấu hình
            </button>
          </Card>
        )}
      </div>

      <style>{`
        .ai-admin-page { padding: 24px 32px; animation: fadeIn 0.4s ease-out; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
        .ai-badge { display: inline-flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #0e74be, #3b82f6); color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 8px; }
        .ai-badge .material-icons-round { font-size: 16px; }
        .header-titles h1 { font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 6px 0; }
        .header-titles p { font-size: 14px; color: #64748b; margin: 0; }
        .ai-status-card { display: flex; align-items: center; gap: 8px; padding: 12px 20px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 10px; font-size: 14px; font-weight: 600; color: #166534; }
        .status-dot.active { width: 10px; height: 10px; border-radius: 50%; background: #10b981; box-shadow: 0 0 0 3px #d1fae5; }

        .tab-bar { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 16px; }
        .tab-btn { display: flex; align-items: center; gap: 8px; padding: 10px 20px; background: transparent; border: none; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; border-radius: 8px; transition: all 0.2s; font-family: inherit; }
        .tab-btn:hover { background: #f1f5f9; color: #1e293b; }
        .tab-btn.active { background: #eff6ff; color: #0e74be; }

        .metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }
        .mini-stat { display: flex; align-items: center; gap: 16px; padding: 20px 24px; }
        .mini-stat .material-icons-round { font-size: 32px; }
        .stat-label { font-size: 12px; font-weight: 600; color: #64748b; margin: 0 0 4px 0; text-transform: uppercase; }
        .stat-value { font-size: 22px; font-weight: 800; color: #1e293b; margin: 0; }

        .rec-table-card { padding: 24px; }
        .rec-table-card h3 { font-size: 16px; font-weight: 700; color: #1e293b; margin: 0 0 20px 0; }
        .data-table { width: 100%; border-collapse: collapse; }
        .data-table th { text-align: left; padding: 12px 16px; font-size: 12px; font-weight: 700; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #f8fafc; text-transform: uppercase; }
        .data-table td { padding: 16px; font-size: 14px; color: #1e293b; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .font-semibold { font-weight: 600; }
        .tag-list { display: flex; gap: 6px; flex-wrap: wrap; }
        .route-tag { background: #eff6ff; color: #0e74be; padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: 700; font-family: monospace; }
        .suggested-flight { color: #10b981; font-weight: 600; }
        .confidence-bar-wrap { display: flex; align-items: center; gap: 8px; }
        .confidence-bar { height: 6px; background: linear-gradient(90deg, #0e74be, #10b981); border-radius: 3px; transition: width 1s; }
        .confidence-bar-wrap span { font-size: 13px; font-weight: 700; color: #1e293b; min-width: 35px; }
        .btn-send-rec { display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: #eff6ff; color: #0e74be; border: none; border-radius: 6px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; font-family: inherit; }
        .btn-send-rec:hover { background: #dbeafe; }

        /* Config */
        .config-card { padding: 28px; }
        .config-card h3 { font-size: 18px; font-weight: 700; color: #1e293b; margin: 0 0 24px 0; }
        .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 28px; }
        .config-item { display: flex; flex-direction: column; gap: 8px; }
        .config-item label { font-size: 13px; font-weight: 600; color: #475569; }
        .config-item input, .config-item select { padding: 10px 14px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 14px; font-family: inherit; outline: none; width: 100%; box-sizing: border-box; }
        .config-item input:focus, .config-item select:focus { border-color: #0e74be; }
        .config-item small { font-size: 12px; color: #94a3b8; }
        .btn-save-config { display: flex; align-items: center; gap: 8px; padding: 12px 28px; background: #0e74be; color: white; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; }
        .btn-save-config:hover { background: #0b5a94; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default AiAdminPage;
