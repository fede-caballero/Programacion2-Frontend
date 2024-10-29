import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { 
  Text, 
  FAB, 
  List, 
  Surface, 
  IconButton,
  ActivityIndicator 
} from 'react-native-paper';
import { fetchShoppingLists, deleteShoppingListByIdAndUser } from '../services/api';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShoppingListScreen = ({ navigation }) => {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error('Error loading shopping lists:', error);
      setShoppingLists([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadShoppingLists();
    }, [])
  );

  const handleDeleteList = (listId, listName) => {
    Alert.alert(
      'Eliminar Lista',
      `¿Estás seguro que deseas eliminar la lista "${listName}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteShoppingListByIdAndUser(listId);
              await loadShoppingLists();
              Alert.alert('Éxito', 'Lista eliminada correctamente');
            } catch (error) {
              console.error('Error deleting shopping list:', error);
              Alert.alert('Error', 'No se pudo eliminar la lista');
            }
          }
        }
      ]
    );
  };

  const renderShoppingList = useCallback(({ item }) => {
    if (!item?.id) return null;
  
    return (
      <Surface style={styles.listItem}>
        <List.Item
          title={item.listName || 'Lista sin nombre'}
          description={item.description}
          onPress={() => navigation.navigate('ShoppingListDetail', {
            listId: item.id,
            listName: item.listName
          })}
          left={props => <List.Icon {...props} icon="clipboard-list" />}
          right={() => (
            <View style={styles.listItemRight}>
              <Text style={styles.itemCount}>
                {(item.items?.length || 0)} items
              </Text>
              <IconButton
                icon="delete"
                iconColor="#FF0000"
                size={24}
                onPress={() => handleDeleteList(item.id, item.listName)}
              />
              <IconButton
                icon="chevron-right"
                size={24}
                onPress={() => navigation.navigate('ShoppingListDetail', {
                  listId: item.id,
                  listName: item.listName
                })}
              />
            </View>
          )}
        />
      </Surface>
    );
  }, [navigation]);

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listSection: {
    flex: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
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
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCount: {
    marginRight: 10,
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196f3',
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
  }
});

export default ShoppingListScreen;