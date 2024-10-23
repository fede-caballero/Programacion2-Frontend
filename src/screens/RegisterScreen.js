import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, RadioButton } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState('BUYER');
  const [shopName, setShopName] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    setError('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (role === 'COMMERCE' && (!shopName || !shopLocation)) {
      setError('Por favor, complete la información de la tienda');
      setIsLoading(false);
      return;
    }

    try {
      const lowercaseEmail = email.toLowerCase();
      const userData = { 
        name, 
        email: lowercaseEmail, 
        password, 
        role,
        shop: role === 'COMMERCE' ? { shopName, location: shopLocation } : null
      };
      console.log('Attempting to register with data:', { ...userData, password: '****' });
      
      const response = await register(userData);
      console.log('Registration successful:', response);
      
      alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering user:', error);
      setError(error.message || 'Error al registrar el usuario. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        label="Nombre"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email.trim()}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize='none'
        keyboardType='email-address'
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={!showPassword}
        style={styles.input}
        autoCapitalize='none'
        right={<TextInput.Icon
          icon={showPassword ? 'eye' : 'eye-off'}
          onPress={() => setShowPassword(!showPassword)}
        />}
      />
      <TextInput
        label="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry={!showConfirmPassword}
        style={styles.input}
        autoCapitalize='none'
        right={<TextInput.Icon
          icon={showConfirmPassword ? 'eye' : 'eye-off'}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        />}
      />
      <RadioButton.Group onValueChange={value => setRole(value)} value={role}>
        <View style={styles.radioContainer}>
          <RadioButton.Item label="Comprador" value="BUYER" />
          <RadioButton.Item label="Comercio" value="COMMERCE" />
        </View>
      </RadioButton.Group>
      {role === 'COMMERCE' && (
        <>
          <TextInput
            label="Nombre de la Tienda"
            value={shopName}
            onChangeText={setShopName}
            style={styles.input}
          />
          <TextInput
            label="Ubicación de la Tienda"
            value={shopLocation}
            onChangeText={setShopLocation}
            style={styles.input}
          />
        </>
      )}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Button 
        mode="contained" 
        onPress={handleRegister} 
        style={styles.button}
        disabled={isLoading}
      >
        {isLoading ? 'Registrando...' : 'Registrarse'}
      </Button>
      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={styles.button}
      >
        ¿Ya tienes cuenta? Inicia sesión
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  radioContainer: {
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default RegisterScreen;