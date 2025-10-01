import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  FlatList,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get('window');


function responsiveWidth(percentage) {
  return (percentage * width) / 100;
}
function responsiveHeight(percentage) {
  return (percentage * height) / 100;
}
function responsiveFont(percentage) {
  return (percentage * width) / 100;
}

const ACCENT_COLOR = '#4B75E9';
const TEXT_GRAY = '#A2A5AD';
const INPUT_BG_COLOR = '#F5F5F9';

export const ELYSIUM_GARDENS_DETAILS = {
  id: '1',
  name: 'Elysium Gardens',
  location: 'Paris, France',
  price: '$1,500',
  pricePer: '/Night',
  rating: '4.5',
  reviewCount: '10,92',
  images: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1543336322-26d9c6e1189d?w=500&h=300&fit=crop',
  ],
  videos: [
    { type: 'video', url: 'https://mock.video/elysium-tour.mp4', thumbnail: 'https://images.unsplash.com/photo-1582268611958-abf29d400260?w=500&h=300&fit=crop' },
  ],
  facilities: [
    { name: 'Wi-Fi', icon: 'wifi' },
    { name: 'Restaurant', icon: 'restaurant' },
    { name: 'Cafe', icon: 'cafe' },
    { name: 'Garden', icon: 'leaf' },
    { name: 'Gym', icon: 'barbell' },
  ],
  description: 'The premier luxury experience in Paris. Indulge in our exquisite gardens and world-class services.',
};

const AZURE_HEIGHTS_DETAILS = {
  id: '2',
  name: 'Azure Heights Resort',
  location: 'Rome, Italy',
  price: '$1,200',
  pricePer: '/Night',
  rating: '4.8',
  reviewCount: '8,50',
  images: [
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop',
    'https://images.unsplash.com/photo-1574977465660-f1c6d2673d32?w=500&h=300&fit=crop',
  ],
  videos: [
    { type: 'video', url: 'https://mock.video/azure-pool.mp4', thumbnail: 'https://images.unsplash.com/photo-1574977465660-f1c6d2673d32?w=500&h=300&fit=crop' },
    { type: 'video', url: 'https://mock.video/azure-view.mp4', thumbnail: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop' },
  ],
  facilities: [
    { name: 'Pool', icon: 'water' },
    { name: 'Spa', icon: 'body' },
    { name: 'Bar', icon: 'wine' },
    { name: 'Parking', icon: 'car' },
  ],
  description: 'A breathtaking view of the Italian skyline. A blend of ancient history and modern luxury.',
};

const SOLARA_SPRINGS_DETAILS = {
  id: '3',
  name: 'Solara Springs Hotel',
  location: 'London, UK',
  price: '$950',
  pricePer: '/Night',
  rating: '4.2',
  reviewCount: '5,10',
  images: [
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop',
  ],
  videos: [],
  facilities: [
    { name: 'Breakfast', icon: 'egg' },
    { name: 'Pet Friendly', icon: 'paw' },
  ],
  description: 'Cozy and contemporary stay in the heart of London, close to all major attractions.',
};

const HOTEL_DETAILS_MAP = {
  '1': ELYSIUM_GARDENS_DETAILS,
  '2': AZURE_HEIGHTS_DETAILS,
  '3': SOLARA_SPRINGS_DETAILS,
};

// --- Sub-Components ---
const DotIndicator = ({ isActive }) => (
  <View style={[styles.dot, isActive && styles.activeDot]} />
);

const PopularHotelCard = ({ item, onPress }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => onPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.hotelImageContainer}>
        <Image source={{ uri: item.image }} style={styles.hotelImage} />
        <View style={styles.ratingOverlay}>
          <Ionicons name="star" size={responsiveFont(3)} color="#FFD700" />
          <Text style={styles.ratingTextOverlay}>{item.rating}</Text>
        </View>
        <View style={styles.imageIndicators}>
          <DotIndicator isActive={true} /><DotIndicator isActive={false} />
        </View>
      </View>
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelNameCard}>{item.name}</Text>
        <Text style={styles.hotelLocationCard}>{item.location}</Text>
        <View style={styles.hotelFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.perMonth}>/month</Text>
          </View>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={responsiveFont(5)} color={isFavorite ? ACCENT_COLOR : TEXT_GRAY} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const OfferListItem = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <TouchableOpacity style={styles.offerCard} activeOpacity={0.8}>
      <Image source={{ uri: item.image }} style={styles.offerImage} />
      <View style={styles.offerContent}>
        <View style={styles.offerText}>
          <View>
            <Text style={styles.offerName}>{item.name}</Text>
            <Text style={styles.offerLocation}>{item.location}</Text>
          </View>
          <View style={styles.offerPrice}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.perMonth}>/month</Text>
          </View>
        </View>
        <View style={styles.offerRight}>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={responsiveFont(5)} color={isFavorite ? ACCENT_COLOR : TEXT_GRAY} />
          </TouchableOpacity>
          <View style={styles.offerRating}>
            <Ionicons name="star" size={responsiveFont(3)} color="#FFD700" />
            <Text style={styles.ratingTextSmall}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};


