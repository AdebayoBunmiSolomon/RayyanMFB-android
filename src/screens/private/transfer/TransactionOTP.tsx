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
import { Text, View } from 'tamagui';
import PageContainer from '../../../components/PageContainer';
import Button from '../../../components/Button';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import { useTheme } from '../../../context/ThemeContext';
import { useApi } from '../../../hooks/useApi';
import { useAppToast } from '../../../hooks/useAppToast';
import { useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';

interface RendererProps {
  index: number;
  symbol: any;
  isFocused: boolean;
}

const CELL_COUNT = 6;

const TransactionOTP: FC<MainStackScreenProps<'TransactionOTP'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;
  const onSuccess = route.params.onSuccess;
  const user = useSelector((state: RootState) => state.auth.user);
  const userType = user?.data?.userType?.toLowerCase() || 'retail';
  const IS_CORPORATE = userType === 'corp';

  const verifyOtpApi = useApi({ endpoint: 'verifyTransactionOtp' });
  const sendOtpApi = useApi({ endpoint: 'sendOtp' });
  const { showSuccess, showError } = useAppToast();

  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [value, setValue] = useState('');
  const [counter, setCounter] = useState(59);
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
          // Determine endpoint based on user type
          const endpoint = IS_CORPORATE
            ? `/v1/corp/transfer/send-otp?username=${user?.data?.username}`
            : `/v1/transfer/send-otp?username=${user?.data?.username}`;

          const res = await sendOtpApi.requestInit(undefined, endpoint);
          if (res?.data?.code === '00') {
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
  }, [user, IS_CORPORATE]);

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

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const payload = {
        ...item,
        otp: value,
      };

      const res = await verifyOtpApi.requestInit(payload);
      if (res?.data?.code === '00') {
        showSuccess('Transaction verified successfully!');
        if (onSuccess) {
          onSuccess(res?.data);
        } else {
          navigation.goBack();
        }
      }
    } catch (error) {
      showError('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setSendingOtp(true);
    try {
      // Determine endpoint based on user type
      const endpoint = IS_CORPORATE
        ? `/v1/corp/transfer/send-otp?username=${user?.data?.username}`
        : `/v1/transfer/send-otp?username=${user?.data?.username}`;

      const res = await sendOtpApi.requestInit(undefined, endpoint);
      if (res?.data?.code === '00') {
        showSuccess(
          'OTP Sent',
          'A new verification code has been sent to your mobile number',
        );
        setValue('');
        setCounter(59);
        setResendAvailable(false);
      }
    } catch (error) {
      showError('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

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

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth noLogo headerTitle="Transaction Verification" />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="OTP Verification"
        subtitle="Enter OTP sent to your mobile number"
      />
      {/* form */}
      <View flex={1} alignItems="center">
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
              : `Resend OTP in ${counter}s`}
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
          Verify
        </Button>
      </View>
    </PageContainer>
  );
};

export default TransactionOTP;
