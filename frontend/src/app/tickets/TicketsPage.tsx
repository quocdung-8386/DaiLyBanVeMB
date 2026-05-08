import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

interface TicketsPageProps {
  onNavigate?: (id: string) => void;
  onCheckout?: (ticket: any) => void;
}

const passengers: Record<string, { name: string; seat: string; dob: string; passport: string; tier: string }[]> = {
  'VE-001': [
    { name: 'Nguyễn Văn An', seat: '14A', dob: '15/03/1990', passport: 'B1234567', tier: 'Gold' },
    { name: 'Nguyễn Thị Lan', seat: '14B', dob: '22/07/1992', passport: 'B1234568', tier: 'Silver' },
  ],
  'VE-002': [
    { name: 'Trần Thị Bé', seat: '22C', dob: '01/01/1985', passport: 'C9876543', tier: 'Platinum' },
  ],
  'VE-003': [
    { name: 'Lê Hữu Đạt', seat: '8B', dob: '10/11/1995', passport: 'D1112223', tier: 'Member' },
    { name: 'Lê Thị Hoa', seat: '8C', dob: '05/06/1997', passport: 'D1112224', tier: 'Member' },
    { name: 'Lê Văn Bình', seat: '8D', dob: '30/09/1988', passport: 'D1112225', tier: 'Silver' },
  ],
  'VE-004': [
    { name: 'Phạm Tuấn Khải', seat: '31F', dob: '20/02/1980', passport: 'E5556667', tier: 'Gold' },
  ],
};

const tickets = [
  { id: 'VE-001', pnr: 'G7X9PQ', flight: 'VN123', from: 'SGN', to: 'HAN', date: '24/10/2023', time: '08:30', total: '6,500,000', status: 'Đang hiệu lực', badge: 'success', pax: 2, airline: 'Vietnam Airlines' },
  { id: 'VE-002', pnr: 'A2B4C6', flight: 'VJ456', from: 'DAD', to: 'SGN', date: '25/10/2023', time: '14:15', total: '1,890,000', status: 'Đã hủy', badge: 'danger', pax: 1, airline: 'Vietjet Air' },
  { id: 'VE-003', pnr: 'L9M1N2', flight: 'VN789', from: 'HAN', to: 'PQC', date: '28/10/2023', time: '09:40', total: '12,300,000', status: 'Đã hoàn tiền', badge: 'warning', pax: 3, airline: 'Vietnam Airlines' },
  { id: 'VE-004', pnr: 'X7Y8Z9', flight: 'QH321', from: 'SGN', to: 'HPH', date: '02/11/2023', time: '18:00', total: '2,450,000', status: 'Đã Void', badge: 'default', pax: 1, airline: 'Bamboo Airways' },
];

const tierColors: Record<string, { bg: string; color: string }> = {
  Platinum: { bg: '#1f2937', color: 'white' },
  Gold:     { bg: '#fef3c7', color: '#b45309' },
  Silver:   { bg: '#f3f4f6', color: '#4b5563' },
  Member:   { bg: '#eff6ff', color: '#1d4ed8' },
};

