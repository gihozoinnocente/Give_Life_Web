import axios from 'axios';

// API Configuration
// Fallback to production API URL if VITE_API_URL is not set
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://givelifeapi.up.railway.app';

export const API_URL = `${API_BASE_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER_DONOR: '/auth/register/donor',
  REGISTER_HOSPITAL: '/auth/register/hospital',
  REGISTER_ADMIN: '/auth/register/admin',
  REGISTER_RBC: '/auth/register/rbc',
  REGISTER_MINISTRY: '/auth/register/ministry',
  GET_PROFILE: '/auth/profile',
  UPDATE_PROFILE: '/auth/profile',
  
  // Donor endpoints
  GET_ALL_DONORS: '/donors',
  GET_DONOR_BY_ID: (id) => `/donors/${id}`,
  SEARCH_DONORS: '/donors/search',
  GET_DONORS_BY_BLOOD_GROUP: (bloodGroup) => `/donors/blood-group/${bloodGroup}`,
  
  // Hospital endpoints
  GET_ALL_HOSPITALS: '/hospitals',
  GET_HOSPITAL_BY_ID: (id) => `/hospitals/${id}`,
  SEARCH_HOSPITALS: '/hospitals/search',
  
  // Admin endpoints
  ADMIN_LIST_HOSPITALS: '/admin/hospitals',
  ADMIN_CREATE_HOSPITAL: '/admin/hospitals',
  
  // Notification endpoints
  CREATE_BLOOD_REQUEST: '/notifications/blood-request',
  GET_USER_NOTIFICATIONS: (userId) => `/notifications/user/${userId}`,
  MARK_NOTIFICATION_READ: (id) => `/notifications/${id}/read`,
  GET_UNREAD_COUNT: (userId) => `/notifications/user/${userId}/unread-count`,
  DELETE_NOTIFICATION: (id) => `/notifications/${id}`,
  GET_ACTIVE_BLOOD_REQUESTS: '/notifications/blood-requests/active',
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export default api;
