const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get all blood requests
 */
export const getAllRequests = async (filters = {}) => {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_URL}/api/requests?${params}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch requests');
  } catch (error) {
    console.error('Error fetching requests:', error);
    throw error;
  }
};

/**
 * Get requests for a specific hospital
 */
export const getHospitalRequests = async (hospitalId, status = null) => {
  try {
    const url = status 
      ? `${API_URL}/api/requests/hospital/${hospitalId}?status=${status}`
      : `${API_URL}/api/requests/hospital/${hospitalId}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch hospital requests');
  } catch (error) {
    console.error('Error fetching hospital requests:', error);
    throw error;
  }
};

/**
 * Get a specific request by ID
 */
export const getRequestById = async (requestId) => {
  try {
    const response = await fetch(`${API_URL}/api/requests/${requestId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch request');
  } catch (error) {
    console.error('Error fetching request:', error);
    throw error;
  }
};

/**
 * Create a new blood request
 */
export const createRequest = async (requestData) => {
  try {
    const response = await fetch(`${API_URL}/api/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.message };
  } catch (error) {
    console.error('Error creating request:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update a blood request
 */
export const updateRequest = async (requestId, updates) => {
  try {
    const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.message };
  } catch (error) {
    console.error('Error updating request:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Delete a blood request
 */
export const deleteRequest = async (requestId) => {
  try {
    const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true };
    }
    return { success: false, error: data.message };
  } catch (error) {
    console.error('Error deleting request:', error);
    return { success: false, error: error.message };
  }
};
