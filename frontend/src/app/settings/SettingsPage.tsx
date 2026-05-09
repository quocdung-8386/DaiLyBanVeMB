import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';

interface SettingsPageProps {
  onNavigate?: (id: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('airlines');

  const airlines = [
    { id: 'VN', name: 'Vietnam Airlines', iata: 'VN', type: 'Full Service', country: 'Vietnam', status: 'active' },
    { id: 'VJ', name: 'VietJet Air', iata: 'VJ', type: 'Low Cost', country: 'Vietnam', status: 'active' },
    { id: 'QH', name: 'Bamboo Airways', iata: 'QH', type: 'Hybrid', country: 'Vietnam', status: 'active' },
  ];

  return (
    <AppLayout 
      activeItem="settings" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Hệ thống', page: 'dashboard' }, { label: 'Cấu hình hệ thống' }]}
    >
      <div className="settings-page-content">
        
        {/* ── HEADER ── */}
        <div className="page-header-flex">
          <div>
            <h1>Cấu hình & Danh mục</h1>
            <p>Quản lý dữ liệu gốc của hãng bay, sân bay và các tham số vận hành.</p>
          </div>
          <div className="action-buttons">
            <Button variant="outline"><span className="material-icons-round">backup</span> Sao lưu dữ liệu</Button>
            <Button><span className="material-icons-round">save</span> Lưu tất cả thay đổi</Button>
          </div>
        </div>

        {/* ── SETTINGS LAYOUT ── */}
        <div className="settings-grid">
          
          {/* ── SIDE NAV ── */}
          <aside className="settings-nav">
            <Card className="nav-card">
              <button className={`nav-link ${activeTab === 'airlines' ? 'active' : ''}`} onClick={() => setActiveTab('airlines')}>
                <span className="material-icons-round">flight</span>
                Hãng hàng không
              </button>
              <button className={`nav-link ${activeTab === 'airports' ? 'active' : ''}`} onClick={() => setActiveTab('airports')}>
                <span className="material-icons-round">connecting_airports</span>
                Sân bay & Nhà ga
              </button>
              <button className={`nav-link ${activeTab === 'routes' ? 'active' : ''}`} onClick={() => setActiveTab('routes')}>
                <span className="material-icons-round">route</span>
                Tuyến bay khai thác
              </button>
              <button className={`nav-link ${activeTab === 'markup' ? 'active' : ''}`} onClick={() => setActiveTab('markup')}>
                <span className="material-icons-round">payments</span>
                Cấu hình Profit & Thuế
              </button>
              <div className="divider"></div>
              <button className={`nav-link ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
                <span className="material-icons-round">settings</span>
                Cài đặt chung
              </button>
            </Card>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="settings-main">
            {activeTab === 'airlines' && (
              <Card className="settings-card">
                <div className="card-header">
                  <h3>Danh mục Hãng hàng không</h3>
                  <Button size="sm"><span className="material-icons-round">add</span> Thêm hãng</Button>
                </div>
                <div className="table-wrapper">
                  <table className="premium-table">
                    <thead>
                      <tr>
                        <th>HÃNG BAY</th>
                        <th>IATA</th>
                        <th>PHÂN LOẠI</th>
                        <th>QUỐC GIA</th>
                        <th>TRẠNG THÁI</th>
                        <th>HÀNH ĐỘNG</th>
                      </tr>
                    </thead>
                    <tbody>
                      {airlines.map(a => (
                        <tr key={a.id}>
                          <td><b>{a.name}</b></td>
                          <td><code className="mono">{a.iata}</code></td>
                          <td>{a.type}</td>
                          <td>{a.country}</td>
                          <td><span className="status-badge active">Hoạt động</span></td>
                          <td>
                            <div className="action-row">
                              <button className="icon-btn"><span className="material-icons-round">edit</span></button>
                              <button className="icon-btn delete"><span className="material-icons-round">delete</span></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeTab === 'markup' && (
              <div className="markup-settings">
                <Card className="settings-card">
                  <h3>Cấu hình Markup (Lợi nhuận đại lý)</h3>
                  <p className="description">Thiết lập mức phí dịch vụ cộng thêm vào giá vé của hãng.</p>
                  
                  <div className="config-grid">
                    <div className="config-item">
                      <label>Markup mặc định (Nội địa)</label>
                      <div className="input-group">
                        <input type="number" defaultValue={50000} />
                        <span>VNĐ / khách</span>
                      </div>
                    </div>
                    <div className="config-item">
                      <label>Markup mặc định (Quốc tế)</label>
                      <div className="input-group">
                        <input type="number" defaultValue={150000} />
                        <span>VNĐ / khách</span>
                      </div>
                    </div>
                    <div className="config-item">
                      <label>Thuế VAT (%)</label>
                      <div className="input-group">
                        <input type="number" defaultValue={10} />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  <Button className="mt-lg">Cập nhật cấu hình</Button>
                </Card>

                <Card className="settings-card mt-lg">
                  <h3>Markup theo hạng vé</h3>
                  <div className="table-wrapper">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>HẠNG VÉ</th>
                          <th>MỨC CỘNG THÊM</th>
                          <th>TRẠNG THÁI</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><b>Economy</b></td>
                          <td>50,000đ</td>
                          <td><div className="toggle active"></div></td>
                        </tr>
                        <tr>
                          <td><b>Business</b></td>
                          <td>200,000đ</td>
                          <td><div className="toggle active"></div></td>
                        </tr>
                        <tr>
                          <td><b>First Class</b></td>
                          <td>500,000đ</td>
                          <td><div className="toggle active"></div></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .settings-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header-flex h1 { font-size: 24px; color: #1e293b; }
        .page-header-flex p { font-size: 14px; color: #64748b; }
        .action-buttons { display: flex; gap: 12px; }

        .settings-grid { display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: flex-start; }
        
        .nav-card { padding: 12px; border: none; }
        .nav-link { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; background: transparent; border-radius: 10px; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; text-align: left; }
        .nav-link:hover { background: #f8fafc; color: #1e293b; }
        .nav-link.active { background: #eff6ff; color: #2563eb; }
        .nav-link .material-icons-round { font-size: 20px; }
        .divider { height: 1px; background: #f1f5f9; margin: 12px 0; }

        .settings-card { padding: 24px; border: none; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .card-header h3 { font-size: 18px; color: #1e293b; }
        
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .mono { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #475569; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
        .status-badge.active { background: #dcfce7; color: #15803d; }
        
        .action-row { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border: none; background: transparent; color: #94a3b8; cursor: pointer; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { background: #f1f5f9; color: #2563eb; }
        .icon-btn.delete:hover { color: #ef4444; }

        .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
        .config-item label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .input-group { display: flex; align-items: center; gap: 12px; }
        .input-group input { flex: 1; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 14px; }
        .input-group span { font-size: 13px; color: #94a3b8; font-weight: 600; }
        
        .mt-lg { margin-top: 24px; }
        .toggle { width: 40px; height: 20px; background: #e2e8f0; border-radius: 10px; position: relative; cursor: pointer; }
        .toggle::after { content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.2s; }
        .toggle.active { background: #10b981; }
        .toggle.active::after { left: 22px; }
        .description { font-size: 14px; color: #64748b; margin-top: 4px; }
      `}</style>
    </AppLayout>
  );
};

export default SettingsPage;
