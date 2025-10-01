import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import onboardingData from './onboardingData';

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
const PANEL_WIDTH = deviceWidth * 0.25; 

export default function OnboardingScreen({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true 
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const handleSkip = () => {
    onFinish();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const renderItem = ({ item, index }) => (
    <View style={styles.slide}>
      <View style={styles.imageSection}>
        {/* Three Panel Layout */}
        <View style={styles.panelContainer}>
        
          <View style={[styles.panel, styles.leftPanel]}>
            <Image 
              source={{ uri: item.image }} 
              style={[
                styles.panelImage,
                { 
                  transform: [
                    { translateX: -PANEL_WIDTH * 0 } 
                  ] 
                }
              ]} 
              resizeMode="cover" 
            />
          </View>
          
         
          <View style={[styles.panel, styles.centerPanel]}>
            <Image 
              source={{ uri: item.image }} 
              style={[
                styles.panelImage,
                { 
                  transform: [
                    { translateX: -PANEL_WIDTH * 1 } 
                  ] 
                }
              ]} 
              resizeMode="cover" 
            />
          </View>
          
      
          <View style={[styles.panel, styles.rightPanel]}>
            <Image 
              source={{ uri: item.image }} 
              style={[
                styles.panelImage,
                { 
                  transform: [
                    { translateX: -PANEL_WIDTH * 2 } 
                  ] 
                }
              ]} 
              resizeMode="cover" 
            />
          </View>
        </View>
      </View>

      <View style={styles.textSection}>
        <Text style={styles.headline}>{item.headline}</Text>
        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.bottomNavigation}>
          {currentIndex < onboardingData.length - 1 && (
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.paginationContainer}>
            {onboardingData.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  index === currentIndex ? styles.activeDot : styles.inactiveDot
                ]}
              />
            ))}
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={handleNext}>
            <Ionicons 
              name={currentIndex === onboardingData.length - 1 ? "checkmark" : "arrow-forward"} 
              size={24} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        scrollEnabled={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  slide: {
    width: deviceWidth,
    flex: 1,
  },
  imageSection: {
    height: '55%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  panelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    width: '100%',
  },

  //panel bro :)
  panel: {
    width: PANEL_WIDTH,
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    backgroundColor: '#f8f8f8',
  },
  leftPanel: {
    transform: [{ rotate: '-5deg' }],
  },
  centerPanel: {
    transform: [{ rotate: '-2deg' }],
  },
  rightPanel: {
    transform: [{ rotate: '3deg' }],
  },
  panelImage: {
    width: PANEL_WIDTH * 3, 
    height: '100%',
  },
  textSection: {
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headline: {
    fontSize: 28,
    fontWeight: '900',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins',
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A2A5AD',
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 30,
  },
  bottomNavigation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 40,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  paginationDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#4B75E9',
  },
  inactiveDot: {
    backgroundColor: '#E5E5E5',
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '400',
    fontFamily: 'Poppins',
    color: '#000000',
  },
  ctaButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4B75E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
});