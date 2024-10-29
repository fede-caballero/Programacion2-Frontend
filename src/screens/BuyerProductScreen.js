import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Card, Title, Paragraph, Button, Portal, Modal, Text, List, ActivityIndicator, Searchbar } from 'react-native-paper';
import { fetchProducts, fetchShoppingLists, addItemToShoppingList } from '../services/api';

const theme = {
  colors: {
    primary: '#1E4D8C',
    secondary: '#34A853',
    accent: '#4285F4',
    background: '#F8FAFD',
    surface: '#FFFFFF',
    error: '#DC3545',
    text: '#1A1F36',
    disabled: '#A0AEC0',
    placeholder: '#718096',
  },
};

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
        const validLists = Array.isArray(listsData) 
          ? listsData.filter(list => list && list.id && list.listName)
          : [];
        setShoppingLists(validLists);

        // Cargar productos y eliminar duplicados por nombre
        const productsData = await fetchProducts();
        const uniqueProducts = Array.from(
          new Map(productsData.map(product => [product.productName, product])).values()
        );

        setProducts(uniqueProducts);
        setFilteredProducts(uniqueProducts);
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
  
      const itemData = {
        productId: selectedProduct.productId,
        quantity: 1,
        notes: selectedProduct.productName
      };
    
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
          <View style={styles.shopInfo}>
            <Text style={styles.shopLabel}>Tienda:</Text>
            <Text style={styles.shopName}>{item.shop?.name || 'No especificada'}</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button 
            mode="contained"
            onPress={() => handleAddToList(item)}
            disabled={!item.productId}
            style={styles.button}
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
                    style={styles.button}
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
                style={styles.button}
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
    backgroundColor: theme.colors.background,
  },
  searchbar: {
    margin: 16,
    backgroundColor: theme.colors.surface,
  },
  productCard: {
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  shopInfo: {
    flexDirection: 'row',
    marginTop: 8,
  },
  shopLabel: {
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  shopName: {
    marginLeft: 4,
    color: theme.colors.placeholder,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  productList: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: theme.colors.surface,
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  noListsContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  noListsText: {
    marginBottom: 20,
    color: theme.colors.text,
  },
});

export default BuyerProductScreen;