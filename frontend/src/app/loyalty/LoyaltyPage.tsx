import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout, { showToast } from '../../components/AppLayout';
import { api } from '../../api';

interface LoyaltyPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const TIER_CONFIG: Record<string, { icon: string; color: string; points: string }> = {
  Platinum: { icon: 'diamond',            color: '#1e293b', points: 'Trên 30,000 pts' },
  Gold:     { icon: 'stars',              color: '#f59e0b', points: '10,000 – 30,000 pts' },
  Silver:   { icon: 'workspace_premium',  color: '#64748b', points: '2,000 – 9,999 pts' },
  Member:   { icon: 'person',             color: '#94a3b8', points: 'Dưới 2,000 pts' },
};

const LoyaltyPage: React.FC<LoyaltyPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [activeTab, setActiveTab]       = useState<'members' | 'rules'>('members');
  const [members,   setMembers]         = useState<any[]>([]);
  const [stats,     setStats]           = useState<Record<string, number>>({ Platinum: 0, Gold: 0, Silver: 0, Member: 0 });
  const [loading,   setLoading]         = useState(true);
  const [search,    setSearch]          = useState('');

  // Adjust-points modal
  const [adjustTarget, setAdjustTarget] = useState<any>(null);
  const [adjustForm,   setAdjustForm]   = useState({ loai_gd: 'CONG', so_diem: '', ly_do: '' });
  const [adjusting,    setAdjusting]    = useState(false);

  // Points-history drawer
  const [historyMember, setHistoryMember] = useState<any>(null);
  const [history,        setHistory]       = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [m, s] = await Promise.all([api.getLoyaltyMembers(), api.getLoyaltyStats()]);
      setMembers(m);
      setStats(s);
    } catch {
      showToast('Không thể tải dữ liệu loyalty', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openHistory = async (member: any) => {
    setHistoryMember(member);
    setHistoryLoading(true);
    try {
      const h = await api.getPointsHistory(member.ma_kh);
      setHistory(h);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleAdjust = async () => {
    if (!adjustForm.so_diem || Number(adjustForm.so_diem) <= 0) {
      showToast('Vui lòng nhập số điểm hợp lệ', 'error'); return;
    }
    setAdjusting(true);
    try {
      const res = await api.adjustPoints(adjustTarget.ma_kh, {
        loai_gd: adjustForm.loai_gd,
        so_diem: Number(adjustForm.so_diem),
        ly_do:   adjustForm.ly_do || undefined,
      });
      showToast(`Đã ${adjustForm.loai_gd === 'CONG' ? 'cộng' : 'trừ'} ${adjustForm.so_diem} điểm cho ${adjustTarget.name}`, 'success');
      setMembers(prev => prev.map(m =>
        m.ma_kh === adjustTarget.ma_kh
          ? { ...m, points: res.new_points, tier: res.new_tier }
          : m
      ));
      setAdjustTarget(null);
    } catch (e: any) {
      showToast(e.message || 'Có lỗi xảy ra', 'error');
    } finally {
      setAdjusting(false);
    }
  };

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout
      activeItem="loyalty"
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      breadcrumb={[{ label: 'Khách hàng' }, { label: 'Chương trình thân thiết' }]}
    >
      <div className="loyalty-page-content">

        {/* HEADER */}
        <div className="page-header-flex">
          <div>
            <h1>Skyward Loyalty Dashboard</h1>
            <p>Quản lý chương trình khách hàng thân thiết và tích lũy điểm thực tế từ database.</p>
          </div>
          <div className="action-buttons">
            <Button variant="outline" onClick={fetchAll}>
              <span className="material-icons-round">refresh</span> Làm mới
            </Button>
          </div>
        </div>

        {/* TIER OVERVIEW – live counts */}
        <div className="tier-cards-grid">
          {(['Platinum', 'Gold', 'Silver', 'Member'] as const).map(tier => {
            const cfg = TIER_CONFIG[tier];
            return (
              <Card key={tier} className="tier-summary-card">
                <div className="tier-icon-circle" style={{ color: cfg.color, background: `${cfg.color}18` }}>
                  <span className="material-icons-round">{cfg.icon}</span>
                </div>
                <div className="tier-info">
                  <h3>{tier}</h3>
                  <p>{cfg.points}</p>
                </div>
                <div className="tier-stats">
                  <b>{(stats[tier] || 0).toLocaleString()}</b>
                  <span>khách</span>
                </div>
              </Card>
            );
          })}
        </div>

        {/* TABS */}
        <div className="content-tabs">
          <button className={`tab-link ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>
            <span className="material-icons-round">groups</span> Xếp hạng thành viên
          </button>
          <button className={`tab-link ${activeTab === 'rules' ? 'active' : ''}`} onClick={() => setActiveTab('rules')}>
            <span className="material-icons-round">rule</span> Chính sách tích điểm
          </button>
        </div>

        {activeTab === 'members' ? (
          <Card className="loyalty-data-card">
            <div className="toolbar">
              <div className="search-premium">
                <span className="material-icons-round">search</span>
                <input type="text" placeholder="Tìm thành viên..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <span style={{ fontSize: 13, color: '#94a3b8' }}>{filtered.length} thành viên</span>
            </div>

            {loading ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                <span className="material-icons-round" style={{ fontSize: 48 }}>hourglass_top</span>
                <p style={{ marginTop: 8 }}>Đang tải dữ liệu...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
                <span className="material-icons-round" style={{ fontSize: 48 }}>group_off</span>
                <p style={{ marginTop: 8 }}>Không tìm thấy thành viên nào</p>
              </div>
            ) : (
              <div className="table-overflow">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>THÀNH VIÊN</th>
                      <th>HẠNG</th>
                      <th>ĐIỂM TÍCH LŨY</th>
                      <th>NGÀY THAM GIA</th>
                      <th>TIẾN TRÌNH</th>
                      <th>HÀNH ĐỘNG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(m => {
                      const pct = Math.min(Math.round((m.points / 50000) * 100), 100);
                      return (
                        <tr key={m.id}>
                          <td>
                            <div className="user-info">
                              <div className="avatar-sm">{m.initials}</div>
                              <div>
                                <p className="name">{m.name}</p>
                                <p className="uid">{m.id}</p>
                              </div>
                            </div>
                          </td>
                          <td><span className={`tier-tag ${m.tier.toLowerCase()}`}>{m.tier}</span></td>
                          <td><b className="points-val">{m.points.toLocaleString()} pts</b></td>
                          <td><span className="date-val">{m.joined}</span></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 140 }}>
                              <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: '#2563eb', borderRadius: 3 }} />
                              </div>
                              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{pct}%</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="action-circle-btn" title="Điều chỉnh điểm"
                                onClick={() => { setAdjustTarget(m); setAdjustForm({ loai_gd: 'CONG', so_diem: '', ly_do: '' }); }}>
                                <span className="material-icons-round">edit</span>
                              </button>
                              <button className="action-circle-btn" title="Lịch sử điểm"
                                onClick={() => openHistory(m)}>
                                <span className="material-icons-round">history</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        ) : (
          <div className="rules-grid">
            <Card className="rule-card">
              <div className="rule-header">
                <span className="material-icons-round text-success">add_task</span>
                <h3>Cơ chế tích lũy điểm</h3>
              </div>
              <ul className="rule-list">
                <li><span className="bullet" />Vé nội địa: 10,000đ = <b>1 điểm</b></li>
                <li><span className="bullet" />Vé quốc tế: 10,000đ = <b>1.5 điểm</b></li>
                <li><span className="bullet" />Hành lý thêm: 10,000đ = <b>2 điểm</b></li>
              </ul>
            </Card>
            <Card className="rule-card">
              <div className="rule-header">
                <span className="material-icons-round text-primary">card_giftcard</span>
                <h3>Chính sách đổi thưởng</h3>
              </div>
              <ul className="rule-list">
                <li><span className="bullet" />1,000 điểm = Giảm <b>100,000đ</b></li>
                <li><span className="bullet" />5,000 điểm = Miễn phí <b>20kg hành lý</b></li>
                <li><span className="bullet" />20,000 điểm = Vé khứ hồi nội địa <b>0đ</b></li>
              </ul>
            </Card>
          </div>
        )}
      </div>

      {/* ADJUST POINTS MODAL */}
      {adjustTarget && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: 440 }}>
            <h3>Điều chỉnh điểm – {adjustTarget.name}</h3>
            <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>
              Điểm hiện tại: <b style={{ color: '#2563eb' }}>{adjustTarget.points.toLocaleString()} pts</b> · Hạng: <b>{adjustTarget.tier}</b>
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="form-label">Loại giao dịch</label>
                <select value={adjustForm.loai_gd}
                  onChange={e => setAdjustForm({ ...adjustForm, loai_gd: e.target.value })}
                  className="input-field">
                  <option value="CONG">➕ Cộng điểm</option>
                  <option value="TRU">➖ Trừ điểm</option>
                </select>
              </div>
              <div>
                <label className="form-label">Số điểm <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="number" min={1} value={adjustForm.so_diem}
                  onChange={e => setAdjustForm({ ...adjustForm, so_diem: e.target.value })}
                  className="input-field" placeholder="VD: 500" />
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <label className="form-label">Lý do</label>
              <input type="text" value={adjustForm.ly_do}
                onChange={e => setAdjustForm({ ...adjustForm, ly_do: e.target.value })}
                className="input-field" placeholder="VD: Bù điểm chuyến bay bị delay" />
            </div>
            <div className="modal-actions">
              <Button variant="outline" onClick={() => setAdjustTarget(null)}>Hủy</Button>
              <Button onClick={handleAdjust} disabled={adjusting}>{adjusting ? 'Đang lưu...' : 'Xác nhận'}</Button>
            </div>
          </div>
        </div>
      )}

      {/* HISTORY DRAWER */}
      {historyMember && (
        <div className="modal-backdrop" onClick={() => setHistoryMember(null)}>
          <div className="modal-card" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0 }}>Lịch sử điểm – {historyMember.name}</h3>
              <button onClick={() => setHistoryMember(null)}
                style={{ border: 'none', background: '#f1f5f9', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>
                <span className="material-icons-round" style={{ fontSize: 20 }}>close</span>
              </button>
            </div>
            {historyLoading ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Đang tải...</div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>Chưa có giao dịch điểm nào</div>
            ) : (
              <div style={{ maxHeight: 400, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {history.map(h => (
                  <div key={h.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 16px', borderRadius: 10,
                    background: h.type === 'CONG' ? '#f0fdf4' : '#fef2f2',
                    border: `1px solid ${h.type === 'CONG' ? '#bbf7d0' : '#fecaca'}`
                  }}>
                    <div>
                      <p style={{ fontWeight: 700, color: '#1e293b', margin: 0, fontSize: 14 }}>{h.reason || 'Giao dịch điểm'}</p>
                      <p style={{ color: '#94a3b8', fontSize: 12, margin: '2px 0 0' }}>{h.date}</p>
                    </div>
                    <span style={{ fontWeight: 800, fontSize: 16, color: h.type === 'CONG' ? '#16a34a' : '#dc2626' }}>
                      {h.type === 'CONG' ? '+' : '-'}{h.points.toLocaleString()} pts
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .loyalty-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .page-header-flex { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
        .page-header-flex h1 { font-size:24px; color:#1e293b; }
        .page-header-flex p { font-size:14px; color:#64748b; }
        .action-buttons { display:flex; gap:12px; }
        .tier-cards-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-bottom:32px; }
        .tier-summary-card { display:flex; align-items:center; gap:16px; padding:20px; border:none; }
        .tier-icon-circle { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
        .tier-info h3 { font-size:16px; color:#1e293b; margin-bottom:2px; }
        .tier-info p { font-size:11px; color:#94a3b8; font-weight:600; }
        .tier-stats { margin-left:auto; text-align:right; }
        .tier-stats b { display:block; font-size:18px; color:#1e293b; }
        .tier-stats span { font-size:11px; color:#94a3b8; font-weight:700; text-transform:uppercase; }
        .content-tabs { display:flex; gap:8px; margin-bottom:24px; border-bottom:1px solid #f1f5f9; padding-bottom:12px; }
        .tab-link { display:flex; align-items:center; gap:8px; padding:8px 16px; border:none; background:transparent; font-size:14px; font-weight:600; color:#64748b; cursor:pointer; border-radius:8px; transition:all 0.2s; }
        .tab-link:hover { background:#f8fafc; color:#2563eb; }
        .tab-link.active { background:#eff6ff; color:#2563eb; }
        .loyalty-data-card { padding:0; overflow:hidden; border:none; }
        .toolbar { padding:16px 24px; border-bottom:1px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; background:#fafbfc; }
        .search-premium { display:flex; align-items:center; gap:10px; background:white; border:1px solid #e2e8f0; border-radius:10px; padding:6px 14px; width:280px; }
        .search-premium input { border:none; outline:none; font-size:13px; width:100%; }
        .search-premium .material-icons-round { color:#94a3b8; font-size:18px; }
        .table-overflow { width:100%; overflow-x:auto; }
        .premium-table { width:100%; border-collapse:collapse; }
        .premium-table th { padding:14px 24px; font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:1px; border-bottom:1px solid #f1f5f9; background:#f8fafc; text-align:left; }
        .premium-table td { padding:16px 24px; border-bottom:1px solid #f1f5f9; }
        .user-info { display:flex; align-items:center; gap:12px; }
        .avatar-sm { width:32px; height:32px; border-radius:50%; background:#e0e7ff; color:#4f46e5; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:12px; flex-shrink:0; }
        .user-info .name { font-size:14px; font-weight:700; color:#1e293b; margin-bottom:2px; }
        .user-info .uid { font-size:11px; color:#94a3b8; font-weight:600; }
        .tier-tag { padding:3px 10px; border-radius:20px; font-size:11px; font-weight:800; text-transform:uppercase; }
        .tier-tag.platinum { background:#1e293b; color:white; }
        .tier-tag.gold { background:#fef3c7; color:#b45309; }
        .tier-tag.silver { background:#f1f5f9; color:#475569; }
        .tier-tag.member { background:#f8fafc; color:#94a3b8; border:1px solid #e2e8f0; }
        .points-val { font-size:14px; color:#2563eb; }
        .date-val { font-size:13px; color:#64748b; font-weight:500; }
        .action-circle-btn { width:32px; height:32px; border-radius:50%; border:none; background:#f8fafc; color:#94a3b8; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; }
        .action-circle-btn:hover { background:#eff6ff; color:#2563eb; }
        .action-circle-btn .material-icons-round { font-size:16px; }
        .rules-grid { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .rule-card { padding:24px; border:none; }
        .rule-header { display:flex; align-items:center; gap:12px; margin-bottom:20px; }
        .rule-header h3 { font-size:16px; color:#1e293b; margin:0; }
        .rule-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:16px; }
        .rule-list li { display:flex; align-items:center; gap:12px; font-size:14px; color:#475569; }
        .bullet { width:6px; height:6px; border-radius:50%; background:#cbd5e1; flex-shrink:0; }
        .text-success { color:#10b981; }
        .text-primary { color:#2563eb; }
        .modal-backdrop { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.6); backdrop-filter:blur(4px); z-index:1000; display:flex; justify-content:center; align-items:center; animation:fadeIn 0.2s; }
        .modal-card { background:white; border-radius:20px; width:100%; max-width:500px; padding:32px; box-shadow:0 20px 40px rgba(0,0,0,0.2); }
        .modal-card h3 { font-size:20px; font-weight:800; color:#0f172a; margin:0 0 8px; }
        .form-label { display:block; font-size:13px; font-weight:700; color:#475569; margin-bottom:8px; }
        .input-field { width:100%; padding:10px 14px; border:1px solid #e2e8f0; border-radius:10px; font-size:14px; color:#1e293b; background:#f8fafc; outline:none; transition:border-color 0.2s; box-sizing:border-box; }
        .input-field:focus { border-color:#2563eb; background:white; }
        .modal-actions { display:flex; justify-content:flex-end; gap:12px; margin-top:24px; }
      `}</style>
    </AppLayout>
  );
};

export default LoyaltyPage;
