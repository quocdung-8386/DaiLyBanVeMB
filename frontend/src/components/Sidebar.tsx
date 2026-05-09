import React, { useEffect, useRef } from 'react';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (id: string) => void;
}

// Persist scroll position across mounts
let sidebarScrollPosition = 0;

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'dashboard', onNavigate }) => {
  const menuGroups = [
    {
      group: 'Điều hành',
      items: [
        { id: 'dashboard', label: 'Bảng điều khiển', icon: 'dashboard' },
      ],
    },
    {
      group: 'Nghiệp vụ bay',
      items: [
        { id: 'flights', label: 'Chuyến bay', icon: 'flight_takeoff', badge: '2' },
        { id: 'booking', label: 'Đặt chỗ (Booking)', icon: 'book_online', badge: '3' },
        { id: 'tickets', label: 'Quản lý Vé (Tickets)', icon: 'confirmation_number', badge: '12' },
        { id: 'passengers', label: 'Hành khách', icon: 'person_search' },
        { id: 'seat-map', label: 'Sơ đồ ghế', icon: 'event_seat' },
      ],
    },
    {
      group: 'Tài chính',
      items: [
        { id: 'payments', label: 'Lịch sử giao dịch', icon: 'payments', badge: 'New' },
        { id: 'refund-management', label: 'Hoàn/Hủy vé', icon: 'assignment_return' },
      ],
    },
    {
      group: 'Báo cáo & Hệ thống',
      items: [
        { id: 'reports', label: 'Báo cáo vận hành', icon: 'insights' },
        { id: 'settings', label: 'Cài đặt', icon: 'settings' },
        { id: 'users', label: 'Nhân viên', icon: 'badge' },
      ],
    },
    {
      group: 'Khác',
      items: [
        { id: 'loyalty', label: 'Hội viên', icon: 'stars' },
        { id: 'ai_admin', label: 'Trợ lý AI', icon: 'auto_awesome' },
        { id: 'audit_log', label: 'Nhật ký', icon: 'history_edu' },
      ],
    },
  ];

  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (navRef.current) {
      navRef.current.scrollTop = sidebarScrollPosition;
    }
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    sidebarScrollPosition = e.currentTarget.scrollTop;
  };

  return (
    <aside className="sidebar">
      <div className="logo-section">
        <div className="logo-graphic">
          <span className="material-icons-round">airplanemode_active</span>
        </div>
        <div className="logo-text">
          <h1>Skyward Portal</h1>
          <p>QL ĐẠI LÝ BÁN VÉ MÁY BAY</p>
        </div>
      </div>

      <nav className="sidebar-nav" ref={navRef} onScroll={handleScroll}>
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="nav-group">
            <h5 className="nav-group-title">{group.group}</h5>
            {group.items.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeItem === item.id ? 'active' : ''}`}
                onClick={() => {
                  if (activeItem !== item.id) {
                    onNavigate?.(item.id);
                  }
                }}
              >
                <span className="material-icons-round">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-pill">{item.badge}</span>}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">AD</div>
          <div className="user-meta">
            <p className="user-name">Nguyễn Văn Admin</p>
            <p className="user-role">Quản trị viên</p>
          </div>
          <button className="logout-btn" onClick={() => onNavigate?.('login')}>
            <span className="material-icons-round">logout</span>
          </button>
        </div>
      </div>

      <style>{`
        .sidebar {
          background: #ffffff;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .logo-section {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-graphic {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #2563eb, #1e40af);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        .logo-graphic .material-icons-round { font-size: 24px; }
        .logo-text h1 { font-size: 16px; font-weight: 900; letter-spacing: 0.5px; color: #0f172a; margin: 0; white-space: nowrap; }
        .logo-text p { font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; margin: 0; white-space: nowrap; }

        .sidebar-nav {
          flex: 1;
          padding: 0 16px;
          overflow-y: auto;
        }
        .nav-group { margin-bottom: 24px; }
        .nav-group-title {
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 12px;
          margin-bottom: 12px;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          border: none;
          background: transparent;
          border-radius: 12px;
          color: #64748b;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 4px;
          text-align: left;
        }
        .nav-item:hover { background: #f8fafc; color: #2563eb; transform: translateX(4px); }
        .nav-item.active { background: #eff6ff; color: #2563eb; font-weight: 800; border-left: 4px solid #2563eb; padding-left: 8px; }
        .nav-item .material-icons-round { font-size: 20px; }
        .nav-label { flex: 1; }
        .nav-pill { background: #ef4444; color: white; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 10px; }

        .sidebar-footer { padding: 20px 16px; border-top: 1px solid #f1f5f9; }
        .user-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 16px;
        }
        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #0f172a;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 800;
        }
        .user-meta { flex: 1; min-width: 0; }
        .user-name { font-size: 13px; font-weight: 700; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin: 0; }
        .user-role { font-size: 11px; color: #64748b; font-weight: 600; margin: 0; }
        .logout-btn {
          width: 32px;
          height: 32px;
          border: none;
          background: transparent;
          color: #94a3b8;
          cursor: pointer;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .logout-btn:hover { background: #fee2e2; color: #ef4444; }
      `}</style>
    </aside>
  );
};

export default Sidebar;
