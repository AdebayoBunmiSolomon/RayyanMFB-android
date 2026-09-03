import { TouchableOpacity } from 'react-native';
import React, { FC, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import { global } from '../../../theme/metrics';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../../../components/Button';
import SuccessModal from '../../../components/modals/SuccessModal';
import { ChangePassword_ } from '../../../types/settings.types';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import { View, YStack } from 'tamagui';
import Input from '../../../components/Input';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { useAppToast } from '../../../hooks/useAppToast';

const changeValidationSchema = yup.object().shape({
  oldPassword: yup.string().required('Old password is required'),
  newPassword: yup
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
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm password is required'),
});

const ChangePassword: FC<MainStackScreenProps<'ChangePassword'>> = ({}) => {
  const { showError, showSuccess } = useAppToast();
  const changeUserPasswordReq = useApi({
    endpoint: 'changeUserPassword',
    showErrorToast: true,
    onError: (_error, errorDetails) => {
      showError(
        errorDetails?.code as string,
        errorDetails?.message ||
          'An error occurred while fetching security questions. Please try again.',
      );
    },
    onSuccess: () => {
      showSuccess('Password changed successfully');
    },
  });

  const [isSecureEntry, setIsSecureEntry] = useState(true);

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);

  const changeUserPassword = async (val: ChangePassword_) => {
    setLoading(true);
    try {
      const res = await changeUserPasswordReq.requestInit(val);

      if (res?.data === '') {
        setModal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      {modal && (
        <SuccessModal
          isVisible={modal}
          onBackdropPress={() => setModal(false)}
          onBackButtonPress={() => setModal(false)}
          onSwipeComplete={() => setModal(false)}
          closeModal={() => setModal(false)}
          title={`Password Changed ${`\n`} Successful`}
          onPress={() => setModal(false)}
        />
      )}
      <HeaderAuth noLogo headerTitle="Change Password" />

      <Formik
        validationSchema={changeValidationSchema}
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        onSubmit={async values => {
          await changeUserPassword(values);
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
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              <Input
                label="Old Password"
                value={values.oldPassword}
                onChangeText={handleChange('oldPassword')}
                onBlur={handleBlur('oldPassword')}
                placeholder="Password"
                error={touched.oldPassword && errors.oldPassword}
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
                label="New Password"
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                onBlur={handleBlur('newPassword')}
                placeholder="Password"
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
              />

              <Input
                label="Confirm New Password"
                value={values.confirmPassword}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                placeholder="Password"
                error={touched.confirmPassword && errors.confirmPassword}
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
              />
            </YStack>

            <View
              style={{
                ...global.flexRow,
                marginTop: 'auto',
                marginBottom: 16,
              }}
            >
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                loading={loading}
              >
                Change Password
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default ChangePassword;
