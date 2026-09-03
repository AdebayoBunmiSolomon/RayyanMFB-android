import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import { ForgotRequestQuestions } from '../../../types/public.types';
import { useApi } from '../../../hooks/useApi';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import Input from '../../../components/Input';
import { Text, View, XStack, YStack } from 'tamagui';
import { useTheme } from '../../../context/ThemeContext';
const accountValidationSchema = yup.object().shape({
  accountNum: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
  lastFourDigitsOfBVN: yup
    .string()
    .min(4, ({ min }) => `Must be at least ${min} characters`)
    .max(4, ({ max }) => `Must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('BVN last four digits is required'),
});

const AccountInformation: FC<PublicStackScreenProps<'AccountInformation'>> = ({
  navigation,
  route,
}) => {
  const { requestInit } = useApi({
    endpoint: 'requestForgotPasswordQuestions',
  });

  const { colors } = useTheme();

  const { userName } = route.params;

  const [loading, setLoading] = useState(false);

  // const [request] = useLazyRequestForgotPasswordQuestionsQuery();

  const requestForgotQuestions = async (val: ForgotRequestQuestions) => {
    setLoading(true);
    try {
      const res = await requestInit(
        undefined,
        `/retrieval/retail/security-questions?accountNumber=${val?.accountNumber}&lastFourDigitsOfBvn=${val?.lastFourDigitsOfBvn}&username=${val?.username}`,
      );

      if (res?.data?.code === '00') {
        const payload = {
          userName: val.username,
          accountNum: val.accountNumber,
          lastFourDigitsOfBVN: val.lastFourDigitsOfBvn,
          data: res?.data?.data,
        };

        navigation.navigate('SecurityQA', { item: payload });
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

      <HeadingAuth
        title="New Device Setup"
        subtitle="Please verify your identity to continue."
      />
      {/* form */}
      <Formik
        validationSchema={accountValidationSchema}
        initialValues={{
          accountNum: '',
          lastFourDigitsOfBVN: '',
        }}
        onSubmit={async values => {
          const payload = {
            accountNumber: values.accountNum,
            lastFourDigitsOfBvn: values.lastFourDigitsOfBVN,
            username: userName?.trim(),
          };

          await requestForgotQuestions(payload);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          touched,
          dirty,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <Input
                label="Account Number"
                placeholder="Account number"
                onChangeText={handleChange('accountNum')}
                onBlur={handleBlur('accountNum')}
                value={values.accountNum}
                maxLength={10}
                keyboardType={'number-pad'}
                error={touched.accountNum && errors.accountNum}
              />
              <Input
                placeholder="Last 4 digits of your BVN"
                label="Last 4 Digits of Your BVN"
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

export default AccountInformation;
