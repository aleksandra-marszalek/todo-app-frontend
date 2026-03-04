import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),
  
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

// Todo API calls
export const todoAPI = {
  getAll: () => api.get('/todos'),
  
  getById: (id) => api.get(`/todos/${id}`),
  
  create: (todo) => api.post('/todos', todo),
  
  update: (id, todo) => api.put(`/todos/${id}`, todo),
  
  delete: (id) => api.delete(`/todos/${id}`),
};

export default api;