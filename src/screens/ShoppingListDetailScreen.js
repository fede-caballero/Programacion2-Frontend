import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Surface, Text, ActivityIndicator, IconButton, Card, Divider, Badge, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { getShoppingListDetails, removeItemFromList, updateItemQuantity } from '../services/api';

const ShoppingListDetailScreen = ({ route, navigation }) => {
  const { listId, listName } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shoppingList, setShoppingList] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newQuantity, setNewQuantity] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    loadShoppingListDetails();
  }, [listId]);

  const loadShoppingListDetails = async () => {
    try {
      setLoading(true);
      const details = await getShoppingListDetails(listId);
      console.log('Loaded shopping list details:', details);
      setShoppingList(details);
      setError(null);
    } catch (err) {
      console.error('Error loading shopping list details:', err);
      setError('No se pudo cargar los detalles de la lista');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Está seguro que desea eliminar este item?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          onPress: async () => {
            try {
              await removeItemFromList(listId, itemId);
              await loadShoppingListDetails(); // Recargar la lista
              Alert.alert('Éxito', 'Item eliminado correctamente');
            } catch (err) {
              console.error('Error deleting item:', err);
              Alert.alert('Error', 'No se pudo eliminar el item');
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const handleEditQuantity = (item) => {
    setEditingItem(item);
    setNewQuantity(item.quantity.toString());
    setIsEditing(true);
  };

  const handleUpdateQuantity = async () => {
    if (!editingItem) return;

    const quantity = parseInt(newQuantity);
    if (isNaN(quantity) || quantity < 1) {
      Alert.alert('Error', 'Por favor ingrese una cantidad válida');
      return;
    }

    try {
      await updateItemQuantity(listId, editingItem.id, quantity);
      await loadShoppingListDetails(); // Recargar la lista
      setIsEditing(false);
      setEditingItem(null);
      Alert.alert('Éxito', 'Cantidad actualizada correctamente');
    } catch (err) {
      console.error('Error updating quantity:', err);
      Alert.alert('Error', 'No se pudo actualizar la cantidad');
    }
  };

  const renderItem = ({ item }) => (
    <Surface style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemTitleContainer}>
          <Text style={styles.itemName}>{item.itemName}</Text>
          <Badge 
            size={24} 
            style={styles.quantityBadge}
            onPress={() => handleEditQuantity(item)}
          >
            {item.quantity}
          </Badge>
        </View>
        <IconButton
          icon="delete"
          size={20}
          onPress={() => handleDeleteItem(item.id)}
        />
      </View>

      {item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}

      {item.product && (
        <View style={styles.productInfo}>
          <Text style={styles.price}>
            Precio: ${item.product.price?.toFixed(2) || 'N/A'}
          </Text>
          {item.product.shop && (
            <Text style={styles.shop}>
              Tienda: {item.product.shop.shopName || 'N/A'}
            </Text>
          )}
        </View>
      )}
    </Surface>
  );


  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando detalles de la lista...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <IconButton
          icon="refresh"
          size={24}
          onPress={loadShoppingListDetails}
        />
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <Card style={styles.headerCard}>
          <Card.Content>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>{listName}</Text>
                <Text style={styles.itemCount}>
                  {shoppingList?.items?.length || 0} items en la lista
                </Text>
              </View>
              <IconButton
                icon="refresh"
                size={24}
                onPress={loadShoppingListDetails}
              />
            </View>
          </Card.Content>
        </Card>

        <FlatList
          data={shoppingList?.items || []}
          renderItem={renderItem}
          keyExtractor={item => item.id?.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay items en esta lista</Text>
              <Text style={styles.emptySubtext}>
                Agrega productos desde el catálogo
              </Text>
            </View>
          )}
        />
      </View>

      <Portal>
        <Dialog visible={isEditing} onDismiss={() => setIsEditing(false)}>
          <Dialog.Title>Editar cantidad</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Nueva cantidad"
              value={newQuantity}
              onChangeText={setNewQuantity}
              keyboardType="numeric"
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsEditing(false)}>Cancelar</Button>
            <Button onPress={handleUpdateQuantity}>Guardar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerCard: {
    margin: 16,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // Espacio extra al final
  },
  itemCard: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: 'white',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  quantityBadge: {
    backgroundColor: '#2196f3',
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  productInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 4,
  },
  price: {
    fontSize: 16,
    color: '#2196f3',
    fontWeight: '500',
  },
  shop: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  quantityBadge: {
    backgroundColor: '#2196f3',
    marginLeft: 8,
  },
});

export default ShoppingListDetailScreen;