/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState, useCallback } from 'react';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import PinModal from '../../../components/modals/PinModal';
import TransferSuccessModal from '../../../components/modals/TransferSuccessModal';
import {
  AddBeneficiary_,
  InterBank,
  IntraBank,
  IntraBankResponse,
} from '../../../types/transfer.types';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setDebitAccounts } from '../../../slices/transferSlice';
import { GET_P, SAVE_P } from '../../../services/storage';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import reviewStyles from '../../../styles/review.styles';
import { formatToNaira } from '../../../util/format';
import TransferIcon from '../../../assets/svg/transger_light.svg';
import UserFaceScanIcon from '../../../assets/svg/User_scan_duotone.svg';
import { useTheme } from '../../../context/ThemeContext';
import runBiometricAuth from '../../../services/biometricAuth';
import TokenInputModal from '../../../components/modals/TokenInputModal';
import { useAppToast } from '../../../hooks/useAppToast';
import ProgressModal from '../../../components/modals/ProgressModal';

interface TransferState {
  pin: string;
  pinInput: string;
  tokenInput: string;
  modalData: IntraBankResponse | null;
  charge: number;
  isProcessing: boolean;
  isPinModalVisible: boolean;
  isTokenModalVisible: boolean;
  isSuccessModalVisible: boolean;
  isProgressModalVisible: boolean;
}

