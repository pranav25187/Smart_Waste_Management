import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const login = async (email, password) => {
  return await axios.post(`${API_URL}/login`, { email, password });
};

export const signup = async (userData) => {
  return await axios.post(`${API_URL}/signup`, userData);
};

export const forgotPassword = async (email) => {
  return await axios.post(`${API_URL}/forgot-password`, { email });
};
export const createTransaction = async (transactionData) => {
  return await axios.post('http://localhost:5000/api/transactions', transactionData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const getSellerTransactions = async (sellerId) => {
  return await axios.get(`http://localhost:5000/api/transactions/seller/${sellerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const getBuyerTransactions = async (buyerId) => {
  return await axios.get(`http://localhost:5000/api/transactions/buyer/${buyerId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};

export const updateTransactionStatus = async (transactionId, status) => {
  return await axios.patch(
    `http://localhost:5000/api/transactions/${transactionId}/status`,
    { status },
    { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
  );
};

export const deleteTransaction = async (transactionId) => {
  return await axios.delete(`http://localhost:5000/api/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
};