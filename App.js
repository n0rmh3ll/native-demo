import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './navigation/AuthNavigator';
import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';

export default function App() {
  const [appState, setAppState] = useState('splash'); // splash -> onboarding -> main

  const handleSplashFinish = () => {
    setAppState('onboarding');
  };

  const handleOnboardingFinish = () => {
    setAppState('main');
  };

  // Show Splash Screen
  if (appState === 'splash') {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show Onboarding Screens
  if (appState === 'onboarding') {
    return <OnboardingScreen onFinish={handleOnboardingFinish} />;
  }

  // Show Main App with Navigation
  return (
    <NavigationContainer>
      <AuthNavigator />
    </NavigationContainer>
  );
}