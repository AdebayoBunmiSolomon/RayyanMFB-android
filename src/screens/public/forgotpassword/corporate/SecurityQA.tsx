/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import DeviceInfo from 'react-native-device-info';
import PageContainer from '../../../../components/PageContainer';
import { Text, View, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import Input from '../../../../components/Input';
import { useTheme } from '../../../../context/ThemeContext';
import randomNumber from '../../../../util/randomNumber';
import { useApi } from '../../../../hooks/useApi';
import { useAppToast } from '../../../../hooks/useAppToast';

const securityValidationSchema = yup.object().shape({
  secretQuestion: yup.string().required('Select a secret question'),
  secretAnswer: yup.string().required('Enter the secret answer'),
});

const ForgotPasswordSecurityQA: FC<
  PublicStackScreenProps<'ForgotPasswordSecurityQA'>
> = ({ navigation, route }) => {
  const {
    item: { email, userName, corpID, data },
  } = route.params ?? {};

  const { requestInit, loading } = useApi({
    endpoint: 'forgotPasswordQAVerify',
  });
  const sendTokenApi = useApi({
    endpoint: 'forgotPasswordSendToken',
  });

  const { showSuccess } = useAppToast();

  const [details, setDetails] = useState({
    secretQuestion: '',
    secretAnswer: '',
  });

  const { colors } = useTheme();

  const sendOtpHandler = async payload => {
    try {
      const response = await sendTokenApi?.requestInit(
        undefined,
        `/retrieval/corp/send-otp?corpId=${payload?.corpID}&username=${payload?.userName}`,
      );

      if (response?.data?.code === '00') {
        showSuccess(
          'OTP Sent',
          'A verification code has been sent to you to complete the password reset',
        );
        navigation.navigate('NewTokenPassword', { item: payload });
      }
    } catch (error) {
    } finally {
    }
  };

  const resetUserDevice = async ({
    deviceId,
    secretQuestion,
    secretAnswer,
  }: {}) => {
    try {
      const payload = {
        corpID,
        userEmail: email,
        userName,
        deviceId,
        secQesAns: [secretAnswer],
        secQes: [secretQuestion],
      };
      const response = await requestInit(payload);
      if (response?.data?.code === '00') {
        await sendOtpHandler(payload);
      }
    } catch (error) {
    } finally {
    }
  };

  useEffect(() => {
    const len = data?.length;
    const randomPick = randomNumber(0, len - 1);

    setDetails(prev => ({
      ...prev,
      secretQuestion: data[randomPick],
    }));
  }, [data]);

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="Security Question"
        subtitle="Confirm your identity with a security answer."
        swap
      />
      {/* form */}
      <Formik
        validationSchema={securityValidationSchema}
        initialValues={(details && details) || {}}
        enableReinitialize={true}
        onSubmit={async values => {
          let deviceId = '';
          await DeviceInfo.getUniqueId().then(res => {
            deviceId = res;
          });

          await resetUserDevice({ deviceId, ...values });
        }}
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
              <Input
                label="Secret Question"
                placeholder="Secret Question"
                onChangeText={handleChange('secretQuestion')}
                onBlur={handleBlur('secretQuestion')}
                value={details.secretQuestion}
                editable={false}
              />

              <Input
                label="Secret Answer"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswer')}
                onBlur={handleBlur('secretAnswer')}
                value={values.secretAnswer}
                error={touched.secretAnswer && errors.secretAnswer}
              />
            </YStack>

            {/* bottom elements */}
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                loading={loading || sendTokenApi?.loading}
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

export default ForgotPasswordSecurityQA;
