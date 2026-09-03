import { Animated, Dimensions, FlatList } from 'react-native';
import React, {
  // useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View } from 'tamagui';
import accountSlideStyles from '../styles/accountSlide';
import Paginator from './Paginator';
import FastImage from 'react-native-fast-image';
import {
  useOptimizedMemo,
  useOptimizedCallback,
} from '../util/performanceOptimization';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const { styles } = accountSlideStyles();

const Adverts = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const scrollX = useRef(new Animated.Value(0)).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef((viewableItems: any) => {
    setActiveSlide(viewableItems.viewableItems[0].index);
  }).current;

  const images = useMemo(
    () => [
      require('../assets/img/ads.png'),
      require('../assets/img/ads2.png'),
      require('../assets/img/ads3.png'),
    ],
    [],
  );

  useEffect(() => {
    let scrollIndex = 0;
    const interval = setInterval(() => {
      if (scrollIndex < images.length) {
        flatListRef?.current?.scrollToIndex?.({
          animated: true,
          index: scrollIndex,
        });
        scrollIndex += 1;
      } else {
        scrollIndex = 0;
        flatListRef?.current?.scrollToIndex?.({
          animated: true,
          index: scrollIndex,
        });
      }
    }, 5000); // Scroll every 5 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  // Calculate responsive banner dimensions - memoized for performance
  const bannerDimensions = useOptimizedMemo(() => {
    // Account for PageContainer padding (16px on each side)
    const pageContainerPadding = 32; // 16px left + 16px right
    const availableWidth = screenWidth - pageContainerPadding;

    // Use the full available width
    const bannerWidth = availableWidth;

    // Calculate responsive height based on screen size
    let bannerHeight;

    if (screenHeight < 700) {
      // Small devices
      bannerHeight = Math.max(160, screenHeight * 0.22); // Increased minimum
    } else if (screenHeight < 800) {
      // Medium devices
      bannerHeight = Math.max(170, screenHeight * 0.2); // Increased minimum
    } else if (screenHeight < 900) {
      // Large devices
      bannerHeight = Math.max(180, screenHeight * 0.19); // Increased minimum
    } else {
      // Extra large devices
      bannerHeight = Math.max(190, screenHeight * 0.18); // Increased minimum
    }

    // Ensure height stays within reasonable bounds and accounts for pagination
    bannerHeight = Math.min(bannerHeight, 220); // Increased max height
    bannerHeight = Math.max(bannerHeight, 160); // Increased minimum height

    return {
      width: bannerWidth,
      height: bannerHeight,
    };
  }, [screenWidth, screenHeight]);

  return (
    <View style={{ width: '100%' }}>
      <FlatList
        horizontal
        removeClippedSubviews={false}
        data={images}
        renderItem={useOptimizedCallback(
          ({ item }) => (
            <View
              style={{
                width: bannerDimensions.width,
                height: bannerDimensions.height,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: 'transparent',
              }}
            >
              <FastImage
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 16,
                }}
                source={item}
                resizeMode="cover"
              />
            </View>
          ),
          [bannerDimensions],
        )}
        keyExtractor={(item, index) => index.toString()}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        scrollEventThrottle={16}
        ref={flatListRef}
      />

      <View
        style={{
          ...styles.pagination,
          marginTop: 16, // Increased from 8 to 16 for more space
          marginBottom: 0,
          alignItems: 'center',
        }}
      >
        <Paginator
          data={images as any}
          scrollX={scrollX}
          currentIndex={activeSlide}
        />
      </View>
    </View>
  );
};

export default Adverts;
