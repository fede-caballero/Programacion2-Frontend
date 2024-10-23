// src/components/Shop/ShopItem.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShopItem = ({ shop }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{shop.shopName}</Text>
      <Text style={styles.location}>{shop.location}</Text>
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
  location: {
    fontSize: 14,
    color: '#888',
  },
});

export default ShopItem;
