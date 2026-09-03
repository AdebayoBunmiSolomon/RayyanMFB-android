/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import { global } from '../../../theme/metrics';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../../../components/Button';
import SuccessModal from '../../../components/modals/SuccessModal';
import PinModal from '../../../components/modals/PinModal';
import LoadingModal from '../../../components/modals/LoadingModal';
import { SecretQuestion } from '../../../types/settings.types';
import { useApi } from '../../../hooks/useApi';
import { View, XStack, YStack } from 'tamagui';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import HeaderAuth from '../../../components/HeaderAuth';
import UserFaceScanIcon from '../../../assets/svg/User_scan_duotone.svg';
import { GET_P, SAVE_P } from '../../../services/storage';
// import TouchID from 'react-native-touch-id';
import { useTheme } from '../../../context/ThemeContext';
import { onlyTextRegex } from '../../../util/regex';
import runBiometricAuth from '../../../services/biometricAuth';

interface Props {
  key: number;
  label: string;
  value: string;
}

const securityValidationSchema = yup.object().shape({
  secretQuestionOne: yup
    .string()
    .required('Select a secret question')
    .nullable(),
  secretAnswerOne: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),

  secretQuestionTwo: yup
    .string()
    .required('Select a secret question')
    .nullable(),
  secretAnswerTwo: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),

  secretQuestionThree: yup
    .string()
    .required('Select a secret question')
    .nullable(),
  secretAnswerThree: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),
});

const SecurityQuestions: FC<
  MainStackScreenProps<'SecurityQuestions'>
