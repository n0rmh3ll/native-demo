import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import { HotelDetailsScreen } from '../screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function HomeStackNavigator({ route, setDetailsMode, navigation }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain">
        {(props) => <HomeScreen {...props} setDetailsMode={setDetailsMode} />}
      </Stack.Screen>
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