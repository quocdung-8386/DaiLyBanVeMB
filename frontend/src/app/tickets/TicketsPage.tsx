import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AppLayout from '../../components/AppLayout';
import Button from '../../components/Button';

interface TicketsPageProps {
  onNavigate?: (id: string) => void;
  onCheckout?: (ticket: any) => void;
  bookings: any[];
  onUpdateStatus: (id: string, status: string, badge: string) => void;
  onDeleteBooking?: (id: string) => void;
}

const passengers: Record<string, { name: string; seat: string; dob: string; passport: string; tier: string; eTicket: string }[]> = {
  'BK-001': [
    { name: 'Nguyễn Văn An', seat: '14A', dob: '15/03/1990', passport: 'B1234567', tier: 'Gold', eTicket: '738-1234567890' },
    { name: 'Nguyễn Thị Lan', seat: '14B', dob: '22/07/1992', passport: 'B1234568', tier: 'Silver', eTicket: '738-1234567891' },
  ],
  'BK-002': [
    { name: 'Trần Thị Bé', seat: '22C', dob: '01/01/1985', passport: 'C9876543', tier: 'Platinum', eTicket: '975-9876543210' },
  ],
  'BK-003': [
    { name: 'Lê Hữu Đạt', seat: '8B', dob: '10/11/1995', passport: 'D1112223', tier: 'Member', eTicket: '738-5555666670' },
    { name: 'Lê Thị Hoa', seat: '8C', dob: '05/06/1997', passport: 'D1112224', tier: 'Member', eTicket: '738-5555666671' },
    { name: 'Lê Văn Bình', seat: '8D', dob: '30/09/1988', passport: 'D1112225', tier: 'Silver', eTicket: '738-5555666672' },
  ],
  'BK-004': [
    { name: 'Phạm Tuấn Khải', seat: '31F', dob: '20/02/1980', passport: 'E5556667', tier: 'Gold', eTicket: '976-1111222233' },
  ],
  'BK-005': [
    { name: 'Nguyễn Quốc Dũng', seat: '12A', dob: '08/05/1990', passport: 'B83868386', tier: 'Platinum', eTicket: 'Chưa xuất' },
  ],
};

const bookings = [
  { id: 'BK-001', pnr: 'G7X9PQ', flight: 'VN123', from: 'SGN', to: 'HAN', date: '24/10/2023', time: '08:30', total: '6,500,000', status: 'Đã xuất vé', badge: 'success', pax: 2, airline: 'Vietnam Airlines', timeLimit: null, type: 'Khứ hồi' },
  { id: 'BK-002', pnr: 'A2B4C6', flight: 'VJ456', from: 'DAD', to: 'SGN', date: '25/10/2023', time: '14:15', total: '1,890,000', status: 'Đã hủy', badge: 'danger', pax: 1, airline: 'Vietjet Air', timeLimit: null, type: 'Một chiều' },
  { id: 'BK-005', pnr: 'HOLD01', flight: 'QH321', from: 'HAN', to: 'DAD', date: '10/05/2026', time: '10:00', total: '2,150,000', status: 'Chờ thanh toán', badge: 'hold', pax: 1, airline: 'Bamboo Airways', timeLimit: '2026-05-09T18:00:00', type: 'Một chiều' },
  { id: 'BK-003', pnr: 'L9M1N2', flight: 'VN789', from: 'HAN', to: 'PQC', date: '28/10/2023', time: '09:40', total: '12,300,000', status: 'Đã hoàn tiền', badge: 'warning', pax: 3, airline: 'Vietnam Airlines', timeLimit: null, type: 'Khứ hồi' },
  { id: 'BK-004', pnr: 'X7Y8Z9', flight: 'QH321', from: 'SGN', to: 'HPH', date: '02/11/2023', time: '18:00', total: '2,450,000', status: 'Đã Void', badge: 'default', pax: 1, airline: 'Bamboo Airways', timeLimit: null, type: 'Một chiều' },
];

