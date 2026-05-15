import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout, { showToast } from '../../components/AppLayout';
import AirlinesTab from './AirlinesTab';
import AirportsTab from './AirportsTab';
import RoutesTab from './RoutesTab';
import MarkupTab from './MarkupTab';
import GeneralTab from './GeneralTab';

interface SettingsPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [activeTab, setActiveTab] = useState('airlines');
  const handleSaveAll = () => {
    showToast('Đã lưu tất cả thay đổi trên hệ thống!', 'success');
  };

  return (
    <AppLayout 
      activeItem="settings" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      bookings={[]}
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
            <Button onClick={handleSaveAll}><span className="material-icons-round">save</span> Lưu tất cả thay đổi</Button>
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
            {activeTab === 'airlines' && <AirlinesTab />}
            {activeTab === 'airports' && <AirportsTab />}
            {activeTab === 'routes' && <RoutesTab />}
            {activeTab === 'markup' && <MarkupTab />}
            {activeTab === 'general' && <GeneralTab />}
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
        
        .nav-card { padding: 12px; border: none; position: sticky; top: 0; }
        .nav-link { width: 100%; display: flex; align-items: center; gap: 12px; padding: 12px 16px; border: none; background: transparent; border-radius: 10px; font-size: 14px; font-weight: 600; color: #64748b; cursor: pointer; transition: all 0.2s; text-align: left; }
        .nav-link:hover { background: #f8fafc; color: #1e293b; }
        .nav-link.active { background: #eff6ff; color: #2563eb; }
        .nav-link .material-icons-round { font-size: 20px; }
        .divider { height: 1px; background: #f1f5f9; margin: 12px 0; }

        .settings-card { padding: 24px; border: none; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .card-header h3 { font-size: 18px; color: #1e293b; margin: 0; }
        
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .mono { font-family: monospace; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; color: #475569; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; }
        .status-badge.active { background: #dcfce7; color: #15803d; }
        .status-badge.inactive { background: #f1f5f9; color: #64748b; }
        
        .action-row { display: flex; gap: 8px; }
        .icon-btn { width: 32px; height: 32px; border: none; background: transparent; color: #94a3b8; cursor: pointer; border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .icon-btn:hover { background: #f1f5f9; color: #2563eb; }
        .icon-btn.delete:hover { color: #ef4444; background: #fef2f2; }

        .config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
        .config-item label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .input-group { display: flex; align-items: center; gap: 12px; }
        .input-group input { flex: 1; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; font-size: 14px; }
        .input-group span { font-size: 13px; color: #94a3b8; font-weight: 600; }
        
        .mt-md { margin-top: 16px; }
        .mt-lg { margin-top: 24px; }
        .mb-lg { margin-bottom: 24px; }

        .toggle { width: 40px; height: 20px; background: #e2e8f0; border-radius: 10px; position: relative; cursor: pointer; }
        .toggle::after { content: ''; position: absolute; left: 2px; top: 2px; width: 16px; height: 16px; background: white; border-radius: 50%; transition: 0.2s; }
        .toggle.active { background: #10b981; }
        .toggle.active::after { left: 22px; }
        .description { font-size: 14px; color: #64748b; margin-top: 4px; }

        /* Form & Modal Styles */
        .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); z-index: 1000; display: flex; justify-content: center; align-items: center; animation: fadeIn 0.2s ease-out; }
        .modal-card { background: white; border-radius: 20px; width: 100%; max-width: 500px; padding: 32px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); }
        .modal-card h3 { font-size: 20px; font-weight: 800; color: #0f172a; margin-bottom: 24px; margin-top: 0; }
        .form-group { margin-bottom: 16px; }
        .form-group-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group label { display: block; font-size: 13px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .input-field { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 10px; font-size: 14px; color: #1e293b; background: #f8fafc; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #2563eb; background: white; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 32px; }


      `}</style>
    </AppLayout>
  );
};

export default SettingsPage;

