const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Get hospital dashboard statistics
 */
export const getHospitalStats = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/api/analytics/hospital/${hospitalId}/stats`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch stats');
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    throw error;
  }
};

/**
 * Get blood type distribution
 */
export const getBloodTypeDistribution = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/api/analytics/hospital/${hospitalId}/blood-type-distribution`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch distribution');
  } catch (error) {
    console.error('Error fetching blood type distribution:', error);
    throw error;
  }
};

/**
 * Get donation trends
 */
export const getDonationTrends = async (hospitalId, period = 30) => {
  try {
    const response = await fetch(`${API_URL}/api/analytics/hospital/${hospitalId}/donation-trends?period=${period}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch trends');
  } catch (error) {
    console.error('Error fetching donation trends:', error);
    throw error;
  }
};

/**
 * Get monthly report
 */
export const getMonthlyReport = async (hospitalId, year, month) => {
  try {
    const url = `${API_URL}/api/analytics/hospital/${hospitalId}/monthly-report?year=${year}&month=${month}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch monthly report');
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    throw error;
  }
};

/**
 * Get donor analytics
 */
export const getDonorAnalytics = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/api/analytics/hospital/${hospitalId}/donor-analytics`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch donor analytics');
  } catch (error) {
    console.error('Error fetching donor analytics:', error);
    throw error;
  }
};
