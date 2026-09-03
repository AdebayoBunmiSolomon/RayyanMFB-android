/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, YStack } from 'tamagui';
import { SafeAreaView, Image, Dimensions } from 'react-native';
import AdText from '../../assets/svg/after-login-ads-text.svg';
import Logo from '../../assets/svg/rayyan-logo.svg';
import colors from '../../theme/color';
import Button from '../Button';
import { ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AdAferLoginPraying = () => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    // Set a timer to navigate to the Home screen after 6 seconds
    const timer = setTimeout(() => {
      if (!isButtonClicked) {
        navigation.navigate('Tabs');
      }
    }, 6000);

    // Clear the timer if the component is unmounted or if the button is clicked
    return () => clearTimeout(timer);
  }, [isButtonClicked]);

  const handleButtonClick = () => {
    // Update the flag to prevent the timeout navigation
    setIsButtonClicked(true);
    navigation.navigate('Tabs');
  };

  return (
    <View position="relative" flex={1} width="100%" height="100%">
      <Image
        source={require('../../assets/img/after-login-ads02.png')}
        resizeMode="cover"
        style={{ width, height }}
      />
      <SafeAreaView
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          zIndex: 9999,
        }}
      >
        <YStack
          paddingInline={24}
          flexGrow={1}
          height="100%"
          paddingBlock={16}
          zIndex={9999}
        >
          {/* logo */}
          <View marginLeft="auto">
            <Logo />
          </View>
          {/* heading */}
          <YStack marginTop={'auto'} marginBottom={24}>
            <View style={{ zIndex: 10000, elevation: 10 }}>
              <AdText width={280} />
            </View>
          </YStack>
          <Button
            onPress={handleButtonClick}
            marginLeft="auto"
            variant="outlined"
            borderColor={colors.white}
            textProps={{ color: colors.white, fontSize: 13 }}
            height={46}
            width={120}
          >
            Continue <ArrowRight2 size={18} color={colors.white} />
          </Button>
        </YStack>
      </SafeAreaView>
    </View>
  );
};

export default AdAferLoginPraying;
