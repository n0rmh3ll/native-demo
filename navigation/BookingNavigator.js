import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  Platform,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Re-added AsyncStorage

const { width, height } = Dimensions.get('window');
const responsiveWidth = (percentage) => (percentage * width) / 100;
const responsiveHeight = (percentage) => (percentage * height) / 100;
const responsiveFont = (percentage) => (percentage * width) / 100;

const Stack = createNativeStackNavigator();

const PRIMARY_BLUE = '#4B75E9';
const ACCENT_GREY = '#A2A5AD';
const LIGHT_GREY = '#F5F5F9';
const STAR_YELLOW = '#FFC107';

const calculateNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const timeDiff = end.getTime() - start.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return nights > 0 ? nights : 0;
};

const parsePrice = (priceString) => {
  if (!priceString) return 0;
  return parseFloat(priceString.toString().replace(/[$,]/g, ''));
};

const formatPrice = (amount) => {
  return `$${amount.toFixed(2)}`;
};

const calculateTotalPrice = (hotel, checkIn, checkOut, rooms) => {
  const nightlyRate = parsePrice(hotel?.price);
  const nights = calculateNights(checkIn, checkOut);
  const basePrice = nightlyRate * nights * rooms;
  const taxRate = 0.1;
  const serviceFee = 25;
  const tax = basePrice * taxRate;
  
  return {
    basePrice,
    tax,
    serviceFee,
    total: basePrice + tax + serviceFee,
    nights
  };
};

const BookingContext = createContext(null);

function BookingProvider({ initialHotel, children }) {
  const [state, setState] = useState({
    hotel: initialHotel || { 
      id: '1', 
      name: 'Elysium Gardens', 
      location: 'Paris, France', 
      price: '1500.00', 
      originalPrice: '1800.00',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop'
    },
    checkIn: null,
    checkOut: null,
    guests: 1,
    rooms: 1,
    card: { number: '2317', name: 'Nicole Warron', expiry: '12/27' },
    guestInfo: { name: 'Nicole Warron', email: 'nicolewarron@gmail.com', phone: '0987654321' },
    paymentSuccess: null,
  });

  const resetBookingState = () => {
    setState(s => ({
      ...s,
      checkIn: null,
      checkOut: null,
      guests: 1,
      rooms: 1,
      paymentSuccess: null
    }));
  };

  // UPDATED: Function is now async and saves booking to AsyncStorage
  const addBooking = async (bookingData) => { 
    const newBooking = {
      id: Date.now().toString(),
      ...bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
    
    try {
      // 1. Load existing bookings
      const storedBookingsJSON = await AsyncStorage.getItem('userBookings');
      
      const storedBookings = storedBookingsJSON ? JSON.parse(storedBookingsJSON) : {
        upcoming: [],
        completed: [],
        cancelled: []
      };
      
      // 2. Add the new booking to the upcoming list
      const updatedBookings = {
        ...storedBookings,
        upcoming: [...storedBookings.upcoming, newBooking]
      };

      // 3. Save the updated bookings object back to AsyncStorage
      await AsyncStorage.setItem('userBookings', JSON.stringify(updatedBookings));
      
      return newBooking;

    } catch (error) {
      console.error('Error saving new booking:', error);
      Alert.alert('Booking Error', 'Could not save your booking locally.');
      throw error;
    }
  };

  const value = useMemo(() => ({ 
    state, 
    setState,
    addBooking, 
    resetBookingState
  }), [state]);

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used inside BookingProvider');
  return ctx;
}

function CustomHeader({ title, navigation, showBack = true, onBackPress }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: responsiveHeight(2.5),
      borderBottomWidth: 0.5,
      borderBottomColor: '#EEE',
      backgroundColor: '#fff',
      minHeight: responsiveHeight(8),
    }}>
      {showBack && (
        <TouchableOpacity
          style={{ 
            position: 'absolute', 
            left: responsiveWidth(1), 
            padding: responsiveWidth(4),
            zIndex: 10,
            top: Platform.OS === 'ios' ? responsiveHeight(3.2) : responsiveHeight(2.8), 
          }}
          onPress={onBackPress || (() => navigation.goBack())}
        >
          <Ionicons name="chevron-back" size={responsiveFont(6)} color="#000" />
        </TouchableOpacity>
      )}
      <Text style={{ fontWeight: '600', fontSize: responsiveFont(5.5), marginTop: Platform.OS === 'ios' ? responsiveHeight(0.5) : 0 }}>{title}</Text>
    </View>
  );
}

