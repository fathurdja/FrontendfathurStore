'use client';

import { create } from 'zustand';

const useAppStore = create((set, get) => ({
  // ====== Categories & Products ======
  categories: [],
  products: [],
  selectedCategory: null,
  selectedProduct: null,
  detectedOperator: null,
  isLoadingProducts: false,

  setCategories: (categories) => set({ categories }),
  setProducts: (products) => set({ products }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setDetectedOperator: (operator) => set({ detectedOperator: operator }),
  setIsLoadingProducts: (loading) => set({ isLoadingProducts: loading }),

  // ====== Transaction / Checkout ======
  checkoutData: null,
  currentTransaction: null,

  setCheckoutData: (data) => set({ checkoutData: data }),
  setCurrentTransaction: (transaction) => set({ currentTransaction: transaction }),

  clearCheckout: () => set({
    checkoutData: null,
    currentTransaction: null,
    selectedProduct: null,
  }),

  // ====== Auth (Optional for admin) ======
  user: null,
  authToken: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, authToken: token, isAuthenticated: true });
  },

  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
    set({ user: null, authToken: null, isAuthenticated: false });
  },

  loadAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user');
      if (token && user) {
        try {
          set({ user: JSON.parse(user), authToken: token, isAuthenticated: true });
        } catch {
          set({ user: null, authToken: null, isAuthenticated: false });
        }
      }
    }
  },

  // ====== UI State ======
  isLoading: false,
  error: null,
  successMessage: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setSuccess: (message) => set({ successMessage: message }),
  clearMessages: () => set({ error: null, successMessage: null }),
}));

export default useAppStore;
