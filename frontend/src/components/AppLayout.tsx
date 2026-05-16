import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { api } from '../api';

interface AppLayoutProps {
  activeItem: string;
  onNavigate: (id: string) => void;
  children: React.ReactNode;
  breadcrumb?: Array<{ label: string; page?: string }>;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
  bookings?: any[];
}

export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
  }
};

export const showConfirm = (message: string, onConfirm: () => void, title: string = 'Xác nhận thao tác') => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-confirm', { detail: { message, onConfirm, title } }));
  }
};

const ConfirmDialog = () => {
  const [config, setConfig] = React.useState<any>(null);

  React.useEffect(() => {
    const handleConfirm = (e: any) => setConfig(e.detail);
    window.addEventListener('show-confirm', handleConfirm);
    return () => window.removeEventListener('show-confirm', handleConfirm);
  }, []);

  if (!config) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-card">
        <div className="confirm-header">
           <span className="material-icons-round">help_outline</span>
           <h3>{config.title}</h3>
        </div>
        <div className="confirm-body">{config.message}</div>
        <div className="confirm-footer">
           <button className="btn-cancel" onClick={() => setConfig(null)}>Hủy bỏ</button>
           <button className="btn-confirm" onClick={() => { config.onConfirm(); setConfig(null); }}>Xác nhận</button>
        </div>
      </div>
      <style>{`
        .confirm-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(8px); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease; }
        .confirm-card { background: white; border-radius: 24px; width: 100%; max-width: 400px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .confirm-header { padding: 24px 24px 8px; display: flex; align-items: center; gap: 12px; }
        .confirm-header .material-icons-round { color: #2563eb; font-size: 28px; }
        .confirm-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; }
        .confirm-body { padding: 0 24px 24px; font-size: 14px; color: #64748b; line-height: 1.6; }
        .confirm-footer { padding: 16px 24px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 12px; }
        .btn-cancel { padding: 10px 20px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; color: #64748b; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
        .btn-cancel:hover { background: #f1f5f9; color: #1e293b; }
        .btn-confirm { padding: 10px 24px; border-radius: 12px; border: none; background: #2563eb; color: white; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .btn-confirm:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3); }
        @keyframes fadeIn { from { opacity: 0; } }
        @keyframes scaleUp { from { transform: scale(0.9); opacity: 0; } }
      `}</style>
    </div>
  );
};

const ToastContainer = () => {
  const [toasts, setToasts] = React.useState<any[]>([]);

  React.useEffect(() => {
    const handleToast = (e: any) => {
      const newToast = { id: `${Date.now()}-${Math.random()}`, ...e.detail };
      setToasts(prev => [...prev, newToast]);
      setTimeout(() => setToasts(prev => prev.filter((t: any) => t.id !== newToast.id)), 4000);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`premium-toast toast-${t.type}`}>
           <div className="toast-icon">
              <span className="material-icons-round">
                 {t.type === 'success' ? 'check_circle' : t.type === 'error' ? 'error' : t.type === 'warning' ? 'warning' : 'info'}
              </span>
           </div>
           <div className="toast-content">
              <div className="toast-title">{t.type.toUpperCase()}</div>
              <div className="toast-message">{t.message}</div>
           </div>
           <div className="toast-progress">
              <div className="progress-fill"></div>
           </div>
        </div>
      ))}
      <style>{`
         .toast-container { 
           position: fixed; top: 24px; right: 24px; z-index: 9999; 
           display: flex; flex-direction: column; gap: 12px; pointer-events: none; 
         }
         .premium-toast { 
           display: flex; align-items: flex-start; gap: 16px; 
           padding: 16px 20px; border-radius: 16px; 
           background: rgba(255, 255, 255, 0.9);
           backdrop-filter: blur(12px);
           -webkit-backdrop-filter: blur(12px);
           border: 1px solid rgba(255, 255, 255, 0.2);
           box-shadow: 0 10px 40px rgba(0,0,0,0.1); 
           min-width: 340px; max-width: 420px;
           animation: toastIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), toastOut 0.4s ease 3.6s forwards; 
           position: relative; overflow: hidden;
         }
         
         @keyframes toastIn { 
           from { transform: translateX(100%) scale(0.9); opacity: 0; } 
           to { transform: translateX(0) scale(1); opacity: 1; } 
         }
         @keyframes toastOut { 
           to { transform: translateX(20px) scale(0.95); opacity: 0; } 
         }

         .toast-icon {
           width: 32px; height: 32px; border-radius: 10px;
           display: flex; align-items: center; justify-content: center;
           flex-shrink: 0;
         }
         .toast-icon .material-icons-round { font-size: 20px; }

         .toast-content { flex: 1; }
         .toast-title { font-size: 10px; font-weight: 800; letter-spacing: 1px; margin-bottom: 2px; }
         .toast-message { font-size: 14px; font-weight: 600; color: #1e293b; line-height: 1.4; }

         .toast-progress { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: rgba(0,0,0,0.05); }
         .progress-fill { height: 100%; width: 0; animation: progress 4s linear forwards; }
         
         @keyframes progress { from { width: 100%; } to { width: 0%; } }

         .toast-success .toast-icon { background: #dcfce7; color: #10b981; }
         .toast-success .toast-title { color: #10b981; }
         .toast-success .progress-fill { background: #10b981; }
         
         .toast-error .toast-icon { background: #fef2f2; color: #ef4444; }
         .toast-error .toast-title { color: #ef4444; }
         .toast-error .progress-fill { background: #ef4444; }
         
         .toast-info .toast-icon { background: #eff6ff; color: #3b82f6; }
         .toast-info .toast-title { color: #3b82f6; }
         .toast-info .progress-fill { background: #3b82f6; }
         
         .toast-warning .toast-icon { background: #fffbeb; color: #f59e0b; }
         .toast-warning .toast-title { color: #f59e0b; }
         .toast-warning .progress-fill { background: #f59e0b; }
      `}</style>
    </div>
  );
};