function HotelInfoSnippet({ hotel, showNights, nights = 1 }) {
  const priceDetails = showNights && nights > 0 
    ? `${formatPrice(parsePrice(hotel?.price) * nights)} total`
    : `${formatPrice(parsePrice(hotel?.price))} per night`;

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: responsiveHeight(1.5),
    }}>
      <View style={{
        width: responsiveWidth(12),
        height: responsiveWidth(12),
        borderRadius: responsiveWidth(1),
        backgroundColor: LIGHT_GREY,
        marginRight: responsiveWidth(3),
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Ionicons name="image-outline" size={responsiveFont(4)} color={ACCENT_GREY} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5) }}>{hotel?.name || 'Hotel'}</Text>
        <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>{hotel?.location || ''}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(0.5) }}>
          <Ionicons name="star" size={responsiveFont(3)} color={STAR_YELLOW} />
          <Text style={{ color: ACCENT_GREY, marginLeft: responsiveWidth(1), fontSize: responsiveFont(3.5) }}>
            4.7 <Text style={{ fontSize: responsiveFont(3) }}>(1.5k Reviews)</Text>
          </Text>
        </View>
      </View>

      <View style={{ alignItems: 'flex-end' }}>
        <Text style={{ fontWeight: '800', fontSize: responsiveFont(5) }}>{priceDetails}</Text>
        {showNights && nights > 0 && (
          <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3) }}>
            {nights} night{nights !== 1 ? 's' : ''}
          </Text>
        )}
        {!showNights && (
          <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3) }}>per night</Text>
        )}
      </View>
    </View>
  );
}

