import axios from 'axios';
import { API_BASE_URL } from '../config';

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for token
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  return await authApi.post('/login', { email, password });
};

export const signup = async (userData) => {
  return await authApi.post('/signup', userData);
};

export const forgotPassword = async (email) => {
  return await authApi.post('/forgot-password', { email });
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
