"use client";

import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard/Dashboard';
import FlightsPage from './flights/FlightsPage';
import BookingPage from './booking/BookingPage';
import ChatBubble from '../components/ChatBubble';
import TicketsPage from './tickets/TicketsPage';
import PaymentsPage from './payments/PaymentsPage';
import SettingsPage from './settings/SettingsPage';
import IssueTicketPage from './tickets/issue/IssueTicketPage';
import ExchangeTicketPage from './tickets/exchange/ExchangeTicketPage';
import CancelTicketPage from './tickets/cancel/CancelTicketPage';
import LoginPage from './login/LoginPage';
import ReportsPage from './reports/ReportsPage';
import UsersPage from './users/UsersPage';
import ProfilePage from './profile/ProfilePage';
import AuditLogPage from './audit-log/AuditLogPage';
import PaymentHistoryPage from './payments/history/PaymentHistoryPage';
import AiAdminPage from './ai-admin/AiAdminPage';
import RefundManagementPage from './refund-management/RefundManagementPage';
import PassengersPage from './passengers/PassengersPage';
import SeatMapPage from './seat-map/SeatMapPage';
import LoyaltyPage from './loyalty/LoyaltyPage';
import CheckinPage from './checkin/CheckinPage';
import GateManagementPage from './gate-management/GateManagementPage';

import { api } from '../api';

export interface BookingData {
  // ── DatCho fields ──
  id: string;           // ma_dat_cho
  ma_kh?: number;       // ma_kh → KhachHang
  ma_nv?: number;       // ma_nv → NhanVien
  ngay_dat?: string;    // ngay_dat TIMESTAMP
  tong_tien?: number;   // tong_tien DECIMAL
  trang_thai_tt?: string; // trang_thai_tt (Cho thanh toan / Da thanh toan / Da huy)

  // ── VeMayBay fields ──
  ma_ve?: string;         // ma_ve PRIMARY KEY
  hang_ghe?: string;      // hang_ghe (Economy / Business / First)
  trang_thai_ve?: string; // trang_thai_ve (Da xac nhan / Da check-in / Da huy)

  // ── ChuyenBay fields ──
  flight: string;        // ma_cb
  airline: string;       // ten_hang via HangHangKhong
  ma_hang?: string;      // ma_hang (VN / VJ / QH)
  from: string;          // ma_sb_di via TuyenBay → SanBay
  to: string;            // ma_sb_den via TuyenBay → SanBay
  nha_ga?: string;       // nha_ga (T1 / T2)
  cong_khoi_hanh?: string; // cong_khoi_hanh
  ma_may_bay?: string;   // ma_may_bay
  thoi_gian_bay?: number; // thoi_gian_bay INT (phút)

