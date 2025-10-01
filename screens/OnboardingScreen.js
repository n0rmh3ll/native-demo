import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, FlatList, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import onboardingData from './onboardingData';


const DESIGN_WIDTH = 1080;
const DESIGN_HEIGHT = 1920;

const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');

const scale = (size) => (size / DESIGN_WIDTH) * deviceWidth;
const scaleVertical = (size) => (size / DESIGN_HEIGHT) * deviceHeight;


const CONFIG = {

  IMAGE_SECTION_HEIGHT: 0.70,
  PANEL_HEIGHT_RATIO: 0.9, 
  TEXT_SECTION_HEIGHT: 0.25,
  HEADLINE_FONT_SIZE: scale(66),
  DESCRIPTION_FONT_SIZE: scale(32), 
  PANEL_WIDTH: scale(290),
  PANEL_GAP: scale(35),
  
};


const PANEL_WIDTH = CONFIG.PANEL_WIDTH;
const PANEL_HEIGHT = scaleVertical(680) * CONFIG.PANEL_HEIGHT_RATIO;
const TOP_MARGIN = scaleVertical(80); 
const PANEL_GAP = CONFIG.PANEL_GAP;
const SIDE_MARGIN = (deviceWidth - (PANEL_WIDTH * 3 + PANEL_GAP * 2)) / 2;
const CORNER_RADIUS = scale(48);

export default function OnboardingScreen({ onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        flatListRef.current.scrollToIndex({ 
          index: currentIndex + 1,
          animated: false 
        });
        setCurrentIndex(currentIndex + 1);
        
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
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
      <View style={styles.whiteBackground}>
        

        <View style={styles.imageSection}>
          {/* Three Panel Layout */}
          <View style={styles.panelContainer}>
            {/* Left Panel - Rotated -8° */}
            <View style={[styles.panel, styles.leftPanel]}>
              <Image 
                source={{ uri: item.image }} 
                style={[
                  styles.panelImage,
                  { transform: [{ translateX: -PANEL_WIDTH * 0 }] }
                ]} 
                resizeMode="cover" 
              />
            </View>
            
            {/* Center Panel - Rotated -2° */}
            <View style={[styles.panel, styles.centerPanel]}>
              <Image 
                source={{ uri: item.image }} 
                style={[
                  styles.panelImage,
                  { transform: [{ translateX: -PANEL_WIDTH * 1 }] }
                ]} 
                resizeMode="cover" 
              />
            </View>
            
            {/* Right Panel - Rotated +6° */}
            <View style={[styles.panel, styles.rightPanel]}>
              <Image 
                source={{ uri: item.image }} 
                style={[
                  styles.panelImage,
                  { transform: [{ translateX: -PANEL_WIDTH * 2 }] }
                ]} 
                resizeMode="cover" 
              />
            </View>
          </View>
        </View>

        
        <View style={styles.textSection}>
          {/* Headline */}
          <Text style={styles.headline}>{item.headline}</Text>
          
          {/* Body Text */}
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
                size={scale(44)} 
                color="#FFFFFF" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
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
  whiteBackground: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageSection: {
    height: deviceHeight * CONFIG.IMAGE_SECTION_HEIGHT, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  panelContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: TOP_MARGIN,
    marginHorizontal: SIDE_MARGIN,
    height: PANEL_HEIGHT,
  },
  panel: {
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
    borderRadius: CORNER_RADIUS,
    overflow: 'hidden',
    marginHorizontal: PANEL_GAP / 2,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(10) },
    shadowOpacity: 0.06,
    shadowRadius: scale(24),
    elevation: 4,
  },

// Panel Rotations and Styles <3

  leftPanel: {
    transform: [{ rotate: '-5deg' }],
  },
  centerPanel: {
    transform: [{ rotate: '-2deg' }],
    zIndex: 2,
    shadowOpacity: 0.08,
    shadowRadius: scale(28),
    elevation: 6,
  },
  rightPanel: {
    transform: [{ rotate: '3deg' }],
  },
  panelImage: {
    width: PANEL_WIDTH * 3, 
    height: '100%',
  },
  textSection: {
    height: deviceHeight * CONFIG.TEXT_SECTION_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
    paddingBottom: scaleVertical(40),
  },
  headline: {
    fontSize: CONFIG.HEADLINE_FONT_SIZE, 
    fontWeight: '900',
    color: '#111111',
    textAlign: 'center',
    marginBottom: scale(26),
    lineHeight: scale(52), 
    letterSpacing: -0.3,
    fontFamily: 'arial',
  },
  description: {
    fontSize: CONFIG.DESCRIPTION_FONT_SIZE, 
    fontWeight: '600',
    color: '#9B9B9B',
    textAlign: 'center',
    lineHeight: scale(36),
    letterSpacing: -0.2,
    maxWidth: scale(760),
    marginBottom: scaleVertical(30),
  },
  bottomNavigation: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  // dot OR indicator :/
  paginationDot: {
    width: scale(50),
    height: scale(18),
    borderRadius: scale(14),
    marginHorizontal: scale(4),
  },
  activeDot: {
    backgroundColor: '#4B75E9',
  },
  inactiveDot: {
    backgroundColor: '#E5E5E5',
  },

  //skip bro 

   skipButton: {
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    position: 'absolute',
    left: scale(30), 
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: scale(38),
    fontWeight: '600',
    color: '#000000ff',
  },

  //button :)
  ctaButton: {
    width: scale(96),
    height: scale(96),
    borderRadius: scale(98),
    backgroundColor: '#4B75E9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    shadowColor: '#4B75E9',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    elevation: 6,
  },
});