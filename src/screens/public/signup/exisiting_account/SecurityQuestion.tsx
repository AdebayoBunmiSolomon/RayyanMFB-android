/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState, useEffect } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import SelectPicker from '../../../../components/SelectOption';
import LoadingModal from '../../../../components/modals/LoadingModal';
import { useApi } from '../../../../hooks/useApi';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../../components/Input';
import { useTheme } from '../../../../context/ThemeContext';
import { onlyTextRegex } from '../../../../util/regex';

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

const SecurityQuestion: FC<PublicStackScreenProps<'SecurityQuestion'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params ?? {};

  const { colors } = useTheme();

  const [questionOne, setQuestionOne] = useState('');
  const [questionTwo, setQuestionTwo] = useState('');
  const [questionThree, setQuestionThree] = useState('');

  const question = useApi({ endpoint: 'regSecurityQuestions' });

  const [modal, setModal] = useState(true);

  const [questions, setQuestions] = useState<Props[]>([]);

  const handleOnChangeOne = (value: string | null) => {
    setQuestionOne(value as string);
  };

  const handleOnChangeTwo = (value: string | null) => {
    setQuestionTwo(value as string);
  };

  const handleOnChangeThree = (value: string | null) => {
    setQuestionThree(value as string);
  };

  useEffect(() => {
    const getSecurityQuestions = async () => {
      setModal(true);
      try {
        const res = await question.requestInit();

        // Check if response contains error data
        if (res?.data && typeof res.data === 'string') {
          if (
            res.data.includes("code='99'") &&
            res.data.includes('error=true')
          ) {
          }
        }

        if (res) {
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
          }
        }
      } catch (error) {
      } finally {
        setModal(false);
      }
    };

    getSecurityQuestions();
  }, []);

  return (
    <PageContainer>
      {modal && (
        <LoadingModal
          isVisible={modal}
          onBackdropPress={() => setModal(true)}
          onBackButtonPress={() => setModal(true)}
        />
      )}

      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="Create New Account"
        subtitle="Secure Your Account with Security Questions"
      />

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
          const payload = {
            ...item,
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
          navigation.navigate('CreateUsername', { item: payload });
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
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <SelectPicker
                label="Secret Question 1"
                selected={questionOne}
                onChange={value => {
                  handleOnChangeOne(value as string);
                  setFieldValue('secretQuestionOne', value);
                }}
                data={questions}
                placeholderLabel="Question"
                error={touched.secretQuestionOne && errors.secretQuestionOne}
              />

              <Input
                label="Secret Answer 1"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswerOne')}
                onBlur={handleBlur('secretAnswerOne')}
                value={values.secretAnswerOne}
                error={touched.secretAnswerOne && errors.secretAnswerOne}
              />

              <SelectPicker
                label="Secret Question 2"
                selected={questionTwo}
                onChange={value => {
                  handleOnChangeTwo(value as string);
                  setFieldValue('secretQuestionTwo', value);
                }}
                data={questions}
                placeholderLabel="Question"
                error={touched.secretQuestionTwo && errors.secretQuestionTwo}
              />

              <Input
                label="Secret Answer 2"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswerTwo')}
                value={values.secretAnswerTwo}
                onBlur={handleBlur('secretAnswerTwo')}
                error={touched.secretAnswerTwo && errors.secretAnswerTwo}
              />

              <SelectPicker
                label="Secret Question 3"
                selected={questionThree}
                onChange={value => {
                  handleOnChangeThree(value as string);
                  setFieldValue('secretQuestionThree', value);
                }}
                data={questions}
                placeholderLabel="Question"
                error={
                  touched.secretQuestionThree && errors.secretQuestionThree
                }
              />

              <Input
                label="Secret Answer 3"
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswerThree')}
                value={values.secretAnswerThree}
                error={touched.secretAnswerThree && errors.secretAnswerThree}
                onBlur={handleBlur('secretAnswerThree')}
              />

              {/* bottom elements */}
              <View marginTop={48} marginBottom={16}>
                <Button
                  onPress={() => handleSubmit()}
                  disabled={!(isValid && dirty)}
                  width={'100%'}
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

              {/* <View
                style={{
                  ...global.flexRow,
                  marginTop: verticalScale(18),
                }}>
                <Button
                  onPress={() => handleSubmit()}
                  disabled={!isValid}
                  width={'100%'}>
                  Proceed
                </Button>
              </View>

              <View
                style={{
                  ...global.flexRow,
                  marginTop: verticalScale(10),
                  marginBottom: verticalScale(60),
                }}>
                <View>
                  <Text style={styles.leftText}>Already Activated?</Text>
                </View>
                <TouchableWithoutFeedback
                  onPress={() => navigation.navigate('Login')}>
                  <Text
                    style={{
                      ...styles.rightText,
                    }}>
                    Sign In
                  </Text>
                </TouchableWithoutFeedback>
              </View> */}
            </YStack>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default SecurityQuestion;
