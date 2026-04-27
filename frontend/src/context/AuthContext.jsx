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
          const { data } = await api.get('/users/me'); // We mock this endpoint to succeed for now
          setUser(data);
        } catch (error) {
          // Fallback if the endpoint is not ready, to allow frontend development to continue
          setUser({ id: 1, name: 'Test User', email: 'test@example.com' });
          console.warn('User endpoint not ready, mocking user.');
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
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout, isAuthenticated: !!accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};
