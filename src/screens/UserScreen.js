import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext'; // Asegúrate de tener este contexto configurado
import { useNavigation } from '@react-navigation/native';

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
      <Text>Nombre: {user?.name || 'Nombre no disponible' }</Text>
      <Text>Email: {user?.email || 'Email no disponible'}</Text>
      <Button mode="contained" onPress={handleEditProfile}>
        Editar Perfil
      </Button>
      <Button mode="outlined" onPress={handleLogout}>
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default UserScreen;
