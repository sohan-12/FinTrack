import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fintrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fintrack_token') || null);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial mount: verify session if token exists
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('fintrack_token');
      if (savedToken) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
          localStorage.setItem('fintrack_user', JSON.stringify(userData));
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('fintrack_token', data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(data.user));
    addToast('Welcome back, ' + data.user.name + '!', 'success');
    return data.user;
  };

  const googleLogin = async (googleData) => {
    const data = await authService.googleLogin(googleData);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('fintrack_token', data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(data.user));
    addToast('Signed in with Google as ' + data.user.name + '!', 'success');
    return data.user;
  };

  const register = async (name, email, password, confirmPassword, otp) => {
    const data = await authService.register(name, email, password, confirmPassword, otp);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('fintrack_token', data.token);
    localStorage.setItem('fintrack_user', JSON.stringify(data.user));
    addToast('Account created and email verified successfully!', 'success');
    return data.user;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    loading,
    login,
    googleLogin,
    register,
    logout,
    toasts,
    addToast,
    removeToast,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
