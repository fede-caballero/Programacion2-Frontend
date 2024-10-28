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
      category: productData.category,
      productName: productData.productName,
      description: productData.description,
      price: productData.price,
      location: productData.location,
      shop: {
        id: productData.shop.shopId
      }
    };

    console.log('Sending product data:', formattedData);
    
    const response = await axios.post(
      `${API_URL}/api/products`, 
      formattedData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
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

export const updateProduct = async (productId, productData) => {
  try {
    console.log('Updating product:', productId, productData);
    const formattedData = {
      category: productData.category,
      productName: productData.productName,
      description: productData.description,
      price: productData.price,
      location: productData.location,
      shop: {
        id: productData.shop.id
      }
    };

    const response = await axios.put(
      `${API_URL}/api/products/${productId}`,
      formattedData,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Update response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    console.log('Deleting product:', productId);
    const response = await axios.delete(
      `${API_URL}/api/products/${productId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};


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

export const fetchShoppingLists = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    console.log('Fetching shopping lists for user:', userId);
    const response = await api.get(`/api/users/${userId}/shopping-lists`);
    console.log('Shopping lists response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching shopping lists:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return [];
  }
};


export const createShoppingList = async (listData) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    const shoppingListData = {
      listName: listData.listName,
      description: listData.description
    };

    console.log('Creating shopping list:', {
      userId,
      listData: shoppingListData
    });

    const response = await api.post(
      `/api/users/${userId}/shopping-lists`,
      shoppingListData
    );

    console.log('Shopping list created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating shopping list:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

// Funciones de Usuario Registro y Login

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  async (config) => {
      const token = await AsyncStorage.getItem('userToken');
      console.log('Token retrieved from storage:', token);
      
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

export const addItemToShoppingList = async (listId, itemData) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    console.log('Adding item to list:', {
      userId,
      listId,
      itemData
    });

    const response = await api.post(
      `/api/users/${userId}/shopping-lists/${listId}/items`,
      {
        productId: itemData.productId,
        quantity: itemData.quantity || 1,
        notes: itemData.notes || ''
      }
    );

    console.log('Server response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      endpoint: error.config?.url
    });
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
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    const response = await api.get(`/api/users/${userId}/shopping-lists/${shoppingListId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching shopping list details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
