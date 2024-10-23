import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await getCurrentUser();
      if (userData) {
        setIsAuthenticated(true);
        setUser(userData);
        setUserRole(userData.role);
      } else {
        await handleLogout();
      }
    } catch (error) {
      console.error('Error checking token:', error);
      await handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (e) {
      console.error('Error removing token:', e);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
    }
  };


  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { token, user } = response;
  
      // Asegurarse de que el usuario tiene un id
      if (!user.id && !user.userId && !user.user_id) {
        console.error('No user ID in response:', user);
        throw new Error('Invalid user data received');
      }
  
      await AsyncStorage.setItem('userToken', token);
      
      // Normalizar el formato del usuario
      const normalizedUser = {
        ...user,
        id: user.id || user.userId || user.user_id, // Asegurarnos de que siempre hay un id
      };
  
      setIsAuthenticated(true);
      setUser(normalizedUser);
      setUserRole(user.role);
  
      console.log('Login successful, user:', normalizedUser);
  
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  

  const register = async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      const response = await registerUser(userData);
      console.log('Registration response:', response);
  
      // No intentamos autenticar ni guardar token después del registro.
      navigation.navigate('Login');
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  const logout = async () => {
    try {
      await handleLogout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      userRole,
      setUser, 
      login, 
      logout,
      register,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};