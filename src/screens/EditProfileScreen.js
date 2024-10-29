import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { updateUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const theme = {
  colors: {
    primary: '#1E4D8C',
    secondary: '#34A853',
    accent: '#4285F4',
    background: '#F8FAFD',
    surface: '#FFFFFF',
    error: '#DC3545',
    text: '#1A1F36',
    disabled: '#A0AEC0',
    placeholder: '#718096',
  },
};

const EditProfileScreen = ({ navigation }) => {
  const { user, setUser } = useContext(AuthContext);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      // Verificamos todos los posibles nombres del ID
      const userId = user?.id || user?.userId || user?.user_id;
      
      if (!userId) {
        console.log('User object:', user); // Para debugging
        setError('No se pudo identificar el usuario');
        return;
      }

      const updatedUser = {
        name,
        email,
        ...(password ? { password } : {})
      };

      await updateUser(userId, updatedUser);
      
      // Actualizar el contexto manteniendo todos los campos originales
      setUser({
        ...user,
        name: updatedUser.name,
        email: updatedUser.email
      });

      alert('Perfil actualizado con éxito');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || 'Error actualizando el perfil. Por favor, inténtelo de nuevo.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>
      {/* Agrega un texto para debugging */}
      <Text style={styles.debugText}>ID Usuario: {user?.id || user?.userId || user?.user_id || 'No disponible'}</Text>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        label="Nueva Contraseña (dejar en blanco para no cambiar)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button 
        mode="contained" 
        onPress={handleUpdateProfile} 
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        Actualizar Perfil
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: theme.colors.text,
  },
  input: {
    marginBottom: 10,
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 10,
    backgroundColor: theme.colors.primary,
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 10,
  },
  debugText: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 10,
  },
});

export default EditProfileScreen;