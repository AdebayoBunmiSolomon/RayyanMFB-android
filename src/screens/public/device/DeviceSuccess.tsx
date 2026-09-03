import React, { FC } from 'react';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import LottieView from 'lottie-react-native';
import { Text, View, YStack } from 'tamagui';
import { useTheme } from '../../../context/ThemeContext';

const DeviceSuccess: FC<PublicStackScreenProps<'DeviceSuccess'>> = ({
  navigation,
}) => {
  const { colors } = useTheme();

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth noBckArrow />

      <View margin="auto" justifyContent="center" alignItems="center">
        <LottieView
          source={require('../../../assets/json/checkmark.json')}
          autoPlay
          loop={false}
          style={{ height: 280, width: 280 }}
        />
        <YStack maxWidth="90%" marginTop={-30} gap={8} alignItems="center">
          <Text
            textAlign="center"
            fontWeight={'600'}
            fontSize={24}
            color={colors.grey06}
          >
            Device Configured {`\n`} Successful!
          </Text>
          <Text
            lineHeight={22}
            textAlign="center"
            fontSize={16}
            fontWeight="500"
            color={colors.grey04}
          >
            Your device has been configured. You can now log in.
          </Text>
        </YStack>
      </View>

      <View marginTop="auto" marginBottom={8}>
        <Button onPress={() => navigation.navigate('Login')} width={'100%'}>
          Sign In
        </Button>
      </View>
    </PageContainer>
  );
};

export default DeviceSuccess;
