import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Section - Top 60% */}
      <View style={styles.headerSection}>
        <ImageBackground 
          source={require('../assets/images/beach-bg.jpg')}

          style={styles.backgroundImage}
          resizeMode="cover"
        >
          {/* Semi-transparent white overlay */}
          <View style={styles.overlay} />
          
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Text style={styles.logoV}>V</Text>
              <Text style={styles.logoOya}>oya</Text>
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Content Section - Bottom 40% */}
      <View style={styles.contentSection}>
        {/* Headline */}
        <Text style={styles.headline}>Your Perfect Stay is Just a Click Away!</Text>
        
        {/* Description */}
        <Text style={styles.description}>
          Lorem ipsum dolor sit amet consectetur.{"\n"}
          Lectus dictum ut nunc sodales a.{"\n"}
          Nibh tortor malesuada amet.
        </Text>

        {/* Primary Button */}
        <TouchableOpacity 
          style={styles.registerButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    height: height * 0.6, // 60% of screen
    width: '100%',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)', // Semi-transparent white overlay
  },
logoContainer: {
  position: 'absolute',
  top: 410, 
  left: 0,
  right: 0,
  alignItems: 'center',
},
  logo: {
    fontSize: 72,
    fontWeight: '900',
    letterSpacing: -1,
  },
  logoV: {
    color: '#556EE6', // Vibrant medium blue
  },
  logoOya: {
    color: '#000000', // Black
  },
  contentSection: {
    height: height * 0.4, // 40% of screen
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headline: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666666', // Medium gray
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    letterSpacing: -0.2,
  },
  registerButton: {
    backgroundColor: '#556EE6', // Brand blue
    paddingVertical: 18,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 280,
    shadowColor: '#556EE6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666', // Dark gray
    letterSpacing: -0.2,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#556EE6', // Brand blue
    letterSpacing: -0.2,
  },
});