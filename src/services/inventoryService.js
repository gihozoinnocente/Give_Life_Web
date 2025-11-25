// Fallback to production API URL if VITE_API_URL is not set
const API_URL = import.meta.env.VITE_API_URL || 'https://givelifeapi.up.railway.app';

/**
 * Get hospital blood inventory
 */
export const getHospitalInventory = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/api/inventory/hospital/${hospitalId}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch inventory');
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

/**
 * Get inventory statistics
 */
export const getInventoryStats = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/api/inventory/hospital/${hospitalId}/stats`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return data.data;
    }
    throw new Error(data.message || 'Failed to fetch inventory stats');
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    throw error;
  }
};

/**
 * Update inventory
 */
export const updateInventory = async (hospitalId, updateData) => {
  try {
    const response = await fetch(`${API_URL}/api/inventory/hospital/${hospitalId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.message };
  } catch (error) {
    console.error('Error updating inventory:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Initialize inventory for a hospital
 */
export const initializeInventory = async (hospitalId) => {
  try {
    const response = await fetch(`${API_URL}/api/inventory/hospital/${hospitalId}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      return { success: true, data: data.data };
    }
    return { success: false, error: data.message };
  } catch (error) {
    console.error('Error initializing inventory:', error);
    return { success: false, error: error.message };
  }
};
