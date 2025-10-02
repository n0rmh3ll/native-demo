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
      originalPrice: '1800.00'
    },
    checkIn: null,
    checkOut: null,
    guests: 1,
    rooms: 1,
    card: { number: '2317', name: 'Nicole Warron', expiry: '12/27' },
    guestInfo: { name: 'Nicole Warron', email: 'nicolewarron@gmail.com', phone: '0987654321' },
    paymentSuccess: null,
  });
  
  const value = useMemo(() => ({ state, setState }), [state]);
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
            // Lower the back arrow icon slightly
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
    
    // Date validation
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
          {/* Modern Drag Handle */}
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
                borderRadius: responsiveWidth(10), // Cylindrical button
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
          {/* Drag Handle */}
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

          {/* Modal Content */}
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
      // If check-in is selected, reset check-out
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
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(2),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: responsiveWidth(3),
          height: responsiveHeight(6),
          marginTop: 6,
          marginBottom: responsiveHeight(2)
        }}>
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
        <View style={{
          backgroundColor: LIGHT_GREY,
          borderRadius: responsiveWidth(2),
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: responsiveWidth(3),
          height: responsiveHeight(6),
          marginTop: 6
        }}>
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
          <View style={{
            marginTop: responsiveHeight(3),
            padding: responsiveWidth(4),
            backgroundColor: LIGHT_GREY,
            borderRadius: responsiveWidth(3),
          }}>
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
  // Ensure default is 'card' if a card exists, otherwise 'cash'
  const defaultSelection = state.card && state.card.number !== 'XXXX' ? 'card' : 'cash'; 
  const [selected, setSelected] = useState(defaultSelection);
  const [showModal, setShowModal] = useState(true);

  const PaymentOption = ({ icon, title, subtitle, isSelected, onPress }) => (
    <TouchableOpacity
      style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: responsiveHeight(1.8), borderBottomWidth: 0.5, borderBottomColor: LIGHT_GREY }}
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
          width: responsiveWidth(5), height: responsiveWidth(5), borderRadius: responsiveWidth(5),
          borderWidth: isSelected ? 0 : 2, borderColor: '#DDD',
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
              borderWidth: 1, borderColor: PRIMARY_BLUE, padding: responsiveWidth(3), borderRadius: responsiveWidth(3),
              alignItems: 'center', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(1.5),
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
                borderRadius: responsiveWidth(10), // Cylindrical button
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
  const { setState } = useBooking();
  const [number, setNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [showModal, setShowModal] = useState(true);

  function saveCard() {
    if (!number || !name || !expiry || !cvv) {
      Alert.alert('Incomplete Details', 'Please fill in all card details.');
      return;
    }
    const lastFour = number.length >= 4 ? number.replace(/\s/g, '').slice(-4) : number.replace(/\s/g, '');
    setState(s => ({ ...s, card: { number: lastFour, name, expiry } }));
    navigation.navigate('CardAdded', { cardName: name, lastFour });
  }

  const formatCardNumber = (text) => {
    let cleanText = text.replace(/[^0-9]/g, '');
    let formatted = '';
    for (let i = 0; i < cleanText.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += cleanText[i];
    }
    setNumber(formatted.slice(0, 19));
  };
  
  const formatExpiry = (text) => {
    let cleanText = text.replace(/[^0-9]/g, '');
    if (cleanText.length > 2) {
        cleanText = `${cleanText.slice(0, 2)}/${cleanText.slice(2, 4)}`;
    }
    setExpiry(cleanText);
  };

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
        <View style={{
            backgroundColor: PRIMARY_BLUE,
            padding: responsiveWidth(5),
            borderRadius: responsiveWidth(4),
            height: responsiveHeight(25),
            justifyContent: 'space-between',
            marginTop: responsiveHeight(2),
            marginBottom: responsiveHeight(3)
        }}>
            <View style={{ alignSelf: 'flex-end', padding: 5, backgroundColor: 'white', borderRadius: 5 }}>
                <Text style={{ fontSize: responsiveFont(3.5), fontWeight: '700' }}>Visa</Text>
            </View>
            <View>
                <Text style={{ color: '#fff', fontWeight: '700', fontSize: responsiveFont(5.5), letterSpacing: 1 }}>
                {number || '•••• •••• •••• ••••'}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: responsiveHeight(3) }}>
                    <View>
                        <Text style={{ color: '#fff', fontSize: responsiveFont(3) }}>Cardholder Name</Text>
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: responsiveFont(4) }}>{name || 'Nicole Warron'}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ color: '#fff', fontSize: responsiveFont(3) }}>Expiry</Text>
                        <Text style={{ color: '#fff', fontWeight: '600', fontSize: responsiveFont(4) }}>{expiry || 'MM/YY'}</Text>
                    </View>
                </View>
            </View>
        </View>

        <TextInput
            placeholder="Card number"
            keyboardType="numeric"
            value={number}
            onChangeText={formatCardNumber}
            style={{ backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(3), padding: responsiveWidth(4), marginTop: responsiveHeight(1.5), fontSize: responsiveFont(4) }}
        />
        <TextInput
            placeholder="Name on card"
            value={name}
            onChangeText={setName}
            style={{ backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(3), padding: responsiveWidth(4), marginTop: responsiveHeight(1.5), fontSize: responsiveFont(4) }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: responsiveHeight(5) }}>
            <TextInput
                placeholder="MM/YY"
                keyboardType="numeric"
                value={expiry}
                onChangeText={formatExpiry}
                maxLength={5}
                style={{ backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(3), padding: responsiveWidth(4), marginTop: responsiveHeight(1.5), width: '48%', fontSize: responsiveFont(4) }}
            />
            <TextInput
                placeholder="CVV"
                keyboardType="numeric"
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
                maxLength={4}
                style={{ backgroundColor: LIGHT_GREY, borderRadius: responsiveWidth(3), padding: responsiveWidth(4), marginTop: responsiveHeight(1.5), width: '48%', fontSize: responsiveFont(4) }}
            />
        </View>
        
        <View style={{ paddingVertical: responsiveHeight(2) }}>
            <TouchableOpacity
                style={{
                backgroundColor: PRIMARY_BLUE,
                paddingVertical: responsiveHeight(1.8),
                borderRadius: responsiveWidth(10), // Cylindrical button
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: responsiveHeight(6),
                }}
                onPress={saveCard}
            >
                <Text style={{ 
                color: '#fff', 
                fontWeight: '700', 
                fontSize: responsiveFont(4.2),
                textAlign: 'center',
                }}>Add Card</Text>
            </TouchableOpacity>
        </View>
    </BottomSheetModal>
  );
}

