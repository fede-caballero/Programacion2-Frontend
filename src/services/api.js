import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/config';


const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
    'Accept': 'application/json'
  }
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


// Función para crear lista de compras
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

    // Simplificar los datos enviados
    const requestData = {
      listName: listData.listName.trim(),
      description: listData.description?.trim() || null
    };

    const response = await api.post(
      `/api/users/${userId}/shopping-lists`,
      requestData
    );

    return response.data;
  } catch (error) {
    console.error('Error creating shopping list:', error);
    throw error;
  }
};

export const deleteShoppingListByIdAndUser = async (listId) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    const response = await api.delete(
      `/api/users/${userId}/shopping-lists/${listId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error deleting shopping list:', {
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
    console.log('RegisterUser - Request data:', {
      ...userData,
      password: userData.password ? '[PRESENT]' : '[MISSING]'
    });

    const response = await api.post('/api/users/register', 
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        shop: userData.shop
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('RegisterUser - Response:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('RegisterUser - Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    console.log('LoginUser - Request data:', {
      ...userData,
      password: userData.password ? '[PRESENT]' : '[MISSING]'
    });

    const response = await api.post('/api/users/login', userData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('LoginUser - Response:', {
      status: response.status,
      data: response.data
    });

    return response.data;
  } catch (error) {
    console.error('LoginUser - Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
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

    const formattedData = {
      itemName: itemData.notes ? `Producto: ${itemData.notes}` : 'Producto sin nombre',
      quantity: itemData.quantity || 1,
      notes: itemData.notes || '',
      productId: itemData.productId
    };

    console.log('Adding item to list:', {
      userId,
      listId,
      formattedData
    });

    const response = await api.post(
      `/api/users/${userId}/shopping-lists/${listId}/items`,
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
    console.error('Error adding item to list:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.config?.headers
    });
    throw error;
  }
};

export const removeItemFromList = async (listId, itemId) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    console.log('Removing item:', {
      userId,
      listId,
      itemId
    });

    const response = await api.delete(
      `/api/users/${userId}/shopping-lists/${listId}/items/${itemId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    console.log('Remove item response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error removing item:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};

export const updateItemQuantity = async (listId, itemId, quantity) => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    if (!userData) {
      throw new Error('No user data found');
    }
    
    const { userId } = JSON.parse(userData);
    if (!userId) {
      throw new Error('No user ID found');
    }

    console.log('Updating item quantity:', {
      userId,
      listId,
      itemId,
      quantity
    });

    const response = await api.patch(
      `/api/users/${userId}/shopping-lists/${listId}/items/${itemId}`,
      { quantity },
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    );

    console.log('Update quantity response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating quantity:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
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

    console.log('Fetching shopping list details:', {
      userId,
      shoppingListId
    });

    const response = await api.get(
      `/api/users/${userId}/shopping-lists/${shoppingListId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    console.log('Raw shopping list response:', response.data);

    // Asegurarse de que los items existan y sean un array
    const list = response.data;
    const items = Array.isArray(list.items) ? list.items : [];

    // Transformar los datos manteniendo toda la información necesaria
    const transformedList = {
      id: list.id,
      listName: list.listName,
      description: list.description,
      items: items.map(item => ({
        id: item.id,
        itemName: item.itemName || 'Sin nombre',
        quantity: item.quantity || 1,
        notes: item.notes || '',
        product: item.product ? {
          id: item.product.productId,
          productName: item.product.productName,
          price: item.product.price,
          description: item.product.description,
          shop: item.product.shop ? {
            id: item.product.shop.id,
            name: item.product.shop.shopName,
            location: item.product.shop.location
          } : null
        } : null
      }))
    };

    console.log('Transformed shopping list:', transformedList);
    return transformedList;
  } catch (error) {
    console.error('Error fetching shopping list details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    throw error;
  }
};
