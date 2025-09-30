import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const { width: screenWidth } = Dimensions.get('window');

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItem,
          tabBarActiveTintColor: '#4B75E9',
          tabBarInactiveTintColor: '#A2A5AD',
          tabBarShowLabel: true,
          headerShown: false, // Hide the header for all screens
          headerStyle: { 
            backgroundColor: '#181818',
            height: 100,
          },
          headerTintColor: '#F9F9F9',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 20,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
            marginBottom: 8,
          },
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Calendar') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Favorites') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Tab.Screen 
          name="Calendar" 
          component={CalendarScreen}
        />
        <Tab.Screen 
          name="Favorites" 
          component={FavoritesScreen}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F4F7FF',
    width: screenWidth, // Full width of the screen
    height: 90, // adjust height as needed
    borderTopWidth: 1,
    borderTopColor: '#A2A5AD',
    opacity: 1,
    position: 'absolute',
    bottom: 0,
  },
  tabBarItem: {
    height: 90,
    paddingVertical: 10,
  },
});