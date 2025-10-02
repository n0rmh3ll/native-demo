// AppNavigator.js - Fixed version
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Dimensions, View } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import { HotelDetailsScreen, ELYSIUM_GARDENS_DETAILS } from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createMaterialTopTabNavigator();
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const responsiveWidth = (percentage) => {
  return (percentage * screenWidth) / 100;
};

const responsiveHeight = (percentage) => {
  return (percentage * screenHeight) / 100;
};

const responsiveFont = (percentage) => {
  return (percentage * screenWidth) / 100;
};

export default function AppNavigator({ navigation }) {
  const [detailsMode, setDetailsMode] = React.useState({ isDetails: false, details: null });

  const handleSetDetailsMode = React.useCallback((mode) => {
    setDetailsMode(mode);
  }, []);

  if (detailsMode.isDetails) {
    const hotel = detailsMode.details || ELYSIUM_GARDENS_DETAILS;
    return (
      <View style={{ flex: 1 }}>
        <HotelDetailsScreen
          hotel={hotel}
          onBackPress={() => handleSetDetailsMode({ isDetails: false, details: null })}
          onBookPress={() =>
            navigation && typeof navigation.navigate === 'function'
              ? navigation.navigate('BookingStack', { screen: 'BookingInfo', params: { hotel } })
              : null
          }
        />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialLayout={{ width: screenWidth }}
      tabBarPosition="bottom"
      lazy={true}
      screenOptions={({ route }) => ({
        tabBarIndicatorStyle: { height: 0 },
        tabBarStyle: {
          backgroundColor: '#F4F7FF',
          height: responsiveHeight(10), 
          borderTopWidth: 1,
          borderTopColor: '#A2A5AD',
          paddingHorizontal: responsiveWidth(2), 
          elevation: 5,
          shadowOpacity: 0.1,
          position: 'relative',
        },
        tabBarItemStyle: {
          height: responsiveHeight(9), 
          paddingVertical: responsiveHeight(0.5),
        },
        tabBarActiveTintColor: '#4B75E9',
        tabBarInactiveTintColor: '#A2A5AD',
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: responsiveFont(3), 
          fontWeight: '600',
          marginBottom: responsiveHeight(0.5),
        },
        tabBarIconStyle: {
          marginTop: responsiveHeight(0.5), 
          marginBottom: 0,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Calendar') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Favorites') iconName = focused ? 'heart' : 'heart-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={responsiveFont(6.5)} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} setDetailsMode={handleSetDetailsMode} />}
      </Tab.Screen>
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}