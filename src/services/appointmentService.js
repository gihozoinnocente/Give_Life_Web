/**
 * Appointment Service
 * Handles all API calls related to appointments
 */

// Fallback to production API URL if VITE_API_URL is not set
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://givelifeapi.up.railway.app';
const API_URL = `${API_BASE_URL}/api/appointments`;

/**
 * Get all hospitals where donors can schedule appointments
 */
export const getAllHospitals = async () => {
  try {
    const response = await fetch(`${API_URL}/hospitals`);
    const data = await response.json();
    
    if (data.status === 'success') {
      // Transform to match UI format
      return data.data.map(hospital => ({
        id: hospital.id,
        name: hospital.hospital_name,
        address: hospital.address,
        phone: hospital.phone_number,
        headOfHospital: hospital.head_of_hospital
      }));
    }
    throw new Error(data.message || 'Failed to fetch hospitals');
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    throw error;
  }
};

/**
 * Get available time slots for a hospital on a specific date
 * @param {string} hospitalId - Hospital UUID
 * @param {string} date - Date in YYYY-MM-DD format
 */
export const getAvailableSlots = async (hospitalId, date) => {
  try {
    const response = await fetch(`${API_URL}/hospital/${hospitalId}/available-slots?date=${date}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch available slots');
  } catch (error) {
    console.error('Error fetching available slots:', error);
    throw error;
  }
};

/**
 * Book a new appointment
 * @param {Object} appointmentData - Appointment details
 */
export const bookAppointment = async (appointmentData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    
    const data = await response.json();
    
    if (response.status === 201) {
      return { success: true, data: data.data };
    } else if (response.status === 409) {
      return { success: false, error: data.message, code: 409 };
    } else if (response.status === 400) {
      return { success: false, error: data.message, code: 400 };
    } else {
      throw new Error(data.message || 'Failed to book appointment');
    }
  } catch (error) {
    console.error('Error booking appointment:', error);
    throw error;
  }
};

/**
 * Get all appointments for a donor
 * @param {string} donorId - Donor UUID
 * @param {string} status - Optional status filter (pending, confirmed, completed, cancelled)
 */
export const getDonorAppointments = async (donorId, status = null) => {
  try {
    let url = `${API_URL}/donor/${donorId}`;
    if (status && status !== 'all') {
      url += `?status=${status}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch appointments');
  } catch (error) {
    console.error('Error fetching donor appointments:', error);
    throw error;
  }
};

/**
 * Get all appointments for a hospital
 * @param {string} hospitalId - Hospital UUID
 * @param {string} date - Optional date filter (YYYY-MM-DD)
 * @param {string} status - Optional status filter
 */
export const getHospitalAppointments = async (hospitalId, date = null, status = null) => {
  try {
    let url = `${API_URL}/hospital/${hospitalId}`;
    const params = [];
    
    if (date) params.push(`date=${date}`);
    if (status && status !== 'all') params.push(`status=${status}`);
    
    if (params.length > 0) {
      url += `?${params.join('&')}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch appointments');
  } catch (error) {
    console.error('Error fetching hospital appointments:', error);
    throw error;
  }
};

/**
 * Get appointment by ID
 * @param {string} appointmentId - Appointment UUID
 */
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/${appointmentId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch appointment');
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
};

/**
 * Update appointment
 * @param {string} appointmentId - Appointment UUID
 * @param {Object} updates - Fields to update
 */
export const updateAppointment = async (appointmentId, updates) => {
  try {
    const response = await fetch(`${API_URL}/${appointmentId}`, {
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
    throw new Error(data.message || 'Failed to update appointment');
  } catch (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
};

/**
 * Cancel appointment
 * @param {string} appointmentId - Appointment UUID
 */
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await fetch(`${API_URL}/${appointmentId}/cancel`, {
      method: 'PATCH',
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true, data: data.data };
    }
    throw new Error(data.message || 'Failed to cancel appointment');
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    throw error;
  }
};

export default {
  getAllHospitals,
  getAvailableSlots,
  bookAppointment,
  getDonorAppointments,
  getHospitalAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
};