  // ── UI helper fields (derived / display) ──
  pnr: string;           // random 6-char booking reference
  customer: string;      // ten_hanh_khach (passenger 0)
  phone?: string;        // contact phone
  email?: string;        // contact email
  airportFrom?: string;  // ten_sb for from airport
  airportTo?: string;    // ten_sb for to airport
  date: string;          // ngay_gio_di formatted
  time: string;          // ngay_gio_di time part
  total: string;         // tong_tien formatted string
  pax: number;           // so luong hanh khach
  status: string;        // trang_thai_tt (display)
  badge: 'success' | 'hold' | 'danger' | 'warning' | 'default';
  type: string;          // 'Một chiều' | 'Khứ hồi'
  fareClass?: string;    // hang_ghe selected (Economy/Business/First Class)
  timeLimit: string | null; // deadline for hold bookings
  gate: string;          // cong_khoi_hanh
  terminal: string;      // nha_ga
  seat: string;          // so_ghe of first passenger
  boarding?: string;     // boarding time (computed)
  aircraft?: string;     // ma_may_bay display name
  passengersList?: Array<{ // VeMayBay records
    name: string;        // ten_hanh_khach
    seat: string;        // so_ghe
    type?: string;       // loai (Nguoi lon / Tre em / Em be)
    ma_ve?: string;      // ma_ve
    hang_ghe?: string;   // hang_ghe
    gia_ve?: number;     // gia_ve
    trang_thai_ve?: string; // trang_thai_ve
  }>;
  extraServices?: {      // Ve_DichVu records
    baggage: Array<{ weight: number; price: number; ma_dv?: string }>;
    meals: Array<{ selected: boolean; type: string; price: number; ma_dv?: string }>;
  };
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState('login');
  const [paymentView, setPaymentView] = useState<'checkout' | 'success'>('checkout');
  const [selectedTicketData, setSelectedTicketData] = useState<any | null>(null);
  const [selectedFlightData, setSelectedFlightData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Global Bookings State
  const [globalBookings, setGlobalBookings] = useState<BookingData[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [reportsData, setReportsData] = useState<any>(null);
  const [globalFlights, setGlobalFlights] = useState<any[]>([]);

  // Current logged-in user
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Load user from localStorage on mount (prevents hydration mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        const user = JSON.parse(stored);
        setCurrentUser(user);
        
        // Restore last page if it exists
        const lastPage = localStorage.getItem('lastPage');
        if (lastPage) {
          setCurrentPage(lastPage);
        } else {
          setCurrentPage('dashboard');
        }
      }
    } catch (e) {
      console.error("Failed to load session from localStorage", e);
    }
  }, []);

  // Save current page to localStorage whenever it changes
  useEffect(() => {
    if (currentPage !== 'login') {
      localStorage.setItem('lastPage', currentPage);
    }
  }, [currentPage]);

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastPage');
    setCurrentUser(null);
    setCurrentPage('login');
  };

  // Fetch data from Backend
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [flights, bookings, stats, reports] = await Promise.all([
          api.getFlights(),
          api.getBookings(),
          api.getStats(),
          api.getReports()
        ]);
        setGlobalFlights(flights);
        setGlobalBookings(bookings);
        setDashboardStats(stats);
        setReportsData(reports);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    
    // Initial fetch
    fetchData();
    
    // Auto-sync every 15 seconds
    const intervalId = setInterval(fetchData, 15000);
    return () => clearInterval(intervalId);
  }, []);

  // Auto-expiry logic for Hold bookings
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      let hasChange = false;
      const updated = globalBookings.map(b => {
        if (b.badge === 'hold' && b.timeLimit && new Date(b.timeLimit) < now) {
          hasChange = true;
          return { ...b, status: 'Đã hủy (Hết hạn)', badge: 'danger' as const, timeLimit: null };
        }
        return b;
      });
      if (hasChange) setGlobalBookings(updated);
    }, 10000); // Check every 10 seconds
    return () => clearInterval(timer);
  }, [globalBookings]);

  const addBooking = async (newBooking: any) => {
    try {
      // Map frontend fields → backend schema (DatCho + VeMayBay)
      const payload = {
        // DatCho fields
        ma_kh: newBooking.ma_kh || null,
        ma_nv: newBooking.ma_nv || null,
        tong_tien: newBooking.tong_tien || parseFloat((newBooking.total || '0').toString().replace(/\D/g, '')),
        trang_thai_tt: newBooking.trang_thai_tt || 'Cho thanh toan',

        // ChuyenBay reference
        flight_id: newBooking.flight,   // ma_cb
        ma_hang: newBooking.ma_hang || newBooking.code || '',

        // Contact info
        customer_name: newBooking.customer,
        phone: newBooking.phone || '',
        email: newBooking.email || '',

        // VeMayBay records
        passengers: (newBooking.passengersList || []).map((p: any) => ({
          ten_hanh_khach: p.name,       // ten_hanh_khach
          so_ghe: p.seat,              // so_ghe
          hang_ghe: p.hang_ghe || newBooking.fareClass || 'Economy', // hang_ghe
          gia_ve: p.gia_ve || newBooking.tong_tien || 0,             // gia_ve
          trang_thai_ve: p.trang_thai_ve || 'Da xac nhan',           // trang_thai_ve
          age_type: p.type || 'Nguoi lon'
        })),

        // Ve_DichVu records
        extra_services: newBooking.extraServices || null,

        // Display helpers
        status: newBooking.status || 'Chờ thanh toán',
        fare_class: newBooking.fareClass || 'Economy',
        pnr: newBooking.pnr,
        type: newBooking.type || 'Một chiều'
      };
      const res = await api.createBooking(payload);
      if (res.id) {
        const bookings = await api.getBookings();
        setGlobalBookings(bookings);
        return res;
      }
      return null;
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const updateBookingStatus = async (id: string, status: string, badge: any, method: string = 'Tien mat') => {
    try {
      console.log(`[SYNC] Updating Booking ${id} → trang_thai_tt: ${status}, method: ${method}`);
      
      // 1. Nếu xuất vé → tạo bản ghi ThanhToan
      if (status === 'Đã xuất vé' || status === 'Đã thanh toán') {
        const booking = globalBookings.find(b => b.id === id);
        if (booking) {
          const cleanAmount = (booking.total || '0').toString().replace(/\D/g, '');
          await api.createPayment({
            // ThanhToan fields
            ma_dat_cho: id,                       // REFERENCES DatCho(ma_dat_cho)
            phuong_thuc: method,                  // phuong_thuc (Tien mat / Chuyen khoan / ...)
            so_tien: parseFloat(cleanAmount),     // so_tien DECIMAL
            trang_thai: 'Hoan tat',               // trang_thai
            // Legacy compat
            booking_id: id,
            amount: parseFloat(cleanAmount),
            method: method,
            notes: 'Giao dịch qua hệ thống'
          });
        }
      }

      // 2. Cập nhật trang_thai_tt của DatCho
      const res = await api.updateBooking(id, {
        status,                    // display status
        trang_thai_tt: status      // giữ nguyên tiếng Việt có dấu
      });
      
      if (res.status === 'success') {
        // 3. Lấy dữ liệu mới nhất để sync UI
        const freshData = await api.getBookings();
        setGlobalBookings(freshData);
        
        if (selectedTicketData && selectedTicketData.id === id) {
          const updatedTicket = freshData.find((b: any) => b.id === id);
          if (updatedTicket) setSelectedTicketData(updatedTicket);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update booking status:", error);
      return false;
    }
  };

  const updateBooking = async (updated: any) => {
    try {
      await api.updateBooking(updated.id, { status: updated.status, seat: updated.seat });
      setGlobalBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
      return true;
    } catch (error) {
      console.error("Failed to update booking:", error);
      return false;
    }
  };

  const updateFlightInfo = async (flightCode: string, aircraft: string, gate: string) => {
    try {
      await api.updateFlight(flightCode, { aircraft, gate });
      setGlobalFlights(prev => prev.map(f => f.flight === flightCode ? { ...f, aircraft, gate } : f));
      // Also update local bookings for that flight
      setGlobalBookings(prev => prev.map(b => b.flight === flightCode ? { ...b, aircraft, gate } : b));
      return true;
    } catch (error) {
      console.error("Failed to update flight info:", error);
      return false;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await api.deleteBooking(id);
      setGlobalBookings(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error("Failed to delete booking:", error);
    }
  };

  const addFlight = async (flightData: any) => {
    try {
      // Map frontend flight data to backend schema
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      const payload = {
        ma_cb: flightData.flight,
        ma_tuyen: `${flightData.from}-${flightData.to}`,
        ma_hang: flightData.code,
        ngay_gio_di: `${dateStr}T${flightData.dep}:00Z`,
        ngay_gio_den: `${dateStr}T${flightData.arr}:00Z`,
        thoi_gian_bay: 120,
        ma_may_bay: flightData.aircraft,
        gia_ve: flightData.price,
        cap: flightData.cap,
        trang_thai: flightData.status || 'Đang bán vé',
        cong_khoi_hanh: flightData.gate || '--',
        nha_ga: 'T1'
      };
      await api.createFlight(payload);
      const flights = await api.getFlights();
      setGlobalFlights(flights);
      return true;
    } catch (error) {
      console.error("Failed to add flight:", error);
      return false;
    }
  };

  const deleteFlight = async (id: string) => {
    try {
      await api.deleteFlight(id);
      setGlobalFlights(prev => prev.filter(f => f.id !== id));
    } catch (error) {
      console.error("Failed to delete flight:", error);
    }
  };

  const handleGoToCheckout = (ticket: any) => {
    setSelectedTicketData(ticket);
    setPaymentView('checkout');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSuccess = async (ticketId: string, method?: string) => {
    // updateBookingStatus can be called here if it wasn't called by the component
    // In our case, the component might call it, but let's ensure consistency
    setPaymentView('success');
    // Refresh bookings to show updated status
    const freshData = await api.getBookings();
    setGlobalBookings(freshData);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} bookings={globalBookings} stats={dashboardStats} reports={reportsData} flights={globalFlights} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'flights':
        return (
          <FlightsPage 
            onNavigate={setCurrentPage} 
            onSelectFlight={setSelectedFlightData} 
            flights={globalFlights} 
            bookings={globalBookings}
            onAddFlight={addFlight}
            onUpdateFlight={updateFlightInfo}
            onDeleteFlight={deleteFlight}
            currentUser={currentUser}
            onLogout={handleLogout}
            bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length}
            flightCount={globalFlights.length}
            passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)}
          />
        );
      case 'booking':
      case 'create_booking':
        return (
          <BookingPage
            onNavigate={setCurrentPage}
            initialFlight={selectedFlightData}
            onCheckout={handleGoToCheckout}
            onAddBooking={addBooking}
            flights={globalFlights}
            bookings={globalBookings}
            currentUser={currentUser}
            onLogout={handleLogout}
            bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length}
            flightCount={globalFlights.length}
            passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)}
          />
        );
      case 'tickets':
        return (
          <TicketsPage
            onNavigate={setCurrentPage}
            onCheckout={handleGoToCheckout}
            bookings={globalBookings}
            onUpdateStatus={updateBookingStatus}
            onDeleteBooking={deleteBooking}
            currentUser={currentUser}
            onLogout={handleLogout}
            bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length}
            flightCount={globalFlights.length}
            passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)}
          />
        );
      case 'payments':
        return (
          <PaymentsPage
            onNavigate={setCurrentPage}
            view={paymentView}
            setView={setPaymentView}
            ticketData={selectedTicketData}
            onPaymentSuccess={(id) => handlePaymentSuccess(id)}
            onUpdateStatus={updateBookingStatus}
            bookings={globalBookings}
            currentUser={currentUser}
            onLogout={handleLogout}
            bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length}
            flightCount={globalFlights.length}
            passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)}
          />
        );
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} onUpdateUser={setCurrentUser} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'reports':
        return <ReportsPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'users':
        return <UsersPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'audit_log':
        return <AuditLogPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'payment_history':
        return <PaymentHistoryPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'ai_admin':
        return <AiAdminPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'issue_ticket':
        return <IssueTicketPage onNavigate={setCurrentPage} ticketData={selectedTicketData} />;
      case 'exchange_ticket':
        return <ExchangeTicketPage onNavigate={setCurrentPage} ticketData={selectedTicketData} />;
      case 'cancel_ticket':
        return <CancelTicketPage onNavigate={setCurrentPage} ticketData={selectedTicketData} />;
      case 'refund-management':
        return <RefundManagementPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateStatus={updateBookingStatus} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'passengers':
        return <PassengersPage onNavigate={setCurrentPage} bookings={globalBookings} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'seat-map':
        return <SeatMapPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'loyalty':
        return <LoyaltyPage onNavigate={setCurrentPage} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'checkin':
        return <CheckinPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateBooking={updateBooking} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      case 'gate-management':
        return <GateManagementPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateStatus={updateBookingStatus} onUpdateBooking={updateBooking} onUpdateFlightInfo={updateFlightInfo} currentUser={currentUser} onLogout={handleLogout} bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} flightCount={globalFlights.length} passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} />;
      default:
        return (
          <Dashboard 
            onNavigate={setCurrentPage} 
            bookings={globalBookings} 
            stats={dashboardStats} 
            reports={reportsData}
            flights={globalFlights} 
            currentUser={currentUser} 
            onLogout={handleLogout} 
            bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length} 
            flightCount={globalFlights.length} 
            passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)} 
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}

      {/* Global Payment Modal overlay */}
      {isPaymentModalOpen && (
        <div className="global-payment-overlay">
          <PaymentsPage
            onNavigate={(id) => { setIsPaymentModalOpen(false); setCurrentPage(id); }}
            view={paymentView}
            setView={setPaymentView}
            ticketData={selectedTicketData}
            onClose={() => setIsPaymentModalOpen(false)}
            onPaymentSuccess={(id, method) => handlePaymentSuccess(id, method)}
            onUpdateStatus={updateBookingStatus}
            bookings={globalBookings}
            currentUser={currentUser}
            onLogout={handleLogout}
            bookingPendingCount={globalBookings.filter(b => b.status === 'Chờ thanh toán').length}
            flightCount={globalFlights.length}
            passengerCount={globalBookings.reduce((sum, b) => sum + (b.passengersList?.length || 1), 0)}
          />
        </div>
      )}
      <style>{`
        .global-payment-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Chat Bubble - visible on all pages except login */}
      <ChatBubble isVisible={currentPage !== 'login'} />
    </div>
  );
}
