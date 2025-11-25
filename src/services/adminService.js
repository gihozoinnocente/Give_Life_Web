import api, { API_ENDPOINTS } from '../config/api';

class AdminService {
  async listHospitals() {
    const res = await api.get(API_ENDPOINTS.ADMIN_LIST_HOSPITALS);
    return res.data.data;
  }

  async createHospital(payload) {
    const res = await api.post(API_ENDPOINTS.ADMIN_CREATE_HOSPITAL, payload);
    return res.data.data;
  }

  async resetUserPassword(email, newPassword, confirmPassword) {
    const res = await api.post(API_ENDPOINTS.ADMIN_RESET_PASSWORD, {
      email,
      newPassword,
      confirmPassword,
    });
    return res.data;
  }
}

export default new AdminService();
