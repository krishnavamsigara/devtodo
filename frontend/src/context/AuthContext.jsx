import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { authApi } from '../services/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const response = await authApi.getMe();
      if (response.data?.success && response.data?.data?.user) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch {
      setUser(null);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (email, password) => {
    const response = await authApi.login({ email, password });
    const { user: loggedInUser, token: authToken } = response.data.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const response = await authApi.register({ name, email, password });
    const { user: registeredUser, token: authToken } = response.data.data;
    localStorage.setItem('token', authToken);
    setToken(authToken);
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    } finally {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
