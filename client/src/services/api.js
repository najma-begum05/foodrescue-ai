import axios from 'axios';

// Base Axios instance pointing to backend REST API
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to automatically attach JWT Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('foodrescue_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 unauthorized errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear local storage
      if (localStorage.getItem('foodrescue_token')) {
        localStorage.removeItem('foodrescue_token');
        localStorage.removeItem('foodrescue_user');
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints API Wrappers
export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  updateProfile: async (profileData) => {
    const res = await api.put('/auth/profile', profileData);
    return res.data;
  },
  forgotPassword: async (email) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },
  getAllUsers: async () => {
    const res = await api.get('/auth/users');
    return res.data;
  },
  verifyUser: async (id, status) => {
    const res = await api.put(`/auth/verify-user/${id}`, { status });
    return res.data;
  }
};

export default api;
