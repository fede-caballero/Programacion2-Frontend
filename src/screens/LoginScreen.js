import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import { loginUser } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definimos los colores del tema
const theme = {
  colors: {
    primary: '#1E4D8C',      // Azul marino profundo
    secondary: '#34A853',    // Verde
    accent: '#4285F4',       // Azul brillante
    background: '#F8FAFD',   // Gris muy claro
    surface: '#FFFFFF',
    error: '#DC3545',
    text: '#1A1F36',        
    disabled: '#A0AEC0',
    placeholder: '#718096',
  },
};

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
        const lowercaseEmail = email.toLowerCase();
        const response = await login(lowercaseEmail, password);
        
        // Validar que la respuesta contenga el token
        if (!response || !response.token) {
            throw new Error('Respuesta de login inválida: token no recibido');
        }

        // Procesar los datos del usuario si el token es válido
        const userData = {
            userId: response.userId || '',
            name: response.name || '',
            email: response.email || '',
            role: response.role || '',
            shop: response.role === 'COMMERCE' && response.shop ? {
                shopId: response.shop.shopId || '',
                shopName: response.shop.shopName || '',
                location: response.shop.location || ''
            } : null
        };

        // Guardar en AsyncStorage
        if (typeof response.token === 'string' && response.token.length > 0) {
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('userToken', response.token);
            console.log('Login successful');
            navigation.navigate('Home');
        } else {
            throw new Error('Token inválido recibido del servidor');
        }
    } catch (error) {
        console.error('Error logging in:', error);
        setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
        setIsLoading(false);
    }
};


  return (
    <View style={styles.container}>
      {/* Logo y encabezado */}
      <View style={styles.logoContainer}>
        <Avatar.Icon 
          size={80} 
          icon="shopping" 
          style={styles.logo} 
          color={theme.colors.surface}
          theme={{ colors: theme.colors }}
        />
        <Text style={styles.brandName}>Camine Señora</Text>
        <Text style={styles.tagline}>Tu compañero financiero de confianza</Text>
      </View>

      {/* Contenedor del formulario */}
      <View style={styles.formContainer}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          autoCapitalize='none'
          keyboardType='email-address'
          disabled={isLoading}
          left={<TextInput.Icon icon="email" />}
          theme={{ colors: theme.colors }}
        />

        <TextInput
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
          autoCapitalize='none'
          disabled={isLoading}
          left={<TextInput.Icon icon="lock" />}
          right={<TextInput.Icon
            icon={showPassword ? 'eye' : 'eye-off'}
            onPress={() => setShowPassword(!showPassword)}
          />}
          theme={{ colors: theme.colors }}
        />

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}

        <Button 
          mode="contained" 
          onPress={handleLogin} 
          style={styles.loginButton}
          disabled={isLoading}
          loading={isLoading}
          theme={{ colors: theme.colors }}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>

        <Text style={styles.divider}>o continúa con</Text>

        <View style={styles.socialButtons}>
          <Button 
            mode="outlined" 
            style={styles.socialButton}
            icon="google"
            theme={{ colors: theme.colors }}
          >
            Google
          </Button>
          <Button 
            mode="outlined" 
            style={styles.socialButton}
            icon="apple"
            theme={{ colors: theme.colors }}
          >
            Apple
          </Button>
        </View>

        <Button
          mode="text"
          onPress={() => navigation.navigate('Register')}
          style={styles.registerButton}
          disabled={isLoading}
          theme={{ colors: theme.colors }}
        >
          ¿No tienes cuenta? Regístrate
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 48,
  },
  logo: {
    backgroundColor: theme.colors.primary,
  },
  brandName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: theme.colors.placeholder,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  divider: {
    textAlign: 'center',
    marginVertical: 16,
    color: theme.colors.placeholder,
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  socialButton: {
    flex: 0.48,
    borderColor: theme.colors.primary,
  },
  registerButton: {
    marginTop: 8,
  },
});

export default LoginScreen;