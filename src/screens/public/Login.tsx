import React, { FC, useEffect, useRef, useState } from 'react';
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Pressable,
  Text as RNText,
} from 'react-native';

import { Formik, FormikProps } from 'formik';
import { useDispatch } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import { AxiosError } from 'axios';

import { Text, View, XStack, YStack } from 'tamagui';
import { Eye, EyeSlash, FingerScan } from 'iconsax-react-native';

import { getCredentials, clearStoredCredentials } from '../../services/touch';
import { useAppSelector } from '../../hooks/hook';
import { useTheme } from '../../context/ThemeContext';
import { useAppToast } from '../../hooks/useAppToast';
import axiosInstance from '../../api/axiosInstance';
import { BASE_URL, IS_RETAIL } from '../../../config';
import getAccountType from '../../util/getAccountType';
import { storeCredentials } from '../../services/touch';
import runBiometricAuth from '../../services/biometricAuth';
import { resetAppClosedFlag } from '../../hooks/detectAppTermination';
import normalizeAndCheckText from '../../util/normalizeAndCheckText';

import { logOutUser, setUser } from '../../slices/authSlice';
import { setProfile } from '../../slices/profileSlice';
import { clearToken } from '../../slices/authSlice';

import { loginValidationSchema } from '../../schema';
import { normalizeSize } from '../../util/size';

import Button from '../../components/Button';
import Input from '../../components/Input';
import PageContainer from '../../components/PageContainer';
import HeaderAuth from '../../components/HeaderAuth';
import HeadingAuth from '../../components/HeadingAuth';
import Sheet from '../../components/Sheet';
import DeviceModal from '../../components/modals/DeviceModal';
import NewSignUp from '../../components/modals/NewSignUpSheet';
import { IS_CORPORATE } from '../../../config';
import VersionCheck from 'react-native-version-check';

import { PublicStackScreenProps } from '../../types/navigation.types';
import { SignInUser } from '../../types/public.types';
import loginStyles from '../../styles/login';
import Checkbox from '../../components/ui/Checkbox';
import { setRememberLogin } from '../../slices/appSlice';
import { setAccounts } from '../../slices/accountSlice';
import { nextScreen } from '../../util/navigation';
import { useCheckForUpdate } from '../../hooks/services/useCheckForUpdate';
import AppUpdateModal from '../../components/modals/AppUpdateModal';

const { styles } = loginStyles();

const defaultAuth: SignInUser = {
  userName: '',
  corporateId: '',
  passWord: '',
};

