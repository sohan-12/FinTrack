import api from './api';

export const authService = {
  async sendOtp(email) {
    const response = await api.post('/auth/send-otp', { email });
    return response.data;
  },

  async register(name, email, password, confirmPassword, otp) {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      confirmPassword,
      otp,
    });
    return response.data;
  },

  async login(email, password) {
    const response = await api.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async googleLogin(googleData) {
    const response = await api.post('/auth/google', googleData);
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
