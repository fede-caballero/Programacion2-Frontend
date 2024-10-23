import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a Camine Señora</Text>
      <Button mode="contained" onPress={() => navigation.navigate('Products')}>
        Ver Productos
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Shops')}>
        Ver Tiendas
      </Button>
      <Button mode="contained" onPress={() => navigation.navigate('Lists')}>
        Mis Listas de Compras
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default HomeScreen;