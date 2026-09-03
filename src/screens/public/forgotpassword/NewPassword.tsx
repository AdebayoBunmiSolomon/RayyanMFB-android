import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import { ResetPassword_ } from '../../../types/public.types';
import PageContainer from '../../../components/PageContainer';
import Input from '../../../components/Input';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { Text, View, XStack, YStack } from 'tamagui';
import { useTheme } from '../../../context/ThemeContext';
import { useApi } from '../../../hooks/useApi';
import { newPasswordSchema } from '../../../schema';
import { useAppToast } from '../../../hooks/useAppToast';

const NewPassword: FC<PublicStackScreenProps<'NewPassword'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;
  const { showSuccess, showError } = useAppToast();

  const [isSecureEntry, setIsSecureEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const request = useApi({
    endpoint: 'resetPassword',
    onSuccess: () => {
      showSuccess('Password changed successfully');
    },
    onError: (_error, errorDetails) => {
      showError(
        errorDetails?.code as string,
        errorDetails?.message ||
          'An error occurred while fetching security questions. Please try again.',
      );
    },
  });

  const resetUserPassword = async (val: ResetPassword_) => {
    setLoading(true);
    try {
      const res = await request.requestInit(val);
      if (res?.data?.code === '00') {
        navigation.navigate('PasswordSuccess', { message: res.data?.message });
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const { colors } = useTheme();

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth title="Reset Password" subtitle="Create New Password" />
      {/* form */}
      <Formik
        validationSchema={newPasswordSchema}
        initialValues={{
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={async values => {
          const myObject: { [key: string]: string } = {};
          myObject[`${item.secretQuestion}`] = item.secretAnswer;
          const payload = {
            ...values,
            ...item,
            userName: item.username,
            // questionsAndAnswers: myObject,
            secQesAns: [item.secretAnswer],
            secQes: [item.secretQuestion],
          };
          await resetUserPassword(payload);
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
                placeholder="Confirm Password"
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
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

            {/* bottom elements */}
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                loading={loading}
              >
                Reset
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

export default NewPassword;
