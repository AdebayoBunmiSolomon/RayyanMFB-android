import React, { FC } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
  colors,
} from '../theme/metrics';

interface HeaderProps {
  leftSvg?: any;
  rightSvg?: any;
  title?: string;
  rightOnPress: () => void;
  leftOnPress: () => void;
  color?: string;
  borderWidth?: number;
  borderColor?: string;
  labelColor?: string;
  fontSize?: number;
  marginTop?: number;
}

const Header: FC<HeaderProps> = ({
  leftSvg,
  rightSvg,
  title,
  rightOnPress,
  leftOnPress,
  color,
  borderWidth,
  borderColor,
  labelColor,
  fontSize,
  marginTop,
}) => {
  return (
    <View
      style={{
        ...styles.header,
        backgroundColor: color,
        borderWidth,
        borderColor,
        marginTop: marginTop ?? 10,
      }}
    >
      <Pressable onPress={() => leftOnPress()}>{leftSvg}</Pressable>

      <View>
        <Text
          style={{
            ...styles.title,
            textTransform: 'capitalize',
            color: labelColor,
            fontSize,
          }}
        >
          {title}
        </Text>
      </View>

      <Pressable onPress={() => rightOnPress()}>{rightSvg}</Pressable>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: verticalScale(90),
    justifyContent: 'space-between',
    paddingHorizontal: horizontalScale(20),
  },

  title: {
    color: colors.white,
    fontSize: moderateScale(20),
    fontWeight: '600',
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
  },
});
