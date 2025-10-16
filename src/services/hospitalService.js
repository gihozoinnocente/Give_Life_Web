import api from '../config/api';

const hospitalService = {
  // Get all hospitals
  getAllHospitals: async () => {
    try {
      const response = await api.get('/hospitals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Search hospitals
  searchHospitals: async (searchTerm) => {
    try {
      const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
      const response = await api.get(`/hospitals/search${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get hospital by ID
  getHospitalById: async (hospitalId) => {
    try {
      const response = await api.get(`/hospitals/${hospitalId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default hospitalService;
