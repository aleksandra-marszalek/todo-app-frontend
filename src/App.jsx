import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { useAuth } from './context/useAuth';
import AuthPage from './pages/AuthPage';
import TodoPage from './pages/TodoPage';
import { Toaster } from 'react-hot-toast';

const TOAST_CONFIG = {
  position: 'top-right',
  toastOptions: {
    duration: 3000,
    style: {
      background: '#413b3bff',
      color: '#fff',
      borderRadius: '10px',
      padding: '16px',
      fontSize: '14px',
      fontWeight: '500',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
    },
    success: {
      duration: 2500,
      iconTheme: { primary: '#10b981', secondary: '#fff' },
    },
    error: {
      duration: 4000,
      iconTheme: { primary: '#8c3a3aff', secondary: '#fff' },
    },
  },
};

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/todos"
        element={
          <ProtectedRoute>
            <TodoPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster {...TOAST_CONFIG} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
