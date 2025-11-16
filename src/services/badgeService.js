import api from '../config/api';

const badgeService = {
  getDonorBadges: async (donorId) => {
    const res = await api.get(`/donors/${donorId}/badges`);
    return res.data?.data || { earned: [], inProgress: [] };
  },
};

export default badgeService;
