import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, ScrollView } from 'react-native';
import { 
  Text, 
  FAB, 
  List, 
  Button, 
  Surface, 
  TextInput, 
  Portal, 
  Dialog, 
  Modal, 
  Card, 
  IconButton,
  ActivityIndicator 
} from 'react-native-paper';
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
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  
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
      const listsData = await fetchShoppingLists();
      
      const validLists = Array.isArray(listsData) 
        ? listsData.map(list => ({
            id: list.id,
            listName: list.listName || 'Lista sin nombre',
            description: list.description,
            items: Array.isArray(list.items) 
              ? list.items.map(item => ({
                  id: item.id,
                  itemName: item.itemName,
                  quantity: item.quantity,
                  notes: item.notes
                }))
              : []
          }))
        : [];
      setShoppingLists(validLists);
      
      if (selectedList) {
        const updatedSelectedList = validLists.find(list => list.id === selectedList.id);
        setSelectedList(updatedSelectedList || null);
      }
    } catch (error) {
      console.error('Error loading shopping lists:', error);
      setShoppingLists([]);
      setSelectedList(null);
    } finally {
      setLoading(false);
    }
  };

  
  const findSimilarProducts = async (itemName, category) => {
    if (!itemName || !category) {
      console.warn('Nombre del item o categoría faltante');
      return;
    }
    
    try {
      const products = await fetchProducts();
      if (!Array.isArray(products)) {
        console.warn('Los productos no son un array válido');
        return;
      }
      
      const similar = products.filter(product => 
        product && 
        product.id &&
        product.category === category &&
        product.productName?.toLowerCase().includes(itemName.toLowerCase())
      );
  
      similar.sort((a, b) => (a.price || 0) - (b.price || 0));
      
      setSimilarProducts(similar);
      if (similar.length > 0) {
        setPriceSuggestionsVisible(true);
      } else {
        // Si no hay productos similares, continuar directamente con la adición
        await confirmAddItem();
      }
    } catch (error) {
      console.error('Error finding similar products:', error);
      Alert.alert(
        'Error',
        'No se pudieron buscar productos similares'
      );
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
    if (!selectedList?.id) {
      Alert.alert('Error', 'Por favor, seleccione una lista primero');
      return;
    }
  
    try {
      const itemToAdd = {
        itemName: newItem.name.trim(),
        category: newItem.category,
        description: newItem.description.trim(),
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
  
      Alert.alert('Éxito', 'Item agregado correctamente');
    } catch (error) {
      console.error('Error adding item to list:', error);
      Alert.alert(
        'Error',
        'No se pudo agregar el item a la lista'
      );
    }
  };

  const renderShoppingList = useCallback(({ item }) => {
    // Validar que el item tenga id
    if (!item?.id) return null;

    return (
      <Surface 
        key={`surface-${item.id}`}  // Agregar key aquí
        style={[
          styles.listItem,
          selectedList?.id === item.id && styles.selectedListItem
        ]}
      >
        <List.Item
          title={item.listName || 'Lista sin nombre'}
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
  }, [selectedList]);

  const renderSimilarProduct = useCallback(({ item: product, index }) => {
    if (!product?.id) return null;

    return (
      <List.Item
        key={`product-${product.id}`}  // Agregar key aquí
        title={product.productName || 'Producto sin nombre'}
        description={`${product.shop?.name || 'Tienda'} - $${product.price || 0}`}
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
    );
  }, []);

  const renderCategory = useCallback(({ item: category }) => {
    if (!category?.id) return null;

    return (
      <Button
        key={`category-${category.id}`}  // Agregar key aquí
        mode="outlined"
        onPress={() => {
          setNewItem(prev => ({ ...prev, category: category.id }));
          setCategoryModalVisible(false);
        }}
        style={styles.categoryButton}
        icon={category.icon}
      >
        {category.name}
      </Button>
    );
  }, []);

  const selectedCategory = CATEGORIES.find(cat => cat.id === newItem.category);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Cargando listas...</Text>
      </View>
    );
  }

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
          keyExtractor={item => `list-${item?.id || Date.now()}-${Math.random()}`}
          style={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="clipboard-text-off" size={48} color="#666" />
              <Text style={styles.emptyText}>No hay listas disponibles</Text>
              <Text style={styles.emptySubtext}>
                Presiona el botón + para crear una nueva lista
              </Text>
            </View>
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
              <FlatList
                data={CATEGORIES}
                keyExtractor={(item) => `category-${item.id}`}
                renderItem={({ item: category }) => (
                  <Button
                    key={`button-${category.id}`}
                    mode="outlined"
                    onPress={() => {
                      setNewItem({ ...newItem, category: category.id });
                      setCategoryModalVisible(false);
                    }}
                    style={styles.categoryButton}
                    icon={category.icon}
                  >
                    {category.name}
                  </Button>
                )}
                style={styles.categoriesList}
              />
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
              
              <FlatList
                  data={similarProducts}
                  keyExtractor={(item) => `product-${item.id}`}
                  renderItem={({ item: product, index }) => (
                    <List.Item
                      key={`suggestion-${product.id}`}
                      title={product.productName || 'Producto sin nombre'}
                      description={`${product.shop?.name || 'Tienda'} - $${product.price || 0}`}
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
                  )}
                  style={styles.suggestionsList}
                  ListEmptyComponent={() => (
                    <Text style={styles.emptyText}>No se encontraron productos similares</Text>
                  )}
                />

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
  categoryModalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 0,
    maxHeight: '80%',
  },
  categoryCard: {
    height: '100%',
  },
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoriesList: {
    flexGrow: 0,
  },
  categoryButton: {
    marginVertical: 4,
    marginHorizontal: 8,
  },
  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    maxHeight: '80%',
  },
  selectedCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedCategoryLabel: {
    fontSize: 16,
    marginRight: 8,
    color: '#666',
  },
  selectedCategoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  changeButton: {
    marginLeft: 8,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  button: {
    marginLeft: 8,
  },
  suggestionsList: {
    maxHeight: 300,
  },
  suggestionItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  addWithoutSuggestionButton: {
    marginTop: 16,
  },
  suggestionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addItemSection: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  addItemButton: {
    width: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default ShoppingListScreen;