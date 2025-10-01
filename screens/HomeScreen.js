import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Responsive Helpers
function responsiveWidth(p) { return (p * width) / 100; }
function responsiveHeight(p) { return (p * height) / 100; }
function responsiveFont(p) { return (p * width) / 100; }

// Constants
const ACCENT_COLOR = '#4B75E9';
const TEXT_GRAY = '#A2A5AD';
const INPUT_BG = '#F5F5F9';

// Mock Data
const HOTELS = [
  {
    id: '1',
    name: 'Elysium Gardens',
    location: 'Paris, France',
    price: '$349,7',
    pricePer: '/month',
    rating: '4.5',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200',
      'https://images.unsplash.com/photo-1543336322-26d9c6e1189d?w=1200',
    ],
    facilities: [
      { name: 'Wi-Fi', icon: 'wifi' },
      { name: 'Restaurant', icon: 'restaurant' },
      { name: 'Garden', icon: 'leaf' },
      { name: 'Gym', icon: 'fitness' },
    ],
    description: 'The premier luxury experience in Paris. Indulge in our exquisite gardens and world-class services.'
  },
  {
    id: '2',
    name: 'Azure Heights',
    location: 'Rome, Italy',
    price: '$299,9',
    pricePer: '/month',
    rating: '4.8',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200',
      'https://images.unsplash.com/photo-1574977465660-f1c6d2673d32?w=1200',
    ],
    facilities: [
      { name: 'Pool', icon: 'water' },
      { name: 'Spa', icon: 'bandage' },
      { name: 'Bar', icon: 'wine' },
    ],
    description: 'A breathtaking view of the Italian skyline. A blend of ancient history and modern luxury.'
  },
  {
    id: '3',
    name: 'Solara Springs',
    location: 'London, UK',
    price: '$199,5',
    pricePer: '/month',
    rating: '4.2',
    images: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200',
    ],
    facilities: [
      { name: 'Breakfast', icon: 'restaurant' },
      { name: 'Pet Friendly', icon: 'paw' },
    ],
    description: 'Cozy and contemporary stay in the heart of London, close to all major attractions.'
  }
];

function Header({ title, leftIcon, onLeftPress }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onLeftPress} style={styles.headerLeftIcon} disabled={!onLeftPress}>
        {leftIcon && <Ionicons name={leftIcon} size={responsiveFont(6)} color="#000" />}
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: responsiveWidth(10) }} />
    </View>
  );
}

function HomeScreen({ onSelectHotel }) {
  return (
    <SafeAreaView style={styles.full}> 
      <StatusBar style="dark" />
      
      <View style={styles.homeHeaderRow}>
        <View style={styles.userRow}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' }} style={styles.avatar} />
          <View>
            <Text style={styles.findText}>Find events near</Text>
            <Text style={styles.locationText}>California, USA</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notifyBtn}><Ionicons name="notifications-outline" size={responsiveFont(5)} color="#000" /></TouchableOpacity>
      </View>

      {/* Multi-field Search Module */}
      <View style={styles.searchCard}>
        <TouchableOpacity style={styles.fullInput}>
          <Ionicons name="mail-outline" size={responsiveFont(4.5)} color={TEXT_GRAY} />
          <Text style={styles.inputText}>London, England</Text>
        </TouchableOpacity>
        <View style={styles.gridRow}>
          <View style={styles.inputSmall}><Ionicons name="calendar-outline" size={responsiveFont(4)} color={TEXT_GRAY} /><Text style={styles.inputText}>20/07/25</Text></View>
          <View style={styles.inputSmall}><Ionicons name="calendar-outline" size={responsiveFont(4)} color={TEXT_GRAY} /><Text style={styles.inputText}>26/07/25</Text></View>
          <View style={styles.inputSmall}><Ionicons name="person-outline" size={responsiveFont(4)} color={TEXT_GRAY} /><Text style={styles.inputText}>1 Guest</Text></View>
          <View style={styles.inputSmall}><Ionicons name="home-outline" size={responsiveFont(4)} color={TEXT_GRAY} /><Text style={styles.inputText}>1 Room</Text></View>
        </View>
        <TouchableOpacity style={styles.findButton}><Text style={styles.findButtonText}>Find Hotel</Text></TouchableOpacity>
      </View>

      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Popular Hotel</Text>
        <TouchableOpacity><Text style={styles.viewAll}>View All</Text></TouchableOpacity>
      </View>

      <FlatList
        data={HOTELS}
        keyExtractor={(i) => i.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.popularList}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => onSelectHotel(item)} activeOpacity={0.9}>
            <Image source={{ uri: item.images[0] }} style={styles.cardImage} />
            <View style={styles.cardInfo}>
              <View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardLocation}>{item.location}</Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.priceRow}><Text style={styles.priceText}>{item.price}</Text><Text style={styles.pricePer}>{item.pricePer}</Text></View>
                <Ionicons name="heart-outline" size={responsiveFont(5)} color={TEXT_GRAY} />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

