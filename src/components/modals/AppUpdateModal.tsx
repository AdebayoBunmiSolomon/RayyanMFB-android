import React from 'react';

import { Text, XStack, YStack } from 'tamagui';
import LottieView from 'lottie-react-native';
import Button from '../Button';
import { useTheme } from '../../context/ThemeContext';
import { Platform } from 'react-native';

interface DeviceModalProps {
  onPress: () => void;
}

const AppUpdateModal = ({ onPress }: DeviceModalProps) => {
  const { colors } = useTheme();

  return (
    <YStack flex={1} padding={24} justifyContent="center" alignItems="center">
      <LottieView
        source={require('../../assets/json/warning.json')}
        autoPlay
        loop={false}
        style={{ height: 100, width: 100 }}
      />
      <Text
        maxWidth={220}
        textAlign="center"
        lineHeight={24}
        color={colors.grey06}
        fontSize={18}
        marginTop={24}
        fontWeight="600"
      >
        New Update Detected on{' '}
        {Platform.OS === 'ios' ? 'App Store' : 'Play Store'}!
      </Text>
      <Text
        lineHeight={24}
        textAlign="center"
        color={colors.grey04}
        fontSize={16}
        marginTop={4}
        maxWidth={290}
        fontWeight="500"
      >
        Please update your app to get the latest features and improvements. As
        this include bug fixes, and app optimizations.
      </Text>
      <XStack marginTop={'auto'} marginBottom={16} gap={8}>
        <Button onPress={onPress} flex={2}>
          {Platform.OS === 'ios'
            ? 'Go to App Store Now!!!'
            : 'Go to Play Store Now!!!'}
        </Button>
      </XStack>
    </YStack>
  );
};

export default AppUpdateModal;
