import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authAPI } from '../services/api';
import { showError } from '../utils/toast';
import { isTokenExpired } from '../utils/jwt';
import { TOAST_MESSAGES, AUTH_ERROR_MESSAGES } from '../constants/messages';
import { STORAGE_KEYS } from '../constants/storage';

const persistSession = (token, user) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

const extractApiError = (err, fallback) => err.response?.data?.error ?? fallback;

/**
 * Reads and validates the stored session once. Returns the resolved auth state and whether
 * the session was expired (so callers can show a notification without triggering re-renders).
 * Clears storage when an expired session is found.
 */
const resolveStoredSession = () => {
  const savedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
  const savedUser = localStorage.getItem(STORAGE_KEYS.USER);

  if (!savedToken || !savedUser) return { token: null, user: null, sessionExpired: false };

  if (isTokenExpired(savedToken)) {
    clearSession();
    return { token: null, user: null, sessionExpired: true };
  }

  return { token: savedToken, user: JSON.parse(savedUser), sessionExpired: false };
};

export function AuthProvider({ children }) {
  // Resolve storage once — lazy initializer runs only on the first render
  const [{ token: initialToken, user: initialUser, sessionExpired }] = useState(resolveStoredSession);
  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    if (sessionExpired) {
      showError(TOAST_MESSAGES.SESSION_EXPIRED);
    }
  }, [sessionExpired]);

  useEffect(() => {
    const handleAutoLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('autoLogout', handleAutoLogout);
    return () => window.removeEventListener('autoLogout', handleAutoLogout);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      const { data } = await authAPI.login(username, password);
      const { token: newToken, username: userName, email } = data;
      const newUser = { username: userName, email };

      setToken(newToken);
      setUser(newUser);
      persistSession(newToken, newUser);

      return { success: true };
    } catch (err) {
      const status = err.response?.status;
      const error =
        status === 401
          ? extractApiError(err, AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS)
          : extractApiError(err, AUTH_ERROR_MESSAGES.LOGIN_FAILED);

      return { success: false, error };
    }
  }, []);

  const register = useCallback(async (username, email, password) => {
    try {
      const { data } = await authAPI.register(username, email, password);
      const { token: newToken, username: userName, email: userEmail } = data;
      const newUser = { username: userName, email: userEmail };

      setToken(newToken);
      setUser(newUser);
      persistSession(newToken, newUser);

      return { success: true };
    } catch (err) {
      const status = err.response?.status;
      const fallback =
        status === 409
          ? AUTH_ERROR_MESSAGES.USERNAME_OR_EMAIL_TAKEN
          : status === 400
            ? AUTH_ERROR_MESSAGES.INVALID_REGISTRATION
            : AUTH_ERROR_MESSAGES.REGISTRATION_FAILED;

      return { success: false, error: extractApiError(err, fallback) };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearSession();
  }, []);

  const value = { user, token, login, register, logout, isAuthenticated: !!token };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
