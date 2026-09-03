/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import { global, colors } from '../../../theme/metrics';
import { Formik, FormikValues } from 'formik';
import Button from '../../../components/Button';
import SuccessModal from '../../../components/modals/SuccessModal';
import PinModal from '../../../components/modals/PinModal';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setDebitAccounts } from '../../../slices/transferSlice';
import {
  clearFormatAmount,
  formatToDecimal,
  formatToNaira,
} from '../../../util/format';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import Input from '../../../components/Input';
import { useApi } from '../../../hooks/useApi';
import { IS_RETAIL } from '../../../../config';
import AmountInput from '../../../components/AmountInput';
import Select from '../../../components/Select';
import { limitValidationSchema } from '../../../schema';
import UserFaceScanIcon from '../../../assets/svg/User_scan_duotone.svg';
import { GET_P, SAVE_P } from '../../../services/storage';
import runBiometricAuth from '../../../services/biometricAuth';
import { useAppToast } from '../../../hooks/useAppToast';

const CHANNEL_OPTIONS = [
  { label: 'NIP (Interbank)', value: 'INTER_BANK_TRANSFER', key: 'NIP' },
  {
    label: 'Intra-bank (Rayyan)',
    value: 'WITHIN_BANK_TRANSFER',
    key: 'INTRABANK',
  },
];

