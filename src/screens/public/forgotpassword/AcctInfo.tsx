import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import { ForgotRequestQuestions } from '../../../types/public.types';
import Input from '../../../components/Input';
import { accountValidationSchema } from '../../../schema';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import HeadingAuth from '../../../components/HeadingAuth';
import { useTheme } from '../../../context/ThemeContext';
import { useApi } from '../../../hooks/useApi';
import { useAppToast } from '../../../hooks/useAppToast';

const AcctInfo: FC<PublicStackScreenProps<'AcctInfo'>> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const { showError, showSuccess } = useAppToast();

  const request = useApi({
    endpoint: 'requestForgotPasswordQuestions',
    showErrorToast: true,
    onError: (_error, errorDetails) => {
      showError(
        errorDetails?.code as string,
        errorDetails?.message ||
          'An error occurred while fetching security questions. Please try again.',
      );
    },
    onSuccess: () => {
      showSuccess('Security questions fetched successfully');
    },
  });

  const { colors } = useTheme();

  const requestForgotQuestions = async (val: ForgotRequestQuestions) => {
    setLoading(true);
    try {
      const res = await request.requestInit(
        undefined,
        `/retrieval/retail/security-questions?accountNumber=${val.accountNumber}&lastFourDigitsOfBvn=${val.lastFourDigitsOfBvn}&username=${val.username}`,
      );
      if (res?.data?.code === '00') {
        navigation.navigate('SecQuestion', {
          item: { data: res.data?.data, username: val.username },
        });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth title="Forgot Password" subtitle="Verify Your Identity" />
      {/* form */}
      <Formik
        validationSchema={accountValidationSchema}
        initialValues={{
          accountNumber: '',
          lastFourDigitsOfBVN: '',
          username: '',
        }}
        onSubmit={async values => {
          await requestForgotQuestions({
            accountNumber: values.accountNumber,
            lastFourDigitsOfBvn: values.lastFourDigitsOfBVN,
            username: values.username?.trim(),
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          dirty,
          isValid,
          touched,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <Input
                placeholder="Account Number"
                onChangeText={handleChange('accountNumber')}
                onBlur={handleBlur('accountNumber')}
                value={values.accountNumber}
                maxLength={10}
                keyboardType={'number-pad'}
                error={touched.accountNumber && errors.accountNumber}
              />
              <Input
                placeholder="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                error={touched.username && errors.username}
              />
              <Input
                placeholder="Last 4 digits of your BVN (Eg. 2943)"
                onChangeText={handleChange('lastFourDigitsOfBVN')}
                onBlur={handleBlur('lastFourDigitsOfBVN')}
                value={values.lastFourDigitsOfBVN}
                maxLength={4}
                keyboardType={'number-pad'}
                error={
                  touched.lastFourDigitsOfBVN && errors.lastFourDigitsOfBVN
                }
              />
            </YStack>

            {/* bottom elements */}
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
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

export default AcctInfo;
