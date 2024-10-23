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
import ShopScreen from '../screens/ShopScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import UserScreen from '../screens/UserScreen';
import ShoppingListItemForm from '../components/ShoppingList/ShoppingListForm';
import EditProfileScreen from '../screens/EditProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="UserProfile" component={UserScreen} options={{ title: 'Perfil' }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false}}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
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
    <Tab.Screen name="Products" component={ProductScreen} />
    <Tab.Screen name="Shops" component={ShopScreen} />
    <Tab.Screen name="Lists" component={ShoppingListScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Perfil' }} />
    <Tab.Screen 
    name="Add to List" 
    component={ShoppingListItemForm} 
    options={{ 
      tabBarButton: () => null,
      tabBarStyle: { display: 'none' } 
      }} 
      />
  </Tab.Navigator>
);

const CommerceTabs = () => (
  <Tab.Navigator screenOptions={tabScreenOptions}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Products" component={ProductScreen} />
    <Tab.Screen name="Profile" component={ProfileStack} options={{ title: 'Perfil' }} />
  </Tab.Navigator>
);

const AppContent = () => {
  const { isAuthenticated, userRole, loading } = React.useContext(AuthContext);

  if (loading) {
    // Aquí podrías mostrar un componente de loading
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


/*
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={AppContent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};*/

/*
const AppContent = ({ navigation }) => (
    <AuthProvider navigation={navigation}>
      <AuthConsumer />
    </AuthProvider>
);*/

const AuthConsumer = () => {
  const { isAuthenticated, userRole } = React.useContext(AuthContext);

  return isAuthenticated ? (
    userRole === 'BUYER' ? <BuyerTabs /> : <CommerceTabs />
  ) : (
    <AuthStack />
  );
};

export default AppNavigator;