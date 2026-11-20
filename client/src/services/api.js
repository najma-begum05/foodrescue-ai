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

// Food Listings API Wrappers (Module 3)
export const listingService = {
  getAllListings: async (params = {}) => {
    const res = await api.get('/listings', { params });
    return res.data;
  },
  getMyListings: async () => {
    const res = await api.get('/listings/my/all');
    return res.data;
  },
  getListingById: async (id) => {
    const res = await api.get(`/listings/${id}`);
    return res.data;
  },
  createListing: async (listingData) => {
    const res = await api.post('/listings', listingData);
    return res.data;
  },
  updateListing: async (id, updates) => {
    const res = await api.put(`/listings/${id}`, updates);
    return res.data;
  },
  deleteListing: async (id) => {
    const res = await api.delete(`/listings/${id}`);
    return res.data;
  },
  updateStatus: async (id, status) => {
    const res = await api.patch(`/listings/${id}/status`, { status });
    return res.data;
  }
};

// Donation Requests API Wrappers (Module 5)
export const requestService = {
  createRequest: async (requestData) => {
    const res = await api.post('/requests', requestData);
    return res.data;
  },
  getIncomingRequests: async () => {
    const res = await api.get('/requests/incoming');
    return res.data;
  },
  getOutgoingRequests: async () => {
    const res = await api.get('/requests/outgoing');
    return res.data;
  },
  respondToRequest: async (id, action, pickupSchedule = '', rejectionReason = '') => {
    const res = await api.patch(`/requests/${id}/respond`, { action, pickupSchedule, rejectionReason });
    return res.data;
  },
  confirmReceipt: async (id) => {
    const res = await api.patch(`/requests/${id}/confirm`);
    return res.data;
  },
  cancelRequest: async (id) => {
    const res = await api.delete(`/requests/${id}/cancel`);
    return res.data;
  }
};

export default api;
