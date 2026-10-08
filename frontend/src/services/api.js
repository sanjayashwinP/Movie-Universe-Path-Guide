import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use(
  (config) => {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('cineverse_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof localStorage !== 'undefined') {
      localStorage.removeItem('cineverse_token');
      localStorage.removeItem('cineverse_user');
    }
    return Promise.reject(error);
  }
);

// Domain API Helpers
export const authApi = {
  login: (usernameOrEmail, password) => api.post('/auth/login', { usernameOrEmail, password }),
  register: (username, email, password, displayName) => api.post('/auth/register', { username, email, password, displayName }),
  getCurrentUser: () => api.get('/auth/me')
};

export const contentApi = {
  getAll: (params = {}) => api.get('/content', { params: { size: 200, ...params } }),
  getById: (id) => api.get(`/content/${id}`),
  getByIdOrSlug: (idOrSlug) => api.get(`/content/${idOrSlug}`),
  getUpcoming: () => api.get('/content/upcoming'),
  search: (query) => api.get('/content/search', { params: { q: query, size: 50 } }),
  getRoadmap: (slugOrId) => api.get(`/content/${slugOrId}/roadmap`),
  queryRoadmap: (params = {}) => api.get('/content/roadmap', { params })
};

export const watchOrderApi = {
  getRelease: (params = { size: 200 }) => api.get('/watch-orders/release', { params }),
  getChronological: (params = { size: 200 }) => api.get('/watch-orders/chronological', { params }),
  getTimeline: (params = { size: 200 }) => api.get('/watch-orders/timeline', { params }),
  getMainTimeline: (params = { size: 200 }) => api.get('/watch-orders/main-timeline', { params }),
  getSaga: () => api.get('/watch-orders/saga'),
  getCustom: (params = {}) => api.get('/watch-orders/custom', { params })
};

export const franchiseApi = {
  getAll: () => api.get('/franchises'),
  getById: (id) => api.get(`/franchises/${id}`),
  getUniverses: (franchiseId) => api.get('/universes', { params: franchiseId ? { franchiseId } : {} }),
  getTimelines: (universeId) => api.get('/timelines', { params: universeId ? { universeId } : {} }),
  getSagas: (universeId) => api.get('/sagas', { params: universeId ? { universeId } : {} }),
  getPhases: (sagaId) => api.get('/phases', { params: sagaId ? { sagaId } : {} })
};

export const userTrackingApi = {
  getWatchlist: (status) => api.get('/user/watchlist', { params: status ? { status } : {} }),
  updateWatchlist: (contentId, data) => api.post(`/user/watchlist/${contentId}`, data),
  removeFromWatchlist: (contentId) => api.delete(`/user/watchlist/${contentId}`),
  toggleWatch: (contentId) => api.post(`/user/watch/${contentId}`),
  getProgress: () => api.get('/user/progress'),
  getHistory: () => api.get('/user/history'),
  toggleEpisode: (episodeId) => api.post(`/user/episodes/${episodeId}/toggle`)
};

export const recommendationApi = {
  getNext: () => api.get('/user/recommendations'),
  getRelated: (contentId) => api.get(`/user/recommendations`)
};

export const statsApi = {
  getStats: () => api.get('/stats/overview'),
  getOverview: () => api.get('/stats/overview'),
  getAdminDashboard: () => api.get('/admin/dashboard')
};

export const adminApi = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  createContent: (data) => api.post('/admin/content', data),
  updateContent: (id, data) => api.put(`/admin/content/${id}`, data),
  deleteContent: (id) => api.delete(`/admin/content/${id}`),
  getPendingChanges: () => api.get('/admin/sync/pending'),
  approveChange: (id) => api.post(`/admin/sync/approve/${id}`),
  rejectChange: (id) => api.post(`/admin/sync/reject/${id}`),
  triggerSync: () => api.post('/admin/sync/trigger'),
  getAuditLogs: (params = {}) => api.get('/admin/audit-logs', { params })
};

export default api;
