import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import type { TicketData } from '../page';

interface PaymentsPageProps {
  onNavigate?: (id: string) => void;
  view?: 'checkout' | 'success';
  setView?: (view: 'checkout' | 'success') => void;
  ticketData?: TicketData | null;
  onClose?: () => void;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, view = 'checkout', setView, ticketData, onClose }) => {
  const [paymentMode, setPaymentMode] = useState<'pos' | 'remote'>('pos');
  const [posMethod, setPosMethod] = useState<'cash' | 'transfer' | 'card'>('cash');
  const [localTicket, setLocalTicket] = useState<TicketData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  
  const currentTicket = ticketData || localTicket;
  const [amountCollected, setAmountCollected] = useState<string>('');

  React.useEffect(() => {
    if (currentTicket) {
      setAmountCollected(currentTicket.total ?? '0');
    }
  }, [currentTicket]);

  const mockTickets = [
    { id: '738-29481726', pnr: 'G7X9PQ', customer: 'Nguyễn Văn An', routeFrom: 'SGN', routeTo: 'HAN', date: '24/10/2023 08:30', total: '3,250,000', status: 'Đang hiệu lực', badge: 'success', airportFrom: 'Tân Sơn Nhất', airportTo: 'Nội Bài', gate: 'B12', terminal: 'T2', seat: '14A', boarding: '09:30' },
    { id: '738-99283741', pnr: 'A2B4C6', customer: 'Trần Thị Bé', routeFrom: 'DAD', routeTo: 'SGN', date: '25/10/2023 14:15', total: '1,890,000', status: 'Đã hủy', badge: 'danger', airportFrom: 'Đà Nẵng', airportTo: 'Tân Sơn Nhất', gate: 'A5', terminal: 'T1', seat: '22C', boarding: '14:00' },
    { id: '112-55443322', pnr: 'L9M1N2', customer: 'Lê Hữu Đạt', routeFrom: 'HAN', routeTo: 'PQC', date: '28/10/2023 09:40', total: '4,100,000', status: 'Đã hoàn tiền', badge: 'warning', airportFrom: 'Nội Bài', airportTo: 'Phú Quốc', gate: 'C3', terminal: 'T1', seat: '8B', boarding: '09:15' },
    { id: '738-11229988', pnr: 'X7Y8Z9', customer: 'Phạm Tuấn Khải', routeFrom: 'SGN', routeTo: 'HPH', date: '02/11/2023 18:00', total: '2,450,000', status: 'Đã Void', badge: 'default', airportFrom: 'Tân Sơn Nhất', airportTo: 'Cát Bi', gate: 'B8', terminal: 'T2', seat: '31F', boarding: '17:30' },
  ];

  const handleSearch = () => {
    if (!searchQuery) return;
    const query = searchQuery.trim().toUpperCase();
    const found = mockTickets.find(t => t.pnr.toUpperCase() === query || t.id === query);
    
    if (found) {
      setLocalTicket(found);
      setSearchError('');
    } else {
      setSearchError('Không tìm thấy vé hoặc Booking nào khớp với mã vừa nhập.');
    }
  };
  return (
    <div className="payments-modal-container" onClick={(e) => e.stopPropagation()}>
      <div className="pm-header">
        <h2>{view === 'success' ? 'Hoàn tất giao dịch' : 'Thanh toán & Ghi nhận'}</h2>
        {onClose && (
          <button className="pm-close-btn" onClick={onClose}>
            <span className="material-icons-round">close</span>
          </button>
        )}
      </div>
      
      <div className="pm-content">
        {view === 'checkout' && (
          <>

              <div className="payment-mode-tabs mb-lg">
                <button className={`pm-tab ${paymentMode === 'pos' ? 'active' : ''}`} onClick={() => setPaymentMode('pos')}>
                  <span className="material-icons-round">point_of_sale</span>
                  Thu tiền tại quầy
                </button>
                <button className={`pm-tab ${paymentMode === 'remote' ? 'active' : ''}`} onClick={() => setPaymentMode('remote')}>
                  <span className="material-icons-round">qr_code_2</span>
                  Gửi yêu cầu thanh toán
                </button>
              </div>

              {!currentTicket ? (
                <div className="search-booking-container">
                  <Card className="search-card">
                    <div className="search-icon-wrapper">
                      <span className="material-icons-round">search</span>
                    </div>
                    <h2>Tìm kiếm thông tin thanh toán</h2>
                    <p className="text-muted mb-lg">Nhập mã Booking (PNR) hoặc Mã vé để lấy dữ liệu thanh toán.</p>
                    
                    <div className="search-input-group">
                      <input 
                        type="text" 
                        placeholder="VD: G7X9PQ hoặc 738-29481726" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                      <Button className="btn-primary-alt" onClick={handleSearch}>Tìm kiếm</Button>
                    </div>
                    {searchError && <p className="text-danger mt-sm text-sm" style={{ textAlign: 'left' }}>{searchError}</p>}
                  </Card>
                </div>
              ) : (
                <div className="checkout-layout">
                  <div className="checkout-main">
                    <Card className="checkout-card mb-lg">
                    <div className="card-title">
                      <span className="material-icons-round text-primary">receipt</span>
                      <h3>Thông tin vé</h3>
                    </div>
                    <div className="booking-info-grid">
                      <div>
                        <p className="label">MÃ VÉ</p>
                        <p className="val text-primary font-bold">{currentTicket?.id ?? 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="label">CHUYẾN BAY</p>
                        <p className="val font-bold">{currentTicket?.routeFrom ?? '---'} <span className="material-icons-round icon-xs">flight_takeoff</span> {currentTicket?.routeTo ?? '---'}</p>
                        <p className="sub-val">PNR: {currentTicket?.pnr ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="label">KHÁCH HÀNG</p>
                        <p className="val font-medium">{currentTicket?.customer ?? 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="label">NGÀY BAY</p>
                        <p className="val font-medium">{currentTicket?.date?.split(' ')[0] ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="label">SÂN BAY CẤT CÁNH</p>
                        <p className="val font-medium">{currentTicket?.airportFrom ?? 'N/A'} ({currentTicket?.routeFrom})</p>
                      </div>
                      <div className="text-right">
                        <p className="label">CỔNG SOÁT VÉ / NHÀ GA</p>
                        <p className="val font-medium">{currentTicket?.gate ?? 'N/A'} / {currentTicket?.terminal ?? 'N/A'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="checkout-card">
                    <div className="card-title">
                      <span className="material-icons-round text-primary">{paymentMode === 'pos' ? 'payments' : 'share'}</span>
                      <h3>{paymentMode === 'pos' ? 'Ghi nhận phương thức' : 'Tạo mã thanh toán từ xa'}</h3>
                    </div>
                    {paymentMode === 'pos' ? (
                      <div className="payment-methods">
                        <label className={`method-option ${posMethod === 'cash' ? 'active' : ''}`}>
                          <input type="radio" name="payment" checked={posMethod === 'cash'} onChange={() => setPosMethod('cash')} />
                          <div className="method-icon bg-green"><span className="material-icons-round">payments</span></div>
                          <div className="method-details">
                            <h4>Tiền mặt</h4>
                            <p>Khách trả tiền mặt tại quầy</p>
                          </div>
                        </label>
                        {posMethod === 'cash' && (
                          <div className="sub-form">
                            <div className="form-group">
                              <label>Khách đưa (VNĐ)</label>
                              <input type="text" className="input-field" defaultValue={currentTicket?.total?.replace(/\D/g, '')} />
                            </div>
                            <div className="form-group">
                              <label>Tiền thừa</label>
                              <input type="text" className="input-field bg-light" readOnly value="0" />
                            </div>
                          </div>
                        )}

                        <label className={`method-option ${posMethod === 'transfer' ? 'active' : ''}`}>
                          <input type="radio" name="payment" checked={posMethod === 'transfer'} onChange={() => setPosMethod('transfer')} />
                          <div className="method-icon bg-primary"><span className="material-icons-round">account_balance</span></div>
                          <div className="method-details">
                            <h4>Chuyển khoản ngân hàng</h4>
                            <p>Khách chuyển vào STK Đại lý</p>
                          </div>
                        </label>
                        {posMethod === 'transfer' && (
                          <div className="sub-form transfer-details">
                            <p className="mb-sm"><strong>STK:</strong> 19034567890011 - Techcombank</p>
                            <p className="mb-sm"><strong>Chủ tài khoản:</strong> CTY TNHH AIRLINE SYSTEM</p>
                            <Button variant="outline" size="sm" className="w-full mt-sm btn-upload"><span className="material-icons-round">upload_file</span> Tải lên biên lai / UNC</Button>
                          </div>
                        )}

                        <label className={`method-option ${posMethod === 'card' ? 'active' : ''}`}>
                          <input type="radio" name="payment" checked={posMethod === 'card'} onChange={() => setPosMethod('card')} />
                          <div className="method-icon bg-gray"><span className="material-icons-round">credit_card</span></div>
                          <div className="method-details">
                            <h4>Quẹt thẻ (Máy POS)</h4>
                            <p>Visa, Master, JCB, Napas</p>
                          </div>
                        </label>
                        {posMethod === 'card' && (
                          <div className="sub-form">
                            <div className="form-group">
                              <label>Mã chuẩn chi (Approve Code)</label>
                              <input type="text" className="input-field" placeholder="Nhập mã in trên biên lai POS" />
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="remote-payment-gen">
                        <div className="qr-preview">
                          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=pay_me" alt="QR Code" />
                          <p>Quét mã để thanh toán <strong>{currentTicket?.total ?? '0'} đ</strong></p>
                        </div>
                        <div className="remote-actions">
                          <Button className="w-full btn-outline-primary mb-sm"><span className="material-icons-round">content_copy</span> Copy Link Thanh Toán</Button>
                          <Button className="w-full btn-zalo"><span className="material-icons-round">chat</span> Gửi qua Zalo</Button>
                        </div>
                        <div className="polling-status mt-lg">
                          <span className="spinner"></span>
                          <p>Hệ thống đang chờ khách thanh toán...</p>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>

                <div className="checkout-sidebar">
                  <Card className="summary-card">
                    <div className="summary-header">
                      <h3>Chi tiết chi phí</h3>
                    </div>
                    <div className="summary-body">
                      <div className="summary-row">
                        <span>Giá vé</span>
                        <span>{currentTicket?.total ?? 'N/A'} đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Thuế & Phí</span>
                        <span>50,000 đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Phí dịch vụ</span>
                        <span>20,000 đ</span>
                      </div>
                    </div>
                    <div className="summary-total">
                      <span>Tổng tiền</span>
                      <h2>{currentTicket?.total ?? 'N/A'} đ</h2>
                    </div>
                    <div className="summary-actions">
                      <div className="form-group mb-md mt-sm">
                        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Số tiền thu lần này (VNĐ)</label>
                        <input type="text" className="input-field amount-input" value={amountCollected} onChange={(e) => setAmountCollected(e.target.value)} />
                      </div>
                      <Button className="w-full mb-sm btn-primary-alt" onClick={() => setView && setView('success')}>
                        <span className="material-icons-round">done_all</span>
                        Xác nhận thu tiền
                      </Button>
                      <Button variant="outline" className="w-full text-danger border-danger" onClick={() => { if(onClose) onClose(); else if(onNavigate) onNavigate('booking'); }}>
                        Hủy giao dịch
                      </Button>
                      {paymentMode === 'remote' && <p className="secure-note"><span className="material-icons-round">info</span> Giao dịch sẽ tự động xác nhận khi nhận được tiền</p>}
                    </div>
                  </Card>
                </div>
              </div>
              )}
            </>
          )}

          {view === 'success' && (
            <div className="success-view">
              <div className="success-banner mb-xl">
                <div className="success-icon">
                  <span className="material-icons-round">check_circle</span>
                </div>
                <h2>Thanh toán thành công!</h2>
                <p>Booking <strong>{currentTicket?.pnr ?? 'N/A'}</strong> đã được thanh toán và vé đã được xuất.</p>
                <div className="flex-row gap-sm mt-md justify-center">
                  <Button variant="outline" onClick={() => { if(onClose) onClose(); onNavigate && onNavigate('payment_history'); }}>Xem lịch sử giao dịch</Button>
                  <Button className="btn-primary-alt" onClick={() => window.print()}>
                    <span className="material-icons-round">print</span>
                    In vé máy bay
                  </Button>
                </div>
              </div>

              <div className="tickets-display">
                <h3>Boarding Pass — {currentTicket?.customer ?? 'Hành khách'}</h3>
                <div className="tickets-grid mt-md">
                  {/* Printed ticket with real data */}
                  <Card className="issued-ticket-card">
                    <div className="it-header bg-primary">
                      <div className="flex-row justify-between">
                        <span className="airline-logo bg-white text-primary font-bold">VN</span>
                        <span className="text-white font-monospace">PNR: {currentTicket?.pnr ?? 'N/A'}</span>
                      </div>
                      <h2 className="text-white mt-md">BOARDING PASS</h2>
                    </div>
                    <div className="it-body">
                      <div className="it-route mb-md">
                        <div className="loc">
                          <h2>{currentTicket?.routeFrom ?? '---'}</h2>
                          <p>{currentTicket?.airportFrom ?? 'N/A'}</p>
                        </div>
                        <div className="dur">
                          <span className="material-icons-round text-primary">flight_takeoff</span>
                          <p>Bay thẳng</p>
                        </div>
                        <div className="loc text-right">
                          <h2>{currentTicket?.routeTo ?? '---'}</h2>
                          <p>{currentTicket?.airportTo ?? 'N/A'}</p>
                        </div>
                      </div>
                      <div className="it-info-grid">
                        <div>
                          <p className="label">Hành khách</p>
                          <p className="val">{currentTicket?.customer?.toUpperCase() ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Ngày bay</p>
                          <p className="val">{currentTicket?.date?.split(' ')[0] ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Giờ khởi hành</p>
                          <p className="val">{currentTicket?.date?.split(' ')[1] ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Ghế (Seat)</p>
                          <p className="val font-bold">{currentTicket?.seat ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Cổng soát vé</p>
                          <p className="val font-bold">{currentTicket?.gate ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Nhà ga</p>
                          <p className="val">{currentTicket?.terminal ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Lên máy bay</p>
                          <p className="val font-bold">{currentTicket?.boarding ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Mã vé (Ticket No.)</p>
                          <p className="val">{currentTicket?.id ?? 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="it-footer">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => window.print()}>
                        <span className="material-icons-round">print</span>
                        In vé máy bay
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
      </div>

      <style>{`
        .payments-modal-container {
          background: #f8fafc;
          border-radius: 20px;
          width: 1000px;
          max-width: 95vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modalSlideUp {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }

        .pm-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: white;
          border-bottom: 1px solid var(--border);
          flex-shrink: 0;
        }
        .pm-header h2 { font-size: 20px; color: var(--text-main); margin: 0; }
        .pm-close-btn {
          background: transparent; border: none; cursor: pointer;
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary); transition: all 0.2s;
        }
        .pm-close-btn:hover { background: #f1f5f9; color: var(--danger); }

        .pm-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .text-primary { color: var(--primary); }
        .text-danger { color: var(--danger); }
        .text-muted { color: var(--text-muted); }
        .text-white { color: white; }
        .bg-white { background: white; }
        .bg-primary { background: var(--primary); }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .font-monospace { font-family: monospace; }
        .text-sm { font-size: 12px; }
        .text-right { text-align: right; }
        .w-full { width: 100%; }
        .flex-row { display: flex; align-items: center; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .gap-sm { gap: var(--space-sm); }
        .mb-sm { margin-bottom: var(--space-sm); }
        .mb-md { margin-bottom: var(--space-md); }
        .mb-lg { margin-bottom: var(--space-lg); }
        .mb-xl { margin-bottom: var(--space-xl); }
        .mt-md { margin-top: var(--space-md); }
        .flex-1 { flex: 1; }
        .flex-end { justify-content: flex-end; }

        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .breadcrumb .link { color: var(--primary); cursor: pointer; }
        .breadcrumb .separator { font-size: 16px; }
        .breadcrumb .current { color: var(--text-main); }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .page-header h1 { font-size: 24px; margin-bottom: 4px; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        /* Search Booking View */
        .search-booking-container { display: flex; justify-content: center; align-items: center; padding: 40px 0; }
        .search-card { max-width: 500px; width: 100%; text-align: center; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .search-icon-wrapper { width: 64px; height: 64px; background: #eff6ff; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 32px; }
        .search-icon-wrapper .material-icons-round { font-size: inherit; }
        .search-card h2 { font-size: 20px; margin-bottom: 8px; }
        .search-input-group { display: flex; gap: 8px; margin-top: 24px; }
        .search-input-group input { flex: 1; padding: 12px 16px; border: 1px solid var(--border); border-radius: 8px; outline: none; font-size: 15px; }
        .search-input-group input:focus { border-color: var(--primary); }


        /* Checkout View */
        .checkout-layout { display: flex; gap: var(--space-xl); align-items: flex-start; }
        .checkout-main { flex: 1; min-width: 0; }
        .checkout-sidebar { width: 340px; flex-shrink: 0; position: sticky; top: 20px; }
        
        .checkout-card { padding: var(--space-lg); }
        .card-title { display: flex; align-items: center; gap: 8px; margin-bottom: var(--space-lg); border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .card-title h3 { font-size: 16px; margin: 0; }

        .booking-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px; }
        .booking-info-grid .label { font-size: 11px; color: var(--text-secondary); font-weight: 600; margin-bottom: 4px; }
        .booking-info-grid .val { color: var(--text-main); display: flex; align-items: center; gap: 4px; }
        .booking-info-grid .sub-val { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .icon-xs { font-size: 14px; }
        .icon-sm { font-size: 18px; }

        .payment-methods { display: flex; flex-direction: column; gap: 12px; }
        .method-option { display: flex; align-items: center; gap: 16px; border: 1px solid var(--border); padding: 16px; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s; }
        .method-option:hover { border-color: var(--primary-light); }
        .method-option.active { border-color: var(--primary); background: #f4f8fc; }
        .method-option input[type="radio"] { width: 18px; height: 18px; accent-color: var(--primary); }
        .method-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
        .method-option.active .method-icon { background: var(--primary); }
        .method-icon:not(.active) { background: #e0e0e0; color: #757575; }
        .method-icon.bg-pink { background: #a50064; color: white; }
        .method-icon.bg-gray { background: #607d8b; color: white; }
        .method-icon.bg-green { background: #4caf50; color: white; }
        
        .method-details h4 { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
        .method-details p { font-size: 12px; color: var(--text-secondary); }

        .sub-form { padding: 12px 16px 16px 56px; background: #fcfcfc; border-radius: 0 0 8px 8px; border: 1px solid var(--border); border-top: none; margin-top: -16px; margin-bottom: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .sub-form.transfer-details { display: block; }
        .form-group label { font-size: 11px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block; text-transform: uppercase; }
        .input-field { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; outline: none; transition: border 0.2s; }
        .input-field:focus { border-color: var(--primary); }
        .bg-light { background: #f1f5f9; color: var(--text-secondary); }
        .btn-upload { color: var(--text-secondary); }

        .remote-payment-gen { text-align: center; padding: 24px 0; }
        .qr-preview { display: inline-flex; flex-direction: column; align-items: center; padding: 20px; border: 1px solid var(--border); border-radius: 12px; background: #fcfcfc; margin-bottom: 24px; }
        .qr-preview img { width: 180px; height: 180px; margin-bottom: 16px; mix-blend-mode: multiply; }
        .qr-preview p { font-size: 14px; color: var(--text-main); }
        .qr-preview strong { font-size: 18px; color: var(--primary); display: block; margin-top: 4px; }
        .remote-actions { max-width: 300px; margin: 0 auto; }
        .btn-outline-primary { border: 1px solid var(--primary); color: var(--primary); background: transparent; }
        .btn-outline-primary:hover { background: #eff6ff; }
        .btn-zalo { background: #0068ff; color: white; border: none; }
        .btn-zalo:hover { background: #005ce6; }
        .polling-status { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .spinner { width: 24px; height: 24px; border: 3px solid #e2e8f0; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        .payment-mode-tabs { display: flex; gap: 12px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
        .pm-tab { display: flex; align-items: center; gap: 8px; padding: 12px 24px; border: none; background: #f1f5f9; border-radius: 8px; font-size: 15px; font-weight: 600; color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .pm-tab:hover { background: #e2e8f0; }
        .pm-tab.active { background: #eff6ff; color: var(--primary); box-shadow: inset 0 0 0 1px var(--primary); }

        .amount-input { font-size: 18px; font-weight: 700; color: var(--primary); text-align: right; }
        .mb-xs { margin-bottom: 4px; }

        .summary-card { padding: 0; overflow: hidden; }
        .summary-header { padding: var(--space-md) var(--space-lg); background: #fcfcfc; border-bottom: 1px solid var(--border); }
        .summary-header h3 { font-size: 16px; margin: 0; }
        .summary-body { padding: var(--space-lg); display: flex; flex-direction: column; gap: 12px; border-bottom: 1px dashed var(--border); }
        .summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); }
        .summary-total { padding: var(--space-lg); display: flex; justify-content: space-between; align-items: center; }
        .summary-total span { font-size: 14px; font-weight: 600; }
        .summary-total h2 { font-size: 24px; color: var(--primary); margin: 0; }
        .summary-actions { padding: 0 var(--space-lg) var(--space-lg) var(--space-lg); }
        .border-danger { border-color: var(--danger); color: var(--danger); }
        .border-danger:hover { background: #fef2f2; }
        .secure-note { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 12px; }
        .secure-note .material-icons-round { font-size: 14px; }

        /* Success View & Print Ticket */
        .success-view { max-width: 900px; margin: 0 auto; width: 100%; }
        .success-banner { text-align: center; padding: 40px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid #e6f4ea; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .success-icon { font-size: 64px; color: var(--success); margin-bottom: 16px; display: inline-block; }
        .success-icon .material-icons-round { font-size: inherit; }
        .success-banner h2 { font-size: 28px; color: var(--text-main); margin-bottom: 8px; }
        .success-banner p { font-size: 15px; color: var(--text-secondary); }

        .tickets-display h3 { font-size: 18px; margin-bottom: var(--space-lg); border-bottom: 2px solid var(--border); padding-bottom: 8px; display: inline-block; }
        .tickets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); }
        
        .issued-ticket-card { padding: 0; overflow: hidden; border: 1px solid var(--border); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .it-header { padding: 20px; border-bottom: 2px dashed rgba(255,255,255,0.5); position: relative; }
        /* Cutout circles for ticket effect */
        .it-header::before, .it-header::after { content: ''; position: absolute; bottom: -10px; width: 20px; height: 20px; background: var(--bg-main); border-radius: 50%; z-index: 2; border: 1px solid var(--border); }
        .it-header::before { left: -10px; border-right-color: transparent; border-top-color: transparent; border-bottom-color: transparent; }
        .it-header::after { right: -10px; border-left-color: transparent; border-top-color: transparent; border-bottom-color: transparent; }
        
        .airline-logo { width: 32px; height: 32px; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; font-size: 14px; }
        
        .it-body { padding: 24px 20px; background: white; }
        .it-route { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
        .it-route .loc h2 { font-size: 28px; line-height: 1.1; }
        .it-route .loc p { font-size: 12px; color: var(--text-secondary); }
        .it-route .dur { display: flex; flex-direction: column; align-items: center; }
        .it-route .dur .material-icons-round { font-size: 24px; transform: rotate(45deg); margin-bottom: 4px; }
        .it-route .dur p { font-size: 12px; font-weight: 600; }

        .it-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .it-info-grid .label { font-size: 11px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 4px; }
        .it-info-grid .val { font-size: 14px; color: var(--text-main); font-weight: 500; }

        .it-footer { padding: 16px 20px; background: #fafafa; border-top: 1px dashed var(--border); }

        @media print {
          .pm-header, .pm-close-btn, .payment-mode-tabs, .checkout-sidebar { display: none !important; }
          .payments-modal-container { box-shadow: none; max-width: none; background: white; }
          .pm-content { padding: 0; overflow: visible; }
          .issued-ticket-card { break-inside: avoid; margin-bottom: 20px; border: 1px solid #000; box-shadow: none; }
          .it-header { background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .tickets-grid { display: block; }
        }
      `}</style>
    </div>
  );
};

export default PaymentsPage;
