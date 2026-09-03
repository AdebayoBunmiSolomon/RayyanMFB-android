/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableOpacity } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  CodeField,
  Cursor,
  isLastFilledCell,
  MaskSymbol,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '../context/ThemeContext';
import { Text, View, XStack, YStack } from 'tamagui';
import formatTime from '../util/formatTime';
import tokenInputStyles from '../styles/tokenInput';
import { BVNVerificaionProps, RendererProps } from '../types/tokenInput.types';
import { useAppToast } from '../hooks/useAppToast';
import { Refresh } from 'iconsax-react-native';
import maskString from '../util/maskString';

const CELL_COUNT = 6; // 6-digit token

const BVNVerificaion = ({
  visible,
  timerMinutes = 3,
  requestTokenAPI,
  setLoading,
  value,
  setValue,
  validator,
}: BVNVerificaionProps) => {
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);
  const [error, setError] = useState('');
  const [resendAvailable, setResendAvailable] = useState(false);
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { colors } = useTheme();
  const { styles } = tokenInputStyles(colors);
  const { showError } = useAppToast();

  useEffect(() => {
    if (visible) {
      initializeModal();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [visible]);

  const initializeModal = async () => {
    setValue?.('');
    setError('');
    setSecondsLeft(timerMinutes * 60);
    setResendAvailable(false);
    startTimer();
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          setResendAvailable(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleResend = async () => {
    try {
      const newOTPSent = await requestTokenAPI();
      if (newOTPSent) {
        setValue?.('');
        setError('');
        setResendAvailable(false);
        setSecondsLeft(timerMinutes * 60);
        setLoading?.(true);
        startTimer();
      }
    } catch (err) {
      showError('Error', 'Could not resend token.');
    } finally {
      setLoading?.(false);
    }
  };

  const renderCell = ({ index, symbol, isFocused }: RendererProps) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value })}
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
    <View>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={renderCell}
      />

      <YStack
        marginTop={18}
        maxWidth="80%"
        justifyContent="center"
        marginInline="auto"
      >
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Text textAlign="center" style={styles.timer} color={colors.grey04}>
          {resendAvailable ? (
            <Text color={colors.error}>Token expired.</Text>
          ) : (
            <Text color={colors.grey04}>
              A verification code has been sent to{' '}
              {maskString(validator, 4, '*')}
              <Text color={colors.primary}>
                {' '}
                Expires in: {formatTime(secondsLeft)}
              </Text>
            </Text>
          )}
        </Text>
      </YStack>

      {resendAvailable && (
        <TouchableOpacity onPress={handleResend}>
          <XStack justifyContent="center" alignItems="center" gap={4}>
            <Text style={styles.resendText} textAlign="center">
              Resend OTP
            </Text>
            <Refresh color={colors.primary} size={16} />
          </XStack>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default BVNVerificaion;
