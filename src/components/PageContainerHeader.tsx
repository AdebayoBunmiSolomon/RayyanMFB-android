import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import ArrowBack from '../assets/svg/arrow_back.svg';
import {
  horizontalScale,
  // verticalScale,
  global,
  colors,
  moderateScale,
} from '../theme/metrics';
import { useAppSelector } from '../hooks/hook';
// import Svg, { Path } from 'react-native-svg';

interface PageContainerProps {
  title?: string;
  onPress: () => void;
  height?: number;
}

const PageContainerHeader = ({
  title,
  onPress,
  height,
}: PageContainerProps) => {
  const { currentTheme } = useAppSelector(state => state.theme);

  return (
    <View
      style={{
        ...global.flexRowSpace,
        paddingHorizontal: horizontalScale(20),
        // marginTop: verticalScale(80),
        height,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ArrowBack />
      </TouchableOpacity>

      <View>
        <Text
          style={{
            ...styles.headerText,
            color:
              currentTheme === 'dark'
                ? colors.white
                : colors.semiLightTextColor,
          }}
        >
          {title}
        </Text>
      </View>

      <View></View>
    </View>
  );
};

export default PageContainerHeader;

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'Poppins',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.semiLightTextColor,
  },
});