const GalleryItem = ({ item }) => {
  const isVideo = item.type === 'video';
  const imageUri = isVideo ? item.thumbnail : item.url;
  const source = { uri: imageUri || 'https://via.placeholder.com/150/CCCCCC/808080?text=No+Media' };

  return (
    <TouchableOpacity
      style={styles.galleryItem}
      activeOpacity={0.8}
    >
      <Image source={source} style={styles.galleryImage} />
      {isVideo && (
        <View style={styles.videoOverlay}>
          <Ionicons name="play-circle" size={responsiveFont(8)} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );
};

export const HotelDetailsScreen = ({ hotel, onBackPress }) => {
  const renderFacility = ({ item }) => (
    <View style={styles.facilityItem}>
      <Ionicons name={item.icon} size={responsiveFont(7)} color="#000000" />
      <Text style={styles.facilityText}>{item.name}</Text>
    </View>
  );

  const galleryData = [
    ...(hotel.images || []).map((url, index) => ({ id: `img-${index}`, type: 'image', url })),
    ...(hotel.videos || []).map((video, index) => ({ id: `vid-${index}`, type: 'video', url: video.url, thumbnail: video.thumbnail })),
  ];

  if (!hotel) return <Text>Hotel details not loaded.</Text>;

  return (
    <View style={styles.detailsFullContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailsScrollViewContent}>

        <View style={styles.imageSliderContainer}>
          <Image source={{ uri: hotel.images[0] }} style={styles.mainImage} />
          <SafeAreaView style={styles.headerOverlay} edges={['top']}>
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={responsiveFont(8)} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.detailsTitle}>Details</Text>
          </SafeAreaView>
          <View style={styles.imageIndicators}>
            {[...Array(3)].map((_, index) => (<DotIndicator key={index} isActive={index === 0} />))}
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart" size={responsiveFont(7)} color={ACCENT_COLOR} />
            </TouchableOpacity>
          </View>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={responsiveFont(4)} color="#FFD700" />
            <Text style={styles.ratingText}>
              {hotel.rating}<Text style={styles.reviewCountText}>({hotel.reviewCount} Reviews)</Text>
            </Text>
          </View>

          <Text style={styles.sectionTitleDetails}>Facilities</Text>
          <FlatList data={hotel.facilities} renderItem={renderFacility} keyExtractor={(item) => item.name} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.facilitiesList} />

          <Text style={styles.sectionTitleDetails}>Description</Text>
          <Text style={styles.descriptionText}>
            {hotel.description}<Text style={styles.readMoreText}> Read More</Text>
          </Text>

          <Text style={styles.sectionTitleDetails}>Gallery</Text>
          <FlatList
            data={galleryData}
            renderItem={({ item }) => <GalleryItem item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.galleryList}
          />

          <Text style={styles.sectionTitleDetails}>Location</Text>
          <View style={styles.mapContainer}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1541818165980-007cc7282b0f?w=500&h=300&fit=crop' }} style={styles.mapImagePlaceholder} />
            <View style={styles.mapPinOverlay}>
              <Ionicons name="location" size={responsiveFont(8)} color={ACCENT_COLOR} />
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      <SafeAreaView style={styles.bottomBar} edges={['bottom']}>
        <View style={styles.priceTextContainer}>
          <Text style={styles.priceLabel}>Price</Text>
          <View style={styles.priceValueRow}>
            <Text style={styles.priceValue}>{hotel.price}</Text>
            <Text style={styles.pricePerDetails}>{hotel.pricePer}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={() => Linking.openURL('http://example.com/book')} activeOpacity={0.8}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};


export default function HomeScreen({ route }) {
  
  const [viewState, setViewState] = useState({
    isDetails: false,
    details: null,
  });

  const handleHotelPress = (hotelId) => {
    const hotelDetails = HOTEL_DETAILS_MAP[hotelId];
    setViewState({ isDetails: true, details: hotelDetails });
  };

  const handleBackPress = () => {
    setViewState({ isDetails: false, details: null });
  }

  
  if (viewState.isDetails && viewState.details) {
    return <HotelDetailsScreen hotel={viewState.details} onBackPress={handleBackPress} />;
  }

 
  const popularHotels = [
    { id: '1', name: 'Elysium Gardens', location: 'Paris, France', price: '$1,500', rating: '4.5', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&h=300&fit=crop', },
    { id: '2', name: 'Azure Heights', location: 'Rome, Italy', price: '$1,200', rating: '4.8', image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&h=300&fit=crop', },
    { id: '3', name: 'Solara Springs', location: 'London, UK', price: '$950', rating: '4.2', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&h=300&fit=crop', },
  ];

  const offerList = [
    { id: '10', name: 'Exclusive Retreat', location: 'Bali, Indonesia', price: '$349.7', rating: '4.5', image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=200&h=150&fit=crop' },
    { id: '11', name: 'Weekend Getaway', location: 'New York, USA', price: '$299', rating: '4.7', image: 'https://images.unsplash.com/photo-1564013799882-ce155b1f5d2b?w=200&h=150&fit=crop' },
  ];

  return (
    <View style={styles.fullContainer}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face' }} style={styles.profileImage}/>
            <View style={styles.locationText}>
              <Text style={styles.findText}>Find events near</Text>
              <Text style={styles.locationNameHeader}>California, USA</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={responsiveFont(6.5)} color="#000000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

          <View style={styles.searchModule}>
            <TouchableOpacity style={[styles.inputField, styles.fullWidthInput]}>
              <Ionicons name="mail-outline" size={responsiveFont(4.5)} color={TEXT_GRAY} />
              <Text style={styles.inputText}>London, England</Text>
            </TouchableOpacity>

            <View style={styles.inputGrid}>
              <TouchableOpacity style={styles.inputField}><Ionicons name="calendar-outline" size={responsiveFont(4.5)} color={TEXT_GRAY} /><Text style={styles.inputText}>20/07/25</Text></TouchableOpacity>
              <TouchableOpacity style={styles.inputField}><Ionicons name="calendar-outline" size={responsiveFont(4.5)} color={TEXT_GRAY} /><Text style={styles.inputText}>26/07/25</Text></TouchableOpacity>
              <TouchableOpacity style={styles.inputField}><Ionicons name="person-outline" size={responsiveFont(4.5)} color={TEXT_GRAY} /><Text style={styles.inputText}>1 Guest</Text></TouchableOpacity>
              <TouchableOpacity style={styles.inputField}><Ionicons name="home-outline" size={responsiveFont(4.5)} color={TEXT_GRAY} /><Text style={styles.inputText}>1 Room</Text></TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.searchButton}>
              <Text style={styles.searchButtonText}>Find Hotel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Hotel</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
            </View>
            <FlatList
              data={popularHotels}
              renderItem={({ item }) => (
                <PopularHotelCard item={item} onPress={handleHotelPress}/>
              )}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Your Offer List</Text>
              <TouchableOpacity><Text style={styles.viewAllText}>View All</Text></TouchableOpacity>
            </View>
            <FlatList data={offerList} renderItem={({ item }) => <OfferListItem item={item} />} keyExtractor={(item) => item.id} scrollEnabled={false} contentContainerStyle={styles.verticalList} />
          </View>

          <View style={styles.bottomSpacing} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}


const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: '#FFFFFF', },
  container: { flex: 1, backgroundColor: '#FFFFFF', },
  scrollView: { flex: 1, },
  bottomSpacing: { height: responsiveHeight(5), },

  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: responsiveWidth(5), paddingTop: responsiveHeight(1), paddingBottom: responsiveHeight(1.5), backgroundColor: '#FFFFFF', },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, },
  profileImage: { width: responsiveWidth(13), height: responsiveWidth(13), borderRadius: responsiveWidth(6.5), marginRight: responsiveWidth(4), },
  locationText: { flex: 1, },
  findText: { fontSize: responsiveFont(3), color: TEXT_GRAY, marginBottom: 1, fontWeight: '400', },
  locationNameHeader: { fontSize: responsiveFont(4.5), fontWeight: '700', color: '#000000', },
  notificationButton: { padding: responsiveWidth(1), },

  searchModule: { backgroundColor: '#FFFFFF', marginHorizontal: responsiveWidth(5), borderRadius: responsiveWidth(5), padding: responsiveWidth(5), marginTop: responsiveHeight(1), shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 8, },
  fullWidthInput: { width: '100%', marginBottom: responsiveHeight(2.5), },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: responsiveHeight(3), },
  inputField: { width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG_COLOR, paddingHorizontal: responsiveWidth(3), paddingVertical: responsiveHeight(1.8), borderRadius: responsiveWidth(3), marginBottom: responsiveHeight(2), },
  inputText: { fontSize: responsiveFont(3.5), color: '#333333', marginLeft: responsiveWidth(2), fontWeight: '500', flex: 1, },
  searchButton: { backgroundColor: ACCENT_COLOR, paddingVertical: responsiveHeight(2.2), borderRadius: responsiveWidth(3), alignItems: 'center', },
  searchButtonText: { fontSize: responsiveFont(4.5), fontWeight: '700', color: '#FFFFFF', },

  section: { marginTop: responsiveHeight(3), },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: responsiveWidth(5), marginBottom: responsiveHeight(2), },
  sectionTitle: { fontSize: responsiveFont(5.5), fontWeight: '700', color: '#000000', },
  viewAllText: { fontSize: responsiveFont(4), fontWeight: '600', color: ACCENT_COLOR, },
  horizontalList: { paddingHorizontal: responsiveWidth(5), },
  hotelCard: { width: responsiveWidth(65), backgroundColor: '#FFFFFF', borderRadius: responsiveWidth(4), marginRight: responsiveWidth(4), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, },
  hotelImageContainer: { position: 'relative', },
  hotelImage: { width: '100%', height: responsiveHeight(22), borderTopLeftRadius: responsiveWidth(4), borderTopRightRadius: responsiveWidth(4), },
  ratingOverlay: { position: 'absolute', top: responsiveHeight(1.5), left: responsiveWidth(3), flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.6)', paddingHorizontal: responsiveWidth(2), paddingVertical: responsiveHeight(0.5), borderRadius: responsiveWidth(2), },
  ratingTextOverlay: { fontSize: responsiveFont(3.5), color: '#FFFFFF', marginLeft: responsiveWidth(1), fontWeight: '600', },
  imageIndicators: { position: 'absolute', bottom: responsiveHeight(1), left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
  dot: { width: responsiveWidth(1.5), height: responsiveWidth(1.5), borderRadius: responsiveWidth(0.75), backgroundColor: 'rgba(255, 255, 255, 0.5)', marginHorizontal: responsiveWidth(0.5), },
  activeDot: { backgroundColor: '#FFFFFF', width: responsiveWidth(3), },
  hotelInfo: { padding: responsiveWidth(4), },
  hotelNameCard: { fontSize: responsiveFont(4.5), fontWeight: '700', color: '#000000', marginBottom: 2, },
  hotelLocationCard: { fontSize: responsiveFont(3.5), color: TEXT_GRAY, marginBottom: responsiveHeight(1.5), },
  hotelFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline', },
  price: { fontSize: responsiveFont(5), fontWeight: '700', color: '#000000', },
  perMonth: { fontSize: responsiveFont(3.5), color: TEXT_GRAY, marginLeft: 2, },

  verticalList: { paddingHorizontal: responsiveWidth(5), },
  offerCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: responsiveWidth(4), marginBottom: responsiveHeight(2), padding: responsiveWidth(3.5), shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3, },
  offerImage: { width: responsiveWidth(25), height: responsiveHeight(12), borderRadius: responsiveWidth(3), },
  offerContent: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginLeft: responsiveWidth(4), },
  offerText: { justifyContent: 'space-between', paddingVertical: responsiveHeight(0.5), flex: 1, },
  offerName: { fontSize: responsiveFont(4), fontWeight: '700', color: '#000000', },
  offerLocation: { fontSize: responsiveFont(3.5), color: TEXT_GRAY, },
  offerPrice: { flexDirection: 'row', alignItems: 'baseline', },
  offerRight: { alignItems: 'flex-end', justifyContent: 'space-between', paddingVertical: responsiveHeight(0.5), },
  offerRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: INPUT_BG_COLOR, paddingHorizontal: responsiveWidth(2.5), paddingVertical: responsiveHeight(0.7), borderRadius: responsiveWidth(2), },
  ratingTextSmall: { fontSize: responsiveFont(3), color: '#333333', marginLeft: responsiveWidth(1), fontWeight: '600', },

  detailsFullContainer: { flex: 1, backgroundColor: '#FFFFFF', },
  detailsScrollViewContent: { paddingBottom: responsiveHeight(12) },
  imageSliderContainer: { width: width, height: responsiveHeight(35), position: 'relative', },
  mainImage: { width: '100%', height: '100%', resizeMode: 'cover', },
  headerOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: responsiveWidth(5), paddingVertical: responsiveHeight(1), zIndex: 10, },
  backButton: { padding: responsiveWidth(1), backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: responsiveWidth(10), },
  detailsTitle: { fontSize: responsiveFont(5), fontWeight: '700', color: '#FFFFFF', position: 'absolute', left: 0, right: 0, textAlign: 'center', paddingTop: responsiveHeight(1.5), },
  contentContainer: { paddingHorizontal: responsiveWidth(5), paddingTop: responsiveHeight(2), },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
  hotelName: { fontSize: responsiveFont(8), fontWeight: '700', color: '#000000', },
  hotelLocation: { fontSize: responsiveFont(4), color: TEXT_GRAY, marginBottom: responsiveHeight(1.5), },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: responsiveHeight(3), },
  ratingText: { fontSize: responsiveFont(4.5), fontWeight: '600', color: '#000000', marginLeft: responsiveWidth(1.5), },
  reviewCountText: { color: TEXT_GRAY, fontWeight: '400', },
  sectionTitleDetails: { fontSize: responsiveFont(5.5), fontWeight: '700', color: '#000000', marginTop: responsiveHeight(2), marginBottom: responsiveHeight(1.5), },
  facilitiesList: { paddingBottom: responsiveHeight(2), },
  facilityItem: { alignItems: 'center', marginRight: responsiveWidth(7), },
  facilityText: { fontSize: responsiveFont(3.5), color: '#000000', marginTop: responsiveHeight(0.5), },
  descriptionText: { fontSize: responsiveFont(4), color: '#333333', lineHeight: responsiveFont(6), marginBottom: responsiveHeight(3), },
  readMoreText: { color: ACCENT_COLOR, fontWeight: '600', },
  heartButton: { padding: responsiveWidth(1) },

  galleryList: { paddingBottom: responsiveHeight(2) },
  galleryItem: {
    width: responsiveWidth(45),
    height: responsiveHeight(15),
    marginRight: responsiveWidth(3),
    borderRadius: responsiveWidth(3),
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },

  mapContainer: { width: '100%', height: responsiveHeight(20), borderRadius: responsiveWidth(4), overflow: 'hidden', marginBottom: responsiveHeight(3), position: 'relative', },
  mapImagePlaceholder: { width: '100%', height: '100%', resizeMode: 'cover', opacity: 0.3, },
  mapPinOverlay: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -responsiveFont(4) }, { translateY: -responsiveFont(8) }], },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(1.5),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    zIndex: 20,
  },
  priceTextContainer: { flex: 1, },
  priceLabel: { fontSize: responsiveFont(3.5), color: TEXT_GRAY, },
  priceValueRow: { flexDirection: 'row', alignItems: 'baseline', },
  priceValue: { fontSize: responsiveFont(6), fontWeight: '700', color: '#000000', },
  pricePerDetails: { fontSize: responsiveFont(3.5), color: TEXT_GRAY, marginLeft: responsiveWidth(1), },
  bookButton: { backgroundColor: ACCENT_COLOR, paddingHorizontal: responsiveWidth(10), paddingVertical: responsiveHeight(2.2), borderRadius: responsiveWidth(3), alignItems: 'center', justifyContent: 'center', },
  bookButtonText: { fontSize: responsiveFont(4.5), fontWeight: '700', color: '#FFFFFF', },
});
