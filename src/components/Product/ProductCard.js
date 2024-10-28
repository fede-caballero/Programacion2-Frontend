import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Text, IconButton, useTheme } from 'react-native-paper';
import { useProduct } from './ProductContext';

const ProductCard = ({ item }) => {
  const theme = useTheme();
  const { 
    setSelectedProduct, 
    setIsEditModalVisible, 
    setIsDeleteModalVisible 
  } = useProduct();

  const handleEdit = () => {
    setSelectedProduct(item);
    setIsEditModalVisible(true);
  };

  const handleDelete = () => {
    setSelectedProduct(item);
    setIsDeleteModalVisible(true);
  };

  const getCategoryIcon = (category) => {
    const categoryMap = {
      DAIRY: 'cheese',
      MEAT: 'food-steak',
      FRUITS: 'fruit-watermelon',
      VEGETABLES: 'carrot',
      BAKERY: 'bread-slice',
      BEVERAGES: 'bottle-soda',
      FROZEN: 'snowflake',
      CLEANING: 'spray-bottle',
      PERSONAL: 'shower-head'
    };
    return categoryMap[category] || 'package-variant';
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <IconButton
              icon={getCategoryIcon(item.category)}
              size={24}
              iconColor={theme.colors.primary}
              style={styles.categoryIcon}
            />
            <Title style={styles.title}>{item.productName}</Title>
          </View>
          <Text style={styles.price}>$ {item.price?.toFixed(2)}</Text>
        </View>
        
        <Paragraph style={styles.description}>{item.description}</Paragraph>
        
        <View style={styles.footer}>
          <Text style={styles.location}>
            <IconButton icon="map-marker" size={16} /> 
            {item.location}
          </Text>
          <View style={styles.actions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={handleEdit}
              iconColor={theme.colors.primary}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={handleDelete}
              iconColor={theme.colors.error}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    margin: 0,
    padding: 0,
  },
  title: {
    flex: 1,
    marginLeft: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  description: {
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  location: {
    color: '#666',
    flexDirection: 'row',
    alignItems: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProductCard;