import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      
      <View style={styles.headerSection}>
        <ImageBackground 
          source={require('../assets/images/beach-bg.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>
              <Text style={styles.logoV}>V</Text>
              <Text style={styles.logoOya}>oya</Text>
            </Text>
          </View>
        </ImageBackground>
      </View>

    
      <View style={styles.contentSection}>
        <View style={styles.contentWrapper}>
          
          <Text style={styles.headline}>Your Perfect Stay is Just a Click Away!</Text>
          
          
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur.{"\n"}
            Lectus dictum ut nunc sodales a.{"\n"}
            Nibh tortor malesuada amet.
          </Text>

       
          <TouchableOpacity 
            style={styles.registerButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>
        </View>

       
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
    height: height * 0.45, 
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
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  logoContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  logo: {
    fontSize: width * 0.16, 
    fontWeight: '900',
    letterSpacing: -1,
    fontFamily: 'Poppins',
  },
  logoV: {
    color: '#556EE6',
  },
  logoOya: {
    color: '#000000',
  },
  contentSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    justifyContent: 'space-between', 
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headline: {
    fontSize: width * 0.06, 
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: width * 0.08,
    fontFamily: 'Poppins',
    maxWidth: '90%',
  },
  description: {
    fontSize: width * 0.04, 
    fontWeight: '600',
    color: '#A2A5AD',
    textAlign: 'center',
    lineHeight: width * 0.05,
    marginBottom: 32,
    fontFamily: 'Poppins',
    maxWidth: '90%',
  },
  registerButton: {
    backgroundColor: '#4B75E9',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 280,
    alignSelf: 'center',
    shadowColor: '#4B75E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 10, 
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    fontFamily: 'Poppins',
  },
  footerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B75E9',
    fontFamily: 'Poppins',
  },
});