import React, { useState, useRef, useEffect } from 'react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  // parse value
  const dateObj = value ? new Date(value) : new Date();
  const currentMonth = dateObj.getMonth();
  const currentYear = dateObj.getFullYear();
  
  const [viewDate, setViewDate] = useState(new Date(currentYear, currentMonth, 1));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleSelect = (day: number) => {
    const y = viewDate.getFullYear();
    const m = viewDate.getMonth() + 1;
    const formatted = `${y}-${m.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    onChange(formatted);
    setOpen(false);
  };

  const formatDisplay = (val: string) => {
    if (!val) return 'Chọn ngày';
    const parts = val.split('-');
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    return val;
  };

  const daysInMonth = getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth());
  const firstDay = getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth());
  
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); // Mon is 1st
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="custom-datepicker" ref={ref}>
      <div className="cd-input" onClick={() => setOpen(!open)}>
        <span>{formatDisplay(value)}</span>
      </div>

      {open && (
        <div className="cd-popup">
          <div className="cd-header">
            <button type="button" onClick={handlePrevMonth}>
              <span className="material-icons-round">chevron_left</span>
            </button>
            <div className="cd-month-year">
              Tháng {viewDate.getMonth() + 1}, {viewDate.getFullYear()}
            </div>
            <button type="button" onClick={handleNextMonth}>
              <span className="material-icons-round">chevron_right</span>
            </button>
          </div>
          
          <div className="cd-weekdays">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
              <div key={d} className="cd-weekday">{d}</div>
            ))}
          </div>

          <div className="cd-days">
            {blanks.map(b => <div key={`blank-${b}`} className="cd-day empty" />)}
            {days.map(d => {
              const isSelected = value === `${viewDate.getFullYear()}-${(viewDate.getMonth() + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;
              const isToday = new Date().toDateString() === new Date(viewDate.getFullYear(), viewDate.getMonth(), d).toDateString();
              
              return (
                <div 
                  key={d} 
                  className={`cd-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => handleSelect(d)}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .custom-datepicker {
          position: relative;
          width: 100%;
        }
        .cd-input {
          cursor: pointer;
          font-size: 15px;
          font-weight: 700;
          color: #0f172a;
          width: 100%;
          display: flex;
          align-items: center;
        }
        .cd-popup {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          width: 320px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
          border: 1px solid #f1f5f9;
          padding: 20px;
          z-index: 1000;
          animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        
        .cd-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .cd-header button {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.2s;
        }
        .cd-header button:hover { background: #f8fafc; color: #1e293b; border-color: #e2e8f0; }
        .cd-month-year { font-weight: 800; color: #1e293b; font-size: 15px; }

        .cd-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          margin-bottom: 12px;
        }
        .cd-weekday {
          text-align: center;
          font-size: 11px;
          font-weight: 800;
          color: #94a3b8;
        }

        .cd-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 6px;
        }
        .cd-day {
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cd-day:hover:not(.empty) { background: #f1f5f9; color: #2563eb; }
        .cd-day.today { color: #2563eb; font-weight: 800; border: 2px solid #eff6ff; }
        .cd-day.selected { background: #2563eb; color: white; border: none; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3); }
        .cd-day.empty { cursor: default; }
      `}</style>
    </div>
  );
};

export default DatePicker;
