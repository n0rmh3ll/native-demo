import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');

export default function CalendarScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [slideAnim] = useState(new Animated.Value(height));
  const [bookings, setBookings] = useState({ upcoming: [], completed: [], cancelled: [] });
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const formatPrice = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(Number(amount));
  };

  const loadBookingsFromStorage = async () => {
    try {
      const json = await AsyncStorage.getItem('userBookings');
      const stored = json ? JSON.parse(json) : { upcoming: [], completed: [], cancelled: [] };
      setBookings(stored);
    } catch (error) {
      console.error('Failed to load bookings:', error);
    }
  };

  useEffect(() => {
    loadBookingsFromStorage();
    const unsubscribe = navigation.addListener('focus', loadBookingsFromStorage);
    return unsubscribe;
  }, [navigation]);

  const showCancelModal = (booking) => {
    setSelectedBooking(booking);
    setCancelModalVisible(true);
    Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start();
  };

  const hideCancelModal = () => {
    Animated.timing(slideAnim, { toValue: height, duration: 250, useNativeDriver: true }).start(() => {
      setCancelModalVisible(false);
      setSelectedBooking(null);
    });
  };

  const showToast = (message) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;
    try {
      const json = await AsyncStorage.getItem('userBookings');
      const stored = json ? JSON.parse(json) : { upcoming: [], completed: [], cancelled: [] };

      const updated = {
        ...stored,
        upcoming: stored.upcoming.filter((b) => b.id !== selectedBooking.id),
        cancelled: [...stored.cancelled, { ...selectedBooking, status: 'cancelled' }],
      };

      await AsyncStorage.setItem('userBookings', JSON.stringify(updated));
      setBookings(updated);
      showToast(`Booking at ${selectedBooking.hotel?.name} cancelled`);
    } catch (err) {
      console.error('Cancel error:', err);
    } finally {
      hideCancelModal();
    }
  };

  const handleViewReceipt = (booking) => {
    navigation.navigate('BookingStack', {
      screen: 'EReceipt',
      params: { 
        bookingData: { ...booking, formattedTotal: formatPrice(booking.total) },
        fromCalendar: true
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const CancelConfirmationModal = () => (
    <Modal visible={cancelModalVisible} transparent animationType="none" onRequestClose={hideCancelModal}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={hideCancelModal}>
        <Animated.View style={[styles.bottomSheet, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Cancel Booking</Text>
          <Text style={styles.sheetMessage}>
            Are you sure you want to cancel{' '}
            <Text style={{ fontWeight: '700', color: '#000' }}>{selectedBooking?.hotel?.name}</Text>?
          </Text>
          <View style={styles.sheetActions}>
            <TouchableOpacity style={styles.keepButton} onPress={hideCancelModal}>
              <Text style={styles.keepText}>Keep</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelConfirmButton} onPress={handleCancelBooking}>
              <Text style={styles.cancelConfirmText}>Cancel Booking</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  const BookingCard = ({ booking, showCancel = false }) => (
    <View style={styles.bookingCard}>
      <View style={styles.imageWrapper}>
        <Image
          source={{
            uri: booking.hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
          }}
          style={styles.bookingImage}
        />
        <View style={styles.imageOverlay} />
        <View style={styles.imageText}>
          <Text style={styles.hotelName}>{booking.hotel.name}</Text>
          <Text style={styles.hotelLocation}>{booking.hotel.location}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.dateText}>
          {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
        </Text>
        <Text style={styles.detailText}>
          {booking.nights} nights • {booking.guests} guests • {booking.rooms} rooms
        </Text>
        <Text style={styles.totalAmount}>{formatPrice(booking.total)}</Text>

        <View style={styles.bookingActions}>
          {showCancel && (
            <TouchableOpacity style={styles.cancelAction} onPress={() => showCancelModal(booking)}>
              <Ionicons name="trash-outline" size={18} color="#4B75E9" />
              <Text style={styles.cancelActionText}>Cancel</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.receiptButton} onPress={() => handleViewReceipt(booking)}>
            <Ionicons name="receipt-outline" size={18} color="#fff" />
            <Text style={styles.receiptButtonText}>View Receipt</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const EmptyState = ({ message, description }) => (
    <View style={styles.emptyState}>
      <Ionicons
        name={activeTab === 'upcoming' ? 'calendar-outline' : activeTab === 'completed' ? 'checkmark-circle-outline' : 'close-circle-outline'}
        size={64}
        color="#A2A5AD"
      />
      <Text style={styles.emptyTitle}>{message}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
      {activeTab === 'upcoming' && (
        <TouchableOpacity style={styles.exploreButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.exploreButtonText}>Explore Hotels</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderBookings = () => {
    const currentBookings = bookings[activeTab] || [];
    if (currentBookings.length === 0) {
      const messages = {
        upcoming: { title: 'No Upcoming Bookings', description: 'You don’t have any upcoming trips yet.' },
        completed: { title: 'No Completed Bookings', description: 'Your completed trips will appear here.' },
        cancelled: { title: 'No Cancelled Bookings', description: 'No cancelled bookings yet.' },
      };
      return <EmptyState {...messages[activeTab]} />;
    }
    return currentBookings.map((b) => <BookingCard key={b.id} booking={b} showCancel={activeTab === 'upcoming'} />);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
        <Text style={styles.subtitle}>Manage your reservations</Text>
      </View>
      <View style={styles.tabContainer}>
        {['upcoming', 'completed', 'cancelled'].map((tab) => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderBookings()}
        <View style={styles.bottomSpacing} />
      </ScrollView>
      <CancelConfirmationModal />
      {toastVisible && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={20} color="#34C759" />
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#181818' },
  subtitle: { fontSize: 14, color: '#888' },
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 15, fontWeight: '500', color: '#A2A5AD' },
  activeTabText: { color: '#181818' },
  tabIndicator: { position: 'absolute', bottom: 0, width: '40%', height: 3, backgroundColor: '#4B75E9', borderRadius: 2 },
  content: { flex: 1, padding: 16 },
  bookingCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  imageWrapper: { position: 'relative' },
  bookingImage: { width: '100%', height: 180 },
  imageOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  imageText: { position: 'absolute', bottom: 12, left: 12 },
  hotelName: { fontSize: 18, fontWeight: '700', color: '#fff' },
  hotelLocation: { fontSize: 14, color: '#ddd' },
  infoSection: { padding: 14 },
  dateText: { fontSize: 13, fontWeight: '500', color: '#333' },
  detailText: { fontSize: 13, color: '#666', marginVertical: 4 },
  totalAmount: { fontSize: 16, fontWeight: '700', color: '#4B75E9', marginTop: 6 },
  bookingActions: { flexDirection: 'row', marginTop: 14, gap: 12 },
  cancelAction: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#EFF3FE', paddingVertical: 14, borderRadius: 30 },
  cancelActionText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#4B75E9' },
  receiptButton: { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#4B75E9', paddingVertical: 14, borderRadius: 30 },
  receiptButtonText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#fff' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 50, backgroundColor: '#fff', borderRadius: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptyDescription: { fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 20 },
  exploreButton: { backgroundColor: '#4B75E9', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10 },
  exploreButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  bottomSpacing: { height: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  bottomSheet: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  sheetHandle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 10 },
  sheetTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
  sheetMessage: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 20 },
  sheetActions: { flexDirection: 'row' },
  keepButton: { flex: 1, backgroundColor: '#F2F2F7', padding: 14, borderRadius: 10, marginRight: 8, alignItems: 'center' },
  keepText: { fontSize: 15, fontWeight: '600', color: '#4B75E9' },
  cancelConfirmButton: { flex: 1, backgroundColor: '#FFEBEE', padding: 14, borderRadius: 10, marginLeft: 8, alignItems: 'center' },
  cancelConfirmText: { fontSize: 15, fontWeight: '600', color: '#FF3B30' },
  toast: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 6 },
  toastText: { marginLeft: 8, fontSize: 14, fontWeight: '500', color: '#181818' },
});
