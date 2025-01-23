import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from './hooks/useAuth';
import SignIn from './screens/SignIn';
import Register from './screens/Register';
import DeliveryHome from './screens/DeliveryScreen/DeliveryHome';
import SalesHome from './screens/SalesScreen/SalesHome';
import MapPlan from './screens/DeliveryScreen/MapPlan';
import WelcomeScreen from './screens/WelcomeScreen';
import SaleDetails from './components/SaleDetails';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      {!user ? (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="HomeScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="DeliveryHome" component={DeliveryHome} />
          <Stack.Screen name="MapPlan" component={MapPlan} />
          <Stack.Screen name="SalesHome" component={SalesHome} />
          <Stack.Screen name="SaleDetails" component={SaleDetails} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
