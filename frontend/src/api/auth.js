import axios from 'axios';

// Production API URL - MUST match your Vercel backend URL
const API_BASE_URL = 'https://smart-waste-management-eob6.vercel.app';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (email, password) => 
  api.post('/api/auth/login', { email, password });

export const signup = (userData) => 
  api.post('/api/auth/signup', userData);

export const forgotPassword = (email) => 
  api.post('/api/auth/forgot-password', { email });

// Transaction endpoints
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
