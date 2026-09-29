import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import api from '../utils/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('healora_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function validateSession() {
      const storedToken = localStorage.getItem('healora_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const userData = await api.get('/api/auth/me');
        const resolved = userData?.data || userData;
        setUser(resolved);
        setToken(storedToken);
        localStorage.setItem('healora_user', JSON.stringify(resolved));
      } catch (err) {
        if (err?.offline) {
          const cached = localStorage.getItem('healora_user');
          if (cached) {
            try {
              setUser(JSON.parse(cached));
              setToken(storedToken);
            } catch {
              setUser(null);
              setToken(null);
            }
          } else {
            setUser(null);
            setToken(null);
          }
        } else {
          localStorage.removeItem('healora_token');
          localStorage.removeItem('healora_user');
          setUser(null);
          setToken(null);
        }
      } finally {
        setLoading(false);
      }
    }

    validateSession();
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    const { token: newToken, user: userData } = response;

    localStorage.setItem('healora_token', newToken);
    localStorage.setItem('healora_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return userData;
  }, []);

  const signup = useCallback(async (data) => {
    const response = await api.post('/api/auth/register', data);
    const { token: newToken, user: userData } = response;

    localStorage.setItem('healora_token', newToken);
    localStorage.setItem('healora_user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);

    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('healora_token');
    localStorage.removeItem('healora_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token && user);
  const isPatient = isAuthenticated && user?.role === 'patient';
  const isDoctor = isAuthenticated && user?.role === 'doctor';

  const value = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
    isPatient,
    isDoctor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function ProtectedRoute({ children, allowedRole }) {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    const redirectPath = user?.role === 'doctor' ? '/doctor' : '/patient';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
}

export default AuthContext;
