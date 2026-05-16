import React, { useState, useEffect, useMemo } from 'react';
import Card from '../../components/Card';
import AppLayout, { showToast } from '../../components/AppLayout';
import { api } from '../../api';
import Button from '../../components/Button';

interface SeatMapPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const SeatMapPage: React.FC<SeatMapPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [flights, setFlights] = useState<any[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState('');
  const [seatData, setSeatData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.getFlights();
        setFlights(data);
        if (data.length > 0) {
          setSelectedFlightId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (selectedFlightId) {
      const fetchSeats = async () => {
        setLoading(true);
        try {
          const data = await api.getFlightSeats(selectedFlightId);
          setSeatData(data);
          const flight = flights.find(f => f.id === selectedFlightId);
          if (flight) {
            showToast(`Xem sơ đồ ghế chuyến bay ${flight.flight || flight.id}`, 'info');
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchSeats();
    }
  }, [selectedFlightId]);

  const isOccupied = (seatCode: string) => {
    return seatData?.occupied_seats?.includes(seatCode);
  };

  const businessRows = [1, 2, 3];
  const premiumEconomyRows = [10, 11, 12];
  const economyRows = Array.from({ length: 22 }, (_, i) => i + 13);

  const renderRow = (rowNum: number, rowClass: 'business' | 'premium' | 'economy' = 'economy') => {
    const isBusiness = rowClass === 'business';
    const letters = isBusiness ? ['A', 'C', 'gap', 'D', 'F'] : ['A', 'B', 'C', 'gap', 'D', 'E', 'F'];
    
    return (
      <div key={`row-${rowNum}`} className="seat-row">
        <div className="row-num">{rowNum}</div>
        <div className="seats-group">
          {letters.map((letter, idx) => {
            if (letter === 'gap') return <div key={`gap-${idx}`} className="aisle"></div>;
            const seatId = `${rowNum}${letter}`;
            const occupied = isOccupied(seatId);
            const seatClass = `seat ${rowClass} ${occupied ? 'occupied' : ''}`;
            
            return (
              <div key={seatId} className={seatClass} title={`Ghế ${seatId}${occupied ? ' (Đã đặt)' : ''}`}>
                {letter}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getStats = () => {
    if (!seatData || !seatData.stats) return { biz: '0/0', eco: '0/0', prem: '0/0', total: '0%' };
    const biz = seatData.stats['Business'] || { total: 0, available: 0 };
    const eco = seatData.stats['Economy'] || { total: 0, available: 0 };
    const prem = seatData.stats['Premium Economy'] || { total: 0, available: 0 };
    
    const totalCap = biz.total + eco.total + prem.total;
    const totalOcc = seatData.occupied_seats?.length || 0;
    const percent = totalCap > 0 ? Math.round((totalOcc / totalCap) * 100) : 0;
    
    return {
      biz: `${biz.total - biz.available}/${biz.total}`,
      eco: `${eco.total - eco.available}/${eco.total}`,
      prem: `${prem.total - prem.available}/${prem.total}`,
      total: `${percent}%`
    };
  };

  const stats = getStats();

  return (
    <AppLayout 
      activeItem="seat-map" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      breadcrumb={[{ label: 'Điều hành', page: 'dashboard' }, { label: 'Sơ đồ ghế' }]}
    >
      <div className="seat-map-page">
        <div className="page-header">
           <div className="header-info">
              <h1>Quản lý Sơ đồ Ghế</h1>
              <p>Trực quan hóa tình trạng lấp đầy chuyến bay từ dữ liệu database thời gian thực.</p>
           </div>
           <div className="header-actions">
              <Button variant="outline" onClick={() => setSelectedFlightId(selectedFlightId)}><span className="material-icons-round">refresh</span> Làm mới</Button>
           </div>
        </div>

        <div className="seat-map-main-grid">
           <div className="control-sidebar">
              <Card className="flight-selector-card">
                 <h3>Chuyến bay điều hành</h3>
                 <div className="flight-list-scroll">
                    {flights.map(f => (
                      <div 
                        key={f.id} 
                        className={`flight-item ${selectedFlightId === f.id ? 'active' : ''}`}
                        onClick={() => setSelectedFlightId(f.id)}
                      >
                         <div className="f-icon"><span className="material-icons-round">flight_takeoff</span></div>
                         <div className="f-info">
                            <b>{f.flight || f.id}</b>
                            <span>{f.from} → {f.to}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </Card>

              <Card className="occupancy-card">
                 <h3>Thống kê lấp đầy</h3>
                 <div className="stats-circle-container">
                    <div className="stats-circle">
                       <span className="val">{stats.total}</span>
                       <span className="lbl">LOAD FACTOR</span>
                    </div>
                 </div>
                 <div className="class-stats">
                    <div className="stat-row">
                       <div className="stat-label"><span className="dot biz"></span> Thương gia</div>
                       <div className="stat-val">{stats.biz}</div>
                    </div>
                    <div className="stat-row">
                       <div className="stat-label"><span className="dot prem"></span> Phổ thông ĐB</div>
                       <div className="stat-val">{stats.prem}</div>
                    </div>
                    <div className="stat-row">
                       <div className="stat-label"><span className="dot eco"></span> Phổ thông</div>
                       <div className="stat-val">{stats.eco}</div>
                    </div>
                 </div>
              </Card>
           </div>

           <div className="visual-seatmap">
              <Card className="plane-canvas">
                <div className="seat-legend-horizontal">
                  <div className="l-item"><span className="s biz"></span> Thương gia</div>
                  <div className="l-item"><span className="s prem"></span> Phổ thông ĐB</div>
                  <div className="l-item"><span className="s eco"></span> Phổ thông</div>
                  <div className="l-item"><span className="s occ"></span> Đã đặt</div>
                </div>

                <div className="plane-container">
                  {loading && (
                    <div className="plane-loading-overlay">
                       <div className="spinner"></div>
                    </div>
                  )}
                  <div className="plane-nose"></div>
                  <div className="plane-body">
                    <div className="cabin-section">
                      <div className="cabin-title">BUSINESS CLASS</div>
                      {businessRows.map(r => renderRow(r, 'business'))}
                    </div>
                    
                    <div className="cabin-divider">
                      <span>EXIT • CỬA THOÁT HIỂM</span>
                    </div>

                    <div className="cabin-section">
                      <div className="cabin-title">PREMIUM ECONOMY</div>
                      {premiumEconomyRows.map(r => renderRow(r, 'premium'))}
                    </div>

                    <div className="cabin-section" style={{ marginTop: 24 }}>
                      <div className="cabin-title">ECONOMY CLASS</div>
                      {economyRows.map(r => renderRow(r, 'economy'))}
                    </div>
                  </div>
                  <div className="plane-tail"></div>
                </div>
              </Card>
           </div>
        </div>
      </div>

      <style>{`
        .seat-map-page { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
        .page-header p { font-size: 14px; color: #64748b; margin: 4px 0 0; }

        .seat-map-main-grid { display: grid; grid-template-columns: 320px 1fr; gap: 24px; align-items: flex-start; }
        
        .flight-selector-card { padding: 20px; }
        .flight-selector-card h3 { font-size: 14px; color: #94a3b8; text-transform: uppercase; margin-bottom: 16px; letter-spacing: 1px; }
        .flight-list-scroll { max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
        .flight-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid transparent; }
        .flight-item:hover { background: #f8fafc; border-color: #e2e8f0; }
        .flight-item.active { background: #eff6ff; border-color: #2563eb; }
        .f-icon { width: 36px; height: 36px; border-radius: 10px; background: white; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #64748b; }
        .flight-item.active .f-icon { background: #2563eb; color: white; border-color: #2563eb; }
        .f-info b { display: block; font-size: 14px; color: #1e293b; }
        .f-info span { font-size: 12px; color: #94a3b8; font-weight: 600; }

        .occupancy-card { padding: 24px; margin-top: 16px; text-align: center; }
        .occupancy-card h3 { font-size: 14px; color: #94a3b8; text-transform: uppercase; margin-bottom: 20px; text-align: left; }
        .stats-circle-container { display: flex; justify-content: center; margin-bottom: 24px; }
        .stats-circle { width: 120px; height: 120px; border-radius: 50%; border: 8px solid #eff6ff; border-top-color: #2563eb; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .stats-circle .val { font-size: 28px; font-weight: 900; color: #2563eb; }
        .stats-circle .lbl { font-size: 10px; font-weight: 800; color: #94a3b8; }

        .class-stats { display: flex; flex-direction: column; gap: 12px; }
        .stat-row { display: flex; justify-content: space-between; font-size: 13px; font-weight: 600; color: #475569; }
        .stat-label { display: flex; align-items: center; gap: 8px; }
        .dot { width: 8px; height: 8px; border-radius: 50%; }
        .dot.biz { background: #fcd34d; }
        .dot.prem { background: #d8b4fe; }
        .dot.eco { background: #7dd3fc; }

        .plane-canvas { padding: 32px; background: #f1f5f9; position: relative; min-height: 800px; }
        .seat-legend-horizontal { display: flex; justify-content: center; gap: 20px; margin-bottom: 32px; }
        .l-item { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #64748b; }
        .l-item .s { width: 16px; height: 16px; border-radius: 4px; border: 1px solid #cbd5e1; }
        .s.biz { background: #fffbeb; border-color: #fcd34d !important; }
        .s.prem { background: #faf5ff; border-color: #d8b4fe !important; }
        .s.eco { background: #f0f9ff; border-color: #7dd3fc !important; }
        .s.occ { background: #e2e8f0; border-color: #cbd5e1 !important; }

        .plane-container { max-width: 420px; margin: 0 auto; background: white; border-radius: 60px; padding: 40px 0; box-shadow: 0 10px 30px rgba(0,0,0,0.05); position: relative; }
        .plane-nose { height: 120px; background: linear-gradient(to bottom, #f1f5f9 0%, white 100%); border-top-left-radius: 50% 100%; border-top-right-radius: 50% 100%; margin: -40px -4px 20px; border: 4px solid #f1f5f9; border-bottom: none; }
        .plane-body { border-left: 4px solid #f1f5f9; border-right: 4px solid #f1f5f9; }
        
        .cabin-section { padding: 0 32px; }
        .cabin-title { text-align: center; font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; }
        
        .seat-row { display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 12px; }
        .row-num { width: 24px; text-align: center; font-size: 11px; font-weight: 800; color: #cbd5e1; }
        .seats-group { display: flex; gap: 8px; }
        
        .seat { width: 32px; height: 32px; border-radius: 6px; border: 2px solid transparent; background: white; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #64748b; }
        .seat.business { width: 40px; height: 40px; border-radius: 8px; }
        .seat.business { border-color: #fcd34d; color: #b45309; background: #fffbeb; }
        .seat.premium { border-color: #d8b4fe; color: #6b21a8; background: #faf5ff; }
        .seat.economy { border-color: #7dd3fc; color: #0369a1; background: #f0f9ff; }
        .seat.occupied { background: #e2e8f0 !important; border-color: #cbd5e1 !important; color: transparent !important; position: relative; }
        .seat.occupied::after { content: '×'; position: absolute; color: #94a3b8; font-size: 18px; }
        
        .aisle { width: 24px; }
        .cabin-divider { padding: 12px; background: #fef2f2; border-top: 2px dashed #fca5a5; border-bottom: 2px dashed #fca5a5; text-align: center; color: #ef4444; font-size: 10px; font-weight: 800; margin: 32px 0; }
        
        .plane-loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); z-index: 10; display: flex; align-items: center; justify-content: center; border-radius: 60px; }
        .spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top-color: #2563eb; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </AppLayout>
  );
};

export default SeatMapPage;
