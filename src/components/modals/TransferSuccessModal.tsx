import {
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { horizontalScale, moderateScale } from '../../theme/metrics';
import PageContainer from '../PageContainer';
import HeaderAuth from '../HeaderAuth';
import { Text, View, XStack } from 'tamagui';
import DiamondIcon from '../../assets/svg/diamond.svg';
import { Calendar, Repeat, Share } from 'iconsax-react-native';
import { useTheme } from '../../context/ThemeContext';

interface TransferSuccessModalProps {
  message: string;
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  onSwipeComplete: () => void;
  closeModal: () => void;
  onViewReceipt: () => void;
  onAddBeneficiary: () => void;
}

const TransferSuccessModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  onSwipeComplete,
  closeModal,
  onViewReceipt,
  // onAddBeneficiary,
  message,
}: TransferSuccessModalProps) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    // Modal

    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },

    modal: {
      width: '100%',
      height: '100%',
      paddingHorizontal: horizontalScale(32),
    },

    card: {
      padding: 10,
      borderRadius: moderateScale(5),
      alignItems: 'center',
      flexShrink: 1,
      height: 134,
      gap: 12,
      flex: 1,
    },

    cardIcon: {
      backgroundColor: colors.primary,
      borderRadius: 14,
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
    },

    cardText: {
      fontFamily: 'Inter-Medium',
      fontSize: 15,
      color: colors.grey06,
      textAlign: 'center',
    },
  });

  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={'down'}
    >
      <PageContainer>
        <HeaderAuth
          headerTitle="Transfer"
          noLogo
          bckArrowFunc={() => {
            closeModal();
          }}
          style={{
            paddingTop:
              Platform.OS === 'android' ? StatusBar.currentHeight : 60,
          }}
        />

        <XStack
          marginTop={24}
          height={44}
          alignItems="center"
          justifyContent="center"
          borderRadius={14}
          gap={4}
          backgroundColor={colors.primary}
        >
          <DiamondIcon />
          <Text fontSize={15} color="#fff" fontFamily="Inter-SemiBold">
            Result Page
          </Text>
        </XStack>

        <View marginTop={86} marginInline="auto">
          <Text color={colors.grey06} fontSize={28} fontFamily="Inter-Medium">
            {message}
          </Text>
        </View>

        <XStack
          justifyContent="center"
          marginTop={48}
          gap={4}
          width="100%"
          flex={1}
        >
          <TouchableOpacity style={styles.card} onPress={() => onViewReceipt()}>
            <View style={styles.cardIcon}>
              <Share size={35} color={colors.white} />
            </View>
            <Text style={styles.cardText}>Share Receipt</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => closeModal()}>
            <View style={styles.cardIcon}>
              <Repeat size={35} color={colors.white} />
            </View>
            <Text style={styles.cardText}>Repeat Transaction</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardIcon}>
              <Calendar size={35} color={colors.white} />
            </View>
            <Text style={styles.cardText}>Schedule Transaction</Text>
          </TouchableOpacity>
        </XStack>
      </PageContainer>
    </Modal>
  );
};

export default TransferSuccessModal;
