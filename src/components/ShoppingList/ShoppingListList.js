// src/components/ShoppingList/ShoppingListList.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ShoppingListItem from './ShoppingListItem';
import api from '../../services/api';

const ShoppingListList = ({ shoppingListId }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(`/shopping-lists/${shoppingListId}/items`);
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching shopping list items:', error);
      }
    };

    fetchItems();
  }, [shoppingListId]);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => <ShoppingListItem item={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default ShoppingListList;
