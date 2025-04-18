import axios from 'axios';

// Environment-aware base URL configuration
const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-vercel-backend-app.vercel.app/api'
  : 'http://localhost:5000/api';

const API_URL = `${BASE_URL}/auth`;

// Configure axios instance with default headers
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const login = async (email, password) => {
  return await api.post(`${API_URL}/login`, { email, password });
};

export const signup = async (userData) => {
  return await api.post(`${API_URL}/signup`, userData);
};

export const forgotPassword = async (email) => {
  return await api.post(`${API_URL}/forgot-password`, { email });
};

// Transaction endpoints
export const createTransaction = async (transactionData) => {
  return await api.post('/transactions', transactionData);
};

export const getSellerTransactions = async (sellerId) => {
  return await api.get(`/transactions/seller/${sellerId}`);
};

export const getBuyerTransactions = async (buyerId) => {
  return await api.get(`/transactions/buyer/${buyerId}`);
};

export const updateTransactionStatus = async (transactionId, status) => {
  return await api.patch(`/transactions/${transactionId}/status`, { status });
};

export const deleteTransaction = async (transactionId) => {
  return await api.delete(`/transactions/${transactionId}`);
};
