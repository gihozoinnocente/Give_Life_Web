import api from '../config/api';

const communityService = {
  createPost: async ({ authorId, content, type = 'story', image = null }) => {
    const res = await api.post('/community/posts', { authorId, content, type, image });
    return res.data?.data;
  },
  getPosts: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/community/posts${query ? `?${query}` : ''}`);
    return res.data?.data || [];
  },
  getEvents: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/community/events${query ? `?${query}` : ''}`);
    return res.data?.data || [];
  },
  getLeaderboard: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/community/leaderboard${query ? `?${query}` : ''}`);
    return res.data?.data || [];
  }
};

export default communityService;
