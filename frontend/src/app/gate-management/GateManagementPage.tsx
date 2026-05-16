import React, { useState, useEffect, useMemo } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { api } from '../../api';
import { showToast } from '../../components/AppLayout';

interface GateManagementPageProps {
  onNavigate: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const AIRPORT_GATES: Record<string, string[]> = {
  'HAN': ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', 'B1', 'B2', 'B3'],
  'SGN': ['11', '12', '14', '15', '16', '17', '18', '19', '20', '21', 'A1', 'A2', 'A3'],
  'DAD': ['D1', 'D2', 'D3', 'D4', 'D5'],
  'PQC': ['P1', 'P2', 'P3'],
  'HPH': ['H1', 'H2']
};

const GateManagementPage: React.FC<GateManagementPageProps> = ({ 
  onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount 
}) => {
  const [flights, setFlights] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string>('');
  const [gateStatus, setGateStatus] = useState<'OPEN' | 'BOARDING' | 'CLOSED'>('OPEN');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [flightsData, bookingsData] = await Promise.all([
        api.getFlights(),
        api.getBookings()
      ]);
      setFlights(flightsData);
      setBookings(bookingsData);
      
      if (!selectedFlightId && flightsData.length > 0) {
        setSelectedFlightId(flightsData[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); 
    return () => clearInterval(interval);
  }, [selectedFlightId]);

  const activeFlightData = useMemo(() => {
    return flights.find(f => f.id === selectedFlightId) || { 
      id: '---', from: '---', to: '---', date: '---', gate: '--', aircraft: 'A321', status: 'Scheduled', time: '20:30'
    };
  }, [flights, selectedFlightId]);

  const allPassengers = React.useMemo(() => {
    return bookings
      .filter(b => b.flight === selectedFlightId && (
        b.status === 'Đã Check-in' || 
        b.status === 'Đã Check-In' ||
        b.status === 'Boarded' || 
        b.status === 'Đã lên tàu' ||
        b.badge === 'success'
      ))
      .flatMap(b => {
        const pList = b.passengersList || [];
        return pList.map((p: any, idx: number) => ({
          id: p.id || `${b.id}-${idx}`,
          bookingId: b.id,
          pnr: b.pnr,
          name: p.name,
          seat: p.seat || '---',
          status: p.status || b.status,
          baggage: b.extraServices?.baggage?.[idx] || { weight: 0 },
          meal: b.extraServices?.meals?.[idx] || { selected: false }
        }));
      });
  }, [bookings, selectedFlightId]);

  const filteredPassengers = allPassengers.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.seat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pnr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const boardedCount = allPassengers.filter(p => p.status === 'Boarded').length;
  const totalCount = allPassengers.length;

  const handleScanBoarding = async (paxId: string, bId: string, currentStatus: string) => {
    if (currentStatus !== 'Đã Check-in' && currentStatus !== 'Đã Check-In') {
      showToast(`Lỗi: Hành khách chưa Check-in (Trạng thái hiện tại: ${currentStatus})`, 'error');
      return;
    }
    
    try {
      await api.updateBooking(bId, { status: 'Boarded', badge: 'success' });
      showToast(`Hành khách ${paxId.split('-')[0]} đã lên tàu thành công`, 'success');
      window.dispatchEvent(new CustomEvent('reload-data')); 
    } catch (err) {
      showToast("Lỗi khi cập nhật trạng thái Boarding", 'error');
    }
  };

  const handleUpdateFlightGate = async (newGate: string) => {
    try {
      await api.updateFlight(selectedFlightId, { gate: newGate });
      showToast(`Đã cập nhật cửa khởi hành: ${newGate}`, 'success');
      window.dispatchEvent(new CustomEvent('reload-data'));
    } catch (err) {
      showToast("Lỗi khi cập nhật cửa khởi hành", 'error');
    }
  };

  return (
    <AppLayout 
      activeItem="gate-management" 
      onNavigate={onNavigate}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      breadcrumb={[{ label: 'Điều hành', page: 'dashboard' }, { label: 'Cửa khởi hành' }]}
    >
      <div className="gate-dashboard">
        <div className="dashboard-header-premium">
          <div className="flight-selector-glass">
            <div className="selector-icon"><span className="material-icons-round">flight</span></div>
            <div className="selector-content">
              <label>ĐANG ĐIỀU HÀNH</label>
              <select value={selectedFlightId} onChange={(e) => setSelectedFlightId(e.target.value)}>
                {flights.map(f => (
                  <option key={f.id} value={f.id}>{f.flight} ({f.from}-{f.to})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flight-route-display">
             <div className="route-node"><h2>{activeFlightData.from}</h2><p>Khởi hành</p></div>
             <div className="route-visual-animated">
                <div className="line"></div>
                <span className="material-icons-round">airplanemode_active</span>
             </div>
             <div className="route-node text-right"><h2>{activeFlightData.to}</h2><p>Điểm đến</p></div>
          </div>

          <div className="gate-aircraft-info">
             <div className="info-box clickable" onClick={() => setIsGateModalOpen(true)}>
                <label>CỬA (GATE)</label>
                <div className="val">{activeFlightData.gate}</div>
             </div>
             <div className="info-box">
                <label>TÀU BAY</label>
                <div className="val">{activeFlightData.aircraft}</div>
             </div>
          </div>
          
          <div className="status-controller-premium">
             <div className={`status-pill ${gateStatus.toLowerCase()}`}>
                <div className="indicator"></div>
                <span>{gateStatus === 'OPEN' ? 'MỞ CỬA' : gateStatus === 'BOARDING' ? 'ĐANG LÊN TÀU' : 'ĐÃ ĐÓNG'}</span>
             </div>
             <div className="control-group">
                <button className={gateStatus === 'OPEN' ? 'active' : ''} onClick={() => setGateStatus('OPEN')}>OPEN</button>
                <button className={gateStatus === 'BOARDING' ? 'active' : ''} onClick={() => setGateStatus('BOARDING')}>BOARD</button>
                <button className={gateStatus === 'CLOSED' ? 'active' : ''} onClick={() => setGateStatus('CLOSED')}>CLOSE</button>
             </div>
          </div>
        </div>

        <div className="stats-matrix">
           <Card className="stat-node">
              <div className="node-icon checked"><span className="material-icons-round">fact_check</span></div>
              <div className="node-data"><label>Hành khách</label><div className="val">{totalCount}</div></div>
           </Card>
           <Card className="stat-node highlight">
              <div className="node-icon boarded"><span className="material-icons-round">how_to_reg</span></div>
              <div className="node-data"><label>Đã lên tàu</label><div className="val">{boardedCount} <span>/ {totalCount}</span></div></div>
              <div className="node-progress-track">
                 <div className="node-progress-fill" style={{ width: `${totalCount > 0 ? (boardedCount/totalCount)*100 : 0}%` }}></div>
              </div>
           </Card>
           <Card className="stat-node urgent">
              <div className="node-icon danger"><span className="material-icons-round">hourglass_bottom</span></div>
              <div className="node-data"><label>Chưa lên tàu</label><div className="val">{totalCount - boardedCount}</div></div>
           </Card>
           <Card className="stat-node">
              <div className="node-icon"><span className="material-icons-round">schedule</span></div>
              <div className="node-data"><label>Khởi hành</label><div className="val">{activeFlightData.time}</div></div>
           </Card>
        </div>

        <div className="operation-center">
          <Card className="manifest-workspace-card" noPadding>
            <div className="manifest-header-premium">
               <h3>Danh sách hành khách</h3>
               <div className="premium-search-box">
                  <span className="material-icons-round">search</span>
                  <input type="text" placeholder="Tìm tên, ghế hoặc PNR..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
               </div>
            </div>

            <div className="manifest-table-wrapper">
              <table className="premium-manifest-table">
                <thead>
                  <tr>
                    <th>GHẾ</th>
                    <th>HÀNH KHÁCH</th>
                    <th>PNR</th>
                    <th>TRẠNG THÁI</th>
                    <th style={{ textAlign: 'center' }}>BOARDING</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPassengers.map((p) => (
                    <tr key={p.id} className={p.status === 'Boarded' ? 'is-boarded' : ''}>
                      <td><div className="premium-seat-badge">{p.seat}</div></td>
                      <td><b>{p.name?.toUpperCase()}</b></td>
                      <td><code style={{background:'#f1f5f9', padding:'2px 6px', borderRadius:4}}>{p.pnr}</code></td>
                      <td>
                        <div className={`status-badge-premium ${p.status === 'Boarded' ? 'success' : (p.status === 'Đã Check-in' ? 'primary' : 'warning')}`}>
                           <div className="dot"></div>{p.status}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className={`boarding-action-btn ${p.status === 'Boarded' ? 'completed' : (p.status !== 'Đã Check-in' ? 'locked' : '')}`} 
                          disabled={p.status === 'Boarded' || gateStatus === 'CLOSED'} 
                          onClick={() => handleScanBoarding(p.id, p.bookingId, p.status)}
                          title={p.status !== 'Đã Check-in' ? 'Khách chưa Check-in' : 'Quét lên tàu'}
                        >
                          <span className="material-icons-round">
                            {p.status === 'Boarded' ? 'check_circle' : (p.status !== 'Đã Check-in' ? 'priority_high' : 'qr_code_scanner')}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <aside className="operational-sidebar">
            <Card className="scanner-card-premium">
                <div className={`scanner-visual ${gateStatus === 'BOARDING' ? 'active' : ''}`}>
                  <div className="scan-beam"></div>
                  <span className="material-icons-round">qr_code_scanner</span>
                </div>
                <div style={{textAlign:'center'}}>
                   <h4>{gateStatus === 'BOARDING' ? 'SẴN SÀNG QUÉT' : 'CỬA ĐANG ĐÓNG'}</h4>
                   <p style={{fontSize:12, color:'#94a3b8'}}>Sử dụng máy quét cầm tay hoặc camera</p>
                </div>
            </Card>
          </aside>
        </div>
      </div>

      <style>{`
        .gate-dashboard { animation: fadeIn 0.4s ease-out; display: flex; flex-direction: column; gap: 20px; }
        .dashboard-header-premium { display: flex; justify-content: space-between; align-items: center; background: #0A192F; padding: 10px 16px; border-radius: 12px; color: white; gap: 12px; }
        .flight-selector-glass { background: rgba(255, 255, 255, 0.1); padding: 5px 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; width: 180px; border: 1px solid rgba(255,255,255,0.1); }
        .selector-icon { width: 26px; height: 26px; border-radius: 6px; background: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .selector-icon span { font-size: 14px; }
        .selector-content label { display: block; font-size: 7px; font-weight: 800; opacity: 0.6; text-transform: uppercase; margin-bottom: 0; }
        .selector-content select { background: transparent; border: none; color: white; font-size: 13px; font-weight: 800; outline: none; width: 100%; cursor: pointer; }
        .selector-content select option { background: #0A192F; color: white; }
        
        .flight-route-display { display: flex; align-items: center; gap: 12px; flex: 1; justify-content: center; }
        .route-node h2 { font-size: 20px; font-weight: 900; margin: 0; }
        .route-node p { margin: 0; font-size: 9px; opacity: 0.5; text-transform: uppercase; line-height: 1; }
        .route-visual-animated { flex: 1; display: flex; align-items: center; gap: 6px; max-width: 100px; }
        .route-visual-animated .line { flex: 1; height: 1px; background: rgba(255, 255, 255, 0.2); }
        .route-visual-animated .material-icons-round { color: #2563eb; font-size: 16px; transform: rotate(90deg); }
        
        .gate-aircraft-info { display: flex; gap: 16px; padding: 0 16px; border-left: 1px solid rgba(255,255,255,0.1); }
        .info-box label { display: block; font-size: 8px; font-weight: 800; opacity: 0.6; }
        .info-box .val { font-size: 16px; font-weight: 900; }
        .info-box.clickable { cursor: pointer; }
        
        .status-controller-premium { display: flex; gap: 10px; align-items: center; }
        .status-pill { display: flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 10px; background: rgba(255,255,255,0.05); font-size: 9px; font-weight: 800; }
        .status-pill .indicator { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
        .control-group { display: flex; background: rgba(255,255,255,0.08); padding: 2px; border-radius: 6px; }
        .control-group button { background: transparent; border: none; color: rgba(255, 255, 255, 0.5); padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 800; cursor: pointer; transition: 0.2s; }
        .control-group button.active { background: white; color: #0A192F; }

        .stats-matrix { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-node { display: flex; align-items: center; gap: 12px; padding: 16px; border-radius: 16px; position: relative; overflow: hidden; }
        .node-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #64748b; }
        .node-icon.checked { color: #2563eb; background: #eff6ff; }
        .node-data label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
        .node-data .val { font-size: 20px; font-weight: 900; }
        .stat-node.highlight { background: #0A192F; border: none; color: white; }
        .stat-node.highlight label { color: rgba(255,255,255,0.5); }
        .node-progress-track { position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: rgba(255,255,255,0.1); }
        .node-progress-fill { height: 100%; background: #00B4D8; }
        
        .operation-center { display: grid; grid-template-columns: 1fr 280px; gap: 20px; }
        .manifest-header-premium { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .manifest-header-premium h3 { margin: 0; font-size: 16px; }
        .premium-search-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 6px 12px; border-radius: 8px; display: flex; align-items: center; gap: 8px; }
        .premium-search-box input { border: none; background: transparent; outline: none; font-size: 13px; width: 150px; }
        
        .premium-manifest-table { width: 100%; border-collapse: collapse; }
        .premium-manifest-table th { text-align: left; padding: 12px 20px; font-size: 10px; color: #94a3b8; background: #fafbfc; border-bottom: 1px solid #f1f5f9; }
        .premium-manifest-table td { padding: 12px 20px; border-bottom: 1px solid #f1f5f9; font-size: 13px; }
        .premium-seat-badge { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-weight: 800; min-width: 40px; text-align: center; }
        .status-badge-premium { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; }
        .status-badge-premium.success { background: #dcfce7; color: #15803d; }
        .status-badge-premium.primary { background: #eff6ff; color: #1d4ed8; }
        .status-badge-premium.warning { background: #fff7ed; color: #c2410c; }
        .boarding-action-btn { width: 32px; height: 32px; border-radius: 8px; border: none; background: #f1f5f9; color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; margin: 0 auto; transition: 0.2s; }
        .boarding-action-btn:hover:not(:disabled) { background: #2563eb; color: white; }
        .boarding-action-btn.completed { background: #10b981; color: white; cursor: default; }
        .boarding-action-btn.locked { background: #fee2e2; color: #ef4444; }
        
        .scanner-card-premium { padding: 24px; display: flex; flex-direction: column; gap: 16px; align-items: center; }
        .scanner-visual { width: 80px; height: 80px; border: 2px dashed #e2e8f0; border-radius: 20px; display: flex; align-items: center; justify-content: center; position: relative; }
        .scanner-visual.active { border-color: #2563eb; background: #eff6ff; }
        .scanner-visual .material-icons-round { font-size: 40px; color: #cbd5e1; }
        .scanner-visual.active .material-icons-round { color: #2563eb; }
        .scan-beam { position: absolute; top: 0; left: 10%; width: 80%; height: 2px; background: #2563eb; opacity: 0; }
        .scanner-visual.active .scan-beam { animation: scanMove 2s infinite linear; opacity: 1; }
        
        .special-item { display: flex; gap: 10px; align-items: center; }
        .special-item .icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; }
        .special-item .text strong { font-size: 12px; display: block; }
        .special-item .text p { margin: 0; font-size: 10px; color: #94a3b8; }
        
        @keyframes scanMove { from { top: 10%; } 50% { top: 85%; } to { top: 10%; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {isGateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div style={{ background: 'white', borderRadius: 16, width: 360, padding: 24 }}>
            <h3 style={{ margin: '0 0 20px', fontSize: 18 }}>Chọn Cửa Khởi Hành</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
              {(AIRPORT_GATES[activeFlightData.from] || ['01','02','03']).map(g => (
                <button key={g} onClick={() => { handleUpdateFlightGate(g); setIsGateModalOpen(false); }}
                  style={{ padding: '10px 0', borderRadius: 8, border: activeFlightData.gate === g ? '2px solid #2563eb' : '1px solid #e2e8f0', background: activeFlightData.gate === g ? '#eff6ff' : 'white', fontWeight: 700, cursor: 'pointer' }}
                >{g}</button>
              ))}
            </div>
            <Button fullWidth style={{ marginTop: 20 }} onClick={() => setIsGateModalOpen(false)}>Hủy</Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default GateManagementPage;