function FloatingBottomButton({ title, onPress, disabled = false }) {
  return (
    <View style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: responsiveWidth(5),
      paddingVertical: responsiveHeight(2),
      backgroundColor: 'white',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <TouchableOpacity
        style={{
          backgroundColor: disabled ? ACCENT_GREY : PRIMARY_BLUE,
          paddingVertical: responsiveHeight(1.8),
          borderRadius: responsiveWidth(10), 
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: responsiveHeight(6),
        }}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={{ 
          color: '#fff', 
          fontWeight: '700', 
          fontSize: responsiveFont(4.2),
          textAlign: 'center',
        }}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
}

function CalendarModal({ visible, onClose, onDateSelect, mode, selectedDates }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedStart] = useState(selectedDates.checkIn);
  const [selectedEnd] = useState(selectedDates.checkOut);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'next') {
        newDate.setMonth(newDate.getMonth() + 1);
      } else {
        newDate.setMonth(newDate.getMonth() - 1);
      }
      return newDate;
    });
  };

  const handleDateSelect = (day) => {
    const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;
    
    if (mode === 'checkout') {
      const checkInDate = selectedDates.checkIn;
      const checkInTime = checkInDate ? new Date(checkInDate).setHours(0, 0, 0, 0) : null;
      const selectedTime = selectedDate.setHours(0, 0, 0, 0);

      if (checkInTime && selectedTime <= checkInTime) {
        Alert.alert('Invalid Date', 'Check-out date must be after Check-in date.');
        return;
      }
    }

    if (mode === 'checkin') {
      onDateSelect(formattedDate, null);
      onClose(); 
    } else if (mode === 'checkout') {
      onDateSelect(null, formattedDate);
      onClose(); 
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    const today = new Date();
    const todayFormatted = today.toISOString().split('T')[0];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={{ width: '14.28%', aspectRatio: 1 }} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      
      const isSelected = formattedDate === selectedStart || formattedDate === selectedEnd;
      const isToday = formattedDate === todayFormatted;
      const todayDateOnly = new Date(todayFormatted).getTime();
      const currentDateOnly = currentDate.setHours(0, 0, 0, 0);

      const isPast = currentDateOnly < todayDateOnly;
      const isDisabled = isPast;

      let dayStyle = {
        width: responsiveWidth(10), 
        height: responsiveWidth(10), 
        borderRadius: responsiveWidth(5),
        justifyContent: 'center',
        alignItems: 'center',
        margin: responsiveWidth(0.5),
        backgroundColor: 'transparent',
        borderWidth: 0,
      };

      let textStyle = {
        color: isDisabled ? ACCENT_GREY : '#000',
        fontWeight: '400',
        fontSize: responsiveFont(4.2),
      };

      if (isSelected) {
        dayStyle.backgroundColor = PRIMARY_BLUE;
        textStyle.color = '#fff';
        textStyle.fontWeight = '700';
      } else if (isToday) {
        dayStyle.backgroundColor = LIGHT_GREY;
        dayStyle.borderWidth = 2;
        dayStyle.borderColor = PRIMARY_BLUE;
        textStyle.color = PRIMARY_BLUE;
        textStyle.fontWeight = '700';
      }

      days.push(
        <TouchableOpacity
          key={day}
          style={{ width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center' }}
          onPress={() => !isDisabled && handleDateSelect(day)}
          disabled={isDisabled}
        >
          <View style={dayStyle}>
            <Text style={textStyle}>{day}</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'flex-end',
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: responsiveWidth(8),
            borderTopRightRadius: responsiveWidth(8),
            paddingBottom: responsiveHeight(3),
            maxHeight: responsiveHeight(85),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()} 
        >
          <View style={{
            alignItems: 'center',
            paddingVertical: responsiveHeight(1),
          }}>
            <View style={{
              width: responsiveWidth(20),
              height: responsiveHeight(0.6),
              backgroundColor: '#E0E0E0',
              borderRadius: responsiveWidth(1.5),
            }} />
          </View>
          
          <View style={{ paddingHorizontal: responsiveWidth(5) }}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: responsiveHeight(0.5),
              marginBottom: responsiveHeight(1),
            }}>
              <Text style={{ fontWeight: '700', fontSize: responsiveFont(5.5) }}>
                {mode === 'checkin' ? 'Select Check-in Date' : 'Select Check-out Date'}
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: responsiveHeight(3),
              marginTop: responsiveHeight(1)
            }}>
              <TouchableOpacity onPress={() => navigateMonth('prev')} style={{ padding: responsiveWidth(2) }}>
                <Ionicons name="chevron-back" size={responsiveFont(6)} color="#000" />
              </TouchableOpacity>
              <Text style={{ fontWeight: '600', fontSize: responsiveFont(4.5) }}>
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </Text>
              <TouchableOpacity onPress={() => navigateMonth('next')} style={{ padding: responsiveWidth(2) }}>
                <Ionicons name="chevron-forward" size={responsiveFont(6)} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: responsiveHeight(1.5) }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <Text key={day} style={{ fontWeight: '600', color: ACCENT_GREY, width: '14.28%', textAlign: 'center', fontSize: responsiveFont(4) }}>
                  {day}
                </Text>
              ))}
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              {renderCalendarDays()}
            </View>
          </View>
          
          <View style={{
            paddingHorizontal: responsiveWidth(5),
            paddingTop: responsiveHeight(3),
          }}>
            <TouchableOpacity
              style={{
                backgroundColor: PRIMARY_BLUE,
                paddingVertical: responsiveHeight(1.8),
                borderRadius: responsiveWidth(10), 
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={onClose}
            >
              <Text style={{ 
                color: '#fff', 
                fontWeight: '700', 
                fontSize: responsiveFont(4.5),
              }}>Continue</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function BottomSheetModal({ visible, onClose, title, children, showBackButton = true, navigation }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'flex-end',
        }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: responsiveWidth(8),
            borderTopRightRadius: responsiveWidth(8),
            paddingBottom: responsiveHeight(3),
            maxHeight: responsiveHeight(90), 
            minHeight: responsiveHeight(40),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={{
            alignItems: 'center',
            paddingVertical: responsiveHeight(1),
          }}>
            <View style={{
              width: responsiveWidth(15),
              height: responsiveHeight(0.6),
              backgroundColor: '#E0E0E0',
              borderRadius: responsiveWidth(1.5),
            }} />
          </View>
          
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: responsiveHeight(1.5),
            paddingHorizontal: responsiveWidth(5),
            borderBottomWidth: 0.5,
            borderBottomColor: '#EEE',
            minHeight: responsiveHeight(8), 
          }}>
            {showBackButton && (
              <TouchableOpacity
                style={{ 
                  position: 'absolute', 
                  left: responsiveWidth(2), 
                  padding: responsiveWidth(4),
                  zIndex: 10,
                  top: Platform.OS === 'ios' ? responsiveHeight(3.2) : responsiveHeight(2.8), 
                }}
                onPress={onClose || (() => navigation.goBack())}
              >
                <Ionicons name="close" size={responsiveFont(7)} color="#000" />
              </TouchableOpacity>
            )}
            <Text style={{ fontWeight: '700', fontSize: responsiveFont(5.5), marginTop: Platform.OS === 'ios' ? responsiveHeight(0.5) : 0 }}>{title}</Text>
          </View>

          <ScrollView contentContainerStyle={{ paddingHorizontal: responsiveWidth(5), flexGrow: 1 }}>
            {children}
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function BookingInfoScreen({ navigation }) {
  const { state, setState } = useBooking();
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMode, setCalendarMode] = useState('checkin');
  const isReadyToProceed = state.checkIn && state.checkOut;

  const nights = calculateNights(state.checkIn, state.checkOut);
  const totalPrice = calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms);

  const handleDateSelect = (checkIn, checkOut) => {
    if (checkIn) {
      setState(s => ({ ...s, checkIn, checkOut: null }));
    } else if (checkOut) {
      setState(s => ({ ...s, checkOut }));
    }
  };

  const openCalendar = (mode) => {
    setCalendarMode(mode);
    setShowCalendar(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <CustomHeader title="Booking info" navigation={navigation} showBack={true} />

      <View style={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingTop: responsiveHeight(2), 
        flex: 1,
        paddingBottom: responsiveHeight(12),
      }}>
        <HotelInfoSnippet 
          hotel={state.hotel} 
          showNights={nights > 0}
          nights={nights}
        />

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: responsiveHeight(2),
          marginBottom: responsiveHeight(2)
        }}>
          {['Check In', 'Check Out'].map((label, index) => {
            const mode = label === 'Check In' ? 'checkin' : 'checkout';
            const date = mode === 'checkin' ? state.checkIn : state.checkOut;
            return (
              <View key={label} style={{ width: '48%' }}>
                <Text style={{ color: ACCENT_GREY, marginBottom: 6, fontSize: responsiveFont(3.5) }}>{label}</Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: LIGHT_GREY,
                    padding: responsiveWidth(3),
                    borderRadius: responsiveWidth(2),
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: responsiveHeight(6)
                  }}
                  onPress={() => openCalendar(mode)}
                >
                  <Text style={{ color: date ? '#000' : ACCENT_GREY, fontWeight: date ? '600' : '400', fontSize: responsiveFont(4) }}>
                    {date ? date.split('-').reverse().join('/') : 'Select date'}
                  </Text>
                  <Ionicons name="calendar-outline" size={responsiveFont(5)} color={ACCENT_GREY} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>Guests</Text>
        <View style={{ backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: responsiveWidth(3), height: responsiveHeight(6), marginTop: 6, marginBottom: responsiveHeight(2) }}>
          <Text style={{ fontWeight: '600' }}>{state.guests} Guests</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setState(s => ({ ...s, guests: Math.max(1, s.guests - 1) }))} style={{ padding: responsiveWidth(2) }}>
              <Ionicons name="remove-circle-outline" size={responsiveFont(6)} color={PRIMARY_BLUE} />
            </TouchableOpacity>
            <Text style={{ fontWeight: '700', marginHorizontal: responsiveWidth(3), fontSize: responsiveFont(4) }}>{state.guests}</Text>
            <TouchableOpacity onPress={() => setState(s => ({ ...s, guests: s.guests + 1 }))} style={{ padding: responsiveWidth(2) }}>
              <Ionicons name="add-circle-outline" size={responsiveFont(6)} color={PRIMARY_BLUE} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>Rooms</Text>
        <View style={{ backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(2), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: responsiveWidth(3), height: responsiveHeight(6), marginTop: 6 }}>
          <Text style={{ fontWeight: '600' }}>{state.rooms} Rooms</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setState(s => ({ ...s, rooms: Math.max(1, s.rooms - 1) }))} style={{ padding: responsiveWidth(2) }}>
              <Ionicons name="remove-circle-outline" size={responsiveFont(6)} color={PRIMARY_BLUE} />
            </TouchableOpacity>
            <Text style={{ fontWeight: '700', marginHorizontal: responsiveWidth(3), fontSize: responsiveFont(4) }}>{state.rooms}</Text>
            <TouchableOpacity onPress={() => setState(s => ({ ...s, rooms: s.rooms + 1 }))} style={{ padding: responsiveWidth(2) }}>
              <Ionicons name="add-circle-outline" size={responsiveFont(6)} color={PRIMARY_BLUE} />
            </TouchableOpacity>
          </View>
        </View>

        {nights > 0 && (
          <View style={{ marginTop: responsiveHeight(3), padding: responsiveWidth(4), backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(3), }}>
            <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1) }}>
              Price Summary
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(0.5) }}>
              <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>
                {formatPrice(parsePrice(state.hotel.price))} × {nights} night{nights !== 1 ? 's' : ''} × {state.rooms} room{state.rooms !== 1 ? 's' : ''}
              </Text>
              <Text style={{ fontWeight: '600', fontSize: responsiveFont(3.5) }}>
                {formatPrice(totalPrice.basePrice)}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(0.5) }}>
              <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>Tax (10%)</Text>
              <Text style={{ fontWeight: '600', fontSize: responsiveFont(3.5) }}>{formatPrice(totalPrice.tax)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(0.5) }}>
              <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>Service Fee</Text>
              <Text style={{ fontWeight: '600', fontSize: responsiveFont(3.5) }}>{formatPrice(totalPrice.serviceFee)}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(1), paddingTop: responsiveHeight(1), borderTopWidth: 1, borderTopColor: ACCENT_GREY }}>
              <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5) }}>Total</Text>
              <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5) }}>{formatPrice(totalPrice.total)}</Text>
            </View>
          </View>
        )}
      </View>

      <CalendarModal
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        onDateSelect={handleDateSelect}
        mode={calendarMode}
        selectedDates={{ checkIn: state.checkIn, checkOut: state.checkOut }}
      />

      <FloatingBottomButton
        title={`Continue - ${nights > 0 ? formatPrice(totalPrice.total) : 'Select Dates'}`}
        onPress={() => navigation.navigate('PaymentMethods')}
        disabled={!isReadyToProceed}
      />
    </SafeAreaView>
  );
}

