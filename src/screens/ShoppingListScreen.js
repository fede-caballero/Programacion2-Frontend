import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Text, FAB, List, Button, Surface, TextInput, Portal, Dialog, Modal, Card, IconButton } from 'react-native-paper';
import { fetchShoppingLists, fetchProducts } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CATEGORIES = [
  { 
    id: 'DAIRY', 
    name: 'Lácteos', 
    icon: 'cheese',
    description: 'Quesos, leche, yogurt, mantequilla, crema, etc.'
  },
  { 
    id: 'MEAT', 
    name: 'Carnes', 
    icon: 'food-steak',
    description: 'Res, cerdo, pollo, pescado, mariscos, etc.'
  },
  { 
    id: 'FRUITS', 
    name: 'Frutas', 
    icon: 'fruit-watermelon',
    description: 'Manzanas, peras, uvas, fresas, platanos, etc.'
  },
  { 
    id: 'VEGETABLES', 
    name: 'Verduras', 
    icon: 'carrot',
    description: 'Lechuga, espinaca, zanahoria, papa, cebolla, etc.'
  },
  { 
    id: 'BAKERY', 
    name: 'Panadería', 
    icon: 'bread-slice',
    description: 'Pan, tortillas, pasteles, galletas, etc.'
  },
  { 
    id: 'BEVERAGES', 
    name: 'Bebidas', 
    icon: 'bottle-soda',
    description: 'Refrescos, jugos, cervezas, vinos, licores, etc.'
  },
  { 
    id: 'FROZEN', 
    name: 'Congelados', 
    icon: 'snowflake',
    description: 'Helados, pizzas, papas, verduras, etc.'
  },
  { 
    id: 'CLEANING', 
    name: 'Limpieza', 
    icon: 'spray-bottle',
    description: 'Detergentes, jabones, cloro, escobas, trapeadores, etc.'
  },
  { 
    id: 'PERSONAL', 
    name: 'Cuidado personal', 
    icon: 'shower-head',
    description: 'Shampoo, jabon, pasta de dientes, papel higienico, etc.'
  }
];