const AppLayout: React.FC<AppLayoutProps> = ({ 
  activeItem, 
  onNavigate, 
  breadcrumb, 
  children, 
  currentUser, 
  onLogout, 
  bookingPendingCount,
  flightCount,
  passengerCount,
  bookings = []
}) => {
  // Fallback: read currentUser from localStorage if not passed
  const resolvedUser = currentUser || (() => { try { return JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch { return {}; } })();

  React.useEffect(() => {
    const handleLog = (e: any) => {
      let user = currentUser;
      if (!user) {
        try {
          const stored = localStorage.getItem('currentUser');
          if (stored) user = JSON.parse(stored);
        } catch (err) {}
      }
      
      // Fire-and-forget: persist to database
      api.createAuditLog({
        hanh_dong: e.detail.message,
        bang_tac_dong: activeItem.toUpperCase(),
        ghi_chu: `${e.detail.type} | Admin: ${user?.name || 'Hệ thống'}`,
        ma_nv: user?.id ? Number(user.id) : undefined,
      }).catch(() => null);
    };
    window.addEventListener('show-toast', handleLog);
    return () => window.removeEventListener('show-toast', handleLog);
  }, [activeItem, currentUser]);

  return (
    <div className="layout">
      <ToastContainer />
      <ConfirmDialog />
      <Sidebar 
        activeItem={activeItem} 
        onNavigate={onNavigate} 
        currentUser={resolvedUser} 
        onLogout={onLogout} 
        bookingPendingCount={bookingPendingCount}
        flightCount={flightCount}
        passengerCount={passengerCount}
      />
      <div className="main-container">
        <Header onNavigate={onNavigate} bookings={bookings} />
        <main className="content">
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="breadcrumb">
              <span className="link" onClick={() => onNavigate('dashboard')}>
                <span className="material-icons-round">home</span> Dashboard
              </span>
              {breadcrumb.map((b, i) => (
                <React.Fragment key={i}>
                  <span className="material-icons-round separator">chevron_right</span>
                  {b.page ? (
                    <span className="link" onClick={() => onNavigate(b.page!)}>{b.label}</span>
                  ) : (
                    <span className="current">{b.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
          <div className="page-wrapper-animation">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        /* ─── GLOBAL DESIGN TOKENS ─── */
        :root {
          --primary: #2563eb;
          --primary-hover: #1d4ed8;
          --primary-light: #eff6ff;
          --secondary: #64748b;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --info: #0ea5e9;
          --bg-main: #f8fafc;
          --bg-card: #ffffff;
          --text-main: #1e293b;
          --text-muted: #64748b;
          --border: #e2e8f0;
          --radius-lg: 16px;
          --radius-md: 12px;
          --radius-sm: 8px;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
          --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.06);
          --shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
          --font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
          font-family: var(--font-family);
          background-color: var(--bg-main);
          color: var(--text-main);
          -webkit-font-smoothing: antialiased;
        }

        .layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          min-height: 100vh;
        }

        .main-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
        }

        .content {
          flex: 1;
          padding: 24px 32px;
          overflow-y: auto;
          scrollbar-width: thin;
        }

        /* ─── BREADCRUMB ─── */
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
          padding: 8px 16px;
          background: white;
          border-radius: var(--radius-sm);
          width: fit-content;
          border: 1px solid var(--border);
        }
        .breadcrumb .link {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color 0.2s;
        }
        .breadcrumb .link:hover { color: var(--primary); }
        .breadcrumb .link .material-icons-round { font-size: 16px; }
        .breadcrumb .separator { font-size: 18px; color: var(--border); }
        .breadcrumb .current { font-size: 13px; font-weight: 700; color: var(--text-main); }

        /* ─── ANIMATIONS ─── */
        .page-wrapper-animation {
          animation: slideUp 0.4s cubic-bezier(0, 0, 0.2, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ─── COMMON UTILITIES ─── */
        .badge {
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-primary { background: #eff6ff; color: #2563eb; }
        .badge-warning { background: #fffbeb; color: #b45309; }
        .badge-danger { background: #fef2f2; color: #b91c1c; }

        .btn-premium {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .btn-premium.primary { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2); }
        .btn-premium.primary:hover { background: var(--primary-hover); transform: translateY(-1px); box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3); }
      `}</style>
    </div>
  );
};

export default AppLayout;