const TicketsPage: React.FC<TicketsPageProps> = ({ onNavigate, onCheckout }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState<'issue' | 'exchange' | 'refund' | null>(null);
  const [isAddPaxModalOpen, setIsAddPaxModalOpen] = useState(false);
  const [newPax, setNewPax] = useState({ name: '', seat: '', type: 'Người lớn' });
  const [passengersData, setPassengersData] = useState(passengers);
  const [viewingTicket, setViewingTicket] = useState<any>(null);

  const selected = tickets.find(t => t.id === selectedId) ?? null;
  const paxList = selectedId ? (passengersData[selectedId] ?? []) : [];

  const handleAddPax = () => {
    if (!selectedId || !newPax.name) return;
    const currentPax = passengersData[selectedId] || [];
    setPassengersData({
      ...passengersData,
      [selectedId]: [...currentPax, { name: newPax.name.toUpperCase(), seat: newPax.seat || '--', dob: '--', passport: '--', tier: 'Member' }]
    });
    setIsAddPaxModalOpen(false);
    setNewPax({ name: '', seat: '', type: 'Người lớn' });
  };

  const filtered = tickets.filter(t => {
    if (filterStatus !== 'all' && t.badge !== filterStatus) return false;
    if (filterAirline !== 'all' && t.airline !== filterAirline) return false;
    
    const searchMatch = !search || 
      t.pnr.toLowerCase().includes(search.toLowerCase()) || 
      t.flight.toLowerCase().includes(search.toLowerCase()) ||
      (passengersData[t.id] || []).some(p => p.name.toLowerCase().includes(search.toLowerCase()));
      
    return searchMatch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title="Vé máy bay — Ticket Management" />

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* ── LEFT PANEL: Ticket List ── */}
          <div style={{ flex: selectedId ? '0 0 54%' : '1', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'flex 0.3s ease' }}>
            <div style={{ padding: '24px 24px 0' }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b', marginBottom: 16 }}>
                <span style={{ color: '#2563eb', cursor: 'pointer' }} onClick={() => onNavigate?.('flights')}>Chuyến bay</span>
                <span className="material-icons-round" style={{ fontSize: 16 }}>chevron_right</span>
                <span style={{ color: '#1e293b' }}>Vé máy bay</span>
              </div>

              {/* Page Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Danh sách Vé</h1>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Click vào vé để xem danh sách hành khách</p>
                </div>
                <button onClick={() => onNavigate?.('flights')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  <span className="material-icons-round" style={{ fontSize: 18 }}>add</span>
                  Tạo vé mới
                </button>
              </div>

              {/* Stats bar */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Tổng vé', value: '128', icon: 'confirmation_number', color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Đang hiệu lực', value: '84', icon: 'check_circle', color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Đã hủy', value: '23', icon: 'cancel', color: '#dc2626', bg: '#fef2f2' },
                  { label: 'Tổng hành khách', value: '312', icon: 'groups', color: '#7c3aed', bg: '#f5f3ff' },
                ].map((s, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span className="material-icons-round" style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 11, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</p>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>{s.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div style={{ background: 'white', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', background: '#f8fafc' }}>
                  <span className="material-icons-round" style={{ fontSize: 18, color: '#94a3b8' }}>search</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm PNR, mã chuyến bay..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#1e293b' }} />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#475569', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="success">Đang hiệu lực</option>
                  <option value="danger">Đã hủy</option>
                  <option value="warning">Đã hoàn tiền</option>
                  <option value="default">Đã Void</option>
                </select>
                <select value={filterAirline} onChange={e => setFilterAirline(e.target.value)} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#475569', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">Tất cả hãng</option>
                  <option value="Vietnam Airlines">Vietnam Airlines</option>
                  <option value="Vietjet Air">Vietjet Air</option>
                  <option value="Bamboo Airways">Bamboo Airways</option>
                </select>
              </div>
            </div>

            {/* Ticket Cards */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(t => {
                const isActive = selectedId === t.id;
                const badgeStyles: Record<string, { bg: string; color: string; dot: string }> = {
                  success: { bg: '#dcfce7', color: '#15803d', dot: '#16a34a' },
                  danger:  { bg: '#fee2e2', color: '#b91c1c', dot: '#dc2626' },
                  warning: { bg: '#fef9c3', color: '#92400e', dot: '#d97706' },
                  default: { bg: '#f1f5f9', color: '#475569', dot: '#94a3b8' },
                };
                const bs = badgeStyles[t.badge] ?? badgeStyles.default;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedId(isActive ? null : t.id)}
                    style={{
                      background: 'white',
                      border: `2px solid ${isActive ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: 14,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: isActive ? '0 4px 20px rgba(37,99,235,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ background: isActive ? '#1e40af' : '#f8fafc', borderRadius: 8, padding: '6px 10px', border: '1px solid #e2e8f0' }}>
                          <span className="material-icons-round" style={{ fontSize: 20, color: isActive ? 'white' : '#64748b' }}>confirmation_number</span>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>MÃ VÉ</p>
                          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{t.id}</p>
                        </div>
                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 10px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#1d4ed8', fontSize: 13 }}>PNR: {t.pnr}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ background: bs.bg, color: bs.color, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: bs.dot, display: 'inline-block' }} />
                          {t.status}
                        </span>
                        <span className="material-icons-round" style={{ fontSize: 18, color: isActive ? '#2563eb' : '#94a3b8', transition: 'transform 0.2s', transform: isActive ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {/* Route */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>{t.from}</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                          <span className="material-icons-round" style={{ fontSize: 18, color: '#2563eb', transform: 'rotate(45deg)' }}>flight</span>
                          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>{t.to}</span>
                      </div>

                      <div style={{ width: 1, height: 36, background: '#e2e8f0', margin: '0 12px' }} />

                      {/* Meta */}
                      <div style={{ display: 'flex', gap: 20 }}>
                        <div>
                          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Chuyến bay</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{t.flight}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Ngày bay</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{t.date} {t.time}</p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Hành khách</p>
                          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#7c3aed' }}>
                            <span className="material-icons-round" style={{ fontSize: 14, verticalAlign: 'middle' }}>group</span> {(passengersData[t.id] || []).length} khách
                          </p>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 10, color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Tổng tiền</p>
                          <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: '#1e40af' }}>{t.total}đ</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── RIGHT PANEL: Passenger List ── */}
          {selected && (
            <div style={{ flex: '0 0 46%', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: 'white', animation: 'slideInRight 0.25s cubic-bezier(.34,1.56,.64,1)' }}>
              {/* Panel Header */}
              <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #0f2460 0%, #1e40af 60%, #3b82f6 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh sách hành khách</p>
                    <h2 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 900, color: 'white' }}>Vé {selected.id}</h2>
                  </div>
                  <button onClick={() => setSelectedId(null)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <span className="material-icons-round" style={{ fontSize: 18 }}>close</span>
                  </button>
                </div>

                {/* Flight info strip */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.12)', borderRadius: 12, padding: '12px 14px' }}>
                  <span style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'monospace' }}>{selected.from}</span>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%' }}>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.3)' }} />
                      <span className="material-icons-round" style={{ fontSize: 20, color: 'white', transform: 'rotate(45deg)' }}>flight</span>
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.3)' }} />
                    </div>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>{selected.flight} · {selected.airline}</span>
                  </div>
                  <span style={{ fontSize: 26, fontWeight: 900, color: 'white', fontFamily: 'monospace' }}>{selected.to}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-icons-round" style={{ fontSize: 14 }}>calendar_today</span> {selected.date}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span className="material-icons-round" style={{ fontSize: 14 }}>schedule</span> {selected.time}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span className="material-icons-round" style={{ fontSize: 14 }}>groups</span> {(passengersData[selected.id] || []).length} hành khách
                  </span>
                </div>
              </div>

              {/* Passenger count */}
              <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                  <span className="material-icons-round" style={{ fontSize: 16, verticalAlign: 'middle', color: '#7c3aed', marginRight: 4 }}>group</span>
                  {paxList.length} hành khách trên vé này
                </p>
                <button 
                  onClick={() => setIsAddPaxModalOpen(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 8, color: '#1d4ed8', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}
                >
                  <span className="material-icons-round" style={{ fontSize: 15 }}>person_add</span>
                  Thêm khách
                </button>
              </div>

              {/* Passenger List */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {paxList.map((p, i) => {
                  const tc = tierColors[p.tier] ?? tierColors.Member;
                  const initials = p.name.split(' ').map((w: string) => w[0]).slice(-2).join('').toUpperCase();
                  return (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.2s' }}>
                      {/* Avatar */}
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{p.name}</p>
                          <span style={{ background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{p.tier}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#64748b' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-icons-round" style={{ fontSize: 13 }}>airline_seat_recline_normal</span> Ghế {p.seat}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-icons-round" style={{ fontSize: 13 }}>perm_identity</span> {p.passport}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-icons-round" style={{ fontSize: 13 }}>cake</span> {p.dob}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button 
                          title="Xem hồ sơ" 
                          onClick={() => setViewingTicket({ ...p, ticket: selected })}
                          style={{ background: '#eff6ff', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}
                        >
                          <span className="material-icons-round" style={{ fontSize: 16 }}>visibility</span>
                        </button>
                        <button 
                          title="Xóa khách" 
                          onClick={() => {
                            if (window.confirm(`Xóa hành khách ${p.name}?`)) {
                              setPassengersData({
                                ...passengersData,
                                [selected.id]: (passengersData[selected.id] || []).filter((_, idx) => idx !== i)
                              });
                            }
                          }}
                          style={{ background: '#fef2f2', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626' }}
                        >
                          <span className="material-icons-round" style={{ fontSize: 16 }}>delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Panel Footer */}
              <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: 10 }}>
                <button 
                  onClick={() => setActionType('issue')}
                  style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <span className="material-icons-round" style={{ fontSize: 17 }}>receipt_long</span> Xuất vé
                </button>
                <button 
                  onClick={() => setActionType('exchange')}
                  style={{ flex: 1, padding: '10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, color: '#475569', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <span className="material-icons-round" style={{ fontSize: 17 }}>swap_horiz</span> Đổi vé
                </button>
                <button 
                  onClick={() => setActionType('refund')}
                  style={{ flex: 1, padding: '10px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 10, color: '#dc2626', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <span className="material-icons-round" style={{ fontSize: 17 }}>assignment_return</span> Hoàn vé
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modals */}
      {actionType && (
        <div className="modal-overlay" onClick={() => setActionType(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{actionType === 'issue' ? 'Xuất vé máy bay' : actionType === 'exchange' ? 'Yêu cầu đổi vé' : 'Thủ tục hoàn vé'}</h3>
              <button className="close-btn" onClick={() => setActionType(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: actionType === 'refund' ? '#fef2f2' : '#eff6ff', color: actionType === 'refund' ? '#dc2626' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>
                  <span className="material-icons-round">{actionType === 'issue' ? 'receipt_long' : actionType === 'exchange' ? 'swap_horiz' : 'assignment_return'}</span>
                </div>
                <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Xác nhận thực hiện thao tác?</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Hệ thống sẽ ghi nhận yêu cầu {actionType === 'issue' ? 'xuất vé' : actionType === 'exchange' ? 'đổi vé' : 'hoàn vé'} cho mã booking <strong>{selected?.pnr}</strong>.</p>
              </div>
            </div>
            <div className="modal-footer" style={{ gap: 10 }}>
              <button onClick={() => setActionType(null)} style={{ padding: '10px 20px', border: '1px solid #e2e8f0', background: 'white', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Hủy bỏ</button>
              <button 
                onClick={() => { 
                  if (actionType === 'issue') {
                    if (onCheckout && selected) {
                      onCheckout({
                        ...selected,
                        customer: passengersData[selected.id]?.[0]?.name || 'Nhiều khách hàng',
                        routeFrom: selected.from,
                        routeTo: selected.to,
                        airportFrom: selected.from === 'SGN' ? 'Tân Sơn Nhất' : 'Nội Bài',
                        airportTo: selected.to === 'HAN' ? 'Nội Bài' : 'Tân Sơn Nhất',
                        gate: 'B12',
                        terminal: 'T2',
                        seat: passengersData[selected.id]?.[0]?.seat || '14A',
                        boarding: selected.time,
                      });
                    } else {
                      onNavigate?.('issue_ticket');
                    }
                  } else if (actionType === 'exchange') {
                    onNavigate?.('exchange_ticket');
                  } else if (actionType === 'refund') {
                    onNavigate?.('cancel_ticket');
                  }
                  setActionType(null); 
                }} 
                style={{ padding: '10px 20px', border: 'none', background: actionType === 'refund' ? '#dc2626' : '#2563eb', color: 'white', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Ticket Modal */}
      {viewingTicket && (
        <div className="modal-overlay" onClick={() => setViewingTicket(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hồ sơ hành khách</h3>
              <button className="close-btn" onClick={() => setViewingTicket(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                   <div style={{ width: 60, height: 60, borderRadius: 16, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 24 }}>
                     {viewingTicket.name.split(' ').map((w: string) => w[0]).slice(-2).join('').toUpperCase()}
                   </div>
                   <div>
                     <h2 style={{ margin: 0, fontSize: 20 }}>{viewingTicket.name}</h2>
                     <p style={{ margin: 0, color: '#64748b' }}>Hành khách: {viewingTicket.tier}</p>
                   </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, background: '#f8fafc', padding: 16, borderRadius: 12 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>HỘ CHIẾU</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{viewingTicket.passport}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>NGÀY SINH</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{viewingTicket.dob}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>MÃ VÉ</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{viewingTicket.ticket.id}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>SỐ GHẾ</p>
                    <p style={{ margin: 0, fontWeight: 600 }}>{viewingTicket.seat}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={() => setViewingTicket(null)} style={{ padding: '10px 20px', border: 'none', background: '#1e40af', color: 'white', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Đóng</button>
            </div>
          </div>
        </div>
      )}
      {/* Add Passenger Modal */}
      {isAddPaxModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 16, width: 400, padding: 24, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 800 }}>Thêm hành khách mới</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>HỌ VÀ TÊN</label>
                <input 
                  type="text" 
                  value={newPax.name} 
                  onChange={e => setNewPax({...newPax, name: e.target.value})}
                  placeholder="VD: NGUYEN VAN A"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>LOẠI KHÁCH</label>
                  <select 
                    value={newPax.type}
                    onChange={e => setNewPax({...newPax, type: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none' }}
                  >
                    <option>Người lớn</option>
                    <option>Trẻ em</option>
                    <option>Em bé</option>
                  </select>
                </div>
                <div style={{ width: 100 }}>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>CHỖ NGỒI</label>
                  <input 
                    type="text" 
                    value={newPax.seat}
                    onChange={e => setNewPax({...newPax, seat: e.target.value})}
                    placeholder="12A"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button onClick={() => setIsAddPaxModalOpen(false)} style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0', background: 'white', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Hủy bỏ</button>
              <button onClick={handleAddPax} style={{ flex: 1, padding: '10px', border: 'none', background: '#2563eb', color: 'white', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(30px); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .modal-card { background: white; border-radius: 20px; width: 450px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: zoomIn 0.2s ease; }
        @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .modal-header { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 18px; color: #1e293b; }
        .close-btn { background: transparent; border: none; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 24px; }
        .modal-footer { padding: 16px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: flex; justify-content: flex-end; }
      `}</style>
    </div>
  );
};

export default TicketsPage;