function PaymentMethodsScreen({ navigation }) {
  const { state } = useBooking();
  const defaultSelection = state.card && state.card.number !== 'XXXX' ? 'card' : 'cash';
  const [selected, setSelected] = useState(defaultSelection);
  const [showModal, setShowModal] = useState(true);

  const PaymentOption = ({ icon, title, subtitle, isSelected, onPress }) => (
    <TouchableOpacity
      style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: responsiveHeight(1.8),
        borderBottomWidth: 0.5,
        borderBottomColor: LIGHT_GREY
      }}
      onPress={onPress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={responsiveFont(6)} color="#000" />
        <View style={{ marginLeft: responsiveWidth(4) }}>
          <Text style={{ fontWeight: '600', fontSize: responsiveFont(4.5) }}>{title}</Text>
          <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.5) }}>{subtitle}</Text>
        </View>
      </View>
      <View
        style={{
          width: responsiveWidth(5),
          height: responsiveWidth(5),
          borderRadius: responsiveWidth(5),
          borderWidth: isSelected ? 0 : 2,
          borderColor: '#DDD',
          backgroundColor: isSelected ? PRIMARY_BLUE : 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isSelected && <Ionicons name="checkmark" size={responsiveFont(3)} color="#fff" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModal
      visible={showModal}
      onClose={() => {
        setShowModal(false);
        navigation.goBack();
      }}
      title="Payment Methods"
      navigation={navigation}
    >
      <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1.5), marginTop: responsiveHeight(2) }}>Choose Method</Text>
      <View style={{ backgroundColor: '#fff', paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(1), borderRadius: responsiveWidth(3), elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 }}>
        <PaymentOption
          icon="cash-outline"
          title="Cash"
          subtitle="Pay at property"
          isSelected={selected === 'cash'}
          onPress={() => setSelected('cash')}
        />
        <PaymentOption
          icon="card-outline"
          title={`Visa •••• ${state.card?.number || 'XXXX'}`}
          subtitle={`Expiry ${state.card?.expiry || 'XX/XX'}`}
          isSelected={selected === 'card'}
          onPress={() => setSelected('card')}
        />
        <TouchableOpacity 
          style={{ 
            borderWidth: 1, 
            borderColor: PRIMARY_BLUE, 
            padding: responsiveWidth(3), 
            borderRadius: responsiveWidth(3), 
            alignItems: 'center', 
            marginTop: responsiveHeight(2), 
            marginBottom: responsiveHeight(1.5),
            backgroundColor: '#E6EFFF'
          }}
          onPress={() => navigation.navigate('AddCard')}
        >
          <Text style={{ color: PRIMARY_BLUE, fontWeight: '700', fontSize: responsiveFont(4) }}>+ Add New Card</Text>
        </TouchableOpacity>
      </View>
      
      <View style={{ paddingVertical: responsiveHeight(3) }}>
        <TouchableOpacity
          style={{
            backgroundColor: PRIMARY_BLUE,
            paddingVertical: responsiveHeight(1.8),
            borderRadius: responsiveWidth(10), 
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: responsiveHeight(6),
          }}
          onPress={() => navigation.navigate('GuestInfo')}
        >
          <Text style={{ 
            color: '#fff', 
            fontWeight: '700', 
            fontSize: responsiveFont(4.2),
            textAlign: 'center',
          }}>Continue</Text>
        </TouchableOpacity>
      </View>
    </BottomSheetModal>
  );
}

