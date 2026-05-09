import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  activeItem: string;
  onNavigate: (page: string) => void;
  breadcrumb?: { label: string; page?: string }[];
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ activeItem, onNavigate, breadcrumb, children }) => {
  return (
    <div className="layout">
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />
      <div className="main-container">
        <Header onNavigate={onNavigate} />
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
