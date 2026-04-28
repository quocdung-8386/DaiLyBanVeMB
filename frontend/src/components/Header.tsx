import React from 'react';

interface HeaderProps {
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="header">
      <div className="search-bar">
        <span className="material-icons-round">search</span>
        <input type="text" placeholder="Tìm kiếm mã vé, khách hàng..." />
      </div>
      
      <div className="header-actions">
        <button className="icon-btn">
          <span className="material-icons-round">notifications</span>
          <span className="badge-dot"></span>
        </button>
        <button className="icon-btn">
          <span className="material-icons-round">help_outline</span>
        </button>
        <div className="divider"></div>
        <p className="current-page-label">{title}</p>
      </div>

      <style>{`
        .header {
          height: 64px;
          background: white;
          border-bottom: 1px solid var(--border);
          padding: 0 var(--space-xl);
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .search-bar {
          display: flex;
          align-items: center;
          background: var(--bg-main);
          border-radius: 20px;
          padding: 8px 16px;
          width: 400px;
          gap: var(--space-sm);
        }
        .search-bar input {
          border: none;
          background: transparent;
          outline: none;
          width: 100%;
          font-size: 14px;
        }
        .material-icons-round { color: var(--text-muted); font-size: 20px; }
        
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .icon-btn {
          position: relative;
          color: var(--text-secondary);
          padding: 8px;
          border-radius: 50%;
          transition: background 0.2s;
        }
        .icon-btn:hover { background: var(--bg-main); }
        .badge-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border-radius: 50%;
          border: 2px solid white;
        }
        .divider {
          width: 1px;
          height: 24px;
          background: var(--border);
        }
        .current-page-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }
      `}</style>
    </header>
  );
};

export default Header;
