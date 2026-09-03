/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import DeviceInfo from 'react-native-device-info';
import { ResetDevice } from '../../../types/public.types';
import PageContainer from '../../../components/PageContainer';
import { Text, View, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import Input from '../../../components/Input';
import { useTheme } from '../../../context/ThemeContext';
import randomNumber from '../../../util/randomNumber';
import { useApi } from '../../../hooks/useApi';

const securityValidationSchema = yup.object().shape({
  secretQuestion: yup.string().required('Select a secret question'),
  secretAnswer: yup.string().required('Enter the secret answer'),
});

const SecurityQACorp: FC<PublicStackScreenProps<'SecurityQACorp'>> = ({
  navigation,
  route,
}) => {
  const { requestInit } = useApi({
    endpoint: 'resetDevice',
  });

  const { item } = route.params ?? {};

  const [details, setDetails] = useState({
    secretQuestion: '',
    secretAnswer: '',
  });

  const [loading, setLoading] = useState(false);

  // const [reset] = useResetDeviceMutation();
  const { colors } = useTheme();

  const resetUserDevice = async (val: ResetDevice) => {
    setLoading(true);

    try {
      const res = await requestInit(val);
      if (res?.data) {
        navigation.navigate('DeviceSuccess');
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const len = item?.data?.length;
    const randomPick = randomNumber(0, len - 1);

    setDetails(prev => ({
      ...prev,
      secretQuestion: item?.data[randomPick],
    }));
  }, []);

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="New Device Setup"
        subtitle="Verify Your Identity"
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
          const payload = {
            ...item,
            corpID: item?.userName?.split(':')[1],
            secQes: [values.secretQuestion],
            secQesAns: [values.secretAnswer],
            deviceId: deviceId,
            userEmail: item?.email,
            userName: item?.userName?.split(':')[0],
          };

          await resetUserDevice(payload);
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

export default SecurityQACorp;
