/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Text, View, YStack } from 'tamagui';
import { SafeAreaView, Image, Dimensions } from 'react-native';
import Logo from '../../assets/svg/rayyan-logo.svg';
import colors from '../../theme/color';
import Button from '../../components/Button';
import { ArrowRight2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AdAferLoginCouple = () => {
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
        source={require('../../assets/img/after-login-ads01.png')}
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
          <YStack marginTop={'auto'} marginBottom={16}>
            <Text
              fontStyle="italic"
              lineHeight={0}
              fontFamily="IvyMode-Bold"
              fontSize={48}
              color={colors.secondary}
              style={{
                // Ensure text is always visible
                zIndex: 10000,
                elevation: 10,
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Non-Interest
            </Text>
            <Text
              marginTop={-5}
              lineHeight={0}
              fontFamily="IvyMode-Bold"
              fontSize={48}
              color={colors.white}
              style={{
                // Ensure text is always visible
                zIndex: 10000,
                elevation: 10,
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Bank For
            </Text>
            <Text
              marginTop={-5}
              lineHeight={0}
              fontFamily="IvyMode-Bold"
              fontSize={48}
              color={colors.white}
              style={{
                // Ensure text is always visible
                zIndex: 10000,
                elevation: 10,
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 3,
              }}
            >
              Al<Text color={colors.secondary}>l</Text>
            </Text>
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

export default AdAferLoginCouple;
