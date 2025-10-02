import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (percentage) => (percentage * width) / 100;
const responsiveHeight = (percentage) => (percentage * height) / 100;
const responsiveFont = (percentage) => (percentage * width) / 100;

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const handleRegister = () => {
    if (!fullName || !email || !password || !confirmPassword || !agreeToTerms) {
      alert('Please fill all fields and agree to terms.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert('Registration successful!');
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={responsiveFont(6)} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentSection}>
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Let's Get Started</Text>
          <Text style={styles.subtitle}>Create an account to continue.</Text>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={responsiveFont(5)} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={responsiveFont(5)} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="wadewarren123@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={responsiveFont(5)} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={responsiveFont(5)}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed-outline" size={responsiveFont(5)} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                  size={responsiveFont(5)}
                  color="#666"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.termsContainer}>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Register</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={responsiveFont(5)} color="#DB4437" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={responsiveFont(5)} color="#1877F2" />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          </View>
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
  header: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(1),
  },
  backButton: {
    padding: responsiveWidth(1),
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: responsiveWidth(8),
    justifyContent: 'space-between',
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: responsiveHeight(2),
  },
  title: {
    fontSize: responsiveFont(7),
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: responsiveHeight(1),
    fontFamily: 'Poppins',
  },
  subtitle: {
    fontSize: responsiveFont(4),
    fontWeight: '600',
    color: '#A2A5AD',
    textAlign: 'center',
    marginBottom: responsiveHeight(5),
    fontFamily: 'Poppins',
  },
  inputContainer: {
    marginBottom: responsiveHeight(2),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: responsiveWidth(3),
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: 'transparent',
    height: responsiveHeight(6),
  },
  inputIcon: {
    marginRight: responsiveWidth(3),
  },
  input: {
    flex: 1,
    fontSize: responsiveFont(4),
    color: '#000000',
    fontFamily: 'Poppins',
    paddingVertical: 0,
  },
  termsContainer: {
    marginBottom: responsiveHeight(3),
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderWidth: 1,
    borderColor: '#4B75E9',
    borderRadius: responsiveWidth(1),
    marginRight: responsiveWidth(2.5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4B75E9',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: responsiveFont(3),
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: responsiveFont(3.5),
    color: '#666666',
    fontFamily: 'Poppins',
    flex: 1,
    flexWrap: 'wrap',
  },
  termsLink: {
    color: '#4B75E9',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#4B75E9',
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
    shadowColor: '#4B75E9',
    shadowOffset: { width: 0, height: responsiveHeight(0.5) },
    shadowOpacity: 0.3,
    shadowRadius: responsiveWidth(2),
    elevation: 6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: responsiveFont(4.5),
    fontWeight: '700',
    fontFamily: 'Poppins',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  dividerText: {
    marginHorizontal: responsiveWidth(3),
    color: '#666666',
    fontSize: responsiveFont(3.5),
    fontFamily: 'Poppins',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(2),
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
    marginHorizontal: responsiveWidth(1),
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    fontSize: responsiveFont(4),
    color: '#000000',
    fontWeight: '500',
    marginLeft: responsiveWidth(2),
    fontFamily: 'Poppins',
  },
  footerContainer: {
    paddingVertical: responsiveHeight(2),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
  },
  footerText: {
    fontSize: responsiveFont(3.5),
    color: '#666666',
    fontFamily: 'Poppins',
  },
  footerLink: {
    fontSize: responsiveFont(3.5),
    color: '#4B75E9',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
});
