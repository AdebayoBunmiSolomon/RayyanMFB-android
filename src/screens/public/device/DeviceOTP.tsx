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
import { PublicStackScreenProps } from '../../../types/navigation.types';
import { Text, View, XStack } from 'tamagui';
import PageContainer from '../../../components/PageContainer';
import Button from '../../../components/Button';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import { useTheme } from '../../../context/ThemeContext';
import { useApi } from '../../../hooks/useApi';
import { useAppToast } from '../../../hooks/useAppToast';
import DeviceInfo from 'react-native-device-info';
import { formatTimeToMinSec } from '../../../util/time';

interface RendererProps {
  index: number;
  symbol: any;
  isFocused: boolean;
}

const CELL_COUNT = 6;

const DeviceOTP: FC<PublicStackScreenProps<'DeviceOTP'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  const verifyOtpApi = useApi({
    endpoint: 'resetDevice',
    onSuccess: () => {
      showSuccess('OTP Verified Successfully');
    },
    onError: (_error, _errorDEtails) => {
      showError(
        _errorDEtails?.code ?? 'Error',
        _errorDEtails?.message ?? 'Failed to verify OTP. Please try again.',
      );
    },
  });
  const sendOtpApi = useApi({
    endpoint: 'sendOtp',
    onSuccess: () => {
      showSuccess('OTP Sent Successfully');
    },
    onError: (_error, _errorDEtails) => {
      showError(
        _errorDEtails?.code ?? 'Error',
        _errorDEtails?.message ?? 'Failed to send OTP. Please try again.',
      );
    },
  });
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

  const sendInitialOtp = async () => {
    setSendingOtp(true);

    console.log(
      `/retrieval/retail/send-otp?username=${
        item.username
      }&secretQuestion=${encodeURIComponent(
        item.secretQuestion.toString(),
      )}&secretAnswer=${encodeURIComponent(item.secretAnswer.toString())}`,
    );

    try {
      const res = await sendOtpApi.requestInit(
        undefined,
        `/retrieval/retail/send-otp?username=${item.username}`,
      );
      if (res?.data?.code === '00') {
        showSuccess(
          'OTP Sent',
          'A new verification code has been sent to your mobile number',
        );
        setValue('');
        setCounter(180);
        setResendAvailable(false);
      }
    } catch (error) {
      showError('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setSendingOtp(false);
    }
  };

  useEffect(() => {
    // Send OTP when screen loads - only once
    if (!hasSentInitialOtp.current) {
      hasSentInitialOtp.current = true;
      sendInitialOtp();
    }
  }, [item]);

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
      let deviceId = '';
      await DeviceInfo.getUniqueId().then(res => {
        deviceId = res;
      });

      // Determine if retail or corporate user
      const isCorporate = item.username && item.username.includes(':');

      const payload = isCorporate
        ? {
            ...item,
            otp: value,
            deviceId,
            corpId: item.corpId || item.username?.split(':')[1],
            username: item.username?.split(':')[0],
          }
        : {
            ...item,
            otp: value,
            deviceId,
          };

      const res = await verifyOtpApi.requestInit(payload);
      if (res?.data?.code === '00') {
        showSuccess('Device verified successfully!');
        navigation.navigate('DeviceSuccess');
      }
    } catch (error) {
      showError('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const renderCell = React.memo(
  //   ({ index, symbol, isFocused }: RendererProps) => {
  //     let textChild = null;

  //     if (symbol) {
  //       textChild = (
  //         <MaskSymbol
  //           maskSymbol="*"
  //           isLastFilledCell={isLastFilledCell(value, index)}
  //         >
  //           {symbol}
  //         </MaskSymbol>
  //       );
  //     } else if (isFocused) {
  //       textChild = <Cursor />;
  //     }

  //     return (
  //       <Text
  //         key={index}
  //         style={[styles.cell, isFocused && styles.focusCell]}
  //         onLayout={getCellOnLayoutHandler(index)}
  //       >
  //         {textChild}
  //       </Text>
  //     );
  //   },
  // );

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

  useEffect(() => {
    const initiateVerifyOtp = async () => {
      if (value.length === 6) {
        await verifyOtp();
      }
    };
    initiateVerifyOtp();
  }, [value]);

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
              : `Resend OTP in ${formatTimeToMinSec(counter)}`}
          </Text>

          {resendAvailable && (
            <TouchableWithoutFeedback
              onPress={sendInitialOtp}
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
          onPress={verifyOtp}
          disabled={value.length < 6}
          width={'100%'}
          loading={loading}
        >
          Verify
        </Button>

        {/* sign in */}
        <XStack marginInline="auto" marginTop={12} gap={4}>
          <Text color={colors.grey04} fontSize={13} fontWeight={'500'}>
            Remember your password?
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Login')}
          >
            <Text color={colors.primary} fontWeight="500">
              Sign In
            </Text>
          </TouchableWithoutFeedback>
        </XStack>
      </View>
    </PageContainer>
  );
};

export default DeviceOTP;
