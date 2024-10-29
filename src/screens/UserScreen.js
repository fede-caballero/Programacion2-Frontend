import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de tener este contexto configurado
import { useNavigation } from '@react-navigation/native';

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

const UserScreen = () => {
  const { user, logout } = useContext(AuthContext); // Uso del contexto para logout
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile'); // Navegar a la pantalla de edición de perfil
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil de Usuario</Text>
      <Text style={styles.infoText}>Nombre: {user?.name || 'Nombre no disponible'}</Text>
      <Text style={styles.infoText}>Email: {user?.email || 'Email no disponible'}</Text>
      <Button mode="contained" onPress={handleEditProfile} style={styles.button}>
        Editar Perfil
      </Button>
      <Button mode="contained" onPress={handleLogout} style={[styles.button, styles.logoutButton]}>
        Cerrar Sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    backgroundColor: theme.colors.primary,
  },
  logoutButton: {
    backgroundColor: theme.colors.error,
    color: theme.colors.surface,
  },
});

export default UserScreen;