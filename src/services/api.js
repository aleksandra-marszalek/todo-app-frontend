import axios from 'axios';
import toast from 'react-hot-toast';
import { TOAST_MESSAGES } from '../constants/messages';

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

// Response interceptor - handle 401 errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || '';

            if (!requestUrl.includes('/auth/login') && !requestUrl.includes('/auth/register')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');

                toast.error(
                    TOAST_MESSAGES.SESSION_EXPIRED.message,
                    TOAST_MESSAGES.SESSION_EXPIRED.options
                );

                window.dispatchEvent(new Event('autoLogout'));

                // Redirect after 3 seconds (user has time to read)
                setTimeout(() => {
                    window.location.replace('/login');
                }, 3000);
            }
        }

        return Promise.reject(error);
    }
);

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