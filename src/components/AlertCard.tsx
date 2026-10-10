import React, { useEffect, useState } from 'react';
import { YStack, Text, XStack } from 'tamagui';
import Sizes from '../util/size';
import { useTheme } from '../context/ThemeContext';
import { Danger, Timer1 } from 'iconsax-react-native';
import CloseIcon from '../assets/svg/close-line.svg';
import hexToRgbA from '../util/hexToRgbA';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native';
import { AlertCardProps } from '../types';
import ArrowRight from '../assets/svg/arrow-right.svg';

const ALERT_STORAGE_KEY = 'kycAlertDismissed';

// console.log('Hello', {
//   Danger,
//   Timer1,
//   CloseIcon,
//   ArrowRight,
//   Stack,
//   XStack,
//   Text,
// });

const AlertCard = ({
  currentKYCRequestId,
  title,
  subtitle,
  type,
  liinkTo,
}: AlertCardProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const { colors } = useTheme();

  // Check if the current KYC request is dismissed
  useEffect(() => {
    const checkAlertStatus = async () => {
      const dismissedRequestId = await AsyncStorage.getItem(ALERT_STORAGE_KEY);

      // Show the alert only if the current request is not dismissed
      if (dismissedRequestId !== currentKYCRequestId) {
        setIsVisible(true);
      }
    };
    checkAlertStatus();
  }, [currentKYCRequestId]);

  // Dismiss the alert
  const dismissAlert = async () => {
    await AsyncStorage.setItem(ALERT_STORAGE_KEY, 'true'); // Save dismissal state
    setIsVisible(false); // Hide the alert
  };

  if (!isVisible) return null; // Don't render if the alert is dismissed

  return (
    <XStack
      marginTop={10}
      width="100%"
      backgroundColor={colors.input} // Dark background
      borderColor={colors.borderColor}
      borderRadius={Sizes.radiusLarge}
      borderWidth={1}
      padding={Sizes.paddingMedium}
      gap={14}
    >
      <YStack
        width={40}
        height={40}
        backgroundColor={hexToRgbA(
          type === 'warning' ? '#FF8C00' : colors.error,
          0.08,
        )}
        borderRadius={Sizes.radiusMedium}
        justifyContent="center"
        alignItems="center"
      >
        <YStack
          width={30}
          height={30}
          backgroundColor={type === 'warning' ? '#FF8C00' : colors.error}
          borderRadius={Sizes.radiusMedium}
          justifyContent="center"
          alignItems="center"
        >
          {/* Icon */}
          {type === 'warning' ? (
            <Timer1 size={20} variant="Bold" color={'#F5F5F5'} />
          ) : (
            <Danger size={20} variant="Bold" color={'#F5F5F5'} />
          )}
        </YStack>
      </YStack>
      <YStack flex={1} gap={4}>
        <Text
          fontFamily="Inter-Bold"
          color={colors.grey06}
          fontSize={Sizes.fontMedium}
          fontWeight="600"
        >
          {title}
        </Text>
        <Text
          color={colors.grey05}
          fontSize={Sizes.fontSmall}
          fontWeight="500"
          numberOfLines={2}
          lineHeight={18}
          fontFamily="Inter-Regular"
        >
          {subtitle}
        </Text>
        {liinkTo ? (
          <TouchableOpacity onPress={liinkTo}>
            <XStack alignItems="center" gap={4} marginTop={2}>
              <Text
                fontSize={Sizes.fontSmall}
                fontFamily="Inter-Bold"
                fontWeight="500"
                color={'#F5B30D'}
              >
                View Details
              </Text>
              <ArrowRight width={12} height={12} color={colors.amberYellow} />
            </XStack>
          </TouchableOpacity>
        ) : (
          ''
        )}
      </YStack>
      {/* dismiss button */}
      <TouchableOpacity onPress={dismissAlert}>
        <CloseIcon width={18} height={18} fill={colors.grey06} />
      </TouchableOpacity>
    </XStack>
  );
};

export default AlertCard;