function CardAddedScreen({ navigation }) {
  const { state } = useBooking();
  const lastFour = state.card?.number || 'XXXX';

  useEffect(() => {
    // Automatically dismiss the success confirmation after a short delay
    const timer = setTimeout(() => {
        navigation.goBack();
    }, 2000); 

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: responsiveWidth(85), alignItems: 'center', padding: responsiveWidth(6), backgroundColor: '#fff', borderRadius: responsiveWidth(4) }}>
        <Ionicons name="checkmark-circle-outline" size={responsiveFont(15)} color={PRIMARY_BLUE} />
        <Text style={{ fontWeight: '700', fontSize: responsiveFont(5.5), marginTop: responsiveHeight(2) }}>Card Added!</Text>
        <Text style={{ color: ACCENT_GREY, marginTop: responsiveHeight(1), textAlign: 'center' }}>
          Card ending in ••••{lastFour} has been saved.
        </Text>
      </View>
    </View>
  );
}

function GuestInfoScreen({ navigation }) {
  const { state, setState } = useBooking();
  const [name, setName] = useState(state.guestInfo.name);
  const [email, setEmail] = useState(state.guestInfo.email);
  const [phone, setPhone] = useState(state.guestInfo.phone);

  function next() {
    if (!name || !email || !phone) {
      Alert.alert('Incomplete Details', 'Please fill in all guest information.');
      return;
    }
    setState(s => ({ ...s, guestInfo: { name, email, phone } }));
    navigation.navigate('Review');
  }

  const inputStyle = {
    backgroundColor: LIGHT_GREY,
    padding: responsiveWidth(4),
    borderRadius: responsiveWidth(3),
    marginTop: responsiveHeight(1.5),
    fontSize: responsiveFont(4),
    fontWeight: '500'
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Guest Info" navigation={navigation} />

      <View style={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingTop: responsiveHeight(2),
        flex: 1,
        paddingBottom: responsiveHeight(12),
      }}>
        {/* Hotel Info Snippet REMOVED as requested */}

        <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1.5), marginTop: responsiveHeight(1) }}>Guest Information</Text>

        <TextInput placeholder="Full name" value={name} onChangeText={setName} style={inputStyle} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" style={inputStyle} />
        <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={inputStyle} />
      </View>

      <FloatingBottomButton
        title="Continue"
        onPress={next}
      />
    </SafeAreaView>
  );
}

