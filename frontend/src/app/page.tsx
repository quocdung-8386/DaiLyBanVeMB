"use client";

import React, { useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import FlightsPage from './flights/FlightsPage';
import BookingPage from './booking/BookingPage';
import TicketsPage from './tickets/TicketsPage';
import PaymentsPage from './payments/PaymentsPage';
import CustomersPage from './customers/CustomersPage';
import SettingsPage from './settings/SettingsPage';
import IssueTicketPage from './tickets/issue/IssueTicketPage';
import ExchangeTicketPage from './tickets/exchange/ExchangeTicketPage';
import CancelTicketPage from './tickets/cancel/CancelTicketPage';
import RefundManagementPage from './refund-management/RefundManagementPage';
import LoginPage from './login/LoginPage';
import CreateBookingPage from './booking/create/CreateBookingPage';
import ReportsPage from './reports/ReportsPage';
import UsersPage from './users/UsersPage';
import ProfilePage from './profile/ProfilePage';
import AuditLogPage from './audit-log/AuditLogPage';
import PaymentHistoryPage from './payments/history/PaymentHistoryPage';
import AiAdminPage from './ai-admin/AiAdminPage';
import LoyaltyPage from './loyalty/LoyaltyPage';

export interface TicketData {
  id: string;
  pnr: string;
  customer: string;
  routeFrom: string;
  routeTo: string;
  airportFrom: string;
  airportTo: string;
  date: string;
  total: string;
  gate: string;
  terminal: string;
  seat: string;
  boarding: string;
  badge: string;
  status: string;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState('login');
  const [paymentView, setPaymentView] = useState<'checkout' | 'success'>('checkout');
  const [selectedTicketData, setSelectedTicketData] = useState<TicketData | null>(null);
  const [selectedFlightData, setSelectedFlightData] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleGoToCheckout = (ticket: TicketData) => {
    setSelectedTicketData(ticket);
    setPaymentView('checkout');
    setIsPaymentModalOpen(true);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'flights':
        return <FlightsPage onNavigate={setCurrentPage} onSelectFlight={setSelectedFlightData} />;
      case 'booking':
        return <BookingPage onNavigate={setCurrentPage} initialFlight={selectedFlightData} onCheckout={handleGoToCheckout} />;
      case 'create_booking':
        return <CreateBookingPage onNavigate={setCurrentPage} initialFlight={selectedFlightData} />;
      case 'tickets':
        return <TicketsPage onNavigate={setCurrentPage} onCheckout={handleGoToCheckout} />;
      case 'payments':
        return <PaymentsPage onNavigate={setCurrentPage} view={paymentView} setView={setPaymentView} ticketData={selectedTicketData} />;
      case 'customers':
        return <CustomersPage onNavigate={setCurrentPage} />;
      case 'loyalty':
        return <LoyaltyPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
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
        return <IssueTicketPage onNavigate={setCurrentPage} />;
      case 'exchange_ticket':
        return <ExchangeTicketPage onNavigate={setCurrentPage} />;
      case 'cancel_ticket':
        return <CancelTicketPage onNavigate={setCurrentPage} />;
      case 'refund-management':
        return <RefundManagementPage onNavigate={setCurrentPage} />;
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
    </div>
  );
}
