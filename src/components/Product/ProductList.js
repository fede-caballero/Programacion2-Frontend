import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { Text, Card, IconButton, Searchbar } from 'react-native-paper';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const ProductItem = ({ item, onEdit, onDelete, isCommerce }) => (
  <Card style={styles.card}>
    <Card.Content>
      <Text variant="titleLarge">{item.productName}</Text>
      <Text variant="bodyMedium">{item.description}</Text>
      <Text variant="bodyMedium">Precio: ${item.price}</Text>
      <Text variant="bodyMedium">Tienda: {item.shop?.shopName || 'No asignado'}</Text>
    </Card.Content>
    {isCommerce && (
      <Card.Actions>
        <IconButton icon="pencil" onPress={() => onEdit(item)} />
        <IconButton icon="delete" onPress={() => onDelete(item.productId)} />
      </Card.Actions>
    )}
  </Card>
);

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [productName, setProductName] = useState(product?.productName || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [location, setLocation] = useState(product?.location || '');

  const handleSubmit = () => {
    onSubmit({
      ...product,
      productName,
      description,
      price: parseFloat(price),
      location,
    });
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <Button title={product ? "Update Product" : "Add Product"} onPress={handleSubmit} />
      <Button title="Cancel" onPress={onCancel} />
    </View>
  );
};

const ProductList = () => {
  const { userRole } = useContext(AuthContext);
  const isCommerce = userRole === 'COMMERCE';
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Filter products based on search query
    const filtered = products.filter(product => 
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shop?.shopName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      Alert.alert('Error', 'Unable to load products');
    }
  };

  const handleAddOrUpdateProduct = async (product) => {
    try {
      let response;
      if (editingProduct) {
        response = await updateProduct(product);
      } else {
        response = await createProduct(product);
      }

      if (response.status === 200 || response.status === 201) {
        Alert.alert('Success', `Product ${editingProduct ? 'updated' : 'added'} successfully`);
        setShowForm(false);
        setEditingProduct(null);
        loadProducts();
      } else {
        Alert.alert('Error', `Error ${editingProduct ? 'updating' : 'adding'} product`);
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await deleteProduct(productId);
      if (response.status === 200) {
        Alert.alert('Success', 'Product deleted successfully');
        loadProducts();
      } else {
        Alert.alert('Error', 'Error deleting product');
      }
    } catch (error) {
      console.error('Error connecting to server:', error);
      Alert.alert('Error', 'Unable to connect to server');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar productos..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductItem
            item={item}
            onEdit={handleEdit}
            onDelete={handleDeleteProduct}
            isCommerce={isCommerce}
          />
        )}
        keyExtractor={(item) => item.productId.toString()}
      />

      {isCommerce && (
        showForm ? (
          <ProductForm
            product={editingProduct}
            onSubmit={handleAddOrUpdateProduct}
            onCancel={() => {
              setShowForm(false);
              setEditingProduct(null);
            }}
          />
        ) : (
          <Button title="Add Product" onPress={() => setShowForm(true)} />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchBar: {
    marginBottom: 10,
  },
  card: {
    marginBottom: 10,
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default ProductList;