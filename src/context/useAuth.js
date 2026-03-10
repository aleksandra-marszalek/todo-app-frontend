import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Provides access to the auth context. Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
