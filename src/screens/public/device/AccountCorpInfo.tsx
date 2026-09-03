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
  emailAddress: yup.string().email().required('Email address is required'),
});

const AccountCorpInfo: FC<PublicStackScreenProps<'AccountCorpInfo'>> = ({
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
      const username = userName?.split(':')[0];
      const corpId = userName?.split(':')[1];
      const res = await requestInit(
        undefined,
        `/retrieval/corp/security-questions?corpId=${corpId}&email=${val?.emailAddress}&username=${username}`,
      );
      if (res?.data?.code === '00') {
        const payload = {
          userName: userName,
          email: val?.emailAddress,
          data: res?.data?.data,
        };
        navigation.navigate('SecurityQACorp', { item: payload });
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
          emailAddress: '',
        }}
        onSubmit={async values => {
          const payload = {
            emailAddress: values.emailAddress,
            username: userName,
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
                label="Email Address"
                placeholder="user@email.com"
                onChangeText={handleChange('emailAddress')}
                onBlur={handleBlur('emailAddress')}
                value={values.emailAddress}
                keyboardType={'email-address'}
                error={touched.emailAddress && errors.emailAddress}
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

export default AccountCorpInfo;