function AddCardScreen({ navigation }) {
  const [showModal, setShowModal] = useState(true);

  return (
    <BottomSheetModal
      visible={showModal}
      onClose={() => {
        setShowModal(false);
        navigation.goBack();
      }}
      title="Add New Card"
      navigation={navigation}
    >
      <View style={{ marginTop: responsiveHeight(2) }}>
        <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>Card Number</Text>
        <TextInput
          style={{
            backgroundColor: LIGHT_GREY,
            borderRadius: responsiveWidth(2),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(1.5),
            fontSize: responsiveFont(4),
            marginBottom: responsiveHeight(2),
          }}
          placeholder="XXXX XXXX XXXX XXXX"
          keyboardType="numeric"
          maxLength={19}
        />

        <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>Name on Card</Text>
        <TextInput
          style={{
            backgroundColor: LIGHT_GREY,
            borderRadius: responsiveWidth(2),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(1.5),
            fontSize: responsiveFont(4),
            marginBottom: responsiveHeight(2),
          }}
          placeholder="Nicole Warron"
        />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ width: '48%' }}>
            <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>Expiry Date (MM/YY)</Text>
            <TextInput
              style={{
                backgroundColor: LIGHT_GREY,
                borderRadius: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveHeight(1.5),
                fontSize: responsiveFont(4),
              }}
              placeholder="MM/YY"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
          
          <View style={{ width: '48%' }}>
            <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>CVV</Text>
            <TextInput
              style={{
                backgroundColor: LIGHT_GREY,
                borderRadius: responsiveWidth(2),
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveHeight(1.5),
                fontSize: responsiveFont(4),
              }}
              placeholder="XXX"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

        <View style={{ paddingVertical: responsiveHeight(4) }}>
          <TouchableOpacity
            style={{
              backgroundColor: PRIMARY_BLUE,
              paddingVertical: responsiveHeight(1.8),
              borderRadius: responsiveWidth(10), 
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: responsiveHeight(6),
            }}
            onPress={() => navigation.navigate('CardAdded')}
          >
            <Text style={{ 
              color: '#fff', 
              fontWeight: '700', 
              fontSize: responsiveFont(4.2),
              textAlign: 'center',
            }}>Save Card</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheetModal>
  );
}

