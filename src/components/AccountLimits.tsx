import React from 'react';
import { YStack, Text } from 'tamagui';
import Sizes from '../util/size';
import { AccountLimitsProps } from '../types';
import { useTheme } from '../context/ThemeContext';

const AccountLimits = ({ limits }: AccountLimitsProps) => {
  const { colors } = useTheme();

  return (
    <YStack
      gap={12}
      padding={Sizes.paddingMedium}
      flex={1}
      borderWidth={1}
      borderRadius={Sizes.radiusLarge}
      marginTop={Sizes.marginMedium}
      borderStyle="dashed"
      borderColor={colors.grey05}
    >
      {limits?.map(({ title, value }, index) => (
        <YStack gap={6} key={index}>
          <Text fontSize={Sizes.fontSmall} color={colors.grey05}>
            {title}
          </Text>
          <Text
            fontFamily="Inter-Bold"
            fontSize={Sizes.fontMedium}
            fontWeight="500"
            color={colors.grey06}
          >
            {value}
          </Text>
        </YStack>
      ))}
    </YStack>
  );
};

export default AccountLimits;
