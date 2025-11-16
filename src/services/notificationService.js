import api from '../config/api';

const notificationService = {
  // Send blood request notification to all users
  sendBloodRequest: async (requestData) => {
    try {
      const response = await api.post('/notifications/blood-request', requestData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all notifications for a user
  getUserNotifications: async (userId) => {
    try {
      const response = await api.get(`/notifications/user/${userId}`);
      // Return the data array directly
      return response.data.data || [];
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data.data || { id: notificationId };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get unread notification count
  getUnreadCount: async (userId) => {
    try {
      const response = await api.get(`/notifications/user/${userId}/unread-count`);
      return response.data.data || { count: 0 };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default notificationService;
