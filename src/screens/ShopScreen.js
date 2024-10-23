import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, FAB } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const ShopScreen = ({ route }) => {
  const [products, setProducts] = useState([]);
  const [isCommerce, setIsCommerce] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    price: '',
    location: '',
    image: null
  });

  useEffect(() => {
    // Here you would check if the user is of type 'commerce'
    // For this example, we'll assume they are
    setIsCommerce(true);

    // Fetch products for this shop
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await axios.get(`/api/shops/${route.params.shopId}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        shop: {
          id: route.params.shopId,
          location: newProduct.location
        }
      };

      // Replace with your actual API endpoint
      await axios.post('/api/products', productData);
      
      // Refresh product list
      fetchProducts();
      
      // Reset form
      setNewProduct({
        productName: '',
        description: '',
        price: '',
        location: '',
        image: null
      });
      setShowAddProduct(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setNewProduct({ ...newProduct, image: result.uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tienda</Text>
      <ScrollView>
        {products.map((product) => (
          <Card key={product.id} style={styles.card}>
            <Card.Title title={product.productName} subtitle={`$${product.price}`} />
            <Card.Content>
              <Text>{product.description}</Text>
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
      {isCommerce && (
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => setShowAddProduct(true)}
        />
      )}
      {showAddProduct && (
        <View style={styles.addProductForm}>
          <TextInput
            label="Nombre del producto"
            value={newProduct.productName}
            onChangeText={(text) => setNewProduct({ ...newProduct, productName: text })}
          />
          <TextInput
            label="Descripción"
            value={newProduct.description}
            onChangeText={(text) => setNewProduct({ ...newProduct, description: text })}
          />
          <TextInput
            label="Precio"
            value={newProduct.price}
            onChangeText={(text) => setNewProduct({ ...newProduct, price: text })}
            keyboardType="numeric"
          />
          <TextInput
            label="Ubicación"
            value={newProduct.location}
            onChangeText={(text) => setNewProduct({ ...newProduct, location: text })}
          />
          <Button onPress={pickImage}>Seleccionar imagen</Button>
          <Button onPress={handleAddProduct}>Agregar producto</Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  card: {
    marginBottom: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  addProductForm: {
    padding: 20,
    backgroundColor: 'white',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default ShopScreen;