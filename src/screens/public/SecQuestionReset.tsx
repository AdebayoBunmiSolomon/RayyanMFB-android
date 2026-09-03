import React, { use, useEffect, useState } from 'react';
import PageContainer from '../../components/PageContainer';
import HeaderAuth from '../../components/HeaderAuth';
import { PublicStackScreenProps } from '../../types/navigation.types';
import { Formik } from 'formik';
import * as yup from 'yup';
import { onlyTextRegex } from '../../util/regex';
import { Text, View, XStack, YStack } from 'tamagui';
import { useApi } from '../../hooks/useApi';
import { useAppToast } from '../../hooks/useAppToast';
import ProgressModal from '../../components/modals/ProgressModal';
import Input from '../../components/Input';
import SelectPicker from '../../components/SelectOption';
import Button from '../../components/Button';
import colors from '../../theme/color';
import { TouchableWithoutFeedback } from 'react-native';
// import { useAppSelector } from '../../hooks/hook';
// import { RootState } from '../../stores/store';

interface Props {
  key: number;
  label: string;
  value: string;
}

const securityValidationSchema = yup.object().shape({
  secretQuestionOne: yup.string().required('Select a secret question'),
  secretAnswerOne: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),

  secretQuestionTwo: yup.string().required('Select a secret question'),
  secretAnswerTwo: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),

  secretQuestionThree: yup.string().required('Select a secret question'),
  secretAnswerThree: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),
});

export const SecQuestionReset = ({
  navigation,
  route,
}: PublicStackScreenProps<'SecurityQuestionReset'>) => {
  const { username } = route?.params ?? {};
  // const username = useAppSelector(
  //   (state: RootState) => state.auth.data.username,
  // );
  const [securityQuestionsList, setSecurityQuestionsList] = useState<Props[]>(
    [],
  );
  const { showError, showSuccess } = useAppToast();
  const [loadingSecQ, setLoadingSecQ] = useState<boolean>(false);
  const [sendingOTP, setSendingOTP] = useState<boolean>(false);

  const sendSecurityQuestionsResetOTP = useApi({
    endpoint: 'sendSecurityQuestionResetOtp',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.code as string,
        _errorDetails?.message || 'Failed to send OTP',
      );
    },
  });
  const securityQuestions = useApi({
    endpoint: 'getAvailableSecurityQuestions',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.code as string,
        _errorDetails?.message || 'Failed to fetch security questions',
      );
    },
  });

  const getSecurityQuestions = async () => {
    setLoadingSecQ(true);
    try {
      const res = await securityQuestions.requestInit();
      if (res?.data?.data?.length) {
        const qst = res?.data?.data?.[0].map(
          (_: { code: any }, index: number) => {
            return {
              key: index,
              value: _.code,
              label: _.code,
            };
          },
        );
        // console.log('Available Security Questions:', qst);
        setSecurityQuestionsList(qst);
      }
    } catch (_error) {
      // console.error('Error fetching security questions:', error);
      setSecurityQuestionsList([]);
    } finally {
      setLoadingSecQ(false);
    }
  };

  const sendResetOtp = async (secQes: string[], secAns: string[]) => {
    setSendingOTP(true);
    try {
      const res = await sendSecurityQuestionsResetOTP.requestInit(
        undefined,
        `/retrieval/retail/security-question-reset/send-otp?username=${username}`,
      );
      if (res?.status === 200) {
        showSuccess(
          'OTP Sent',
          'A verification code has been sent to your mobile number',
        );
        navigation.navigate('SecQuestionResetOTP', {
          secQes,
          secQesAns: secAns,
          username: String(username),
        });
      }
    } catch (_error) {
      console.error('Error sending reset OTP:', _error);
    } finally {
      setSendingOTP(false);
    }
  };

  useEffect(() => {
    getSecurityQuestions();
  }, []);

  return (
    <PageContainer>
      <HeaderAuth headerTitle="Reset Security Questions" noLogo />

      {loadingSecQ && (
        <ProgressModal
          isVisible={loadingSecQ}
          onBackdropPress={() => setLoadingSecQ(true)}
          onBackButtonPress={() => setLoadingSecQ(true)}
        />
      )}

      <Formik
        validationSchema={securityValidationSchema}
        enableReinitialize={true}
        initialValues={{
          secretQuestionOne: '',
          secretAnswerOne: '',
          secretQuestionTwo: '',
          secretAnswerTwo: '',
          secretQuestionThree: '',
          secretAnswerThree: '',
        }}
        onSubmit={async values => {
          const payload = {
            // ...item,
            secQes: [
              values.secretQuestionOne,
              values.secretQuestionTwo,
              values.secretQuestionThree,
            ],
            secAns: [
              values.secretAnswerOne?.trim(),
              values.secretAnswerTwo?.trim(),
              values.secretAnswerThree?.trim(),
            ],
          };
          console.log('Payload for resetting security questions:', payload);
          await sendResetOtp(payload.secQes, payload.secAns);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          dirty,
          isValid,
          touched,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <SelectPicker
                label="Secret Question 1"
                selected={values.secretQuestionOne}
                onChange={value => {
                  // handleOnChangeOne(value);
                  setFieldValue('secretQuestionOne', value);
                }}
                data={securityQuestionsList}
                placeholderLabel="Question"
                error={touched.secretQuestionOne && errors.secretQuestionOne}
              />

              <Input
                label="Secret Answer"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswerOne')}
                onBlur={handleBlur('secretAnswerOne')}
                value={values.secretAnswerOne}
                error={touched.secretAnswerOne && errors.secretAnswerOne}
              />

              <SelectPicker
                label="Secret Question 2"
                selected={values.secretQuestionTwo}
                onChange={value => {
                  setFieldValue('secretQuestionTwo', value);
                }}
                data={securityQuestionsList}
                placeholderLabel="Question"
                error={touched.secretQuestionTwo && errors.secretQuestionTwo}
              />

              <Input
                label="Secret Answer"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswerTwo')}
                onBlur={handleBlur('secretAnswerTwo')}
                value={values.secretAnswerTwo}
                error={touched.secretAnswerTwo && errors.secretAnswerTwo}
              />

              <SelectPicker
                label="Secret Question 3"
                selected={values.secretQuestionThree}
                onChange={val22ue => {
                  setFieldValue('secretQuestionThree', val22ue);
                }}
                data={securityQuestionsList}
                placeholderLabel="Question"
                error={
                  touched.secretQuestionThree && errors.secretQuestionThree
                }
              />

              <Input
                label="Secret Answer"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswerThree')}
                onBlur={handleBlur('secretAnswerThree')}
                value={values.secretAnswerThree}
                error={touched.secretAnswerThree && errors.secretAnswerThree}
              />
            </YStack>

            {/* bottom elements */}
            <View marginTop={48} marginBottom={16}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                loading={sendingOTP}
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
