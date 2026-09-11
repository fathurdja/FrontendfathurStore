'use client';

import axios from 'axios';

const getApiBaseUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL;

  // Jika di production atau URL tidak ada, atau mengandung localhost di production
  if (process.env.NODE_ENV === 'production') {
    if (!url || url.includes('localhost') || url.includes('127.0.0.1')) {
      url = 'https://api.ftr-lab.web.id/api';
    }
  } else {
    if (!url) {
      url = 'http://localhost:8000/api';
    }
  }

  // Jika dijalankan di browser dan domain bukan localhost/127.0.0.1, jangan pernah panggil localhost
  if (typeof window !== 'undefined') {
    const isBrowserLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isBrowserLocal && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      url = 'https://api.ftr-lab.web.id/api';
    }
  }

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');
  // Ensure /api suffix
  if (!url.endsWith('/api')) {
    url += '/api';
  }
  return url;
};

export const API_BASE_URL = getApiBaseUrl();
export const STORAGE_BASE_URL = API_BASE_URL.replace(/\/api$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach auth token if available & protect against localhost in production
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (!isLocal && config.baseURL && (config.baseURL.includes('localhost') || config.baseURL.includes('127.0.0.1'))) {
      config.baseURL = 'https://api.ftr-lab.web.id/api';
    }

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
