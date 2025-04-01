import axios from 'axios';

import apiClient from './api';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export const authService = {
  // Log in user
  login: async (email, password) => {
    // Get CSRF cookie from Laravel first (required for Sanctum)
    await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, { withCredentials: true });
    // This is crucial for storing cookies

    const response = await apiClient.post(
      '/login',
      { email, password }
    );

    // If successful, store user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;

  },

  // Register new user
  register: async (userData) => {
    // Get CSRF cookie first
    await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, { withCredentials: true });

    // Then register the user
    const response = await apiClient.post(
      `/register`,
      userData,
      { withCredentials: true }
    );

    // If successful, store user in localStorage
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  },

  // Log out user
  logout: async () => {
    try {
      // Call the Laravel logout endpoint
      await apiClient.post('/logout', {}, { withCredentials: true });
    } catch (error) {
      console.log('Logout error:', error);
    }

    // Always clear localStorage, even if the API call fails
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') {
      return false;
    }

    const user = localStorage.getItem('user');
    return !!user;
  },

  // Get current user info
  getCurrentUser: () => {
    if (typeof window === 'undefined') {
      return null;
    }

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Get user profile from API (with fresh data)
  getUserProfile: async () => {
    const response = await apiClient.get('/user', { withCredentials: true });
    return response.data;
  },

  // Update stored user data (e.g., after profile update)
  updateStoredUserData: (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
  }
};

export default authService;