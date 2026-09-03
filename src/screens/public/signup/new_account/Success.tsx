import React, { FC } from 'react';

import { PublicStackScreenProps } from '../../../../types/navigation.types';
import colors from '../../../../theme/color';
import Button from '../../../../components/Button';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import LottieView from 'lottie-react-native';
import { Text, View, XStack, YStack } from 'tamagui';
import { Copy } from 'iconsax-react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppToast } from '../../../../hooks/useAppToast';

const Success: FC<PublicStackScreenProps<'Success'>> = ({
  navigation,
  route,
}) => {
  const { showSuccess } = useAppToast();

  const { item } = route.params;

  const copyAccNumToClipboard = () => {
    showSuccess('Account number copied to clipboard');
    Clipboard.setString(item.data);
  };

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth noBckArrow />

      <View margin="auto" justifyContent="center" alignItems="center">
        <LottieView
          source={require('../../../../assets/json/congratulations.json')}
          autoPlay
          loop={false}
          style={{ height: 220 }}
        />
        <YStack marginTop={24} maxWidth="80%" gap={8} alignItems="center">
          <Text
            textAlign="center"
            fontWeight={'600'}
            fontSize={24}
            color={colors.grey06}
          >
            Signup Successful!
          </Text>
          <Text
            lineHeight={22}
            textAlign="center"
            fontSize={16}
            color={colors.grey04}
          >
            Welcome on board! Here's Your Account Number:
          </Text>
          <XStack
            backgroundColor={colors.background}
            marginTop={24}
            paddingInline={10}
            padding={5}
            borderRadius={16}
            gap={8}
            alignItems="center"
          >
            <Text
              textAlign="center"
              fontSize={24}
              fontWeight="700"
              borderRadius={16}
              color={'#424444'}
            >
              {item?.data}
            </Text>
            <Copy
              onPress={copyAccNumToClipboard}
              size={20}
              color={'#424444'}
              variant="Bulk"
            />
          </XStack>
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

export default Success;
