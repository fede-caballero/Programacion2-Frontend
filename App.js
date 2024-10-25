//import React from 'react';
//import { NavigationContainer } from '@react-navigation/native';
//import { createNativeStackNavigator } from '@react-navigation/native-stack';

//import HomeScreen from './screens/HomeScreen';
//import LoginScreen from './screens/LoginScreen';
//import RegisterScreen from './screens/RegisterScreen';

//const Stack = createNativeStackNavigator();

//const App = () => {
  //return (
    //<NavigationContainer>
      //<Stack.Navigator initialRouteName="Home">
        //<Stack.Screen name="Home" component={HomeScreen} />
        //<Stack.Screen name="Login" component={LoginScreen} />
        //<Stack.Screen name="Register" component={RegisterScreen} />
      //</Stack.Navigator>
    //</NavigationContainer>
  //);
//};

//export default App;


import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { ProductProvider } from './src/components/Product/ProductContext';

export default function App() {
  return (
    <AuthProvider>
      <ProductProvider> 
        <PaperProvider>
          <AppNavigator />
        </PaperProvider>
      </ProductProvider>
    </AuthProvider>
  );
}