import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AppLayout from '../../components/AppLayout';

interface DashboardProps { 
  onNavigate?: (id: string) => void; 
  bookings?: any[];
}

const S = {
  layout: { display:'flex', minHeight:'100vh', background:'#f0f4f8' } as React.CSSProperties,
  main:   { flex:1, display:'flex', flexDirection:'column' as const, overflow:'hidden' },
  body:   { flex:1, overflowY:'auto' as const, padding:'24px' },
  grid3:  { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:20 } as React.CSSProperties,
  grid4:  { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:20 } as React.CSSProperties,
  grid2:  { display:'grid', gridTemplateColumns:'1.5fr 1fr', gap:16, marginBottom:20 } as React.CSSProperties,
  card:   { background:'white', borderRadius:14, border:'1px solid #e2e8f0', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' } as React.CSSProperties,
};

const metricCards = [
  { label:'Vé bán hôm nay', value:'147', sub:'+23 so với hôm qua', icon:'confirmation_number', color:'#2563eb', bg:'#eff6ff' },
  { label:'Chờ thanh toán', value:'32', sub:'Cần xử lý ngay', icon:'pending_actions', color:'#d97706', bg:'#fef3c7' },
  { label:'Vé đã hủy', value:'12', sub:'-5% so với tuần trước', icon:'cancel', color:'#dc2626', bg:'#fef2f2' },
  { label:'Doanh thu vé (ngày)', value:'284M', sub:'₫ VNĐ', icon:'payments', color:'#16a34a', bg:'#dcfce7' },
  { label:'Số lượng khách', value:'1,248', sub:'Hành khách đã bay', icon:'groups', color:'#7c3aed', bg:'#f5f3ff' },
  { label:'Ghế còn trống', value:'428', sub:'Trong 24h tới', icon:'event_seat', color:'#0891b2', bg:'#ecfeff' },
  { label:'Tỷ lệ lấp đầy', value:'82.5%', sub:'+2.1% mục tiêu', icon:'leaderboard', color:'#4f46e5', bg:'#eef2ff' },
  { label:'Tổng vé đã bán', value:'12.4K', sub:'Tháng này', icon:'analytics', color:'#db2777', bg:'#fdf2f8' },
];

const departures = [
  { flight:'VN123', route:'SGN → HAN', time:'08:30', seats:147, cap:180, status:'Đang lên máy bay', badge:'boarding' },
  { flight:'VJ456', route:'HAN → DAD', time:'09:15', seats:189, cap:220, status:'Đã đóng cửa', badge:'closed' },
  { flight:'QH321', route:'SGN → HPH', time:'10:00', seats:98,  cap:162, status:'Đang bán vé', badge:'open' },
  { flight:'VN789', route:'HAN → PQC', time:'11:45', seats:165, cap:180, status:'Đang lên máy bay', badge:'boarding' },
  { flight:'VJ101', route:'DAD → SGN', time:'13:20', seats:201, cap:220, status:'Đang bán vé', badge:'open' },
];

const topRoutes = [
  { route:'SGN → HAN', tickets:1248, revenue:'3.2 tỷ', fill:85 },
  { route:'HAN → SGN', tickets:1102, revenue:'2.9 tỷ', fill:78 },
  { route:'SGN → DAD', tickets:876,  revenue:'1.8 tỷ', fill:62 },
  { route:'HAN → PQC', tickets:654,  revenue:'2.1 tỷ', fill:71 },
  { route:'SGN → HPH', tickets:432,  revenue:'1.1 tỷ', fill:55 },
];

const recentActivities = [
  { type:'issued',    icon:'confirmation_number', color:'#2563eb', bg:'#eff6ff', msg:'Vé VE-2847 được xuất thành công', detail:'PNR G7X9PQ · SGN→HAN · Nguyễn Văn An', time:'2 phút trước' },
  { type:'payment',   icon:'payments',           color:'#16a34a', bg:'#dcfce7', msg:'Thanh toán hoàn tất vé VE-2846', detail:'3,250,000đ · VNPay · PNR A2B4C6',       time:'5 phút trước' },
  { type:'cancelled', icon:'cancel',             color:'#dc2626', bg:'#fef2f2', msg:'Vé VE-2840 bị hủy',               detail:'PNR L9M1N2 · HAN→PQC · Lê Hữu Đạt',  time:'12 phút trước' },
  { type:'boarding',  icon:'flight_takeoff',     color:'#7c3aed', bg:'#f5f3ff', msg:'VN123 bắt đầu lên máy bay',       detail:'Cổng B12 · Terminal 2 · 08:30',        time:'18 phút trước' },
  { type:'issued',    icon:'confirmation_number', color:'#2563eb', bg:'#eff6ff', msg:'Vé VE-2845 được xuất thành công', detail:'PNR X7Y8Z9 · SGN→HPH · Phạm Tuấn Khải','time':'25 phút trước' },
  { type:'payment',   icon:'payments',           color:'#16a34a', bg:'#dcfce7', msg:'Thanh toán hoàn tất vé VE-2844', detail:'2,450,000đ · Tiền mặt · PNR R3S4T5',    time:'31 phút trước' },
];

const badgeStyle = (b: string) => {
  if (b === 'boarding') return { bg:'#f5f3ff', color:'#7c3aed' };
  if (b === 'closed')   return { bg:'#fef2f2', color:'#dc2626' };
  return { bg:'#dcfce7', color:'#15803d' };
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, bookings = [] }) => {
  const [activeTab, setActiveTab] = useState<'today'|'week'|'month'>('today');

  // Dynamic calculations
  const totalBooked = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Chờ thanh toán').length;
  const cancelledCount = bookings.filter(b => b.status === 'Đã hủy').length;
  const ticketedCount = bookings.filter(b => b.status === 'Đã xuất vé').length;
  
  const totalRevenue = bookings
    .filter(b => b.status === 'Đã xuất vé')
    .reduce((sum, b) => {
      const price = parseInt(b.total?.replace(/\D/g, '') || '0');
      return sum + price;
    }, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(0) + 'M';
    return val.toLocaleString();
  };

  const dynamicMetrics = [
    { label:'Vé bán hôm nay', value: ticketedCount.toString(), sub:'Tổng vé đã xuất', icon:'confirmation_number', color:'#2563eb', bg:'#eff6ff' },
    { label:'Chờ thanh toán', value: pendingCount.toString(), sub:'Cần xử lý ngay', icon:'pending_actions', color:'#d97706', bg:'#fef3c7' },
    { label:'Vé đã hủy', value: cancelledCount.toString(), sub:'Thống kê hệ thống', icon:'cancel', color:'#dc2626', bg:'#fef2f2' },
    { label:'Doanh thu (Tổng)', value: formatCurrency(totalRevenue), sub:'₫ VNĐ', icon:'payments', color:'#16a34a', bg:'#dcfce7' },
    { label:'Số lượng khách', value: bookings.reduce((sum, b) => sum + (b.pax || 1), 0).toString(), sub:'Hành khách hệ thống', icon:'groups', color:'#7c3aed', bg:'#f5f3ff' },
    { label:'Booking mới', value: totalBooked.toString(), sub:'Tổng số giao dịch', icon:'analytics', color:'#db2777', bg:'#fdf2f8' },
    { label:'Tỷ lệ lấp đầy', value:'84.2%', sub:'+2.1% mục tiêu', icon:'leaderboard', color:'#4f46e5', bg:'#eef2ff' },
    { label:'Ghế còn trống', value:'428', sub:'Trong 24h tới', icon:'event_seat', color:'#0891b2', bg:'#ecfeff' },
  ];

  return (
    <AppLayout activeItem="dashboard" onNavigate={onNavigate || (() => {})}>
      <div className="dashboard-content">

          {/* Page header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
            <div>
              <h1 style={{ margin:0, fontSize:24, fontWeight:900, color:'#0f172a', letterSpacing:'-0.5px' }}>Trung tâm Điều hành</h1>
              <p style={{ margin:'4px 0 0', fontSize:14, color:'#64748b' }}>Hệ thống đang theo dõi <strong>128</strong> luồng vận hành trong hôm nay</p>
            </div>
            <div style={{ display:'flex', gap:12 }}>
               <div style={{ display:'flex', gap:8, background:'white', border:'1px solid #e2e8f0', borderRadius:12, padding:4, boxShadow:'0 1px 2px rgba(0,0,0,0.05)' }}>
                {(['today','week','month'] as const).map(t => (
                  <button key={t} onClick={() => setActiveTab(t)}
                    style={{ padding:'8px 16px', borderRadius:10, border:'none', fontWeight:700, fontSize:12, cursor:'pointer', background: activeTab===t ? '#1e40af' : 'transparent', color: activeTab===t ? 'white' : '#64748b', transition:'all 0.2s' }}>
                    {t==='today'?'Hôm nay':t==='week'?'Tuần này':'Tháng này'}
                  </button>
                ))}
              </div>
              <button onClick={() => onNavigate?.('flights')} style={{ display:'flex', alignItems:'center', gap:8, padding:'0 20px', background:'#1e40af', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:13, cursor:'pointer', boxShadow:'0 4px 12px rgba(30,64,175,0.2)' }}>
                <span className="material-icons-round">add</span> Đặt vé mới
              </button>
            </div>
          </div>

          {/* Quick Actions & Alerts Row */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:20, marginBottom:24 }}>
             <div style={{ ...S.card, display:'flex', alignItems:'center', gap:32, padding:'24px' }}>
                <div style={{ flex:1 }}>
                   <h3 style={{ margin:'0 0 16px', fontSize:14, fontWeight:800, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.5px' }}>Thao tác nhanh</h3>
                   <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 }}>
                      {[
                        { label: 'Xuất vé nhanh', icon: 'bolt', color: '#10b981', target: 'tickets' },
                        { label: 'Hoàn/Hủy vé', icon: 'assignment_return', color: '#ef4444', target: 'refund-management' },
                        { label: 'Đối soát tiền', icon: 'account_balance', color: '#6366f1', target: 'payment_history' },
                        { label: 'AI Insights', icon: 'auto_awesome', color: '#f59e0b', target: 'ai_admin' },
                      ].map((a, i) => (
                        <button key={i} onClick={() => onNavigate?.(a.target)} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, background:'transparent', border:'none', cursor:'pointer', transition:'transform 0.2s' }} className="quick-action-btn">
                           <div style={{ width:52, height:52, borderRadius:16, background:'#f8fafc', border:'1px solid #f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', color:a.color }}>
                              <span className="material-icons-round" style={{ fontSize:24 }}>{a.icon}</span>
                           </div>
                           <span style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>{a.label}</span>
                        </button>
                      ))}
                   </div>
                </div>
                <div style={{ width:1, height:80, background:'#f1f5f9' }} />
                <div style={{ width:200 }}>
                   <p style={{ margin:'0 0 4px', fontSize:12, color:'#64748b', fontWeight:600 }}>CÔNG NỢ ĐẠI LÝ</p>
                   <h2 style={{ margin:'0 0 8px', fontSize:22, fontWeight:900, color:'#0f172a' }}>428.5M ₫</h2>
                   <div style={{ height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden', marginBottom:8 }}>
                      <div style={{ width:'65%', height:'100%', background:'#10b981' }} />
                   </div>
                   <p style={{ margin:0, fontSize:11, color:'#10b981', fontWeight:700 }}>Dư nợ an toàn (65%)</p>
                </div>
             </div>

             <div style={{ ...S.card, background:'linear-gradient(135deg, #fef2f2 0%, #fff 100%)', border:'1px solid #fee2e2', padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                   <span className="material-icons-round" style={{ color:'#ef4444', fontSize:20 }}>notification_important</span>
                   <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:'#991b1b' }}>CẢNH BÁO ƯU TIÊN</h3>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                   <div style={{ display:'flex', gap:10, padding:'10px', background:'white', borderRadius:10, border:'1px solid #fee2e2', boxShadow:'0 2px 4px rgba(239,68,68,0.05)' }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444', marginTop:4 }} />
                      <div>
                         <p style={{ margin:'0 0 2px', fontSize:12, fontWeight:800, color:'#1e293b' }}>PNR HOLD01 hết hạn sau 28p</p>
                         <p style={{ margin:0, fontSize:11, color:'#64748b' }}>Chặng HAN→DAD · 2.15M ₫</p>
                      </div>
                   </div>
                   <div style={{ display:'flex', gap:10, padding:'10px', background:'white', borderRadius:10, border:'1px solid #fee2e2', opacity:0.8 }}>
                      <div style={{ width:8, height:8, borderRadius:'50%', background:'#f59e0b', marginTop:4 }} />
                      <div>
                         <p style={{ margin:'0 0 2px', fontSize:12, fontWeight:800, color:'#1e293b' }}>Yêu cầu hoàn vé VE-2840</p>
                         <p style={{ margin:0, fontSize:11, color:'#64748b' }}>Đang chờ Admin phê duyệt</p>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Metric cards */}
          <div style={S.grid4}>
            {dynamicMetrics.map((m,i) => (
              <div key={i} style={S.card}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:m.bg, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span className="material-icons-round" style={{ fontSize:22, color:m.color }}>{m.icon}</span>
                  </div>
                  <span className="material-icons-round" style={{ fontSize:16, color:'#94a3b8' }}>trending_up</span>
                </div>
                <p style={{ margin:'0 0 2px', fontSize:12, color:'#64748b', fontWeight:600, textTransform:'uppercase' }}>{m.label}</p>
                <p style={{ margin:'0 0 4px', fontSize:26, fontWeight:900, color:'#0f172a' }}>{m.value}</p>
                <p style={{ margin:0, fontSize:11, color:'#94a3b8' }}>{m.sub}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div style={S.grid2}>
            {/* Revenue Chart */}
            <div style={S.card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className="material-icons-round" style={{ color:'#2563eb', fontSize:20 }}>insert_chart</span>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0f172a' }}>Doanh thu tuần này (Triệu VNĐ)</h3>
                </div>
                <div style={{ display:'flex', gap:6, fontSize:11, color:'#64748b', fontWeight:700 }}>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#2563eb' }} /> Quốc nội</span>
                  <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, borderRadius:2, background:'#bae6fd' }} /> Quốc tế</span>
                </div>
              </div>
              <div style={{ height:200, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 10px 20px', position:'relative', borderBottom:'1px solid #f1f5f9' }}>
                {[
                  { day: 'Th 2', val: 120, intl: 40 },
                  { day: 'Th 3', val: 150, intl: 60 },
                  { day: 'Th 4', val: 180, intl: 80 },
                  { day: 'Th 5', val: 140, intl: 50 },
                  { day: 'Th 6', val: 210, intl: 110 },
                  { day: 'Th 7', val: 250, intl: 140 },
                  { day: 'CN',  val: 190, intl: 90 },
                ].map((d, i) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:'10%' }}>
                    <div style={{ width:'100%', display:'flex', flexDirection:'column-reverse', gap:2, height:160 }}>
                       <div style={{ width:'100%', height:`${d.val/3}%`, background:'#2563eb', borderRadius:'4px 4px 0 0', position:'relative' }} className="chart-bar">
                         <div className="bar-tooltip">{d.val}M</div>
                       </div>
                       <div style={{ width:'100%', height:`${d.intl/3}%`, background:'#bae6fd', borderRadius:'2px 2px 0 0' }} />
                    </div>
                    <span style={{ fontSize:10, color:'#94a3b8', fontWeight:700 }}>{d.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Class Distribution Chart */}
            <div style={S.card}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:20 }}>
                <span className="material-icons-round" style={{ color:'#7c3aed', fontSize:20 }}>pie_chart</span>
                <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0f172a' }}>Thị phần theo Hãng</h3>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:30, height:200 }}>
                <div style={{ position:'relative', width:140, height:140, borderRadius:'50%', background:'conic-gradient(#005a8c 0% 45%, #ed1b24 45% 80%, #00a563 80% 100%)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ width:80, height:80, borderRadius:'50%', background:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:20, fontWeight:900, color:'#1e293b' }}>1,248</span>
                    <span style={{ fontSize:9, color:'#94a3b8', fontWeight:700 }}>TỔNG VÉ</span>
                  </div>
                </div>
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                  {[
                    { label:'Vietnam Airlines', pct:45, color:'#005a8c', val:552 },
                    { label:'Vietjet Air', pct:35, color:'#ed1b24', val:170 },
                    { label:'Bamboo Airways', pct:20, color:'#00a563', val:128 },
                  ].map((c, i) => (
                    <div key={i}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ width:10, height:10, borderRadius:3, background:c.color }} />
                          <span style={{ fontSize:12, fontWeight:700, color:'#475569' }}>{c.label}</span>
                        </div>
                        <span style={{ fontSize:12, fontWeight:800, color:'#1e293b' }}>{c.pct}%</span>
                      </div>
                      <div style={{ height:5, background:'#f1f5f9', borderRadius:10, overflow:'hidden' }}>
                        <div style={{ width:`${c.pct}%`, height:'100%', background:c.color, borderRadius:10 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div style={S.grid2}>
            {/* Departures */}
            <div style={S.card}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span className="material-icons-round" style={{ color:'#2563eb', fontSize:20 }}>flight_takeoff</span>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0f172a' }}>Chuyến bay sắp khởi hành</h3>
                </div>
                <button onClick={() => onNavigate?.('flights')} style={{ background:'#eff6ff', border:'none', borderRadius:8, padding:'5px 12px', fontSize:12, fontWeight:700, color:'#2563eb', cursor:'pointer' }}>Xem tất cả</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {departures.map((d,i) => {
                  const bs = badgeStyle(d.badge);
                  const pct = Math.round(d.seats/d.cap*100);
                  return (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', background:'#f8fafc', borderRadius:10, border:'1px solid #f1f5f9', cursor:'pointer' }} onClick={() => onNavigate?.('flights')}>
                      <div style={{ textAlign:'center', minWidth:48 }}>
                        <p style={{ margin:0, fontSize:15, fontWeight:900, color:'#0f172a', fontFamily:'monospace' }}>{d.flight}</p>
                        <p style={{ margin:0, fontSize:10, color:'#94a3b8', fontWeight:600 }}>{d.time}</p>
                      </div>
                      <div style={{ flex:1 }}>
                        <p style={{ margin:'0 0 4px', fontSize:13, fontWeight:700, color:'#1e293b' }}>{d.route}</p>
                        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <div style={{ flex:1, height:4, background:'#e2e8f0', borderRadius:4, overflow:'hidden' }}>
                            <div style={{ width:`${pct}%`, height:'100%', background: pct>90?'#dc2626':pct>70?'#d97706':'#2563eb', borderRadius:4 }} />
                          </div>
                          <span style={{ fontSize:10, color:'#64748b', fontWeight:700, whiteSpace:'nowrap' }}>{d.seats}/{d.cap}</span>
                        </div>
                      </div>
                      <span style={{ background:bs.bg, color:bs.color, fontSize:10, fontWeight:700, padding:'3px 8px', borderRadius:8, whiteSpace:'nowrap' }}>{d.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Top Routes */}
              <div style={S.card}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span className="material-icons-round" style={{ color:'#7c3aed', fontSize:20 }}>bar_chart</span>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0f172a' }}>Top tuyến bay</h3>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {topRoutes.map((r,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:12, fontWeight:800, color:'#94a3b8', minWidth:16 }}>#{i+1}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                          <span style={{ fontSize:12, fontWeight:700, color:'#1e293b' }}>{r.route}</span>
                          <span style={{ fontSize:11, color:'#2563eb', fontWeight:700 }}>{r.revenue}</span>
                        </div>
                        <div style={{ height:4, background:'#e2e8f0', borderRadius:4, overflow:'hidden' }}>
                          <div style={{ width:`${r.fill}%`, height:'100%', background:'linear-gradient(90deg,#1e40af,#3b82f6)', borderRadius:4 }} />
                        </div>
                      </div>
                      <span style={{ fontSize:11, color:'#64748b', minWidth:28, textAlign:'right' }}>{r.fill}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activities */}
              <div style={{ ...S.card, flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span className="material-icons-round" style={{ color:'#d97706', fontSize:20 }}>history</span>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0f172a' }}>Hoạt động gần đây</h3>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {recentActivities.map((a,i) => (
                    <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:a.bg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <span className="material-icons-round" style={{ fontSize:16, color:a.color }}>{a.icon}</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:700, color:'#1e293b' }}>{a.msg}</p>
                        <p style={{ margin:0, fontSize:11, color:'#64748b' }}>{a.detail}</p>
                      </div>
                      <span style={{ fontSize:10, color:'#94a3b8', whiteSpace:'nowrap' }}>{a.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      <style>{`
        .dashboard-content { animation: fadeIn 0.4s ease-out; }
        .quick-action-btn:hover { transform: translateY(-3px); }
        .chart-bar:hover { filter: brightness(1.1); cursor: pointer; }
        .chart-bar:hover .bar-tooltip { opacity: 1; transform: translateX(-50%) translateY(-10px); }
        .bar-tooltip {
          position: absolute; top: -30px; left: 50%; transform: translateX(-50%) translateY(0);
          background: #1e293b; color: white; padding: 4px 8px; border-radius: 6px;
          font-size: 10px; font-weight: 700; opacity: 0; pointer-events: none;
          transition: all 0.2s; white-space: nowrap; z-index: 10;
        }
        .bar-tooltip::after {
          content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
          border-left: 4px solid transparent; border-right: 4px solid transparent; border-top: 4px solid #1e293b;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </AppLayout>
  );
};

export default Dashboard;
