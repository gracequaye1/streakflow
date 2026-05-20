import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useGame } from "./GameContext";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  // On app load, verify stored token is still valid
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  // Apply dark mode class to <html> element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sf_unlocked'); // Reset game progress on logout
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, darkMode, setDarkMode, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

//  Exported separately — fixes the Fast Refresh warning
export function useAuth() {
  return useContext(AuthContext);
}