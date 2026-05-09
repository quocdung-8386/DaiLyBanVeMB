import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  title?: string;
  onNavigate?: (page: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotif(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const mockNotifications = [
    { id: 1, title: 'Thanh toán thành công', content: 'Đơn đặt chỗ #BKG-8892 đã được thanh toán 4,500,000 VND.', time: '10 phút trước', read: false },
    { id: 2, title: 'Khách hàng yêu cầu đổi vé', content: 'Khách hàng Nguyễn Văn A yêu cầu đổi chuyến bay VN123.', time: '2 giờ trước', read: false },
    { id: 3, title: 'Cập nhật hệ thống', content: 'Hệ thống sẽ bảo trì từ 2h00 - 4h00 sáng ngày mai.', time: '1 ngày trước', read: true },
  ];

  return (
    <header className="header">
      {/* Search */}
      <div className="header-search-container" ref={searchRef}>
        <div className="header-search">
          <span className="material-icons-round search-icon">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm mã vé, khách hàng, chuyến bay..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(e.target.value.length > 0);
            }}
            onFocus={() => {
              if (searchQuery.length > 0) setShowSearch(true);
            }}
          />
        </div>

        {/* Search Results Dropdown */}
        {showSearch && (
          <div className="search-dropdown">
            <div className="search-section">
              <h4>GỢI Ý KẾT QUẢ CHO "{searchQuery}"</h4>
              <div className="search-result-item" onClick={() => { alert('Mở chi tiết mã vé VN123'); setShowSearch(false); }}>
                <span className="material-icons-round text-primary">confirmation_number</span>
                <div className="s-res-info">
                  <p className="s-res-title">Vé máy bay VN123</p>
                  <p className="s-res-desc">Hà Nội - TP. Hồ Chí Minh (24/10/2023)</p>
                </div>
              </div>
              <div className="search-result-item" onClick={() => { alert('Mở thông tin khách hàng'); setShowSearch(false); }}>
                <span className="material-icons-round text-success">person</span>
                <div className="s-res-info">
                  <p className="s-res-title">Khách hàng: Nguyễn Văn {searchQuery}</p>
                  <p className="s-res-desc">0912345678 • Hạng thẻ: Gold</p>
                </div>
              </div>
            </div>
            <div className="search-footer" onClick={() => alert('Đang tìm tất cả...')}>
              Xem tất cả kết quả
            </div>
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <div className="notif-container" ref={notifRef}>
          <button
            className="header-icon-btn"
            onClick={() => setShowNotif(!showNotif)}
            title="Thông báo"
          >
            <span className="material-icons-round">notifications</span>
            <span className="notif-dot"></span>
          </button>

          {/* Popup Thông Báo */}
          {showNotif && (
            <div className="notif-popup">
              <div className="notif-header">
                <h3>Thông báo</h3>
                <button className="mark-read-btn">Đánh dấu đã đọc</button>
              </div>
              <div className="notif-list">
                {mockNotifications.map(n => (
                  <div key={n.id} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                    <div className="notif-icon-wrap">
                      <span className="material-icons-round">notifications</span>
                    </div>
                    <div className="notif-content">
                      <h4>{n.title}</h4>
                      <p>{n.content}</p>
                      <span className="notif-time">{n.time}</span>
                    </div>
                    {!n.read && <div className="unread-dot"></div>}
                  </div>
                ))}
              </div>
              <div className="notif-footer">
                <button>Xem tất cả thông báo</button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="header-icon-btn" title="Trợ giúp" onClick={() => alert('Trung tâm trợ giúp Skyward Portal đang được cập nhật.')}>
          <span className="material-icons-round">help_outline</span>
        </button>
      </div>

      <style>{`
        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 0 28px;
          height: 64px;
          min-height: 64px;
          background: #ffffff;
          border-bottom: 1px solid #f1f5f9;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
        }

        /* Search bar */
        .header-search-container {
          flex: 1;
          max-width: 480px;
          position: relative;
        }
        .header-search {
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0 14px;
          gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .header-search:focus-within {
          border-color: #0e74be;
          background: white;
          box-shadow: 0 0 0 3px rgba(14, 116, 190, 0.1);
        }
        .search-icon {
          font-size: 20px;
          color: #94a3b8;
          flex-shrink: 0;
        }
        .header-search input {
          flex: 1;
          border: none;
          background: transparent;
          outline: none;
          font-size: 14px;
          color: #1e293b;
          height: 40px;
          font-family: inherit;
        }
        .header-search input::placeholder { color: #94a3b8; }

        .search-dropdown {
          position: absolute;
          top: 50px;
          left: 0;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          z-index: 100;
          animation: slideDown 0.2s ease-out;
        }
        .search-section { padding: 16px 0; }
        .search-section h4 { font-size: 11px; font-weight: 800; color: #94a3b8; margin: 0 16px 12px; letter-spacing: 0.5px; }
        .search-result-item { display: flex; gap: 12px; padding: 10px 16px; cursor: pointer; transition: background 0.2s; align-items: center; }
        .search-result-item:hover { background: #f8fafc; }
        .search-result-item .material-icons-round { padding: 8px; border-radius: 10px; background: #f1f5f9; font-size: 20px; }
        .text-primary { color: #0e74be; }
        .text-success { color: #10b981; }
        .s-res-title { font-size: 14px; font-weight: 600; color: #1e293b; margin: 0 0 4px; }
        .s-res-desc { font-size: 12px; color: #64748b; margin: 0; }
        
        .search-footer { padding: 12px; text-align: center; border-top: 1px solid #f1f5f9; background: #f8fafc; font-size: 13px; font-weight: 600; color: #0e74be; cursor: pointer; }
        .search-footer:hover { text-decoration: underline; }

        /* Right section */
        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        /* Icon buttons */
        .header-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: transparent;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #64748b;
          position: relative;
          transition: background 0.2s, color 0.2s;
        }
        .header-icon-btn:hover {
          background: #f1f5f9;
          color: #0e74be;
        }
        .header-icon-btn .material-icons-round { font-size: 22px; }

        /* Notification dot */
        .notif-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid white;
        }

        /* Notif Popup Container */
        .notif-container { position: relative; }
        
        .notif-popup {
          position: absolute;
          top: 50px;
          right: 0;
          width: 360px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
          border: 1px solid #f1f5f9;
          overflow: hidden;
          z-index: 1000;
          animation: slideDown 0.2s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
        }
        .notif-header h3 { font-size: 16px; font-weight: 700; margin: 0; color: #1e293b; }
        .mark-read-btn { font-size: 12px; font-weight: 600; color: #0e74be; border: none; background: transparent; cursor: pointer; }
        .mark-read-btn:hover { text-decoration: underline; }

        .notif-list { max-height: 400px; overflow-y: auto; }
        .notif-item {
          display: flex;
          gap: 12px;
          padding: 16px 20px;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s;
          cursor: pointer;
        }
        .notif-item:hover { background: #f8fafc; }
        .notif-item.unread { background: #eff6ff; }
        .notif-item.unread:hover { background: #e0f2fe; }

        .notif-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          flex-shrink: 0;
        }
        .notif-item.unread .notif-icon-wrap { background: #bae6fd; color: #0e74be; }

        .notif-content h4 { font-size: 14px; font-weight: 600; margin: 0 0 4px 0; color: #1e293b; }
        .notif-content p { font-size: 13px; color: #64748b; margin: 0 0 6px 0; line-height: 1.4; }
        .notif-time { font-size: 11px; font-weight: 600; color: #94a3b8; }

        .unread-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          margin-top: 6px;
        }

        .notif-footer { padding: 12px; text-align: center; border-top: 1px solid #f1f5f9; background: #f8fafc; }
        .notif-footer button { font-size: 13px; font-weight: 600; color: #1e293b; background: transparent; border: none; cursor: pointer; width: 100%; }
        .notif-footer button:hover { color: #0e74be; }

        .header-divider {
          width: 1px;
          height: 32px;
          background: #e2e8f0;
          margin: 0 4px;
        }

        /* User profile button */
        .header-user {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 10px 6px 6px;
          border-radius: 10px;
          border: none;
          background: transparent;
          cursor: pointer;
          transition: background 0.2s;
        }
        .header-user:hover { background: #f8fafc; }

        .header-avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: white;
          font-size: 13px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-user-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        .header-user-name {
          font-size: 13px;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
          white-space: nowrap;
        }
        .header-user-role {
          font-size: 11px;
          color: #64748b;
          font-weight: 500;
        }
      `}</style>
    </header>
  );
};

export default Header;