function CardAddedScreen({ navigation }) {
  const [showModal, setShowModal] = useState(true);
  
  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        setShowModal(false);
        navigation.goBack();
      }, 1500); 
    }
  }, [showModal, navigation]);

  return (
    <Modal
      visible={showModal}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {}}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <View style={{
          backgroundColor: '#fff',
          padding: responsiveWidth(10),
          borderRadius: responsiveWidth(5),
          alignItems: 'center',
          maxWidth: responsiveWidth(80),
        }}>
          <Ionicons name="checkmark-circle" size={responsiveFont(12)} color={PRIMARY_BLUE} />
          <Text style={{ fontWeight: '700', fontSize: responsiveFont(6), marginTop: responsiveHeight(2) }}>Card Added!</Text>
          <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(4), marginTop: responsiveHeight(1), textAlign: 'center' }}>
            Your Visa card ending in 2317 has been saved successfully.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function GuestInfoScreen({ navigation }) {
  const { state, setState } = useBooking();

  const isReadyToProceed = state.guestInfo.name && state.guestInfo.email && state.guestInfo.phone;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Guest Information" navigation={navigation} showBack={true} />
      
      <ScrollView contentContainerStyle={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingTop: responsiveHeight(2), 
        paddingBottom: responsiveHeight(12) 
      }}>
        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginBottom: responsiveHeight(2) }}>
          Primary Guest Details
        </Text>
        
        <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>Full Name</Text>
        <TextInput
          style={{
            backgroundColor: LIGHT_GREY,
            borderRadius: responsiveWidth(2),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(1.5),
            fontSize: responsiveFont(4),
            marginBottom: responsiveHeight(2),
          }}
          placeholder="Nicole Warron"
          value={state.guestInfo.name}
          onChangeText={(text) => setState(s => ({ ...s, guestInfo: { ...s.guestInfo, name: text } }))}
        />

        <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>Email Address</Text>
        <TextInput
          style={{
            backgroundColor: LIGHT_GREY,
            borderRadius: responsiveWidth(2),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(1.5),
            fontSize: responsiveFont(4),
            marginBottom: responsiveHeight(2),
          }}
          placeholder="nicolewarron@gmail.com"
          keyboardType="email-address"
          value={state.guestInfo.email}
          onChangeText={(text) => setState(s => ({ ...s, guestInfo: { ...s.guestInfo, email: text } }))}
        />

        <Text style={{ color: ACCENT_GREY, marginBottom: responsiveHeight(1), fontSize: responsiveFont(3.5) }}>Phone Number</Text>
        <TextInput
          style={{
            backgroundColor: LIGHT_GREY,
            borderRadius: responsiveWidth(2),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(1.5),
            fontSize: responsiveFont(4),
            marginBottom: responsiveHeight(4),
          }}
          placeholder="0987654321"
          keyboardType="phone-pad"
          value={state.guestInfo.phone}
          onChangeText={(text) => setState(s => ({ ...s, guestInfo: { ...s.guestInfo, phone: text } }))}
        />

      </ScrollView>

      <FloatingBottomButton
        title="Continue to Review"
        onPress={() => navigation.navigate('Review')}
        disabled={!isReadyToProceed}
      />
    </SafeAreaView>
  );
}

function ReviewScreen({ navigation }) {
  const { state, addBooking, setState } = useBooking();

  const totalPriceDetails = useMemo(() => {
    return calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms);
  }, [state.hotel, state.checkIn, state.checkOut, state.rooms]);

  const handleBookNow = async () => { // Made async to await addBooking
    try {
        const newBooking = await addBooking({
            hotel: state.hotel,
            checkIn: state.checkIn,
            checkOut: state.checkOut,
            rooms: state.rooms,
            guests: state.guests,
            totalPrice: totalPriceDetails.total,
            guestInfo: state.guestInfo,
        });
        
        setState(s => ({ ...s, paymentSuccess: true }));

        // Pass the booking data to the success screen, though it's mainly for display
        navigation.navigate('Success', { booking: newBooking });
    } catch (e) {
        // Error already handled in addBooking
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Review & Confirm" navigation={navigation} showBack={true} />
      
      <ScrollView contentContainerStyle={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingTop: responsiveHeight(2), 
        paddingBottom: responsiveHeight(12) 
      }}>
        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginBottom: responsiveHeight(2) }}>
          Booking Details
        </Text>
        <HotelInfoSnippet 
          hotel={state.hotel} 
          showNights={true}
          nights={totalPriceDetails.nights}
        />

        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(3),
          padding: responsiveWidth(4),
          marginTop: responsiveHeight(2),
        }}>
          <DetailRow label="Check In" value={state.checkIn?.split('-').reverse().join('/')} />
          <DetailRow label="Check Out" value={state.checkOut?.split('-').reverse().join('/')} />
          <DetailRow label="Guests" value={`${state.guests} Adults`} />
          <DetailRow label="Rooms" value={`${state.rooms} Room${state.rooms > 1 ? 's' : ''}`} />
        </View>
        
        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginTop: responsiveHeight(3), marginBottom: responsiveHeight(2) }}>
          Guest Information
        </Text>
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(3),
          padding: responsiveWidth(4),
        }}>
          <DetailRow label="Name" value={state.guestInfo.name} />
          <DetailRow label="Email" value={state.guestInfo.email} />
          <DetailRow label="Phone" value={state.guestInfo.phone} />
        </View>

        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginTop: responsiveHeight(3), marginBottom: responsiveHeight(2) }}>
          Payment Details
        </Text>
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(3),
          padding: responsiveWidth(4),
        }}>
          <DetailRow label="Method" value={`Visa •••• ${state.card?.number || 'XXXX'}`} />
          <DetailRow label="Nights Price" value={formatPrice(totalPriceDetails.basePrice)} />
          <DetailRow label="Tax (10%)" value={formatPrice(totalPriceDetails.tax)} />
          <DetailRow label="Service Fee" value={formatPrice(totalPriceDetails.serviceFee)} />
          <DetailRow label="Total" value={formatPrice(totalPriceDetails.total)} isTotal={true} />
        </View>

      </ScrollView>

      <FloatingBottomButton
        title={`Book Now - ${formatPrice(totalPriceDetails.total)}`}
        onPress={handleBookNow}
      />
    </SafeAreaView>
  );
}

