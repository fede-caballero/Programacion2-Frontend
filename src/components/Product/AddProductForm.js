import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, useTheme, Text, Modal, Portal, Card, IconButton } from 'react-native-paper';
import { createProduct } from '../../services/api';
import { useProductRefresh } from './ProductContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CATEGORIES = [
  { 
    id: 'DAIRY', 
    name: 'Lácteos', 
    icon: 'cheese',
    description: 'Quesos, leche, yogurt, mantequilla, crema, etc.'
  },
  { 
    id: 'MEAT', 
    name: 'Carnes', 
    icon: 'food-steak',
    description: 'Res, cerdo, pollo, pescado, mariscos, etc.'
  },
  { 
    id: 'FRUITS', 
    name: 'Frutas', 
    icon: 'fruit-watermelon',
    description: 'Manzanas, peras, uvas, fresas, platanos, etc.'
  },
  { 
    id: 'VEGETABLES', 
    name: 'Verduras', 
    icon: 'carrot',
    description: 'Lechuga, espinaca, zanahoria, papa, cebolla, etc.'
  },
  { 
    id: 'BAKERY', 
    name: 'Panadería', 
    icon: 'bread-slice',
    description: 'Pan, tortillas, pasteles, galletas, etc.'
  },
  { 
    id: 'BEVERAGES', 
    name: 'Bebidas', 
    icon: 'bottle-soda',
    description: 'Refrescos, jugos, cervezas, vinos, licores, etc.'
  },
  { 
    id: 'FROZEN', 
    name: 'Congelados', 
    icon: 'snowflake',
    description: 'Helados, pizzas, papas, verduras, etc.'
  },
  { 
    id: 'CLEANING', 
    name: 'Limpieza', 
    icon: 'spray-bottle',
    description: 'Detergentes, jabones, cloro, escobas, trapeadores, etc.'
  },
  { 
    id: 'PERSONAL', 
    name: 'Cuidado personal', 
    icon: 'shower-head',
    description: 'Shampoo, jabon, pasta de dientes, papel higienico, etc.'
  }
];

const AddProductForm = ({ closeModal, shopId, shopLocation }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(null);
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();
  const { triggerRefresh } = useProductRefresh();

  const handleSubmit = async () => {
    if (!productName || !description || !price || !category) {
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
      const productData = {
        productName: productName.trim(),
        description: description.trim(),
        price: Number(price),
        location: shopLocation.trim(),
        category: category,
        shop: {
          shopId: shopId
        }
      };

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

  const handleSelectCategory = (selectedCategory) => {
    setCategory(selectedCategory);
    setCategoryModalVisible(false);
  };

  return (
    <>
      <Portal>
        <Modal
          visible={isCategoryModalVisible}
          onDismiss={() => {
            setCategoryModalVisible(false);
            if (!category) {
              closeModal();
            }
          }}
          contentContainerStyle={styles.categoryModalContainer}
        >
          <Card style={styles.categoryCard}>
            <Card.Content>
              <View style={styles.categoryModalHeader}>
                <Text style={styles.categoryModalTitle}>Selecciona una categoría</Text>
                <IconButton
                  icon="close"
                  size={24}
                  onPress={() => {
                    setCategoryModalVisible(false);
                    closeModal();
                  }}
                />
              </View>
              <ScrollView style={styles.categoriesList}>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat.id}
                    mode="outlined"
                    onPress={() => handleSelectCategory(cat.id)}
                    style={styles.categoryButton}
                    icon={cat.icon}
                  >
                    {cat.name}
                  </Button>
                ))}
              </ScrollView>
            </Card.Content>
          </Card>
        </Modal>
      </Portal>

      {!isCategoryModalVisible && (
        <View style={styles.container}>
          <View style={styles.selectedCategoryContainer}>
            <Text style={styles.selectedCategoryLabel}>Categoría seleccionada:</Text>
            <Text style={styles.selectedCategoryText}>
              {CATEGORIES.find(cat => cat.id === category)?.name}
            </Text>
            <Button
              mode="text"
              onPress={() => setCategoryModalVisible(true)}
              style={styles.changeButton}
            >
              Cambiar
            </Button>
          </View>

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
              const newText = text.replace(/[^0-9.]/g, '');
              if (newText.split('.').length <= 2) {
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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  categoryModalContainer: {
    padding: 20,
  },
  categoryCard: {
    maxHeight: '80%',
  },
  categoryModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  categoriesList: {
    maxHeight: '80%',
  },
  categoryButton: {
    marginBottom: 8,
  },
  selectedCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  selectedCategoryLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  selectedCategoryText: {
    fontSize: 14,
    flex: 1,
  },
  changeButton: {
    marginLeft: 8,
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