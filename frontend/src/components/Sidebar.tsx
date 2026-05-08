import React from 'react';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  badge?: number;
};

type MenuGroup = {
  group: string;
  items: MenuItem[];
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', onNavigate }) => {
  const menuGroups: MenuGroup[] = [
    {
      group: 'Tổng quan',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
      ],
    },
    {
      group: 'Nghiệp vụ bán vé',
      items: [
        { id: 'flights', label: 'Chuyến bay', icon: 'flight' },
        { id: 'booking', label: 'Đặt chỗ', icon: 'event_seat' },
        { id: 'tickets', label: 'Vé máy bay', icon: 'confirmation_number' },
        { id: 'refund-management', label: 'Hoàn vé', icon: 'assignment_return' },
      ],
    },
    {
      group: 'Tài chính',
      items: [
        { id: 'payment_history', label: 'Lịch sử GD', icon: 'receipt_long' },
        { id: 'reports', label: 'Báo cáo', icon: 'bar_chart' },
      ],
    },
    {
      group: 'Quản trị',
      items: [
        { id: 'users', label: 'Nhân sự', icon: 'group' },
        { id: 'settings', label: 'Hệ thống', icon: 'settings' },
        { id: 'audit_log', label: 'Nhật ký', icon: 'manage_search' },
        { id: 'ai_admin', label: 'AI Admin', icon: 'smart_toy' },
      ],
    },
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
        {menuGroups.map(group => (
          <div key={group.group} className="menu-group">
            <p className="group-label">{group.group}</p>
            {group.items.map(item => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
              >
                <span className="material-icons-round">{item.icon}</span>
                <span className="item-label">{item.label}</span>
                {item.badge ? <span className="nav-badge">{item.badge}</span> : null}
              </a>
            ))}
          </div>
        ))}
      </nav>

      <div className="user-profile" onClick={() => onNavigate?.('profile')} style={{ cursor: 'pointer' }}>
        <div className="avatar">AD</div>
        <div className="user-info">
          <p className="name">Nguyễn Văn Admin</p>
          <p className="role">Quản trị viên</p>
        </div>
        <span className="material-icons-round profile-arrow">chevron_right</span>
      </div>

      <style>{`
        .logo-container {
          padding: 0 24px;
          margin-bottom: 32px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #1a73e8, #1557b0);
          color: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          box-shadow: 0 8px 20px rgba(26,115,232,0.2);
        }
        .logo-text h2 { font-size: 18px; font-weight: 800; color: #1e293b; margin: 0; letter-spacing: -0.5px; line-height: 1.2; }
        .logo-text p { font-size: 10px; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 700; opacity: 0.8; }
        
        .menu { flex: 1; padding: 0 16px; overflow-y: auto; scrollbar-width: none; }
        .menu::-webkit-scrollbar { display: none; }
        
        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          color: #64748b;
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 4px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          text-decoration: none;
          position: relative;
        }
        .menu-item:hover {
          background: #f8fafc;
          color: #1a73e8;
          transform: translateX(4px);
        }
        .menu-item.active {
          background: #eff6ff;
          color: #1a73e8;
        }
        .menu-item.active::before {
          content: '';
          position: absolute;
          left: -16px;
          top: 25%;
          height: 50%;
          width: 4px;
          background: #1a73e8;
          border-radius: 0 4px 4px 0;
          box-shadow: 2px 0 8px rgba(26,115,232,0.4);
        }
        .menu-item .material-icons-round { font-size: 22px; }

        .user-profile {
          margin: 16px 16px 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #f1f5f9;
          transition: all 0.2s;
        }
        .user-profile:hover {
          background: #f1f5f9;
          border-color: #e2e8f0;
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: white;
          font-size: 13px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .user-info .name { font-size: 14px; font-weight: 700; color: #1e293b; margin: 0; line-height: 1.2; }
        .user-info .role { font-size: 11px; color: #64748b; margin: 0; font-weight: 600; }
        .profile-arrow { font-size: 18px; color: #94a3b8; margin-left: auto; }

        .menu-group { margin-bottom: 8px; }
        .group-label { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; padding: 8px 16px 4px; margin: 0; }

        .item-label { flex: 1; }
        .nav-badge { background: #ef4444; color: white; font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 10px; min-width: 20px; text-align: center; }
      `}</style>
    </aside>
  );
};

export default Sidebar;
