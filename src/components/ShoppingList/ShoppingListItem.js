// src/components/ShoppingList/ShoppingListItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShoppingListItem = ({ item }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{item.itemName}</Text>
      <Text style={styles.quantity}>Cantidad: {item.quantity}</Text>
      <Text style={styles.notes}>{item.notes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 14,
    color: '#555',
  },
  notes: {
    fontSize: 14,
    color: '#888',
  },
});

export default ShoppingListItem;