const ShoppingListScreen = ({ navigation }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  
  // Estados para el modal de nuevo item
  const [modalVisible, setModalVisible] = useState(false);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newItem, setNewItem] = useState({
    category: null,
    name: '',
    description: '',
    quantity: '1'
  });
  const [priceSuggestionsVisible, setPriceSuggestionsVisible] = useState(false);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      const lists = await fetchShoppingLists();
      setShoppingLists(lists || []);
      
      if (selectedList) {
        const updatedSelectedList = lists.find(list => list.id === selectedList.id);
        setSelectedList(updatedSelectedList || null);
      }
    } catch (error) {
      console.error('Error loading shopping lists:', error);
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  const findSimilarProducts = async (itemName, category) => {
    try {
      // Obtener todos los productos
      const products = await fetchProducts();
      
      // Filtrar productos similares por nombre y categoría
      const similar = products.filter(product => 
        product.category === category &&
        product.productName.toLowerCase().includes(itemName.toLowerCase())
      );

      // Ordenar por precio
      similar.sort((a, b) => a.price - b.price);
      
      setSimilarProducts(similar);
      if (similar.length > 0) {
        setPriceSuggestionsVisible(true);
      }
    } catch (error) {
      console.error('Error finding similar products:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadShoppingLists();
    }, [])
  );

  const handleListSelection = (list) => {
    setSelectedList(selectedList?.id === list.id ? null : list);
  };

  const handleAddNewItem = async () => {
    if (!selectedList) {
      alert('Por favor, selecciona una lista de compras primero.');
      return;
    }

    if (!newItem.name.trim() || !newItem.category) {
      alert('Por favor, complete los campos requeridos.');
      return;
    }

    // Buscar productos similares antes de agregar
    await findSimilarProducts(newItem.name, newItem.category);
  };

  const confirmAddItem = async (suggestedPrice = null) => {
    try {
      const itemToAdd = {
        itemName: newItem.name,
        category: newItem.category,
        description: newItem.description,
        quantity: parseInt(newItem.quantity) || 1,
        suggestedPrice: suggestedPrice
      };

      // Aquí deberías hacer la llamada a tu API para agregar el item
      // await addCustomItemToShoppingList(selectedList.id, itemToAdd);
      
      await loadShoppingLists();
      
      // Limpiar el formulario y cerrar los modales
      setNewItem({
        category: null,
        name: '',
        description: '',
        quantity: '1'
      });
      setModalVisible(false);
      setPriceSuggestionsVisible(false);
      setSimilarProducts([]);
    } catch (error) {
      console.error('Error adding item to list:', error);
      alert('Error al añadir el item a la lista.');
    }
  };

  const renderShoppingList = ({ item }) => (
    <Surface style={[
      styles.listItem,
      selectedList?.id === item.id && styles.selectedListItem
    ]}>
      <List.Item
        title={item.listName}
        description={item.description}
        onPress={() => handleListSelection(item)}
        left={props => <List.Icon {...props} icon={selectedList?.id === item.id ? "checkbox-marked" : "checkbox-blank-outline"} />}
        right={() => (
          <View style={styles.listItemRight}>
            <Text style={styles.itemCount}>
              {(item.items?.length || 0)} items
            </Text>
          </View>
        )}
      />
    </Surface>
  );

  const selectedCategory = CATEGORIES.find(cat => cat.id === newItem.category);

  return (
    <View style={styles.container}>
      <View style={styles.listSection}>
        <Text style={styles.title}>Mis Listas de Compras</Text>
        {selectedList && (
          <Text style={styles.selectedListText}>
            Lista seleccionada: {selectedList.listName}
          </Text>
        )}
        <FlatList
          data={shoppingLists}
          renderItem={renderShoppingList}
          keyExtractor={item => String(item.id)}
          style={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay listas disponibles</Text>
          }
        />
      </View>

      <View style={styles.addItemSection}>
        <Button
          mode="contained"
          onPress={() => {
            setModalVisible(true);
            setCategoryModalVisible(true);
          }}
          disabled={!selectedList}
          style={styles.addItemButton}
          icon="plus"
        >
          Agregar Nuevo Item
        </Button>
      </View>

      {/* Modal de categorías */}
      <Portal>
        <Modal
          visible={isCategoryModalVisible && modalVisible}
          onDismiss={() => {
            setCategoryModalVisible(false);
            if (!newItem.category) {
              setModalVisible(false);
            }
          }}
          contentContainerStyle={styles.categoryModalContainer}
        >
          <Card style={styles.categoryCard}>
            <Card.Content>
              <View style={styles.categoryModalHeader}>
                <Text style={styles.categoryModalTitle}>Selecciona una categoría</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => {
                    setCategoryModalVisible(false);
                    setModalVisible(false);
                  }}
                />
              </View>
              <ScrollView style={styles.categoriesList}>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    mode="outlined"
                    onPress={() => {
                      setNewItem({ ...newItem, category: cat.id });
                      setCategoryModalVisible(false);
                    }}
                    style={styles.categoryButton}
                    icon={cat.icon}
                  >
                    {cat.name}
                  </Button>
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* Modal para detalles del item */}
      <Portal>
        <Modal
          visible={modalVisible && !isCategoryModalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <View style={styles.selectedCategoryContainer}>
                <Text style={styles.selectedCategoryLabel}>Categoría:</Text>
                <Text style={styles.selectedCategoryText}>
                  {selectedCategory?.name}
                </Text>
                <Button
                  mode="text"
                  onPress={() => setCategoryModalVisible(true)}
                  style={styles.changeButton}
                >
                  Cambiar
                </Button>
              </View>

              <TextInput
                label="Nombre del item"
                value={newItem.name}
                onChangeText={text => setNewItem({ ...newItem, name: text })}
                style={styles.input}
                mode="outlined"
              />
              
              <TextInput
                label="Descripción"
                value={newItem.description}
                onChangeText={text => setNewItem({ ...newItem, description: text })}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />
              
              <TextInput
                label="Cantidad"
                value={newItem.quantity}
                onChangeText={text => {
                  const newText = text.replace(/[^0-9]/g, '');
                  setNewItem({ ...newItem, quantity: newText });
                }}
                keyboardType="numeric"
                style={styles.input}
                mode="outlined"
              />

              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.button}
                >
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleAddNewItem}
                  style={styles.button}
                >
                  Continuar
                </Button>
              </View>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {/* Modal de sugerencias de precios */}
      <Portal>
        <Modal
          visible={priceSuggestionsVisible}
          onDismiss={() => setPriceSuggestionsVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Card>
            <Card.Content>
              <Text style={styles.suggestionsTitle}>Productos similares encontrados</Text>
              
              <ScrollView style={styles.suggestionsList}>
                {similarProducts.map((product, index) => (
                  <List.Item
                    key={product.id}
                    title={product.productName}
                    description={`${product.shop?.name || 'Tienda'} - $${product.price}`}
                    left={props => (
                      <List.Icon
                        {...props}
                        icon={index === 0 ? "star" : "store"}
                        color={index === 0 ? "#FFD700" : undefined}
                      />
                    )}
                    onPress={() => confirmAddItem(product.price)}
                    style={styles.suggestionItem}
                  />
                ))}
              </ScrollView>

              <Button
                mode="contained"
                onPress={() => confirmAddItem()}
                style={styles.addWithoutSuggestionButton}
              >
                Agregar sin sugerencia de precio
              </Button>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

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
    backgroundColor: '#f5f5f5',
  },
  listSection: {
    flex: 1,
    marginBottom: 10,
  },
  productsSection: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  listItem: {
    marginVertical: 4,
    marginHorizontal: 2,
    borderRadius: 8,
    elevation: 2,
  },
  selectedListItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
    borderWidth: 1,
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    marginRight: 10,
    color: '#666',
  },
  selectedListText: {
    color: '#2196f3',
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196f3',
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    color: '#666',
  },
  addButton: {
    marginHorizontal: 8,
  },
});

export default ShoppingListScreen;