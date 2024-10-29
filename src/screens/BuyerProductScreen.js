import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Portal, Modal, Text, List, ActivityIndicator, Searchbar } from 'react-native-paper';
import { fetchProducts, fetchShoppingLists, addItemToShoppingList } from '../services/api';

const BuyerProductScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [addingToList, setAddingToList] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Cargar listas de compras del usuario actual
        const listsData = await fetchShoppingLists();
        // Filtrar listas válidas (que tengan id y nombre)
        const validLists = Array.isArray(listsData) 
          ? listsData.filter(list => list && list.id && list.listName)
          : [];
        setShoppingLists(validLists);

        // Cargar productos
        const productsData = await fetchProducts();
        const validProducts = (productsData || [])
          .filter(product => 
            product && 
            product.productName && 
            product.price && 
            product.shop
          )
          .map((product, index) => ({
            ...product,
            productId: product.productId || `temp-${index}`
          }));
        
        setProducts(validProducts);
        setFilteredProducts(validProducts);
      } catch (error) {
        console.error('Error en la carga inicial:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar los datos. Por favor, intente nuevamente.'
        );
        setProducts([]);
        setFilteredProducts([]);
        setShoppingLists([]);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Efecto para filtrar productos basado en la búsqueda
  useEffect(() => {
    if (Array.isArray(products)) {
      const filtered = products.filter(product => 
        product?.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product?.shop?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const handleAddToList = (product) => {
    if (!product) {
      Alert.alert('Error', 'Producto no válido');
      return;
    }
    setSelectedProduct(product);
    setModalVisible(true);
  };

  const handleSelectList = async (listId) => {
    if (addingToList) return;
  
    try {
      setAddingToList(true);
      
      if (!listId) {
        Alert.alert('Error', 'Por favor seleccione una lista válida');
        return;
      }
  
      if (!selectedProduct || !selectedProduct.productId) {
        Alert.alert('Error', 'No se pudo identificar el producto');
        return;
      }
  
      // Formatear los datos del item
      const itemData = {
        productId: selectedProduct.productId,
        quantity: 1,
        notes: selectedProduct.productName, // Usar el nombre del producto como nota
        price: selectedProduct.price
      };
  
      console.log('Enviando datos al servidor:', {
        listId,
        itemData
      });
    
      await addItemToShoppingList(listId, itemData);
      
      setModalVisible(false);
      setSelectedProduct(null);
      Alert.alert('Éxito', 'Producto agregado a la lista');
    } catch (error) {
      console.error('Error adding to list:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      Alert.alert(
        'Error',
        'No se pudo agregar el producto a la lista. Por favor intente nuevamente.'
      );
    } finally {
      setAddingToList(false);
    }
  };

  const renderProduct = ({ item }) => {
    if (!item) return null;

    return (
      <Card style={styles.productCard}>
        <Card.Content>
          <Title>{item.productName}</Title>
          <Paragraph>{item.description || 'Sin descripción'}</Paragraph>
          <View style={styles.productDetails}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <View style={styles.shopInfo}>
              <Text style={styles.shopLabel}>Tienda:</Text>
              <Text style={styles.shopName}>{item.shop?.name || 'No especificada'}</Text>
            </View>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={() => handleAddToList(item)}
            disabled={!item.productId}
          >
            Añadir a lista
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando productos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar productos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item?.productId?.toString() || `product-${Date.now()}-${Math.random()}`}
        contentContainerStyle={styles.productList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text>No se encontraron productos</Text>
          </View>
        )}
      />

      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => !addingToList && setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Title>Seleccionar lista de compras</Title>
              {shoppingLists.length === 0 ? (
                <View style={styles.noListsContainer}>
                  <Text style={styles.noListsText}>
                    No tienes listas de compras.
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setModalVisible(false);
                      navigation.navigate('AddShoppingList');
                    }}
                  >
                    Crear Lista Nueva
                  </Button>
                </View>
              ) : (
                <FlatList
                  data={shoppingLists}
                  keyExtractor={item => `list-${item?.id || Date.now()}-${Math.random()}`}
                  renderItem={({ item }) => {
                    if (!item?.id || !item?.listName) return null;
                    
                    return (
                      <List.Item
                        title={item.listName}
                        description={`${item.description || ''} ${
                          item.items?.length ? `(${item.items.length} productos)` : '(Lista vacía)'
                        }`}
                        onPress={() => handleSelectList(item.id)}
                        disabled={addingToList}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                      />
                    );
                  }}
                  ListEmptyComponent={() => (
                    <Text style={styles.noListsText}>No se encontraron listas válidas</Text>
                  )}
                />
              )}
            </Card.Content>
            <Card.Actions>
              <Button 
                onPress={() => !addingToList && setModalVisible(false)}
                disabled={addingToList}
              >
                Cancelar
              </Button>
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchbar: {
    margin: 16,
    elevation: 4,
  },
  productList: {
    padding: 16,
  },
  productCard: {
    marginBottom: 16,
    elevation: 4,
  },
  productDetails: {
    marginTop: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
    marginBottom: 4,
  },
  shopInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 4,
  },
  shopName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noListsContainer: {
    alignItems: 'center',
    padding: 20,
  },
  noListsText: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
});

export default BuyerProductScreen;