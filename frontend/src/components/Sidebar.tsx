import React from 'react';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', onNavigate }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'flights', label: 'Chuyến bay', icon: 'flight' },
    { id: 'booking', label: 'Đặt chỗ', icon: 'event_seat' },
    { id: 'tickets', label: 'Vé máy bay', icon: 'confirmation_number' },
    { id: 'customers', label: 'Khách hàng', icon: 'people' },
    { id: 'payments', label: 'Thanh toán', icon: 'payments' },
    { id: 'settings', label: 'Quản lý hệ thống', icon: 'settings' },
  ];

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (onNavigate) onNavigate(id);
  };

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <div className="logo-icon">✈</div>
        <div className="logo-text">
          <h2>Skyward Portal</h2>
          <p>QL Đại lý bán vé máy bay</p>
        </div>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={(e) => handleNavClick(e, item.id)}
            className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
          >
            <span className="material-icons-round">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="user-profile">
        <div className="avatar">NV</div>
        <div className="user-info">
          <p className="name">Nguyễn Văn A</p>
          <p className="role">Quản trị viên</p>
        </div>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background: var(--bg-sidebar);
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          padding: var(--space-lg) 0;
          position: sticky;
          top: 0;
        }
        .logo-container {
          padding: 0 var(--space-lg);
          margin-bottom: var(--space-xl);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .logo-text h2 { font-size: 18px; margin: 0; }
        .logo-text p { font-size: 11px; color: var(--text-muted); margin: 0; }

        .menu { flex: 1; padding: 0 var(--space-sm); }
        .menu-item {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: 12px var(--space-md);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-weight: 500;
          font-size: 14px;
          margin-bottom: 4px;
          transition: all 0.2s;
        }
        .menu-item:hover {
          background: var(--bg-main);
          color: var(--primary);
        }
        .menu-item.active {
          background: var(--primary-light);
          color: var(--primary);
          border-right: 3px solid var(--primary);
        }
        .material-icons-round { font-size: 20px; }

        .user-profile {
          margin-top: auto;
          padding: var(--space-lg);
          border-top: 1px solid var(--border);
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #eee;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .user-info .name { font-size: 14px; font-weight: 600; margin: 0; }
        .user-info .role { font-size: 12px; color: var(--text-muted); margin: 0; }
      `}</style>
    </aside>
  );
};

export default Sidebar;
