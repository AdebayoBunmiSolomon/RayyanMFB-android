import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import { Text, YStack } from 'tamagui';
import { FeatureProps } from '../types';
import { useTheme } from '../context/ThemeContext';
import Sizes, { normalizeSize } from '../util/size';

const { width } = Dimensions.get('window');
const gap = 18;
const listWidth = (width - 5 * gap) / 3;

const Feature = ({ title, icon, onPress, color, ...others }: FeatureProps) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={onPress}>
      <YStack
        borderWidth={6}
        backgroundColor={colors.primary}
        borderColor={'#D7E3E4'}
        borderRadius={100}
        justifyContent="center"
        alignItems="center"
        gap={4}
        width={normalizeSize(listWidth)}
        height={normalizeSize(listWidth)}
        {...others}
      >
        {icon}
        <Text
          color={color ?? colors.white}
          fontWeight="700"
          fontSize={Sizes.fontMedium}
        >
          {title}
        </Text>
      </YStack>
    </TouchableOpacity>
  );
};

export default Feature;
