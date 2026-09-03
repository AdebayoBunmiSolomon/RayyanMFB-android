import React from 'react';
import { View } from 'tamagui';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Dimensions } from 'react-native';
import { moderateScale } from '../../theme/metrics';
import { useTheme } from '../../context/ThemeContext';

const screenWidth = Dimensions.get('window').width - 76;

const DashboardSlideLoader = () => {
  const { colors } = useTheme();

  return (
    <View>
      <SkeletonPlaceholder borderRadius={4} backgroundColor={colors.input}>
        <SkeletonPlaceholder.Item flex={1}>
          <SkeletonPlaceholder.Item
            height={200}
            marginTop={10}
            padding={0}
            borderRadius={moderateScale(16)}
          />
          <SkeletonPlaceholder.Item
            height={50}
            marginTop={8}
            width={screenWidth}
            marginLeft="auto"
            marginRight="auto"
            borderRadius={moderateScale(14)}
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder>
    </View>
  );
};

export default DashboardSlideLoader;
