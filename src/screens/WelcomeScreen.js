import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { LinearGradient } from 'expo-linear-gradient';

const WelcomeScreen = ({ navigation }) => {
  const [progress, setProgress] = useState(0);

  // Separar la navegación en su propia función
  const navigateToLogin = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }, [navigation]);

  // Manejar el progreso
  useEffect(() => {
    let interval;
    
    // Solo iniciar el intervalo si el progreso no está completo
    if (progress < 1) {
      interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 0.01, 1));
      }, 50);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [progress]);

  // Efecto separado para manejar la navegación
  useEffect(() => {
    if (progress >= 1) {
      // Pequeño timeout para asegurar que la barra se muestre completa
      const timeout = setTimeout(() => {
        navigateToLogin();
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [progress, navigateToLogin]);

  return (
    <LinearGradient 
      colors={['#ff9966', '#ff5e62']} 
      style={styles.container}
    >
      <View style={styles.content}>
        <Image
          source={require('../../images/lita.jpeg')}
          style={styles.image}
          resizeMode="cover"
        />
        <Text style={styles.title}>Camine Señora</Text>
        <ProgressBar 
          progress={progress} 
          width={200} 
          color="#fff"
          borderColor="#fff"
          unfilledColor="rgba(255,255,255,0.3)"
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    borderRadius: 75, // Hace la imagen circular
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default WelcomeScreen;