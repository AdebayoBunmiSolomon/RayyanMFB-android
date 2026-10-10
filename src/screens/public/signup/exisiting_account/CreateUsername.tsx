import { StyleSheet, TouchableOpacity } from 'react-native';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { horizontalScale, global } from '../../../../theme/metrics';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import { useLazyGetTermsAndConditionsQuery } from '../../../../api/public';
import { RegExistAccount } from '../../../../types/public.types';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { Label, Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../../components/Input';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { useApi } from '../../../../hooks/useApi';
import Checkbox from '../../../../components/ui/Checkbox';
import { useAppToast } from '../../../../hooks/useAppToast';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';

const usernameValidationSchema = yup.object().shape({
  userName: yup.string().required('Username is required'),
  password: yup
    .string()
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .matches(/\d/, 'Password must have a number')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must have a special character',
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Confirm password is required'),
  lastFourDigitsOfBVN: yup
    .string()
    .min(4, ({ min }) => `Must be at least ${min} characters`)
    .max(4, ({ max }) => `Must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('BVN last four digits is required'),
  otp: yup
    .string()
    .min(4, ({ min }) => `OTP must be at least ${min} characters`)
    .max(4, ({ max }) => `OTP must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed'),
  acceptedTermsAndConditions: yup
    .boolean()
    .oneOf([true], 'Click the checkbox to accept terms and conditions'),
});

const CreateUsername: FC<PublicStackScreenProps<'CreateUsername'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [counter, setCounter] = useState(0);
  const [waitingForOtp, setWaitingForOtp] = useState(false);

  const [loading, setLoading] = useState(false);
  const create = useApi({
    endpoint: 'registerExistingAccount',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.message ||
          'Failed to create user profile. Please try again.',
      );
    },
  });
  const requestOtp = useApi({
    endpoint: 'existingAccountOtpRequest',
    onSuccess: () => showSuccess('OTP sent successfully!'),
    onError(_error, errorDetails) {
      showError(
        errorDetails?.code ?? 'ERROR_OCCURRED',
        errorDetails?.message || 'Failed to send OTP.',
      );
    },
  });
  const [terms] = useLazyGetTermsAndConditionsQuery();
  const [pdf, setPdf] = useState('');

  const { colors } = useTheme();
  const { showSuccess, showError } = useAppToast();

  const CELL_COUNT = 4;
  const ref = useBlurOnFulfill({ value: otpValue, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otpValue,
    setValue: setOtpValue,
  });

  const sendOtpRequest = useCallback(
    async (lastFourDigitsOfBVN: string) => {
      setLoading(true);
      try {
        const payload = {
          accountNumber: item.accountNumber,
          lastFourDigitsOfBVN,
        };
        const res = await requestOtp.requestInit(payload);
        if (res?.status === 200) {
          setOtpSent(true);
          setCounter(59);
          setWaitingForOtp(true);
          showSuccess('OTP sent successfully!');
        } else {
          showError('Failed to send OTP. Please try again.');
        }
      } catch (error) {
        showError('Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [item.accountNumber, requestOtp, showSuccess, showError],
  );

  const registerExistingCustomer = useCallback(
    async (val: RegExistAccount & { otp: string }) => {
      setLoading(true);
      try {
        const res = await create.requestInit(val);
        if (res?.data?.code === '00') {
          navigation.navigate('RegisterSuccess', {
            message: res?.data?.message,
          });
        } else {
          // showError(
          //   res?.data?.message || 'Registration failed. Please try again.',
          // );
          setOtpValue('');
        }
      } catch (error: any) {
        // showError('Registration failed. Please try again.');
        setOtpValue('');
        console.log('Error registering existing customer:', error);
      } finally {
        setLoading(false);
      }
    },
    [create, navigation],
  );

  useEffect(() => {
    const getUserTerms = async () => {
      try {
        const res = await terms().unwrap();
        if (res.content) {
          setPdf(res.content);
        }
      } catch (error) {}
    };

    getUserTerms();
  }, [terms]);

  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setWaitingForOtp(false);
    }
  }, [counter]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        readText: {
          fontFamily: 'Inter-Regular',
          fontSize: 14,
          fontWeight: '600',
          color: colors.grey04,
        },
        termsLink: {
          fontFamily: 'Inter-Regular',
          fontSize: 14,
          fontWeight: '600',
          color: colors.primary,
        },
        checkboxContainer: {
          marginTop: 24,
        },
        otpCell: {
          width: 56,
          height: 56,
          lineHeight: 55,
          fontSize: 16,
          borderRadius: 8,
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
        otpContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        focusCell: {
          borderColor: colors.primary,
        },
      }),
    [colors],
  );

  const renderOtpCell = useCallback(
    ({ index, symbol, isFocused }: any) => {
      let textChild = null;

      if (symbol) {
        textChild = (
          <MaskSymbol
            maskSymbol="*"
            isLastFilledCell={isLastFilledCell(otpValue, index)}
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
          style={[styles.otpCell, isFocused && styles.focusCell]}
          onLayout={getCellOnLayoutHandler(index)}
        >
          {textChild}
        </Text>
      );
    },
    [otpValue, styles.otpCell, styles.focusCell, getCellOnLayoutHandler],
  );

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="Set Up Your Mobile Banking"
        subtitle="Create a Username, Password & Verify BVN"
      />

      <Formik
        validationSchema={usernameValidationSchema}
        initialValues={{
          userName: '',
          password: '',
          confirmPassword: '',
          lastFourDigitsOfBVN: '',
          otp: '',
          acceptedTermsAndConditions: false,
        }}
        onSubmit={async values => {
          if (!otpSent) {
            // First, send OTP request
            await sendOtpRequest(values.lastFourDigitsOfBVN);
            return;
          }

          // After OTP is sent, complete registration
          const payload = {
            userName: values.userName,
            password: values.password,
            confirmPassword: values.confirmPassword,
            acceptedTermsAndConditions: values.acceptedTermsAndConditions,
            acctNumber: item.accountNumber,
            secAns: item.secAns,
            secQes: item.secQes,
            otp: otpValue,
          };
          await registerExistingCustomer(payload);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid: _isValid,
          setFieldValue,
          touched,
          dirty: _dirty,
        }) => {
          // Calculate button validation
          const baseValidation = !!(
            values.userName &&
            values.password &&
            values.confirmPassword &&
            values.lastFourDigitsOfBVN &&
            values.acceptedTermsAndConditions
          );

          const isButtonDisabled = !otpSent
            ? !baseValidation
            : !(baseValidation && otpValue.length === 4);

          return (
            <View flex={1}>
              <YStack marginTop={32} gap={20}>
                <Input
                  label="Username"
                  placeholder="username"
                  onChangeText={handleChange('userName')}
                  onBlur={handleBlur('userName')}
                  error={touched.userName && errors.userName}
                  value={values.userName}
                />

                <Input
                  label="Password"
                  placeholder="Password"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry={isSecureEntry}
                  error={touched.password && errors.password}
                  endIcon={
                    <TouchableOpacity
                      onPress={() => setIsSecureEntry(prev => !prev)}
                    >
                      {isSecureEntry ? (
                        <EyeSlash size={23} color="#636666" />
                      ) : (
                        <Eye size={23} color="#636666" />
                      )}
                    </TouchableOpacity>
                  }
                  showRules
                />

                <Input
                  label="Confirm Password"
                  placeholder="Password"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry={isSecureEntry}
                  error={touched.confirmPassword && errors.confirmPassword}
                  endIcon={
                    <TouchableOpacity
                      onPress={() => setIsSecureEntry(prev => !prev)}
                    >
                      {isSecureEntry ? (
                        <EyeSlash size={23} color="#636666" />
                      ) : (
                        <Eye size={23} color="#636666" />
                      )}
                    </TouchableOpacity>
                  }
                  // showRules
                />

                <Input
                  label="Last 4 digits of your BVN"
                  placeholder="Enter last 4 digits"
                  onChangeText={handleChange('lastFourDigitsOfBVN')}
                  onBlur={handleBlur('lastFourDigitsOfBVN')}
                  value={values.lastFourDigitsOfBVN}
                  maxLength={4}
                  keyboardType={'number-pad'}
                  error={
                    touched.lastFourDigitsOfBVN && errors.lastFourDigitsOfBVN
                  }
                  disabled={otpSent}
                />

                {otpSent && (
                  <View>
                    <Label
                      fontSize={15}
                      color={colors.grey04}
                      fontFamily="Inter-Medium"
                      marginBottom={12}
                    >
                      Enter verification code
                    </Label>
                    <View style={styles.otpContainer}>
                      <CodeField
                        ref={ref}
                        {...props}
                        value={otpValue}
                        onChangeText={setOtpValue}
                        cellCount={CELL_COUNT}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        renderCell={renderOtpCell}
                      />
                    </View>
                    {waitingForOtp && (
                      <Label
                        fontSize={14}
                        color={colors.grey04}
                        fontFamily="Inter-Medium"
                        marginTop={8}
                      >
                        Resend OTP in {counter}s
                      </Label>
                    )}
                  </View>
                )}

                <View style={[global.rowCenter, styles.checkboxContainer]}>
                  <Checkbox
                    label={
                      <XStack flex={1} marginLeft={8}>
                        <Label style={styles.readText}>I have read</Label>
                        <TouchableOpacity
                          style={{ marginLeft: horizontalScale(3) }}
                          onPress={async () => {
                            navigation.navigate('PDF', { item: pdf });
                          }}
                        >
                          <Label style={styles.termsLink}>
                            Terms & Conditions
                          </Label>
                        </TouchableOpacity>
                      </XStack>
                    }
                    value={values?.acceptedTermsAndConditions}
                    setValue={newValue =>
                      setFieldValue('acceptedTermsAndConditions', newValue)
                    }
                  />
                </View>

                <View marginTop={'auto'} marginBottom={16}>
                  <Button
                    onPress={() => handleSubmit()}
                    disabled={isButtonDisabled}
                    width={'100%'}
                    loading={loading}
                  >
                    {!otpSent ? 'Verify BVN' : 'Complete Registration'}
                  </Button>
                </View>
              </YStack>
            </View>
          );
        }}
      </Formik>
    </PageContainer>
  );
};

export default CreateUsername;
