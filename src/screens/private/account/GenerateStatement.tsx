import { View } from 'react-native';
import React, { FC, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { useAppSelector } from '../../../hooks/hook';
import { Formik } from 'formik';
import * as yup from 'yup';
import Button from '../../../components/Button';
import MaskedDateSelect from '../../../components/MaskedDateSelect';
import Moment from 'moment';
import {
  EmailStatementParams,
  GenerateParams,
} from '../../../types/transactions.types';
import SuccessModal from '../../../components/modals/SuccessModal';
import { convertBase64ToPdf } from '../../../services/base64ToPdf';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import DashboardSlides from '../../../components/DashboardSlides';
import Input from '../../../components/Input';
import { Text, XStack, YStack } from 'tamagui';
import Switch from '../../../components/Switch';
import { useTheme } from '../../../context/ThemeContext';

const statementValidationSchema = yup.object().shape({
  fromDate: yup.string().required('Start date is required'),
  toDate: yup.string().required('End date is required'),
  esign: yup.boolean(),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email address is required'),
  // .required('Email is required'),
});

const GenerateStatement: FC<MainStackScreenProps<'GenerateStatement'>> = ({
  navigation,
}) => {
  const genAccount = useApi({ endpoint: 'generateStatement' });
  const sendStatementViaEmail = useApi({ endpoint: 'sendStatementViaEmail' });

  const { accounts } = useAppSelector(state => state.account);

  const [activeSlide, setActiveSlide] = useState(0);

  const [loading, setLoading] = useState(false);

  const [successModal, setSuccessModal] = useState(false);

  const { colors } = useTheme();

  const generateStatement = async (val: GenerateParams) => {
    setLoading(true);
    try {
      const url = `/v1/account/statements/data?acctNumber=${val.acctNum}&fromDate=${val.fromDate}&toDate=${val.toDate}&tranType=${val.tranType}&format=${val.format}`;
      const res = await genAccount.requestInit(undefined, url);

      if (res?.data?.fileContent) {
        await convertBase64ToPdf(res?.data?.fileContent, res?.data?.fileName);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const sendEmailStatement = async (val: EmailStatementParams) => {
    setLoading(true);
    try {
      const res = await sendStatementViaEmail.requestInit(val);
      if (res?.data === null || res?.data === '') {
        setSuccessModal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      {successModal && (
        <SuccessModal
          title="Statement Request Successful"
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(false)}
          onBackButtonPress={() => setSuccessModal(false)}
          onSwipeComplete={() => setSuccessModal(false)}
          closeModal={() => setSuccessModal(false)}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          message={'Your requested statement has been processed successfully.'}
        />
      )}
      <HeaderAuth headerTitle="Generate Statement" noLogo />

      {accounts?.length ? (
        <View style={{ width: '100%', marginTop: 14 }}>
          <DashboardSlides
            views={accounts}
            activeSlide={activeSlide}
            setActiveSlide={slide => setActiveSlide(slide)}
            noActions
          />
        </View>
      ) : null}

      <Formik
        validationSchema={statementValidationSchema}
        initialValues={{
          fromDate: '',
          toDate: '',
          email: '',
          esign: '',
        }}
        onSubmit={async values => {
          // const isGreater =
          //   Moment(values.toDate, 'DD-MM-YYYY').diff(
          //     Moment(values.fromDate, 'DD-MM-YYYY'),
          //     'months',
          //   ) > 2;
          // const payload = {
          //   ...values,
          //   acctNum: accounts[0]?.accountNumber,
          //   tranType: 'B',
          //   format: 'PDF',
          // };

          // if (isGreater) {
          const payload = {
            ...values,
            acctNum: accounts[0]?.accountNumber,
            tranType: 'B',
            format: 'PDF',
            email: values.email,
          };
          await sendEmailStatement(payload);
          // } else {
          //   await generateStatement(payload);
          // }
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
          <>
            <YStack marginTop={32} gap={20}>
              <MaskedDateSelect
                label="From Date"
                placeholder="Start Date"
                width={'100%'}
                error={touched.fromDate && errors.fromDate}
                onValueChange={itemValue => {
                  setFieldValue(
                    'fromDate',
                    Moment(itemValue).format('DD-MM-YYYY'),
                  );
                }}
                value={String(values?.fromDate)}
              />

              <MaskedDateSelect
                label="To Date"
                placeholder="End Date"
                width={'100%'}
                error={touched.toDate && errors.toDate}
                onValueChange={itemValue => {
                  setFieldValue(
                    'toDate',
                    Moment(itemValue).format('DD-MM-YYYY'),
                  );
                }}
                value={String(values?.toDate)}
              />

              <Input
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                label="Email Address"
                placeholder="Email address"
                error={touched.email && errors.email}
              />

              <XStack
                alignItems="center"
                justifyContent="space-between"
                marginTop={4}
              >
                <Text
                  color={colors.grey05}
                  fontSize={14}
                  fontFamily="Inter-Medium"
                >
                  e-Signed Statement
                </Text>
                <Switch
                  value={values?.esign}
                  onValueChange={newValue => setFieldValue('esign', newValue)}
                />
              </XStack>
            </YStack>

            <Button
              marginTop="auto"
              marginBottom={24}
              onPress={() => handleSubmit()}
              // disabled={!isValid || values.fromDate > values.toDate}
              disabled={!(isValid && dirty) || values.fromDate > values.toDate}
              width={'100%'}
              loading={loading}
            >
              Submit
            </Button>
          </>
        )}
      </Formik>
    </PageContainer>
  );
};

export default GenerateStatement;
