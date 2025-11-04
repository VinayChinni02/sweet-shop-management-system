import axios from 'axios';

// Use proxy in development, or env variable if set
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors and network issues
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error: Unable to connect to server. Please check if the backend is running.'));
    }

    // Handle auth errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number; // Legacy field
  pricePerKilo?: number; // Price per kilogram
  quantity: number; // Quantity in stock (in kg)
  created_at?: string;
  updated_at?: string;
  purchaseQuantity?: number; // Used in purchase response
  purchasePrice?: number; // Used in purchase response
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SearchFilters {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Auth API
export const authAPI = {
  register: async (email: string, password: string, name?: string, phone?: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/register', { email, password, name, phone });
    return response.data;
  },
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Sweets API
export const sweetsAPI = {
  getAll: async (): Promise<Sweet[]> => {
    const response = await api.get('/sweets');
    return response.data;
  },
  search: async (filters: SearchFilters): Promise<Sweet[]> => {
    const response = await api.get('/sweets/search', { params: filters });
    return response.data;
  },
  create: async (sweet: Omit<Sweet, 'id' | 'created_at' | 'updated_at'>): Promise<Sweet> => {
    const response = await api.post('/sweets', sweet);
    return response.data;
  },
  update: async (id: number, updates: Partial<Sweet>): Promise<Sweet> => {
    const response = await api.put(`/sweets/${id}`, updates);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await api.delete(`/sweets/${id}`);
  },
  purchase: async (id: number, quantity: number = 0.25): Promise<Sweet> => {
    // quantity: 0.25 (250g), 0.5 (500g), or 1.0 (1kg)
    const response = await api.post(`/sweets/${id}/purchase`, { quantity });
    return response.data;
  },
  restock: async (id: number, quantity: number): Promise<Sweet> => {
    const response = await api.post(`/sweets/${id}/restock`, { quantity });
    return response.data;
  },
};

export interface Order {
  id: number;
  user_id: number;
  sweet_id: number;
  quantity: number;
  price_per_kg: number;
  total_price: number;
  created_at: string;
  user_email: string;
  user_name?: string;
  user_phone?: string;
  sweet_name: string;
  sweet_category: string;
}

// Orders API (Admin only)
export const ordersAPI = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
  },
};

export default api;

