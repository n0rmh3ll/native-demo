import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppNavigator from './AppNavigator';
import BookingNavigator from './BookingNavigator';
import LoginScreen from '../screens/LoginScreen';     
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator 
      initialRouteName="Login" 
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="MainTabs" component={AppNavigator} />
      
      {/* Use modal presentation for booking flow */}
      <Stack.Screen 
        name="BookingStack" 
        component={BookingNavigator}
        options={{ 
          presentation: 'modal',
          animation: 'slide_from_bottom'
        }}
      />
    </Stack.Navigator>
  );
}