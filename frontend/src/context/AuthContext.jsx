/**
 * Auth Context
 * Provides authentication state and actions throughout the admin portal.
 * Persists token in localStorage for session continuity.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ess_admin_token'));
  const [loading, setLoading] = useState(true); // initial auth check

  // On mount, verify stored token by fetching profile
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get('/auth/profile');
        setAdmin(res.data.data);
      } catch {
        // Token invalid/expired — clear it
        localStorage.removeItem('ess_admin_token');
        setToken(null);
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = useCallback(async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: newToken, admin: adminData } = res.data.data;
    localStorage.setItem('ess_admin_token', newToken);
    setToken(newToken);
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Silent — logout regardless
    } finally {
      localStorage.removeItem('ess_admin_token');
      setToken(null);
      setAdmin(null);
    }
  }, []);

  const updateAdmin = useCallback((updatedAdmin) => {
    setAdmin(updatedAdmin);
  }, []);

  const isAuthenticated = Boolean(token && admin);

  return (
    <AuthContext.Provider value={{ admin, token, loading, isAuthenticated, login, logout, updateAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export default AuthContext;
