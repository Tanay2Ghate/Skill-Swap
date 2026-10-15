import { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (accessToken) {
        try {
          const { data } = await api.get('/users/me');
          setUser(data.user || data);
        } catch (error) {
          // Token is invalid or expired — clear everything so user must re-login
          console.warn('Failed to fetch user profile, clearing session:', error?.response?.data?.message || error.message);
          localStorage.removeItem('accessToken');
          setAccessToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [accessToken]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('accessToken', data.accessToken);
    setAccessToken(data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {}
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, isAuthenticated: !!accessToken && !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
