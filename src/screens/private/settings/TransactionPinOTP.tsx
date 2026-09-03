/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState, useRef } from 'react';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { Text, View, XStack } from 'tamagui';
import PageContainer from '../../../components/PageContainer';
import Button from '../../../components/Button';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import { useTheme } from '../../../context/ThemeContext';
import { useApi } from '../../../hooks/useApi';
import { useAppToast } from '../../../hooks/useAppToast';
import { formatTimeToMinSec } from '../../../util/time';
import { useAppSelector } from '../../../hooks/hook';
import { RootState } from '../../../stores/store';

interface RendererProps {
  index: number;
  symbol: any;
  isFocused: boolean;
}

const CELL_COUNT = 6;

const TransactionPinOTP: FC<MainStackScreenProps<'TransactionPinOTP'>> = ({
  navigation,
  route,
}) => {
  const username = useAppSelector(
    (state: RootState) => state.auth.data.username,
  );

  // Get the security question and answer from route params
  const { item } = route.params || {};
  const { secretQuestion, secretAnswer } = item || {};

  const sendOtpApi = useApi({ endpoint: 'sendOtp' });
  const { showSuccess, showError } = useAppToast();

  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [value, setValue] = useState('');
  const [counter, setCounter] = useState(180);
  const [resendAvailable, setResendAvailable] = useState(false);
  const hasSentInitialOtp = useRef(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    // Send OTP when screen loads - only once
    if (!hasSentInitialOtp.current) {
      hasSentInitialOtp.current = true;

      const sendInitialOtp = async () => {
        setSendingOtp(true);
        try {
          const res = await sendOtpApi.requestInit(
            undefined,
            `/retrieval/retail/send-otp?username=${username}`,
          );

          if (res?.status === 200) {
            showSuccess(
              'OTP Sent',
              'A verification code has been sent to your mobile number',
            );
          }
        } catch (error) {
          showError('Error', 'Failed to send OTP. Please try again.');
        } finally {
          setSendingOtp(false);
        }
      };

      sendInitialOtp();
    }
  }, [username]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(prev => prev - 1), 1000);
    } else {
      setResendAvailable(true);
    }
    return () => clearTimeout(timer);
  }, [counter]);

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

  const resendOtp = async () => {
    setSendingOtp(true);
    setResendAvailable(false);
    setCounter(180);
    setValue('');

    try {
      const res = await sendOtpApi.requestInit(
        undefined,
        `/retrieval/retail/send-otp?username=${username}`,
      );
      if (res?.status === 200) {
        showSuccess(
          'OTP Sent',
          'A new verification code has been sent to your mobile number',
        );
      }
    } catch (error) {
      showError('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    if (value.length < 6) {
      showError('Error', 'Please enter the complete OTP code');
      return;
    }

    setLoading(true);

    showSuccess('Set Transaction PIN');

    navigation.navigate('MaintainPin', {
      enteredOtp: value,
      otpVerified: true,
      secretQuestion,
      secretAnswer,
    });

    setLoading(false);
  };

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="OTP Verification"
        subtitle="Enter OTP sent to your mobile number"
      />
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
            <TouchableWithoutFeedback onPress={resendOtp} disabled={sendingOtp}>
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
          onPress={verifyOtp}
          disabled={value.length < 6}
          width={'100%'}
          loading={loading}
        >
          Continue
        </Button>

        {/* back to settings */}
        <XStack marginInline="auto" marginTop={12} gap={4}>
          <Text color={colors.grey04} fontSize={13} fontWeight={'500'}>
            Want to go back?
          </Text>
          <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
            <Text color={colors.primary} fontWeight="500">
              Settings
            </Text>
          </TouchableWithoutFeedback>
        </XStack>
      </View>
    </PageContainer>
  );
};

export default TransactionPinOTP;
