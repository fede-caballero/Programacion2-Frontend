import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Avatar, Card, RadioButton } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';

// Usamos el mismo tema para mantener consistencia
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
  
    try {
      if (!password || password.trim() === '') {
        setError('La contraseña es requerida');
        setIsLoading(false);
        return;
      }
  
      const userData = {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: password,
        role: role,
        shop: role === 'COMMERCE' ? {
          shopName: shopName.trim(),
          location: shopLocation.trim()
        } : null
      };
  
      // Log para debug (sin mostrar la contraseña)
      console.log('Registering with data:', {
        ...userData,
        password: '[PRESENT]'
      });
  
      const response = await register(userData);
      console.log('Registration successful');
      
      alert('Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al registrar el usuario';
      console.error('Registration error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo y encabezado */}
      <View style={styles.logoContainer}>
        <Avatar.Icon 
          size={80} 
          icon="account-plus" 
          style={styles.logo}
          color={theme.colors.surface}
          theme={{ colors: theme.colors }}
        />
        <Text style={styles.brandName}>Crear Cuenta</Text>
        <Text style={styles.tagline}>Únete a nuestra comunidad</Text>
      </View>

      {/* Formulario */}
      <Card style={styles.formContainer}>
        <Card.Content>
          {/* Indicador de progreso */}
          <View style={styles.progressBar}>
            <View style={styles.progressStep}>
              <View style={[styles.stepCircle, styles.activeStep]}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.stepText}>Datos</Text>
            </View>
            <View style={[styles.progressLine, styles.completedLine]} />
            <View style={styles.progressStep}>
              <View style={[styles.stepCircle, role === 'COMMERCE' && shopName ? styles.activeStep : null]}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.stepText}>Perfil</Text>
            </View>
          </View>

          <TextInput
            label="Nombre completo"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="account" />}
            theme={{ colors: theme.colors }}
          />

          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            autoCapitalize='none'
            keyboardType='email-address'
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
            left={<TextInput.Icon icon="lock" />}
            right={<TextInput.Icon
              icon={showPassword ? "eye" : "eye-off"}
              onPress={() => setShowPassword(!showPassword)}
            />}
            theme={{ colors: theme.colors }}
          />

          <TextInput
            label="Confirmar Contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.input}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock-check" />}
            right={<TextInput.Icon
              icon={showConfirmPassword ? "eye" : "eye-off"}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />}
            theme={{ colors: theme.colors }}
          />

          <Text style={styles.sectionTitle}>Tipo de cuenta</Text>
          <View style={styles.roleContainer}>
            <Card 
              style={[styles.roleCard, role === 'BUYER' && styles.selectedRole]} 
              onPress={() => setRole('BUYER')}
            >
              <Card.Content style={styles.roleCardContent}>
                <Avatar.Icon 
                  size={40} 
                  icon="shopping" 
                  style={styles.roleIcon}
                  color={role === 'BUYER' ? theme.colors.primary : theme.colors.disabled}
                />
                <Text style={styles.roleText}>Comprador</Text>
              </Card.Content>
            </Card>

            <Card 
              style={[styles.roleCard, role === 'COMMERCE' && styles.selectedRole]}
              onPress={() => setRole('COMMERCE')}
            >
              <Card.Content style={styles.roleCardContent}>
                <Avatar.Icon 
                  size={40} 
                  icon="store" 
                  style={styles.roleIcon}
                  color={role === 'COMMERCE' ? theme.colors.primary : theme.colors.disabled}
                />
                <Text style={styles.roleText}>Comercio</Text>
              </Card.Content>
            </Card>
          </View>

          {role === 'COMMERCE' && (
            <View style={styles.shopSection}>
              <TextInput
                label="Nombre de la Tienda"
                value={shopName}
                onChangeText={setShopName}
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="store" />}
                theme={{ colors: theme.colors }}
              />
              <TextInput
                label="Ubicación de la Tienda"
                value={shopLocation}
                onChangeText={setShopLocation}
                style={styles.input}
                mode="outlined"
                left={<TextInput.Icon icon="map-marker" />}
                theme={{ colors: theme.colors }}
              />
            </View>
          )}

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button 
            mode="contained" 
            onPress={handleRegister}
            style={styles.registerButton}
            loading={isLoading}
            disabled={isLoading}
            theme={{ colors: theme.colors }}
          >
            {isLoading ? 'Registrando...' : 'Crear cuenta'}
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
            theme={{ colors: theme.colors }}
          >
            ¿Ya tienes cuenta? Inicia sesión
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  logo: {
    backgroundColor: theme.colors.primary,
  },
  brandName: {
    fontSize: 28,
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
    margin: 24,
    borderRadius: 12,
    elevation: 4,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  progressStep: {
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.disabled,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStep: {
    backgroundColor: theme.colors.primary,
  },
  stepNumber: {
    color: 'white',
    fontSize: 16,
  },
  stepText: {
    marginTop: 4,
    fontSize: 12,
    color: theme.colors.text,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: theme.colors.disabled,
    marginHorizontal: 8,
  },
  completedLine: {
    backgroundColor: theme.colors.primary,
  },
  input: {
    marginBottom: 16,
    backgroundColor: theme.colors.surface,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  roleCard: {
    flex: 0.48,
  },
  selectedRole: {
    backgroundColor: `${theme.colors.primary}10`,
    borderColor: theme.colors.primary,
    borderWidth: 1,
  },
  roleCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  roleIcon: {
    backgroundColor: 'transparent',
  },
  roleText: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  shopSection: {
    backgroundColor: `${theme.colors.primary}05`,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  registerButton: {
    padding: 4,
    marginBottom: 12,
  },
  loginLink: {
    marginTop: 8,
  },
});

export default RegisterScreen;