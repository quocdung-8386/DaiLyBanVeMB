import React, { useState } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import AppLayout from '../../components/AppLayout';

interface BookingPageProps {
  onNavigate?: (id: string) => void;
  initialFlight?: any;
  onCheckout?: (ticket: any) => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ onNavigate, initialFlight, onCheckout }) => {
  const [view, setView] = useState<'list' | 'create'>(initialFlight ? 'create' : 'list');
  const [flightData, setFlightData] = useState<any>(initialFlight || null);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [actionType, setActionType] = useState<'hold' | 'delete' | 'success' | null>(null);

  const [bookingsList, setBookingsList] = useState([
    { id: 'BKG-8A2F9', customer: 'Nguyễn Văn Trường', phone: '0901234567', routeFrom: 'SGN', routeTo: 'HAN', flightId: 'VN-214', flightClass: 'Phổ thông', date: '12 Thg 10, 2023', time: '08:30 AM', total: '3,250,000', status: 'Đã xác nhận', badge: 'success', initials: 'NT' },
    { id: 'BKG-7X1M4', customer: 'Trần Thị Lan', phone: '0987654321', routeFrom: 'DAD', routeTo: 'SGN', flightId: 'VJ-102', flightClass: 'Thương gia', date: '15 Thg 10, 2023', time: '14:00 PM', total: '5,100,000', status: 'Chờ xử lý', badge: 'warning', initials: 'TL' },
    { id: 'BKG-2K9P0', customer: 'Lê Văn Đạt', phone: '0912345678', routeFrom: 'HAN', routeTo: 'PQC', flightId: 'QH-305', flightClass: 'Phổ thông', date: '10 Thg 10, 2023', time: '09:15 AM', total: '2,800,000', status: 'Đã hủy', badge: 'danger', initials: 'LĐ' },
  ]);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedFare, setSelectedFare] = useState('Economy');
  const [selectedSeat, setSelectedSeat] = useState('12C');

  const handleHoldBooking = () => {
    const newBooking = {
      id: `BKG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      customer: customerName || 'Khách hàng mới',
      phone: customerPhone || 'Chưa cung cấp',
      routeFrom: flightData?.from || 'SGN',
      routeTo: flightData?.to || 'HAN',
      flightId: flightData?.id || 'VN-204',
      flightClass: selectedFare,
      date: 'Hôm nay',
      time: flightData?.departure || '08:00 AM',
      total: ((flightData?.price || 1850000) * 1.1).toLocaleString('vi'),
      status: 'Chờ xử lý',
      badge: 'warning',
      initials: (customerName || 'KH').substring(0, 2).toUpperCase()
    };
    setBookingsList([newBooking, ...bookingsList]);
    setActionType('hold');
    setTimeout(() => {
      setActionType(null);
      setView('list');
      setCustomerName('');
      setCustomerPhone('');
      setBookingStep(1);
    }, 2000);
  };

  const handleConfirmBooking = () => {
    if (onCheckout) {
      onCheckout({
        id: `BKG-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        pnr: Math.random().toString(36).substring(2, 8).toUpperCase(),
        customer: customerName || 'Khách hàng mới',
        routeFrom: flightData?.from || 'SGN',
        routeTo: flightData?.to || 'HAN',
        airportFrom: flightData?.from === 'HAN' ? 'Nội Bài' : 'Tân Sơn Nhất',
        airportTo: flightData?.to === 'HAN' ? 'Nội Bài' : 'Tân Sơn Nhất',
        date: 'Hôm nay',
        total: ((flightData?.price || 1850000) * 1.1).toLocaleString('vi'),
        gate: '--', terminal: 'T1', seat: selectedSeat, boarding: flightData?.departure || '08:00 AM',
        badge: 'hold', status: 'Chờ thanh toán', timeLimit: new Date(Date.now() + 24*3600000).toISOString()
      });
    } else if (onNavigate) {
      onNavigate('payments');
    }
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
            <h3>Bước 2: Chọn chỗ ngồi</h3>
            <div className="seat-map-wrapper">
               <div className="seat-legend">
                  <span className="leg"><i className="sq empty"></i> Trống</span>
                  <span className="leg"><i className="sq occupied"></i> Đã đặt</span>
                  <span className="leg"><i className="sq selected"></i> Đang chọn</span>
               </div>
               <div className="seat-grid">
                  <div className="row-labels">{[1,2,3,4,5].map(r => <span key={r}>{r}</span>)}</div>
                  <div className="seats">
                     {[1,2,3,4,5].map(r => (
                        <div key={r} className="seat-row">
                           {['A','B','C','gap','D','E','F'].map((c, i) => {
                              if (c === 'gap') return <div key={i} className="aisle"></div>;
                              const sId = `${r}${c}`;
                              const isOcc = (r === 2 && c === 'A');
                              const isSel = selectedSeat === sId;
                              return <div key={c} className={`seat-box ${isOcc ? 'occupied' : isSel ? 'selected' : ''}`} onClick={() => !isOcc && setSelectedSeat(sId)}>{c}</div>;
                           })}
                        </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="step-content">
            <h3>Bước 3: Thông tin hành khách</h3>
            <div className="form-grid-inner">
              <div className="field full">
                <label>Họ và Tên (In hoa không dấu)</label>
                <input type="text" placeholder="NGUYEN VAN A" value={customerName} onChange={e => setCustomerName(e.target.value.toUpperCase())} />
              </div>
              <div className="field">
                <label>Số điện thoại</label>
                <input type="text" placeholder="090..." value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="khach@email.com" />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="step-content">
            <h3>Bước 4: Dịch vụ bổ sung</h3>
            <div className="ancillary-grid">
              <div className="anc-card">
                <span className="material-icons-round">luggage</span>
                <div>
                  <b>Hành lý thêm</b>
                  <p>Thêm 20kg chỉ từ 250k</p>
                </div>
                <Button size="sm" variant="outline">Thêm</Button>
              </div>
              <div className="anc-card">
                <span className="material-icons-round">restaurant</span>
                <div>
                  <b>Suất ăn</b>
                  <p>Thực đơn đa dạng</p>
                </div>
                <Button size="sm" variant="outline">Thêm</Button>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="step-content">
            <h3>Bước 5: Thanh toán</h3>
            <div className="payment-methods-step">
              <div className="pay-option-step active"><span className="material-icons-round">account_balance</span> Chuyển khoản ngân hàng</div>
              <div className="pay-option-step"><span className="material-icons-round">credit_card</span> Thẻ quốc tế (Visa/Master)</div>
              <div className="pay-option-step"><span className="material-icons-round">qr_code_2</span> Ví điện tử (MoMo, VNPay)</div>
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
      breadcrumb={view === 'create' ? [{ label: 'Tìm chuyến bay', page: 'flights' }, { label: 'Đặt chỗ' }] : [{ label: 'Điều hành', page: 'dashboard' }, { label: 'Đặt chỗ' }]}
    >
      <div className="booking-page-content">
        
        {view === 'list' ? (
          <>
            <div className="page-header-flex">
              <div>
                <h1>Quản lý Đặt chỗ</h1>
                <p>Theo dõi và xử lý toàn bộ yêu cầu đặt chỗ của hành khách.</p>
              </div>
              <div className="action-buttons-list">
                <Button onClick={() => setView('create')}><span className="material-icons-round">add</span> Tạo Booking Mới</Button>
              </div>
            </div>

            <Card className="table-card" noPadding>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>MÃ BOOKING</th>
                    <th>KHÁCH HÀNG</th>
                    <th>CHUYẾN BAY</th>
                    <th>GHẾ</th>
                    <th>TỔNG TIỀN</th>
                    <th>TRẠNG THÁI</th>
                    <th>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsList.map(b => (
                    <tr key={b.id}>
                      <td><code className="booking-code">{b.id}</code></td>
                      <td><b>{b.customer}</b><p style={{margin:0, fontSize:11, color:'#64748b'}}>{b.phone}</p></td>
                      <td>{b.flightId} • {b.routeFrom}-{b.routeTo}</td>
                      <td>{b.id === 'BKG-8A2F9' ? '14A' : '--'}</td>
                      <td>{b.total}đ</td>
                      <td><span className={`badge badge-${b.badge}`}>{b.status}</span></td>
                      <td>
                        <button className="icon-btn-list" onClick={() => setViewingItem(b)}><span className="material-icons-round">visibility</span></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </>
        ) : (
          <div className="create-booking-view">
             <div className="booking-steps-bar">
                {[1,2,3,4,5].map(s => (
                  <div key={s} className={`step-item ${bookingStep === s ? 'active' : bookingStep > s ? 'completed' : ''}`}>
                    <div className="step-num">{bookingStep > s ? '✓' : s}</div>
                    <span className="step-label">{['Hạng vé','Ghế','Thông tin','Dịch vụ','Thanh toán'][s-1]}</span>
                    {s < 5 && <div className="step-line"></div>}
                  </div>
                ))}
             </div>

             <div className="create-booking-grid">
                <div className="form-column">
                  <Card className="booking-step-card">
                    {renderBookingSteps()}
                    <div className="step-actions">
                      {bookingStep > 1 && <Button variant="outline" onClick={() => setBookingStep(s => s - 1)}>Quay lại</Button>}
                      {bookingStep < 5 ? (
                        <Button onClick={() => setBookingStep(s => s + 1)}>Tiếp theo</Button>
                      ) : (
                        <Button onClick={handleConfirmBooking}>XÁC NHẬN ĐẶT VÉ</Button>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="summary-column">
                  <Card className="summary-card-premium">
                    <h3 className="summary-title">Tóm tắt hành trình</h3>
                    <div className="flight-mini-card">
                      <div style={{display:'flex', justifyContent:'space-between', marginBottom:12}}>
                        <b>{flightData?.id || 'VN-214'}</b>
                        <span style={{color:'#2563eb', fontWeight:700}}>{selectedFare}</span>
                      </div>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                         <div style={{textAlign:'center'}}><b>{flightData?.from || 'SGN'}</b><p style={{margin:0, fontSize:11}}>{flightData?.departure || '08:30'}</p></div>
                         <span className="material-icons-round" style={{fontSize:16, color:'#94a3b8'}}>arrow_forward</span>
                         <div style={{textAlign:'center'}}><b>{flightData?.to || 'HAN'}</b><p style={{margin:0, fontSize:11}}>{flightData?.arrival || '10:45'}</p></div>
                      </div>
                    </div>
                    <div className="divider-sum"></div>
                    <div className="summary-list">
                      <div className="row-sum"><span>Giá vé ({selectedFare})</span><b>{(flightData?.price || 1850000).toLocaleString('vi')}đ</b></div>
                      <div className="row-sum"><span>Chỗ ngồi ({selectedSeat})</span><b>0đ</b></div>
                      <div className="row-sum"><span>Phí phục vụ</span><b>50.000đ</b></div>
                    </div>
                    <div className="divider-sum"></div>
                    <div className="total-box-sum">
                      <p>TỔNG CỘNG</p>
                      <h2>{((flightData?.price || 1850000) + 50000).toLocaleString('vi')} đ</h2>
                    </div>
                    <Button fullWidth variant="outline" onClick={handleHoldBooking}>GIỮ CHỖ TRƯỚC</Button>
                  </Card>
                </div>
             </div>
          </div>
        )}

        {/* ── MODALS ── */}
        {viewingItem && (
          <div className="modal-overlay-b" onClick={() => setViewingItem(null)}>
            <div className="modal-content-b" onClick={e => e.stopPropagation()}>
               <div className="modal-header-b">
                  <h3>Chi tiết Đặt chỗ</h3>
                  <button onClick={() => setViewingItem(null)}><span className="material-icons-round">close</span></button>
               </div>
               <div className="modal-body-list-b">
                  <div className="m-item-b"><span>Mã Booking:</span><b>{viewingItem.id}</b></div>
                  <div className="m-item-b"><span>Hành khách:</span><b>{viewingItem.customer}</b></div>
                  <div className="m-item-b"><span>Số điện thoại:</span><b>{viewingItem.phone}</b></div>
                  <div className="m-item-b"><span>Hành trình:</span><b>{viewingItem.routeFrom} ➔ {viewingItem.routeTo}</b></div>
                  <div className="m-item-b"><span>Chuyến bay:</span><b>{viewingItem.flightId}</b></div>
                  <div className="m-item-b"><span>Thời gian:</span><b>{viewingItem.date} {viewingItem.time}</b></div>
                  <div className="m-item-b"><span>Trạng thái:</span><span className={`badge badge-${viewingItem.badge}`}>{viewingItem.status}</span></div>
               </div>
               <div className="modal-footer-b">
                  <Button variant="outline" onClick={() => setViewingItem(null)}>Đóng</Button>
                  <Button onClick={() => setViewingItem(null)}>In vé</Button>
               </div>
            </div>
          </div>
        )}

        {actionType && (
          <div className="modal-overlay-b">
            <div className="modal-feedback-b">
               <div className="icon-circle-b green">
                  <span className="material-icons-round">check_circle</span>
               </div>
               <h3>Thành công!</h3>
               <p>Yêu cầu đã được hệ thống xử lý.</p>
               <div className="f-actions-b">
                  <Button onClick={() => setActionType(null)}>Đóng</Button>
               </div>
            </div>
          </div>
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

        .fare-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .fare-card { padding: 20px; border: 2px solid #f1f5f9; border-radius: 16px; cursor: pointer; transition: all 0.2s; }
        .fare-card:hover { border-color: #bfdbfe; background: #f8fbff; }
        .fare-card.active { border-color: #2563eb; background: #eff6ff; }
        .fare-card h4 { margin: 0 0 8px; color: #1e293b; font-size: 15px; }
        .fare-card .price { margin: 0 0 16px; color: #2563eb; font-size: 18px; font-weight: 900; }
        .fare-card ul { padding: 0; list-style: none; margin: 0; }
        .fare-card li { font-size: 11px; color: #64748b; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
        .fare-card li::before { content: 'check'; font-family: 'Material Icons Round'; font-size: 12px; color: #10b981; }

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
        .flight-mini-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px; }
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default BookingPage;
