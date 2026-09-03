/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import PinModal from '../../../components/modals/PinModal';
import TransferSuccessModal from '../../../components/modals/TransferSuccessModal';
import { IntraBankResponse } from '../../../types/transfer.types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setDebitAccounts } from '../../../slices/transferSlice';
import { GET_P, SAVE_P } from '../../../services/storage';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, XStack, YStack } from 'tamagui';
import reviewStyles from '../../../styles/review.styles';
import { formatToNaira } from '../../../util/format';
import UserFaceScanIcon from '../../../assets/svg/User_scan_duotone.svg';
import {
  AddBillBeneficiary_,
  BillsPayment,
} from '../../../types/bills-payments.types';
import { useTheme } from '../../../context/ThemeContext';
import ProgressModal from '../../../components/modals/ProgressModal';
import runBiometricAuth from '../../../services/biometricAuth';
import { useAppToast } from '../../../hooks/useAppToast';
import TokenInputModal from '../../../components/modals/TokenInputModal';

interface BillsReviewState {
  pin: string;
  pinInput: string;
  modalData: any;
  isProcessing: boolean;
  isPinModalVisible: boolean;
  isTokenModalVisible: boolean;
  isSuccessModalVisible: boolean;
  isProgressModalVisible: boolean;
}

const BillsReview: FC<MainStackScreenProps<'BillsReview'>> = ({
  navigation,
  route,
}) => {
  const getDebitAccounts = useApi({
    endpoint: 'getDebitAccounts',
  });

  const { styles } = reviewStyles();
  const { item } = route.params;
  const { email } = useAppSelector(state => state.profile);
  const amount = item?.amount;

  const makePayment = useApi({ endpoint: 'makePayment' });
  const addBillerBeneficiary = useApi({
    endpoint: 'addBillerBeneficiary',
  });
  const sendTokenApi = useApi({
    endpoint: 'sendToken',
  });

  const { colors } = useTheme();
  const { userType } = useAppSelector(state => state.profile);
  const { showError, showSuccess } = useAppToast();
  const dispatch = useAppDispatch();

  const [state, setState] = useState<BillsReviewState>({
    pin: '',
    pinInput: '',
    modalData: null,
    isProcessing: false,
    isPinModalVisible: false,
    isTokenModalVisible: false,
    isSuccessModalVisible: false,
    isProgressModalVisible: false,
  });

  const updateState = (updates: Partial<BillsReviewState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const {
    pin,
    pinInput,
    modalData,
    isProcessing,
    isPinModalVisible,
    isTokenModalVisible,
    isSuccessModalVisible,
    isProgressModalVisible,
  } = state;

  const payload = {
    billerId: Number(item?.billerId),
    billerName: item?.billerName,
    amount: amount,
    categoryId: Number(item?.categoryId),
    categoryName: item?.categoryName,
    paymentItemId: String(item?.paymentItemId),
    paymentItemName: item?.paymentItemName,
    customerId: item?.customerId,
    customerDepositSlipNumber: item?.customerId,
    customerName: item?.customerName,
    customerAccountNumber: item?.customerAccountNumber,
    emailAddress: email,
    phoneNumber: item?.customerId,
    paymentCode: item?.paymentCode,
    saveBeneficiary: item?.saveBeneficiary,
  };

  // Load saved PIN
  useEffect(() => {
    const loadSavedPin = async () => {
      const savedPin = await GET_P();
      if (savedPin) {
        updateState({ pin: savedPin });
      }
    };
    loadSavedPin();
  }, []);

  // Handle PIN input changes
  const handlePinChange = (value: string) => {
    updateState({ pinInput: value });

    // When PIN reaches 4 digits, start processing
    if (value.length === 4 && isPinModalVisible) {
      processPinPayment(value);
    }
  };

  // Process PIN payment - FIXED
  const processPinPayment = async (completePin: string) => {
    console.log('Processing PIN payment...');

    // STEP 1: Close PIN modal first
    updateState({
      isPinModalVisible: false,
    });

    // STEP 2: Wait 400ms for PIN modal to close, then show progress modal
    setTimeout(() => {
      console.log('Showing progress modal and executing payment');

      // Show progress modal
      setState(prev => ({
        ...prev,
        isProgressModalVisible: true,
        isProcessing: true,
        pinInput: '', // Reset for next time
      }));

      // Save PIN and prepare payload
      SAVE_P(completePin);
      const newPayload = {
        ...payload,
        transactionPin: completePin,
      };

      // Execute payment
      executePayment(newPayload as any);
    }, 400); // CRITICAL: 400ms delay ensures clean transition
  };

  // Execute payment - REFACTORED
  const executePayment = async (val: BillsPayment) => {
    updateState({ isProgressModalVisible: true, isProcessing: true });

    const benPayload = {
      beneficiaryId: val?.customerId,
      beneficiaryName: val?.billerId,
      biller: val?.paymentItemId,
      category: val?.categoryName,
    };

    try {
      console.log('Making payment API call...');
      const res = await makePayment.requestInit(val);

      if (res?.data?.code === '00') {
        console.log('Payment successful!');

        // Add beneficiary if requested
        if (val.saveBeneficiary) {
          await addNewBeneficiary(benPayload as any);
        }

        // Store success data
        const successData = res?.data;

        // STEP 1: Close progress modal first
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });

        // STEP 2: Wait 400ms, then show success modal
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            modalData: successData,
            isSuccessModalVisible: true,
          }));
        }, 400); // CRITICAL: 400ms delay ensures clean transition
      } else {
        console.log('Payment failed:', res?.data?.message);
        showError(res?.data?.message || 'Payment failed. Please try again.');
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });
      }
    } catch (error) {
      console.log('Payment error:', error);
      showError('An error occurred during payment.');
      updateState({
        isProgressModalVisible: false,
        isProcessing: false,
      });
    }
  };

  // Get user debit accounts
  const getUserDebitAccounts = async () => {
    try {
      const res = await getDebitAccounts.requestInit();
      if (res?.data?.code === '00') {
        dispatch(setDebitAccounts(res?.data));
      }
    } catch (error) {
      console.error('Failed to fetch debit accounts:', error);
    }
  };

  // Add new beneficiary
  const addNewBeneficiary = async (vals: AddBillBeneficiary_) => {
    try {
      await addBillerBeneficiary.requestInit(vals);
    } catch (error) {
      console.error('Failed to add beneficiary:', error);
    }
  };

  // Request token handler
  const requestTokenHandler = async () => {
    updateState({ isProgressModalVisible: true, isProcessing: true });

    try {
      const res = await sendTokenApi.requestInit();
      if (res?.data?.error === false) {
        showSuccess(
          "We've sent a token to your email. Please check your inbox.",
        );
        updateState({
          isTokenModalVisible: true,
          isProgressModalVisible: false,
          isProcessing: false,
        });
      } else {
        showError(
          res?.data?.message || 'Unable to send token. Please try again.',
        );
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });
      }
    } catch (error) {
      showError('An error occurred while requesting token.');
      updateState({
        isProgressModalVisible: false,
        isProcessing: false,
      });
    }
  };

  // Token submission handler - FIXED
  const handleTokenSubmit = async (token: string) => {
    if (!token.trim()) return;

    // STEP 1: Close token modal first
    updateState({
      isTokenModalVisible: false,
    });

    // STEP 2: Wait 400ms, then show progress and execute payment
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isProgressModalVisible: true,
        isProcessing: true,
      }));

      const newPayload = {
        ...payload,
        token,
      };

      executePayment(newPayload as any);
    }, 400);
  };

  // Biometric authentication handler - FIXED
  const handleBiometricAuth = async () => {
    if (!pin) {
      showError('Please set a PIN first');
      return;
    }

    // Show progress modal immediately for biometric (no previous modal to close)
    // updateState({ isProgressModalVisible: true, isProcessing: true });

    try {
      await runBiometricAuth(async () => {
        const newPayload = { ...payload, transactionPin: pin };
        await executePayment(newPayload as any);
      });
    } catch (error) {
      showError('Biometric authentication failed');
      updateState({
        isProgressModalVisible: false,
        isProcessing: false,
      });
    }
  };

  // Authentication mode handler
  const handleAuthMode = () => {
    if (userType === 'corp') {
      requestTokenHandler();
    } else {
      updateState({ isPinModalVisible: true });
    }
  };

  // Success modal handlers
  const handleSuccessClose = async () => {
    updateState({ isSuccessModalVisible: false });
    navigation.navigate('Tabs', { screen: 'Home' });
    await getUserDebitAccounts();
  };

  const handleViewReceipt = () => {
    updateState({ isSuccessModalVisible: false });
    if (modalData) {
      navigation.navigate('RayyanReceipt', {
        item: modalData as IntraBankResponse,
      });
    }
  };

  const handleAddBeneficiary = () => {
    updateState({ isSuccessModalVisible: false });
    navigation.navigate('AddBeneficiary');
  };

  // Close PIN modal handler
  const handleClosePinModal = () => {
    updateState({
      isPinModalVisible: false,
      pinInput: '', // Reset PIN input
    });
  };

  // Close token modal handler
  const handleCloseTokenModal = () => {
    updateState({ isTokenModalVisible: false });
  };

  // Prevent closing progress modal during processing
  const handleProgressModalClose = () => {
    if (!isProcessing) {
      updateState({ isProgressModalVisible: false });
    }
  };

  return (
    <PageContainer>
      <HeaderAuth headerTitle="Review" noLogo />

      {/* Success Modal */}
      <TransferSuccessModal
        message="Bill Payment Successful"
        isVisible={isSuccessModalVisible}
        onBackdropPress={() => updateState({ isSuccessModalVisible: false })}
        onBackButtonPress={() => updateState({ isSuccessModalVisible: false })}
        onSwipeComplete={() => updateState({ isSuccessModalVisible: false })}
        closeModal={handleSuccessClose}
        onViewReceipt={handleViewReceipt}
        onAddBeneficiary={handleAddBeneficiary}
      />

      {/* Token Input Modal */}
      <TokenInputModal
        visible={isTokenModalVisible}
        onClose={handleCloseTokenModal}
        onSuccess={handleTokenSubmit}
        requestTokenAPI={requestTokenHandler}
        validateTokenAPI={handleTokenSubmit}
      />

      {/* PIN Modal */}
      <PinModal
        isVisible={isPinModalVisible}
        onBackdropPress={handleClosePinModal}
        onBackButtonPress={handleClosePinModal}
        value={pinInput}
        setValue={handlePinChange}
      />

      {/* Progress Modal */}
      <ProgressModal
        isVisible={isProgressModalVisible}
        onBackdropPress={handleProgressModalClose}
        onBackButtonPress={handleProgressModalClose}
      />

      <YStack marginTop={24} borderRadius={12} backgroundColor={colors.white}>
        <XStack
          paddingVertical={12}
          backgroundColor="#74C67A"
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={12}
          borderTopRightRadius={12}
        >
          <Text fontSize={24} fontFamily="Inter-Bold">
            {formatToNaira(Number(amount ?? 0))}
          </Text>
        </XStack>
        <YStack paddingHorizontal={14} marginTop={28}>
          <XStack
            style={{
              ...styles.listRow,
              borderBottomWidth: 0,
              marginBottom: 45,
            }}
            justifyContent="space-between"
            alignItems="center"
          >
            <YStack gap={6}>
              <Text
                color={colors.primary}
                fontSize={13}
                fontFamily="Inter-Medium"
              >
                From
              </Text>
              <Text
                color={colors.grey06}
                fontSize={16}
                fontFamily="Inter-Medium"
              >
                {item?.customerAccountNumber}
              </Text>
              <Text
                color={colors.primary}
                fontSize={13}
                fontFamily="Inter-Medium"
              >
                Savings Account
              </Text>
            </YStack>
            <YStack gap={6} alignItems="flex-end">
              <Text
                color={colors.primary}
                fontSize={13}
                fontFamily="Inter-Medium"
              >
                To
              </Text>
              <Text
                color={colors.grey06}
                fontSize={16}
                fontFamily="Inter-Medium"
              >
                {item?.customerId}
              </Text>
              <Text
                color={colors.primary}
                fontSize={13}
                fontFamily="Inter-Medium"
              >
                {item?.billerName}
              </Text>
            </YStack>
          </XStack>
          <XStack
            style={{ ...styles.listRow, borderBottomWidth: 0 }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.title} color={colors.grey06}>
              Total Debit
            </Text>
            <Text style={styles.value} color={colors.grey06}>
              {formatToNaira(Number(amount))}
            </Text>
          </XStack>
        </YStack>
      </YStack>

      <XStack marginTop={'auto'} marginBottom={16} gap={10}>
        <Button onPress={handleAuthMode} flex={1} disabled={isProcessing}>
          {isProcessing
            ? 'Processing...'
            : userType === 'retail'
            ? 'PIN'
            : 'Request Token'}
        </Button>

        {pin && userType === 'retail' && !isProcessing && (
          <Button
            width={50}
            backgroundColor={colors.primary}
            onPress={handleBiometricAuth}
            disabled={isProcessing}
          >
            <UserFaceScanIcon />
          </Button>
        )}
      </XStack>
    </PageContainer>
  );
};

export default BillsReview;
