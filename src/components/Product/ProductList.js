import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, Text, Button, useTheme } from 'react-native-paper';
import { fetchProductsByShop } from '../../services/api';
import { useProductRefresh } from './ProductContext';

const ProductList = ({ ListHeaderComponent, contentContainerStyle, shopId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const { shouldRefresh } = useProductRefresh();


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

  // Recargar productos cuando cambie el shopId o cuando el componente se monte
  useEffect(() => {
    if (shopId) {
      console.log('Loading products for shop:', shopId);
      loadProducts();
    }
  }, [shopId, shouldRefresh]);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.productName}</Title>
        <Paragraph>{item.description}</Paragraph>
        <Paragraph>Precio: ${item.price?.toFixed(2)}</Paragraph>
        <Text style={styles.location}>{item.location}</Text>
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
      onRefresh={loadProducts} // Permite recargar con pull-to-refresh
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
  }
});

export default ProductList;