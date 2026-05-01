import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Card from '../../components/Card';
import Button from '../../components/Button';
import type { TicketData } from '../page';

interface TicketsPageProps {
  onNavigate?: (id: string) => void;
  onCheckout?: (ticket: TicketData) => void;
}

const TicketsPage: React.FC<TicketsPageProps> = ({ onNavigate, onCheckout }) => {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [changeStep, setChangeStep] = useState<1|2>(1);
  const [newFlight, setNewFlight] = useState('');

  const tickets = [
    { id: '738-29481726', pnr: 'G7X9PQ', customer: 'Nguyễn Văn An', routeFrom: 'SGN', routeTo: 'HAN', date: '24/10/2023 08:30', total: '3,250,000', status: 'Đang hiệu lực', badge: 'success', airportFrom: 'Tân Sơn Nhất', airportTo: 'Nội Bài', gate: 'B12', terminal: 'T2', seat: '14A', boarding: '09:30' },
    { id: '738-99283741', pnr: 'A2B4C6', customer: 'Trần Thị Bé', routeFrom: 'DAD', routeTo: 'SGN', date: '25/10/2023 14:15', total: '1,890,000', status: 'Đã hủy', badge: 'danger', airportFrom: 'Đà Nẵng', airportTo: 'Tân Sơn Nhất', gate: 'A5', terminal: 'T1', seat: '22C', boarding: '14:00' },
    { id: '112-55443322', pnr: 'L9M1N2', customer: 'Lê Hữu Đạt', routeFrom: 'HAN', routeTo: 'PQC', date: '28/10/2023 09:40', total: '4,100,000', status: 'Đã hoàn tiền', badge: 'warning', airportFrom: 'Nội Bài', airportTo: 'Phú Quốc', gate: 'C3', terminal: 'T1', seat: '8B', boarding: '09:15' },
    { id: '738-11229988', pnr: 'X7Y8Z9', customer: 'Phạm Tuấn Khải', routeFrom: 'SGN', routeTo: 'HPH', date: '02/11/2023 18:00', total: '2,450,000', status: 'Đã Void', badge: 'default', airportFrom: 'Tân Sơn Nhất', airportTo: 'Cát Bi', gate: 'B8', terminal: 'T2', seat: '31F', boarding: '17:30' },
  ];

  return (
    <div className="layout">
      <Sidebar activeItem="tickets" onNavigate={onNavigate} />
      <div className="main-container">
        <Header title="Vé máy bay - Airline System" />
        
        <main className="content">
          <div className="breadcrumb">
            <span className="link" onClick={() => onNavigate && onNavigate('flights')}>Chuyến bay</span>
            <span className="material-icons-round separator">chevron_right</span>
            <span className="current">Vé máy bay</span>
          </div>

          <div className="page-header">
            <div>
              <h1>Danh sách vé máy bay</h1>
              <p>Quản lý và theo dõi trạng thái các vé máy bay đã xuất.</p>
            </div>
            <Button variant="outline">
              <span className="material-icons-round">refresh</span>
              Làm mới
            </Button>
          </div>

          {/* Filters */}
          <Card className="filter-card">
            <div className="filter-row">
              <span className="filter-label">LỌC TÌM KIẾM:</span>
              <div className="input-with-icon select-wrapper">
                <select defaultValue="all">
                  <option value="all">Trạng thái vé: Tất cả</option>
                  <option value="active">Đang hiệu lực</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
                <span className="material-icons-round arrow">expand_more</span>
              </div>
              <div className="input-with-icon select-wrapper">
                <select defaultValue="all">
                  <option value="all">Hãng bay: Tất cả</option>
                  <option value="vn">Vietnam Airlines</option>
                  <option value="vj">Vietjet Air</option>
                </select>
                <span className="material-icons-round arrow">expand_more</span>
              </div>
              <div className="input-with-icon">
                <span className="material-icons-round">calendar_today</span>
                <input type="text" placeholder="Khoảng ngày bay" />
              </div>
            </div>
          </Card>

          {/* Table */}
          <Card className="table-card">
          <div className="table-responsive">
            <table className="booking-table">
              <thead>
                <tr>
                  <th>Mã vé</th>
                  <th>Mã booking (PNR)</th>
                  <th>Khách hàng</th>
                  <th>Chặng bay</th>
                  <th>Ngày bay</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t, i) => (
                  <tr key={i}>
                    <td>
                      <div className="tx-id">{t.id.substring(0, 4)}<br/>{t.id.substring(4)}</div>
                    </td>
                    <td>
                      <div className="booking-id blue-border">{t.pnr}</div>
                    </td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-avatar">{t.customer.split(' ').map(w => w[0]).slice(-2).join('')}</div>
                        <div>
                          <p className="name">{t.customer}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flight-info">
                        <p className="route"><strong>{t.routeFrom}</strong> <span className="material-icons-round">flight_takeoff</span> <strong>{t.routeTo}</strong></p>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <p className="date">{t.date.split(' ')[0]}</p>
                        <p className="time">{t.date.split(' ')[1]}</p>
                      </div>
                    </td>
                    <td><p className="price">{t.total} đ</p></td>
                    <td>
                      <span className={`status-badge ${t.badge}`}>
                        <span className="dot"></span>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn view" title="Xem chi tiết" onClick={() => setSelectedTicketId(t.id)}>
                          <span className="material-icons-round">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            <div className="pagination">
              <p>Hiển thị <strong>1</strong> đến <strong>4</strong> trong <strong>128</strong> kết quả</p>
              <div className="page-controls">
                <button className="page-btn"><span className="material-icons-round">chevron_left</span></button>
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <button className="page-btn dots">...</button>
                <button className="page-btn">10</button>
                <button className="page-btn"><span className="material-icons-round">chevron_right</span></button>
              </div>
            </div>
          </Card>
        </main>
      </div>

      {/* Ticket Detail Modal */}
      {(() => {
        const selectedTicket = tickets.find(t => t.id === selectedTicketId) ?? null;
        if (!selectedTicket) return null;
        const [datePart, timePart] = selectedTicket.date.split(' ');
        return (
          <div className="td-backdrop" onClick={() => setSelectedTicketId(null)}>
            <div className="td-modal" onClick={(e) => e.stopPropagation()}>

              {/* ── Header gradient ── */}
              <div className="td-hero">
                <button className="td-close" onClick={() => setSelectedTicketId(null)}>
                  <span className="material-icons-round">close</span>
                </button>
                <div className="td-hero-top">
                  <div className="td-airline-badge">VN</div>
                  <div>
                    <p className="td-label-sm">Vietnam Airlines</p>
                    <p className="td-pnr">PNR: {selectedTicket.pnr}</p>
                  </div>
                  <span className={`td-status status-badge ${selectedTicket.badge}`}>
                    <span className="dot" />{selectedTicket.status}
                  </span>
                </div>

                {/* Route */}
                <div className="td-route">
                  <div className="td-city">
                    <span className="td-code">{selectedTicket.routeFrom}</span>
                    <span className="td-airport">{selectedTicket.airportFrom}</span>
                    <span className="td-time">{timePart}</span>
                  </div>
                  <div className="td-mid">
                    <span className="td-mid-line" />
                    <span className="material-icons-round td-plane">flight</span>
                    <span className="td-mid-line" />
                    <p className="td-direct">Bay thẳng</p>
                  </div>
                  <div className="td-city td-city-right">
                    <span className="td-code">{selectedTicket.routeTo}</span>
                    <span className="td-airport">{selectedTicket.airportTo}</span>
                    <span className="td-date">{datePart}</span>
                  </div>
                </div>

                {/* Boarding chips */}
                <div className="td-chips">
                  <div className="td-chip">
                    <span className="material-icons-round">meeting_room</span>
                    <div><p className="td-chip-label">Cổng</p><p className="td-chip-val">{selectedTicket.gate}</p></div>
                  </div>
                  <div className="td-chip">
                    <span className="material-icons-round">apartment</span>
                    <div><p className="td-chip-label">Nhà ga</p><p className="td-chip-val">{selectedTicket.terminal}</p></div>
                  </div>
                  <div className="td-chip">
                    <span className="material-icons-round">airline_seat_recline_normal</span>
                    <div><p className="td-chip-label">Ghế</p><p className="td-chip-val">{selectedTicket.seat}</p></div>
                  </div>
                  <div className="td-chip">
                    <span className="material-icons-round">schedule</span>
                    <div><p className="td-chip-label">Lên máy bay</p><p className="td-chip-val">{selectedTicket.boarding}</p></div>
                  </div>
                </div>
              </div>

              {/* ── Tear-line ── */}
              <div className="td-tear"><div className="td-circle td-circle-l"/><div className="td-dash"/><div className="td-circle td-circle-r"/></div>

              {/* ── Body ── */}
              <div className="td-body">

                {/* Info rows */}
                <div className="td-info-list">
                  <div className="td-info-row">
                    <span className="material-icons-round">badge</span>
                    <div><p className="td-ikey">Hành khách</p><p className="td-ival">{selectedTicket.customer.toUpperCase()}</p></div>
                  </div>
                  <div className="td-info-row">
                    <span className="material-icons-round">flight_takeoff</span>
                    <div><p className="td-ikey">Sân bay cất cánh</p><p className="td-ival">Sân bay {selectedTicket.airportFrom} <span className="td-code-chip">{selectedTicket.routeFrom}</span></p></div>
                  </div>
                  <div className="td-info-row">
                    <span className="material-icons-round">flight_land</span>
                    <div><p className="td-ikey">Sân bay hạ cánh</p><p className="td-ival">Sân bay {selectedTicket.airportTo} <span className="td-code-chip">{selectedTicket.routeTo}</span></p></div>
                  </div>
                  <div className="td-info-row">
                    <span className="material-icons-round">luggage</span>
                    <div><p className="td-ikey">Hành lý</p><p className="td-ival">23kg ký gửi · 7kg xách tay</p></div>
                  </div>
                </div>

                {/* Fare Rules */}
                <div className="td-section-head">
                  <span className="material-icons-round">gavel</span>Điều kiện vé
                </div>
                <div className="td-rules">
                  <div className="td-rule"><span>Đổi vé</span><span className="td-rule-val warn">360,000đ + chênh lệch</span></div>
                  <div className="td-rule"><span>Hủy/Hoàn</span><span className="td-rule-val err">Không được phép</span></div>
                  <div className="td-rule no-border"><span>Đổi tên</span><span className="td-rule-val err">Không hỗ trợ</span></div>
                </div>

                {/* Total */}
                <div className="td-total-bar">
                  <span>Tổng tiền</span>
                  <span className="td-total-price">{selectedTicket.total} <small>đ</small></span>
                </div>
              </div>

              {/* ── Footer ── */}
              <div className="td-footer">
                <Button className="td-btn-pay" onClick={() => {
                  const t = tickets.find(t => t.id === selectedTicketId);
                  setSelectedTicketId(null);
                  if (onCheckout && t) onCheckout(t);
                }}>
                  <span className="material-icons-round">lock</span>Thực hiện thanh toán
                </Button>
                <div className="td-footer-row">
                  <Button variant="outline" className="td-btn-sec" onClick={() => setSelectedTicketId(null)}>Hủy</Button>
                  <Button className="td-btn-sec td-btn-change" onClick={() => { setChangeStep(1); setNewFlight(''); setShowChangeModal(true); }}>Đổi vé</Button>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ══ ĐỔI VÉ MODAL ══ */}
      {showChangeModal && (() => {
        const ticket = tickets.find(t => t.id === selectedTicketId);
        if (!ticket) return null;
        const changeFee = 360000;
        const mockNewFlights = [
          { code: 'VN220', from: ticket.routeFrom, to: ticket.routeTo, depart: '06:00', arrive: '07:45', date: '25/10/2023', price: 1890000, seat: 'Phổ thông', avail: 42 },
          { code: 'VN234', from: ticket.routeFrom, to: ticket.routeTo, depart: '10:30', arrive: '12:15', date: '25/10/2023', price: 2100000, seat: 'Phổ thông', avail: 18 },
          { code: 'VN256', from: ticket.routeFrom, to: ticket.routeTo, depart: '15:00', arrive: '16:50', date: '25/10/2023', price: 3250000, seat: 'Thương gia', avail: 5 },
        ];
        const selectedNew = mockNewFlights.find(f => f.code === newFlight);
        const priceDiff = selectedNew ? selectedNew.price - parseInt(ticket.total.replace(/,/g,'')) : 0;
        return (
          <div className="cv-backdrop" onClick={() => setShowChangeModal(false)}>
            <div className="cv-modal" onClick={e => e.stopPropagation()}>

              {/* Header */}
              <div className="cv-header">
                <div className="cv-header-left">
                  <div className="cv-icon-box"><span className="material-icons-round">swap_horiz</span></div>
                  <div>
                    <h2 className="cv-title">Đổi vé máy bay</h2>
                    <p className="cv-sub">Vé: <strong>{ticket.id}</strong> · PNR: <strong>{ticket.pnr}</strong></p>
                  </div>
                </div>
                <button className="cv-close" onClick={() => setShowChangeModal(false)}>
                  <span className="material-icons-round">close</span>
                </button>
              </div>

              {/* Steps */}
              <div className="cv-steps">
                <div className={`cv-step ${changeStep >= 1 ? 'active' : ''}`}>
                  <span className="cv-step-num">1</span><span>Chọn chuyến mới</span>
                </div>
                <div className="cv-step-line" />
                <div className={`cv-step ${changeStep >= 2 ? 'active' : ''}`}>
                  <span className="cv-step-num">2</span><span>Xác nhận & Phí</span>
                </div>
              </div>

              <div className="cv-body">
                {changeStep === 1 && (
                  <>
                    {/* Current ticket summary */}
                    <div className="cv-current-card">
                      <p className="cv-card-label">VÉ HIỆN TẠI</p>
                      <div className="cv-cur-route">
                        <div>
                          <span className="cv-cur-code">{ticket.routeFrom}</span>
                          <span className="cv-cur-ap">{ticket.airportFrom}</span>
                        </div>
                        <div className="cv-cur-mid">
                          <span className="material-icons-round">flight</span>
                          <span className="cv-cur-dot">Bay thẳng</span>
                        </div>
                        <div style={{textAlign:'right'}}>
                          <span className="cv-cur-code">{ticket.routeTo}</span>
                          <span className="cv-cur-ap">{ticket.airportTo}</span>
                        </div>
                      </div>
                      <div className="cv-cur-meta">
                        <span><span className="material-icons-round">calendar_today</span>{ticket.date.split(' ')[0]}</span>
                        <span><span className="material-icons-round">schedule</span>{ticket.date.split(' ')[1]}</span>
                        <span><span className="material-icons-round">airline_seat_recline_normal</span>{ticket.seat}</span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="cv-arrow-row">
                      <div className="cv-arrow-line" />
                      <span className="material-icons-round cv-arrow-icon">arrow_downward</span>
                      <div className="cv-arrow-line" />
                      <span className="cv-arrow-label">Chuyến bay mới</span>
                    </div>

                    {/* Flight list */}
                    <div className="cv-section-head">
                      <span className="material-icons-round">flight_takeoff</span>
                      Chọn chuyến bay thay thế — {ticket.routeFrom} → {ticket.routeTo}
                    </div>
                    <div className="cv-flight-list">
                      {mockNewFlights.map(f => (
                        <div key={f.code}
                          className={`cv-flight-card ${newFlight === f.code ? 'selected' : ''}`}
                          onClick={() => setNewFlight(f.code)}>
                          <div className="cv-fc-left">
                            <div className="cv-fc-code">{f.code}</div>
                            <div className="cv-fc-seat">{f.seat}</div>
                          </div>
                          <div className="cv-fc-mid">
                            <span className="cv-fc-time">{f.depart}</span>
                            <div className="cv-fc-line"><span className="material-icons-round">flight</span></div>
                            <span className="cv-fc-time">{f.arrive}</span>
                          </div>
                          <div className="cv-fc-right">
                            <span className="cv-fc-price">{f.price.toLocaleString()}đ</span>
                            <span className="cv-fc-avail">{f.avail} ghế trống</span>
                          </div>
                          {newFlight === f.code && <span className="material-icons-round cv-fc-check">check_circle</span>}
                        </div>
                      ))}
                    </div>

                    <div className="cv-footer">
                      <button className="cv-btn-cancel" onClick={() => setShowChangeModal(false)}>Hủy</button>
                      <button
                        className={`cv-btn-next ${!newFlight ? 'disabled' : ''}`}
                        onClick={() => newFlight && setChangeStep(2)}>
                        Tiếp theo <span className="material-icons-round">chevron_right</span>
                      </button>
                    </div>
                  </>
                )}

                {changeStep === 2 && selectedNew && (
                  <>
                    {/* Confirm card */}
                    <div className="cv-confirm-box">
                      <div className="cv-confirm-row">
                        <div className="cv-cr-block">
                          <p className="cv-cr-label">Chuyến hiện tại</p>
                          <p className="cv-cr-route">{ticket.routeFrom} → {ticket.routeTo}</p>
                          <p className="cv-cr-date">{ticket.date}</p>
                        </div>
                        <div className="cv-cr-arrow"><span className="material-icons-round">swap_horiz</span></div>
                        <div className="cv-cr-block cv-cr-new">
                          <p className="cv-cr-label">Chuyến mới</p>
                          <p className="cv-cr-route">{selectedNew.from} → {selectedNew.to}</p>
                          <p className="cv-cr-date">{selectedNew.date} · {selectedNew.depart}</p>
                        </div>
                      </div>
                    </div>

                    {/* Fee breakdown */}
                    <div className="cv-section-head">
                      <span className="material-icons-round">calculate</span>Chi tiết phí đổi vé
                    </div>
                    <div className="cv-fee-table">
                      <div className="cv-fee-row">
                        <span>Giá vé mới ({selectedNew.code})</span>
                        <span>{selectedNew.price.toLocaleString()}đ</span>
                      </div>
                      <div className="cv-fee-row">
                        <span>Giá vé cũ ({ticket.id})</span>
                        <span className="cv-fee-minus">-{parseInt(ticket.total.replace(/,/g,'')).toLocaleString()}đ</span>
                      </div>
                      <div className="cv-fee-row">
                        <span>Phí đổi vé</span>
                        <span className="cv-fee-charge">{changeFee.toLocaleString()}đ</span>
                      </div>
                      <div className="cv-fee-total">
                        <span>Tổng phải thanh toán thêm</span>
                        <span className="cv-fee-total-val">
                          {(priceDiff + changeFee).toLocaleString()}đ
                        </span>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="cv-warn-box">
                      <span className="material-icons-round">info</span>
                      <p>Sau khi xác nhận, vé cũ sẽ bị hủy và vé mới sẽ được xuất tự động. Hành động này <strong>không thể hoàn tác</strong>.</p>
                    </div>

                    <div className="cv-footer">
                      <button className="cv-btn-back" onClick={() => setChangeStep(1)}>
                        <span className="material-icons-round">chevron_left</span>Quay lại
                      </button>
                      <button className="cv-btn-confirm" onClick={() => setShowChangeModal(false)}>
                        <span className="material-icons-round">check_circle</span>Xác nhận đổi vé
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`
        .layout { display: flex; min-height: 100vh; }
        .main-container { flex: 1; display: flex; flex-direction: column; background: var(--bg-main); }
        .content { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; width: 100%; }

        .text-primary { color: var(--primary); }
        .text-danger { color: var(--danger); }
        .text-muted { color: var(--text-muted); }
        .text-sm { font-size: 12px; }
        .text-right { text-align: right; }
        .font-medium { font-weight: 500; }
        .font-semibold { font-weight: 600; }
        .font-bold { font-weight: 700; }
        .mt-1 { margin-top: 4px; }
        .mt-lg { margin-top: var(--space-lg); }
        .mb-sm { margin-bottom: var(--space-sm); }
        .mb-md { margin-bottom: var(--space-md); }
        .ml-2 { margin-left: 8px; }
        .w-full { width: 100%; }
        .flex-row { display: flex; align-items: center; }
        .gap-sm { gap: var(--space-sm); }
        .border-0 { border-bottom: none !important; }
        .bg-light-blue { background: #f4f8fc; border-color: #dbeafe; }

        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-muted); margin-bottom: 16px; }
        .breadcrumb .link { color: var(--primary); cursor: pointer; }
        .breadcrumb .separator { font-size: 16px; }
        .breadcrumb .current { color: var(--text-main); }

        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); }
        .page-header h1 { font-size: 24px; margin-bottom: 4px; }
        .page-header p { color: var(--text-secondary); font-size: 14px; }

        .filter-card { padding: 12px var(--space-lg); margin-bottom: var(--space-lg); }
        .filter-row { display: flex; align-items: center; gap: var(--space-md); }
        .filter-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }
        .input-with-icon { display: flex; align-items: center; gap: 8px; border: 1px solid var(--border); border-radius: 20px; padding: 8px 16px; background: #f5f7fa; font-size: 13px; min-width: 200px; }
        .input-with-icon input { border: none; background: transparent; outline: none; width: 100%; }
        .select-wrapper { position: relative; }
        .select-wrapper select { width: 100%; border: none; background: transparent; outline: none; appearance: none; padding-right: 20px; cursor: pointer; color: var(--text-secondary); font-weight: 500; }
        .select-wrapper .arrow { position: absolute; right: 12px; font-size: 18px; pointer-events: none; }

        .table-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
        .table-responsive { width: 100%; overflow-x: auto; }
        .booking-table { width: 100%; border-collapse: collapse; text-align: left; min-width: 1000px; }
        .booking-table th { padding: 16px var(--space-lg); font-size: 12px; font-weight: 600; color: #64748b; border-bottom: 1px solid #e2e8f0; background: #fcfcfc; text-transform: uppercase; white-space: nowrap; }
        .booking-table td { padding: 16px var(--space-lg); border-bottom: 1px solid #f1f5f9; vertical-align: middle; white-space: nowrap; }
        .booking-table tr:hover td { background: #f8fafc; }
        
        .tx-id { font-family: monospace; font-size: 13px; font-weight: 700; color: #475569; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; }
        .booking-id { font-family: monospace; font-size: 13px; font-weight: 700; background: #f0f4ff; color: #0e74be; padding: 6px 12px; border-radius: 6px; display: inline-block; text-align: center; line-height: 1.2; letter-spacing: 1px; border: 1px solid #bfdbfe; }
        
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .customer-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e0e7ff; color: #3b82f6; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; text-transform: uppercase; }
        .customer-info .name { font-size: 14px; font-weight: 600; margin: 0; color: #1e293b; }
        
        .flight-info .route { font-size: 14px; display: flex; align-items: center; gap: 4px; margin: 0; }
        .flight-info .route .material-icons-round { font-size: 14px; color: #94a3b8; }
        
        .date-info .date { font-size: 14px; font-weight: 500; margin: 0 0 2px 0; color: #1e293b; }
        .date-info .time { font-size: 12px; color: #64748b; margin: 0; }
        
        .price { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }
        
        .status-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; }
        .status-badge .dot { width: 6px; height: 6px; border-radius: 50%; }
        .status-badge.success { background: #e6f4ea; color: #137333; }
        .status-badge.success .dot { background: #137333; }
        .status-badge.warning { background: #fef08a; color: #854d0e; }
        .status-badge.warning .dot { background: #854d0e; }
        .status-badge.danger { background: #fecaca; color: #991b1b; }
        .status-badge.danger .dot { background: #991b1b; }
        .status-badge.default { background: #f1f5f9; color: #64748b; }
        .status-badge.default .dot { background: #64748b; }

        .action-buttons { display: flex; gap: 4px; }
        .action-btn { display: flex; align-items: center; justify-content: center; color: #0e74be; padding: 6px; border-radius: 6px; transition: all 0.2s; border: none; background: #eff6ff; cursor: pointer; }
        .action-btn .material-icons-round { font-size: 18px; }
        .action-btn.view:hover { background: #dbeafe; color: #1e40af; }

        .pagination { display: flex; justify-content: space-between; align-items: center; padding: 16px var(--space-lg); font-size: 13px; color: var(--text-secondary); }
        .pagination strong { color: var(--text-main); }
        .page-controls { display: flex; gap: 4px; }
        .page-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border); border-radius: var(--radius-sm); background: white; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .page-btn:hover:not(.dots) { border-color: var(--primary); color: var(--primary); }
        .page-btn.active { background: var(--primary); color: white; border-color: var(--primary); }
        .page-btn.dots { border: none; background: transparent; cursor: default; }

        /* ══ TICKET DETAIL MODAL ══ */
        .td-backdrop { position: fixed; inset: 0; background: rgba(10,20,50,0.55); backdrop-filter: blur(4px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: tdFadeIn 0.2s ease; }
        @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }

        .td-modal { width: 480px; max-width: 100%; max-height: 92vh; background: white; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.35); animation: tdSlideUp 0.25s cubic-bezier(.34,1.56,.64,1); }
        @keyframes tdSlideUp { from { transform: translateY(30px) scale(0.97); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }

        /* Hero */
        .td-hero { background: linear-gradient(140deg, #0f2460 0%, #1e40af 50%, #3b82f6 100%); padding: 20px 20px 24px; position: relative; flex-shrink: 0; }
        .td-close { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.15); border: none; width: 30px; height: 30px; border-radius: 50%; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .td-close:hover { background: rgba(255,255,255,0.3); }
        .td-close .material-icons-round { font-size: 18px; }

        .td-hero-top { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .td-airline-badge { width: 40px; height: 40px; border-radius: 10px; background: white; color: #1e40af; font-weight: 900; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .td-label-sm { font-size: 11px; color: rgba(255,255,255,0.65); margin-bottom: 2px; }
        .td-pnr { font-size: 14px; font-weight: 700; color: white; font-family: monospace; letter-spacing: 1px; }
        .td-status { margin-left: auto; font-size: 11px !important; }
        .td-status.status-badge.success { background: rgba(187,247,208,0.2); color: #bbf7d0; border: 1px solid rgba(187,247,208,0.3); }
        .td-status.status-badge.danger { background: rgba(254,202,202,0.2); color: #fecaca; border: 1px solid rgba(254,202,202,0.3); }
        .td-status.status-badge.warning { background: rgba(253,230,138,0.2); color: #fde68a; border: 1px solid rgba(253,230,138,0.3); }
        .td-status.status-badge.default { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }

        /* Route */
        .td-route { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; }
        .td-city { display: flex; flex-direction: column; flex: 1; }
        .td-city-right { align-items: flex-end; }
        .td-code { font-size: 34px; font-weight: 900; color: white; line-height: 1; font-family: monospace; }
        .td-airport { font-size: 11px; color: rgba(255,255,255,0.65); margin-top: 2px; }
        .td-time { font-size: 15px; font-weight: 700; color: rgba(255,255,255,0.9); margin-top: 4px; }
        .td-date { font-size: 11px; color: rgba(255,255,255,0.7); margin-top: 4px; }
        .td-mid { display: flex; flex-direction: column; align-items: center; flex: 0 0 auto; gap: 2px; }
        .td-mid-line { flex: 1; width: 40px; height: 1px; background: rgba(255,255,255,0.3); }
        .td-plane { font-size: 22px !important; color: white !important; transform: rotate(45deg); }
        .td-direct { font-size: 9px; color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.5px; margin-top: 4px; }

        /* Chips */
        .td-chips { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .td-chip { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; padding: 8px 10px; display: flex; align-items: center; gap: 6px; }
        .td-chip .material-icons-round { font-size: 16px; color: rgba(255,255,255,0.6); flex-shrink: 0; }
        .td-chip-label { font-size: 9px; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px; }
        .td-chip-val { font-size: 15px; font-weight: 800; color: white; font-family: monospace; line-height: 1; }

        /* Tear line */
        .td-tear { display: flex; align-items: center; background: #f4f6f9; position: relative; flex-shrink: 0; }
        .td-circle { width: 20px; height: 20px; border-radius: 50%; background: white; flex-shrink: 0; box-shadow: inset 0 0 0 1px #e2e8f0; }
        .td-circle-l { margin-left: -10px; }
        .td-circle-r { margin-right: -10px; }
        .td-dash { flex: 1; border-top: 2px dashed #cbd5e1; margin: 0 4px; }

        /* Body */
        .td-body { flex: 1; overflow-y: auto; padding: 18px 20px 0; }
        .td-info-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 16px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .td-info-row { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-bottom: 1px solid #f1f5f9; background: white; transition: background 0.15s; }
        .td-info-row:last-child { border-bottom: none; }
        .td-info-row:hover { background: #f8faff; }
        .td-info-row .material-icons-round { font-size: 18px; color: #94a3b8; flex-shrink: 0; }
        .td-ikey { font-size: 11px; color: #94a3b8; margin-bottom: 2px; }
        .td-ival { font-size: 13px; font-weight: 600; color: #1e293b; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .td-code-chip { background: #e0e7ff; color: #4338ca; font-size: 11px; font-weight: 700; padding: 1px 6px; border-radius: 4px; font-family: monospace; }

        /* Fare rules */
        .td-section-head { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
        .td-section-head .material-icons-round { font-size: 16px; }
        .td-rules { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-bottom: 16px; }
        .td-rule { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #475569; }
        .td-rule.no-border { border-bottom: none; }
        .td-rule-val { font-weight: 600; font-size: 12px; }
        .td-rule-val.warn { color: #d97706; }
        .td-rule-val.err { color: #dc2626; }

        /* Total bar */
        .td-total-bar { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #eff6ff, #dbeafe); border-radius: 12px; padding: 14px 16px; margin-bottom: 16px; }
        .td-total-bar span:first-child { font-size: 13px; font-weight: 600; color: #475569; }
        .td-total-price { font-size: 22px; font-weight: 900; color: #1e40af; font-family: monospace; }
        .td-total-price small { font-size: 14px; font-weight: 600; }

        /* Footer */
        .td-footer { padding: 16px 20px; border-top: 1px solid #e2e8f0; background: #fafbfc; flex-shrink: 0; display: flex; flex-direction: column; gap: 8px; }
        .td-btn-pay { width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 13px; font-size: 15px; font-weight: 700; background: linear-gradient(135deg, #1e40af, #3b82f6); border: none; border-radius: 12px; color: white; cursor: pointer; transition: opacity 0.2s; }
        .td-btn-pay:hover { opacity: 0.9; }
        .td-btn-pay .material-icons-round { font-size: 18px; }
        .td-footer-row { display: flex; gap: 8px; }
        .td-btn-sec { flex: 1; padding: 10px; border-radius: 10px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; }
        .td-btn-change { background: #f0f4ff !important; color: #1e40af !important; border: 1px solid #bfdbfe !important; }

        @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tdSlideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

        /* ══ ĐỔI VÉ MODAL ══ */
        .cv-backdrop { position: fixed; inset: 0; background: rgba(10,20,50,0.6); backdrop-filter: blur(4px); z-index: 3000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: tdFadeIn 0.2s ease; }
        .cv-modal { width: 560px; max-width: 100%; max-height: 90vh; background: #f8fafc; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 30px 80px rgba(0,0,0,0.35); animation: tdSlideUp 0.25s cubic-bezier(.34,1.56,.64,1); }

        .cv-header { display: flex; align-items: center; justify-content: space-between; padding: 18px 20px; background: white; border-bottom: 1px solid #e2e8f0; flex-shrink: 0; }
        .cv-header-left { display: flex; align-items: center; gap: 14px; }
        .cv-icon-box { width: 42px; height: 42px; border-radius: 12px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .cv-icon-box .material-icons-round { font-size: 22px; }
        .cv-title { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 2px; }
        .cv-sub { font-size: 12px; color: #64748b; margin: 0; }
        .cv-close { background: #f1f5f9; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; transition: all 0.2s; }
        .cv-close:hover { background: #e2e8f0; color: #0f172a; }
        .cv-close .material-icons-round { font-size: 18px; }

        .cv-steps { display: flex; align-items: center; padding: 14px 24px; background: white; border-bottom: 1px solid #f1f5f9; gap: 8px; flex-shrink: 0; }
        .cv-step { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 600; color: #94a3b8; }
        .cv-step.active { color: #2563eb; }
        .cv-step-num { width: 22px; height: 22px; border-radius: 50%; border: 2px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; }
        .cv-step.active .cv-step-num { background: #2563eb; color: white; border-color: #2563eb; }
        .cv-step-line { flex: 1; height: 1px; background: #e2e8f0; }

        .cv-body { flex: 1; overflow-y: auto; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; }

        .cv-current-card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; }
        .cv-card-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
        .cv-cur-route { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .cv-cur-code { display: block; font-size: 26px; font-weight: 900; color: #0f172a; font-family: monospace; }
        .cv-cur-ap { display: block; font-size: 11px; color: #94a3b8; margin-top: 2px; }
        .cv-cur-mid { display: flex; flex-direction: column; align-items: center; gap: 4px; color: #64748b; }
        .cv-cur-mid .material-icons-round { font-size: 20px; color: #2563eb; transform: rotate(45deg); }
        .cv-cur-dot { font-size: 10px; color: #94a3b8; }
        .cv-cur-meta { display: flex; gap: 16px; font-size: 12px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 10px; }
        .cv-cur-meta span { display: flex; align-items: center; gap: 4px; }
        .cv-cur-meta .material-icons-round { font-size: 14px; color: #94a3b8; }

        .cv-arrow-row { display: flex; align-items: center; gap: 8px; }
        .cv-arrow-line { flex: 1; height: 1px; background: #e2e8f0; }
        .cv-arrow-icon { font-size: 20px !important; color: #2563eb; }
        .cv-arrow-label { font-size: 11px; font-weight: 700; color: #2563eb; text-transform: uppercase; letter-spacing: 0.5px; white-space: nowrap; }

        .cv-section-head { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
        .cv-section-head .material-icons-round { font-size: 16px; color: #2563eb; }

        .cv-flight-list { display: flex; flex-direction: column; gap: 8px; }
        .cv-flight-card { background: white; border: 2px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s; position: relative; }
        .cv-flight-card:hover { border-color: #93c5fd; background: #f0f9ff; }
        .cv-flight-card.selected { border-color: #2563eb; background: #eff6ff; }
        .cv-fc-left { display: flex; flex-direction: column; gap: 4px; min-width: 72px; }
        .cv-fc-code { font-size: 14px; font-weight: 800; color: #0f172a; font-family: monospace; }
        .cv-fc-seat { font-size: 10px; color: #64748b; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; display: inline-block; }
        .cv-fc-mid { flex: 1; display: flex; align-items: center; gap: 6px; }
        .cv-fc-time { font-size: 16px; font-weight: 700; color: #0f172a; }
        .cv-fc-line { flex: 1; display: flex; align-items: center; justify-content: center; }
        .cv-fc-line .material-icons-round { font-size: 16px; color: #2563eb; transform: rotate(45deg); }
        .cv-fc-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
        .cv-fc-price { font-size: 15px; font-weight: 800; color: #2563eb; }
        .cv-fc-avail { font-size: 10px; color: #64748b; }
        .cv-fc-check { position: absolute; top: 10px; right: 10px; font-size: 20px !important; color: #16a34a; }

        .cv-confirm-box { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; }
        .cv-confirm-row { display: flex; align-items: center; gap: 12px; }
        .cv-cr-block { flex: 1; }
        .cv-cr-new { background: #eff6ff; border-radius: 10px; padding: 10px; }
        .cv-cr-label { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
        .cv-cr-route { font-size: 15px; font-weight: 800; color: #0f172a; }
        .cv-cr-date { font-size: 11px; color: #64748b; margin-top: 2px; }
        .cv-cr-arrow .material-icons-round { font-size: 28px; color: #94a3b8; }

        .cv-fee-table { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
        .cv-fee-row { display: flex; justify-content: space-between; padding: 11px 16px; border-bottom: 1px solid #f8fafc; font-size: 13px; color: #475569; }
        .cv-fee-minus { color: #16a34a; font-weight: 600; }
        .cv-fee-charge { color: #d97706; font-weight: 600; }
        .cv-fee-total { display: flex; justify-content: space-between; padding: 14px 16px; background: #f8fafc; font-size: 14px; font-weight: 700; color: #0f172a; }
        .cv-fee-total-val { color: #2563eb; font-size: 18px; }

        .cv-warn-box { display: flex; align-items: flex-start; gap: 10px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #92400e; }
        .cv-warn-box .material-icons-round { font-size: 18px; color: #d97706; flex-shrink: 0; margin-top: 1px; }

        .cv-footer { display: flex; gap: 10px; margin-top: 4px; padding-top: 14px; border-top: 1px solid #e2e8f0; flex-shrink: 0; }
        .cv-btn-cancel, .cv-btn-back { flex: 0 0 auto; padding: 10px 18px; border: 1px solid #e2e8f0; background: white; border-radius: 10px; font-size: 13px; font-weight: 600; color: #475569; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 4px; }
        .cv-btn-cancel:hover, .cv-btn-back:hover { border-color: #94a3b8; color: #0f172a; }
        .cv-btn-next { flex: 1; display: flex; align-items: center; justify-content: center; gap: 4px; padding: 11px; background: linear-gradient(135deg,#1e40af,#3b82f6); border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: white; cursor: pointer; transition: opacity 0.2s; }
        .cv-btn-next:hover { opacity: 0.9; }
        .cv-btn-next.disabled { opacity: 0.4; cursor: not-allowed; }
        .cv-btn-next .material-icons-round { font-size: 18px; }
        .cv-btn-confirm { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 11px; background: linear-gradient(135deg,#166534,#16a34a); border: none; border-radius: 10px; font-size: 14px; font-weight: 700; color: white; cursor: pointer; transition: opacity 0.2s; }
        .cv-btn-confirm:hover { opacity: 0.9; }
        .cv-btn-confirm .material-icons-round { font-size: 18px; }
      `}</style>
    </div>
  );
};

export default TicketsPage;
