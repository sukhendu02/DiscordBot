import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCurrentAdmin, login as authLogin } from '../api/auth.api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!admin;

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await fetchCurrentAdmin();
        setAdmin(user);
        // console.log("user req",user)
      } catch (error) {
        localStorage.removeItem('token');
        setAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authLogin(email, password);
    console.log(data)
    localStorage.setItem('token', data.accessToken);
    setAdmin({ id: data.admin.id, email: data.admin.email,data:data.admin.username });
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setAdmin(null);
  }, []);

  const value = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
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
