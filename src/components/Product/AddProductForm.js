import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, useTheme, Text } from 'react-native-paper';
import { createProduct } from '../../services/api';
import { useProductRefresh } from './ProductContext';

const AddProductForm = ({ closeModal, shopId, shopLocation }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { triggerRefresh } = useProductRefresh();

  const handleSubmit = async () => {
    if (!productName || !description || !price) {
      setError('Por favor complete todos los campos requeridos');
      return;
    }

    if (!shopId) {
      setError('Error: No se encontró la información de la tienda');
      return;
    }

    setIsLoading(true);
    setError('');

    try {

      //debugging
      console.log('Shop Id before submit:', shopId);

      const productData = {
        productName: productName.trim(),
        description: description.trim(),
        price: Number(price),
        location: shopLocation.trim(),
        shop: {
          shopId: shopId // Mantenemos shopId como está, sin intentar parsearlo
        }
      };

      //debugging
      console.log('Submitting product data:', productData);

      await createProduct(productData);
      triggerRefresh();
      closeModal();
    } catch (err) {
    console.error('Error details:', {
      response: err.response?.data,
      status: err.response?.status
    });
    setError(
      err.response?.data || 
      'Error al crear el producto. Por favor, verifique los datos e intente nuevamente.'
    );
  } finally {
    setIsLoading(false);
  }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Nombre del producto"
        value={productName}
        onChangeText={setProductName}
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        left={<TextInput.Icon icon="package" />}
      />

      <TextInput
        label="Descripción"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        multiline
        numberOfLines={3}
        left={<TextInput.Icon icon="text" />}
      />

      <TextInput
        label="Precio"
        value={price}
        onChangeText={text => {
          // Solo permite números y un punto decimal
          const newText = text.replace(/[^0-9.]/g, '');
          if (newText.split('.').length <= 2) { // Evita múltiples puntos decimales
            setPrice(newText);
          }
        }}
        style={[styles.input, { backgroundColor: theme.colors.surface }]}
        mode="outlined"
        keyboardType="decimal-pad"
        left={<TextInput.Icon icon="currency-usd" />}
      />

      <View style={styles.locationContainer}>
        <Text style={styles.locationLabel}>Ubicación:</Text>
        <Text style={styles.locationText}>{shopLocation}</Text>
      </View>

      {error ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text> : null}

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={closeModal}
          style={styles.button}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.button}
          loading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar Producto'}
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
  locationContainer: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 0.48,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default AddProductForm;