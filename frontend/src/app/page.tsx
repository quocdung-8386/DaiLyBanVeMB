"use client";

import React, { useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import ChatBubble from '../components/ChatBubble';
import FlightsPage from './flights/FlightsPage';
import BookingPage from './booking/BookingPage';
import TicketsPage from './tickets/TicketsPage';
import PaymentsPage from './payments/PaymentsPage';
import SettingsPage from './settings/SettingsPage';
import IssueTicketPage from './tickets/issue/IssueTicketPage';
import ExchangeTicketPage from './tickets/exchange/ExchangeTicketPage';
import CancelTicketPage from './tickets/cancel/CancelTicketPage';
import RefundManagementPage from './refund-management/RefundManagementPage';
import LoginPage from './login/LoginPage';
import ReportsPage from './reports/ReportsPage';
import UsersPage from './users/UsersPage';
import ProfilePage from './profile/ProfilePage';
import AuditLogPage from './audit-log/AuditLogPage';
import PaymentHistoryPage from './payments/history/PaymentHistoryPage';
import AiAdminPage from './ai-admin/AiAdminPage';
import PassengersPage from './passengers/PassengersPage';
import SeatMapPage from './seat-map/SeatMapPage';
import LoyaltyPage from './loyalty/LoyaltyPage';
import CheckinPage from './checkin/CheckinPage';
import GateManagementPage from './gate-management/GateManagementPage';

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
  const [globalBookings, setGlobalBookings] = useState<BookingData[]>([
    { id: 'BK-005', pnr: 'HOLD01', customer: 'Nguyễn Quốc Dũng', flight: 'QH321', airline: 'Bamboo Airways', from: 'HAN', to: 'DAD', airportFrom: 'Nội Bài', airportTo: 'Đà Nẵng', date: '10/05/2026', time: '10:00', total: '2,150,000', status: 'Chờ thanh toán', badge: 'hold', pax: 1, type: 'Một chiều', timeLimit: '2026-05-10T18:00:00', gate: '--', terminal: 'T1', seat: '12A', boarding: '09:30' },
  ]);

  const [globalFlights, setGlobalFlights] = useState([
    { id: 1, code: 'QH', name: 'Bamboo Airways', flight: 'QH321', aircraft: 'Airbus A320', dep: '10:00', arr: '11:20', from: 'HAN', to: 'DAD', dur: '1h 20m', stops: 0, price: 2150000, seatsSold: 168, cap: 180, status: 'Đang bán vé', badge: 'Chuyến bay phổ biến', carry: '7kg', checked: '20kg', gate: '--' },
    { id: 2, code: 'VN', name: 'Vietnam Airlines', flight: 'VN123', aircraft: 'Airbus A321', dep: '08:30', arr: '10:45', from: 'SGN', to: 'HAN', dur: '2h 15m', stops: 0, price: 2150000, seatsSold: 135, cap: 180, status: 'Đang bán vé', carry: '12kg', checked: '23kg', gate: 'B12' },
    { id: 3, code: 'VJ', name: 'VietJet Air', flight: 'VJ456', aircraft: 'Airbus A320', dep: '14:15', arr: '15:35', from: 'DAD', to: 'SGN', dur: '1h 20m', stops: 0, price: 1250000, seatsSold: 217, cap: 220, status: 'Đang bán vé', badge: 'Tiết kiệm nhất', carry: '7kg', checked: '0kg', gate: '--' },
    { id: 4, code: 'VN', name: 'Vietnam Airlines', flight: 'VN204', aircraft: 'Boeing 787', dep: '19:00', arr: '21:10', from: 'HAN', to: 'SGN', dur: '2h 10m', stops: 0, price: 1890000, seatsSold: 152, cap: 180, status: 'Đang bán vé', carry: '12kg', checked: '23kg', gate: '04' },
    { id: 5, code: 'QH', name: 'Bamboo Airways', flight: 'QH204', aircraft: 'Airbus A320', dep: '08:15', arr: '10:25', from: 'HAN', to: 'SGN', dur: '2h 10m', stops: 0, price: 1750000, seatsSold: 180, cap: 180, status: 'Đã đóng chuyến', carry: '7kg', checked: '20kg', gate: '--' },
  ]);

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

  const addBooking = (newBooking: BookingData) => {
    setGlobalBookings(prev => [newBooking, ...prev]);
  };

  const updateBookingStatus = (id: string, status: string, badge: any) => {
    setGlobalBookings(prev => prev.map(b => b.id === id ? { ...b, status, badge, timeLimit: status === 'Đã xuất vé' ? null : b.timeLimit } : b));
  };

  const updateBooking = (updated: BookingData) => {
    setGlobalBookings(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const updateFlightInfo = (flightCode: string, aircraft: string, gate: string) => {
    setGlobalFlights(prev => prev.map(f => f.flight === flightCode ? { ...f, aircraft, gate } : f));
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
        return <Dashboard onNavigate={setCurrentPage} bookings={globalBookings} />;
      case 'flights':
        return <FlightsPage onNavigate={setCurrentPage} onSelectFlight={setSelectedFlightData} flights={globalFlights} onUpdateFlights={setGlobalFlights} />;
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
            onDeleteBooking={(id) => setGlobalBookings(prev => prev.filter(b => b.id !== id))}
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
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} />;
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
        return <PassengersPage onNavigate={setCurrentPage} />;
      case 'seat-map':
        return <SeatMapPage onNavigate={setCurrentPage} />;
      case 'loyalty':
        return <LoyaltyPage onNavigate={setCurrentPage} />;
      case 'checkin':
        return <CheckinPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateBooking={updateBooking} />;
      case 'gate-management':
        return <GateManagementPage onNavigate={setCurrentPage} bookings={globalBookings} onUpdateStatus={updateBookingStatus} onUpdateBooking={updateBooking} onUpdateFlightInfo={updateFlightInfo} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
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
