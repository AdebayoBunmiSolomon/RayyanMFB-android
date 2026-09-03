import React from 'react';
import { XStack, View, Text } from 'tamagui';
import ArrowBckIcon from '../assets/svg/arrow-bck.svg';
import ArrowBckDarkIcon from '../assets/svg/arrow-bck-dark.svg';
import { TouchableOpacity } from 'react-native';
import Logo from '../assets/svg/rayyan-logo.svg';
import { useNavigation } from '@react-navigation/native';
import { HeaderAuthProps } from '../types';
import { useTheme } from '../context/ThemeContext';
import hexToRgbA from '../util/hexToRgbA';

const HeaderAuth = ({
  noBckArrow,
  noLogo,
  headerTitle,
  bckArrowFunc,
  ...others
}: HeaderAuthProps) => {
  const navigation = useNavigation<any>();

  const { colors, theme } = useTheme();

  return (
    <XStack
      marginTop={8}
      justifyContent={noBckArrow ? 'flex-end' : 'space-between'}
      alignItems="flex-start"
      {...others}
    >
      {!noBckArrow && (
        <TouchableOpacity
          onPress={() => (bckArrowFunc ? bckArrowFunc() : navigation.goBack())}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View
            backgroundColor={hexToRgbA(colors.inputBorder, 0.3)}
            borderRadius={8}
            justifyContent="center"
            alignItems="center"
            width={40}
            height={40}
          >
            {theme === 'dark' ? <ArrowBckDarkIcon /> : <ArrowBckIcon />}
          </View>
        </TouchableOpacity>
      )}
      {headerTitle && (
        <View margin="auto">
          <Text
            marginLeft={-40}
            fontWeight="500"
            fontSize={18}
            color={colors.grey06}
          >
            {headerTitle}
          </Text>
        </View>
      )}
      {!noLogo && <Logo />}
    </XStack>
  );
};

export default HeaderAuth;
