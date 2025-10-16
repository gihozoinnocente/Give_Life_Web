import { API_URL, API_ENDPOINTS, getAuthHeaders } from '../config/api';

class AuthService {
  // Login
  async login(credentials) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.LOGIN}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Store token and user data
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  }

  // Register Donor
  async registerDonor(donorData) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER_DONOR}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(donorData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Don't store token - user must login after registration
    return data.data;
  }

  // Register Hospital
  async registerHospital(hospitalData) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER_HOSPITAL}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(hospitalData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Don't store token - user must login after registration
    return data.data;
  }

  // Register Admin
  async registerAdmin(adminData) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER_ADMIN}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user data
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  }

  // Register RBC
  async registerRBC(rbcData) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER_RBC}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(rbcData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user data
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  }

  // Register Ministry
  async registerMinistry(ministryData) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.REGISTER_MINISTRY}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(ministryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    // Store token and user data
    if (data.data.token) {
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));
    }

    return data.data;
  }

  // Get User Profile
  async getProfile() {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.GET_PROFILE}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }

    return data.data;
  }

  // Update User Profile
  async updateProfile(profileData) {
    const response = await fetch(`${API_URL}${API_ENDPOINTS.UPDATE_PROFILE}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }

    // Update user in localStorage
    if (data.data) {
      const currentUser = this.getCurrentUser();
      const updatedUser = { ...currentUser, ...data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }

    return data.data;
  }

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
