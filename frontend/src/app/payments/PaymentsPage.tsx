import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import type { TicketData } from '../page';

interface PaymentsPageProps {
  onNavigate?: (id: string) => void;
  view?: 'history' | 'checkout' | 'success';
  setView?: (view: 'history' | 'checkout' | 'success') => void;
  ticketData?: TicketData | null;
}

const PaymentsPage: React.FC<PaymentsPageProps> = ({ onNavigate, view = 'history', setView, ticketData }) => {

  const historyData = [
    { id: 'TR-001', booking: 'BKG-8A2F9', customer: 'Nguyễn Văn Trường', total: '3.250.000đ', method: 'VNPay', status: 'Thành công', time: '12/10/2023 09:15', badge: 'success' },
    { id: 'TR-002', booking: 'BKG-7X1M4', customer: 'Trần Thị Lan', total: '5.100.000đ', method: 'Momo', status: 'Thành công', time: '15/10/2023 14:30', badge: 'success' },
    { id: 'TR-003', booking: 'BKG-9Y2K1', customer: 'Lê Quang Minh', total: '2.800.000đ', method: 'Visa', status: 'Đang xử lý', time: '16/10/2023 08:45', badge: 'warning' },
    { id: 'TR-004', booking: 'BKG-3C4D5', customer: 'Phạm Thu Hà', total: '1.500.000đ', method: 'VNPay', status: 'Thất bại', time: '16/10/2023 11:20', badge: 'danger' },
  ];

  return (
    <div className="layout">
      <Sidebar activeItem="payments" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title={view === 'history' ? "Lịch sử giao dịch & Hóa đơn - Airline System" : "Thanh toán - Airline System"} />
        
        <main className="content">
          {view === 'history' && (
            <>
              <div className="breadcrumb">
                <span className="link" onClick={() => onNavigate && onNavigate('dashboard')}>Dashboard</span>
                <span className="material-icons-round separator">chevron_right</span>
                <span className="current">Thanh toán</span>
              </div>
              <div className="page-header">
                <div>
                  <h1>Lịch sử giao dịch & Hóa đơn</h1>
                  <p>Quản lý và tra cứu các khoản thanh toán vé máy bay.</p>
                </div>
                <div className="flex-row gap-sm">
                  <Button variant="outline">
                    <span className="material-icons-round">download</span>
                    Xuất báo cáo
                  </Button>
                </div>
              </div>

              <Card className="filter-card mb-lg">
                <div className="filter-row">
                  <div className="input-with-icon flex-1">
                    <span className="material-icons-round">date_range</span>
                    <input type="text" defaultValue="01/10/2023 - 31/10/2023" />
                  </div>
                  <div className="input-with-icon select-wrapper flex-1">
                    <select defaultValue="all">
                      <option value="all">Tất cả trạng thái</option>
                      <option value="success">Thành công</option>
                      <option value="pending">Đang xử lý</option>
                    </select>
                    <span className="material-icons-round arrow">expand_more</span>
                  </div>
                  <div className="input-with-icon select-wrapper flex-1">
                    <select defaultValue="all">
                      <option value="all">Tất cả phương thức</option>
                      <option value="vnpay">VNPay</option>
                      <option value="momo">Momo</option>
                      <option value="visa">Thẻ tín dụng / Visa</option>
                    </select>
                    <span className="material-icons-round arrow">expand_more</span>
                  </div>
                  <Button className="btn-primary-alt">Lọc dữ liệu</Button>
                </div>
              </Card>

              <Card className="table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Mã Giao Dịch</th>
                      <th>Mã Booking</th>
                      <th>Khách hàng</th>
                      <th>Số tiền</th>
                      <th>Phương thức</th>
                      <th>Trạng thái</th>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyData.map((t, i) => (
                      <tr key={i}>
                        <td><span className="text-primary font-medium">{t.id}</span></td>
                        <td><span className="text-muted font-monospace">{t.booking}</span></td>
                        <td><p className="font-medium">{t.customer}</p></td>
                        <td><p className="font-bold">{t.total}</p></td>
                        <td><span className="method-badge">{t.method}</span></td>
                        <td>
                          <span className={`status-badge ${t.badge}`}>
                            <span className="dot"></span>
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <div className="text-sm">
                            <p>{t.time.split(' ')[0]}</p>
                            <p className="text-muted">{t.time.split(' ')[1]}</p>
                          </div>
                        </td>
                        <td>
                          <button className="action-btn"><span className="material-icons-round">visibility</span></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <p>Hiển thị <strong>1-4</strong> trong số <strong>120</strong> giao dịch</p>
                  <div className="page-controls">
                    <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
                  </div>
                </div>
              </Card>
            </>
          )}

          {view === 'checkout' && (
            <>
              <div className="breadcrumb">
                <span className="link" onClick={() => onNavigate && onNavigate('dashboard')}>Dashboard</span>
                <span className="material-icons-round separator">chevron_right</span>
                <span className="link" onClick={() => onNavigate && onNavigate('booking')}>Đặt chỗ</span>
                <span className="material-icons-round separator">chevron_right</span>
                <span className="current">Thanh toán</span>
              </div>
              <div className="page-header mb-lg">
                <h1>Hoàn tất thanh toán</h1>
                <Button variant="outline" onClick={() => setView && setView('history')}>Quay lại lịch sử</Button>
              </div>

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
                        <p className="val text-primary font-bold">{ticketData?.id ?? 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="label">CHUYẾN BAY</p>
                        <p className="val font-bold">{ticketData?.routeFrom ?? '---'} <span className="material-icons-round icon-xs">flight_takeoff</span> {ticketData?.routeTo ?? '---'}</p>
                        <p className="sub-val">PNR: {ticketData?.pnr ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="label">KHÁCH HÀNG</p>
                        <p className="val font-medium">{ticketData?.customer ?? 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="label">NGÀY BAY</p>
                        <p className="val font-medium">{ticketData?.date?.split(' ')[0] ?? 'N/A'}</p>
                      </div>
                      <div>
                        <p className="label">SÂN BAY CẤT CÁNH</p>
                        <p className="val font-medium">{ticketData?.airportFrom ?? 'N/A'} ({ticketData?.routeFrom})</p>
                      </div>
                      <div className="text-right">
                        <p className="label">CỔNG SOÁT VÉ / NHÀ GA</p>
                        <p className="val font-medium">{ticketData?.gate ?? 'N/A'} / {ticketData?.terminal ?? 'N/A'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="checkout-card">
                    <div className="card-title">
                      <span className="material-icons-round text-primary">payments</span>
                      <h3>Phương thức thanh toán</h3>
                    </div>
                    <div className="payment-methods">
                      <label className="method-option active">
                        <input type="radio" name="payment" defaultChecked />
                        <div className="method-icon"><span className="material-icons-round">qr_code_scanner</span></div>
                        <div className="method-details">
                          <h4>VNPAY-QR</h4>
                          <p>Quét mã qua ứng dụng ngân hàng</p>
                        </div>
                      </label>
                      <label className="method-option">
                        <input type="radio" name="payment" />
                        <div className="method-icon bg-pink"><span className="material-icons-round">account_balance_wallet</span></div>
                        <div className="method-details">
                          <h4>Ví MoMo</h4>
                        </div>
                      </label>
                      <label className="method-option">
                        <input type="radio" name="payment" />
                        <div className="method-icon bg-gray"><span className="material-icons-round">credit_card</span></div>
                        <div className="method-details">
                          <h4>Thẻ tín dụng / Ghi nợ</h4>
                          <p>Visa, Mastercard, JCB</p>
                        </div>
                      </label>
                      <label className="method-option">
                        <input type="radio" name="payment" />
                        <div className="method-icon bg-green"><span className="material-icons-round">payments</span></div>
                        <div className="method-details">
                          <h4>Tiền mặt tại đại lý</h4>
                        </div>
                      </label>
                    </div>
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
                        <span>{ticketData?.total ?? 'N/A'} đ</span>
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
                      <h2>{ticketData?.total ?? 'N/A'} đ</h2>
                    </div>
                    <div className="summary-actions">
                      <Button className="w-full mb-sm btn-primary-alt" onClick={() => setView && setView('success')}>
                        <span className="material-icons-round">lock</span>
                        Thanh toán ngay
                      </Button>
                      <Button variant="outline" className="w-full text-danger border-danger">
                        Hủy giao dịch
                      </Button>
                      <p className="secure-note"><span className="material-icons-round">shield</span> Giao dịch được mã hóa an toàn</p>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}

          {view === 'success' && (
            <div className="success-view">
              <div className="success-banner mb-xl">
                <div className="success-icon">
                  <span className="material-icons-round">check_circle</span>
                </div>
                <h2>Thanh toán thành công!</h2>
                <p>Booking <strong>{ticketData?.pnr ?? 'N/A'}</strong> đã được thanh toán và vé đã được xuất.</p>
                <div className="flex-row gap-sm mt-md justify-center">
                  <Button variant="outline" onClick={() => setView && setView('history')}>Quay lại lịch sử</Button>
                  <Button className="btn-primary-alt" onClick={() => window.print()}>
                    <span className="material-icons-round">print</span>
                    In vé máy bay
                  </Button>
                </div>
              </div>

              <div className="tickets-display">
                <h3>Boarding Pass — {ticketData?.customer ?? 'Hành khách'}</h3>
                <div className="tickets-grid mt-md">
                  {/* Printed ticket with real data */}
                  <Card className="issued-ticket-card">
                    <div className="it-header bg-primary">
                      <div className="flex-row justify-between">
                        <span className="airline-logo bg-white text-primary font-bold">VN</span>
                        <span className="text-white font-monospace">PNR: {ticketData?.pnr ?? 'N/A'}</span>
                      </div>
                      <h2 className="text-white mt-md">BOARDING PASS</h2>
                    </div>
                    <div className="it-body">
                      <div className="it-route mb-md">
                        <div className="loc">
                          <h2>{ticketData?.routeFrom ?? '---'}</h2>
                          <p>{ticketData?.airportFrom ?? 'N/A'}</p>
                        </div>
                        <div className="dur">
                          <span className="material-icons-round text-primary">flight_takeoff</span>
                          <p>Bay thẳng</p>
                        </div>
                        <div className="loc text-right">
                          <h2>{ticketData?.routeTo ?? '---'}</h2>
                          <p>{ticketData?.airportTo ?? 'N/A'}</p>
                        </div>
                      </div>
                      <div className="it-info-grid">
                        <div>
                          <p className="label">Hành khách</p>
                          <p className="val">{ticketData?.customer?.toUpperCase() ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Ngày bay</p>
                          <p className="val">{ticketData?.date?.split(' ')[0] ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Giờ khởi hành</p>
                          <p className="val">{ticketData?.date?.split(' ')[1] ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Ghế (Seat)</p>
                          <p className="val font-bold">{ticketData?.seat ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Cổng soát vé</p>
                          <p className="val font-bold">{ticketData?.gate ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Nhà ga</p>
                          <p className="val">{ticketData?.terminal ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Lên máy bay</p>
                          <p className="val font-bold">{ticketData?.boarding ?? 'N/A'}</p>
                        </div>
                        <div>
                          <p className="label">Mã vé (Ticket No.)</p>
                          <p className="val">{ticketData?.id ?? 'N/A'}</p>
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
        </main>
      </div>

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); overflow-x: hidden; }
        .content { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; width: 100%; }

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

        /* History View */
        .filter-card { padding: 12px var(--space-lg); }
        .filter-row { display: flex; gap: var(--space-md); align-items: center; }
        .input-with-icon { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 8px; padding: 10px 12px; background: white; font-size: 13px; }
        .input-with-icon input { border: none; background: transparent; outline: none; width: 100%; }
        .select-wrapper { position: relative; }
        .select-wrapper select { width: 100%; border: none; background: transparent; outline: none; appearance: none; padding-right: 20px; cursor: pointer; }
        .select-wrapper .arrow { position: absolute; right: 12px; pointer-events: none; }
        .btn-primary-alt { background: #005a8c; color: white; border: none; }
        
        .table-card { padding: 0; overflow: hidden; }
        .data-table { width: 100%; border-collapse: collapse; text-align: left; }
        .data-table th { padding: 16px var(--space-lg); font-size: 12px; font-weight: 600; color: var(--text-secondary); border-bottom: 1px solid var(--border); background: #fcfcfc; text-transform: uppercase; }
        .data-table td { padding: 16px var(--space-lg); border-bottom: 1px solid var(--border); vertical-align: middle; font-size: 14px; }
        
        .method-badge { background: #f0f4ff; color: var(--primary); font-size: 11px; padding: 4px 8px; border-radius: 4px; font-weight: 600; }
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef7e0; color: #b06000; }
        .status-badge.warning .dot { background: #b06000; }
        .status-badge.danger { background: #fce8e6; color: #c5221f; }
        .status-badge.danger .dot { background: #c5221f; }

        .action-btn { background: transparent; border: none; cursor: pointer; padding: 4px; border-radius: 50%; color: var(--text-muted); transition: all 0.2s; }
        .action-btn:hover { background: var(--bg-main); color: var(--text-main); }

        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 16px var(--space-lg); font-size: 13px; color: var(--text-secondary); }
        .page-controls { display: flex; gap: 4px; }
        .page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: var(--radius-sm); background: white; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .page-btn:hover { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }

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
          .sidebar, .header, .breadcrumb, .success-banner, .it-footer { display: none !important; }
          .main-container { margin: 0; padding: 0; background: white; }
          .issued-ticket-card { break-inside: avoid; margin-bottom: 20px; border: 1px solid #000; box-shadow: none; }
          .it-header { background: #000 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .tickets-grid { display: block; }
        }
      `}</style>
    </div>
  );
};

export default PaymentsPage;
