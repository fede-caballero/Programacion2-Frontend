import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext, AuthProvider } from '../context/AuthContext';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductScreen';
import BuyerProductScreen from '../screens/BuyerProductScreen';
import ShopScreen from '../screens/ShopScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ShoppingListDetailScreen from '../screens/ShoppingListDetailScreen'; // Nueva importación
import UserScreen from '../screens/UserScreen';
import ShoppingListItemForm from '../components/ShoppingList/ShoppingListForm';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddShoppingList from '../screens/AddShoppingList';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const ListStack = createStackNavigator();

const ShoppingListStack = () => (
  <ListStack.Navigator>
    <ListStack.Screen 
      name="ShoppingLists" 
      component={ShoppingListScreen} 
      options={{ headerShown: false }}
    />
    <ListStack.Screen 
      name="AddShoppingList" 
      component={AddShoppingList}
      options={{ title: 'Nueva Lista de Compras' }}
    />
    <ListStack.Screen 
      name="AddToList" 
      component={ShoppingListItemForm}
      options={{ title: 'Agregar Producto' }}
    />
    <ListStack.Screen 
      name="ShoppingListDetail" 
      component={ShoppingListDetailScreen}
      options={({ route }) => ({ 
        title: route.params?.listName || 'Detalles de la lista',
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    />
  </ListStack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserProfile" component={UserScreen} options={{ title: 'Perfil' }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const tabScreenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = focused ? 'home' : 'home-outline';
    } else if (route.name === 'Products') {
      iconName = focused ? 'list' : 'list-outline';
    } else if (route.name === 'Shops') {
      iconName = focused ? 'business' : 'business-outline';
    } else if (route.name === 'Lists') {
      iconName = focused ? 'cart' : 'cart-outline';
    } else if (route.name === 'Profile') {
      iconName = focused ? 'person' : 'person-outline';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  },
  tabBarActiveTintColor: '#007AFF',
  tabBarInactiveTintColor: 'gray',
});

const BuyerTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen 
      name="Products" 
      component={BuyerProductScreen}
      options={{ title: 'Catálogo de Productos' }}
    />
    <Tab.Screen name="Shops" component={ShopScreen} />
    <Tab.Screen name="Lists" component={ShoppingListStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

const CommerceTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen 
      name="Products" 
      component={ProductScreen}
      options={{ title: 'Mis Productos' }}
    />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

const AppContent = () => {
  const { isAuthenticated, userRole, loading } = React.useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <RootStack.Screen name="Auth" component={AuthStack} />
      ) : (
        <RootStack.Screen 
          name="Main" 
          component={userRole === 'BUYER' ? BuyerTabs : CommerceTabs} 
        />
      )}
    </RootStack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default AppNavigator;