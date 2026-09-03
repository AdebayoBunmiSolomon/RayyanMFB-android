import React, { useEffect, useState } from 'react';
import { PublicStackScreenProps } from '../../types/navigation.types';
// import { useAppSelector } from '../../hooks/hook';
// import { RootState } from '../../stores/store';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from 'tamagui';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '../../context/ThemeContext';
import { useAppToast } from '../../hooks/useAppToast';
import { RendererProps } from '../../types/tokenInput.types';
import { useApi } from '../../hooks/useApi';
import PageContainer from '../../components/PageContainer';
import HeaderAuth from '../../components/HeaderAuth';
import HeadingAuth from '../../components/HeadingAuth';
import { formatTimeToMinSec } from '../../util/time';
import Button from '../../components/Button';
import PinModal from '../../components/modals/PinModal';
import ProgressModal from '../../components/modals/ProgressModal';
import SuccessModal from '../../components/modals/SuccessModal';

const CELL_COUNT = 6;

export const SecQuestionResetOTP = ({
  route,
  navigation,
}: PublicStackScreenProps<'SecQuestionResetOTP'>) => {
  //   const username = useAppSelector(
  //     (state: RootState) => state.auth.data.username,
  //   );

  const { secQes, secQesAns, username } = route.params || {};

  const sendSecurityQuestionsResetOTP = useApi({
    endpoint: 'sendSecurityQuestionResetOtp',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.code as string,
        _errorDetails?.message || 'Failed to send OTP',
      );
    },
  });

  const verifyOtpApi = useApi({
    endpoint: 'verifyOtpAndResetSecurityQuestionResetOtp',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.code as string,
        _errorDetails?.message || 'Failed to Reset Security Question',
      );
    },
  });

  const { showSuccess, showError } = useAppToast();

  const { colors } = useTheme();
  const [sendingOtp, setSendingOtp] = useState(false);
  const [value, setValue] = useState('');
  const [counter, setCounter] = useState(180);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [transPinModalVisible, setTransPinModalVisible] =
    useState<boolean>(false);
  const [transPin, setTransPin] = useState<string>('');
  const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(prev => prev - 1), 1000);
    } else {
      setResendAvailable(true);
    }
    return () => clearTimeout(timer);
  }, [counter]);

  useEffect(() => {
    if (value && value.length >= 6) {
      setTransPinModalVisible(true);
    }
  }, [value]);

  //   useEffect(() => {
  //     const initiateVerifyOtp = async () => {
  //       if (value && value.length >= 6 && transPin.length >= 4) {
  //         setTransPinModalVisible(false);
  //         // Proceed with OTP verification and PIN setup
  //         await verifyOtp();
  //       }
  //     };
  //     initiateVerifyOtp();
  //   }, [transPin, value]);

  const renderCell = ({ index, symbol, isFocused }: RendererProps) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell(value, index)}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };

  const resendSecQResetOtp = async () => {
    setSendingOtp(true);
    setResendAvailable(false);
    setCounter(180);
    setValue('');

    try {
      const res = await sendSecurityQuestionsResetOTP.requestInit(
        undefined,
        `/retrieval/retail/security-question-reset/send-otp?username=${username}`,
      );
      if (res?.status === 200) {
        showSuccess(
          'OTP Sent',
          'A new verification code has been sent to your mobile number',
        );
      }
    } catch (_error) {
      console.log('Error resending reset OTP:', _error);
      showError('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async (pin?: string) => {
    const finalPin = pin || transPin; // fallback if needed

    setVerifyingOtp(true);
    try {
      const res = await verifyOtpApi.requestInit({
        userName: username,
        transactionPin: finalPin,
        otp: value,
        secQes: secQes,
        secQesAns: secQesAns,
      });
      if (res?.status === 200) {
        setSuccessModal(true);
        console.log(
          'OTP verified and Security Questions reset successfully:',
          res,
        );
      } else {
        console.log('Unexpected response during OTP verification:', res);
      }
    } catch (_error) {
      console.error('Error verifying OTP and Resetting Questions:', _error);
      return;
    } finally {
      setVerifyingOtp(false);
      setTransPin('');
      setValue('');
    }
    if (value.length < 6) {
      showError('Error', 'Please enter the complete OTP code');
      return;
    }
  };

  const handlePinChange = (val: string) => {
    setTransPin(val);

    if (val.length >= 4 && value.length >= 6) {
      setTransPinModalVisible(false);
      verifyOtp(val); // ✅ pass correct PIN
    }
  };

  const styles = StyleSheet.create({
    codeFiledRoot: {
      marginTop: 8,
      justifyContent: 'flex-start',
    },
    cell: {
      flex: 1,
      height: 56,
      lineHeight: 55,
      fontSize: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      color: colors.grey06,
      backgroundColor: colors.input,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    focusCell: {
      borderColor: colors.primary,
    },
    timerText: {
      textAlign: 'center',
      marginTop: 24,
      fontSize: 14,
      color: colors.grey04,
      fontWeight: '500',
    },
    resendText: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: 14,
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="OTP Verification"
        subtitle="Enter OTP sent to your mobile number"
      />

      {successModal && (
        <SuccessModal
          isVisible={successModal}
          onBackdropPress={() => {
            setSuccessModal(false);
            navigation.navigate('Login');
          }}
          onBackButtonPress={() => {
            setSuccessModal(false);
            navigation.navigate('Login');
          }}
          onSwipeComplete={() => {
            setSuccessModal(false);
            navigation.navigate('Login');
          }}
          closeModal={() => {
            setSuccessModal(false);
            navigation.navigate('Login');
          }}
          title={`Security Question ${`\n`} Reset Successful`}
          onPress={() => {
            setSuccessModal(false);
            navigation.navigate('Login');
          }}
        />
      )}

      {transPinModalVisible && (
        <PinModal
          isVisible={transPinModalVisible}
          onBackdropPress={() => setTransPinModalVisible(false)}
          onBackButtonPress={() => {}}
          value={transPin}
          setValue={handlePinChange}
        />
      )}

      {verifyingOtp && (
        <ProgressModal
          isVisible={verifyingOtp}
          onBackdropPress={() => {}}
          onBackButtonPress={() => {}}
        />
      )}
      {/* form */}
      <View
        flex={1}
        // justifyContent="center"
        alignItems="center"
        // paddingHorizontal={20}
      >
        <View width="100%" maxWidth={400} marginTop={24}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
          />
        </View>

        {/* Timer and Resend */}
        <View alignItems="center" marginTop={24}>
          <Text style={styles.timerText}>
            {resendAvailable
              ? 'OTP expired. You can request a new one.'
              : `Resend OTP in ${formatTimeToMinSec(counter)}`}
          </Text>

          {resendAvailable && (
            <TouchableWithoutFeedback
              onPress={resendSecQResetOtp}
              disabled={sendingOtp}
            >
              <Text style={styles.resendText}>
                {sendingOtp ? 'Sending...' : 'Resend OTP'}
              </Text>
            </TouchableWithoutFeedback>
          )}
        </View>
      </View>

      {/* bottom elements */}
      <View marginTop="auto" marginBottom={8}>
        <Button
          onPress={() => verifyOtp()}
          disabled={value.length < 6}
          width={'100%'}
          loading={verifyingOtp}
        >
          Continue
        </Button>
      </View>
    </PageContainer>
  );
};
