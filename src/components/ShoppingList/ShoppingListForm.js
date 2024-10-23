import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Picker } from 'react-native';
import api from '../../services/api';
import { fetchProducts } from '../../services/api';

const ShoppingListItemForm = ({ navigation, shoppingListId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    loadProducts();
  }, []);

  const handleAddItem = async () => {
    try {
      const response = await api.post(`/shopping-lists/${shoppingListId}/items`, {
        itemName: selectedProduct.productName,
        notes: description,
      });

      if (response.status === 201) {
        alert('Item added to shopping list');
        navigation.navigate('ShoppingList', { id: shoppingListId });
      } else {
        alert('Error adding item');
      }
    } catch (error) {
      console.error(error);
      alert('Error connecting to server');
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedProduct}
        onValueChange={(itemValue) => setSelectedProduct(itemValue)}
        style={styles.input}
      >
        {products.map((product) => (
          <Picker.Item
            key={product.productId}
            label={product.productName}
            value={product}
          />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Add to Shopping List" onPress={handleAddItem} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
});

export default ShoppingListItemForm;
