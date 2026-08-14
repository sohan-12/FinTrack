import api from './api';

export const supportService = {
  async createTicket(data) {
    const response = await api.post('/support/tickets', data);
    return response.data;
  },

  async getTickets() {
    const response = await api.get('/support/tickets');
    return response.data;
  },

  async getFaqs() {
    const response = await api.get('/support/faqs');
    return response.data;
  },
};
