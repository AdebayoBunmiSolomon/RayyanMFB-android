import React from 'react';

import { Text, XStack, YStack } from 'tamagui';
import LottieView from 'lottie-react-native';
import Button from '../Button';
import { useTheme } from '../../context/ThemeContext';

interface DeviceModalProps {
  onPress: () => void;
}

const DeviceModal = ({ onPress }: DeviceModalProps) => {
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
        New Device Detected!
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
        Would you like to configure this device now?
      </Text>
      <XStack marginTop={'auto'} marginBottom={16} gap={8}>
        <Button onPress={onPress} flex={2}>
          Configure Now
        </Button>
      </XStack>
    </YStack>
  );
};

export default DeviceModal;