function ReviewScreen({ navigation }) {
  const { state, setState } = useBooking();
  const hotel = state.hotel;
  
  const totalPrice = calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms);
  const nights = calculateNights(state.checkIn, state.checkOut);
  // Calculate discount based on mocked original price
  const discount = Math.max(0, parsePrice(hotel.originalPrice) - totalPrice.basePrice);

  function pay() {
    // Simulate successful payment
    setState(s => ({ ...s, paymentSuccess: true }));
    // Navigate to the new animated success modal
    navigation.navigate('Success');
  }

  const DetailRow = ({ label, value, isTotal = false }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: responsiveHeight(0.5) }}>
      <Text style={{ color: isTotal ? '#000' : ACCENT_GREY, fontWeight: isTotal ? '700' : '400', fontSize: responsiveFont(4) }}>{label}</Text>
      <Text style={{ fontWeight: isTotal ? '700' : '500', fontSize: responsiveFont(4) }}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader title="Review Summary" navigation={navigation} />

      <ScrollView contentContainerStyle={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingBottom: responsiveHeight(12), 
        paddingTop: responsiveHeight(2) 
      }}>

        <View style={{
          backgroundColor: '#fff',
          padding: responsiveWidth(5),
          borderRadius: responsiveWidth(3),
          elevation: 3,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
          marginTop: responsiveHeight(2)
        }}>
          <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), borderBottomWidth: 0.5, borderBottomColor: LIGHT_GREY, paddingBottom: responsiveHeight(1) }}>Booking Details</Text>
          <DetailRow label="Hotel Name" value={hotel.name} />
          <DetailRow label="Check In / Check Out" value={`${state.checkIn || '-'} / ${state.checkOut || '-'}`} />
          <DetailRow label="Guests / Rooms" value={`${state.guests} / ${state.rooms}`} />
          <DetailRow label="Duration" value={`${nights} night${nights !== 1 ? 's' : ''}`} />

          <View style={{ borderTopWidth: 0.5, borderTopColor: LIGHT_GREY, marginTop: responsiveHeight(1.5), paddingTop: responsiveHeight(1.5) }}>
            <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1) }}>Guest Details</Text>
            <DetailRow label="Name" value={state.guestInfo.name} />
            <DetailRow label="Email" value={state.guestInfo.email} />
          </View>

          <View style={{ borderTopWidth: 0.5, borderTopColor: LIGHT_GREY, marginTop: responsiveHeight(1.5), paddingTop: responsiveHeight(1.5) }}>
            <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1) }}>Payment Details</Text>
            <DetailRow label="Nightly Rate" value={formatPrice(parsePrice(hotel.price))} />
            <DetailRow label="Original Price" value={formatPrice(parsePrice(hotel.originalPrice))} />
            <DetailRow label="Discount" value={`-${formatPrice(discount)}`} />
            <DetailRow label="Tax (10%)" value={formatPrice(totalPrice.tax)} />
            <DetailRow label="Service Fee" value={formatPrice(totalPrice.serviceFee)} />
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: LIGHT_GREY, marginTop: responsiveHeight(1.5), paddingTop: responsiveHeight(1.5) }}>
            <DetailRow label="Total" value={formatPrice(totalPrice.total)} isTotal={true} />
          </View>
        </View>
      </ScrollView>

      <FloatingBottomButton
        title={`Pay ${formatPrice(totalPrice.total)}`}
        onPress={pay}
      />
    </SafeAreaView>
  );
}


export function SuccessScreen({ navigation }) {
  const { state } = useBooking();
  const totalPrice = calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms);

  const modalHeight = responsiveHeight(50);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const slideInStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [modalHeight, 0],
        }),
      },
    ],
  };

  const handleDone = () => {
    // FIX: Navigate back to MainTabs which contains the bottom tab navigator
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { 
            name: 'MainTabs',
            state: {
              routes: [{ name: 'Home' }],
            }
          },
        ],
      })
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dim background
        justifyContent: 'flex-end', // Align modal content to the bottom
      }}
    >
      <Animated.View
        style={[
          {
            backgroundColor: 'white',
            borderTopLeftRadius: responsiveWidth(8),
            borderTopRightRadius: responsiveWidth(8),
            padding: responsiveWidth(5),
            height: modalHeight,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 15,
          },
          slideInStyle, // Apply the slide-up animation style
        ]
      }>
        <Ionicons name="checkmark-circle" size={responsiveWidth(20)} color="#28A745" style={{ marginBottom: responsiveHeight(2) }} />
        <Text style={{ fontSize: responsiveFont(7), fontWeight: '800', color: '#1A202C', marginBottom: responsiveHeight(1) }}>
          Payment Successful
        </Text>
        
        <Text style={{ fontSize: responsiveFont(4.5), color: ACCENT_GREY, textAlign: 'center', marginBottom: responsiveHeight(1) }}>
          Your booking is confirmed! Receipt downloaded.
        </Text>
        <Text style={{ fontSize: responsiveFont(4), fontWeight: '600', color: '#1A202C', marginBottom: responsiveHeight(4) }}>
          Total Paid: {formatPrice(totalPrice.total)}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: PRIMARY_BLUE,
            paddingVertical: responsiveHeight(2),
            paddingHorizontal: responsiveWidth(8),
            // Cylindrical button for consistency
            borderRadius: responsiveWidth(10), 
            alignItems: 'center',
            width: '100%',
            shadowColor: PRIMARY_BLUE,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 5,
            elevation: 8,
          }}
          onPress={() => navigation.navigate('EReceipt')} 
        >
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: responsiveFont(4.5) }}>View E-Receipt</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{
            marginTop: responsiveHeight(2),
            padding: responsiveWidth(2),
          }}
          onPress={handleDone}
        >
          <Text style={{ color: ACCENT_GREY, fontWeight: '600', fontSize: responsiveFont(4) }}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}
