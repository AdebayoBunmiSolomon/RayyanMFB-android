import React, { FC } from 'react';

import Button from '../../../components/Button';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import LottieView from 'lottie-react-native';
import { Text, View, YStack } from 'tamagui';
import { useTheme } from '../../../context/ThemeContext';

const PasswordSuccess: FC<PublicStackScreenProps<'PasswordSuccess'>> = ({
  navigation,
}) => {
  // const {message} = route.params;
  const { colors } = useTheme();

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth noBckArrow />

      <View margin="auto" justifyContent="center" alignItems="center">
        <LottieView
          source={require('../../../assets/json/password-reset.json')}
          autoPlay
          loop={false}
          style={{ height: 340, width: 340 }}
        />
        <YStack maxWidth="80%" gap={8} alignItems="center">
          <Text
            textAlign="center"
            fontWeight={'600'}
            fontSize={24}
            color={colors.grey06}
          >
            Password Reset
          </Text>
          <Text
            lineHeight={22}
            textAlign="center"
            fontSize={16}
            color={colors.grey04}
          >
            Your password has been updated. You can now use your new password to
            log in.
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

export default PasswordSuccess;
