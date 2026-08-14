import api from './api';

export const aiService = {
  async chat(message) {
    const response = await api.post('/ai/chat', { message });
    return response.data;
  },

  async getInsights() {
    const response = await api.get('/ai/insights');
    return response.data;
  },
};

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async createCategory(name) {
    const response = await api.post('/categories', { name });
    return response.data;
  },
};

export const adminService = {
  async getStats() {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/admin/users');
    return response.data;
  },

  async getUserPortfolio(userId) {
    const response = await api.get(`/admin/users/${userId}/portfolio`);
    return response.data;
  },

  async getTransactions(page = 0, size = 20) {
    const response = await api.get('/admin/transactions', { params: { page, size } });
    return response.data;
  },
};
