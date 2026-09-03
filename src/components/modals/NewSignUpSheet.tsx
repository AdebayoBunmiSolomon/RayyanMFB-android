import React from 'react';
import { Text, XStack, YStack } from 'tamagui';
import LottieView from 'lottie-react-native';
import Button from '../Button';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../context/ThemeContext';

interface DeviceModalProps {
  onPress: () => void;
}

const NewSignUpSheet = ({ onPress }: DeviceModalProps) => {
  const navigation = useNavigation<any>();

  const { colors } = useTheme();

  return (
    <YStack
      backgroundColor={colors.background}
      flex={1}
      paddingInline={24}
      paddingBlock={16}
      paddingBottom={20}
      alignItems="center"
    >
      <LottieView
        source={require('../../assets/json/banks.json')}
        autoPlay
        loop={false}
        style={{ height: 150, width: 150 }}
      />
      <Text
        maxWidth={220}
        textAlign="center"
        lineHeight={24}
        color={colors.grey06}
        fontSize={18}
        marginTop={8}
        fontWeight="600"
      >
        Do you have a Rayyan Bank Account?
      </Text>
      <Text
        lineHeight={24}
        textAlign="center"
        color={colors.grey05}
        fontSize={15}
        marginTop={4}
        maxWidth={290}
        fontWeight="500"
      >
        Open an account in minutes!
      </Text>
      <XStack marginTop={'auto'} marginBottom={24} gap={14}>
        <Button
          variant="outlined"
          onPress={() => navigation.navigate('Bvn')}
          flex={1}
        >
          No, Open an Account
        </Button>
        <Button onPress={onPress} flex={1}>
          Yes, Register
        </Button>
      </XStack>
    </YStack>
  );
};

export default NewSignUpSheet;
