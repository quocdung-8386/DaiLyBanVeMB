const BASE_URL = 'http://localhost:8000/api/v1';

export const api = {
  // Flights
  getFlights: async () => {
    const res = await fetch(`${BASE_URL}/flights`);
    return res.json();
  },
  updateFlight: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/flights/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Bookings
  getBookings: async () => {
    const res = await fetch(`${BASE_URL}/bookings`);
    return res.json();
  },
  createBooking: async (data: any) => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateBooking: async (id: string, data: any) => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Dashboard
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/dashboard/stats`);
    return res.json();
  },

  // Users/Finance
  getCustomers: async () => {
    const res = await fetch(`${BASE_URL}/users/customers`);
    return res.json();
  },
  getStaff: async () => {
    const res = await fetch(`${BASE_URL}/users/staff`);
    return res.json();
  },
  getPayments: async () => {
    const res = await fetch(`${BASE_URL}/finance/payments`);
    return res.json();
  }
};
