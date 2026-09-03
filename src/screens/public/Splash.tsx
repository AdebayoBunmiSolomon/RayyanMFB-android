/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState } from 'react';
import { PublicStackScreenProps } from '../../types/navigation.types';
import { colors } from '../../theme/metrics';
import MyStatusBar from '../../components/StatusBar';
import { Text, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../components/HeaderAuth';
import IntroMuslimImg from '../../assets/img/intro-screen-people.png';
import {
  Image,
  ImageBackground,
  Linking,
  TouchableOpacity,
} from 'react-native';
import Button from '../../components/Button';
import Sheet from '../../components/Sheet';
import NewSignUpSheet from '../../components/modals/NewSignUpSheet';
import VersionCheck from 'react-native-version-check';
import Sizes, { normalizeSize } from '../../util/size';
import { IS_RETAIL } from '../../../config';

const Splash: FC<PublicStackScreenProps<'Splash'>> = ({ navigation }) => {
  const [openSignUpSheet, setOpenSignUpSheet] = useState(false);

  const handleOpenSignUpSheet = () => {
    setOpenSignUpSheet(true);
  };

  const handleCloseSignUpSheet = () => {
    setOpenSignUpSheet(false);
  };
  return (
    <>
      <MyStatusBar
        translucent
        barStyle="light-content"
        backgroundColor={'#101111'}
      />
      <ImageBackground
        source={require('../../assets/img/art.png')}
        resizeMode="contain"
        style={{
          flex: 1,
          backgroundColor: '#101111',
        }}
        imageStyle={{ width: '100%', height: '100%' }}
      >
        <YStack
          paddingInline={24}
          paddingBlock={16}
          backgroundColor="#101111"
          position="relative"
          flex={1}
        >
          <HeaderAuth noBckArrow justifyContent="flex-start" />
          <Text
            marginTop={70}
            fontSize={Sizes.fontLarge}
            color={'#D2D8D8'}
            fontFamily="Inter-Medium"
          >
            Welcome to Rayyan,
          </Text>
          <Text
            fontSize={normalizeSize(55)}
            marginTop={8}
            fontFamily="IvyMode-Bold"
          >
            Banking {'\n'}Made {'\n'}Easy.
          </Text>
          <YStack height={normalizeSize(388)}>
            <Image
              source={IntroMuslimImg}
              style={{
                width: '100%',
                height: '100%',
              }}
              resizeMode={'contain'}
            />
          </YStack>
          <YStack position="absolute" left={24} bottom={48} width="100%">
            <YStack gap={12}>
              <Button
                backgroundColor="#38A86E"
                onPress={() => navigation.navigate('Login')}
              >
                Log In
              </Button>
              {IS_RETAIL && (
                <Button
                  variant="outlined"
                  textProps={{ color: colors.white }}
                  borderColor={colors.white}
                  onPress={() => handleOpenSignUpSheet()}
                >
                  Register
                </Button>
              )}
            </YStack>
            <XStack marginTop={16} justifyContent="space-between">
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('https:/www.ibank.rayyanbank.com.ng')
                }
              >
                <Text
                  fontSize={Sizes.fontSmall}
                  fontFamily="Inter-Medium"
                  color={'#ABB0B0'}
                >
                  Internet Banking
                </Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text
                  fontSize={Sizes.fontSmall}
                  fontFamily="Inter-Medium"
                  color={'#ABB0B0'}
                >
                  v{VersionCheck.getCurrentVersion()}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Support')}>
                <Text
                  fontSize={Sizes.fontSmall}
                  fontFamily="Inter-Medium"
                  color={'#ABB0B0'}
                >
                  Contact Us
                </Text>
              </TouchableOpacity>
            </XStack>
          </YStack>
        </YStack>
      </ImageBackground>
      {/* signup device */}
      {openSignUpSheet && (
      <Sheet
        isVisible={openSignUpSheet}
        sheetHeight={400}
        onClose={() => handleCloseSignUpSheet()}
      >
        <NewSignUpSheet
          onPress={() => {
            handleCloseSignUpSheet();
            navigation.navigate('AccountInfo');
          }}
        />
      </Sheet>
      )}
    </>
  );
};

export default Splash;
