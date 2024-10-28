import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, HelperText, ActivityIndicator } from 'react-native-paper';
import { useProduct } from './ProductContext';
import { deleteProduct } from '../../services/api';

const DeleteProductModal = ({ product, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { triggerRefresh } = useProduct();

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError('');

      await deleteProduct(product.productId);
      triggerRefresh();
      closeModal();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err.response?.data?.error || err.message || 'Error al eliminar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        ¿Está seguro que desea eliminar el producto "{product.productName}"?
      </Text>
      
      <Text style={styles.warning}>
        Esta acción no se puede deshacer.
      </Text>

      {error ? <HelperText type="error" visible={true}>{error}</HelperText> : null}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleDelete}
          style={styles.deleteButton}
          disabled={loading}
          buttonColor="#dc3545"
        >
          {loading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            'Eliminar'
          )}
        </Button>
        <Button
          mode="outlined"
          onPress={closeModal}
          style={styles.cancelButton}
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
  message: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  warning: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  deleteButton: {
    minWidth: 120,
  },
  cancelButton: {
    minWidth: 120,
  },
});

export default DeleteProductModal;