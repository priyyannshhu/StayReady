import { API_BASE_URL } from '../config/api';

export const apiService = {
  // Properties
  async getProperties() {
    const response = await fetch(`${API_BASE_URL}/properties/demo`);
    if (!response.ok) throw new Error('Failed to fetch properties');
    return response.json();
  },

  async getPropertyById(id: string) {
    const response = await fetch(`${API_BASE_URL}/properties/${id}`);
    if (!response.ok) throw new Error('Failed to fetch property');
    return response.json();
  },

  // Bookings
  async createBooking(bookingData: any) {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  },

  async getBookingByBookingId(bookingId: string) {
    const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
    if (!response.ok) throw new Error('Failed to fetch booking');
    return response.json();
  },

  // Users
  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) throw new Error('Failed to create user');
    return response.json();
  },

  // ML Prediction
  async predictPrice(predictionData: any) {
    const response = await fetch(`${API_BASE_URL}/predict-price`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(predictionData)
    });
    if (!response.ok) throw new Error('Failed to get prediction');
    return response.json();
  },

  // Health Check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) throw new Error('Health check failed');
    return response.json();
  }
};
