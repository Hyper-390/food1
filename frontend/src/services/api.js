import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data)
};

// Restaurants API
export const restaurantsAPI = {
  getAll: (params) => API.get('/restaurants', { params }),
  getById: (id) => API.get(`/restaurants/${id}`),
  create: (data) => API.post('/restaurants', data),
  update: (id, data) => API.put(`/restaurants/${id}`, data),
  delete: (id) => API.delete(`/restaurants/${id}`),
  search: (params) => API.get('/restaurants/search', { params })
};

// Menu API
export const menuAPI = {
  getAll: (params) => API.get('/menu', { params }),
  getById: (id) => API.get(`/menu/${id}`),
  getByRestaurant: (restaurantId) => API.get(`/menu/restaurant/${restaurantId}`),
  create: (data) => API.post('/menu', data),
  update: (id, data) => API.put(`/menu/${id}`, data),
  delete: (id) => API.delete(`/menu/${id}`)
};

// Orders API
export const ordersAPI = {
  getAll: () => API.get('/orders'),
  getById: (id) => API.get(`/orders/${id}`),
  getUserOrders: () => API.get('/orders/user'),
  getRestaurantOrders: (restaurantId) => API.get(`/orders/restaurant/${restaurantId}`),
  create: (data) => API.post('/orders', data),
  updateStatus: (id, data) => API.put(`/orders/${id}`, data)
};

// Reviews API
export const reviewsAPI = {
  getAll: () => API.get('/reviews'),
  getByRestaurant: (restaurantId) => API.get(`/reviews/restaurant/${restaurantId}`),
  getByMenuItem: (menuItemId) => API.get(`/reviews/menu-item/${menuItemId}`),
  create: (data) => API.post('/reviews', data)
};

// Admin API
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  getRestaurants: () => API.get('/admin/restaurants'),
  approveRestaurant: (id, data) => API.put(`/admin/restaurants/${id}/approve`, data),
  getOrders: () => API.get('/admin/orders'),
  updateOrderStatus: (id, data) => API.put(`/admin/orders/${id}/status`, data)
};

// Users API
export const usersAPI = {
  getAll: () => API.get('/users'),
  getById: (id) => API.get(`/users/${id}`),
  update: (id, data) => API.put(`/users/${id}`, data),
  delete: (id) => API.delete(`/users/${id}`)
};

export default API;