const ReviewsOwnAccount: FC<MainStackScreenProps<'ReviewsOwnAccount'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();
  const { styles } = reviewStyles();
  const { item } = route.params;
  const amount = item.amount.replace(/,/g, '');
  const { selectedAccount } = useAppSelector(state => state.account);
  const { userType } = useAppSelector(state => state.profile);
  const { showError, showSuccess } = useAppToast();
  const dispatch = useAppDispatch();

  // API hooks
  const intraBankTranfer = useApi({
    endpoint: 'intraBankTranfer',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.message ||
          'Failed to initiate transfer. Please try again.',
      );
    },
  });
  const sendTokenApi = useApi({ endpoint: 'sendToken' });
  const getDebitAccounts = useApi({ endpoint: 'getDebitAccounts' });
  const addBeneficiary = useApi({ endpoint: 'addBeneficiary' });
  const interBankTranfer = useApi({
    endpoint: 'interBankTranfer',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.message ||
          'Failed to initiate transfer. Please try again.',
      );
    },
  });
  const getInterBankFee = useApi({ endpoint: 'getInterBankFee' });

  // State management
  const [state, setState] = useState<TransferState>({
    pin: '',
    pinInput: '',
    tokenInput: '',
    modalData: null,
    charge: 0,
    isProcessing: false,
    isPinModalVisible: false,
    isTokenModalVisible: false,
    isSuccessModalVisible: false,
    isProgressModalVisible: false,
  });

  // Helper function to update state
  const updateState = (updates: Partial<TransferState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  // Destructure state for easier access
  const {
    pin,
    pinInput,
    modalData,
    charge,
    isProcessing,
    isPinModalVisible,
    isTokenModalVisible,
    isSuccessModalVisible,
    isProgressModalVisible,
  } = state;

  // Request payload
  const reqPayload = {
    ...item,
    beneficiaryBank: item.beneficiaryBank as string,
    amount: Number(amount),
    addBeneficiaryFlag: item.saveBeneficiary ? 'Y' : 'N',
    beneficiaryPrefferedName: item.beneficiaryAccountName,
    transferType: item.type === 'other' ? 'INTER_BANK_TRANSFER' : undefined,
  };

  // Load saved PIN on mount
  useEffect(() => {
    const loadSavedPin = async () => {
      const savedPin = await GET_P();
      if (savedPin) {
        updateState({ pin: savedPin });
      }
    };
    loadSavedPin();
  }, []);

  // Get interbank fee
  useEffect(() => {
    const fetchInterBankFee = async () => {
      if (item.type !== 'other') return;

      try {
        const res = await getInterBankFee.requestInit(
          undefined,
          `/v1/interbank/${amount}/fee`,
        );
        if (res?.data?.code === '00') {
          updateState({ charge: Number(res?.data?.data) });
        }
      } catch (error) {
        console.error('Failed to fetch interbank fee:', error);
      }
    };

    fetchInterBankFee();
  }, [amount, item.type]);

  // FIXED: Handle PIN completion with proper modal transitions
  useEffect(() => {
    const handlePinComplete = () => {
      if (isPinModalVisible && pinInput.length === 4) {
        console.log('PIN complete, starting transfer process');

        // STEP 1: Close PIN modal first
        updateState({
          isPinModalVisible: false,
        });

        // STEP 2: Wait 400ms, then show progress and execute transfer
        setTimeout(() => {
          console.log('Showing progress modal and executing transfer');

          // Show progress modal
          setState(prev => ({
            ...prev,
            isProgressModalVisible: true,
            isProcessing: true,
            pinInput: '', // Reset for next time
          }));

          // Save the PIN
          SAVE_P(pinInput);

          // Prepare payload
          const payload = {
            ...reqPayload,
            transactionPin: pinInput,
          };

          // Execute transfer
          executeTransfer(payload);
        }, 400); // CRITICAL: 400ms delay ensures clean transition
      }
    };

    handlePinComplete();
  }, [isPinModalVisible, pinInput]);

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
  const addNewBeneficiary = async (data: AddBeneficiary_) => {
    try {
      await addBeneficiary.requestInit(data);
    } catch (error) {
      console.error('Failed to add beneficiary:', error);
    }
  };

  // Request token for corporate users
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

  // Main transfer execution function
  const executeTransfer = async (payload: IntraBank | InterBank) => {
    const { type } = item;
    updateState({
      isProgressModalVisible: true,
      isProcessing: true,
    });

    switch (type) {
      case 'self':
        await transferSelfBank(payload as IntraBank);
        break;
      case 'rayyan':
        await transferRayyanBank(payload as IntraBank);
        break;
      case 'other':
        await transferOtherBank(payload as InterBank);
        break;
      default:
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });
    }
  };

  // Transfer functions
  const transferSelfBank = async (payload: IntraBank) => {
    try {
      const res = await intraBankTranfer.requestInit(payload);
      if (res?.data?.code === '00') {
        // Store modal data first
        const successData = res.data;

        // Close progress modal
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });

        // Wait 400ms, then show success modal
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            modalData: successData,
            isSuccessModalVisible: true,
          }));
        }, 400);
      } else {
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });
      }
    } catch (_error) {
      updateState({
        isProgressModalVisible: false,
        isProcessing: false,
      });
    }
  };

  const transferRayyanBank = async (payload: IntraBank) => {
    try {
      const res = await intraBankTranfer.requestInit(payload);
      if (res?.data?.code === '00') {
        // Add beneficiary if requested
        if (payload.saveBeneficiary) {
          const beneficiaryData: AddBeneficiary_ = {
            accountName: res.data.data?.customerAccountName as string,
            accountNumber: res.data.data?.customerAccountNumber || '',
            beneficiaryBank: res.data.data?.beneficiaryBank as string,
            beneficiaryBankName: res.data.data?.beneficiaryBankName as string,
          };
          await addNewBeneficiary(beneficiaryData);
        }
        const receiptData = {
          code: res.data.code,
          customerAccountName: selectedAccount.accountName,
          ...payload,
        };

        // Store success data first
        const successData = { ...res.data, data: receiptData };

        // Close progress modal
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });

        // Wait 400ms, then show success modal
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            modalData: successData,
            isSuccessModalVisible: true,
          }));
        }, 400);
      } else {
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });
      }
    } catch (_error) {
      updateState({
        isProgressModalVisible: false,
        isProcessing: false,
      });
    }
  };

  const transferOtherBank = async (payload: InterBank) => {
    try {
      const res = await interBankTranfer.requestInit(payload);
      if (res?.data?.code === '00') {
        // Add beneficiary if requested
        if (payload.saveBeneficiary) {
          const beneficiaryData: AddBeneficiary_ = {
            accountName: res.data.data?.customerAccountName as string,
            accountNumber: res.data.data?.customerAccountNumber || '',
            beneficiaryBank: res.data.data?.beneficiaryBank as string,
            beneficiaryBankName: res.data.data?.beneficiaryBankName as string,
          };
          await addNewBeneficiary(beneficiaryData);
        }

        // Store success data first
        const successData = res.data;

        // Close progress modal
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });

        // Wait 400ms, then show success modal
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            modalData: successData,
            isSuccessModalVisible: true,
          }));
        }, 400);
      } else {
        updateState({
          isProgressModalVisible: false,
          isProcessing: false,
        });
      }
    } catch (_error) {
      updateState({
        isProgressModalVisible: false,
        isProcessing: false,
      });
    }
  };

  // Token submission handler - FIXED
  const handleTokenSubmit = useCallback(
    async (token: string) => {
      if (!token.trim()) return;

      // STEP 1: Close token modal first
      updateState({
        isTokenModalVisible: false,
      });

      // STEP 2: Wait 400ms, then show progress and execute transfer
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          isProgressModalVisible: true,
          isProcessing: true,
        }));

        const payload = {
          ...reqPayload,
          token,
        };

        executeTransfer(payload);
      }, 400);
    },
    [reqPayload],
  );

  // Biometric authentication handler
  const handleBiometricAuth = async () => {
    if (!pin) {
      showError('Please set a PIN first');
      return;
    }

    // Show progress immediately (no previous modal to close)
    updateState({ isProgressModalVisible: false, isProcessing: false });

    try {
      await runBiometricAuth(async () => {
        const payload = {
          ...reqPayload,
          transactionPin: pin,
        };
        await executeTransfer(payload);
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

  // PIN modal change handler
  const handlePinChange = (value: string) => {
    updateState({ pinInput: value });
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
        item: modalData,
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

  return (
    <PageContainer>
      <HeaderAuth headerTitle="Transfer Summary" noLogo />

      {/* Success Modal - ALWAYS RENDERED */}
      <TransferSuccessModal
        message="Transaction Successful"
        isVisible={isSuccessModalVisible}
        onBackdropPress={() => updateState({ isSuccessModalVisible: false })}
        onBackButtonPress={() => updateState({ isSuccessModalVisible: false })}
        onSwipeComplete={() => updateState({ isSuccessModalVisible: false })}
        closeModal={handleSuccessClose}
        onViewReceipt={handleViewReceipt}
        onAddBeneficiary={handleAddBeneficiary}
      />

      {/* Token Input Modal - ALWAYS RENDERED */}
      <TokenInputModal
        visible={isTokenModalVisible}
        onClose={handleCloseTokenModal}
        onSuccess={handleTokenSubmit}
        requestTokenAPI={requestTokenHandler}
        validateTokenAPI={handleTokenSubmit}
      />

      {/* PIN Modal - ALWAYS RENDERED */}
      <PinModal
        isVisible={isPinModalVisible}
        onBackdropPress={handleClosePinModal}
        onBackButtonPress={handleClosePinModal}
        value={pinInput}
        setValue={handlePinChange}
      />

      {/* Progress Modal - ALWAYS RENDERED */}
      <ProgressModal
        isVisible={isProgressModalVisible}
        onBackdropPress={() => {}} // Prevent closing during processing
        onBackButtonPress={() => {}} // Prevent closing during processing
      />

      {/* Transfer Header */}
      <XStack
        height={44}
        backgroundColor={colors.primary}
        justifyContent="center"
        alignItems="center"
        borderRadius={12}
        gap={4}
        marginTop={24}
      >
        <TransferIcon />
        <Text fontFamily="Inter-SemiBold" fontSize={15}>
          Transferring
        </Text>
      </XStack>

      {/* Transfer Details */}
      <YStack marginTop={10} borderRadius={12} backgroundColor={colors.white}>
        <XStack
          paddingVertical={12}
          backgroundColor={colors.primary}
          justifyContent="center"
          alignItems="center"
          borderTopLeftRadius={12}
          borderTopRightRadius={12}
        >
          <Text fontSize={24} fontFamily="Inter-Bold">
            {formatToNaira(+amount)}
          </Text>
        </XStack>

        <YStack paddingHorizontal={14} marginTop={28}>
          <XStack
            style={{
              ...styles.listRow,
              borderBottomColor: colors.borderColor,
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
                {item?.beneficiaryAccountNumber}
              </Text>
              <Text
                color={colors.primary}
                fontSize={13}
                fontFamily="Inter-Medium"
              >
                {item?.beneficiaryAccountName}
              </Text>
            </YStack>
          </XStack>

          {item?.beneficiaryBankName && (
            <XStack
              style={{
                ...styles.listRow,
                borderBottomColor: colors.borderColor,
              }}
              justifyContent="space-between"
              alignItems="center"
            >
              <Text style={styles.title} color={colors.grey06}>
                Beneficiary Bank
              </Text>
              <Text style={styles.value} color={colors.grey06}>
                {item?.beneficiaryBankName}
              </Text>
            </XStack>
          )}

          <XStack
            style={{
              ...styles.listRow,
              borderBottomColor: colors.borderColor,
            }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.title} color={colors.grey06}>
              Commission
            </Text>
            <Text style={styles.value} color={colors.grey06}>
              {formatToNaira(item.type === 'other' ? charge : 0)}
            </Text>
          </XStack>

          <XStack
            style={styles.listRow}
            borderBottomColor={colors.borderColor}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.title} color={colors.grey06}>
              Narration
            </Text>
            <Text style={styles.value} color={colors.grey06}>
              {item.remarks}
            </Text>
          </XStack>

          <XStack
            style={{
              ...styles.listRow,
              borderBottomColor: colors.borderColor,
              borderBottomWidth: 0,
            }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text style={styles.title} color={colors.grey06}>
              Total Debit
            </Text>
            <Text style={styles.value} color={colors.grey06}>
              {formatToNaira(+amount + (item.type === 'other' ? charge : 0))}
            </Text>
          </XStack>
        </YStack>
      </YStack>

      {/* Action Buttons */}
      <View marginTop={'auto'}>
        <XStack marginTop={24} marginBottom={16} gap={10}>
          <Button
            onPress={() => {
              handleAuthMode();
            }}
            flex={1}
            disabled={isProcessing}
          >
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
      </View>
    </PageContainer>
  );
};

export default ReviewsOwnAccount;
