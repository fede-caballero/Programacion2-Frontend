import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';


const api = axios.create({
  baseURL: API_URL
});

// Funciones de productos
export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductsByShop = async (shopId) => {
  try {
    console.log('Fetching products for shop:', shopId);
    const response = await axios.get(`${API_URL}/api/products/shop/${shopId}`);
    console.log('Products received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by shop:', error);
    throw error;
  }
};

/*
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(`${API_URL}/api/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};*/

// Nueva createProduct
export const createProduct = async (productData) => {
  try {
    const formattedData = {
      productName: productData.productName,
      description: productData.description,
      price: productData.price,
      location: productData.location,
      shop: {
        id: productData.shop.shopId // Usamos directamente shopId sin intentar parsearlo
      }
    };

    console.log('Sending product data:', formattedData);
    
    const response = await axios.post(`${API_URL}/api/products`, formattedData);
    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      data: error.response?.data
    });
    throw error;
  }
};

export const updateProduct = async (productData) => {
  try {
    const response = await axios.put(`${API_URL}/api/products/${productData.id}`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

// Funciones de shops

export const fetchShops = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/shops`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shops:', error);
    throw error;
  }
};

export const fetchShoppingLists = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/api/users/${userId}/shopping-lists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    throw error;
  }
};



export const createShoppingList = async (shoppingListData) => {
  try {
    const response = await axios.post(`${API_URL}/api/shopping-lists`, shoppingListData);
    return response.data;
  } catch (error) {
    console.error('Error creating shopping list:', error);
    throw error;
  }
};

// Funciones de Usuario Registro y Login

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token from storage:', token);
      
      if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Request headers:', config.headers);
      }
      
      console.log('Making request to:', config.url);
      return config;
  },
  (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
  }
);

// Interceptor para las respuestas
api.interceptors.response.use(
  (response) => {
      console.log('Response received:', response.status);
      return response;
  },
  (error) => {
      console.error('Response error details:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
      });
      return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  try {
      const response = await api.post('/api/users/register', userData);
      return response.data;
  } catch (error) {
      console.error('Register error:', error.response?.data);
      throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
      const response = await api.post('/api/users/login', credentials);
      return response.data;
  } catch (error) {
      console.error('Login error:', error.response?.data);
      throw error;
  }
};

export const getCurrentUser = async () => {
  try {
      console.log('Calling getCurrentUser');
      const response = await api.get('/api/users/current');
      return response.data;
  } catch (error) {
      console.error('Get current user error:', {
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
      });
      throw error;
  }
};

export const updateUser = async (userId, updatedUser) => {
  try {
    console.log('Updating user with ID:', userId);
    console.log('Update data:', updatedUser);
    
    const response = await api.put(`/api/users/${userId}`, updatedUser);
    console.log('Update response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.response?.data || error.message);
    throw error;
  }
};

// Nuevas funciones para manejar listas de compras y productos

export const addItemToShoppingList = async (shoppingListId, productId) => {
  try {
    const response = await axios.post(`${API_URL}/api/shopping-lists/${shoppingListId}/items`, { productId });
    return response.data;
  } catch (error) {
    console.error('Error adding item to shopping list:', error);
    throw error;
  }
};

export const removeItemFromShoppingList = async (shoppingListId, itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/shopping-lists/${shoppingListId}/items/${itemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing item from shopping list:', error);
    throw error;
  }
};

export const updateShoppingListItem = async (shoppingListId, itemId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/api/shopping-lists/${shoppingListId}/items/${itemId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    throw error;
  }
};

export const getShoppingListDetails = async (shoppingListId) => {
  try {
    const response = await axios.get(`${API_URL}/api/shopping-lists/${shoppingListId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shopping list details:', error);
    throw error;
  }
};