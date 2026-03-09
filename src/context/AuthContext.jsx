import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

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
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
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
      }
      else if (err.response?.data?.error) {
        return { 
          success: false, 
          error: err.response.data.error 
        };
      }
      else {
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
      }
      // Handle 400 Bad Request (validation errors)
      else if (err.response?.status === 400) {
        return { 
          success: false, 
          error: err.response.data.error || 'Invalid registration data' 
        };
      }
      // Handle other backend errors
      else if (err.response?.data?.error) {
        return { 
          success: false, 
          error: err.response.data.error 
        };
      }
      // Handle network errors
      else {
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