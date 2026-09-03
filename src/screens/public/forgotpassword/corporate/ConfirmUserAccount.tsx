import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import { ForgotPasswordCorp } from '../../../../types/public.types';
import { useApi } from '../../../../hooks/useApi';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import Input from '../../../../components/Input';
import { Text, View, XStack, YStack } from 'tamagui';
import { useTheme } from '../../../../context/ThemeContext';
import { confirmUserAccSchema } from '../../../../schema';

const ConfirmUserAccount: FC<PublicStackScreenProps<'ConfirmUserAccount'>> = ({
  navigation,
}) => {
  const { requestInit } = useApi({
    endpoint: 'requestForgotPasswordQuestions',
  });

  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);

  // const [request] = useLazyRequestForgotPasswordQuestionsQuery();

  const requestForgotQuestions = async (val: ForgotPasswordCorp) => {
    setLoading(true);
    const { email, username, corpID } = val;
    try {
      const res = await requestInit(
        undefined,
        `/retrieval/corp/security-questions?corpId=${corpID}&email=${email}&username=${username}`,
      );
      if (res?.data?.code === '00') {
        const payload = {
          userName: username,
          email,
          corpID,
          data: res?.data?.data,
        };
        navigation.navigate('ForgotPasswordSecurityQA', { item: payload });
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
        title="Forgot Password"
        subtitle="Let’s help you reset your password"
      />
      {/* form */}
      <Formik
        validationSchema={confirmUserAccSchema}
        initialValues={{
          email: '',
          username: '',
          corpID: '',
        }}
        onSubmit={async ({ corpID, email, username }) => {
          const payload = {
            email,
            username,
            corpID,
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
                label="Username"
                placeholder="Username"
                onChangeText={handleChange('username')}
                onBlur={handleBlur('username')}
                value={values.username}
                error={touched.username && errors.username}
              />
              <Input
                flex={1}
                label="Corporate ID"
                placeholder="Corporate ID"
                onChangeText={handleChange('corpID')}
                onBlur={handleBlur('corpID')}
                value={values.corpID}
                error={touched.corpID && errors.corpID}
              />
              <Input
                label="Email Address"
                placeholder="user@email.com"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType={'email-address'}
                error={touched.email && errors.email}
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
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text color={colors.primary} fontWeight="500" fontSize={13}>
                    Back to Login
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

export default ConfirmUserAccount;
