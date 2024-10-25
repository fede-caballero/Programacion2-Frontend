import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser, getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shopData, setShopData] = useState(null);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const storedUserData = await AsyncStorage.getItem('userData');

      if (!token || !storedUserData) {
        setLoading(false);
        return;
      }

      const parsedUserData = JSON.parse(storedUserData);
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setIsAuthenticated(true);
        setUser(currentUser);
        setUserRole(currentUser.role);
        
        // Si es un comercio, establecer los datos de la tienda
        if (currentUser.role === 'COMMERCE' && currentUser.shop) {
          setShopData({
            shopId: currentUser.shop.shopId,
            shopName: currentUser.shop.shopName,
            location: currentUser.shop.location
          });
        }
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
      await AsyncStorage.multiRemove(['userToken', 'userData']);
    } catch (e) {
      console.error('Error removing auth data:', e);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      setUserRole(null);
      setShopData(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      console.log('Login response:', response);
  
      if (!response || !response.token) {
        throw new Error('No se recibió un token válido del servidor');
      }
  
      const { token, userId, name, email: userEmail, role, shop } = response;
  
      // Validar que tengamos todos los datos necesarios
      if (!token || !userId || !userEmail || !role) {
        throw new Error('Datos de usuario incompletos en la respuesta');
      }
  
      // Preparar los datos del usuario normalizados
      const userData = {
        userId,
        name: name || '',
        email: userEmail,
        role,
        shop: role === 'COMMERCE' && shop ? {
          shopId: shop.shopId || '',
          shopName: shop.shopName || '',
          location: shop.location || ''
        } : null
      };
  
      // Guardar datos en AsyncStorage
      if (typeof token === 'string' && token.length > 0) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
      } else {
        throw new Error('Token inválido recibido del servidor');
      }
  
      // Actualizar el estado
      setIsAuthenticated(true);
      setUser(userData);
      setUserRole(role);
      
      if (role === 'COMMERCE' && shop) {
        setShopData({
          shopId: shop.shopId || '',
          shopName: shop.shopName || '',
          location: shop.location || ''
        });
      }
  
      console.log('Login successful, user:', userData);
      return { ...userData, token }; // Asegurarse de devolver el token junto con los datos
  
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

      // Si el registro incluye login automático, manejar los datos como en login
      if (response.token) {
        await AsyncStorage.setItem('userToken', response.token);
        
        const normalizedUser = {
          userId: response.userId,
          name: response.name,
          email: response.email,
          role: response.role,
          shop: response.role === 'COMMERCE' ? {
            shopId: response.shop?.shopId,
            shopName: response.shop?.shopName,
            location: response.shop?.location
          } : null
        };

        await AsyncStorage.setItem('userData', JSON.stringify(normalizedUser));
        setUser(normalizedUser);
        setUserRole(response.role);
        setIsAuthenticated(true);

        if (response.role === 'COMMERCE' && response.shop) {
          setShopData({
            shopId: response.shop.shopId,
            shopName: response.shop.shopName,
            location: response.shop.location
          });
        }
      }

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

  const updateShopData = async (newShopData) => {
    try {
      const updatedUserData = {
        ...user,
        shop: newShopData
      };
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      setUser(updatedUserData);
      setShopData(newShopData);
    } catch (error) {
      console.error('Error updating shop data:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      userRole,
      shopData,
      setUser, 
      login, 
      logout,
      register,
      loading,
      updateShopData
    }}>
      {children}
    </AuthContext.Provider>
  );
};