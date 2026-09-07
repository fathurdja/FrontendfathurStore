'use client';

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach auth token if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor — handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// ============ API Functions ============

// Products & Categories
export const getCategories = () => api.get('/categories');
export const getProducts = (params) => api.get('/products', { params });
export const detectOperator = (phoneNumber) => api.post('/products/detect-operator', { phone_number: phoneNumber });
export const inquiryPln = (customerId) => api.post('/products/inquiry-pln', { customer_id: customerId });

// Transactions
export const createTransaction = (data) => api.post('/transactions', data);
export const getTransactionStatus = (orderId) => api.get(`/transactions/${orderId}`);
export const confirmPayment = (orderId, formData) => api.post(`/transactions/${orderId}/confirm`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const sendTransactionInvoice = (orderId, data) => api.post(`/transactions/${orderId}/send-invoice`, data);
export const checkTransactionByEmail = (data) => api.post('/transactions/check', data);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = () => api.post('/auth/logout');
export const getProfile = () => api.get('/auth/profile');
export const updateProfile = (data) => api.put('/auth/profile', data);
export const updatePassword = (data) => api.put('/auth/password', data);

// Admin
export const getAdminDashboard = () => api.get('/admin/dashboard');
export const getAdminTransactions = (params) => api.get('/admin/transactions', { params });
export const processPayment = (orderId) => api.post(`/admin/transactions/${orderId}/process`);
export const rejectPayment = (orderId, data) => api.post(`/admin/transactions/${orderId}/reject`, data);
export const getRevenueReport = (params) => api.get('/admin/revenue-report', { params });

// Payment config
export const getPaymentConfig = () => api.get('/payment/config');
