import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { isTokenExpired } from '../utils/jwt';
import { TOAST_MESSAGES } from '../constants/messages';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      if (isTokenExpired(savedToken)) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.error(
          TOAST_MESSAGES.SESSION_EXPIRED.message,
          TOAST_MESSAGES.SESSION_EXPIRED.options
        );
      } else {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    }

    setLoading(false);
  }, []);

  // Listen for auto logout from interceptor
  useEffect(() => {
    const handleAutoLogout = () => {
      setToken(null);
      setUser(null);
    };

    window.addEventListener('autoLogout', handleAutoLogout);

    return () => {
      window.removeEventListener('autoLogout', handleAutoLogout);
    };
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      const { token, username: userName, email } = response.data;

      setToken(token);
      setUser({ username: userName, email });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username: userName, email }));

      return { success: true };
    } catch (err) {
      if (err.response?.status === 401) {
        return {
          success: false,
          error: err.response.data.error || 'Invalid username or password'
        };
      } else if (err.response?.data?.error) {
        return {
          success: false,
          error: err.response.data.error
        };
      } else {
        return {
          success: false,
          error: 'Login failed. Please check your connection.'
        };
      }
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register(username, email, password);
      const { token, username: userName, email: userEmail } = response.data;

      setToken(token);
      setUser({ username: userName, email: userEmail });

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ username: userName, email: userEmail }));

      return { success: true };
    } catch (err) {
      if (err.response?.status === 409) {
        return {
          success: false,
          error: err.response.data.error || 'Username or email already taken'
        };
      } else if (err.response?.status === 400) {
        return {
          success: false,
          error: err.response.data.error || 'Invalid registration data'
        };
      } else if (err.response?.data?.error) {
        return {
          success: false,
          error: err.response.data.error
        };
      } else {
        return {
          success: false,
          error: 'Registration failed. Please try again.'
        };
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};