import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { createShoppingList } from '../services/api';

const AddShoppingList = ({ navigation }) => {
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateList = async () => {
    if (!listName.trim()) {
      setError('El nombre de la lista es obligatorio');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newList = {
        listName: listName.trim(),
        description: description.trim() || null // Si está vacío, enviar null
      };

      const response = await createShoppingList(newList);
      console.log('Lista creada exitosamente:', response);
      
      // Esperar un momento antes de navegar de vuelta
      setTimeout(() => {
        navigation.goBack();
      }, 100);
    } catch (err) {
      let errorMessage = 'Error al crear la lista de compras';
      
      if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || errorMessage;
      }
      
      setError(errorMessage);
      console.error('Error detallado al crear la lista:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Nueva Lista de Compras</Text>
      
      <TextInput
        label="Nombre de la lista"
        value={listName}
        onChangeText={setListName}
        style={styles.input}
        mode="outlined"
        error={!!error && !listName.trim()}
      />

      <TextInput
        label="Descripción (opcional)"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : null}

      <Button
        mode="contained"
        onPress={handleCreateList}
        loading={loading}
        disabled={loading || !listName.trim()}
        style={styles.button}
      >
        {loading ? 'Creando...' : 'Crear Lista'}
      </Button>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={[styles.button, styles.cancelButton]}
        disabled={loading}
      >
        Cancelar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 8,
  },
  cancelButton: {
    marginTop: 8,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default AddShoppingList;