> = ({}) => {
  const regSecurityQuestions = useApi({
    endpoint: 'regSecurityQuestions',
  });
  const maintainSecretQuestionsReq = useApi({
    endpoint: 'maintainSecretQuestions',
  });

  const [p, setP] = useState('');
  const [questionOne, setQuestionOne] = useState('');

  const [questionTwo, setQuestionTwo] = useState('');

  const [questionThree, setQuestionThree] = useState('');

  const handleOnChangeOne = (value: string | null) => {
    setQuestionOne(value as string);
  };

  const handleOnChangeTwo = (value: string | null) => {
    setQuestionTwo(value as string);
  };

  const handleOnChangeThree = (value: string | null) => {
    setQuestionThree(value as string);
  };

  const { colors } = useTheme();

  const [txn, setTxn] = useState(false);
  const [loading_, setLoading_] = useState(false);
  const [value, setValue] = useState('');
  const [questions, setQuestions] = useState<Props[]>([]);
  const [txnData, setTxnData] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const maintainSecretQuestions = async (val: SecretQuestion) => {
    setLoading_(true);

    try {
      const res = await maintainSecretQuestionsReq.requestInit(
        val.questionsAndAnswers,
        `/v1/customer/retail/security-questions?transactionPin=${val.transactionPin}`,
      );

      if (res?.data === '') {
        return setShowSuccess(true);
      }
    } catch (error) {
    } finally {
      setValue('');
      setLoading_(false);
    }
  };

  useEffect(() => {
    const getSecurityQuestions = async () => {
      setLoading_(true);
      try {
        const res = await regSecurityQuestions.requestInit();

        const newQuestions = res?.data?.data ?? res?.data;

        if (newQuestions) {
          const qst = newQuestions?.[0]?.map((_: any, index: number) => {
            return {
              key: index,
              value: _.code,
              label: _.code,
            };
          });
          setQuestions(qst);
          setLoading_(false);
        }
        setLoading_(false);
      } catch (error) {
        setLoading_(false);
      }
    };

    getSecurityQuestions();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await GET_P();
      if (res) {
        setP(res);
      }
    })();
  }, []);

  const handleBiometricAuth = async () => {
    await runBiometricAuth(async () => {
      const payload = {
        transactionPin: p,
        questionsAndAnswers: txnData,
      };
      await maintainSecretQuestions(payload);
    });
  };

  return (
    <PageContainer>
      {showSuccess && (
        <SuccessModal
          isVisible={showSuccess}
          onBackdropPress={() => setShowSuccess(false)}
          onBackButtonPress={() => setShowSuccess(false)}
          onSwipeComplete={() => setShowSuccess(false)}
          closeModal={() => setShowSuccess(false)}
          title={`Secret Question ${`\n`} Updated`}
          onPress={() => {}}
        />
      )}

      {loading_ && !showSuccess && (
        <LoadingModal
          isVisible={loading_}
          onBackdropPress={() => setLoading_(true)}
          onBackButtonPress={() => setLoading_(true)}
        />
      )}

      {txn && (
        <PinModal
          isVisible={txn}
          onBackdropPress={() => setTxn(false)}
          onBackButtonPress={() => setTxn(false)}
          value={value}
          setValue={async val => {
            setValue(val);
            if (val.length === 4) {
              setTxn(false);
              const payload = {
                transactionPin: val,
                questionsAndAnswers: txnData,
              };
              SAVE_P(val);
              await maintainSecretQuestions(payload);
            }
          }}
        />
      )}
      <HeaderAuth headerTitle="Maintain Secret Questions" noLogo />

      <Formik
        validationSchema={securityValidationSchema}
        initialValues={{
          secretQuestionOne: '',
          secretAnswerOne: '',
          secretQuestionTwo: '',
          secretAnswerTwo: '',
          secretQuestionThree: '',
          secretAnswerThree: '',
        }}
        onSubmit={async values => {
          const myObject: { [key: string]: string } = {};
          myObject[`${values.secretQuestionOne}`] =
            values.secretAnswerOne?.trim();
          myObject[`${values.secretQuestionTwo}`] =
            values.secretAnswerTwo?.trim();
          myObject[`${values.secretQuestionThree}`] =
            values.secretAnswerThree?.trim();
          setTxnData(myObject);
          setTxn(true);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          errors,
          isValid,
          touched,
          dirty,
        }) => (
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              <Select
                value={questionOne}
                onChange={value => {
                  handleOnChangeOne(value as string);
                  setFieldValue('secretQuestionOne', value);
                }}
                data={questions}
                placeholder="Secret Question 1"
                label="Secret Question 1"
                error={touched.secretQuestionOne && errors.secretQuestionOne}
              />
              <Input
                value={values.secretAnswerOne}
                onChangeText={handleChange('secretAnswerOne')}
                onBlur={handleBlur('secretAnswerOne')}
                label="Secret Answer 1"
                placeholder="Secret Answer"
                error={touched.secretAnswerOne && errors.secretAnswerOne}
              />
              <Select
                value={questionTwo}
                onChange={value => {
                  handleOnChangeTwo(value as string);
                  setFieldValue('secretQuestionTwo', value);
                }}
                data={questions}
                placeholder="Secret Question 2"
                label="Secret Question 2"
                error={touched.secretQuestionTwo && errors.secretQuestionTwo}
              />
              <Input
                value={values.secretAnswerTwo}
                onChangeText={handleChange('secretAnswerTwo')}
                onBlur={handleBlur('secretAnswerTwo')}
                label="Secret Answer 2"
                placeholder="Secret Answer"
                error={touched.secretAnswerTwo && errors.secretAnswerTwo}
              />
              <Select
                value={questionThree}
                onChange={value => {
                  handleOnChangeThree(value as string);
                  setFieldValue('secretQuestionThree', value);
                }}
                data={questions}
                placeholder="Secret Question 3"
                label="Secret Question 3"
                error={
                  touched.secretQuestionThree && errors.secretQuestionThree
                }
              />
              <Input
                value={values.secretAnswerThree}
                onChangeText={handleChange('secretAnswerThree')}
                onBlur={handleBlur('secretAnswerThree')}
                label="Secret Answer 3"
                placeholder="Secret Answer"
                error={touched.secretAnswerThree && errors.secretAnswerThree}
              />
            </YStack>

            <XStack
              gap={8}
              style={{
                ...global.flexRowSpace,
                marginTop: 'auto',
                marginBottom: 16,
              }}
            >
              <Button
                flex={1}
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
              >
                Confirm PIN
              </Button>
              <Button
                disabled={p === ''}
                width={50}
                backgroundColor={colors.primary}
                onPress={() => {
                  handleBiometricAuth();
                }}
              >
                <UserFaceScanIcon />
              </Button>
            </XStack>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default SecurityQuestions;