const tierColors: Record<string, { bg: string; color: string }> = {
  Platinum: { bg: '#1f2937', color: 'white' },
  Gold:     { bg: '#fef3c7', color: '#b45309' },
  Silver:   { bg: '#f3f4f6', color: '#4b5563' },
  Member:   { bg: '#eff6ff', color: '#1d4ed8' },
};

const CountdownTimer: React.FC<{ limit: string | null }> = ({ limit }) => {
  const [timeLeft, setTimeLeft] = React.useState('');

  React.useEffect(() => {
    if (!limit) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(limit).getTime() - now;
      if (distance < 0) {
        setTimeLeft('HẾT HẠN');
        clearInterval(timer);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [limit]);

  if (!limit) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#fff7ed', color: '#c2410c', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800, border: '1px solid #ffedd5' }}>
      <span className="material-icons-round" style={{ fontSize: 14 }}>timer</span>
      {timeLeft}
    </div>
  );
};

const TicketsPage: React.FC<TicketsPageProps> = ({ onNavigate, onCheckout, bookings, onUpdateStatus, onDeleteBooking }) => {
  const [bookingsData, setBookingsData] = useState(bookings);
  
  React.useEffect(() => {
    setBookingsData(bookings);
    const updatedPax = { ...passengersData };
    let hasNew = false;
    bookings.forEach(b => {
      if (!updatedPax[b.id]) {
         updatedPax[b.id] = b.passengersList && b.passengersList.length > 0 
           ? b.passengersList.map((p: any, idx: number) => ({
               name: p.name || `HÀNH KHÁCH ${idx+1}`,
               seat: p.seat || (idx === 0 ? (b.seat || '12A') : `12${String.fromCharCode(66+idx)}`),
               dob: '--/--/----',
               passport: '--',
               tier: 'Member',
               eTicket: b.badge === 'success' ? `738-${Math.floor(Math.random()*1000000000) + idx}` : 'Chưa xuất'
             }))
           : [{
               name: b.customer || 'HÀNH KHÁCH MỚI',
               seat: b.seat || '12A',
               dob: '--/--/----',
               passport: '--',
               tier: 'Member',
               eTicket: b.badge === 'success' ? `738-${Math.floor(Math.random()*1000000000)}` : 'Chưa xuất'
             }];
         hasNew = true;
      }
    });
    if (hasNew) {
      setPassengersData(updatedPax);
    }
  }, [bookings]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAirline, setFilterAirline] = useState('all');
  const [search, setSearch] = useState('');
  const [actionType, setActionType] = useState<'issue' | 'void' | 'refund' | 'delete' | null>(null);
  const [isAddPaxModalOpen, setIsAddPaxModalOpen] = useState(false);
  const [newPax, setNewPax] = useState({ name: '', seat: '', type: 'Người lớn' });
  const [passengersData, setPassengersData] = useState(passengers);
  const [viewingTicket, setViewingTicket] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'passengers' | 'history'>('passengers');
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };



  const handleAddPax = () => {
    if (!selectedId || !newPax.name) return;
    const currentPax = passengersData[selectedId] || [];
    setPassengersData({
      ...passengersData,
      [selectedId]: [...currentPax, { name: newPax.name.toUpperCase(), seat: newPax.seat || '--', dob: '--', passport: '--', tier: 'Member', eTicket: 'Chưa xuất' }]
    });
    setIsAddPaxModalOpen(false);
    setNewPax({ name: '', seat: '', type: 'Người lớn' });
  };

  const filtered = bookingsData.filter(t => {
    if (filterStatus !== 'all' && t.badge !== filterStatus) return false;
    if (filterAirline !== 'all' && t.airline !== filterAirline) return false;
    
    const searchMatch = !search || 
      t.pnr.toLowerCase().includes(search.toLowerCase()) || 
      t.flight.toLowerCase().includes(search.toLowerCase()) ||
      t.customer?.toLowerCase().includes(search.toLowerCase()) ||
      (passengersData[t.id] || []).some(p => p.name.toLowerCase().includes(search.toLowerCase()));
      
    return searchMatch;
  });

  const selected = filtered.find(t => t.id === selectedId) ?? null;
  const paxList = selectedId ? (passengersData[selectedId] ?? []) : [];

  const toggleTicketSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedTickets(prev => 
      prev.includes(id) ? prev.filter(tId => tId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: 'void' | 'refund') => {
    if (selectedTickets.length === 0) return;
    const statusText = action === 'void' ? 'Đã Void' : 'Yêu cầu hoàn';
    const badgeType = action === 'void' ? 'default' : 'warning';
    
    setBookingsData(prev => prev.map(t => 
      selectedTickets.includes(t.id) ? { ...t, status: statusText, badge: badgeType as any } : t
    ));
    selectedTickets.forEach(id => onUpdateStatus(id, statusText, badgeType));
    setSelectedTickets([]);
    showToast(`Đã xử lý hàng loạt ${selectedTickets.length} vé thành công!`, 'success');
  };

  return (
    <AppLayout activeItem="tickets" onNavigate={onNavigate || (() => {})}>
      <div className="tickets-page-content" style={{ display: 'flex', alignItems: 'flex-start' }}>

          {/* ── LEFT PANEL: Ticket List ── */}
          <div style={{ flex: selectedId ? '0 0 54%' : '1', display: 'flex', flexDirection: 'column', transition: 'flex 0.3s ease', minWidth: 0 }}>
            <div style={{ padding: '24px 24px 0' }}>

              {/* Page Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: 0 }}>Danh sách Booking</h1>
                  <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0' }}>Click vào đơn để xem danh sách hành khách và vé</p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {selectedTickets.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: '#f1f5f9', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{selectedTickets.length} đã chọn</span>
                      <div style={{ width: 1, height: 20, background: '#cbd5e1' }} />
                      <button onClick={() => handleBulkAction('void')} style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '8px 4px' }}>VOID LOẠT</button>
                      <button onClick={() => handleBulkAction('refund')} style={{ background: 'none', border: 'none', color: '#d97706', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '8px 4px' }}>HOÀN LOẠT</button>
                      <button onClick={() => setSelectedTickets([])} style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 18, cursor: 'pointer' }}>
                        <span className="material-icons-round" style={{ fontSize: 18 }}>close</span>
                      </button>
                    </div>
                  )}
                  <button onClick={() => onNavigate?.('flights')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', background: 'linear-gradient(135deg,#1e40af,#3b82f6)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                    <span className="material-icons-round" style={{ fontSize: 18 }}>add</span>
                    Tạo Booking mới
                  </button>
                </div>
              </div>

              {/* Stats bar */}
              <div style={{ display: 'grid', gridTemplateColumns: selectedId ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Tổng Booking', value: bookingsData.length.toString(), icon: 'receipt_long', color: '#2563eb', bg: '#eff6ff' },
                  { label: 'Đang hiệu lực', value: bookingsData.filter(b => b.badge === 'success' || b.badge === 'hold').length.toString(), icon: 'check_circle', color: '#16a34a', bg: '#dcfce7' },
                  { label: 'Đã hủy / Void', value: bookingsData.filter(b => b.badge === 'danger' || b.badge === 'default').length.toString(), icon: 'cancel', color: '#dc2626', bg: '#fef2f2' },
                  { label: 'Tổng hành khách', value: bookingsData.reduce((acc, b) => acc + (passengersData[b.id]?.length || b.pax || 1), 0).toString(), icon: 'groups', color: '#7c3aed', bg: '#f5f3ff' },
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
              <div style={{ background: 'white', borderRadius: 12, padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16, border: '1px solid #e2e8f0', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', background: '#f8fafc' }}>
                  <span className="material-icons-round" style={{ fontSize: 18, color: '#94a3b8' }}>search</span>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm PNR, mã chuyến bay..." style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 13, width: '100%', color: '#1e293b' }} />
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#475569', background: '#f8fafc', outline: 'none', cursor: 'pointer' }}>
                  <option value="all">Tất cả trạng thái</option>
                  <option value="hold">Chờ thanh toán (Hold)</option>
                  <option value="success">Đã xuất vé</option>
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
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filtered.map(t => {
                const isActive = selectedId === t.id;
                const badgeStyles: Record<string, { bg: string; color: string; dot: string }> = {
                  success: { bg: '#dcfce7', color: '#15803d', dot: '#16a34a' },
                  hold:    { bg: '#fff7ed', color: '#c2410c', dot: '#f97316' },
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
                        <div 
                          onClick={(e) => toggleTicketSelection(t.id, e)}
                          style={{ 
                            width: 20, height: 20, border: '2px solid #cbd5e1', borderRadius: 6, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: selectedTickets.includes(t.id) ? '#2563eb' : 'white',
                            borderColor: selectedTickets.includes(t.id) ? '#2563eb' : '#cbd5e1',
                            transition: 'all 0.2s'
                          }}
                        >
                          {selectedTickets.includes(t.id) && <span className="material-icons-round" style={{ fontSize: 14, color: 'white' }}>check</span>}
                        </div>
                        <div style={{ background: isActive ? '#1e40af' : '#f8fafc', borderRadius: 8, padding: '6px 10px', border: '1px solid #e2e8f0' }}>
                          <span className="material-icons-round" style={{ fontSize: 20, color: isActive ? 'white' : '#64748b' }}>confirmation_number</span>
                        </div>
                        <div>
                          <p style={{ margin: 0, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>MÃ BOOKING</p>
                          <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>{t.id}</p>
                          {t.customer && <p style={{ margin: 0, fontSize: 11, color: '#64748b', fontWeight: 600 }}>{t.customer}</p>}
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

                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>{t.from}</span>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                          <span className="material-icons-round" style={{ fontSize: 18, color: '#2563eb', transform: 'rotate(45deg)' }}>flight</span>
                          <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                        </div>
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', fontFamily: 'monospace' }}>{t.to}</span>
                      </div>
                      
                      {t.badge === 'hold' && <CountdownTimer limit={t.timeLimit} />}
                      
                      <div style={{ width: 1, height: 36, background: '#e2e8f0', margin: '0 12px' }} />

                      {/* Meta */}
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
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
            <div style={{ flex: '0 0 46%', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', background: 'white', animation: 'slideInRight 0.25s cubic-bezier(.34,1.56,.64,1)', minWidth: 0, position: 'sticky', top: 0, maxHeight: 'calc(100vh - 112px)' }}>
              {/* Panel Header */}
              <div style={{ padding: '24px 24px 16px', borderBottom: '1px solid #e2e8f0', background: 'linear-gradient(135deg, #0f2460 0%, #1e40af 60%, #3b82f6 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Danh sách hành khách</p>
                    <h2 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 900, color: 'white' }}>Booking {selected.id}</h2>
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

              <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9' }}>
                <button 
                  onClick={() => setViewMode('passengers')}
                  style={{ flex: 1, padding: '14px', background: 'none', border: 'none', borderBottom: viewMode === 'passengers' ? '3px solid #2563eb' : '3px solid transparent', color: viewMode === 'passengers' ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  HÀNH KHÁCH
                </button>
                <button 
                  onClick={() => setViewMode('history')}
                  style={{ flex: 1, padding: '14px', background: 'none', border: 'none', borderBottom: viewMode === 'history' ? '3px solid #2563eb' : '3px solid transparent', color: viewMode === 'history' ? '#2563eb' : '#64748b', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                >
                  LỊCH SỬ THAO TÁC
                </button>
              </div>

              {viewMode === 'passengers' ? (
                <>
                  <div style={{ padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#1e293b' }}>
                      <span className="material-icons-round" style={{ fontSize: 16, verticalAlign: 'middle', color: '#7c3aed', marginRight: 4 }}>group</span>
                      {paxList.length} hành khách trong booking này
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
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.2s' }}>
                      {/* Avatar */}
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg,#1e40af,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                        {initials}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{p.name}</p>
                          <span style={{ background: tc.bg, color: tc.color, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10 }}>{p.tier}</span>
                        </div>
                        <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#64748b', flexWrap: 'wrap' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <span className="material-icons-round" style={{ fontSize: 13 }}>confirmation_number</span> <b>{p.eTicket}</b>
                          </span>
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
                                [selected.id]: (passengersData[selected.id] || []).filter((_: any, idx: number) => idx !== i)
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
                </>
              ) : (
                <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { time: '08/05/2026 14:30', user: 'Admin', action: 'Tạo booking (Hold)', detail: 'PNR: HOLD01 · Giá: 2,150,000đ' },
                    { time: '08/05/2026 14:35', user: 'Admin', action: 'Thêm hành khách', detail: 'NGUYEN VAN A · Ghế: 12A' },
                    { time: '08/05/2026 15:00', user: 'System', action: 'Gửi thông báo Email', detail: 'Đã gửi xác nhận đặt chỗ cho khách hàng' },
                  ].map((h, i) => (
                    <div key={i} style={{ position: 'relative', paddingLeft: 24, borderLeft: '2px solid #e2e8f0' }}>
                      <div style={{ position: 'absolute', left: -7, top: 0, width: 12, height: 12, borderRadius: '50%', background: '#2563eb', border: '2px solid white' }} />
                      <p style={{ margin: '0 0 4px', fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{h.time} · {h.user}</p>
                      <p style={{ margin: '0 0 2px', fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{h.action}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{h.detail}</p>
                    </div>
                  ))}
                  <div style={{ padding: '20px', background: '#f8fafc', borderRadius: 12, border: '1px dashed #cbd5e1', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>Cuộn xuống để xem thêm lịch sử</p>
                  </div>
                </div>
              )}

              <div style={{ padding: '14px 24px', borderTop: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', gap: 10 }}>
                {selected?.badge === 'hold' && (
                  <button 
                    onClick={() => onCheckout && onCheckout(selected)}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: '#16a34a', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                  >
                    <span className="material-icons-round" style={{ fontSize: 18 }}>payments</span>
                    XUẤT VÉ (ISSUE)
                  </button>
                )}
                {selected?.badge === 'success' && (
                  <>
                    <button 
                      onClick={() => setActionType('refund')}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: 'white', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      <span className="material-icons-round" style={{ fontSize: 18 }}>replay</span>
                      HOÀN VÉ
                    </button>
                    <button 
                      onClick={() => setActionType('void')}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', background: '#0f172a', border: 'none', borderRadius: 8, color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}
                    >
                      <span className="material-icons-round" style={{ fontSize: 18 }}>history_edu</span>
                      VOID VÉ
                    </button>
                  </>
                )}
                {(selected?.badge === 'danger' || selected?.badge === 'default' || selected?.badge === 'warning') && (
                  <button 
                    style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 8, color: '#64748b', fontWeight: 700, fontSize: 13, cursor: 'not-allowed' }}
                    disabled
                  >
                    VÉ ĐÃ {selected?.status?.toUpperCase()}
                  </button>
                )}
                <button 
                  onClick={() => setActionType('delete')}
                  style={{ flex: '0 0 auto', padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Xóa booking vĩnh viễn"
                >
                  <span className="material-icons-round" style={{ fontSize: 18 }}>delete_forever</span>
                </button>
              </div>
            </div>
          )}
        </div>

      {/* Action Modals */}
      {actionType && (
        <div className="modal-overlay" onClick={() => setActionType(null)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{actionType === 'issue' ? 'Xuất vé máy bay' : actionType === 'void' ? 'Hủy vé ngay lập tức (Void)' : actionType === 'delete' ? 'Xóa Booking vĩnh viễn' : 'Yêu cầu hoàn vé (Request Refund)'}</h3>
              <button className="close-btn" onClick={() => setActionType(null)}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: actionType === 'refund' || actionType === 'void' || actionType === 'delete' ? '#fef2f2' : '#eff6ff', color: actionType === 'refund' || actionType === 'void' || actionType === 'delete' ? '#dc2626' : '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>
                  <span className="material-icons-round">{actionType === 'issue' ? 'receipt_long' : actionType === 'void' ? 'dangerous' : actionType === 'delete' ? 'delete_forever' : 'assignment_return'}</span>
                </div>
                <p style={{ fontWeight: 700, color: '#1e293b', marginBottom: 8 }}>Xác nhận thực hiện thao tác?</p>
                <p style={{ fontSize: 14, color: '#64748b' }}>Hệ thống sẽ ghi nhận {actionType === 'issue' ? 'xuất vé' : actionType === 'void' ? 'Void vé' : actionType === 'delete' ? 'xóa hoàn toàn' : 'yêu cầu hoàn vé'} cho mã booking <strong>{selected?.pnr}</strong>.</p>
              </div>
            </div>
            <div className="modal-footer" style={{ gap: 12 }}>
              <Button variant="outline" onClick={() => setActionType(null)}>Hủy bỏ</Button>
              <Button 
                variant={actionType === 'refund' ? 'danger' : 'primary'}
                onClick={() => { 
                  if (actionType === 'issue') {
                    if (selected) {
                      onUpdateStatus(selected.id, 'Đã xuất vé', 'success');
                      if (onCheckout) {
                        onCheckout({
                          ...selected,
                          customer: passengersData[selected.id]?.[0]?.name || 'Nhiều khách hàng',
                          airportFrom: selected.from === 'SGN' ? 'Tân Sơn Nhất' : 'Nội Bài',
                          airportTo: selected.to === 'HAN' ? 'Nội Bài' : 'Tân Sơn Nhất',
                          gate: 'B12',
                          terminal: 'T2',
                          seat: passengersData[selected.id]?.[0]?.seat || '14A',
                          boarding: selected.time,
                        });
                      }
                    }
                  } else if (actionType === 'void') {
                    onUpdateStatus(selectedId!, 'Đã Void', 'default');
                  } else if (actionType === 'refund') {
                    onUpdateStatus(selectedId!, 'Yêu cầu hoàn', 'warning');
                  } else if (actionType === 'delete') {
                    if (onDeleteBooking) onDeleteBooking(selectedId!);
                    setBookingsData(prev => prev.filter(b => b.id !== selectedId));
                    setSelectedId(null);
                  }
                  showToast('Thao tác đã được hệ thống ghi nhận thành công!', 'success');
                  setActionType(null); 
                }} 
              >
                Đồng ý
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Ticket Modal */}
      {viewingTicket && (
        <div className="modal-overlay" onClick={() => setViewingTicket(null)}>
          <div className="modal-card boarding-pass-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header pass-header">
              <div className="pass-logo">
                 <span className="material-icons-round">airplanemode_active</span>
                 <b>SKYWARD AIRLINES</b>
              </div>
              <div className="pass-type">BOARDING PASS</div>
            </div>
            <div className="pass-body">
              <div className="pass-main-info">
                 <div className="pass-row">
                    <div className="pass-col">
                       <label>PASSENGER NAME</label>
                       <b>{viewingTicket.name}</b>
                    </div>
                    <div className="pass-col" style={{textAlign:'right'}}>
                       <label>FLIGHT</label>
                       <b>{viewingTicket.ticket.flight}</b>
                    </div>
                 </div>
                 <div className="pass-row mt-md">
                    <div className="pass-col">
                       <label>FROM</label>
                       <h2 className="city-code">{viewingTicket.ticket.from}</h2>
                    </div>
                    <div className="pass-airplane">
                       <span className="material-icons-round">flight_takeoff</span>
                    </div>
                    <div className="pass-col" style={{textAlign:'right'}}>
                       <label>TO</label>
                       <h2 className="city-code">{viewingTicket.ticket.to}</h2>
                    </div>
                 </div>
                 <div className="pass-grid-4 mt-lg">
                    <div className="pass-col"><label>DATE</label><b>{viewingTicket.ticket.date}</b></div>
                    <div className="pass-col"><label>BOARDING</label><b>{viewingTicket.ticket.time}</b></div>
                    <div className="pass-col"><label>GATE</label><b>B12</b></div>
                    <div className="pass-col"><label>SEAT</label><b className="seat-highlight">{viewingTicket.seat}</b></div>
                 </div>
              </div>
              <div className="pass-barcode-section">
                 <div className="qr-placeholder">
                    <span className="material-icons-round">qr_code_2</span>
                 </div>
                 <p className="pnr-text">PNR: {viewingTicket.ticket.pnr}</p>
              </div>
            </div>
            <div className="pass-details-footer">
               <div className="detail-sec">
                  <h4><span className="material-icons-round">history</span> Lịch sử giao dịch</h4>
                  <div className="history-list">
                     <p><span>08/05/2026</span> <b>Thanh toán thành công</b> <span>+3,250,000đ</span></p>
                     <p><span>08/05/2026</span> <b>Phí đổi hành trình</b> <span>+500,000đ</span></p>
                  </div>
               </div>
               <div className="detail-sec">
                  <h4><span className="material-icons-round">luggage</span> Thông tin hành lý</h4>
                  <p>Hành lý xách tay: 7kg | Hành lý ký gửi: 20kg</p>
               </div>
            </div>
            <div className="modal-footer" style={{ gap: 12 }}>
               <Button variant="outline" onClick={() => setViewingTicket(null)}>Đóng</Button>
               <Button onClick={() => window.print()}><span className="material-icons-round">print</span> In Boarding Pass</Button>
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
              <Button variant="outline" fullWidth onClick={() => setIsAddPaxModalOpen(false)}>Hủy bỏ</Button>
              <Button fullWidth onClick={handleAddPax}>Xác nhận</Button>
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
        .boarding-pass-modal { width: 700px; padding: 0; }
        .pass-header { background: #0f172a; color: white; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
        .pass-logo { display: flex; align-items: center; gap: 8px; font-size: 14px; }
        .pass-type { font-size: 11px; font-weight: 800; letter-spacing: 2px; opacity: 0.7; }
        .pass-body { display: flex; padding: 32px; gap: 40px; border-bottom: 1px dashed #e2e8f0; }
        .pass-main-info { flex: 1; }
        .pass-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .pass-col label { display: block; font-size: 10px; color: #94a3b8; font-weight: 700; margin-bottom: 4px; }
        .pass-col b { font-size: 16px; color: #1e293b; }
        .city-code { font-size: 42px; font-weight: 900; color: #0f172a; margin: 0; line-height: 1; }
        .pass-airplane { color: #2563eb; }
        .pass-airplane .material-icons-round { font-size: 32px; }
        .pass-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .seat-highlight { color: #2563eb !important; font-size: 24px !important; }
        .pass-barcode-section { width: 120px; display: flex; flex-direction: column; align-items: center; justify-content: center; border-left: 1px solid #f1f5f9; padding-left: 40px; }
        .qr-placeholder { width: 100px; height: 100px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .qr-placeholder .material-icons-round { font-size: 64px; color: #0f172a; }
        .pnr-text { margin: 12px 0 0; font-size: 12px; font-weight: 800; color: #64748b; font-family: monospace; }
        .pass-details-footer { padding: 24px 32px; display: flex; gap: 40px; background: #f8fafc; }
        .detail-sec { flex: 1; }
        .detail-sec h4 { margin: 0 0 12px; font-size: 13px; color: #1e293b; display: flex; align-items: center; gap: 6px; }
        .detail-sec h4 .material-icons-round { font-size: 18px; color: #2563eb; }
        .history-list p { margin: 0 0 8px; font-size: 12px; color: #475569; display: flex; justify-content: space-between; }
        .detail-sec p { margin: 0; font-size: 12px; color: #64748b; }
        .mt-md { margin-top: 16px; }
        .mt-lg { margin-top: 24px; }
        .tickets-page-content { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        /* Toast Styles */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-notification.success { background: #10b981; }
        .toast-notification.error { background: #ef4444; }
        .toast-notification button { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; opacity: 0.8; margin-left: 24px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.2); }
        .toast-notification button:hover { opacity: 1; }
      `}</style>
        {toast.visible && (
          <div className={`toast-notification ${toast.type}`}>
            <span className="material-icons-round">{toast.type === 'success' ? 'check_circle' : 'error'}</span>
            <span>{toast.message}</span>
            <button onClick={() => setToast({ ...toast, visible: false })}><span className="material-icons-round" style={{ fontSize: 18 }}>close</span></button>
          </div>
        )}
      </AppLayout>
  );
};

export default TicketsPage;
