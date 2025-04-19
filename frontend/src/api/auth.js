import axios from 'axios';

// Environment Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000' 
    : 'https://smart-waste-management-eob6.vercel.app');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request Interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(response => response, error => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

// Auth Endpoints
export const login = (email, password) => 
  api.post('/api/auth/login', { email, password });

export const signup = (userData) => 
  api.post('/api/auth/signup', userData);

export const forgotPassword = (email) => 
  api.post('/api/auth/forgot-password', { email });

// Transaction Endpoints
export const createTransaction = (transactionData) => 
  api.post('/api/transactions', transactionData);

export const getSellerTransactions = (sellerId) => 
  api.get(`/api/transactions/seller/${sellerId}`);

export const getBuyerTransactions = (buyerId) => 
  api.get(`/api/transactions/buyer/${buyerId}`);

export const updateTransactionStatus = (transactionId, status) => 
  api.patch(`/api/transactions/${transactionId}/status`, { status });

export const deleteTransaction = (transactionId) => 
  api.delete(`/api/transactions/${transactionId}`);

// Health Check
export const checkHealth = () => api.get('/api/health');
