import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { useProduct } from './ProductContext';
import { updateProduct } from '../../services/api';

const EditProductForm = ({ product, closeModal, shopId, shopLocation }) => {
  const [formData, setFormData] = useState({
    productName: product.productName || '',
    description: product.description || '',
    price: product.price?.toString() || '',
    location: shopLocation || '',
    category: product.category || 'FOOD'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { triggerRefresh } = useProduct();

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      // Validaciones básicas
      if (!formData.productName.trim() || !formData.description.trim() || !formData.price) {
        throw new Error('Todos los campos son obligatorios');
      }

      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        throw new Error('El precio debe ser un número válido mayor a 0');
      }

      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        shop: {
          id: shopId
        }
      };

      await updateProduct(product.productId, updateData);
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.response?.data?.error || err.message || 'Error al actualizar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nombre del producto"
        value={formData.productName}
        onChangeText={(text) => setFormData({ ...formData, productName: text })}
        mode="outlined"
        style={styles.input}
      />
      <TextInput
        label="Descripción"
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        mode="outlined"
        multiline
        numberOfLines={3}
        style={styles.input}
      />
      <TextInput
        label="Precio"
        value={formData.price}
        onChangeText={(text) => setFormData({ ...formData, price: text })}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        label="Ubicación"
        value={formData.location}
        onChangeText={(text) => setFormData({ ...formData, location: text })}
        mode="outlined"
        style={styles.input}
      />

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            'Guardar Cambios'
          )}
        </Button>
        <Button
          mode="outlined"
          onPress={closeModal}
          style={styles.button}
          disabled={loading}
        >
          Cancelar
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    minWidth: 120,
  },
});

export default EditProductForm;