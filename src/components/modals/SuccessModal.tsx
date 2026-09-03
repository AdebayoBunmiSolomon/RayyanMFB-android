import React from 'react';
import LottieView from 'lottie-react-native';
import { Text, View, YStack } from 'tamagui';
import PageContainer from '../PageContainer';
import HeaderAuth from '../HeaderAuth';
import { SuccessModalProps } from '../../types';
import Button from '../Button';
import Modal from 'react-native-modal';
import { useTheme } from '../../context/ThemeContext';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../../types/navigation.types';

const SuccessModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  onSwipeComplete,
  closeModal,
  onPress,
  title,
}: SuccessModalProps) => {
  const { colors } = useTheme();

  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        // flex: 1,
      }}
      isVisible={isVisible}
      onBackdropPress={() => {
        onBackdropPress();
      }}
      onBackButtonPress={() => {
        onBackButtonPress();
      }}
      onSwipeComplete={() => {
        onSwipeComplete();
      }}
      swipeDirection={'down'}
    >
      <PageContainer>
        {/* header */}
        <HeaderAuth noBckArrow />

        <View
          margin="auto"
          justifyContent="center"
          alignItems="center"
          flex={1}
        >
          <LottieView
            source={require('../../assets/json/checkmark2.json')}
            autoPlay
            loop={false}
            style={{ height: 180, width: 180, marginTop: -20 }}
          />
          <YStack maxWidth="80%" gap={8} alignItems="center">
            <Text
              marginTop={-10}
              textAlign="center"
              fontWeight={'600'}
              fontSize={22}
              lineHeight={32}
              color={colors.grey06}
            >
              {title}
            </Text>
          </YStack>
        </View>

        <View marginTop="auto" marginBottom={8}>
          <Button
            onPress={() => {
              onPress?.();
              closeModal();
              navigation.navigate('Tabs', { screen: 'Settings' });
            }}
            width={'100%'}
          >
            Continue
          </Button>
        </View>
      </PageContainer>
    </Modal>
  );
};

export default SuccessModal;
