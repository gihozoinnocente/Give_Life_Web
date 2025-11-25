import axios from 'axios';

// Base API URL - fallback to production API URL if VITE_API_URL is not set
const API_URL = `${import.meta.env.VITE_API_URL || 'https://givelifeapi.up.railway.app'}/api`;

/**
 * Hospital Dashboard Service
 * Handles all API calls for the hospital dashboard
 */

// Get dashboard statistics
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospital/stats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get blood inventory data
export const getBloodInventory = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospital/inventory`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blood inventory:', error);
    throw error;
  }
};

// Get request trends data
export const getRequestTrends = async (months = 6) => {
  try {
    const response = await axios.get(`${API_URL}/hospital/requests/trends`, {
      params: { months },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching request trends:', error);
    throw error;
  }
};

// Get recent blood requests
export const getRecentRequests = async (limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/hospital/requests/recent`, {
      params: { limit },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recent requests:', error);
    throw error;
  }
};

// Get all blood requests with filters
export const getBloodRequests = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/hospital/requests`, {
      params: filters,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching blood requests:', error);
    throw error;
  }
};

// Create a new blood request
export const createBloodRequest = async (requestData) => {
  try {
    const response = await axios.post(`${API_URL}/hospital/requests`, requestData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating blood request:', error);
    throw error;
  }
};

// Update blood request status
export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/hospital/requests/${requestId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating request status:', error);
    throw error;
  }
};

// Get hospital notifications
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/hospital/notifications`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationRead = async (notificationId) => {
  try {
    const response = await axios.patch(
      `${API_URL}/hospital/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Get available donors by blood type
export const getAvailableDonors = async (bloodType) => {
  try {
    const response = await axios.get(`${API_URL}/donors`, {
      params: { bloodType, available: true },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching available donors:', error);
    throw error;
  }
};

// Export all services as default
export default {
  getDashboardStats,
  getBloodInventory,
  getRequestTrends,
  getRecentRequests,
  getBloodRequests,
  createBloodRequest,
  updateRequestStatus,
  getNotifications,
  markNotificationRead,
  getAvailableDonors,
};
