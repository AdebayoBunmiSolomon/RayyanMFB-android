import { TouchableWithoutFeedback } from 'react-native';
import React, { FC, useState } from 'react';

import { Formik } from 'formik';
import * as yup from 'yup';
import { PublicStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import PageContainer from '../../../components/PageContainer';
import { Text, View, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import HeadingAuth from '../../../components/HeadingAuth';
import Input from '../../../components/Input';
import { useTheme } from '../../../context/ThemeContext';
import { onlyTextRegex } from '../../../util/regex';
const securityValidationSchema = yup.object().shape({
  secretQuestion: yup.string().required('Select a secret question'),
  secretAnswer: yup
    .string()
    .trim()
    .matches(
      onlyTextRegex,
      'Only letters and single spaces between words are allowed',
    )
    .required('Enter the secret answer'),
});

const SecQuestion: FC<PublicStackScreenProps<'SecQuestion'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  const { colors } = useTheme();

  const [details] = useState({
    secretQuestion: item?.data[0],
    secretAnswer: '',
  });

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth title="Forgot Password" subtitle="Security Check" />
      {/* form */}
      <Formik
        validationSchema={securityValidationSchema}
        initialValues={details}
        enableReinitialize={true}
        onSubmit={async values => {
          navigation.navigate('ForgotPasswordOTP', {
            item: { ...values, username: item.username },
          });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          dirty,
          errors,
          isValid,
          touched,
        }) => (
          <View flex={1}>
            <YStack marginTop={32} gap={20}>
              <Input
                placeholder="Secret Question"
                onChangeText={handleChange('secretQuestion')}
                onBlur={handleBlur('secretQuestion')}
                value={values.secretQuestion}
                editable={false}
              />

              <Input
                placeholder="Secret Answer"
                onChangeText={handleChange('secretAnswer')}
                onBlur={handleBlur('secretAnswer')}
                value={values.secretAnswer}
                error={touched.secretAnswer && errors.secretAnswer}
              />

              <XStack marginInline="auto" marginTop={12} gap={4}>
                <Text color={colors.grey04} fontSize={13} fontWeight={'500'}>
                  Can't remember answer?
                </Text>
                <TouchableWithoutFeedback
                  onPress={() =>
                    navigation.navigate('SecurityQuestionReset', {
                      username: item?.username,
                    })
                  }
                >
                  <Text color={colors.primary} fontWeight="500">
                    Click to reset security question
                  </Text>
                </TouchableWithoutFeedback>
              </XStack>
            </YStack>

            {/* bottom elements */}
            <View marginTop="auto" marginBottom={8}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
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

export default SecQuestion;
