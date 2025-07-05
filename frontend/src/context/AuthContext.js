import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const API_BASE_URL = process.env.REACT_APP_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);

      const { token, user: newUser } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));

      setToken(token);
      setUser(newUser);
      setIsAuthenticated(true);

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const res = error.response;
      const message =
        res?.data?.errors
          ? Object.values(res.data.errors).join(', ')
          : res?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, credentials);

      const { token, user: loggedInUser } = response.data;

    
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(loggedInUser));

      setToken(token);
      setUser(loggedInUser);
      setIsAuthenticated(true);

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const res = error.response;
      const message =
        res?.data?.errors
          ? Object.values(res.data.errors).join(', ')
          : res?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