function DetailRow({ label, value, isTotal = false }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: responsiveHeight(0.8), borderBottomWidth: isTotal ? 0 : 0.5, borderBottomColor: ACCENT_GREY, alignItems: 'center' }}>
      <Text style={{ color: isTotal ? '#000' : ACCENT_GREY, fontWeight: isTotal ? '700' : '500', fontSize: responsiveFont(3.8) }}>{label}</Text>
      <Text style={{ color: isTotal ? PRIMARY_BLUE : '#000', fontWeight: isTotal ? '800' : '600', fontSize: responsiveFont(4.2) }}>{value}</Text>
    </View>
  );
}

function SuccessScreen({ navigation }) {
  const { state, resetBookingState } = useBooking();
  const [slideAnim] = useState(new Animated.Value(responsiveHeight(100)));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [slideAnim]);

  const booking = state.paymentSuccess === true ? { 
    hotelName: state.hotel.name,
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    totalPrice: calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms).total
  } : null;

  if (!booking) {
    return <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />;
  }
  

  const navigateToMainTab = (screenName) => {
      resetBookingState();
  
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { 
              name: 'MainTabs', 
              params: {
                screen: screenName,
              }
            },
          ],
        })
      );
      
  };


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
      <Animated.View
        style={{
          backgroundColor: '#fff',
          borderTopLeftRadius: responsiveWidth(8),
          borderTopRightRadius: responsiveWidth(8),
          padding: responsiveWidth(8),
          transform: [{ translateY: slideAnim }],
        }}
      >
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: responsiveWidth(15),
            height: responsiveHeight(0.6),
            backgroundColor: '#E0E0E0',
            borderRadius: responsiveWidth(1.5),
            marginBottom: responsiveHeight(2)
          }} />

          <Ionicons name="checkmark-circle" size={responsiveFont(15)} color={PRIMARY_BLUE} />

          <Text style={{ fontWeight: '800', fontSize: responsiveFont(7), color: PRIMARY_BLUE, marginTop: responsiveHeight(2) }}>
            Booking Confirmed!
          </Text>

          <Text style={{ textAlign: 'center', fontSize: responsiveFont(4.2), color: ACCENT_GREY, marginTop: responsiveHeight(1.5), marginBottom: responsiveHeight(3) }}>
            You have successfully booked {booking.hotelName} for the dates {booking.checkIn?.split('-').reverse().join('/')} to {booking.checkOut?.split('-').reverse().join('/')}.
          </Text>

          <View style={{
            width: '100%',
            backgroundColor: LIGHT_GREY,
            padding: responsiveWidth(5),
            borderRadius: responsiveWidth(3),
            marginBottom: responsiveHeight(3)
          }}>
            <DetailRow label="Total Amount" value={formatPrice(booking.totalPrice)} isTotal={true} />
            <View style={{ height: responsiveHeight(1) }} />
            <DetailRow label="Payment Method" value={`Visa •••• ${state.card?.number || 'XXXX'}`} />
          </View>
          
          <TouchableOpacity 
            style={{ paddingVertical: responsiveHeight(1) }} 
            onPress={() => navigateToMainTab('Calendar')} // Changed navigation call
          >
            <Text style={{ color: PRIMARY_BLUE, fontWeight: '700', fontSize: responsiveFont(4) }}>View My Bookings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{ paddingVertical: responsiveHeight(1) }} 
            onPress={() => navigateToMainTab('Home')} // Changed navigation call
          >
            <Text style={{ color: ACCENT_GREY, fontWeight: '600', fontSize: responsiveFont(4) }}>Back to Home</Text>
          </TouchableOpacity>

        </View>
      </Animated.View>
    </SafeAreaView>
  );
}


