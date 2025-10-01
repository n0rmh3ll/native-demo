import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const responsiveWidth = (percentage) => (percentage * screenWidth) / 100;
const responsiveHeight = (percentage) => (percentage * screenHeight) / 100;
const responsiveFont = (percentage) => (percentage * screenWidth) / 100;

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#F4F7FF',
          width: screenWidth,
          height: responsiveHeight(10), 
          borderTopWidth: 1,
          borderTopColor: '#A2A5AD',
          opacity: 1,
          position: 'absolute',
          bottom: 0,
          paddingHorizontal: responsiveWidth(2),
        },
        tabBarItemStyle: {
          height: responsiveHeight(8),
          paddingVertical: responsiveHeight(1),
        },
        tabBarActiveTintColor: '#4B75E9',
        tabBarInactiveTintColor: '#A2A5AD',
        tabBarShowLabel: true,
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: responsiveFont(3), 
          fontWeight: '600',
          marginBottom: responsiveHeight(0.9),
          fontFamily: 'Poppins',
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

          return <Ionicons name={iconName} size={responsiveFont(4.5)} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}