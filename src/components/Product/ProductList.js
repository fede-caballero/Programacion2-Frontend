import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Text, Button, useTheme, IconButton } from 'react-native-paper';
import { fetchProductsByShop } from '../../services/api';
import { useProductRefresh, useProduct } from './ProductContext';
import { ProductCard } from './ProductCard';

const ProductList = ({ ListHeaderComponent, contentContainerStyle, shopId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { shouldRefresh } = useProductRefresh();
  const { 
    setSelectedProduct, 
    setIsEditModalVisible, 
    setIsDeleteModalVisible 
  } = useProduct();
  

  const loadProducts = async () => {
    try {
      console.log('Fetching products for shopId:', shopId);
      
      if (!shopId) {
        throw new Error('No se encontró ID de la tienda');
      }

      setLoading(true);
      const productsData = await fetchProductsByShop(shopId);
      console.log('Products received:', productsData);
      
      setProducts(productsData || []);
      setError(null);
    } catch (err) {
      console.error('Error loading products:', err);
      setError(err.message || 'Error al cargar los productos');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedProduct(item);
    setIsEditModalVisible(true);
  };

  const handleDelete = (item) => {
    setSelectedProduct(item);
    setIsDeleteModalVisible(true);
  };

  useEffect(() => {
    if (shopId) {
      console.log('Loading products for shop:', shopId);
      loadProducts();
    }
  }, [shopId, shouldRefresh]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.title}>{item.productName}</Title>
          <View style={styles.actionButtons}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor={theme.colors.primary}
              onPress={() => handleEdit(item)}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor={theme.colors.error}
              onPress={() => handleDelete(item)}
            />
          </View>
        </View>
        <Paragraph style={styles.description}>{item.description}</Paragraph>
        <View style={styles.priceLocationContainer}>
          <Paragraph style={styles.price}>Precio: ${item.price?.toFixed(2)}</Paragraph>
          <Text style={styles.location}>
            <IconButton 
              icon="map-marker" 
              size={16} 
              style={styles.locationIcon}
            /> 
            {item.location}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );


  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Cargando productos...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={loadProducts}
          style={styles.retryButton}
        >
          Reintentar
        </Button>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      renderItem={renderItem}
      keyExtractor={item => item.productId?.toString() || Math.random().toString()}
      ListHeaderComponent={ListHeaderComponent}
      contentContainerStyle={[
        contentContainerStyle,
        products.length === 0 && styles.emptyListContent
      ]}
      style={styles.list}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        </View>
      }
      refreshing={loading}
      onRefresh={loadProducts}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  location: {
    marginTop: 8,
    color: '#666',
    fontStyle: 'italic',
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  description: {
    marginBottom: 8,
    color: '#666',
  },
  priceLocationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  location: {
    color: '#666',
    fontStyle: 'italic',
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    margin: 0,
    padding: 0,
  },
  card: {
    margin: 8,
    elevation: 2,
    backgroundColor: '#fff'
  },
});

export default ProductList;