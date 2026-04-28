"use client";

import React, { useState } from 'react';
import Dashboard from './dashboard/Dashboard';
import FlightsPage from './flights/FlightsPage';
import BookingPage from './booking/BookingPage';
import TicketsPage from './tickets/TicketsPage';
import PaymentsPage from './payments/PaymentsPage';
import CustomersPage from './customers/CustomersPage';
import SettingsPage from './settings/SettingsPage';

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
  const [currentPage, setCurrentPage] = useState('settings');
  const [paymentView, setPaymentView] = useState<'history' | 'checkout' | 'success'>('history');
  const [selectedTicketData, setSelectedTicketData] = useState<TicketData | null>(null);

  const handleGoToCheckout = (ticket: TicketData) => {
    setSelectedTicketData(ticket);
    setPaymentView('checkout');
    setCurrentPage('payments');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'flights':
        return <FlightsPage onNavigate={setCurrentPage} />;
      case 'booking':
        return <BookingPage onNavigate={setCurrentPage} />;
      case 'tickets':
        return <TicketsPage onNavigate={setCurrentPage} onCheckout={handleGoToCheckout} />;
      case 'payments':
        return <PaymentsPage onNavigate={setCurrentPage} view={paymentView} setView={setPaymentView} ticketData={selectedTicketData} />;
      case 'customers':
        return <CustomersPage onNavigate={setCurrentPage} />;
      case 'settings':
        return <SettingsPage onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}
