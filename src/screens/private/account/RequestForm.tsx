/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import { Formik } from 'formik';
import Button from '../../../components/Button';

import HeaderAuth from '../../../components/HeaderAuth';
import Select from '../../../components/SelectOption';
import { View, YStack } from 'tamagui';
import HeadingAuth from '../../../components/HeadingAuth';
import { useApi } from '../../../hooks/useApi';
import { RequestFieldTypes, SelectOption } from '../../../types';
import capitalizeWords from '../../../util/capitalizeWords';
import generateValidationSchema from '../../../util/generateValidationSchema';
import SuccessModal from '../../../components/modals/SuccessModal';
import Input from '../../../components/Input';
import { useAppSelector } from '../../../hooks/hook';
import { formatToNaira } from '../../../util/format';

const RequestForm = ({ navigation, route }: any) => {
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<RequestFieldTypes[]>([]);
  const [successModal, setSuccessModal] = useState(false);
  const [userAccounts, setUserAccounts] = useState<SelectOption[]>([]);
  // Generate validation schema based on the input fields
  const validationSchema = generateValidationSchema(fieldOptions);

  const newRequestApi = useApi({ endpoint: 'newServiceRequest' });
  const { requestInit } = useApi({ endpoint: 'serviceRequestFields' });
  const { reqId, title } = route.params as { reqId: number; title: string };
  const { accounts } = useAppSelector(state => state.account);

  useEffect(() => {
    if (reqId) {
      try {
        setLoading(true);
        const fetchRequestOptions = async () => {
          const response = await requestInit(
            undefined,
            `/retail/requests/configs/${reqId}`,
          );

          setFieldOptions(response?.data?.fields);
        };
        fetchRequestOptions();
        setLoading(false);
      } catch (error) {
      } finally {
      }
    }
  }, [reqId]);

  const submitNewRequest = async (values: any) => {
    setBtnLoading(true);
    const payload = {
      body: values,
      serviceReqConfigId: reqId,
    };

    try {
      const response = await newRequestApi?.requestInit(payload);
      if (response?.status === 200) {
        setSuccessModal(true);
        setBtnLoading(false);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const userAccountList = accounts.map(
      ({ accountNumber, acctBalance }, index) => ({
        label: `${accountNumber} - ${formatToNaira(+acctBalance)}`,
        value: accountNumber,
        key: index,
      }),
    );
    setUserAccounts(userAccountList);
  }, [accounts]);

  return (
    <PageContainer>
      {successModal && (
        <SuccessModal
          title="Service Request Submitted Successfully!"
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(false)}
          onBackButtonPress={() => setSuccessModal(false)}
          onSwipeComplete={() => setSuccessModal(false)}
          closeModal={() => setSuccessModal(false)}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
        />
      )}

      <LoadingModal isVisible={loading} />

      <HeaderAuth noLogo />

      <HeadingAuth
        swap
        title={capitalizeWords(title)}
        subtitle="Fill Out the Details to Submit Your Request"
      />

      <Formik
        validationSchema={validationSchema}
        initialValues={fieldOptions.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {} as Record<string, string>)}
        onSubmit={submitNewRequest}
      >
        {({
          handleSubmit,
          values,
          errors,
          isValid,
          handleBlur,
          setFieldValue,
          touched,
          dirty,
        }) => (
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              {fieldOptions?.map(({ name, label, data, type }) => {
                const newData = data.split(',').map((item, index) => ({
                  key: index,
                  value: item,
                  label: item,
                }));

                if (type === 'LIST') {
                  return (
                    <Select
                      selected={values[name]}
                      onChange={value => {
                        setFieldValue(name, value);
                      }}
                      data={name === 'ACCOUNT_NUMBER' ? userAccounts : newData}
                      label={capitalizeWords(label)}
                      placeholderLabel={'Select an option'}
                      error={touched[name] && errors[name]}
                    />
                  );
                }
                return (
                  <Input
                    value={values[name]}
                    onChangeText={value => {
                      setFieldValue(name, value);
                    }}
                    label={capitalizeWords(label)}
                    error={touched[name] && errors[name]}
                    onBlur={handleBlur([name])}
                  />
                );
              })}
            </YStack>

            <Button
              loading={btnLoading}
              onPress={() => handleSubmit()}
              disabled={!(isValid && dirty)}
              width={'100%'}
              marginTop="auto"
              marginBottom={16}
            >
              Proceed
            </Button>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default RequestForm;
