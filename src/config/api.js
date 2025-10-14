// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const API_URL = `${API_BASE_URL}/api`;

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
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};
