import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';

const AddProductForm = ({ closeModal }) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [shop, setShop] = useState('');

  const handleSubmit = () => {
    const parsedPrice = parseFloat(price);

    if (!productName || !description || isNaN(parsedPrice) || !shop) {
      Alert.alert('Error', 'Todos los campos son obligatorios y el precio debe ser un numero');
      return;
    }

    const newProduct = {
      productName,
      description,
      price: parsedPrice,
      shop,
    };
    // Aquí puedes agregar la lógica para enviar los datos al backend
    console.log('Producto agregado:', newProduct);

    fetch('http://localhost:8080/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
    }
    )
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
        
    // Limpiar el formulario después de enviar
    setProductName('');
    setDescription('');
    setPrice('');
    setShop('');

    // Cerrar el modal después de agregar el producto
    closeModal();
  };

  return (
    <View style={styles.form}>
      <Text style={styles.label}>Nombre del Producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre del producto"
        value={productName}
        onChangeText={setProductName}
      />
      
      <Text style={styles.label}>Descripción</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa una descripción"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Precio</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el precio"
        value={price}
        keyboardType="numeric"
        onChangeText={setPrice}
      />

      <Text style={styles.label}>Tienda</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre de la tienda"
        value={shop}
        onChangeText={setShop}
      />

      <Button title="Agregar Producto" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  form: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default AddProductForm;
