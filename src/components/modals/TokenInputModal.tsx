/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-native-modal';
import { TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import {
  CodeField,
  Cursor,
  isLastFilledCell,
  MaskSymbol,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { horizontalScale, verticalScale } from '../../theme/metrics';
import { useTheme } from '../../context/ThemeContext';
import Button from '../Button';
import { Text, View, YStack } from 'tamagui';
import tokenInputStyles from '../../styles/tokenInput';
import formatTime from '../../util/formatTime';
import {
  RendererProps,
  TokenInputModalProps,
} from '../../types/tokenInput.types';

const CELL_COUNT = 6; // 6-digit token

const TokenInputModal: React.FC<TokenInputModalProps> = ({
  visible,
  onClose,
  title = 'Enter 6-digit Code',
  timerMinutes = 3,
  requestTokenAPI,
  validateTokenAPI,
}) => {
  const [value, setValue] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
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

  useEffect(() => {
    if (visible) {
      initializeModal();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [visible]);

  const initializeModal = async () => {
    setValue('');
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

  const handleSubmit = async () => {
    if (value.length !== 6) return;

    setValidating(true);
    setError('');
    try {
      await validateTokenAPI?.(value);
    } catch (err) {
      // setError('Failed to validate token. Try again.');
    } finally {
      setValidating(false);
    }
  };

  const handleResend = async () => {
    setValue('');
    setError('');
    setResendAvailable(false);
    setSecondsLeft(timerMinutes * 60);
    setLoading(true);
    startTimer();

    try {
      await requestTokenAPI();
    } catch (err) {
      Alert.alert('Error', 'Could not resend token.');
      onClose?.();
    } finally {
      setLoading(false);
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
    <Modal
      isVisible={visible}
      propagateSwipe={true}
      avoidKeyboard
      animationIn="slideInUp"
      style={styles.bottomModal}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
    >
      <View style={styles.modal}>
        <View
          paddingHorizontal={horizontalScale(24)}
          paddingTop={36}
          paddingBottom={14}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#007bff" />
          ) : (
            <>
              <YStack gap={6}>
                <Text style={styles.title}>{title}</Text>

                <Text
                  maxWidth="90%"
                  fontSize={16}
                  marginHorizontal="auto"
                  textAlign="center"
                  lineHeight={20}
                  color={colors.grey05}
                >
                  A verification code has been sent to your email address
                </Text>
              </YStack>

              <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={renderCell}
              />

              <YStack marginTop={18}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <Text textAlign="center" style={styles.timer}>
                  {resendAvailable
                    ? 'Token expired.'
                    : `Expires in: ${formatTime(secondsLeft)}`}
                </Text>
              </YStack>
            </>
          )}
          <YStack paddingVertical={verticalScale(24)}>
            <Button
              loading={loading}
              disabled={value.length !== 6 || validating}
              onPress={handleSubmit}
            >
              Verify
            </Button>
            <TouchableOpacity
              onPress={onClose}
              style={{
                marginHorizontal: 'auto',
              }}
            >
              <Text style={styles.cancelText} textAlign="center" marginTop={14}>
                Cancel
              </Text>
            </TouchableOpacity>
          </YStack>
        </View>

        {resendAvailable && (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendText} textAlign="center">
              Resend Token
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  );
};

export default TokenInputModal;
