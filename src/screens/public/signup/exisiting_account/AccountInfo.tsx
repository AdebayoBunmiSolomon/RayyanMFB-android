import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import PageContainer from '../../../../components/PageContainer';
import { Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../../components/Input';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { useTheme } from '../../../../context/ThemeContext';
const accountValidationSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
});

const AccountInfo: FC<PublicStackScreenProps<'AccountInfo'>> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();

  const proceedToSecurityQuestions = async (val: { accountNumber: string }) => {
    setLoading(true);

    try {
      // Navigate directly to SecurityQuestion with account number
      // Create compatible object for SecurityQuestion screen
      const securityItem = {
        accountNumber: val.accountNumber,
        lastFourDigitsOfBVN: '', // Will be collected later in CreateUsername
        otp: '', // Will be collected later in CreateUsername
      };
      navigation.navigate('SecurityQuestion', { item: securityItem });
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
        title="Create New Account"
        subtitle="Enter Your Account Number"
      />
      {/* form */}
      <Formik
        validationSchema={accountValidationSchema}
        initialValues={{
          accountNumber: '',
        }}
        onSubmit={async values => {
          await proceedToSecurityQuestions(values);
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
                placeholder="Account number"
                onChangeText={handleChange('accountNumber')}
                onBlur={handleBlur('accountNumber')}
                value={values.accountNumber}
                maxLength={10}
                keyboardType={'number-pad'}
                error={touched.accountNumber && errors.accountNumber}
              />
            </YStack>

            {/* bottom elements */}
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                loading={loading}
              >
                Continue
              </Button>

              {/* sign in */}
              <XStack marginInline="auto" marginTop={12} gap={4}>
                <Text color={colors.grey05} fontSize={14} fontWeight={'500'}>
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

export default AccountInfo;
