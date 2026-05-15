import React, { useState } from 'react';
import AppLayout from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';

interface GateManagementPageProps {
  onNavigate: (id: string) => void;
  bookings: any[];
  onUpdateStatus?: (id: string, status: string, badge: string) => void;
  onUpdateBooking?: (updated: any) => void;
  onUpdateFlightInfo?: (flightCode: string, aircraft: string, gate: string) => void;
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
  onNavigate, bookings, onUpdateStatus, onUpdateBooking, onUpdateFlightInfo,
  currentUser, onLogout, bookingPendingCount, flightCount, passengerCount 
}) => {
  const [gateStatus, setGateStatus] = useState<'OPEN' | 'BOARDING' | 'CLOSED'>('OPEN');
  const [selectedFlight, setSelectedFlight] = useState<string>('');
  const [isGateModalOpen, setIsGateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const isCheckedInStatus = (status: string) => {
    const s = (status || '').toLowerCase();
    return s.includes('check') || s.includes('thủ tục') || s.includes('board');
  };

  // Lọc ra các chuyến bay có khách đã xuất vé / check-in
  const availableFlights = React.useMemo(() => {
    const flightsMap = new Map();
    bookings.forEach(b => {
      // Hiển thị các chuyến bay có ít nhất 1 booking hợp lệ (đã xuất vé hoặc đã check-in)
      if (b.flight && (b.badge === 'success' || isCheckedInStatus(b.status))) {
        if (!flightsMap.has(b.flight)) {
          flightsMap.set(b.flight, { flight: b.flight, from: b.from, to: b.to, time: b.time, gate: b.gate, aircraft: b.aircraft });
        } else {
          // Ưu tiên lấy gate đã được gán (khác '--')
          const existing = flightsMap.get(b.flight);
          if (existing.gate === '--' && b.gate && b.gate !== '--') {
            flightsMap.set(b.flight, { ...existing, gate: b.gate });
          }
        }
      }
    });
    return Array.from(flightsMap.values());
  }, [bookings]);

  React.useEffect(() => {
    if (!selectedFlight && availableFlights.length > 0) {
      setSelectedFlight(availableFlights[0].flight);
    }
  }, [availableFlights, selectedFlight]);

  const activeFlightData = availableFlights.find(f => f.flight === selectedFlight) || { flight: '---', from: '---', to: '---', time: '00:00', gate: '--', aircraft: 'A321' };
  
  // Lấy toàn bộ hành khách của chuyến bay được chọn (không bao gồm vé bị hủy hoặc void)
  const allPassengers = React.useMemo(() => {
    return bookings
      .filter(b => b.flight === selectedFlight && b.badge !== 'danger' && b.badge !== 'default')
      .flatMap(b => {
        const pList = b.passengersList || [];
        const paxList = pList.length > 0 
          ? pList 
          : Array.from({ length: b.pax || 1 }).map((_, i) => ({
              name: i === 0 ? b.customer : `HÀNH KHÁCH ${i+1}`,
              seat: i === 0 ? (b.seat || '12A') : `12${String.fromCharCode(66+i)}`
            }));
        
        return paxList.map((p: any, idx: number) => ({
          id: `${b.id}-${idx}`,
          bookingId: b.id,
          pnr: b.pnr,
          name: p.name,
          seat: p.seat || b.seat,
          status: b.status,
          baggage: b.extraServices?.baggage?.[idx] || p.baggage || { weight: 0 },
          meal: b.extraServices?.meals?.[idx] || p.meal || { selected: false, type: '' }
        }));
      });
  }, [bookings, selectedFlight]);

  const filteredPassengers = allPassengers.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.seat?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.pnr?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const boardedCount = allPassengers.filter(p => p.status === 'Boarded').length;
  const totalCount = allPassengers.length;
  const pendingCheckinCount = bookings.reduce((acc, b) => acc + (b.flight === selectedFlight && b.status !== 'Đã Check-in' && b.status !== 'Boarded' && b.badge !== 'danger' && b.badge !== 'default' ? (b.pax||1) : 0), 0);

  const handleScanBoarding = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking && onUpdateBooking) {
      onUpdateBooking({ 
        ...booking, 
        status: 'Boarded', 
        badge: 'success',
        gate: activeFlightData.gate !== '--' ? activeFlightData.gate : booking.gate
      });
    }
  };

  const handleUpdateFlightGate = (newGate: string) => {
    if (!selectedFlight || !onUpdateBooking) return;
    
    // Cập nhật toàn bộ booking của chuyến bay này
    bookings.forEach(b => {
      if (b.flight === selectedFlight) {
        onUpdateBooking({ 
          ...b, 
          gate: newGate 
        });
      }
    });

    if (onUpdateFlightInfo) {
      onUpdateFlightInfo(selectedFlight, activeFlightData.aircraft || 'A321', newGate);
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
    >
      <div className="gate-dashboard">
        {/* Flight Operational Header */}
        <div className="dashboard-header-premium">
          <div className="flight-selector-glass">
            <div className="selector-icon">
               <span className="material-icons-round">flight</span>
            </div>
            <div className="selector-content">
              <label>ĐANG ĐIỀU HÀNH</label>
              <select 
                value={selectedFlight} 
                onChange={(e) => setSelectedFlight(e.target.value)}
              >
                {availableFlights.map(f => (
                  <option key={f.flight} value={f.flight}>
                    {f.flight} ({f.from} - {f.to})
                  </option>
                ))}
                {availableFlights.length === 0 && <option value="">Không có chuyến</option>}
              </select>
            </div>
            <span className="material-icons-round chevron">expand_more</span>
          </div>

          <div className="flight-route-display">
             <div className="route-node">
                <h2>{activeFlightData.from}</h2>
                <p>Khởi hành</p>
             </div>
             <div className="route-visual-animated">
                <div className="line"></div>
                <span className="material-icons-round">airplanemode_active</span>
             </div>
             <div className="route-node text-right">
                <h2>{activeFlightData.to}</h2>
                <p>Điểm đến</p>
             </div>
          </div>

          <div className="gate-aircraft-info">
             <div className="info-box clickable" onClick={() => setIsGateModalOpen(true)}>
                <label>CỬA (GATE)</label>
                <div className="val">{activeFlightData.gate}</div>
                <span className="material-icons-round edit-icon">edit</span>
             </div>
             <div className="info-box">
                <label>TÀU BAY</label>
                <div className="val">{activeFlightData.aircraft || 'A321'}</div>
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

        {/* Boarding Stats Matrix */}
        <div className="stats-matrix">
           <Card className="stat-node">
              <div className="node-icon checked">
                 <span className="material-icons-round">fact_check</span>
              </div>
              <div className="node-data">
                 <label>Check-in</label>
                 <div className="val">{totalCount - boardedCount} <span>/ {totalCount}</span></div>
              </div>
           </Card>
           
           <Card className="stat-node">
              <div className="node-icon pending">
                 <span className="material-icons-round">hourglass_empty</span>
              </div>
              <div className="node-data">
                 <label>Chờ tại cửa</label>
                 <div className="val">{totalCount - boardedCount}</div>
              </div>
           </Card>

           <Card className="stat-node highlight">
              <div className="node-icon boarded">
                 <span className="material-icons-round">how_to_reg</span>
              </div>
              <div className="node-data">
                 <label>Đã lên tàu</label>
                 <div className="val">{boardedCount} <span>/ {totalCount}</span></div>
              </div>
              <div className="node-progress-track">
                 <div className="node-progress-fill" style={{ width: `${totalCount > 0 ? (boardedCount/totalCount)*100 : 0}%` }}></div>
              </div>
           </Card>

           <Card className="stat-node urgent">
              <div className="node-icon danger">
                 <span className="material-icons-round">report_problem</span>
              </div>
              <div className="node-data">
                 <label>Khách vắng mặt</label>
                 <div className="val">{pendingCheckinCount}</div>
              </div>
           </Card>
        </div>

        {/* Boarding Operation Center */}
        <div className="operation-center">
          <Card className="manifest-workspace-card" noPadding>
            <div className="manifest-header-premium">
              <div className="left">
                 <h3>Danh sách thẻ lên tàu</h3>
                 <p>{totalCount} hành khách • Zone 1-3</p>
              </div>
              <div className="right">
                <div className="premium-search-box">
                  <span className="material-icons-round">search</span>
                  <input 
                    type="text" 
                    placeholder="Tìm tên, ghế hoặc PNR..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button className="manifest-action-btn">
                   <span className="material-icons-round">filter_list</span>
                </button>
              </div>
            </div>

            <div className="manifest-table-wrapper">
              <table className="premium-manifest-table">
                <thead>
                  <tr>
                    <th>GHẾ</th>
                    <th>THÔNG TIN HÀNH KHÁCH</th>
                    <th>DỊCH VỤ</th>
                    <th>TRẠNG THÁI</th>
                    <th style={{ textAlign: 'center' }}>XÁC NHẬN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPassengers.map((p, i) => (
                    <tr key={p.id} className={p.status === 'Boarded' ? 'is-boarded' : ''}>
                      <td><div className="premium-seat-badge">{p.seat}</div></td>
                      <td>
                        <div className="pax-info-block">
                           <div className="pax-name">{p.name?.toUpperCase()}</div>
                           <div className="pax-meta">PNR: {p.pnr} • <span className="zone">Zone {i % 3 + 1}</span></div>
                        </div>
                      </td>
                      <td>
                         <div className="service-icon-group">
                            <span className={`service-tag ${p.baggage?.weight > 0 ? 'active' : ''}`} title={`Hành lý: ${p.baggage?.weight || 0}kg`}>
                               <span className="material-icons-round">luggage</span>
                               {p.baggage?.weight > 0 ? `${p.baggage.weight}kg` : ''}
                            </span>
                            <span className={`service-tag meal ${p.meal?.selected ? 'active' : ''}`} title={p.meal?.type || 'Không chọn'}>
                               <span className="material-icons-round">restaurant</span>
                            </span>
                         </div>
                      </td>
                      <td>
                        <div className={`status-badge-premium ${p.status === 'Boarded' ? 'success' : (isCheckedInStatus(p.status) ? 'primary' : 'warning')}`}>
                           <div className="dot"></div>
                           {p.status}
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className={`boarding-action-btn ${p.status === 'Boarded' ? 'completed' : ''}`}
                          disabled={p.status === 'Boarded' || gateStatus === 'CLOSED'}
                          onClick={() => handleScanBoarding(p.bookingId)}
                        >
                          <span className="material-icons-round">
                            {p.status === 'Boarded' ? 'check_circle' : (gateStatus === 'CLOSED' ? 'block' : 'qr_code_scanner')}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPassengers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty-state">
                        <span className="material-icons-round">person_search</span>
                        <p>Không tìm thấy hành khách phù hợp</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          <aside className="operational-sidebar">
            <Card className="scanner-card-premium">
              <div className="scanner-box">
                <div className={`scanner-visual ${gateStatus === 'BOARDING' ? 'active' : ''}`}>
                  <div className="scan-beam"></div>
                  <span className="material-icons-round">qr_code_scanner</span>
                  <div className="pulse-rings">
                     <div className="ring"></div>
                     <div className="ring"></div>
                  </div>
                </div>
                <h4>{gateStatus === 'BOARDING' ? 'SẴN SÀNG QUÉT THẺ' : 'CỬA CHƯA MỞ'}</h4>
                <p>{gateStatus === 'BOARDING' ? 'Vui lòng đưa thẻ lên tàu vào vùng quét' : 'Hệ thống quét tự động đang tạm dừng'}</p>
                <Button variant="outline" fullWidth style={{ marginTop: 20 }}>Nhập PNR Thủ công</Button>
              </div>
            </Card>

            <Card className="handling-card" title="Hỗ trợ đặc biệt">
              <div className="special-list">
                 <div className="special-item">
                    <div className="icon wheelchair"><span className="material-icons-round">accessible</span></div>
                    <div className="text">
                       <strong>Hỗ trợ Xe lăn (WCHR)</strong>
                       <p>Ghế 15D - Cần ưu tiên lên tàu trước</p>
                    </div>
                 </div>
                 <div className="special-item">
                    <div className="icon minor"><span className="material-icons-round">child_care</span></div>
                    <div className="text">
                       <strong>Trẻ em đi một mình (UM)</strong>
                       <p>Ghế 22B - Giám sát tại cửa</p>
                    </div>
                 </div>
                 <div className="special-item">
                    <div className="icon vip"><span className="material-icons-round">stars</span></div>
                    <div className="text">
                       <strong>Hội viên Vàng</strong>
                       <p>Ghế 1A - Ưu tiên lối đi riêng</p>
                    </div>
                 </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <style>{`
        .gate-dashboard { animation: fadeIn 0.4s ease-out; display: flex; flex-direction: column; gap: 24px; }
        
        /* Premium Header */
        .dashboard-header-premium {
          display: flex; justify-content: space-between; align-items: center;
          background: #0A192F; padding: 24px 32px; border-radius: 24px;
          color: white; box-shadow: 0 20px 40px rgba(10, 25, 47, 0.15);
          position: relative; overflow: hidden;
        }
        .dashboard-header-premium::after {
           content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
           background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
           pointer-events: none;
        }

        .flight-selector-glass {
           background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(10px);
           padding: 10px 20px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.1);
           display: flex; align-items: center; gap: 16px; position: relative; width: 260px;
        }
        .selector-icon { width: 40px; height: 40px; border-radius: 10px; background: #2563eb; display: flex; align-items: center; justify-content: center; }
        .selector-content label { display: block; font-size: 9px; font-weight: 800; opacity: 0.6; letter-spacing: 1px; }
        .selector-content select { background: transparent; border: none; color: white; font-size: 16px; font-weight: 800; outline: none; width: 100%; cursor: pointer; appearance: none; }
        .selector-content option { background: #0A192F; color: white; }
        .chevron { opacity: 0.6; }

        .flight-route-display { display: flex; align-items: center; gap: 32px; flex: 1; justify-content: center; padding: 0 40px; }
        .route-node h2 { font-size: 32px; font-weight: 900; margin: 0; line-height: 1; }
        .route-node p { margin: 4px 0 0; font-size: 11px; font-weight: 700; opacity: 0.5; text-transform: uppercase; }
        .route-visual-animated { flex: 1; display: flex; align-items: center; gap: 12px; position: relative; }
        .route-visual-animated .line { flex: 1; height: 2px; background: rgba(255, 255, 255, 0.1); position: relative; }
        .route-visual-animated .material-icons-round { color: #2563eb; transform: rotate(90deg); font-size: 24px; animation: flightPath 4s infinite linear; }
        @keyframes flightPath { from { transform: rotate(90deg) translateX(-10px); } 50% { transform: rotate(90deg) translateX(10px); } to { transform: rotate(90deg) translateX(-10px); } }

        .gate-aircraft-info { display: flex; gap: 24px; padding: 0 32px; border-left: 1px solid rgba(255, 255, 255, 0.1); border-right: 1px solid rgba(255, 255, 255, 0.1); }
        .info-box label { display: block; font-size: 9px; font-weight: 800; opacity: 0.6; margin-bottom: 4px; }
        .info-box .val { font-size: 24px; font-weight: 900; }
        .info-box.clickable { cursor: pointer; transition: all 0.2s; position: relative; }
        .info-box.clickable:hover { color: #60a5fa; }
        .edit-icon { position: absolute; top: -5px; right: -15px; font-size: 12px; opacity: 0; transition: all 0.2s; }
        .info-box.clickable:hover .edit-icon { opacity: 1; right: -20px; }

        .status-controller-premium { display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
        .status-pill { display: flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; background: rgba(255, 255, 255, 0.05); font-size: 11px; font-weight: 800; }
        .status-pill.open { color: #10b981; }
        .status-pill.boarding { color: #2563eb; }
        .status-pill.closed { color: #ef4444; }
        .status-pill .indicator { width: 8px; height: 8px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; animation: pulse 2s infinite; }
        
        .control-group { display: flex; background: rgba(255, 255, 255, 0.05); padding: 4px; border-radius: 10px; }
        .control-group button { background: transparent; border: none; color: rgba(255, 255, 255, 0.4); padding: 6px 12px; border-radius: 8px; font-size: 10px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
        .control-group button.active { background: white; color: #0A192F; }

        /* Stats Matrix */
        .stats-matrix { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-node { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 20px; position: relative; overflow: hidden; }
        .node-icon { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        .node-icon.checked { background: #eff6ff; color: #2563eb; }
        .node-icon.pending { background: #fffbeb; color: #d97706; }
        .node-icon.boarded { background: rgba(255, 255, 255, 0.1); color: #00B4D8; }
        .node-icon.danger { background: #fef2f2; color: #ef4444; }
        .node-data label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 4px; display: block; }
        .node-data .val { font-size: 24px; font-weight: 900; color: #1e293b; }
        .node-data .val span { font-size: 14px; opacity: 0.4; }
        .stat-node.highlight { background: #0A192F; border: none; }
        .stat-node.highlight * { color: white !important; }
        .node-progress-track { position: absolute; bottom: 0; left: 0; width: 100%; height: 4px; background: rgba(255, 255, 255, 0.1); }
        .node-progress-fill { height: 100%; background: #00B4D8; box-shadow: 0 0 10px #00B4D8; }

        /* Operation Center */
        .operation-center { display: grid; grid-template-columns: 1fr 320px; gap: 24px; }
        .manifest-header-premium { padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .manifest-header-premium h3 { margin: 0; font-size: 18px; font-weight: 800; color: #0f172a; }
        .manifest-header-premium p { margin: 4px 0 0; font-size: 13px; color: #94a3b8; }
        
        .premium-search-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 16px; border-radius: 12px; display: flex; align-items: center; gap: 10px; }
        .premium-search-box input { background: transparent; border: none; outline: none; width: 220px; font-size: 14px; color: #1e293b; }
        .premium-search-box .material-icons-round { color: #94a3b8; font-size: 20px; }

        .manifest-table-wrapper { overflow-x: auto; }
        .premium-manifest-table { width: 100%; border-collapse: collapse; }
        .premium-manifest-table th { text-align: left; padding: 16px 24px; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; background: #fafbfc; border-bottom: 1px solid #f1f5f9; }
        .premium-manifest-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; transition: all 0.2s; }
        .premium-manifest-table tr.is-boarded { background: #f0fdf4; }
        .premium-manifest-table tr:hover:not(.is-boarded) { background: #f8fafc; }

        .premium-seat-badge { background: white; border: 2px solid #e2e8f0; color: #0f172a; padding: 6px 12px; border-radius: 10px; font-weight: 900; font-size: 14px; text-align: center; min-width: 54px; }
        .pax-name { font-size: 15px; font-weight: 700; color: #1e293b; }
        .pax-meta { font-size: 12px; color: #94a3b8; margin-top: 2px; }
        .pax-meta .zone { color: #2563eb; font-weight: 700; }

        .service-icon-group { display: flex; gap: 12px; }
        .service-tag { display: flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 700; color: #cbd5e1; background: #f8fafc; border: 1px solid #f1f5f9; }
        .service-tag.active { color: #2563eb; background: #eff6ff; border-color: #dbeafe; }
        .service-tag.meal.active { color: #d97706; background: #fffbeb; border-color: #fef3c7; }
        .service-tag .material-icons-round { font-size: 14px; }

        .status-badge-premium { display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; border-radius: 12px; font-size: 12px; font-weight: 800; }
        .status-badge-premium.success { background: #dcfce7; color: #15803d; }
        .status-badge-premium.primary { background: #eff6ff; color: #1d4ed8; }
        .status-badge-premium.warning { background: #fff7ed; color: #c2410c; }
        .status-badge-premium .dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

        .boarding-action-btn { width: 44px; height: 44px; border-radius: 14px; border: none; background: #f1f5f9; color: #94a3b8; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; margin: 0 auto; }
        .boarding-action-btn:hover:not(:disabled) { background: #2563eb; color: white; transform: scale(1.1) rotate(5deg); box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2); }
        .boarding-action-btn.completed { background: #10b981; color: white; cursor: default; }

        /* Sidebar Operational */
        .operational-sidebar { display: flex; flex-direction: column; gap: 24px; }
        .scanner-box { padding: 32px 24px; text-align: center; }
        .scanner-visual { width: 120px; height: 120px; margin: 0 auto 24px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 30px; display: flex; align-items: center; justify-content: center; position: relative; transition: all 0.5s; }
        .scanner-visual.active { border-color: #2563eb; background: #f0f7ff; }
        .scanner-visual .material-icons-round { font-size: 56px; color: #cbd5e1; position: relative; z-index: 2; transition: all 0.3s; }
        .scanner-visual.active .material-icons-round { color: #2563eb; animation: qrFloat 2s infinite ease-in-out; }
        @keyframes qrFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        
        .scan-beam { position: absolute; top: 0; left: 10%; width: 80%; height: 3px; background: #2563eb; box-shadow: 0 0 15px #2563eb; opacity: 0; border-radius: 10px; }
        .scanner-visual.active .scan-beam { animation: scanMove 2s infinite linear; opacity: 1; }
        @keyframes scanMove { from { top: 10%; } 50% { top: 85%; } to { top: 10%; } }

        .pulse-rings .ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; border: 2px solid #2563eb; border-radius: 30px; opacity: 0; }
        .scanner-visual.active .pulse-rings .ring:nth-child(1) { animation: ringPulse 2s infinite; }
        .scanner-visual.active .pulse-rings .ring:nth-child(2) { animation: ringPulse 2s infinite 1s; }
        @keyframes ringPulse { from { width: 100%; height: 100%; opacity: 0.5; } to { width: 150%; height: 150%; opacity: 0; } }

        .scanner-box h4 { margin: 0 0 8px; font-size: 14px; font-weight: 800; color: #1e293b; }
        .scanner-box p { margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.6; }

        .special-list { display: flex; flex-direction: column; gap: 16px; padding: 20px; }
        .special-item { display: flex; gap: 12px; }
        .special-item .icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .special-item .icon.wheelchair { background: #eff6ff; color: #2563eb; }
        .special-item .icon.minor { background: #f0fdf4; color: #16a34a; }
        .special-item .icon.vip { background: #fffbeb; color: #d97706; }
        .special-item .icon .material-icons-round { font-size: 20px; }
        .special-item .text strong { display: block; font-size: 13px; color: #1e293b; margin-bottom: 2px; }
        .special-item .text p { margin: 0; font-size: 11px; color: #64748b; line-height: 1.4; }

        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Gate Selection Modal */}
      {isGateModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, padding: 20 }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 440, padding: 28, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#0f172a' }}>Chọn Cửa Khởi Hành</h3>
              <button onClick={() => setIsGateModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <span className="material-icons-round">close</span>
              </button>
            </div>
            
            <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, marginBottom: 24, border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span className="material-icons-round" style={{ color: '#2563eb' }}>flight_takeoff</span>
                  <b style={{ color: '#1e293b' }}>{activeFlightData.flight} · {activeFlightData.from} → {activeFlightData.to}</b>
               </div>
               <p style={{ margin: 0, fontSize: 13, color: '#64748b' }}>Sân bay {activeFlightData.from} có {AIRPORT_GATES[activeFlightData.from]?.length || 0} cửa khả dụng.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, maxHeight: 300, overflowY: 'auto', padding: 2 }}>
              {(AIRPORT_GATES[activeFlightData.from] || ['01', '02', '03']).map(g => (
                <button
                  key={g}
                  onClick={() => {
                    handleUpdateFlightGate(g);
                    setIsGateModalOpen(false);
                  }}
                  style={{
                    padding: '12px 0',
                    borderRadius: 10,
                    border: activeFlightData.gate === g ? '2px solid #2563eb' : '1px solid #e2e8f0',
                    background: activeFlightData.gate === g ? '#eff6ff' : 'white',
                    color: activeFlightData.gate === g ? '#2563eb' : '#475569',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#f0f7ff'; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = activeFlightData.gate === g ? '#2563eb' : '#e2e8f0'; e.currentTarget.style.background = activeFlightData.gate === g ? '#eff6ff' : 'white'; }}
                >
                  {g}
                </button>
              ))}
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
               <Button variant="outline" fullWidth onClick={() => {
                  const custom = prompt('Nhập số cửa khác:');
                  if (custom) {
                    handleUpdateFlightGate(custom);
                    setIsGateModalOpen(false);
                  }
               }}>Nhập Khác</Button>
               <Button fullWidth onClick={() => setIsGateModalOpen(false)}>Hủy</Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default GateManagementPage;
