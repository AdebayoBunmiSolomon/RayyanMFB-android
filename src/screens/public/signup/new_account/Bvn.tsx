import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { Text, View, XStack } from 'tamagui';
import Input from '../../../../components/Input';
import { useTheme } from '../../../../context/ThemeContext';
import { useApi } from '../../../../hooks/useApi';
import { useAppToast } from '../../../../hooks/useAppToast';
import BVNVerificaion from '../../../../components/BVNVerificaion';
const bvnValidationSchema = yup.object().shape({
  bvn: yup
    .string()
    .min(11, ({ min }) => `BVN must be at least ${min} characters`)
    .max(11, ({ max }) => `BVN must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('BVN is required'),
});

const Bvn: FC<PublicStackScreenProps<'Bvn'>> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [bvn, setBvn] = useState('');
  const [value, setValue] = useState('');
  const [showBvnVerify, setShowBvnVerify] = useState(false);
  const [userDetails, setUserDetails] = useState<any>({});
  const { showError, showSuccess } = useAppToast();

  const request = useApi({
    endpoint: 'bvnCustomerDetails',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.message ||
          'Failed to initiate BVN verification. Please try again.',
      );
    },
    showErrorToast: true,
  });
  const validate = useApi({
    endpoint: 'validateOTP',
  });

  const { colors } = useTheme();

  // const mock = React.memo(() =>
  //   navigation.navigate('Kyc', {
  //     item: {
  //       cifId: '9w9wjf3434',
  //       customerName: null,
  //       dateOfBirth: '03-04-1998',
  //       email: 'iamwavefly+1@gmail.com',
  //       phone: '08068125901',
  //       bvn: '11032323212',
  //       lastName: 'Monday',
  //       firstName: 'Samson',
  //       middleName: 'Francis',
  //       preferredName: 'Wavefly',
  //       rcNo: '239293',
  //       taxId: '34349394',
  //       corp: false,
  //     },
  //   });

  const getCustomerDetails = async (bvn: string) => {
    setLoading(true);
    try {
      // mock(); // !remove
      const res = await request.requestInit(undefined, `/register/bvn/${bvn}`);
      console.log('response', res);
      const { code, data, message } = res?.data;
      if (code === '00') {
        showSuccess(message);
        setUserDetails(data);
        setShowBvnVerify(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const validateOTPHandler = async () => {
    setLoading(true);
    try {
      const payload = {
        bvn,
        otp: value,
      };

      const res = await validate.requestInit(payload);
      const { code, message } = res?.data;
      if (code === '00') {
        showSuccess(message);
        navigation.navigate('Kyc', { item: userDetails });
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
      <HeadingAuth title="BVN Verification" subtitle="Validate your identity" />
      {/* form */}
      <Formik
        validationSchema={bvnValidationSchema}
        initialValues={{
          bvn: '',
        }}
        onSubmit={async values => {
          setBvn(values?.bvn);
          await getCustomerDetails(values?.bvn);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          dirty,
          touched,
          isValid,
        }) => (
          <View flex={1} marginTop={32}>
            {showBvnVerify ? (
              <BVNVerificaion
                visible={showBvnVerify}
                setLoading={setLoading}
                requestTokenAPI={() => getCustomerDetails(bvn)}
                value={value}
                setValue={setValue}
                validator={userDetails?.phone}
              />
            ) : (
              <Input
                placeholder="BVN (11 digits)"
                onChangeText={handleChange('bvn')}
                onBlur={handleBlur('bvn')}
                value={values.bvn}
                maxLength={11}
                keyboardType={'number-pad'}
                error={touched.bvn && errors.bvn}
              />
            )}

            {/* bottom elements */}
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() =>
                  showBvnVerify ? validateOTPHandler() : handleSubmit()
                }
                disabled={
                  showBvnVerify ? value.length !== 6 : !(isValid && dirty)
                }
                width={'100%'}
                loading={loading}
              >
                {showBvnVerify ? 'Verify BVN' : 'Continue'}
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

export default Bvn;
