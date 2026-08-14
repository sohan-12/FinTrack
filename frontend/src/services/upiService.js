import api from './api';

export const upiService = {
  async payUpi(data) {
    const response = await api.post('/upi/pay', data);
    return response.data;
  },

  async syncUpi() {
    const response = await api.post('/upi/sync');
    return response.data;
  },

  async getLinkedAccounts() {
    const response = await api.get('/upi/accounts');
    return response.data;
  },

  async getUpiApps() {
    const response = await api.get('/upi/apps');
    return response.data;
  },

  async connectApp(data) {
    const response = await api.post('/upi/apps/connect', data);
    return response.data;
  },

  async disconnectApp(appId) {
    const response = await api.post('/upi/apps/disconnect', { appId });
    return response.data;
  },
};
