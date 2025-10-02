
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import { HotelDetailsScreen } from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen 
        name="HotelDetails" 
        component={HotelDetailsScreen}
        options={{
          presentation: 'card',
          animation: 'slide_from_right'
        }}
      />
    </Stack.Navigator>
  );
}