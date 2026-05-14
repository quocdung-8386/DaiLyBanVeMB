"use client";

import React, { useState } from 'react';
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
  id: string;
  pnr: string;
  customer: string;
  flight: string;
  airline: string;
  from: string;
  to: string;
  airportFrom: string;
  airportTo: string;
  date: string;
  time: string;
  total: string;
  pax: number;
  status: string;
  badge: 'success' | 'hold' | 'danger' | 'warning' | 'default';
  type: string;
  timeLimit: string | null;
  gate: string;
  terminal: string;
  seat: string;
  boarding: string;
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

  const [globalFlights, setGlobalFlights] = useState<any[]>([]);

  // Fetch initial data from Backend
  React.useEffect(() => {
    const initData = async () => {
      try {
        const [flights, bookings, stats] = await Promise.all([
          api.getFlights(),
          api.getBookings(),
          api.getStats()
        ]);
        setGlobalFlights(flights);
        setGlobalBookings(bookings);
        setDashboardStats(stats);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };
    initData();
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
      const payload = {
        flight_id: newBooking.flight,
        customer_name: newBooking.customer,
        phone: newBooking.phone || '',
        email: newBooking.email || '',
        passengers: newBooking.passengersList.map((p: any) => ({
          name: p.name,
          seat: p.seat,
          age_type: p.type
        })),
        total_amount: parseFloat(newBooking.total.replace(/,/g, '')),
        status: newBooking.status,
        fare_class: newBooking.fareClass || 'Economy'
      };
      const res = await api.createBooking(payload);
      if (res.id) {
        const bookings = await api.getBookings();
        setGlobalBookings(bookings);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const updateBookingStatus = async (id: string, status: string, badge: any) => {
    try {
      await api.updateBooking(id, { status });
      setGlobalBookings(prev => prev.map(b => b.id === id ? { ...b, status, badge, timeLimit: status === 'Đã xuất vé' ? null : b.timeLimit } : b));
    } catch (error) {
      console.error("Failed to update booking status:", error);
    }
  };

  const updateBooking = async (updated: any) => {
    try {
      await api.updateBooking(updated.id, { status: updated.status, seat: updated.seat });
      setGlobalBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const updateFlightInfo = async (flightCode: string, aircraft: string, gate: string) => {
    try {
      await api.updateFlight(flightCode, { aircraft, gate });
      setGlobalFlights(prev => prev.map(f => f.flight === flightCode ? { ...f, aircraft, gate } : f));
      // Also update local bookings for that flight
      setGlobalBookings(prev => prev.map(b => b.flight === flightCode ? { ...b, aircraft, gate } : b));
    } catch (error) {
      console.error("Failed to update flight info:", error);
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
      const payload = {
        ma_cb: flightData.flight,
        ma_tuyen: `${flightData.from}-${flightData.to}`,
        ma_hang: flightData.code,
        ngay_gio_di: new Date().toISOString(), // Default for now
        ngay_gio_den: new Date().toISOString(),
        thoi_gian_bay: 120,
        ma_may_bay: flightData.aircraft,
        gia_ve: flightData.price,
        cap: flightData.cap,
        trang_thai: 'Đang bán vé'
      };
      await api.createFlight(payload);
      const flights = await api.getFlights();
      setGlobalFlights(flights);
    } catch (error) {
      console.error("Failed to add flight:", error);
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

  const handlePaymentSuccess = (ticketId: string) => {
    updateBookingStatus(ticketId, 'Đã xuất vé', 'success');
    setPaymentView('success');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} bookings={globalBookings} stats={dashboardStats} flights={globalFlights} />;
      case 'flights':
        return (
          <FlightsPage 
            onNavigate={setCurrentPage} 
            onSelectFlight={setSelectedFlightData} 
            flights={globalFlights} 
            onAddFlight={addFlight}
            onUpdateFlight={updateFlightInfo}
            onDeleteFlight={deleteFlight}
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
          />
        );
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
      case 'reports':
        return <ReportsPage onNavigate={setCurrentPage} />;
      case 'users':
        return <UsersPage onNavigate={setCurrentPage} />;
      case 'audit_log':
        return <AuditLogPage onNavigate={setCurrentPage} />;
      case 'payment_history':
        return <PaymentHistoryPage onNavigate={setCurrentPage} />;
      case 'ai_admin':
        return <AiAdminPage onNavigate={setCurrentPage} />;
      case 'issue_ticket':
        return <IssueTicketPage onNavigate={setCurrentPage} ticketData={selectedTicketData} />;
      case 'exchange_ticket':
        return <ExchangeTicketPage onNavigate={setCurrentPage} ticketData={selectedTicketData} />;
      case 'cancel_ticket':
        return <CancelTicketPage onNavigate={setCurrentPage} ticketData={selectedTicketData} />;
      case 'refund-management':
        return <RefundManagementPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateStatus={updateBookingStatus} />;
      case 'passengers':
        return <PassengersPage onNavigate={setCurrentPage} bookings={globalBookings} />;
      case 'seat-map':
        return <SeatMapPage onNavigate={setCurrentPage} />;
      case 'loyalty':
        return <LoyaltyPage onNavigate={setCurrentPage} />;
      case 'checkin':
        return <CheckinPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateBooking={updateBooking} />;
      case 'gate-management':
        return <GateManagementPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateStatus={updateBookingStatus} onUpdateBooking={updateBooking} onUpdateFlightInfo={updateFlightInfo} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} bookings={globalBookings} stats={dashboardStats} />;
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
            onPaymentSuccess={() => selectedTicketData && handlePaymentSuccess(selectedTicketData.id)}
            bookings={globalBookings}
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
