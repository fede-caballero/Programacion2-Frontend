// src/components/Shop/ShopList.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ShopItem from './ShopItem';
import { fetchShops } from '../../services/api';

const ShopList = () => {
  const [shops, setShops] = useState([]);

  useEffect(() => {
    const loadShops = async () => {
      try {
        const response = await fetchShops();
        setShops(response);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };

    loadShops();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={shops}
        renderItem={({ item }) => <ShopItem shop={item} />}
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

export default ShopList;
