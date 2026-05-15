import React, { useState } from 'react';
import Button from './Button';
import { showToast } from './AppLayout';

interface SeatMapProps {
  flightNumber: string;
  aircraftType?: string;
  occupiedSeats?: string[];
  initialSelectedSeat?: string;
  allowedClass?: string;
  onConfirm: (seat: string) => void;
  onCancel: () => void;
}

const SeatMap: React.FC<SeatMapProps> = ({ 
  flightNumber, 
  aircraftType = 'A321', 
  occupiedSeats = ['12B', '14A', '14C', '15D', '15E', '15F', '1A', '1B', '2A', '2C'], 
  initialSelectedSeat,
  allowedClass,
  onConfirm, 
  onCancel 
}) => {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(initialSelectedSeat || null);

  // Generate A321 Seat Layout
  const businessRows = [1, 2, 3];
  const premiumEconomyRows = [10, 11, 12];
  const economyRows = Array.from({ length: 22 }, (_, i) => i + 13); // Rows 13 to 34

  const isOccupied = (seatId: string) => occupiedSeats.includes(seatId);
  const isSelected = (seatId: string) => selectedSeat === seatId;

  const handleSeatClick = (seatId: string, rowClass: 'business' | 'premium' | 'economy') => {
    if (isOccupied(seatId)) return;
    if (allowedClass) {
       if (allowedClass === 'Economy' && rowClass !== 'economy') {
          showToast('Vui lòng chọn ghế thuộc hạng Phổ thông (Economy).', 'warning');
          return;
       }
       if (allowedClass === 'Premium Economy' && rowClass !== 'premium') {
          showToast('Vui lòng chọn ghế thuộc hạng Phổ thông đặc biệt (Premium Economy).', 'warning');
          return;
       }
       if ((allowedClass === 'Business' || allowedClass === 'First Class') && rowClass !== 'business') {
          showToast('Vui lòng chọn ghế thuộc hạng Thương gia/Hạng Nhất.', 'warning');
          return;
       }
    }
    setSelectedSeat(seatId);
  };

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
            const selected = isSelected(seatId);
            
            let isSelectable = true;
            if (allowedClass) {
              if (allowedClass === 'Economy') isSelectable = rowClass === 'economy';
              else if (allowedClass === 'Premium Economy') isSelectable = rowClass === 'premium';
              else if (allowedClass === 'Business' || allowedClass === 'First Class') isSelectable = rowClass === 'business';
            }
            
            const seatClass = `seat ${rowClass} ${occupied ? 'occupied' : ''} ${selected ? 'selected' : ''} ${!isSelectable && !occupied ? 'disabled-class' : ''}`;
            
            return (
              <div 
                key={seatId} 
                className={seatClass}
                onClick={() => handleSeatClick(seatId, rowClass)}
                title={`Ghế ${seatId}${occupied ? ' (Đã đặt)' : ''}`}
              >
                {letter}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="seatmap-modal-overlay">
      <div className="seatmap-modal">
        <div className="seatmap-header">
          <div>
            <h3>Sơ đồ Ghế • Chuyến bay {flightNumber}</h3>
            <p>Tàu bay: {aircraftType}</p>
          </div>
          <button className="close-btn" onClick={onCancel}>
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <div className="seatmap-body">
          <div className="seat-legend">
            <div className="legend-item">
              <div className="seat-sample economy"></div>
              <span>Phổ thông</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample premium"></div>
              <span>Phổ thông ĐB</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample business"></div>
              <span>Thương gia</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample selected"></div>
              <span>Đang chọn</span>
            </div>
            <div className="legend-item">
              <div className="seat-sample occupied"></div>
              <span>Không trống</span>
            </div>
          </div>

          <div className="plane-container">
            <div className="plane-nose"></div>
            <div className="plane-body">
              <div className="cabin-section">
                <div className="cabin-title">HẠNG THƯƠNG GIA (BUSINESS CLASS)</div>
                {businessRows.map(r => renderRow(r, 'business'))}
              </div>
              
              <div className="cabin-divider">
                <span>Cửa thoát hiểm</span>
                <div className="exit-arrows">
                  <span className="material-icons-round">arrow_back</span>
                  <span className="material-icons-round">arrow_forward</span>
                </div>
              </div>

              <div className="cabin-section">
                <div className="cabin-title">HẠNG PHỔ THÔNG ĐẶC BIỆT</div>
                {premiumEconomyRows.map(r => renderRow(r, 'premium'))}
              </div>

              <div className="cabin-section" style={{ marginTop: 24 }}>
                <div className="cabin-title">HẠNG PHỔ THÔNG (ECONOMY CLASS)</div>
                {economyRows.map(r => renderRow(r, 'economy'))}
              </div>
            </div>
          </div>
        </div>

        <div className="seatmap-footer">
          <div className="selected-info">
            <span>Ghế đã chọn:</span>
            <strong>{selectedSeat || 'Chưa chọn'}</strong>
          </div>
          <div className="actions">
            <Button variant="outline" onClick={onCancel}>Hủy</Button>
            <Button 
              disabled={!selectedSeat} 
              onClick={() => selectedSeat && onConfirm(selectedSeat)}
            >
              Xác nhận Ghế
            </Button>
          </div>
        </div>
      </div>

      <style>{`
        .seatmap-modal-overlay {
          position: fixed; inset: 0; background: rgba(15,23,42,0.75); backdrop-filter: blur(8px);
          z-index: 3000; display: flex; align-items: center; justify-content: center;
          padding: 20px;
        }
        .seatmap-modal {
          background: #f8fafc; border-radius: 20px; width: 100%; max-width: 600px;
          height: 90vh; display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUpModal {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .seatmap-header {
          padding: 20px 24px; background: white; border-bottom: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: center; z-index: 10;
        }
        .seatmap-header h3 { margin: 0 0 4px 0; font-size: 18px; color: #0f172a; }
        .seatmap-header p { margin: 0; font-size: 13px; color: #64748b; font-weight: 500; }
        .close-btn { background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; }
        .close-btn:hover { background: #e2e8f0; color: #0f172a; }

        .seatmap-body { flex: 1; overflow-y: auto; padding: 24px 0; position: relative; }
        
        .seat-legend {
          display: flex; justify-content: center; gap: 24px; margin-bottom: 32px;
          padding: 0 24px; flex-wrap: wrap;
        }
        .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #475569; }
        .seat-sample { width: 24px; height: 24px; border-radius: 6px; border: 2px solid transparent; }
        
        /* Seat Styles */
        .seat {
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
          border: 2px solid transparent; background: white;
        }
        .seat:hover:not(.occupied):not(.disabled-class) { transform: translateY(-2px) scale(1.05); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        
        .seat.economy, .seat-sample.economy { border-color: #7dd3fc; color: #0369a1; }
        .seat.economy:not(.selected):not(.occupied) { background: #f0f9ff; }
        
        .seat.premium, .seat-sample.premium { border-color: #d8b4fe; color: #6b21a8; }
        .seat.premium:not(.selected):not(.occupied) { background: #faf5ff; }
        
        .seat.business, .seat-sample.business { border-color: #fcd34d; color: #b45309; }
        .seat.business:not(.selected):not(.occupied) { background: #fffbeb; }
        
        .seat.occupied, .seat-sample.occupied { background: #e2e8f0; border-color: #cbd5e1; color: transparent; cursor: not-allowed; }
        .seat.occupied::after { content: '×'; color: #94a3b8; font-size: 16px; position: absolute; }
        .seat.disabled-class { opacity: 0.2; cursor: not-allowed; filter: grayscale(1); }
        
        .seat.selected, .seat-sample.selected { background: #2563eb !important; border-color: #1d4ed8 !important; color: white !important; box-shadow: 0 0 0 4px rgba(37,99,235,0.2); }

        .plane-container { max-width: 380px; margin: 0 auto; background: white; border-radius: 40px; padding: 20px 0; border: 4px solid #f1f5f9; box-shadow: inset 0 0 20px rgba(0,0,0,0.02); }
        .plane-nose { height: 100px; background: linear-gradient(to bottom, #f1f5f9 0%, white 100%); border-top-left-radius: 50% 100%; border-top-right-radius: 50% 100%; margin: -24px -4px 20px; border: 4px solid #f1f5f9; border-bottom: none; }
        
        .cabin-section { padding: 0 24px; }
        .cabin-title { text-align: center; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; }
        
        .seat-row { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px; }
        .row-num { width: 24px; text-align: center; font-size: 12px; font-weight: 800; color: #94a3b8; }
        .seats-group { display: flex; gap: 8px; }
        
        .seat.economy, .seat.premium { width: 32px; height: 32px; border-radius: 6px; }
        .seat.business { width: 40px; height: 40px; border-radius: 8px; font-size: 14px; }
        .aisle { width: 24px; }

        .cabin-divider {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 24px; background: #fef2f2; border-top: 2px dashed #fca5a5; border-bottom: 2px dashed #fca5a5;
          margin: 32px 0; color: #ef4444; font-size: 12px; font-weight: 700; text-transform: uppercase;
        }
        .exit-arrows { display: flex; gap: 200px; }
        .exit-arrows .material-icons-round { font-size: 16px; }

        .seatmap-footer {
          padding: 20px 24px; background: white; border-top: 1px solid #e2e8f0;
          display: flex; justify-content: space-between; align-items: center; z-index: 10;
        }
        .selected-info { display: flex; flex-direction: column; gap: 4px; }
        .selected-info span { font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; }
        .selected-info strong { font-size: 24px; color: #2563eb; font-weight: 900; line-height: 1; }
        .actions { display: flex; gap: 12px; }
      `}</style>
    </div>
  );
};

export default SeatMap;