function HotelDetailsScreen({ hotel, onBack, onBook }) {
  return (
    <SafeAreaView style={styles.full}>
      <StatusBar style="light" />
      
      {/* Image Header with Back Button */}
      <View style={styles.imageHeader}>
        <Image source={{ uri: hotel.images[0] }} style={styles.mainImage} />
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={onBack} style={styles.backCircle}><Ionicons name="arrow-back" size={responsiveFont(6)} color="#fff" /></TouchableOpacity>
          <Text style={styles.overlayTitle}>Details</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.detailsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.titleRow}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <TouchableOpacity style={styles.heart}><Ionicons name="heart" size={responsiveFont(7)} color={ACCENT_COLOR} /></TouchableOpacity>
        </View>
        <Text style={styles.hotelLocation}>{hotel.location}</Text>
        <View style={styles.ratingRow}><Ionicons name="star" size={responsiveFont(4)} color="#FFD700" /><Text style={styles.ratingText}>{hotel.rating}<Text style={styles.reviewCount}>(123 Reviews)</Text></Text></View>

        <Text style={styles.sectionTitle}>Facilities</Text>
        <FlatList horizontal data={hotel.facilities} keyExtractor={(f) => f.name} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.facilitiesList}
          renderItem={({ item }) => (
            <View style={styles.facilityItem}><Ionicons name={item.icon} size={responsiveFont(5)} color="#000" /><Text style={styles.facilityText}>{item.name}</Text></View>
          )}
        />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{hotel.description}</Text>

        <Text style={styles.sectionTitle}>Gallery</Text>
        <FlatList horizontal data={hotel.images} keyExtractor={(u,i)=>`g-${i}`} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryList}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.galleryImage} />
          )}
        />

        <View style={{ height: responsiveHeight(8) }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <View style={styles.priceValueRow}><Text style={styles.priceValue}>{hotel.price}</Text><Text style={styles.pricePer}>{hotel.pricePer}</Text></View>
        </View>
        <TouchableOpacity style={styles.bookNow} onPress={() => onBook(hotel)}>
          <Text style={styles.bookNowText}>Book Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function BookingInfoScreen({ hotel, onBack }) {
  return (
    <SafeAreaView style={styles.full}>
      <Header title="Booking Info" leftIcon="arrow-back" onLeftPress={onBack} />
      
      <ScrollView contentContainerContainerStyle={styles.bookingContent} showsVerticalScrollIndicator={false}>
        {/* Hotel Summary */}
        <View style={styles.bookingSummary}>
          <Image source={{ uri: hotel.images[0] }} style={styles.summaryImage} />
          <View style={{ flex: 1, marginLeft: responsiveWidth(3) }}>
            <Text style={styles.summaryName}>{hotel.name}</Text>
            <Text style={styles.summaryLoc}>{hotel.location}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(0.5) }}>
              <Ionicons name="star" size={responsiveFont(3.5)} color="#FFD700" />
              <Text style={styles.summaryRating}>{hotel.rating}</Text>
            </View>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.summaryPrice}>{hotel.price}</Text>
            <Text style={styles.summaryPer}>{hotel.pricePer}</Text>
          </View>
        </View>

        {/* Booking Fields (Static/Read-only) */}
        <View style={styles.fieldsGrid}>
          {/* Check-in Date */}
          <View style={styles.fieldBox}><Ionicons name="calendar-outline" size={responsiveFont(4)} color="#000" /><Text style={styles.fieldText}>20/07/25</Text></View>
          {/* Check-out Date */}
          <View style={styles.fieldBox}><Ionicons name="calendar-outline" size={responsiveFont(4)} color="#000" /><Text style={styles.fieldText}>26/07/25</Text></View>
          {/* Guests */}
          <View style={styles.fieldBox}><Ionicons name="person-outline" size={responsiveFont(4)} color="#000" /><Text style={styles.fieldText}>1 Guest</Text></View>
          {/* Rooms */}
          <View style={styles.fieldBox}><Ionicons name="home-outline" size={responsiveFont(4)} color="#000" /><Text style={styles.fieldText}>1 Room</Text></View>
          {/* Room Type */}
          <View style={styles.fieldBox}><Ionicons name="bed-outline" size={responsiveFont(4)} color="#000" /><Text style={styles.fieldText}>Economy Room</Text><Ionicons name="chevron-down" size={responsiveFont(3)} color="#000" style={{ marginLeft: responsiveWidth(1) }} /></View>
          {/* Payment Method */}
          <View style={styles.fieldBox}><Ionicons name="card-outline" size={responsiveFont(4)} color="#000" /><Text style={styles.fieldText}>5698 ***** **** 2317</Text><Ionicons name="chevron-down" size={responsiveFont(3)} color="#000" style={{ marginLeft: responsiveWidth(1) }} /></View>
        </View>

        <View style={{ height: responsiveHeight(10) }} />
      </ScrollView>

      {/* Footer: Navigation bar with left/right arrow icons */}
      <View style={styles.footerNav}>
        <TouchableOpacity><Ionicons name="chevron-back" size={responsiveFont(6)} color="#000" /></TouchableOpacity>
        <TouchableOpacity><Ionicons name="chevron-forward" size={responsiveFont(6)} color="#000" /></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


