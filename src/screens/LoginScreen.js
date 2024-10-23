import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    setError('');
    setIsLoading(true);
  
    try {
      // Convierte el email a minúsculas por consistencia
      const lowercaseEmail = email.toLowerCase();
  
      // Aquí llamamos a la función de login pasando solo email y password
      await login(lowercaseEmail, password);
      
      console.log('Login successful');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize='none'
        keyboardType='email-address'
        disabled={isLoading}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        autoCapitalize='none'
        disabled={isLoading}
        right={<TextInput.Icon
          icon={showPassword ? 'eye' : 'eye-off'}
          onPress={() => setShowPassword(!showPassword)}
        />}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button 
        mode="contained" 
        onPress={handleLogin} 
        style={styles.button}
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={styles.button}
        disabled={isLoading}
      >
        ¿No tienes cuenta? Regístrate
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
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default LoginScreen;