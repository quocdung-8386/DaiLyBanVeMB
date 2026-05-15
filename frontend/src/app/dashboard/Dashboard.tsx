import React, { useState, useMemo } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AppLayout from '../../components/AppLayout';

interface DashboardProps { 
  onNavigate?: (id: string) => void; 
  bookings?: any[];
  stats?: any;
  reports?: any;
  flights?: any[];
  currentUser?: any;
  onLogout?: () => void;
  bookingPendingCount?: number;
  flightCount?: number;
  passengerCount?: number;
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

const badgeStyle = (status: string) => {
  if (status === 'Đang lên máy bay' || status === 'Boarding') return { bg:'#f5f3ff', color:'#7c3aed' };
  if (status === 'Đã đóng cửa' || status === 'Closed')   return { bg:'#fef2f2', color:'#dc2626' };
  return { bg:'#dcfce7', color:'#15803d' };
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, bookings = [], stats, reports, flights = [], currentUser }) => {
  const [activeTab, setActiveTab] = useState<'today'|'week'|'month'>('today');
  const user = currentUser || JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userName = user.fullName || user.username || 'Quản trị viên';

  // Dynamic calculations for core metrics
  const totalBooked = bookings.length;
  const pendingCount = bookings.filter((b: any) => b.status === 'Chờ thanh toán').length;
  const cancelledCount = bookings.filter((b: any) => b.status === 'Đã hủy').length;
  const ticketedCount = bookings.filter((b: any) => b.status === 'Đã xuất vé' || b.status === 'Đã thanh toán').length;
  
  const totalRevenueNum = bookings
    .filter((b: any) => b.status === 'Đã xuất vé' || b.status === 'Đã thanh toán' || b.status === 'Hoàn tất')
    .reduce((sum: number, b: any) => {
      const price = parseInt((b.total || '0').toString().replace(/\D/g, '') || '0');
      return sum + price;
    }, 0);

  const formatCurrency = (val: number) => {
    if (val >= 1000000000) return (val / 1000000000).toFixed(1) + 'B';
    if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M';
    return val.toLocaleString('vi-VN');
  };

  const dynamicMetrics = [
    { label:'Vé bán hôm nay', value: stats?.active_bookings !== undefined ? stats.active_bookings.toString() : ticketedCount.toString(), sub:'Tổng vé đã xuất', icon:'confirmation_number', color:'#2563eb', bg:'#eff6ff' },
    { label:'Chờ thanh toán', value: stats?.pending_bookings !== undefined ? stats.pending_bookings.toString() : pendingCount.toString(), sub:'Cần xử lý ngay', icon:'pending_actions', color:'#d97706', bg:'#fef3c7' },
    { label:'Vé đã hủy', value: stats?.cancelled_bookings !== undefined ? stats.cancelled_bookings.toString() : cancelledCount.toString(), sub:'Thống kê hệ thống', icon:'cancel', color:'#dc2626', bg:'#fef2f2' },
    { label:'Doanh thu (Tổng)', value: stats?.total_revenue !== undefined ? formatCurrency(Number(stats.total_revenue)) : formatCurrency(totalRevenueNum), sub:'₫ VNĐ', icon:'payments', color:'#16a34a', bg:'#dcfce7' },
    { label:'Số lượng khách', value: stats?.total_passengers !== undefined ? stats.total_passengers.toString() : bookings.reduce((sum: number, b: any) => sum + (b.passengersList?.length || 1), 0).toString(), sub:'Hành khách hệ thống', icon:'groups', color:'#7c3aed', bg:'#f5f3ff' },
    { label:'Booking mới', value: stats?.total_bookings !== undefined ? stats.total_bookings.toString() : totalBooked.toString(), sub:'Tổng số giao dịch', icon:'analytics', color:'#db2777', bg:'#fdf2f8' },
    { label:'Tỷ lệ lấp đầy', value: stats?.avg_occupancy ? stats.avg_occupancy.toFixed(1) + '%' : (flights.length > 0 ? (flights.reduce((s: number, f: any) => s + (f.seatsSold/f.cap), 0) / flights.length * 100).toFixed(1) + '%' : '0%'), sub:'Dựa trên ghế đã bán', icon:'leaderboard', color:'#4f46e5', bg:'#eef2ff' },
    { label:'Ghế còn trống', value: stats?.available_seats !== undefined ? stats.available_seats.toString() : flights.reduce((s: number, f: any) => s + (f.cap - f.seatsSold), 0).toString(), sub:'Toàn mạng bay', icon:'event_seat', color:'#0891b2', bg:'#ecfeff' },
  ];

  // Dynamic Departures from real flights
  const dynamicDepartures = flights.slice(0, 5).map((f: any) => ({
    flight: f.flight || f.ma_cb || 'N/A',
    route: `${f.from || f.ma_sb_di || '?'} → ${f.to || f.ma_sb_den || '?'}`,
    time: f.dep || f.ngay_gio_di || '--:--',
    seats: f.seatsSold || f.da_ban || 0,
    cap: f.cap || f.tong_so_ghe || 180,
    status: f.status === 'Scheduled' ? 'Đang bán vé' : (f.status || f.trang_thai || 'Đang bán vé'),
    badge: f.status || f.trang_thai
  }));

  // Dynamic Top Routes (Prefer Backend Reports Data)
  const dynamicTopRoutes = useMemo(() => {
    if (reports?.top_routes && reports.top_routes.length > 0) {
      const maxVal = Math.max(...reports.top_routes.map((r: any) => r.count), 1);
      return reports.top_routes.map((r: any) => ({
        route: r.route,
        tickets: r.count,
        revenue: formatCurrency(r.revenue),
        fill: Math.min(100, Math.round((r.count / maxVal) * 100))
      }));
    }
    
    // Fallback to frontend calculation
    const routeMap: Record<string, { tickets: number, revenue: number }> = {};
    bookings.forEach((b: any) => {
      const rKey = `${b.from} → ${b.to}`;
      if (!routeMap[rKey]) routeMap[rKey] = { tickets: 0, revenue: 0 };
      routeMap[rKey].tickets += 1;
      routeMap[rKey].revenue += parseInt((b.total || '0').toString().replace(/\D/g, '') || '0');
    });
    const maxTickets = Math.max(...Object.values(routeMap).map((d: any) => d.tickets), 1);
    return Object.entries(routeMap)
      .map(([route, data]) => ({
        route,
        tickets: data.tickets,
        revenue: formatCurrency(data.revenue),
        fill: Math.min(100, Math.round((data.tickets / maxTickets) * 100))
      }))
      .sort((a, b) => b.tickets - a.tickets)
      .slice(0, 5);
  }, [bookings, reports]);

  // Dynamic Revenue Chart: group ticketed bookings by weekday
  const revenueByDay = useMemo(() => {
    const days = ['CN','Th 2','Th 3','Th 4','Th 5','Th 6','Th 7'];
    const map: Record<number, number> = {0:0,1:0,2:0,3:0,4:0,5:0,6:0};
    bookings.filter((b: any) => b.status === 'Đã xuất vé' || b.status === 'Đã thanh toán' || b.status === 'Hoàn tất').forEach((b: any) => {
      if (b.ngay_dat || b.date) {
        try {
          const d = new Date(b.ngay_dat || b.date);
          const day = d.getDay();
          map[day] += parseInt((b.total || '0').toString().replace(/\D/g, '') || '0') / 1000000;
        } catch {}
      }
    });
    return days.map((day: string, i: number) => ({ day, val: Math.round(map[i] || 0), intl: 0 }));
  }, [bookings]);
  const maxBar = Math.max(...revenueByDay.map((d: any) => d.val), 1);

  const airlineColors: Record<string,string> = { 'Vietnam Airlines':'#005a8c','Vietjet Air':'#ed1b24','Bamboo Airways':'#00a563' };

  // Dynamic Airline Market Share (Prefer Backend Reports Data)
  const airlineChartData = useMemo(() => {
    if (reports?.airline_share && reports.airline_share.length > 0) {
      return reports.airline_share.map((a: any) => ({
        label: a.name,
        val: a.count,
        pct: a.percentage,
        color: airlineColors[a.name] || '#6366f1'
      }));
    }
    
    // Fallback to frontend calculation
    const m: Record<string, number> = {};
    bookings.forEach((b: any) => {
      const a = b.airline || 'Vietnam Airlines';
      m[a] = (m[a] || 0) + 1;
    });
    const totalAirline = Math.max(Object.values(m).reduce((s,v)=>s+v,0), 1);
    return Object.entries(m).slice(0,3).map(([label, cnt]) => ({
      label, val: cnt, pct: Math.round(cnt/totalAirline*100),
      color: airlineColors[label] || '#6366f1'
    }));
  }, [bookings, reports]);
  const conicStops = airlineChartData.reduce((acc: string[], c: any, i: number) => {
    const prev = airlineChartData.slice(0,i).reduce((s: number, x: any) => s + x.pct, 0);
    acc.push(`${c.color} ${prev}% ${prev+c.pct}%`);
    return acc;
  }, []).join(', ') || '#e2e8f0 0% 100%';

  // Dynamic Alerts: hold bookings nearing expiry
  const holdAlerts = useMemo(() => {
    const now = new Date();
    return bookings
      .filter((b: any) => b.badge === 'hold' && b.timeLimit)
      .map((b: any) => {
        const exp = new Date(b.timeLimit!);
        const diffMin = Math.round((exp.getTime() - now.getTime()) / 60000);
        return { ...b, diffMin };
      })
      .filter((b: any) => b.diffMin > 0 && b.diffMin < 120)
      .sort((a: any, b: any) => a.diffMin - b.diffMin)
      .slice(0,2);
  }, [bookings]);

  // Dynamic agency debt from pending payments
  const agencyDebt = useMemo(() => {
    const pending = bookings.filter((b: any) => b.badge === 'hold' || b.status === 'Chờ thanh toán')
      .reduce((s: number, b: any) => s + parseInt((b.total||'0').toString().replace(/\D/g,'') || '0'), 0);
    return pending;
  }, [bookings]);

  // Dynamic Recent Activities
  const dynamicActivities = bookings.slice(-6).reverse().map((b: any) => {
    const isSuccess = b.status === 'Đã xuất vé' || b.status === 'Đã thanh toán';
    const isHold = b.status === 'Chờ thanh toán' || b.badge === 'hold';
    
    return {
      type: isSuccess ? 'issued' : isHold ? 'payment' : 'cancelled',
      icon: isSuccess ? 'confirmation_number' : isHold ? 'pending_actions' : 'cancel',
      color: isSuccess ? '#2563eb' : isHold ? '#d97706' : '#dc2626',
      bg: isSuccess ? '#eff6ff' : isHold ? '#fef3c7' : '#fef2f2',
      msg: isSuccess ? `Vé ${b.id} đã được xuất` : `Booking ${b.id} đang chờ`,
      detail: `PNR ${b.pnr} · ${b.from}→${b.to} · ${b.customer}`,
      time: 'Vừa xong'
    };
  });

  return (
    <AppLayout 
      activeItem="dashboard" 
      onNavigate={onNavigate || (() => {})} 
      currentUser={user} 
      bookingPendingCount={pendingCount}
      flightCount={flights.length}
      passengerCount={bookings.reduce((sum: number, b: any) => sum + (b.passengersList?.length || 1), 0)}
    >
      <div className="dashboard-content">

          {/* Page header */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
            <div>
              <h1 style={{ margin:0, fontSize:24, fontWeight:900, color:'#0f172a', letterSpacing:'-0.5px' }}>Xin chào, {userName} 👋</h1>
              <p style={{ margin:'4px 0 0', fontSize:14, color:'#64748b' }}>Hệ thống đang theo dõi <strong>{bookings.length + flights.length}</strong> luồng vận hành trong hôm nay</p>
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
                    <p style={{ margin:'0 0 4px', fontSize:12, color:'#64748b', fontWeight:600 }}>CÔNG NỢ CHỜ THU</p>
                    <h2 style={{ margin:'0 0 8px', fontSize:22, fontWeight:900, color:'#0f172a' }}>{formatCurrency(agencyDebt)} ₫</h2>
                    <div style={{ height:6, background:'#f1f5f9', borderRadius:3, overflow:'hidden', marginBottom:8 }}>
                       <div style={{ width: agencyDebt > 0 ? '65%' : '0%', height:'100%', background: agencyDebt > 500000000 ? '#ef4444' : '#10b981' }} />
                    </div>
                    <p style={{ margin:0, fontSize:11, color: agencyDebt > 500000000 ? '#ef4444' : '#10b981', fontWeight:700 }}>{agencyDebt > 0 ? 'Cần theo dõi' : 'Không có nợ'}</p>
                 </div>
             </div>

             <div style={{ ...S.card, background:'linear-gradient(135deg, #fef2f2 0%, #fff 100%)', border:'1px solid #fee2e2', padding:'20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                   <span className="material-icons-round" style={{ color:'#ef4444', fontSize:20 }}>notification_important</span>
                   <h3 style={{ margin:0, fontSize:14, fontWeight:800, color:'#991b1b' }}>CẢNH BÁO ƯU TIÊN</h3>
                </div>
                 <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {holdAlerts.length > 0 ? holdAlerts.map((b,i) => (
                      <div key={i} style={{ display:'flex', gap:10, padding:'10px', background:'white', borderRadius:10, border:'1px solid #fee2e2', boxShadow:'0 2px 4px rgba(239,68,68,0.05)' }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background: b.diffMin < 30 ? '#ef4444' : '#f59e0b', marginTop:4 }} />
                        <div>
                          <p style={{ margin:'0 0 2px', fontSize:12, fontWeight:800, color:'#1e293b' }}>PNR {b.pnr} hết hạn sau {b.diffMin}p</p>
                          <p style={{ margin:0, fontSize:11, color:'#64748b' }}>Chặng {b.from}→{b.to} · {b.total ? parseInt((b.total||'0').toString().replace(/\D/g,'')).toLocaleString() : '0'}đ</p>
                        </div>
                      </div>
                    )) : (
                      <div style={{ padding:'20px 10px', textAlign:'center', color:'#94a3b8', fontSize:12 }}>
                        <span className="material-icons-round" style={{fontSize:28, display:'block', marginBottom:6}}>check_circle</span>
                        Không có cảnh báo
                      </div>
                    )}
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
                {revenueByDay.map((d: any, i: number) => (
                  <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, width:'10%' }}>
                    <div style={{ width:'100%', display:'flex', flexDirection:'column-reverse', gap:2, height:160 }}>
                       <div style={{ width:'100%', height:`${Math.max(d.val/maxBar*100,2)}%`, background:'#2563eb', borderRadius:'4px 4px 0 0', position:'relative' }} className="chart-bar">
                         <div className="bar-tooltip">{d.val > 0 ? d.val.toFixed(1) + 'M' : '0'}</div>
                       </div>
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
                {airlineChartData.length > 0 ? (
                  <>
                    <div style={{ position:'relative', width:140, height:140, borderRadius:'50%', background:`conic-gradient(${conicStops})`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <div style={{ width:80, height:80, borderRadius:'50%', background:'white', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                        <span style={{ fontSize:18, fontWeight:900, color:'#1e293b' }}>{bookings.length}</span>
                        <span style={{ fontSize:9, color:'#94a3b8', fontWeight:700 }}>BOOKING</span>
                      </div>
                    </div>
                    <div style={{ flex:1, display:'flex', flexDirection:'column', gap:12 }}>
                      {airlineChartData.map((c: any, i: number) => (
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
                  </>
                ) : (
                  <p style={{fontSize:13,color:'#94a3b8',textAlign:'center',width:'100%'}}>Chưa có dữ liệu booking</p>
                )}
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
                {dynamicDepartures.length > 0 ? dynamicDepartures.map((d: any, i: number) => {
                  const bs = badgeStyle(d.status);
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
                }) : (
                  <p style={{textAlign:'center', padding:20, color:'#64748b', fontSize:13}}>Không có chuyến bay sắp khởi hành</p>
                )}
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
                  {dynamicTopRoutes.length > 0 ? dynamicTopRoutes.map((r: any, i: number) => (
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
                  )) : (
                    <p style={{fontSize:12, color:'#64748b', textAlign:'center', padding:10}}>Chưa có dữ liệu tuyến bay</p>
                  )}
                </div>
              </div>

              {/* Recent Activities */}
              <div style={{ ...S.card, flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span className="material-icons-round" style={{ color:'#d97706', fontSize:20 }}>history</span>
                  <h3 style={{ margin:0, fontSize:15, fontWeight:800, color:'#0f172a' }}>Hoạt động gần đây</h3>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {dynamicActivities.length > 0 ? dynamicActivities.map((a: any, i: number) => (
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
                  )) : (
                    <p style={{fontSize:12, color:'#64748b', textAlign:'center', padding:10}}>Chưa có hoạt động mới</p>
                  )}
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
