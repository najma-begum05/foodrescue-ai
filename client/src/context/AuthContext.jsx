import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('foodrescue_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('foodrescue_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hydrate user session on app load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('foodrescue_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('foodrescue_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or server unavailable:', err.message);
          // If token verification fails, clear cached state
          setUser(null);
          setToken(null);
          localStorage.removeItem('foodrescue_token');
          localStorage.removeItem('foodrescue_user');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login(email, password);
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('foodrescue_token', data.token);
        localStorage.setItem('foodrescue_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (formData) => {
    setError(null);
    try {
      const data = await authService.register(formData);
      if (data.success) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('foodrescue_token', data.token);
        localStorage.setItem('foodrescue_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      } else {
        setError(data.message);
        return { success: false, message: data.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed.';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Profile update handler
  const updateProfile = async (profileData) => {
    try {
      const data = await authService.updateProfile(profileData);
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('foodrescue_user', JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, message: data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed.';
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('foodrescue_token');
    localStorage.removeItem('foodrescue_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
