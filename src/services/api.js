import axios from 'axios';
import { showError } from '../utils/toast';
import { TOAST_MESSAGES } from '../constants/messages';
import { STORAGE_KEYS } from '../constants/storage';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AUTH_ROUTES = ['/auth/login', '/auth/register'];

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? '';
    const isAuthRoute = AUTH_ROUTES.some((route) => requestUrl.includes(route));

    if (error.response?.status === 401 && !isAuthRoute) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      showError(TOAST_MESSAGES.SESSION_EXPIRED);
      window.dispatchEvent(new Event('autoLogout'));
      setTimeout(() => window.location.replace('/login'), 3000);
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),

  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

export const todoAPI = {
  getAll: () => api.get('/todos'),
  getById: (id) => api.get(`/todos/${id}`),
  create: (todo) => api.post('/todos', todo),
  update: (id, todo) => api.put(`/todos/${id}`, todo),
  delete: (id) => api.delete(`/todos/${id}`),
};

export default api;
