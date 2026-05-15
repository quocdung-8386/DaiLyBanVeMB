import React, { useState, useRef, useEffect, useCallback } from 'react';
import { showToast } from './AppLayout';
import { api } from '../api';

interface HeaderProps {
  title?: string;
  onNavigate?: (page: string) => void;
  // bookings can still be passed optionally as override (e.g. from pages that already have them loaded)
  bookings?: any[];
}

const Header: React.FC<HeaderProps> = ({ onNavigate, bookings: bookingsProp = [] }) => {
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  // Internal bookings state: prefer prop if provided, otherwise fetch from API
  const [internalBookings, setInternalBookings] = useState<any[]>(bookingsProp);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Sync when parent bookings prop changes
  useEffect(() => {
    if (bookingsProp.length > 0) {
      setInternalBookings(bookingsProp);
    }
  }, [bookingsProp]);

  // Self-fetch bookings if prop is empty (e.g. pages that don't pass bookings)
  useEffect(() => {
    if (bookingsProp.length === 0) {
      api.getBookings().then(data => {
        if (Array.isArray(data)) setInternalBookings(data);
      }).catch(() => null);
    }
  }, [bookingsProp.length]);

  // ── Load notifications from backend audit log ──────────────────────────
  const loadNotifications = useCallback(async () => {
    setNotifLoading(true);
    try {
      const logs = await api.getAuditLogs(20);
      const notifs = logs.map((log: any) => ({
        id: log.id,
        title: log.type === 'danger' ? 'Lỗi / Hủy thao tác'
             : log.type === 'warning' ? 'Cảnh báo'
             : 'Thao tác thành công',
        content: log.action,
        time: log.time,
        type: log.type === 'info' ? 'payment' : 'update',
        module: log.module,
        read: false,
      }));
      setNotifications(notifs);
      setUnreadCount(notifs.length);
    } catch {
      // Backend not available – silently ignore
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // Load on mount, then poll every 30s to stay fresh across page reloads
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Also refresh when a new toast fires (action just happened)
  useEffect(() => {
    const handler = () => setTimeout(loadNotifications, 500);
    window.addEventListener('show-toast', handler);
    return () => window.removeEventListener('show-toast', handler);
  }, [loadNotifications]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // ── Real-time case-insensitive search ─────────────────────────────────
  const q = searchQuery.toLowerCase().trim();
  const bookings = internalBookings;
  const filteredResults = q.length >= 1 ? bookings.filter(b => {
    return (
      b.pnr?.toLowerCase().includes(q) ||
      b.customer?.toLowerCase().includes(q) ||
      b.flightNumber?.toLowerCase().includes(q) ||
      b.flight?.toLowerCase().includes(q) ||
      b.from?.toLowerCase().includes(q) ||
      b.to?.toLowerCase().includes(q) ||
      b.passengersList?.some((p: any) => p.name?.toLowerCase().includes(q))
    );
  }).slice(0, 6) : [];

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

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
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setShowSearch(false); }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}>
              <span className="material-icons-round" style={{ fontSize: 18 }}>close</span>
            </button>
          )}
        </div>

        {/* Results dropdown */}
        {showSearch && searchQuery.length >= 1 && (
          <div className="search-dropdown">
            {filteredResults.length > 0 ? (
              <>
                <div className="search-section">
                  <h4>KẾT QUẢ CHO "{searchQuery}"</h4>
                  {filteredResults.map((res, idx) => (
                    <div key={idx} className="search-result-item" onClick={() => {
                      if (onNavigate) onNavigate('tickets');
                      showToast(`Đang chuyển đến booking ${res.pnr}`, 'info');
                      setShowSearch(false);
                      setSearchQuery('');
                    }}>
                      <span className="material-icons-round text-primary">confirmation_number</span>
                      <div className="s-res-info">
                        <p className="s-res-title">#{res.pnr} — {res.customer}</p>
                        <p className="s-res-desc">
                          {res.from} ✈ {res.to} &nbsp;·&nbsp; {res.flight || res.flightNumber} &nbsp;·&nbsp; {res.status}
                        </p>
                      </div>
                      <span className={`s-res-badge badge-${res.badge}`}>{res.status}</span>
                    </div>
                  ))}
                </div>
                <div className="search-footer" onClick={() => { if (onNavigate) onNavigate('tickets'); setShowSearch(false); }}>
                  Xem tất cả trong Quản lý vé &nbsp;→
                </div>
              </>
            ) : (
              <div style={{ padding: '28px 20px', textAlign: 'center' }}>
                <span className="material-icons-round" style={{ fontSize: 40, color: '#e2e8f0' }}>search_off</span>
                <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 13 }}>Không tìm thấy kết quả phù hợp</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="header-right">
        {/* Notification Bell */}
        <div className="notif-container" ref={notifRef}>
          <button
            className="header-icon-btn"
            onClick={() => { setShowNotif(!showNotif); if (!showNotif) loadNotifications(); }}
            title="Thông báo"
          >
            <span className="material-icons-round">notifications</span>
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {showNotif && (
            <div className="notif-popup">
              <div className="notif-header">
                <h3>Nhật ký thao tác</h3>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button className="mark-read-btn" onClick={loadNotifications} title="Làm mới">
                    <span className="material-icons-round" style={{ fontSize: 15 }}>refresh</span>
                  </button>
                  <button className="mark-read-btn" onClick={handleMarkAllRead}>Đã đọc tất cả</button>
                </div>
              </div>
              <div className="notif-list">
                {notifLoading ? (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    <span className="material-icons-round" style={{ fontSize: 32 }}>hourglass_top</span>
                    <p style={{ margin: '8px 0 0', fontSize: 13 }}>Đang tải...</p>
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((n, idx) => (
                    <div key={n.id || idx} className={`notif-item ${n.read ? 'read' : 'unread'}`}>
                      <div className="notif-icon-wrap" style={{
                        background: n.type === 'payment' ? '#dcfce7' : '#eff6ff'
                      }}>
                        <span className="material-icons-round" style={{
                          color: n.type === 'payment' ? '#10b981' : '#3b82f6'
                        }}>
                          {n.type === 'payment' ? 'check_circle' : 'edit_note'}
                        </span>
                      </div>
                      <div className="notif-content">
                        <h4>{n.title}</h4>
                        <p>{n.content}</p>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
                          <span className="notif-time">{n.time}</span>
                          {n.module && (
                            <span style={{ fontSize: 10, fontWeight: 700, color: '#2563eb', background: '#eff6ff', padding: '1px 6px', borderRadius: 8 }}>
                              {n.module}
                            </span>
                          )}
                        </div>
                      </div>
                      {!n.read && <div className="unread-dot"></div>}
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <span className="material-icons-round" style={{ fontSize: 40, color: '#f1f5f9' }}>notifications_off</span>
                    <p style={{ margin: '8px 0 0', color: '#94a3b8', fontSize: 13 }}>Chưa có thao tác nào được ghi lại</p>
                  </div>
                )}
              </div>
              <div className="notif-footer">
                <button onClick={() => { if (onNavigate) onNavigate('audit_log'); setShowNotif(false); }}>
                  Xem nhật ký đầy đủ
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <button className="header-icon-btn" title="Trợ giúp"
          onClick={() => showToast('Trung tâm trợ giúp Skyward Portal đang được cập nhật.', 'info')}>
          <span className="material-icons-round">help_outline</span>
        </button>
      </div>

      <style>{`
        .header {
          display: flex; align-items: center; gap: 16px;
          padding: 0 28px; height: 64px; min-height: 64px;
          background: #ffffff; border-bottom: 1px solid #f1f5f9;
          position: sticky; top: 0; z-index: 50;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
        }
        .header-search-container { flex: 1; max-width: 520px; position: relative; }
        .header-search {
          display: flex; align-items: center;
          background: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 10px; padding: 0 14px; gap: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .header-search:focus-within {
          border-color: #0e74be; background: white;
          box-shadow: 0 0 0 3px rgba(14,116,190,0.1);
        }
        .search-icon { font-size: 20px; color: #94a3b8; flex-shrink: 0; }
        .header-search input {
          flex: 1; border: none; background: transparent;
          outline: none; font-size: 14px; color: #1e293b;
          height: 40px; font-family: inherit;
        }
        .header-search input::placeholder { color: #94a3b8; }

        .search-dropdown {
          position: absolute; top: 50px; left: 0; right: 0;
          background: white; border-radius: 14px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          border: 1px solid #f1f5f9; overflow: hidden;
          z-index: 100; animation: slideDown 0.18s ease-out;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .search-section { padding: 12px 0 8px; }
        .search-section h4 {
          font-size: 10px; font-weight: 800; color: #94a3b8;
          margin: 0 16px 10px; letter-spacing: 0.8px; text-transform: uppercase;
        }
        .search-result-item {
          display: flex; gap: 12px; padding: 10px 16px;
          cursor: pointer; transition: background 0.15s;
          align-items: center;
        }
        .search-result-item:hover { background: #f8fafc; }
        .search-result-item .material-icons-round {
          padding: 8px; border-radius: 10px; background: #f1f5f9; font-size: 20px; flex-shrink: 0;
        }
        .text-primary { color: #0e74be; }
        .s-res-info { flex: 1; min-width: 0; }
        .s-res-title { font-size: 14px; font-weight: 600; color: #1e293b; margin: 0 0 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .s-res-desc { font-size: 12px; color: #64748b; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .s-res-badge { font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 20px; flex-shrink: 0; }
        .badge-success { background: #dcfce7; color: #15803d; }
        .badge-hold, .badge-warning { background: #fef3c7; color: #b45309; }
        .badge-danger { background: #fee2e2; color: #dc2626; }
        .badge-default { background: #f1f5f9; color: #64748b; }
        .search-footer {
          padding: 12px 16px; text-align: center;
          border-top: 1px solid #f1f5f9; background: #f8fafc;
          font-size: 13px; font-weight: 600; color: #0e74be;
          cursor: pointer; transition: background 0.15s;
        }
        .search-footer:hover { background: #eff6ff; }

        .header-right { display: flex; align-items: center; gap: 8px; margin-left: auto; }
        .header-icon-btn {
          width: 40px; height: 40px; border-radius: 10px;
          background: transparent; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #64748b; position: relative;
          transition: background 0.2s, color 0.2s;
        }
        .header-icon-btn:hover { background: #f1f5f9; color: #0e74be; }
        .header-icon-btn .material-icons-round { font-size: 22px; }

        .notif-badge {
          position: absolute; top: 6px; right: 6px;
          min-width: 16px; height: 16px; border-radius: 8px;
          background: #ef4444; border: 2px solid white;
          color: white; font-size: 9px; font-weight: 800;
          display: flex; align-items: center; justify-content: center;
          padding: 0 3px;
        }

        .notif-container { position: relative; }
        .notif-popup {
          position: absolute; top: 50px; right: 0;
          width: 380px; background: white; border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.12);
          border: 1px solid #f1f5f9; overflow: hidden;
          z-index: 1000; animation: slideDown 0.2s ease-out;
        }
        .notif-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
        }
        .notif-header h3 { font-size: 15px; font-weight: 700; margin: 0; color: #1e293b; }
        .mark-read-btn {
          font-size: 12px; font-weight: 600; color: #0e74be;
          border: none; background: transparent; cursor: pointer;
          display: flex; align-items: center; gap: 4px;
        }
        .mark-read-btn:hover { text-decoration: underline; }

        .notif-list { max-height: 380px; overflow-y: auto; }
        .notif-list::-webkit-scrollbar { width: 4px; }
        .notif-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }

        .notif-item {
          display: flex; gap: 12px; padding: 14px 20px;
          border-bottom: 1px solid #f8fafc;
          transition: background 0.15s; cursor: default;
        }
        .notif-item:hover { background: #f8fafc; }
        .notif-item.unread { background: #f0f9ff; }
        .notif-item.unread:hover { background: #e0f2fe; }

        .notif-icon-wrap {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .notif-icon-wrap .material-icons-round { font-size: 18px; }

        .notif-content { flex: 1; min-width: 0; }
        .notif-content h4 { font-size: 13px; font-weight: 700; margin: 0 0 2px; color: #1e293b; }
        .notif-content p {
          font-size: 12px; color: #64748b; margin: 0;
          line-height: 1.4; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .notif-time { font-size: 11px; font-weight: 600; color: #94a3b8; }

        .unread-dot {
          width: 8px; height: 8px; background: #3b82f6;
          border-radius: 50%; margin-top: 4px; flex-shrink: 0;
        }

        .notif-footer {
          padding: 12px; text-align: center;
          border-top: 1px solid #f1f5f9; background: #f8fafc;
        }
        .notif-footer button {
          font-size: 13px; font-weight: 600; color: #1e293b;
          background: transparent; border: none; cursor: pointer; width: 100%;
          transition: color 0.2s;
        }
        .notif-footer button:hover { color: #0e74be; }
      `}</style>
    </header>
  );
};

export default Header;