// E-Receipt Screen
function EReceiptScreen({ navigation }) {
  const { state } = useBooking();
  const hotel = state.hotel;
  const totalPrice = calculateTotalPrice(state.hotel, state.checkIn, state.checkOut, state.rooms);
  const nights = calculateNights(state.checkIn, state.checkOut);

  const DetailRow = ({ label, value }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: responsiveHeight(0.5) }}>
      <Text style={{ color: ACCENT_GREY, fontSize: responsiveFont(3.8) }}>{label}</Text>
      <Text style={{ fontWeight: '500', fontSize: responsiveFont(3.8) }}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: LIGHT_GREY }}>
      <CustomHeader title="E-Receipt" navigation={navigation} />

      <ScrollView contentContainerStyle={{ 
        paddingHorizontal: responsiveWidth(5), 
        paddingBottom: responsiveHeight(5), 
        paddingTop: responsiveHeight(2) 
      }}>
        <HotelInfoSnippet 
          hotel={hotel} 
          showNights={true}
          nights={nights}
        />

        <View style={{
          backgroundColor: '#fff',
          padding: responsiveWidth(5),
          borderRadius: responsiveWidth(3),
          elevation: 3,
          shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2,
          marginTop: responsiveHeight(2),
          alignItems: 'center'
        }}>
          <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1) }}>Booking Details</Text>
          <View style={{ width: '100%', borderBottomWidth: 0.5, borderBottomColor: LIGHT_GREY, paddingBottom: responsiveHeight(1) }}>
            <DetailRow label="Check In" value={state.checkIn || '-'} />
            <DetailRow label="Check Out" value={state.checkOut || '-'} />
            <DetailRow label="Guests" value={state.guests} />
            <DetailRow label="Rooms" value={state.rooms} />
            <DetailRow label="Duration" value={`${nights} night${nights !== 1 ? 's' : ''}`} />
          </View>

          <View style={{ width: '100%', borderBottomWidth: 0.5, borderBottomColor: LIGHT_GREY, paddingVertical: responsiveHeight(1.5) }}>
            <Text style={{ fontWeight: '700', fontSize: responsiveFont(4.5), marginBottom: responsiveHeight(1) }}>Payment Details</Text>
            <DetailRow label="Amount Paid" value={formatPrice(totalPrice.total)} />
            <DetailRow label="Payment Method" value={`Card •••• ${state.card?.number || 'XXXX'}`} />
            <DetailRow label="Transaction ID" value={`#${Math.random().toString(36).substr(2, 9).toUpperCase()}`} />
            <DetailRow label="Payment Date & Time" value={new Date().toLocaleString()} />
          </View>

          <View style={{ height: responsiveHeight(10), width: '80%', backgroundColor: LIGHT_GREY, marginTop: responsiveHeight(3), justifyContent: 'center', alignItems: 'center', borderRadius: responsiveWidth(2) }}>
            <Text style={{ color: ACCENT_GREY, fontWeight: '700' }}>[Barcode Placeholder]</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: responsiveHeight(3) }}>
          <TouchableOpacity
            style={{ 
              borderWidth: 1, 
              borderColor: PRIMARY_BLUE, 
              paddingVertical: responsiveHeight(2), 
              borderRadius: responsiveWidth(10), 
              alignItems: 'center', 
              width: '80%', 
              backgroundColor: '#fff' 
            }}
            onPress={() => 
              navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [
                    { 
                      name: 'MainTabs',
                      state: {
                        routes: [{ name: 'Home' }],
                      }
                    },
                  ],
                })
              )
            }
          >
            <Text style={{ color: PRIMARY_BLUE, fontWeight: '700', fontSize: responsiveFont(4) }}>Back to Home</Text>
          </TouchableOpacity>

        </View>
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