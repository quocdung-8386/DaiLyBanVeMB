import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AppLayout, { showToast } from '../../components/AppLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import type { BookingData } from '../page';

interface PaymentsPageProps {
  onNavigate?: (id: string) => void;
  view?: 'checkout' | 'success';
  setView?: (view: 'checkout' | 'success') => void;
  ticketData?: BookingData | null;
  onClose?: () => void;
  onPaymentSuccess?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string, badge: string) => void;
  bookings?: any[];
}

const getAirportName = (code?: string) => {
  if (!code) return 'N/A';
  const map: Record<string, string> = {
    'SGN': 'Tân Sơn Nhất',
    'HAN': 'Nội Bài',
    'DAD': 'Đà Nẵng',
    'PQC': 'Phú Quốc',
    'CXR': 'Cam Ranh',
    'HPH': 'Cát Bi',
    'VCA': 'Trà Nóc'
  };
  return map[code] || 'Sân bay';
};

const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, view = 'checkout', setView, ticketData, onClose, onPaymentSuccess, onUpdateStatus, bookings = [] }) => {
  const [paymentMode, setPaymentMode] = useState<'pos' | 'remote'>('pos');
  const [posMethod, setPosMethod] = useState<'cash' | 'transfer' | 'card' | 'balance'>('cash');
  const [localTicket, setLocalTicket] = useState<BookingData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  const isModal = !!onClose;
  const currentTicket = ticketData || localTicket;
  const [amountCollected, setAmountCollected] = useState<string>('');

  React.useEffect(() => {
    if (currentTicket) {
      setAmountCollected(currentTicket.total ?? '0');
    }
  }, [currentTicket]);

  const paxList = React.useMemo(() => {
    if (!currentTicket) return [];
    const pList = (currentTicket as any).passengersList || [];
    return pList.length > 0
      ? pList
      : Array.from({ length: currentTicket.pax || 1 }).map((_, i) => ({
        name: i === 0 ? currentTicket.customer : `HÀNH KHÁCH ${i + 1}`,
        seat: i === 0 ? (currentTicket.seat || '12A') : `12${String.fromCharCode(66 + i)}`
      }));
  }, [currentTicket]);

  const handleSearch = () => {
    if (!searchQuery) return;
    const query = searchQuery.trim().toUpperCase();

    // Search in the global bookings passed via props
    const found = bookings.find(t => t.pnr.toUpperCase() === query || t.id.toUpperCase() === query);

    if (found) {
      setLocalTicket(found);
      setSearchError('');
      showToast('Đã tìm thấy thông tin Booking!', 'success');
    } else {
      setSearchError('Không tìm thấy vé hoặc Booking nào khớp với mã vừa nhập.');
      showToast('Không tìm thấy dữ liệu.', 'error');
    }
  };

  const content = (
    <div className={isModal ? "payments-modal-container" : "payments-page-container"} onClick={(e) => e.stopPropagation()}>
      {(isModal || !currentTicket) && (
        <div className="pm-header">
          <div className="pm-header-title">
            <span className="material-icons-round text-primary">{currentTicket ? 'payments' : 'search'}</span>
            <h2>{view === 'success' ? 'Hoàn tất giao dịch' : (currentTicket ? 'Thanh toán & Ghi nhận' : 'Tìm kiếm Booking')}</h2>
          </div>
          {onClose && (
            <button className="pm-close-btn" onClick={onClose}>
              <span className="material-icons-round">close</span>
            </button>
          )}
        </div>
      )}

      <div className="pm-content">
        {view === 'checkout' && (
          <>
            {!currentTicket ? (
              <div className="search-booking-container">
                <Card className="search-card">
                  <div className="search-icon-wrapper">
                    <span className="material-icons-round">account_balance_wallet</span>
                  </div>
                  <h2>Lịch sử giao dịch Đại lý</h2>
                  <p className="text-muted mb-lg">Nhập mã Booking (PNR) hoặc Số vé để thực hiện thanh toán, xuất vé hoặc đối soát công nợ.</p>

                  <div className="search-input-group">
                    <div className="input-with-icon">
                      <span className="material-icons-round">qr_code_scanner</span>
                      <input
                        type="text"
                        placeholder="VD: G7X9PQ hoặc VE-005"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      />
                    </div>
                    <Button className="btn-primary-alt" onClick={handleSearch}>
                      <span className="material-icons-round">search</span>
                      Tìm kiếm
                    </Button>
                  </div>
                  {searchError && (
                    <div className="error-box mt-md">
                      <span className="material-icons-round">error_outline</span>
                      <p>{searchError}</p>
                    </div>
                  )}

                  <div className="quick-actions mt-xl">
                    <p className="text-xs font-bold text-muted mb-md">TRUY CẬP NHANH</p>
                    <div className="quick-grid">
                      <button className="q-item" onClick={() => { setSearchQuery('HOLD01'); handleSearch(); }}>
                        <span className="material-icons-round">timer</span>
                        <span>Booking đang giữ chỗ</span>
                      </button>
                      <button className="q-item" onClick={() => onNavigate?.('payment_history')}>
                        <span className="material-icons-round">history</span>
                        <span>Lịch sử thanh toán</span>
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="checkout-layout">
                <div className="checkout-main">
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

                  <Card className="checkout-card mb-lg">
                    <div className="card-title">
                      <span className="material-icons-round text-primary">receipt</span>
                      <h3>Thông tin vé & Hành trình</h3>
                      <div className="ml-auto">
                        <span className={`badge badge-${currentTicket.badge}`}>{currentTicket.status}</span>
                      </div>
                    </div>
                    <div className="booking-info-grid">
                      <div>
                        <p className="label">MÃ VÉ</p>
                        <p className="val text-primary font-bold">{currentTicket?.id ?? 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="label">CHUYẾN BAY</p>
                        <p className="val font-bold">{currentTicket?.from ?? '---'} <span className="material-icons-round icon-xs">flight_takeoff</span> {currentTicket?.to ?? '---'}</p>
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
                        <p className="val font-medium">{currentTicket?.airportFrom || getAirportName(currentTicket?.from)} ({currentTicket?.from})</p>
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
                      <h3>{paymentMode === 'pos' ? 'Phương thức thanh toán' : 'Thanh toán trực tuyến'}</h3>
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
                            <p className="mb-sm"><strong>STK:</strong> 9603052056666 - MB BANK</p>
                            <p className="mb-sm"><strong>Chủ tài khoản:</strong> NONG QUOC DUNG</p>
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

                        <label className={`method-option ${posMethod === 'balance' ? 'active' : ''}`}>
                          <input type="radio" name="payment" checked={posMethod === 'balance'} onChange={() => setPosMethod('balance')} />
                          <div className="method-icon" style={{ background: '#7c3aed' }}><span className="material-icons-round">account_balance_wallet</span></div>
                          <div className="method-details">
                            <h4>Số dư Đại lý (Agency Balance)</h4>
                            <p>Khấu trừ trực tiếp từ quỹ ký quỹ</p>
                          </div>
                        </label>
                        {posMethod === 'balance' && (
                          <div className="sub-form" style={{ gridTemplateColumns: '1fr' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#f5f3ff', borderRadius: 8, border: '1px solid #ddd6fe' }}>
                              <div>
                                <p style={{ fontSize: 11, color: '#6d28d9', fontWeight: 700, marginBottom: 2 }}>SỐ DƯ HIỆN TẠI</p>
                                <p style={{ fontSize: 16, fontWeight: 800, color: '#4c1d95' }}>42,500,000 đ</p>
                              </div>
                              <div className="text-right">
                                <p style={{ fontSize: 11, color: '#6d28d9', fontWeight: 700, marginBottom: 2 }}>SAU GIAO DỊCH</p>
                                <p style={{ fontSize: 16, fontWeight: 800, color: '#7c3aed' }}>39,250,000 đ</p>
                              </div>
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
                        <span>Giá vé Net (Hãng thu)</span>
                        <span>{currentTicket?.total ?? 'N/A'} đ</span>
                      </div>
                      <div className="summary-row">
                        <span>Thuế & Phí sân bay</span>
                        <span>120,000 đ</span>
                      </div>
                      <div className="summary-row" style={{ color: '#059669', fontWeight: 700 }}>
                        <span>Lợi nhuận đại lý (Markup)</span>
                        <span>+ 50,000 đ</span>
                      </div>
                    </div>
                    <div className="summary-total">
                      <span>Tổng tiền</span>
                      <h2>{currentTicket?.total ?? 'N/A'} đ</h2>
                    </div>
                    <div className="summary-actions">
                      <div className="form-group mb-md mt-sm">
                        <label className="text-sm font-semibold mb-xs" style={{ display: 'block' }}>Số tiền thu thực tế (VNĐ)</label>
                        <input type="text" className="input-field amount-input" value={amountCollected} onChange={(e) => setAmountCollected(e.target.value)} />
                      </div>
                      <Button className="w-full mb-sm btn-primary-alt" onClick={() => {
                        if (setView) setView('success');
                        const ticketId = currentTicket?.id;
                        if (ticketId) {
                          if (onPaymentSuccess) onPaymentSuccess(ticketId);
                          if (onUpdateStatus) onUpdateStatus(ticketId, 'Đã xuất vé', 'success');
                        }
                        showToast('Xác nhận thanh toán và xuất vé thành công!', 'success');
                      }}>
                        <span className="material-icons-round">done_all</span>
                        Xác nhận thu tiền
                      </Button>
                      <Button variant="outline" className="w-full text-danger border-danger" onClick={() => {
                        if (onClose) onClose();
                        else {
                          setLocalTicket(null);
                          setSearchQuery('');
                        }
                      }}>
                        {currentTicket === localTicket ? 'Quay lại tìm kiếm' : 'Hủy giao dịch'}
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
                <Button variant="outline" onClick={() => { if (onClose) onClose(); onNavigate && onNavigate('payment_history'); }}>Xem lịch sử</Button>
                <Button variant="outline" onClick={() => showToast('Đang tạo hóa đơn điện tử (E-Invoice)...', 'info')}>
                  <span className="material-icons-round">receipt_long</span>
                  Xuất HĐĐT
                </Button>
                <Button className="btn-primary-alt" onClick={() => window.print()}>
                  <span className="material-icons-round">print</span>
                  In vé máy bay
                </Button>
              </div>
            </div>

            <div className="tickets-display">
              <h3>Boarding Passes — {currentTicket?.pnr ?? 'N/A'}</h3>
              <div className="tickets-grid mt-md">
                {paxList.map((p: any, idx: number) => (
                  <Card key={idx} className="issued-ticket-card">
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
                          <h2>{currentTicket?.from ?? '---'}</h2>
                          <p>{currentTicket?.airportFrom || getAirportName(currentTicket?.from)}</p>
                        </div>
                        <div className="dur">
                          <span className="material-icons-round text-primary">flight_takeoff</span>
                          <p>Bay thẳng</p>
                        </div>
                        <div className="loc text-right">
                          <h2>{currentTicket?.to ?? '---'}</h2>
                          <p>{currentTicket?.airportTo || getAirportName(currentTicket?.to)}</p>
                        </div>
                      </div>
                      <div className="it-info-grid">
                        <div>
                          <p className="label">Hành khách</p>
                          <p className="val">{p.name?.toUpperCase() || currentTicket?.customer?.toUpperCase() || 'N/A'}</p>
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
                          <p className="val font-bold">{p.seat || currentTicket?.seat || 'N/A'}</p>
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
                          <p className="val">{currentTicket?.id ? `${currentTicket.id}-${idx + 1}` : 'N/A'}</p>
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
                ))}
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
        
        .payments-page-container {
          display: flex;
          flex-direction: column;
          height: 100%;
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
        .pm-header-title { display: flex; align-items: center; gap: 12px; }
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
          padding: ${isModal ? '24px' : '0'};
        }

        .ml-auto { margin-left: auto; }

        /* Search Styles */
        .search-booking-container { 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          padding: ${isModal ? '40px 0' : '60px 0'}; 
        }
        .search-card { 
          max-width: 600px; 
          width: 100%; 
          text-align: center; 
          padding: 48px; 
          border: 1px solid var(--border);
          box-shadow: var(--shadow-lg); 
        }
        .search-icon-wrapper { 
          width: 80px; 
          height: 80px; 
          background: var(--primary-light); 
          color: var(--primary); 
          border-radius: 20px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 auto 24px; 
          font-size: 40px; 
        }
        .search-card h2 { font-size: 24px; font-weight: 800; margin-bottom: 12px; color: #0f172a; }
        .search-input-group { display: flex; gap: 12px; margin-top: 32px; }
        
        .input-with-icon {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
        }
        .input-with-icon .material-icons-round {
          position: absolute;
          left: 16px;
          color: var(--text-muted);
        }
        .input-with-icon input { 
          width: 100%; 
          padding: 14px 16px 14px 48px; 
          border: 2px solid var(--border); 
          border-radius: 12px; 
          outline: none; 
          font-size: 16px; 
          font-weight: 500;
          transition: all 0.2s;
        }
        .input-with-icon input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(37,99,235,0.1); }

        .error-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: #fef2f2;
          color: #b91c1c;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          text-align: left;
        }

        .quick-actions { border-top: 1px solid var(--border); padding-top: 24px; }
        .quick-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .q-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px;
          background: var(--bg-main);
          border: 1px solid var(--border);
          border-radius: 10px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-main);
          transition: all 0.2s;
        }
        .q-item:hover { border-color: var(--primary); background: var(--primary-light); color: var(--primary); }
        .q-item .material-icons-round { font-size: 18px; opacity: 0.7; }

        /* Rest of existing styles... */
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
        .text-xs { font-size: 10px; }
        .text-right { text-align: right; }
        .w-full { width: 100%; }
        .flex-row { display: flex; align-items: center; }
        .justify-between { justify-content: space-between; }
        .justify-center { justify-content: center; }
        .gap-sm { gap: var(--space-sm); }
        .mb-sm { margin-bottom: 8px; }
        .mb-md { margin-bottom: 16px; }
        .mb-lg { margin-bottom: 24px; }
        .mb-xl { margin-bottom: 32px; }
        .mt-sm { margin-top: 8px; }
        .mt-md { margin-top: 16px; }
        .mt-lg { margin-top: 24px; }
        .mt-xl { margin-top: 32px; }
        .flex-1 { flex: 1; }

        .checkout-layout { display: flex; gap: 24px; align-items: flex-start; }
        .checkout-main { flex: 1; min-width: 0; }
        .checkout-sidebar { width: 340px; flex-shrink: 0; position: sticky; top: 0; }
        
        .checkout-card { padding: 24px; }
        .card-title { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; border-bottom: 1px solid var(--border); padding-bottom: 12px; }
        .card-title h3 { font-size: 16px; margin: 0; }

        .booking-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 14px; }
        .booking-info-grid .label { font-size: 11px; color: var(--text-secondary); font-weight: 600; margin-bottom: 4px; }
        .booking-info-grid .val { color: var(--text-main); display: flex; align-items: center; gap: 4px; }
        .booking-info-grid .sub-val { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
        .icon-xs { font-size: 14px; }

        .payment-methods { display: flex; flex-direction: column; gap: 12px; }
        .method-option { display: flex; align-items: center; gap: 16px; border: 1px solid var(--border); padding: 16px; border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s; }
        .method-option:hover { border-color: var(--primary-light); }
        .method-option.active { border-color: var(--primary); background: #f4f8fc; }
        .method-option input[type="radio"] { width: 18px; height: 18px; accent-color: var(--primary); }
        .method-icon { width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 20px; }
        .method-icon.bg-primary { background: var(--primary); }
        .method-icon.bg-gray { background: #607d8b; }
        .method-icon.bg-green { background: #4caf50; }
        
        .method-details h4 { font-size: 15px; font-weight: 600; margin-bottom: 2px; }
        .method-details p { font-size: 12px; color: var(--text-secondary); }

        .sub-form { padding: 12px 16px 16px 56px; background: #fcfcfc; border-radius: 0 0 8px 8px; border: 1px solid var(--border); border-top: none; margin-top: -16px; margin-bottom: 8px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .sub-form.transfer-details { display: block; }
        .form-group label { font-size: 11px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; display: block; text-transform: uppercase; }
        .input-field { width: 100%; padding: 10px 12px; border: 1px solid var(--border); border-radius: 6px; font-size: 14px; outline: none; transition: border 0.2s; }
        .input-field:focus { border-color: var(--primary); }
        .bg-light { background: #f1f5f9; color: var(--text-secondary); }

        .remote-payment-gen { text-align: center; padding: 24px 0; }
        .qr-preview { display: inline-flex; flex-direction: column; align-items: center; padding: 20px; border: 1px solid var(--border); border-radius: 12px; background: #fcfcfc; margin-bottom: 24px; }
        .qr-preview img { width: 180px; height: 180px; margin-bottom: 16px; }
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

        .summary-card { padding: 0; overflow: hidden; border: 1px solid var(--border); }
        .summary-header { padding: 16px 20px; background: #fcfcfc; border-bottom: 1px solid var(--border); }
        .summary-header h3 { font-size: 16px; margin: 0; }
        .summary-body { padding: 20px; display: flex; flex-direction: column; gap: 12px; border-bottom: 1px dashed var(--border); }
        .summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--text-secondary); }
        .summary-total { padding: 20px; display: flex; justify-content: space-between; align-items: center; }
        .summary-total span { font-size: 14px; font-weight: 600; }
        .summary-total h2 { font-size: 24px; color: var(--primary); margin: 0; }
        .summary-actions { padding: 0 20px 20px 20px; }
        .border-danger { border-color: var(--danger); color: var(--danger); }
        .secure-note { font-size: 11px; color: var(--text-muted); display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 12px; }

        .success-view { max-width: 900px; margin: 0 auto; width: 100%; }
        .success-banner { text-align: center; padding: 40px 20px; background: white; border-radius: var(--radius-lg); border: 1px solid #e6f4ea; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .success-icon { font-size: 64px; color: var(--success); margin-bottom: 16px; display: inline-block; }
        .success-banner h2 { font-size: 28px; color: var(--text-main); margin-bottom: 8px; }
        .success-banner p { font-size: 15px; color: var(--text-secondary); }

        .tickets-display h3 { font-size: 18px; margin-bottom: 24px; border-bottom: 2px solid var(--border); padding-bottom: 8px; display: inline-block; }
        .tickets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        
        .issued-ticket-card { padding: 0; overflow: hidden; border: 1px solid var(--border); }
        .it-header { padding: 20px; border-bottom: 2px dashed rgba(255,255,255,0.5); position: relative; }
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
          .issued-ticket-card { break-inside: avoid; margin-bottom: 20px; border: 1px solid #000; }
          .it-header { background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .tickets-grid { display: block; }
        }

        /* Toast Styles */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          padding: 16px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: white;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 9999;
          animation: slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .toast-notification.success { background: #10b981; }
        .toast-notification.error { background: #ef4444; }
        .toast-notification button { background: none; border: none; color: white; cursor: pointer; display: flex; align-items: center; opacity: 0.8; margin-left: 24px; padding-left: 12px; border-left: 1px solid rgba(255,255,255,0.2); }
        .toast-notification button:hover { opacity: 1; }
      `}</style>
    </div>
  );

  return isModal ? content : (
    <AppLayout
      activeItem="payments"
      onNavigate={onNavigate || (() => { })}
      breadcrumb={[
        { label: 'Lịch sử giao dịch', page: 'payments' },
        currentTicket ? { label: `Xác nhận: ${currentTicket.pnr}` } : { label: 'Tra cứu' }
      ]}
    >
      {content}
    </AppLayout>
  );
};

export default PaymentsPage;
