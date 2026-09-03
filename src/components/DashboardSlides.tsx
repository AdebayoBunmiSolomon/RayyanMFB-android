/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { View, FlatList, Animated } from 'react-native';
import Paginator from './Paginator';
import accountSlideStyles from '../styles/accountSlide';
import AccountSlide from './AccountSlide';
import { useDispatch } from 'react-redux';
import { setSelectedAccount } from '../slices/accountSlice';
import { Accounts_ } from '../types/transactions.types';
import DashboardSlideLoader from './loader/DashboardSlideLoader';

interface DashboardSlidesProps {
  views: Accounts_[];
  activeSlide: number;
  setActiveSlide: (slide: number) => void;
  noActions?: boolean;
}

const { styles } = accountSlideStyles();

const DashboardSlides: React.FC<DashboardSlidesProps> = ({
  views,
  activeSlide,
  setActiveSlide,
  noActions,
}) => {
  const dispatch = useDispatch();

  const flatListRef = useRef<FlatList<Accounts_>>(null);

  const scrollX = useRef(new Animated.Value(0)).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const viewableItemsChanged = useRef((viewableItems: any) => {
    setActiveSlide(viewableItems.viewableItems[0].index);
  }).current;

  // set selected account
  useEffect(() => {
    const selectedAccount = views[activeSlide];
    dispatch(setSelectedAccount(selectedAccount));
  }, [activeSlide, views]);

  return !views?.length ? (
    <DashboardSlideLoader />
  ) : (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={views}
        renderItem={props => (
          // <></>
          <AccountSlide {...props.item} noActions={noActions} />
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

      <View style={styles.pagination}>
        <Paginator data={views} scrollX={scrollX} currentIndex={activeSlide} />
      </View>
    </View>
  );
};

export default DashboardSlides;
