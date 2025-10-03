import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');


export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);



  const removeFromFavorites = (hotelId) => {
    setFavorites(prev => prev.filter(hotel => hotel.id !== hotelId));
  };

  const handleHotelPress = (hotel) => {
    navigation.navigate('BookingStack', { 
      screen: 'BookingInfo', 
      params: { hotel } 
    });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteCard}
      onPress={() => handleHotelPress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      
      <View style={styles.favoriteContent}>
        <View style={styles.favoriteHeader}>
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{item.name}</Text>
            <Text style={styles.hotelLocation}>{item.location}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>
                {item.rating} <Text style={styles.reviewCount}>({item.reviewCount} Reviews)</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={() => removeFromFavorites(item.id)}
          >
            <Ionicons name="heart" size={24} color="#4B75E9" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.favoriteFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.perNight}>/night</Text>
          </View>
          <TouchableOpacity 
            style={styles.bookButton}
            onPress={() => handleHotelPress(item)}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved hotels</Text>
      </View>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderFavoriteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={64} color="#A2A5AD" />
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Save your favorite hotels by tapping the {' '}
            <Ionicons name="heart" size={16} color="#4B75E9" />{' '}
            icon in the home screen
          </Text>
          <TouchableOpacity 
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.exploreButtonText}>Explore Hotels</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#181818',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#A2A5AD',
  },
  listContent: {
    padding: 16,
  },
  favoriteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  hotelImage: {
    width: '100%',
    height: 160,
  },
  favoriteContent: {
    padding: 16,
  },
  favoriteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hotelInfo: {
    flex: 1,
    marginRight: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181818',
    marginBottom: 4,
  },
  hotelLocation: {
    fontSize: 14,
    color: '#A2A5AD',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#181818',
    fontWeight: '500',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 12,
    color: '#A2A5AD',
    fontWeight: '400',
  },
  heartButton: {
    padding: 4,
  },
  favoriteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#181818',
  },
  perNight: {
    fontSize: 14,
    color: '#A2A5AD',
    marginLeft: 2,
  },
  bookButton: {
    backgroundColor: '#4B75E9',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A2A5AD',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#A2A5AD',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#4B75E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});