const SetTransactionLimit: FC<MainStackScreenProps<'SetTransactionLimit'>> = ({
  navigation,
}) => {
  const dispatch = useAppDispatch();
  const { accounts } = useAppSelector(state => state.transfer);
  const { showSuccess, showError } = useAppToast();

  const [modal, setModal] = useState(false);
  const [txn, setTxn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinValue, setPinValue] = useState('');

  const [limits, setLimits] = useState({
    nip: undefined,
    intraBank: undefined,
    intraBankCap: undefined,
    nipCap: undefined,
    customerAccountNumber: '',
    newLimit: '',
    singleCap: '',
    newSingleCap: '',
    channel: '',
  });
  const [userAccounts, setUserAccounts] = useState<
    { label: string; value: string; key: number }[]
  >([]);

  const debitAccountApi = useApi({
    endpoint: 'getDebitAccounts',
  });
  const getLimitApi = useApi({ endpoint: 'getInterBankUsedLeft' });
  const updateLimitApi = useApi({
    endpoint: 'updateDailyLimit',
    onSuccess: () => {
      showSuccess('Success', 'Transaction limit updated successfully.');
    },
    onError: (_error, _errorDetails) => {
      showError(
        String(_errorDetails?.code),
        _errorDetails?.message || 'Failed to update transaction limit.',
      );
    },
  });

  const fetchDebitAccounts = async () => {
    setLoading(true);
    const res = await debitAccountApi?.requestInit();
    if (res?.data?.code === '00') {
      dispatch(setDebitAccounts(res?.data));
    }
    setLoading(false);
  };

  const fetchLimit = async (
    channel: 'WITHIN_BANK_TRANSFER' | 'INTER_BANK_TRANSFER',
  ) => {
    if (!accounts.length) return;
    setLoading(true);

    const newReqUrl = `/v1/transfer/limits?customerType=${
      IS_RETAIL ? 'RETAIL' : 'CORPORATE'
    }&accountNumber=${accounts[0]?.accountNumber}&channel=${channel}`;

    const res = await getLimitApi.requestInit(undefined, newReqUrl);
    if (res?.data) {
      const amount = res?.data?.dailyCap;
      const singleCap = res?.data?.singleTransactionCap;

      const formatted = formatToDecimal(Number(amount));
      setLimits(prev => ({
        ...prev,
        [channel === 'WITHIN_BANK_TRANSFER' ? 'intraBank' : 'nip']: formatted,
        [channel === 'WITHIN_BANK_TRANSFER' ? 'intraBankCap' : 'nipCap']:
          formatToDecimal(Number(singleCap)),
      }));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDebitAccounts();
    fetchLimit('WITHIN_BANK_TRANSFER');
    fetchLimit('INTER_BANK_TRANSFER');
  }, []);

  useEffect(() => {
    setUserAccounts(
      accounts.map(
        ({ accountNumber, availableBalance, acctBalance }, index) => ({
          label: `${accountNumber} - ${formatToNaira(
            availableBalance ?? acctBalance,
          )}`,
          value: accountNumber,
          key: index,
        }),
      ),
    );
  }, [accounts]);

  // useEffect(() => {
  //   (async () => {
  //     const res = await GET_P();
  //     if (res) {
  //       setPinValue(res);
  //     }
  //   })();
  // }, []);

  const handleFormSubmit = () => {
    setTxn(true);
  };

  const onPinSubmit = async (pin: string, values: typeof limits) => {
    setPinValue(pin);
    setTxn(false);
    setLoading(true);
    SAVE_P(pin);

    try {
      let payload = {
        acctNumber: values?.customerAccountNumber,
        newLimit: values.newLimit,
        channel: values?.channel,
        pin,
      };

      if (payload) {
        const newReqUrl = `/v1/transfer/limit/daily?accountNumber=${
          payload?.acctNumber
        }&channel=${payload?.channel}&dailyLimit=${clearFormatAmount(
          payload?.newLimit,
        )}${
          values?.newSingleCap
            ? `&singleCap=${clearFormatAmount(values?.newSingleCap)}`
            : ''
        }`;

        const res = await updateLimitApi.requestInit(undefined, newReqUrl);
        if (res?.data?.code === '00') {
          setModal(true);
        }
      }
    } catch (error) {
    } finally {
      setPinValue('');
      setLoading(false);
    }
  };

  const handleBiometricAuth = async (values: FormikValues) => {
    if (!pinValue?.length) return;
    await runBiometricAuth(async () => {
      onPinSubmit(pinValue, values as any);
    });
  };

  return (
    <PageContainer>
      {modal && (
        <SuccessModal
          isVisible={modal}
          closeModal={() => setModal(false)}
          title={`Transaction Limit Changed Successfully`}
          onBackdropPress={() => setModal(false)}
          onBackButtonPress={() => setModal(false)}
          onSwipeComplete={() => setModal(false)}
          onPress={() => navigation.navigate('Tabs')}
        />
      )}

      {loading && (
        <LoadingModal isVisible={loading} onBackdropPress={() => {}} />
      )}

      <HeaderAuth headerTitle="Adjust Current Limit" noLogo />

      <Formik
        validationSchema={limitValidationSchema}
        initialValues={limits}
        onSubmit={handleFormSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          touched,
          errors,
          dirty,
          isValid,
        }) => (
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              <Select
                label="Debit Account"
                data={userAccounts}
                value={values.customerAccountNumber}
                onChange={v => {
                  setFieldValue('customerAccountNumber', v);
                }}
                placeholder={'Debit Account'}
                onBlur={handleBlur('customerAccountNumber')}
                error={
                  touched.customerAccountNumber && errors.customerAccountNumber
                }
              />
              <Select
                label="Transfer Type"
                data={CHANNEL_OPTIONS}
                value={values.channel}
                onChange={v => {
                  setFieldValue('channel', v);
                }}
                placeholder={'Transfer Type'}
                onBlur={handleBlur('channel')}
                error={touched.channel && errors.channel}
              />
              {values?.channel && (
                <>
                  {/* Interbank Section */}
                  <View
                    borderBottomWidth={1}
                    paddingBlock={16}
                    marginBottom={8}
                    borderColor="#ECECEC"
                  >
                    <Text style={styles.tileText}>
                      {values?.channel === 'INTER_BANK_TRANSFER'
                        ? 'NIP (Interbank) Transfer Limit'
                        : 'Intra-bank Transfer Limit'}
                    </Text>
                  </View>

                  <Input
                    label={`Current Daily ${
                      values.channel === 'INTER_BANK_TRANSFER'
                        ? 'NIP'
                        : 'Intra-bank'
                    } Transfer Limit`}
                    placeholder="Amount"
                    loading={
                      !(values.channel === 'INTER_BANK_TRANSFER'
                        ? limits?.nip
                        : limits?.intraBank)
                    }
                    keyboardType="number-pad"
                    value={
                      values.channel === 'INTER_BANK_TRANSFER'
                        ? limits?.nip
                        : limits?.intraBank
                    }
                    editable={false}
                  />

                  <AmountInput
                    label={`New Daily ${
                      values?.channel === 'INTER_BANK_TRANSFER'
                        ? 'NIP Transfer Limit'
                        : 'Intra-bank Transfer Limit'
                    }`}
                    placeholder="Amount"
                    keyboardType="number-pad"
                    value={values.newLimit}
                    onChangeText={handleChange('newLimit')}
                    onBlur={handleBlur('newLimit')}
                    error={touched.newLimit && errors.newLimit}
                  />
                  <AmountInput
                    label={'Current single Transaction Cap'}
                    placeholder="Amount"
                    value={
                      values.channel === 'INTER_BANK_TRANSFER'
                        ? limits?.nipCap
                        : limits?.intraBankCap
                    }
                    editable={false}
                    loading={
                      !(values.channel === 'INTER_BANK_TRANSFER'
                        ? limits?.nipCap
                        : limits?.intraBankCap)
                    }
                  />
                  <AmountInput
                    label={'New single Transaction Cap'}
                    placeholder="Amount"
                    keyboardType="number-pad"
                    value={values.newSingleCap}
                    onChangeText={handleChange('newSingleCap')}
                    onBlur={handleBlur('newSingleCap')}
                    error={touched.newSingleCap && errors.newSingleCap}
                  />
                </>
              )}
            </YStack>

            <XStack
              gap={16}
              style={{
                ...global.flexRowSpace,
                marginTop: 'auto',
                marginBottom: 16,
              }}
            >
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                flex={1}
              >
                Update Limit
              </Button>
              {IS_RETAIL && pinValue && (
                <Button
                  width={50}
                  backgroundColor={colors.primary}
                  onPress={() => {
                    handleBiometricAuth(values);
                  }}
                  disabled={!(isValid && dirty)}
                >
                  <UserFaceScanIcon />
                </Button>
              )}
            </XStack>

            <PinModal
              isVisible={txn}
              onBackdropPress={() => setTxn(false)}
              value={pinValue}
              setValue={val => {
                if (val.length === 4) {
                  onPinSubmit(val, values);
                } else {
                  setPinValue(val);
                }
              }}
              onBackButtonPress={() => () => setTxn(false)}
            />
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default SetTransactionLimit;

const styles = StyleSheet.create({
  tileText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    fontWeight: '500',
    color: colors.semiLightTextColor,
  },
});