const Login: FC<PublicStackScreenProps<'Login'>> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { showError } = useAppToast();
  const formikRef = useRef<FormikProps<SignInUser>>(null);

  const userData = useAppSelector(state => state.auth.data);
  const { rememberLogin } = useAppSelector(state => state.app);

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [userName, setUserName] = useState('');
  const [loginDetails, setLoginDetails] = useState<SignInUser>();
  const [isSheetVisible, setSheetVisible] = useState(false);
  const [openSignUpSheet, setOpenSignUpSheet] = useState(false);
  const [isChecked, setIsChecked] = useState(rememberLogin);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AxiosError | null>(null);
  const [failCount, setFailCount] = useState(0); // Track failures

  const { versionSheetVisible, updateApp } = useCheckForUpdate();

  // useEffect(() => {
  //   console.log('Error', error);
  // }, [error]);

  const handleLoginUser = async (val: SignInUser) => {
    try {
      setLoading(true);
      setError(null);
      dispatch(clearToken());
      delete axiosInstance.defaults.headers.common.Authorization;

      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        showError('No Internet', 'Please check your network connection.');
        return;
      }

      // Additional network validation
      if (netState.type === 'none' || netState.type === 'unknown') {
        showError('Network Error', 'No active network connection detected.');
        return;
      }

      const deviceId = await DeviceInfo.getUniqueId();
      console.log('Device ID', deviceId);
      if (!deviceId) {
        showError('Device Error', 'Device ID could not be retrieved.');
        return;
      }

      let payload: any = { ...val, deviceId };

      const username = IS_CORPORATE
        ? `${val?.userName}:${val?.corporateId?.toLowerCase()}`
        : val?.userName;

      if (username.includes(':') && IS_RETAIL) {
        showError(
          'Access denied',
          'You do not have permission to use this application',
        );
        return;
      }

      if (IS_CORPORATE) {
        payload = {
          deviceId,
          userName: username,
          passWord: val?.passWord,
        };
      }

      const userType = getAccountType(username);
      setUserName(username);
      dispatch(setProfile({ userType }));

      let res: any;
      try {
        // Final fallback to axios
        res = await axiosInstance.post(`${BASE_URL}/user/signin`, payload, {
          timeout: 15000,
        });
        if (res?.data?.code === '00') {
          dispatch(setRememberLogin(isChecked));
          await storeCredentials(payload);
          await resetAppClosedFlag();

          dispatch(
            setUser({
              isLoggedIn: true,
              data: res.data.data,
            }),
          );
          // showSuccess('Login successful');
          setFailCount(0); // Reset on success
        } else {
          showError('Login failed', res?.data?.message || 'Unknown error');
        }

        console.log('resposne', res);
      } catch (err: unknown) {
        const axiosErr = err as AxiosError;
        console.log('response 5', axiosErr);
        setError(axiosErr);
        setFailCount(prev => prev + 1);

        if (axiosErr.message === 'Network Error') {
          // Check for SSL certificate validation errors
          const isSSLError =
            axiosErr.code === 'ERR_NETWORK' &&
            (axiosErr.request?._response?.includes('Chain validation failed') ||
              axiosErr.request?._response?.includes('certificate') ||
              axiosErr.request?._response?.includes('SSL'));

          if (isSSLError) {
            // Check if it's specifically an expired certificate
            const isExpiredCert =
              axiosErr.request?._response?.includes(
                'Chain validation failed',
              ) ||
              axiosErr.request?._response?.includes('certificate has expired');

            if (isExpiredCert) {
              showError(
                'Certificate Expired',
                'Server certificate has expired. The app will attempt to connect with relaxed security for development.',
              );
            } else {
              showError(
                'SSL Certificate Error',
                'Unable to verify server certificate. Please check your network settings and try again.',
              );
            }

            // Log SSL error details for debugging
          } else if (
            axiosErr.code === 'NETWORK_ERROR' ||
            axiosErr.code === 'ECONNREFUSED'
          ) {
            showError(
              'Server Unreachable',
              'Cannot connect to server. Please check your internet connection and try again.',
            );
          } else if (axiosErr.code === 'TIMEOUT') {
            showError(
              'Request Timeout',
              'Server is taking too long to respond. Please try again.',
            );
          } else {
            showError(
              'Network Error',
              'Unable to reach server. Please check your internet connection and try again.',
            );
          }
        } else if (axiosErr.response) {
          const status = axiosErr.response.status;
          const message =
            (axiosErr.response.data as any)?.message || 'Something went wrong';

          console.log('response', axiosErr.response);

          showError(`Error ${status}`, message);
        } else {
          showError('Login failed', 'Unexpected error occurred.');
        }

        if (failCount >= 2) {
          // Clearing stored credentials due to repeated failures
          await clearStoredCredentials();
          setFailCount(0);
          showError('Resetting Login', 'Please enter your credentials again.');
        }
      } finally {
        setLoading(false);
      }
    } catch (err: any) {
      console.log('Login error', err);
      showError(
        'Login Error',
        'An unexpected error occurred. Please try again.',
      );
    }
  };

  const handleLoginBiometric = async () => {
    try {
      const credentials = await getCredentials();

      if (!credentials) {
        showError(
          'Biometric not set',
          'Please login manually to enable biometric login.',
        );
        return;
      }

      await runBiometricAuth(async () => {
        const deviceId = await DeviceInfo.getUniqueId();
        if (!deviceId) {
          showError('Device ID Error', 'Unable to fetch device ID.');
          return;
        }

        const payload = {
          userName: credentials.username,
          passWord: credentials.password,
          deviceId,
        };

        await handleLoginUser(payload);
      });
    } catch (e) {
      // Biometric login error
      showError('Biometric Error', 'Please try manual login.');
    }
  };

  useEffect(() => {
    if (!error) return;

    const is403 = error?.response?.status === 403;
    const isNewDevice = normalizeAndCheckText(
      (error?.response?.data as any)?.message,
      'New Device Detected',
    );

    if (is403 || isNewDevice) {
      Keyboard.dismiss();
      setSheetVisible(true);
    }
  }, [error]);

  useEffect(() => {
    const fetchStoredCredentials = async () => {
      try {
        const credentials = await getCredentials();
        if (credentials) {
          setLoginDetails({
            userName: credentials.username,
            passWord: credentials.password,
          });
        }
      } catch (e) {
        // Failed to retrieve credentials
        await clearStoredCredentials();
      }
    };
    fetchStoredCredentials();
  }, []);

  useEffect(() => {
    const newUsername = IS_CORPORATE
      ? loginDetails?.userName?.split(':')[0]
      : loginDetails?.userName;

    if (formikRef.current && loginDetails?.userName) {
      formikRef.current.setFieldValue('userName', newUsername);
    }
  }, [loginDetails]);

  const resetDevice = () => {
    const payload = {
      isLoggedIn: false,
      showSplash: false,
      message: '',
      token: '',
      data: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        token: '',
        username: '',
      },
    };
    dispatch(setAccounts([]));
    dispatch(logOutUser(payload));
    dispatch(setRememberLogin(false));
    setIsChecked(false);
    clearStoredCredentials();
  };

  return (
    <PageContainer>
      <HeaderAuth noBckArrow />
      <HeadingAuth
        title="Login to Rayyan"
        subtitle="Welcome back,"
        user={userData}
        swap
      />

      <Formik
        validationSchema={loginValidationSchema}
        initialValues={defaultAuth}
        innerRef={formikRef}
        onSubmit={handleLoginUser}
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
              {!rememberLogin && (
                <>
                  <Input
                    label="Username"
                    placeholder="Username"
                    onChangeText={handleChange('userName')}
                    onBlur={handleBlur('userName')}
                    value={values.userName}
                    error={touched.userName && errors.userName}
                  />
                </>
              )}

              {IS_CORPORATE && (
                <Input
                  label="Corporate ID"
                  placeholder="Corporate ID"
                  onChangeText={handleChange('corporateId')}
                  onBlur={handleBlur('corporateId')}
                  value={values.corporateId}
                  error={touched.corporateId && errors.corporateId}
                />
              )}
              <Input
                label="Password"
                placeholder="Password"
                onChangeText={handleChange('passWord')}
                onBlur={handleBlur('passWord')}
                value={values.passWord}
                secureTextEntry={isSecureEntry}
                error={touched.passWord && errors.passWord}
                endIcon={
                  <TouchableOpacity
                    onPress={() => setIsSecureEntry(prev => !prev)}
                  >
                    {isSecureEntry ? (
                      <EyeSlash size={normalizeSize(24)} color="#636666" />
                    ) : (
                      <Eye size={normalizeSize(24)} color="#636666" />
                    )}
                  </TouchableOpacity>
                }
                // showRules
              />
            </YStack>

            <XStack
              justifyContent="space-between"
              alignItems="center"
              marginTop={18}
            >
              {!rememberLogin && (
                <Checkbox
                  label="Remember me"
                  value={isChecked}
                  setValue={newValue => setIsChecked(newValue)}
                />
              )}
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate(nextScreen.forgotPasswordRoute)
                }
              >
                <Text
                  style={styles.forgetText}
                  fontFamily="Inter-Regular"
                  color={colors.primary}
                >
                  Forgot Password?
                </Text>
              </TouchableWithoutFeedback>
            </XStack>

            <View marginTop="auto" marginBottom={16}>
              <XStack gap={10}>
                <Button
                  onPress={() => {
                    // console.log('press in');
                    handleSubmit();
                  }}
                  disabled={!(isValid && dirty) || loading}
                  width="100%"
                  flex={1}
                  loading={loading}
                >
                  Login
                </Button>

                {/* <Pressable
                  onPressIn={() => console.log('RAW pressIn')}
                  onPress={() => console.log('RAW press')}
                  disabled={!(isValid && dirty) || loading}
                  style={{
                    height: 50,
                    backgroundColor: 'red',
                    justifyContent: 'center',
                  }}
                >
                  <RNText>raw test</RNText>
                </Pressable> */}

                {rememberLogin && (
                  <Button
                    variant="outlined"
                    width={50}
                    onPress={handleLoginBiometric}
                  >
                    <FingerScan color={colors.primary} size={22} />
                  </Button>
                )}
              </XStack>

              {!IS_CORPORATE && (
                <XStack marginInline="auto" marginTop={12} gap={4}>
                  <Text
                    fontFamily="Inter-Regular"
                    color={colors.textSecondary}
                    fontSize={14}
                  >
                    {rememberLogin
                      ? `Not ${userData.firstName} ${userData.lastName}?`
                      : 'Not Registered?'}
                  </Text>

                  <TouchableWithoutFeedback
                    onPress={() =>
                      rememberLogin ? resetDevice() : setOpenSignUpSheet(true)
                    }
                  >
                    <Text
                      fontFamily="Inter-Medium"
                      color={colors.primary}
                      fontSize={14}
                      fontWeight="500"
                    >
                      {rememberLogin ? 'Reset Device Login' : 'Sign up'}
                    </Text>
                  </TouchableWithoutFeedback>
                </XStack>
              )}
            </View>
          </View>
        )}
      </Formik>

      <TouchableOpacity>
        <Text
          fontSize={12}
          fontFamily="Inter-Medium"
          textAlign="center"
          color={colors.grey04}
        >
          v{VersionCheck.getCurrentVersion()}
        </Text>
      </TouchableOpacity>

      <Sheet
        isVisible={versionSheetVisible}
        sheetHeight={350}
        onClose={() => {}}
      >
        <AppUpdateModal
          onPress={() => {
            updateApp();
          }}
        />
      </Sheet>

      <Sheet
        isVisible={isSheetVisible}
        sheetHeight={350}
        onClose={() => setSheetVisible(false)}
      >
        <DeviceModal
          onPress={() => {
            setSheetVisible(false);
            navigation.navigate(
              !IS_CORPORATE ? 'AccountInformation' : 'AccountCorpInfo',
              { userName },
            );
          }}
        />
      </Sheet>

      {!IS_CORPORATE && (
        <Sheet
          isVisible={openSignUpSheet}
          sheetHeight={400}
          onClose={() => setOpenSignUpSheet(false)}
        >
          <NewSignUp
            onPress={() => {
              setOpenSignUpSheet(false);
              navigation.navigate('AccountInfo');
            }}
          />
        </Sheet>
      )}
    </PageContainer>
  );
};

export default Login;