export default function App() {
 
  const [view, setView] = useState('home'); 
  const [selected, setSelected] = useState(HOTELS[0]); 

  
  function openDetails(hotel) { 
    setSelected(hotel); 
    setView('details'); 
  }

  
  function openBooking(hotel) { 
    setSelected(hotel); 
    setView('booking'); 
  }

  
  function goBack() {
    if (view === 'booking') {
      setView('details'); 
    } else if (view === 'details') {
      setView('home'); 
    }
  }

 
  return (
    <View style={{ flex: 1 }}>
      {view === 'home' && <HomeScreen onSelectHotel={openDetails} />}
      {view === 'details' && <HotelDetailsScreen hotel={selected} onBack={goBack} onBook={openBooking} />}
      {view === 'booking' && <BookingInfoScreen hotel={selected} onBack={goBack} />}
      <StatusBar style="auto" />
    </View>
  );
}


const styles = StyleSheet.create({
  full: { flex: 1, backgroundColor: '#FFFFFF' },
  

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(4), paddingTop: responsiveHeight(2), paddingBottom: responsiveHeight(1) },
  headerLeftIcon: { width: responsiveWidth(10) },
  headerTitle: { fontSize: responsiveFont(5), fontWeight: '700' },

  // HomeScreen Styles
  homeHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(4), paddingTop: responsiveHeight(2) },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: responsiveWidth(12), height: responsiveWidth(12), borderRadius: responsiveWidth(6), marginRight: responsiveWidth(3) },
  findText: { fontSize: responsiveFont(3), color: TEXT_GRAY },
  locationText: { fontSize: responsiveFont(4.2), fontWeight: '700' },
  notifyBtn: { padding: responsiveWidth(1) },
  searchCard: { backgroundColor: '#FFFFFF', margin: responsiveWidth(4), borderRadius: responsiveWidth(4), padding: responsiveWidth(4), shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 4 },
  fullInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, padding: responsiveWidth(3), borderRadius: responsiveWidth(3), marginBottom: responsiveHeight(2) },
  inputText: { fontSize: responsiveFont(3.5), marginLeft: responsiveWidth(2), color: '#333' },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  inputSmall: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG, padding: responsiveWidth(3), borderRadius: responsiveWidth(3), marginBottom: responsiveHeight(1.5) },
  findButton: { backgroundColor: ACCENT_COLOR, padding: responsiveHeight(1.6), borderRadius: responsiveWidth(3), alignItems: 'center' },
  findButtonText: { color: '#fff', fontWeight: '700', fontSize: responsiveFont(4) },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: responsiveWidth(4), marginTop: responsiveHeight(2) },
  sectionTitle: { fontSize: responsiveFont(5), fontWeight: '700' },
  viewAll: { color: ACCENT_COLOR, fontWeight: '600', fontSize: responsiveFont(3.6) },
  popularList: { paddingLeft: responsiveWidth(4), paddingVertical: responsiveHeight(2) },
  card: { width: responsiveWidth(65), marginRight: responsiveWidth(4), backgroundColor: '#fff', borderRadius: responsiveWidth(4), overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardImage: { width: '100%', height: responsiveHeight(22) },
  cardInfo: { padding: responsiveWidth(3) },
  cardTitle: { fontSize: responsiveFont(4.2), fontWeight: '700' },
  cardLocation: { fontSize: responsiveFont(3.2), color: TEXT_GRAY, marginTop: responsiveHeight(0.5) },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: responsiveHeight(1) },
  priceRow: { flexDirection: 'row', alignItems: 'baseline' },
  priceText: { fontSize: responsiveFont(5), fontWeight: '700' },
  pricePer: { fontSize: responsiveFont(3.4), color: TEXT_GRAY, marginLeft: responsiveWidth(1) },

  
  imageHeader: { width: '100%', height: responsiveHeight(35), backgroundColor: '#000' },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerOverlay: { position: 'absolute', top: responsiveHeight(3), left: responsiveWidth(3), right: responsiveWidth(3), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backCircle: { backgroundColor: 'rgba(0,0,0,0.35)', padding: responsiveWidth(2), borderRadius: responsiveWidth(8) },
  overlayTitle: { color: '#fff', fontSize: responsiveFont(5), fontWeight: '700', position: 'absolute', left: 0, right: 0, textAlign: 'center' },
  detailsContent: { paddingHorizontal: responsiveWidth(4), paddingTop: responsiveHeight(2), paddingBottom: responsiveHeight(6) },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  hotelName: { fontSize: responsiveFont(7.2), fontWeight: '700' },
  heart: { padding: responsiveWidth(1) },
  hotelLocation: { fontSize: responsiveFont(3.6), color: TEXT_GRAY, marginTop: responsiveHeight(0.5) },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: responsiveHeight(1) },
  ratingText: { fontSize: responsiveFont(4.2), fontWeight: '600', marginLeft: responsiveWidth(1) },
  reviewCount: { color: TEXT_GRAY, fontWeight: '400' },
  facilitiesList: { paddingVertical: responsiveHeight(1) },
  facilityItem: { alignItems: 'center', marginRight: responsiveWidth(6) },
  facilityText: { marginTop: responsiveHeight(0.6), fontSize: responsiveFont(3.2) },
  description: { fontSize: responsiveFont(4), color: '#333', lineHeight: responsiveFont(6), marginBottom: responsiveHeight(2) },
  galleryList: { paddingVertical: responsiveHeight(1) },
  galleryImage: { width: responsiveWidth(45), height: responsiveHeight(15), borderRadius: responsiveWidth(3), marginRight: responsiveWidth(3) },
  bottomBar: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(1.5), borderTopWidth: 1, borderTopColor: '#F0F0F0' },
  priceLabel: { color: TEXT_GRAY, fontSize: responsiveFont(3.2) },
  priceValueRow: { flexDirection: 'row', alignItems: 'baseline' },
  priceValue: { fontSize: responsiveFont(6), fontWeight: '700' },
  bookNow: { backgroundColor: ACCENT_COLOR, paddingHorizontal: responsiveWidth(8), paddingVertical: responsiveHeight(1.6), borderRadius: responsiveWidth(3) },
  bookNowText: { color: '#fff', fontSize: responsiveFont(4.2), fontWeight: '700' },
  
  // BookingInfoScreen Styles
  bookingContent: { padding: responsiveWidth(4), paddingBottom: responsiveHeight(12) },
  bookingSummary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: responsiveWidth(3), borderRadius: responsiveWidth(3), shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  summaryImage: { width: responsiveWidth(20), height: responsiveWidth(14), borderRadius: responsiveWidth(3) },
  summaryName: { fontSize: responsiveFont(4), fontWeight: '700' },
  summaryLoc: { color: TEXT_GRAY, marginTop: responsiveHeight(0.4) },
  summaryRating: { marginLeft: responsiveWidth(1), fontSize: responsiveFont(3.6) },
  summaryPrice: { fontSize: responsiveFont(4.6), fontWeight: '700' },
  summaryPer: { color: TEXT_GRAY },
  fieldsGrid: { marginTop: responsiveHeight(2), flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  fieldBox: { width: '48%', backgroundColor: INPUT_BG, padding: responsiveWidth(3), borderRadius: responsiveWidth(3), marginBottom: responsiveHeight(2), flexDirection: 'row', alignItems: 'center' },
  fieldText: { marginLeft: responsiveWidth(2), fontSize: responsiveFont(3.4), flex: 1 },
  footerNav: { position: 'absolute', left: 0, right: 0, bottom: 0, height: responsiveHeight(9), backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#EEE', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: responsiveWidth(10) }
});