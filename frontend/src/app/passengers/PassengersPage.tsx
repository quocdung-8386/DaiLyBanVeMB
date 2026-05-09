import React, { useState } from 'react';
import Card from '../../components/Card';
import AppLayout from '../../components/AppLayout';

interface PassengersPageProps {
  onNavigate?: (id: string) => void;
}

const passengerManifest = [
  { id: 'PAX-001', name: 'NGUYEN VAN AN', idNumber: '001203001234', ticketCode: 'VE-001', flight: 'VN123', seat: '14A', class: 'Economy', status: 'Checked-in', boardingStatus: 'Boarded' },
  { id: 'PAX-002', name: 'TRAN THI LAN', idNumber: '001203005678', ticketCode: 'VE-001', flight: 'VN123', seat: '14B', class: 'Economy', status: 'Checked-in', boardingStatus: 'Waiting' },
  { id: 'PAX-003', name: 'LE HUU DAT', idNumber: '079203004321', ticketCode: 'VE-003', flight: 'VN789', seat: '08B', class: 'Business', status: 'Not Checked-in', boardingStatus: 'N/A' },
];

const PassengersPage: React.FC<PassengersPageProps> = ({ onNavigate }) => {
  const [filterFlight, setFilterFlight] = useState('all');

  return (
    <AppLayout 
      activeItem="passengers" 
      onNavigate={onNavigate || (() => {})}
      breadcrumb={[{ label: 'Điều hành', page: 'dashboard' }, { label: 'Hành khách' }]}
    >
      <div className="passengers-page">
        <div className="page-header">
           <h1>Danh sách Hành khách (Manifest)</h1>
           <p>Quản lý trạng thái Check-in và Boarding của hành khách theo chuyến bay.</p>
        </div>

        <Card className="filter-card">
           <div className="filter-grid">
              <div className="filter-item">
                 <label>CHUYẾN BAY</label>
                 <select value={filterFlight} onChange={e => setFilterFlight(e.target.value)}>
                    <option value="all">Tất cả chuyến bay</option>
                    <option value="VN123">VN123 (SGN-HAN)</option>
                    <option value="VN789">VN789 (HAN-PQC)</option>
                 </select>
              </div>
              <div className="filter-item">
                 <label>TÌM KIẾM</label>
                 <input type="text" placeholder="Tên, CCCD, Mã vé..." />
              </div>
           </div>
        </Card>

        <Card noPadding>
           <table className="manifest-table">
              <thead>
                 <tr>
                    <th>HÀNH KHÁCH</th>
                    <th>CCCD/PASSPORT</th>
                    <th>CHUYẾN BAY</th>
                    <th>HẠNG/GHẾ</th>
                    <th>CHECK-IN</th>
                    <th>BOARDING</th>
                    <th>MÃ VÉ</th>
                 </tr>
              </thead>
              <tbody>
                 {passengerManifest.map(p => (
                    <tr key={p.id}>
                       <td><b>{p.name}</b></td>
                       <td>{p.idNumber}</td>
                       <td>{p.flight}</td>
                       <td>{p.class} / {p.seat}</td>
                       <td><span className={`status ${p.status.toLowerCase().replace(' ', '-')}`}>{p.status}</span></td>
                       <td><span className={`status ${p.boardingStatus.toLowerCase()}`}>{p.boardingStatus}</span></td>
                       <td><code>{p.ticketCode}</code></td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </Card>
      </div>

      <style>{`
        .passengers-page { animation: fadeIn 0.4s ease-out; }
        .page-header { margin-bottom: 24px; }
        .page-header h1 { font-size: 24px; color: #1e293b; margin: 0; }
        .page-header p { color: #64748b; margin: 4px 0 0; }
        .filter-card { padding: 20px; margin-bottom: 24px; }
        .filter-grid { display: flex; gap: 20px; }
        .filter-item { display: flex; flex-direction: column; gap: 8px; flex: 1; }
        .filter-item label { font-size: 11px; font-weight: 800; color: #94a3b8; }
        .filter-item input, .filter-item select { padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
        
        .manifest-table { width: 100%; border-collapse: collapse; }
        .manifest-table th { padding: 14px 20px; background: #f8fafc; text-align: left; font-size: 11px; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .manifest-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; }
        .status { padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; }
        .status.checked-in { background: #dcfce7; color: #15803d; }
        .status.not-checked-in { background: #f1f5f9; color: #64748b; }
        .status.boarded { background: #eff6ff; color: #1d4ed8; }
        .status.waiting { background: #fff7ed; color: #c2410c; }
        .status.n/a { opacity: 0.5; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default PassengersPage;
