import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Dimensions, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (percentage) => (percentage * width) / 100;
const responsiveHeight = (percentage) => (percentage * height) / 100;
const responsiveFont = (percentage) => (percentage * width) / 100;

export default function AuthNavigator({ navigation }) {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const showModal = (type, title, message, onConfirm = null) => {
    setModalConfig({
      type,
      title,
      message,
      onConfirm
    });
    setModalVisible(true);
  };

  const handleLogin = () => {
    if (email === 'admin@admin.com' && password === 'admin') {
      showModal('success', 'Success!', 'Login successful!', () => {
        navigation.navigate('MainTabs');
      });
    } else {
      showModal('error', 'Error', 'Invalid credentials. Use admin@admin.com / admin');
    }
  };

  const CustomModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          
            <View style={styles.modalIconContainer}>
              <Ionicons 
                name={
                  modalConfig.type === 'success' ? 'checkmark-circle' : 
                  modalConfig.type === 'error' ? 'close-circle' : 'information-circle'
                } 
                size={32} 
                color={
                  modalConfig.type === 'success' ? '#4CAF50' : 
                  modalConfig.type === 'error' ? '#FF3B30' : '#4B75E9'
                } 
              />
            </View>

           
            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig.message}</Text>

           
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={() => {
                  setModalVisible(false);
                  if (modalConfig.onConfirm) {
                    modalConfig.onConfirm();
                  }
                }}
              >
                <Text style={styles.primaryButtonText}>
                  {modalConfig.type === 'success' ? 'Continue' : 'OK'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Log in to continue.</Text>

        
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

    
          <View style={styles.optionsContainer}>
            <View style={styles.rememberContainer}>
              <TouchableOpacity 
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
                onPress={() => setRememberMe(!rememberMe)}
              >
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <Text style={styles.rememberText}>Remember Me</Text>
            </View>
            <TouchableOpacity onPress={() => showModal('info', 'Forgot Password', 'Password reset feature coming soon!')}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

         
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
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
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

    
      <CustomModal />
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
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(3),
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderWidth: 1,
    borderColor: '#4B75E9',
    borderRadius: responsiveWidth(1),
    marginRight: responsiveWidth(2),
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
  rememberText: {
    fontSize: responsiveFont(3.5),
    color: '#666666',
    fontFamily: 'Poppins',
  },
  forgotPassword: {
    fontSize: responsiveFont(3.5),
    color: '#4B75E9',
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  loginButton: {
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
  loginButtonText: {
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
modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'flex-end',
},
modalContainer: {
  backgroundColor: 'transparent',
  borderTopLeftRadius: responsiveWidth(6),
  borderTopRightRadius: responsiveWidth(6),
  overflow: 'hidden',
  marginHorizontal: responsiveWidth(2),
},
modalContent: {
  backgroundColor: '#FFFFFF',
  borderTopLeftRadius: responsiveWidth(6),
  borderTopRightRadius: responsiveWidth(6),
  paddingHorizontal: responsiveWidth(6),
  paddingTop: responsiveHeight(4),
  paddingBottom: responsiveHeight(4) + responsiveHeight(2),
  alignItems: 'center',
  maxHeight: height * 0.4,
},
modalIconContainer: {
  width: responsiveWidth(16),
  height: responsiveWidth(16),
  borderRadius: responsiveWidth(8),
  backgroundColor: '#F4F7FF',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: responsiveHeight(2),
},
modalTitle: {
  fontSize: responsiveFont(5),
  fontWeight: '700',
  color: '#000000',
  fontFamily: 'Poppins',
  textAlign: 'center',
  marginBottom: responsiveHeight(1),
},
modalMessage: {
  fontSize: responsiveFont(4),
  color: '#A2A5AD',
  fontFamily: 'Poppins',
  textAlign: 'center',
  marginBottom: responsiveHeight(4),
  lineHeight: responsiveFont(5),
},
modalActions: {
  flexDirection: 'row',
  width: '100%',
},
primaryButton: {
  flex: 1,
  backgroundColor: '#4B75E9',
  paddingVertical: responsiveHeight(2),
  borderRadius: responsiveWidth(3.5),
  alignItems: 'center',
},
primaryButtonText: {
  fontSize: responsiveFont(4),
  fontWeight: '600',
  color: '#FFFFFF',
  fontFamily: 'Poppins',
},
});