function EReceiptScreen({ navigation }) {
  const { state } = useBooking();

  const totalPriceDetails = useMemo(() => {
    return calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms);
  }, [state.hotel, state.checkIn, state.checkOut, state.rooms]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="E-Receipt" navigation={navigation} showBack={true} />
      
      <ScrollView contentContainerStyle={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingTop: responsiveHeight(2), 
        paddingBottom: responsiveHeight(12) 
      }}>
        <View style={{ 
          alignItems: 'center', 
          paddingVertical: responsiveHeight(3), 
          borderBottomWidth: 1, 
          borderBottomColor: LIGHT_GREY 
        }}>
          <Ionicons name="checkmark-circle" size={responsiveFont(15)} color={PRIMARY_BLUE} />
          <Text style={{ fontWeight: '700', fontSize: responsiveFont(5.5), marginTop: responsiveHeight(1) }}>Payment Successful</Text>
          <Text style={{ fontWeight: '800', fontSize: responsiveFont(7), color: PRIMARY_BLUE, marginTop: responsiveHeight(0.5) }}>
            {formatPrice(totalPriceDetails.total)}
          </Text>
          <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.8) }}>
            Transaction ID: #HBDC{Date.now().toString().slice(-6)}
          </Text>
        </View>

        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginTop: responsiveHeight(3), marginBottom: responsiveHeight(2) }}>
          Booking Details
        </Text>
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(3),
          padding: responsiveWidth(4),
        }}>
          <DetailRow label="Hotel" value={state.hotel.name} />
          <DetailRow label="Location" value={state.hotel.location} />
          <DetailRow label="Check In" value={state.checkIn?.split('-').reverse().join('/')} />
          <DetailRow label="Check Out" value={state.checkOut?.split('-').reverse().join('/')} />
          <DetailRow label="Rooms" value={`${state.rooms} Room${state.rooms > 1 ? 's' : ''}`} />
          <DetailRow label="Guests" value={`${state.guests} Adults`} />
        </View>
        
        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginTop: responsiveHeight(3), marginBottom: responsiveHeight(2) }}>
          Payment Breakdown
        </Text>
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(3),
          padding: responsiveWidth(4),
        }}>
          <DetailRow label="Nights Price" value={formatPrice(totalPriceDetails.basePrice)} />
          <DetailRow label="Tax (10%)" value={formatPrice(totalPriceDetails.tax)} />
          <DetailRow label="Service Fee" value={formatPrice(totalPriceDetails.serviceFee)} />
          <View style={{ height: responsiveHeight(1), borderTopWidth: 1, borderTopColor: ACCENT_GREY, marginVertical: responsiveHeight(1) }} />
          <DetailRow label="Total Paid" value={formatPrice(totalPriceDetails.total)} isTotal={true} />
        </View>

        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5), marginTop: responsiveHeight(3), marginBottom: responsiveHeight(2) }}>
          Guest Contact
        </Text>
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(3),
          padding: responsiveWidth(4),
        }}>
          <DetailRow label="Name" value={state.guestInfo.name} />
          <DetailRow label="Email" value={state.guestInfo.email} />
          <DetailRow label="Phone" value={state.guestInfo.phone} />
        </View>

        <TouchableOpacity 
          style={{ 
            marginTop: responsiveHeight(4), 
            alignItems: 'center', 
            paddingVertical: responsiveHeight(1)
          }}
          onPress={() => Alert.alert('Receipt Sent', 'The e-receipt has been sent to your email address.')}
        >
          <Text style={{ color: PRIMARY_BLUE, fontWeight: '700', fontSize: responsiveFont(4.5) }}>Email Receipt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={{ 
            marginTop: responsiveHeight(1), 
            alignItems: 'center', 
            paddingVertical: responsiveHeight(1)
          }}
          onPress={() => Alert.alert('Cancel Booking', 'Are you sure you want to cancel this booking? This action cannot be undone.')}
        >
          <Text style={{ color: '#FF3B30', fontWeight: '700', fontSize: responsiveFont(4.5) }}>Cancel Booking</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}


export default function BookingNavigator({ route }) {
  const initialHotel = route?.params?.hotel || null;
  return (
    <BookingProvider initialHotel={initialHotel}>
      <Stack.Navigator
        initialRouteName="BookingInfo"
        screenOptions={{
          headerShown: false,
          ...Platform.select({
            ios: { cardStyle: { backgroundColor: 'transparent' } },
            android: { contentStyle: { backgroundColor: 'transparent' } },
          }),
        }}
      >
        <Stack.Screen name="BookingInfo" component={BookingInfoScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="AddCard" component={AddCardScreen} options={{ presentation: 'modal' }} />
        <Stack.Screen name="CardAdded" component={CardAddedScreen} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="GuestInfo" component={GuestInfoScreen} />
        <Stack.Screen name="Review" component={ReviewScreen} />
        <Stack.Screen name="Success" component={SuccessScreen} options={{ presentation: 'transparentModal' }} />
        <Stack.Screen name="EReceipt" component={EReceiptScreen} />
      </Stack.Navigator>
    </BookingProvider>
  );
}