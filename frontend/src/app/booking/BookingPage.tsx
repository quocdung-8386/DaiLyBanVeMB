import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout, { showToast } from '../../components/AppLayout';
import SeatMap from '../../components/SeatMap';
import { api } from '../../api';

interface BookingPageProps {
  onNavigate?: (id: string) => void;
  initialFlight?: any;
  onCheckout?: (ticket: any) => void;
  onAddBooking?: (booking: any) => void;
  flights?: any[];
  bookings?: any[];
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
}

const BookingPage: React.FC<BookingPageProps> = ({ 
  onNavigate, initialFlight, onCheckout, onAddBooking, flights, bookings = [],
  currentUser, onLogout, bookingPendingCount, flightCount, passengerCount
}) => {
  const [flightData, setFlightData] = useState<any>(initialFlight || (flights && flights.length > 0 ? flights[0] : null));
  const [actionType, setActionType] = useState<'hold' | 'success' | null>(null);

  const [contactInfo, setContactInfo] = useState({ name: '', phone: '', email: '' });
  const [passengersList, setPassengersList] = useState([{ id: 1, name: '', type: 'Người lớn', seat: '' }]);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedFare, setSelectedFare] = useState(initialFlight?.cls || 'Economy');
  
  const [availableServices, setAvailableServices] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices();
        setAvailableServices(data);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchServices();
  }, []);
  
  // Effect to handle fare change and seat validation
  React.useEffect(() => {
    // If the fare changes, we should ideally validate seats. 
    // For now, let's just make sure passengersList knows about the change if needed, 
    // but the actual validation happens in handleHold/Confirm.
    // However, if we want to be "synced", we should clear seats that don't match.
    setPassengersList(prev => prev.map(p => {
      if (!p.seat) return p;
      const rowNum = parseInt(p.seat.match(/\d+/)?.[0] || '0');
      const isBusinessSeat = rowNum >= 1 && rowNum <= 3;
      const isEconomySeat = rowNum >= 10;
      
      const isValid = (selectedFare === 'Economy' && isEconomySeat) || 
                      ((selectedFare === 'Business' || selectedFare === 'First Class') && isBusinessSeat);
                      
      return isValid ? p : { ...p, seat: '' };
    }));
  }, [selectedFare]);

  const [isSeatMapOpen, setIsSeatMapOpen] = useState(false);
  const [editingSeatIndex, setEditingSeatIndex] = useState<number | null>(null);
  const [isFlightSelectOpen, setIsFlightSelectOpen] = useState(false);

  // Extra services state
  const [extraServices, setExtraServices] = useState({
    baggage: passengersList.map(() => ({ weight: 0, price: 0, ma_dv: '' })),
    meals: passengersList.map(() => ({ selected: false, type: '', price: 0, ma_dv: '' })),
  });

  const getBaseFare = () => {
    const base = flightData?.price || 1850000;
    if (selectedFare === 'Premium Economy') return base * 1.5;
    if (selectedFare === 'Business') return base * 2.5;
    if (selectedFare === 'First Class') return base * 4.5;
    return base;
  };

  const getExtraServicesTotal = () => {
    const baggageTotal = extraServices.baggage.reduce((sum, item) => sum + item.price, 0);
    const mealsTotal = extraServices.meals.reduce((sum, item) => sum + (item.selected ? item.price : 0), 0);
    return baggageTotal + mealsTotal;
  };

  const calculateGrandTotal = () => {
    const baseFareTotal = getBaseFare() * passengersList.length;
    const feesTotal = 50000 * passengersList.length;
    return baseFareTotal + feesTotal + getExtraServicesTotal();
  };
  const validateBooking = () => {
    for (let i = 0; i < passengersList.length; i++) {
      if (!passengersList[i].name || !passengersList[i].name.trim()) {
        showToast(`Vui lòng nhập Họ tên cho Hành khách ${i + 1}`, 'warning');
        return false;
      }
    }
    if (!contactInfo.name?.trim() || !contactInfo.phone?.trim() || !contactInfo.email?.trim()) {
      showToast("Vui lòng nhập đầy đủ Thông tin liên hệ (Họ tên, Số điện thoại, Email)", 'warning');
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (bookingStep === 2 && !validateBooking()) {
      return;
    }
    setBookingStep(s => s + 1);
  };

  const handleHoldBooking = async () => {
    if (!flightData) {
      showToast('Vui lòng chọn chuyến bay trước khi đặt vé', 'error');
      return;
    }
    if (bookingStep >= 2 && !validateBooking()) return;
    const newBooking: any = {
      // ── DatCho fields ──
      trang_thai_tt: 'Chờ thanh toán',           // trang_thai_tt
      tong_tien: calculateGrandTotal(),           // tong_tien DECIMAL

      // ── VeMayBay fields ──
      hang_ghe: selectedFare,                     // hang_ghe
      trang_thai_ve: 'Đã xác nhận',              // trang_thai_ve

      // ── ChuyenBay reference ──
      flight: flightData.id,                      // ma_cb
      ma_hang: flightData.logo || flightData.code || '',            // ma_hang
      ma_may_bay: flightData.aircraft || 'A321', // ma_may_bay
      nha_ga: flightData.terminal || 'T1',       // nha_ga
      cong_khoi_hanh: flightData.gate || '--',  // cong_khoi_hanh

      // ── UI/display fields ──
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      customer: contactInfo.name || passengersList[0]?.name || 'Khách hàng mới',
      phone: contactInfo.phone || '',
      email: contactInfo.email || '',
      from: flightData?.from || 'SGN',
      to: flightData?.to || 'HAN',
      airline: flightData?.airline || 'Vietnam Airlines',
      date: 'Hôm nay',
      time: flightData?.departure || '08:00 AM',
      total: calculateGrandTotal().toLocaleString('vi'),
      status: 'Chờ thanh toán',
      badge: 'hold',
      pax: passengersList.length,
      fareClass: selectedFare,
      passengersList: passengersList.map(p => ({
        name: p.name,
        seat: p.seat,
        type: p.type,
        hang_ghe: selectedFare,           // hang_ghe
        gia_ve: getBaseFare(),             // gia_ve
        trang_thai_ve: 'Da xac nhan'      // trang_thai_ve
      })),
      extraServices: extraServices,
      type: 'Một chiều',
      timeLimit: new Date(Date.now() + 24*3600000).toISOString(),
      seat: passengersList[0]?.seat || '',
      gate: flightData?.gate || '--',
      aircraft: flightData?.aircraft || 'A321',
      terminal: flightData?.terminal || 'T1'
    };
    setActionType('hold');
    
    const result = await (onAddBooking as any)?.(newBooking);
    
    setTimeout(() => {
      setActionType(null);
      if (onNavigate) onNavigate('tickets');
    }, 1500);
  };

  const handleConfirmBooking = async () => {
    if (!flightData) {
      showToast('Vui lòng chọn chuyến bay trước khi đặt vé', 'error');
      return;
    }
    if (bookingStep >= 2 && !validateBooking()) return;
    const newBooking: any = {
      // ── DatCho fields ──
      trang_thai_tt: 'Chờ thanh toán',           // trang_thai_tt
      tong_tien: calculateGrandTotal(),           // tong_tien DECIMAL

      // ── VeMayBay fields ──
      hang_ghe: selectedFare,                     // hang_ghe
      trang_thai_ve: 'Đã xác nhận',              // trang_thai_ve

      // ── ChuyenBay reference ──
      flight: flightData.id,                      // ma_cb
      ma_hang: flightData.logo || flightData.code || '',            // ma_hang
      ma_may_bay: flightData.aircraft || 'A321', // ma_may_bay
      nha_ga: flightData.terminal || 'T1',       // nha_ga
      cong_khoi_hanh: flightData.gate || '--',  // cong_khoi_hanh

      // ── UI/display fields ──
      pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
      customer: contactInfo.name || passengersList[0]?.name || 'Khách hàng mới',
      phone: contactInfo.phone || '',
      email: contactInfo.email || '',
      from: flightData?.from || 'SGN',
      to: flightData?.to || 'HAN',
      airline: flightData?.airline || 'Vietnam Airlines',
      date: 'Hôm nay',
      time: flightData?.departure || '08:00 AM',
      total: calculateGrandTotal().toLocaleString('vi'),
      status: 'Chờ thanh toán',
      badge: 'hold',
      pax: passengersList.length,
      fareClass: selectedFare,
      passengersList: passengersList.map(p => ({
        name: p.name,
        seat: p.seat,
        type: p.type,
        hang_ghe: selectedFare,           // hang_ghe
        gia_ve: getBaseFare(),             // gia_ve
        trang_thai_ve: 'Da xac nhan'      // trang_thai_ve
      })),
      extraServices: extraServices,
      type: 'Một chiều',
      timeLimit: new Date(Date.now() + 24*3600000).toISOString(),
      seat: passengersList[0]?.seat || '',
      gate: flightData?.gate || '--',
      aircraft: flightData?.aircraft || 'A321',
      terminal: flightData?.terminal || 'T1'
    };
    setActionType('success');
    
    const result = await (onAddBooking as any)?.(newBooking);
    
    setTimeout(() => {
      setActionType(null);
      if (result && result.id) {
        newBooking.id = result.id;
        if (onCheckout) onCheckout(newBooking);
        if (onNavigate) onNavigate('payments');
      }
    }, 1500);
  };

  const renderBookingSteps = () => {
    switch(bookingStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Bước 1: Chọn hạng vé</h3>
            <div className="fare-grid">
              {[
                { name: 'Economy', price: flightData?.price || 1850000, features: ['7kg Carry-on', 'Standard Seat'] },
                { name: 'Premium Economy', price: (flightData?.price || 1850000) * 1.5, features: ['10kg Carry-on', 'Extra Legroom', 'Priority Boarding'] },
                { name: 'Business', price: (flightData?.price || 1850000) * 2.5, features: ['14kg Carry-on', '30kg Checked', 'Lounge Access', 'Premium Seat'] },
                { name: 'First Class', price: (flightData?.price || 1850000) * 4.5, features: ['Unlimited Carry-on', '40kg Checked', 'Private Suite', 'Fine Dining'] }
              ].map(f => (
                <div key={f.name} className={`fare-card ${selectedFare === f.name ? 'active' : ''}`} onClick={() => setSelectedFare(f.name)}>
                  <h4>{f.name}</h4>
                  <h2 className="price">{f.price.toLocaleString('vi')} đ</h2>
                  <ul>{f.features.map(feat => <li key={feat}>{feat}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="step-content">
            <h3>Bước 2: Thông tin hành khách</h3>
            
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h4 style={{ margin: 0, fontSize: 14, color: '#1e293b' }}>Danh sách hành khách</h4>
                <Button variant="outline" size="sm" onClick={() => {
                  setPassengersList([...passengersList, { id: Date.now(), name: '', type: 'Người lớn', seat: '' }]);
                  setExtraServices({
                    baggage: [...extraServices.baggage, { weight: 0, price: 0, ma_dv: '' }],
                    meals: [...extraServices.meals, { selected: false, type: '', price: 0, ma_dv: '' }],
                  });
                }}>
                  <span className="material-icons-round" style={{ fontSize: 16 }}>add</span> Thêm khách
                </Button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {passengersList.map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-end', background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0' }}>
                    <div className="field" style={{ flex: 1, margin: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Hành khách {i + 1} (Họ Tên)</label>
                      <input type="text" placeholder="NGUYEN VAN A" style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none' }} value={p.name} onChange={e => {
                        const newList = [...passengersList];
                        newList[i].name = e.target.value.toUpperCase();
                        setPassengersList(newList);
                      }} />
                    </div>
                    <div className="field" style={{ width: 130, margin: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Độ tuổi</label>
                      <select style={{ width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, outline: 'none', background: 'white' }} value={p.type} onChange={e => {
                        const newList = [...passengersList];
                        newList[i].type = e.target.value;
                        setPassengersList(newList);
                      }}>
                        <option>Người lớn</option>
                        <option>Trẻ em</option>
                        <option>Em bé</option>
                      </select>
                    </div>
                    <div className="field" style={{ width: 120, margin: 0 }}>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 6 }}>Hạng ghế</label>
                      <div style={{ padding: '10px 14px', background: '#eff6ff', color: '#2563eb', borderRadius: 8, fontSize: 13, fontWeight: 700, textAlign: 'center', border: '1px solid #bfdbfe' }}>
                        {selectedFare}
                      </div>
                    </div>
                    {passengersList.length > 1 && (
                      <button style={{ height: 38, width: 38, border: 'none', background: '#fef2f2', color: '#dc2626', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => {
                        const newList = passengersList.filter((_, idx) => idx !== i);
                        setPassengersList(newList);
                        // Also update extra services
                        setExtraServices({
                          baggage: extraServices.baggage.filter((_, idx) => idx !== i),
                          meals: extraServices.meals.filter((_, idx) => idx !== i),
                        });
                      }}>
                        <span className="material-icons-round" style={{ fontSize: 18 }}>delete</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h4 style={{ margin: '0 0 16px', fontSize: 14, color: '#1e293b' }}>Thông tin liên hệ</h4>
            <div className="form-grid-inner">
              <div className="field full">
                <label>Người liên hệ chính (In hoa không dấu)</label>
                <input type="text" placeholder="NGUYEN VAN A" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value.toUpperCase()})} />
              </div>
              <div className="field">
                <label>Số điện thoại</label>
                <input type="text" placeholder="090..." value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="khach@email.com" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h3>Bước 3: Chọn chỗ ngồi</h3>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#64748b' }}>Chọn ghế riêng biệt cho từng hành khách. Chỉ chọn được ghế phù hợp với hạng vé đã chọn.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {passengersList.map((p, index) => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: '#0f172a' }}>{p.name || `Hành khách ${index + 1}`}</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>Ghế hiện tại: <strong style={{color: '#2563eb'}}>{p.seat || 'Chưa chọn'}</strong></p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingSeatIndex(index);
                    setIsSeatMapOpen(true);
                  }}>Chọn Ghế</Button>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h3>Bước 4: Dịch vụ bổ sung</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {passengersList.map((p, i) => (
                <div key={p.id} style={{ background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                  <h4 style={{ margin: '0 0 16px', color: '#1e293b', fontSize: 14 }}>Hành khách: {p.name || `Hành khách ${i + 1}`}</h4>
                  <div className="ancillary-grid">
                    <div className="anc-card">
                      <span className="material-icons-round">luggage</span>
                      <div style={{ flex: 1 }}>
                        <b>Hành lý thêm</b>
                        <p>{extraServices.baggage[i]?.weight > 0 ? `Đã chọn: ${extraServices.baggage[i].weight}kg (+${extraServices.baggage[i].price.toLocaleString('vi')}đ)` : 'Chưa chọn hành lý'}</p>
                      </div>
                      <select 
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                        value={extraServices.baggage[i]?.weight || 0}
                        onChange={(e) => {
                          const weight = parseInt(e.target.value);
                          let price = 0;
                          let ma_dv = '';
                          if (weight > 0) {
                            ma_dv = `LUG${weight}`;
                            const svc = availableServices.find(s => s.ma_dv === ma_dv);
                            if (svc) price = svc.gia_tien;
                          }
                          const newBaggage = [...extraServices.baggage];
                          newBaggage[i] = { weight, price, ma_dv };
                          setExtraServices({ ...extraServices, baggage: newBaggage });
                        }}
                      >
                        <option value={0}>0kg - 0đ</option>
                        {availableServices.filter(s => s.ma_dv.startsWith('LUG')).map(s => {
                          const w = parseInt(s.ma_dv.replace('LUG', ''));
                          return (
                            <option key={s.ma_dv} value={w}>
                              {w}kg - {s.gia_tien.toLocaleString('vi')}đ
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="anc-card">
                      <span className="material-icons-round">restaurant</span>
                      <div style={{ flex: 1 }}>
                        <b>Suất ăn trên mây</b>
                        <p>{extraServices.meals[i]?.selected ? `Đã chọn: ${extraServices.meals[i].type} (+${extraServices.meals[i].price.toLocaleString('vi')}đ)` : 'Chưa chọn suất ăn'}</p>
                      </div>
                      <select 
                        style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #cbd5e1' }}
                        value={extraServices.meals[i]?.type || ''}
                        onChange={(e) => {
                          const type = e.target.value;
                          const selected = type !== '';
                          let price = 0;
                          let ma_dv = '';
                          if (selected) {
                            const svc = availableServices.find(s => s.ten_dv === type);
                            if (svc) {
                                price = svc.gia_tien;
                                ma_dv = svc.ma_dv;
                            }
                          }
                          const newMeals = [...extraServices.meals];
                          newMeals[i] = { selected, type, price, ma_dv };
                          setExtraServices({ ...extraServices, meals: newMeals });
                        }}
                      >
                        <option value="">Không chọn</option>
                        {availableServices.filter(s => s.ma_dv.startsWith('MEAL')).map(s => (
                          <option key={s.ma_dv} value={s.ten_dv}>
                            {s.ten_dv} - {s.gia_tien.toLocaleString('vi')}đ
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <AppLayout 
      activeItem="booking" 
      onNavigate={onNavigate || (() => {})}
      currentUser={currentUser}
      onLogout={onLogout}
      bookingPendingCount={bookingPendingCount}
      flightCount={flightCount}
      passengerCount={passengerCount}
      bookings={bookings}
    >
      <div className="booking-page-content">
        
          <div className="create-booking-view">
             <div className="booking-steps-bar">
                {[1,2,3,4].map(s => (
                  <div key={s} className={`step-item ${bookingStep === s ? 'active' : bookingStep > s ? 'completed' : ''}`}>
                    <div className="step-num">{bookingStep > s ? '✓' : s}</div>
                    <span className="step-label">{['Hạng vé','Thông tin','Ghế','Dịch vụ'][s-1]}</span>
                    {s < 4 && <div className="step-line"></div>}
                  </div>
                ))}
             </div>

             <div className="create-booking-grid">
                <div className="form-column">
                  <Card className="booking-step-card">
                    {renderBookingSteps()}
                    <div className="step-actions">
                      {bookingStep > 1 && <Button variant="outline" onClick={() => setBookingStep(s => s - 1)}>Quay lại</Button>}
                      {bookingStep < 4 ? (
                        <Button onClick={handleNextStep}>Tiếp theo</Button>
                      ) : (
                        <Button onClick={handleConfirmBooking}>ĐẾN TRANG THANH TOÁN</Button>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="summary-column">
                  <Card className="summary-card-premium">
                    <h3 className="summary-title">Tóm tắt hành trình</h3>
                    <div 
                      className="flight-mini-card clickable" 
                      onClick={() => setIsFlightSelectOpen(true)}
                      title="Click để đổi chuyến bay"
                    >
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
                        <b>{flightData?.id || 'VN-214'}</b>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="change-link">Đổi chuyến</span>
                          <span style={{color:'#2563eb', fontWeight:700}}>{selectedFare}</span>
                        </div>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                         <div style={{textAlign:'center'}}><b>{flightData?.from || 'SGN'}</b><p style={{margin:0, fontSize:11}}>{flightData?.departure || '08:30'}</p></div>
                         <span className="material-icons-round" style={{fontSize:16, color:'#94a3b8'}}>arrow_forward</span>
                         <div style={{textAlign:'center'}}><b>{flightData?.to || 'HAN'}</b><p style={{margin:0, fontSize:11}}>{flightData?.arrival || '10:45'}</p></div>
                      </div>
                    </div>
                    <div className="divider-sum"></div>
                    <div className="summary-list">
                      <div className="row-sum"><span>Giá vé ({selectedFare}) x {passengersList.length}</span><b>{(getBaseFare() * passengersList.length).toLocaleString('vi')}đ</b></div>
                      <div className="row-sum"><span>Chỗ ngồi ({passengersList.map(p => p.seat || '--').join(', ')})</span><b>0đ</b></div>
                      
                      {extraServices.baggage.some(b => b.weight > 0) && (
                        <div className="row-sum">
                          <span>Hành lý ({extraServices.baggage.filter(b => b.weight > 0).length} gói)</span>
                          <b>{extraServices.baggage.reduce((s, b) => s + b.price, 0).toLocaleString('vi')}đ</b>
                        </div>
                      )}
                      
                      {extraServices.meals.some(m => m.selected) && (
                        <div className="row-sum">
                          <span>Suất ăn ({extraServices.meals.filter(m => m.selected).length} phần)</span>
                          <b>{extraServices.meals.reduce((s, m) => s + (m.selected ? m.price : 0), 0).toLocaleString('vi')}đ</b>
                        </div>
                      )}

                      <div className="row-sum"><span>Phí phục vụ x {passengersList.length}</span><b>{(50000 * passengersList.length).toLocaleString('vi')}đ</b></div>
                    </div>
                    <div className="divider-sum"></div>
                    <div className="total-box-sum">
                      <p>TỔNG CỘNG</p>
                      <h2>{calculateGrandTotal().toLocaleString('vi')} đ</h2>
                    </div>
                    <Button fullWidth variant="outline" onClick={handleHoldBooking}>GIỮ CHỖ TRƯỚC</Button>
                  </Card>
                </div>
              </div>
           </div>

        {/* ── MODALS ── */}

        {actionType && (
          <div className="modal-overlay-b">
            <div className="modal-feedback-b">
               {actionType === 'hold' ? (
                 <>
                   <div className="icon-circle-b green">
                      <span className="material-icons-round">check_circle</span>
                   </div>
                   <h3>Giữ chỗ thành công!</h3>
                   <p>Hệ thống đã lưu lại booking. Vui lòng thanh toán trước thời hạn.</p>
                 </>
               ) : (
                 <>
                   <div className="icon-circle-b" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      <span className="material-icons-round" style={{ animation: 'spin 1s linear infinite' }}>autorenew</span>
                   </div>
                   <h3>Đang chuyển hướng...</h3>
                   <p>Vui lòng đợi trong giây lát để đến trang thanh toán.</p>
                 </>
               )}
            </div>
          </div>
        )}

        {isFlightSelectOpen && (
          <div className="modal-overlay-b" onClick={() => setIsFlightSelectOpen(false)}>
            <div className="modal-content-b wide" onClick={e => e.stopPropagation()}>
              <div className="modal-header-b">
                <h3>Chọn chuyến bay khác</h3>
                <button onClick={() => setIsFlightSelectOpen(false)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>
              <div className="modal-body-list-b" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {flights && flights.length > 0 ? (
                  flights.map(f => (
                    <div 
                      key={f.id} 
                      className={`flight-select-item ${flightData?.id === f.id ? 'selected' : ''}`}
                      onClick={() => {
                        setFlightData(f);
                        setIsFlightSelectOpen(false);
                      }}
                    >
                      <div className="f-info">
                        <b>{f.id}</b>
                        <span>{f.name}</span>
                      </div>
                      <div className="f-route">
                        <div className="r-box">
                          <b>{f.from}</b>
                          <small>{f.dep}</small>
                        </div>
                        <span className="material-icons-round">east</span>
                        <div className="r-box">
                          <b>{f.to}</b>
                          <small>{f.arr}</small>
                        </div>
                      </div>
                      <div className="f-price">
                        <b>{f.price.toLocaleString('vi')}đ</b>
                        <Button size="sm" variant={flightData?.id === f.id ? 'primary' : 'outline'}>
                          {flightData?.id === f.id ? 'Đang chọn' : 'Chọn'}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ textAlign: 'center', padding: 20, color: '#64748b' }}>Không có chuyến bay khả dụng</p>
                )}
              </div>
            </div>
          </div>
        )}

        {isSeatMapOpen && editingSeatIndex !== null && (
          <SeatMap 
            flightNumber={flightData?.id || 'VN-214'}
            allowedClass={selectedFare}
            initialSelectedSeat={passengersList[editingSeatIndex].seat}
            occupiedSeats={[
              // Get seats from all active bookings for this flight
              ...bookings
                .filter(b => b.flight === flightData?.id && b.badge !== 'danger' && b.badge !== 'default' && b.badge !== 'warning')
                .flatMap(b => b.passengersList ? b.passengersList.map((p: any) => p.seat) : (b.seat ? b.seat.split(', ') : [])),
              // Get seats from other passengers in the current session
              ...passengersList
                .filter((_, idx) => idx !== editingSeatIndex)
                .map(p => p.seat)
                .filter(s => !!s)
            ]}
            onConfirm={(seat) => {
              const newList = [...passengersList];
              newList[editingSeatIndex].seat = seat;
              setPassengersList(newList);
              setIsSeatMapOpen(false);
              setEditingSeatIndex(null);
            }}
            onCancel={() => {
              setIsSeatMapOpen(false);
              setEditingSeatIndex(null);
            }}
          />
        )}

      </div>

      <style>{`
        .booking-page-content { animation: fadeIn 0.4s ease-out; }
        .page-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .premium-table { width: 100%; border-collapse: collapse; }
        .premium-table th { padding: 14px 20px; background: #f8fafc; text-align: left; font-size: 11px; color: #94a3b8; text-transform: uppercase; border-bottom: 1px solid #f1f5f9; }
        .premium-table td { padding: 16px 20px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; }
        .booking-code { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-weight: 700; color: #2563eb; }
        .icon-btn-list { background: none; border: none; cursor: pointer; color: #94a3b8; }
        
        .booking-steps-bar { display: flex; justify-content: space-between; margin-bottom: 32px; padding: 0 40px; }
        .step-item { display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; flex: 1; }
        .step-num { width: 32px; height: 32px; border-radius: 50%; background: #f1f5f9; color: #94a3b8; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 14px; z-index: 2; border: 2px solid white; }
        .step-label { font-size: 12px; font-weight: 700; color: #94a3b8; }
        .step-line { position: absolute; top: 16px; left: 50%; width: 100%; height: 2px; background: #f1f5f9; z-index: 1; }
        .step-item.active .step-num { background: #2563eb; color: white; box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }
        .step-item.active .step-label { color: #2563eb; }
        .step-item.completed .step-num { background: #10b981; color: white; }
        .step-item.completed .step-line { background: #10b981; }

        .create-booking-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
        .booking-step-card { padding: 32px; min-height: 460px; display: flex; flex-direction: column; }
        .step-content { flex: 1; animation: fadeIn 0.3s ease-out; }
        .step-content h3 { font-size: 18px; color: #1e293b; margin-bottom: 24px; }
        .step-actions { display: flex; justify-content: space-between; margin-top: 32px; padding-top: 24px; border-top: 1px solid #f1f5f9; }

        .fare-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        .fare-card { padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: all 0.2s; background: white; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .fare-card:hover { border-color: #2563eb; background: #f8fafc; transform: translateY(-2px); }
        .fare-card.active { border-color: #2563eb; background: #eff6ff; box-shadow: 0 4px 12px rgba(37,99,235,0.08); }
        .fare-card.active::before { content: 'check_circle'; font-family: 'Material Icons Round'; position: absolute; top: 12px; right: 12px; color: #2563eb; font-size: 20px; }
        .fare-card h4 { margin: 0 0 4px; color: #1e293b; font-size: 14px; font-weight: 700; }
        .fare-card .price { margin: 0 0 12px; color: #2563eb; font-size: 16px; font-weight: 900; }
        .fare-card ul { padding: 0; list-style: none; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 4px; }
        .fare-card li { font-size: 10px; color: #64748b; display: flex; align-items: center; gap: 4px; line-height: 1.2; }
        .fare-card li::before { content: 'done'; font-family: 'Material Icons Round'; font-size: 11px; color: #10b981; }

        .seat-map-wrapper { background: #f8fafc; padding: 20px; border-radius: 12px; }
        .seat-legend { display: flex; gap: 16px; justify-content: center; margin-bottom: 20px; }
        .leg { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }
        .sq { width: 12px; height: 12px; border-radius: 2px; border: 1px solid #cbd5e1; }
        .sq.occupied { background: #cbd5e1; }
        .sq.selected { background: #2563eb; border-color: #2563eb; }
        .seat-grid { display: flex; gap: 12px; justify-content: center; }
        .row-labels { display: flex; flex-direction: column; gap: 8px; padding-top: 4px; }
        .row-labels span { height: 24px; font-size: 11px; color: #94a3b8; font-weight: 700; display: flex; align-items: center; }
        .seat-row { display: flex; gap: 6px; margin-bottom: 8px; }
        .seat-box { width: 24px; height: 24px; border-radius: 4px; border: 1px solid #cbd5e1; background: white; font-size: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .seat-box.occupied { background: #cbd5e1; cursor: not-allowed; color: transparent; }
        .seat-box.selected { background: #2563eb; color: white; border-color: #2563eb; }
        .aisle { width: 16px; }

        .form-grid-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field.full { grid-column: span 2; }
        .field label { display: block; font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 6px; }
        .field input { width: 100%; padding: 10px 14px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }

        .ancillary-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .anc-card { display: flex; align-items: center; gap: 16px; padding: 12px 16px; border: 1px solid #e2e8f0; border-radius: 12px; }
        .anc-card .material-icons-round { width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; color: #2563eb; }
        .anc-card b { font-size: 13px; color: #1e293b; }
        .anc-card p { margin: 0; font-size: 11px; color: #64748b; }

        .payment-methods-step { display: flex; flex-direction: column; gap: 10px; }
        .pay-option-step { display: flex; align-items: center; gap: 12px; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 700; color: #475569; }
        .pay-option-step.active { border-color: #2563eb; background: #eff6ff; color: #1e40af; }

        .summary-card-premium { position: sticky; top: 0; }
        .summary-title { font-size: 15px; margin: 0 0 16px; }
        .flight-mini-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; transition: all 0.2s; }
        .flight-mini-card.clickable { cursor: pointer; border-left: 4px solid #2563eb; }
        .flight-mini-card.clickable:hover { background: #eff6ff; border-color: #2563eb; transform: translateX(2px); }
        .change-link { font-size: 11px; color: #64748b; text-decoration: underline; opacity: 0; transition: 0.2s; }
        .flight-mini-card.clickable:hover .change-link { opacity: 1; }
        .divider-sum { height: 1px; background: #f1f5f9; margin: 16px 0; }
        .summary-list { display: flex; flex-direction: column; gap: 8px; }
        .row-sum { display: flex; justify-content: space-between; font-size: 13px; color: #64748b; }
        .row-sum b { color: #1e293b; }
        .total-box-sum { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; }
        .total-box-sum p { margin: 0; font-size: 12px; font-weight: 800; color: #64748b; }
        .total-box-sum h2 { margin: 0; font-size: 20px; color: #2563eb; font-weight: 900; }

        .modal-overlay-b { position: fixed; inset: 0; background: rgba(15,23,42,0.6); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; }
        .modal-content-b { background: white; border-radius: 16px; width: 450px; overflow: hidden; }
        .modal-header-b { padding: 16px 24px; background: #f8fafc; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .modal-header-b h3 { font-size: 16px; margin: 0; }
        .modal-header-b button { background: none; border: none; cursor: pointer; color: #94a3b8; }
        .modal-body-list-b { padding: 20px 24px; display: flex; flex-direction: column; gap: 12px; }
        .m-item-b { display: flex; justify-content: space-between; font-size: 14px; }
        .m-item-b span { color: #64748b; }
        .m-item-b b { color: #1e293b; }
        .modal-footer-b { padding: 16px 24px; background: #f8fafc; display: flex; justify-content: flex-end; gap: 12px; }
        .modal-feedback-b { background: white; padding: 40px; border-radius: 20px; width: 360px; text-align: center; }
        .icon-circle-b { width: 64px; height: 64px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .icon-circle-b.green { background: #dcfce7; color: #16a34a; }
        .icon-circle-b span { font-size: 32px; }

        .modal-content-b.wide { width: 600px; }
        .flight-select-item { display: flex; align-items: center; justify-content: space-between; padding: 16px; border: 1px solid #e2e8f0; border-radius: 12px; cursor: pointer; transition: 0.2s; margin-bottom: 10px; }
        .flight-select-item:hover { background: #f8fafc; border-color: #cbd5e1; }
        .flight-select-item.selected { border-color: #2563eb; background: #eff6ff; }
        .f-info { display: flex; flex-direction: column; width: 120px; }
        .f-info b { font-size: 14px; color: #1e293b; }
        .f-info span { font-size: 11px; color: #64748b; }
        .f-route { display: flex; align-items: center; gap: 12px; flex: 1; justify-content: center; }
        .r-box { text-align: center; width: 60px; }
        .r-box b { display: block; font-size: 15px; color: #0f172a; }
        .r-box small { font-size: 11px; color: #64748b; }
        .f-price { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; width: 140px; }
        .f-price b { color: #2563eb; font-size: 16px; font-weight: 800; }

        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </AppLayout>
  );
};

export default BookingPage;
