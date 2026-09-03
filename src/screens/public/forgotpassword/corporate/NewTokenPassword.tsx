/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {
  CodeField,
  Cursor,
  isLastFilledCell,
  MaskSymbol,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useTheme } from '../../../../context/ThemeContext';
import { Label, Text, View, XStack, YStack } from 'tamagui';
import tokenInputStyles from '../../../../styles/tokenInput';
import formatTime from '../../../../util/formatTime';
import {
  RendererProps,
  TokenInputModalProps,
} from '../../../../types/tokenInput.types';
import Button from '../../../../components/Button';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { Formik } from 'formik';
import Input from '../../../../components/Input';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { newPasswordSchema } from '../../../../schema';
import { useNavigation } from '@react-navigation/native';
import Sizes from '../../../../util/size';
import { useApi } from '../../../../hooks/useApi';

const CELL_COUNT = 6; // 6-digit token

const NewTokenPassword: React.FC<TokenInputModalProps> = ({
  visible = true,
  onClose,
  timerMinutes = 3,
  requestTokenAPI,
  validateTokenAPI,
  route,
}) => {
  const [value, setValue] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);
  const [validating, setValidating] = useState(false);
  const [isSecureEntry, setIsSecureEntry] = useState(true);
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

  const {
    item: { email, userName, corpID },
  } = route.params ?? {};

  const { requestInit, loading } = useApi({
    endpoint: 'forgotPassword',
  });

  const navigation = useNavigation();

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

  const handleSubmit = async ({ newPassword, confirmPassword }) => {
    if (value.length !== 6) return;

    setValidating(true);
    setError('');
    try {
      const payload = {
        token: value,
        newPassword,
        confirmPassword,
        userEmail: email,
        userName,
        corpID,
      };
      const response = await requestInit(payload);
      if (response?.data?.code === '00') {
        navigation.navigate('PasswordSuccess');
      }
    } catch (err) {
    } finally {
      setValidating(false);
    }
  };

  const handleResend = async () => {
    setValue('');
    setError('');
    setResendAvailable(false);
    setSecondsLeft(timerMinutes * 60);
    startTimer();

    try {
      await requestTokenAPI();
    } catch (err) {
      Alert.alert('Error', 'Could not resend token.');
      onClose?.();
    } finally {
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
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="Reset Password"
        subtitle="Enter the verification token and set a new password."
        swap
      />

      {/* form */}
      <Formik
        validationSchema={newPasswordSchema}
        initialValues={{
          newPassword: '',
          confirmPassword: '',
        }}
        enableReinitialize={true}
        onSubmit={async values => handleSubmit(values)}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          dirty,
          touched,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <View>
                <Label
                  color={colors.grey05}
                  fontFamily="Inter-Medium"
                  fontSize={Sizes.fontMedium}
                  marginBottom={Platform.OS === 'ios' ? 12 : 8}
                >
                  OTP Code
                </Label>
                {loading ? (
                  <ActivityIndicator size="large" color="#007bff" />
                ) : (
                  <>
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

                    {/* <YStack marginTop={18}>
                      {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                      ) : null}
                      <Text textAlign="center" style={styles.timer}>
                        {resendAvailable
                          ? 'Token expired.'
                          : `Expires in: ${formatTime(secondsLeft)}`}
                      </Text>
                    </YStack> */}
                  </>
                )}
                {/* {resendAvailable && (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={styles.resendText} textAlign="center">
                      Resend Token
                    </Text>
                  </TouchableOpacity>
                )} */}
                {/* <YStack paddingVertical={verticalScale(24)}>
                <Button
                  loading={loading}
                  disabled={value.length !== 6 || validating}
                  onPress={handleSubmit}>
                  Verify
                </Button>
                <TouchableOpacity
                  onPress={onClose}
                  style={{
                    marginHorizontal: 'auto',
                  }}>
                  <Text
                    style={styles.cancelText}
                    textAlign="center"
                    marginTop={14}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </YStack> */}
              </View>
              <Input
                label="New Password"
                placeholder="New Password"
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                value={values.newPassword}
                error={touched.newPassword && errors.newPassword}
                secureTextEntry={isSecureEntry}
                endIcon={
                  <TouchableOpacity
                    onPress={() => setIsSecureEntry(prev => !prev)}
                  >
                    {isSecureEntry ? (
                      <EyeSlash size={24} color="#636666" />
                    ) : (
                      <Eye size={24} color="#636666" />
                    )}
                  </TouchableOpacity>
                }
                showRules
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm password"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                error={touched.confirmPassword && errors.confirmPassword}
                value={values.confirmPassword}
                secureTextEntry={isSecureEntry}
                endIcon={
                  <TouchableOpacity
                    onPress={() => setIsSecureEntry(prev => !prev)}
                  >
                    {isSecureEntry ? (
                      <EyeSlash size={24} color="#636666" />
                    ) : (
                      <Eye size={24} color="#636666" />
                    )}
                  </TouchableOpacity>
                }
                // showRules
              />
            </YStack>
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() => handleSubmit()}
                disabled={
                  !(isValid && dirty) || value.length !== 6 || validating
                }
                loading={loading}
              >
                Proceed
              </Button>

              {/* sign in */}
              <XStack marginInline="auto" marginTop={12} gap={4}>
                <Text color={colors.grey04} fontSize={13} fontWeight={'500'}>
                  Already Activated
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
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default NewTokenPassword;
