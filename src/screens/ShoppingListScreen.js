import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, List, Button } from 'react-native-paper';
import { fetchShoppingLists, fetchProducts, addItemToShoppingList } from '../services/api';

const ShoppingListScreen = ({ navigation }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    loadShoppingLists();
    loadProducts();
  }, []);

  const loadShoppingLists = async () => {
    try {
      const lists = await fetchShoppingLists();
      setShoppingLists(lists);
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const productList = await fetchProducts();
      setProducts(productList);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleAddToList = async (product) => {
    if (!selectedList) {
      alert('Por favor, selecciona una lista de compras primero.');
      return;
    }

    try {
      await addItemToShoppingList(selectedList.id, product.id);
      alert(`${product.name} añadido a ${selectedList.name}`);
    } catch (error) {
      console.error('Error adding product to list:', error);
      alert('Error al añadir el producto a la lista.');
    }
  };

  const renderShoppingList = ({ item }) => (
    <List.Item
      title={item.name}
      onPress={() => setSelectedList(item)}
      right={() => <Text>{item.items.length} items</Text>}
    />
  );

  const renderProduct = ({ item }) => (
    <List.Item
      title={item.name}
      description={`Precio: $${item.price}`}
      right={() => (
        <Button onPress={() => handleAddToList(item)}>Añadir</Button>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Listas de Compras</Text>
      <FlatList
        data={shoppingLists}
        renderItem={renderShoppingList}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <Text style={styles.subtitle}>Productos Disponibles</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddShoppingList')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ShoppingListScreen;