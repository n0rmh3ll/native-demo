import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const responsiveWidth = (percentage) => (percentage * width) / 100;
const responsiveHeight = (percentage) => (percentage * height) / 100;
const responsiveFont = (percentage) => (percentage * width) / 100;

export default function ProfileScreen({ navigation }) {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(false);
    
    setTimeout(() => {
      navigation.navigate('Login');
    }, 300);
  };

  const LogoutConfirmationModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={logoutModalVisible}
      onRequestClose={() => setLogoutModalVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
           
            <View style={styles.modalIconContainer}>
              <Ionicons name="log-out-outline" size={32} color="#4B75E9" />
            </View>

           
            <Text style={styles.modalTitle}>Log Out</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to log out?
            </Text>

            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleLogout}
              >
                <Text style={styles.primaryButtonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
    
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerRight} />
      </View>

     
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
       
        <View style={styles.userSection}>
          <View style={styles.userInfo}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }}
              style={styles.profileImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Wade Warren</Text>
              <Text style={styles.userEmail}>wadewarren123@gmail.com</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

    
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons name="card-outline" size={22} color="#4B75E9" />
              <Text style={styles.listItemText}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A2A5AD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons name="cash-outline" size={22} color="#4B75E9" />
              <Text style={styles.listItemText}>Currency</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A2A5AD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons name="globe-outline" size={22} color="#4B75E9" />
              <Text style={styles.listItemText}>Country</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A2A5AD" />
          </TouchableOpacity>
        </View>

       
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Help Center</Text>
          
          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons name="help-circle-outline" size={22} color="#4B75E9" />
              <Text style={styles.listItemText}>FAQ's</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A2A5AD" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.listItem}>
            <View style={styles.listItemLeft}>
              <Ionicons name="headset-outline" size={22} color="#4B75E9" />
              <Text style={styles.listItemText}>Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#A2A5AD" />
          </TouchableOpacity>

         
          <TouchableOpacity 
            style={styles.logoutButton} 
            onPress={() => setLogoutModalVisible(true)}
          >
            <View style={styles.listItemLeft}>
              <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        
        <View style={styles.bottomSpacing} />
      </ScrollView>

    
      <LogoutConfirmationModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins',
  },
  headerRight: {
    width: 32,
  },
  
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#A2A5AD',
    fontFamily: 'Poppins',
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F4F7FF',
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B75E9',
    fontFamily: 'Poppins',
  },
  // Section Styles
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    fontFamily: 'Poppins',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  // List Item Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listItemText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Poppins',
    marginLeft: 12,
    flex: 1,
  },
  
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#FFE5E5',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
    fontFamily: 'Poppins',
    marginLeft: 12,
    flex: 1,
  },
  bottomSpacing: {
    height: 20,
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
  justifyContent: 'space-between',
  width: '100%',
  gap: responsiveWidth(3), 
},
secondaryButton: {
  flex: 1,
  backgroundColor: '#F8F9FA',
  paddingVertical: responsiveHeight(2),
  borderRadius: responsiveWidth(3.5), 
  alignItems: 'center',
  borderWidth: 1,
  borderColor: '#E9ECEF',
},
secondaryButtonText: {
  fontSize: responsiveFont(4),
  fontWeight: '600',
  color: '#000000',
  fontFamily: 'Poppins',
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