import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem('bookease-token') || null
  );
  const [loading, setLoading] = useState(!!token);
  const [error, setError] = useState(null);

  const setAuthState = useCallback((newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    if (newToken) {
      localStorage.setItem('bookease-token', newToken);
    } else {
      localStorage.removeItem('bookease-token');
    }
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile', token);
        setUser(res.user);
      } catch {
        setAuthState(null, null);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token, setAuthState]);

  const login = async (email, password) => {
    setError(null);
    try {
      setLoading(true);
      const res = await api.post('/auth/login', { email, password });
      setAuthState(res.token, res.user);
      return true;
    } catch (err) {
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setError(null);
    try {
      setLoading(true);
      const res = await api.post('/auth/register', { name, email, password });
      setAuthState(res.token, res.user);
      return true;
    } catch (err) {
      setError(err.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthState(null, null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


