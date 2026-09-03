/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Button from '../../../../components/Button';
import SelectPicker from '../../../../components/SelectOption';
import PageContainer from '../../../../components/PageContainer';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../../components/Input';
import { useTheme } from '../../../../context/ThemeContext';
import { useApi } from '../../../../hooks/useApi';
import { onlyTextRegex } from '../../../../util/regex';

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

const Question: FC<PublicStackScreenProps<'Question'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params ?? {};

  const getQuestions = useApi({
    endpoint: 'regSecurityQuestions',
  });

  const { colors } = useTheme();

  const [_, setModal] = useState(true);

  const [questions, setQuestions] = useState<Props[]>([]);

  useEffect(() => {
    const getSecurityQuestions = async () => {
      setModal(true);
      try {
        const res = await getQuestions.requestInit();
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
          setQuestions(qst);
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
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth
        title="Create New Account"
        subtitle="Secure Your Account with Security Questions"
      />
      {/* form */}
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
          navigation.navigate('Username', { item: payload });
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
                data={questions}
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
                data={questions}
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
                data={questions}
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

export default Question;
