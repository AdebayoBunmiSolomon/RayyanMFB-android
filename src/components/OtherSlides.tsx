import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from 'react-native';
import {
  colors,
  moderateScale,
  verticalScale,
  global,
  horizontalScale,
} from '../theme/metrics';
import Paginator from './Paginator';
import EyeOpen from '../assets/svg/View_Show_.svg';
import EyeView from '../assets/svg/View_hide_.svg';
import { Accounts } from '../types/transfer.types';
import { formatToDecimal } from '../util/format';

const screenWidth = Dimensions.get('window').width - 40;

interface OtherSlidesProps {
  views: Accounts[];
  activeSlide: number;
  setActiveSlide: (slide: number) => void;
}

const OtherSlides: React.FC<OtherSlidesProps> = ({
  views,
  activeSlide,
  setActiveSlide,
}) => {
  const [toggle, setToggle] = useState(false);

  // const [activeSlide, setActiveSlide] = useState(0);

  const flatListRef = useRef<FlatList<Accounts>>(null);

  const scrollX = useRef(new Animated.Value(0)).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef((viewableItems: any) => {
    setActiveSlide(viewableItems.viewableItems[0].index);
  }).current;

  const onToggleSwitch = () => setToggle(!toggle);

  const renderViewSlide = ({ item }: { item: Accounts }) => (
    <View
      style={{
        ...styles.viewHeight,
        backgroundColor: colors.semiLightTextColor,
      }}
    >
      <View
        style={{
          ...global.flexRowSpace,
          paddingHorizontal: horizontalScale(20),
          // marginTop: verticalScale(25),
        }}
      >
        <View>
          {toggle ? (
            <Text style={styles.slideText}>
              N{formatToDecimal(Number(item.availableBalance))}
            </Text>
          ) : (
            <Text style={styles.slideText}>**********</Text>
          )}
        </View>

        <TouchableOpacity onPress={onToggleSwitch}>
          {toggle ? <EyeView /> : <EyeOpen />}
        </TouchableOpacity>
      </View>

      <View style={{ ...styles.border, marginTop: verticalScale(22) }}></View>

      <View
        style={{
          ...global.flexRowSpace,
          paddingHorizontal: horizontalScale(20),
          marginTop: verticalScale(15),
        }}
      >
        <View>
          <Text style={styles.slideText}>{item?.accountType}</Text>
        </View>

        <View>
          <Text style={styles.slideText}>{item.accountNumber}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={views}
        renderItem={renderViewSlide}
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
      <View style={styles.pagination}>
        <Paginator data={views} scrollX={scrollX} currentIndex={activeSlide} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewHeight: {
    width: screenWidth,
    height: verticalScale(132),
    borderRadius: moderateScale(2),
    paddingVertical: verticalScale(20),
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },

  border: {
    width: '100%',
    borderBottomColor: colors.lightTextColor,
    borderBottomWidth: 1,
    marginTop: verticalScale(12),
  },

  slideText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.slide,
  },
});

export default OtherSlides;
