import React, { useState } from 'react';
import Card from '../../components/Card';
import AppLayout from '../../components/AppLayout';

interface SeatMapPageProps {
  onNavigate?: (id: string) => void;
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const SeatMapPage: React.FC<SeatMapPageProps> = ({ onNavigate, currentUser, onLogout, bookingPendingCount, flightCount, passengerCount }) => {
  const [selectedFlight, setSelectedFlight] = useState('VN123');

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
           <h1>Quản lý Sơ đồ Ghế</h1>
           <p>Xem trực quan tình trạng lấp đầy (Occupancy) và thay đổi chỗ ngồi cho hành khách.</p>
        </div>

        <div className="seat-map-layout">
           <div className="map-sidebar">
              <Card title="Chọn chuyến bay">
                 <select value={selectedFlight} onChange={e => setSelectedFlight(e.target.value)} style={{width:'100%', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0'}}>
                    <option value="VN123">VN123 - SGN-HAN</option>
                    <option value="VN789">VN789 - HAN-PQC</option>
                 </select>
              </Card>
              <Card title="Thống kê ghế" className="mt-md">
                 <div className="stat-row"><span>Hạng Thương gia:</span> <b>8/12</b></div>
                 <div className="stat-row"><span>Hạng Phổ thông:</span> <b>142/168</b></div>
                 <div className="divider"></div>
                 <div className="stat-row"><span>Tỷ lệ lấp đầy:</span> <b style={{color:'#16a34a'}}>83%</b></div>
              </Card>
           </div>

           <div className="map-main">
              <Card className="airplane-card">
                 <div className="cockpit">COCKPIT</div>
                 <div className="cabin">
                    {[1,2,3,4,5,6,7,8,9,10].map(r => (
                       <div key={r} className="seat-row">
                          <span className="row-num">{r}</span>
                          {['A','B','C','gap','D','E','F'].map((c, i) => {
                             if (c === 'gap') return <div key={i} className="aisle"></div>;
                             const isOcc = (r % 3 === 0) || (r === 1 && c === 'A');
                             return <div key={c} className={`seat ${isOcc ? 'occupied' : 'available'}`} title={`Ghế ${r}${c}`}></div>;
                          })}
                       </div>
                    ))}
                 </div>
              </Card>
           </div>
        </div>
      </div>

      <style>{`
        .seat-map-page { animation: fadeIn 0.4s ease-out; }
        .page-header { margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; color: #1e293b; margin: 0; }
        .seat-map-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; }
        .airplane-card { background: #f1f5f9; padding: 40px; display: flex; flex-direction: column; align-items: center; border-radius: 100px 100px 20px 20px; }
        .cockpit { width: 120px; height: 80px; background: #e2e8f0; border-radius: 60px 60px 10px 10px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; color: #94a3b8; margin-bottom: 40px; }
        .cabin { display: flex; flex-direction: column; gap: 8px; }
        .seat-row { display: flex; align-items: center; gap: 8px; }
        .row-num { width: 20px; font-size: 11px; color: #94a3b8; font-weight: 700; text-align: center; }
        .seat { width: 24px; height: 24px; border-radius: 4px; border: 1px solid #cbd5e1; background: white; cursor: pointer; transition: all 0.2s; }
        .seat.occupied { background: #cbd5e1; border-color: #94a3b8; cursor: not-allowed; }
        .seat.available:hover { border-color: #2563eb; background: #eff6ff; }
        .aisle { width: 20px; }
        .stat-row { display: flex; justify-content: space-between; font-size: 13px; color: #475569; margin-bottom: 8px; }
        .divider { height: 1px; background: #f1f5f9; margin: 12px 0; }
        .mt-md { margin-top: 16px; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default SeatMapPage;
