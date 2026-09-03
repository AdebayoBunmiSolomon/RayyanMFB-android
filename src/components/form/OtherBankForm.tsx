import React from 'react';
import { View, Text, YStack, XStack } from 'tamagui';
import { Formik, FormikValues } from 'formik';
import Input from '../Input';
import AmountInput from '../AmountInput';
import Select from '../Select';
import Switch from '../Switch';
import Button from '../Button';
import BeneficiaryScroll, { BeneficiaryTypes } from '../BeneficiaryScroll';
import { otherBankSchema } from '../../schema';
import { formatToDecimal, clearFormatAmount } from '../../util/format';
import {
  Banks,
  OtherBankLoading,
  UsedLeftResponse,
} from '../../types/transfer.types';
import { verticalScale, global } from '../../theme/metrics';
import otherBankStyles from '../../styles/otherBanks';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../hooks/hook';
import { ActivityIndicator } from 'react-native';

interface Props {
  contacts: BeneficiaryTypes[];
  userAccounts: { label: string; value: string; key: number }[];
  bankList: { label: string; value: string; key: number }[];
  selectedBankObj?: Banks;
  accountName?: string;
  inputText: string;
  setInputText: (val: string) => void;
  formikRef: any;
  onPress: (values: any) => void;
  interUsedLeft: UsedLeftResponse;
  updateBankInfo: (code: string | null) => void;
  handleItemPress: (id: string) => void;
  getAccBalance: (id: string) => void;
  selectedBeneficiariesHash: FormikValues;
  loading: OtherBankLoading;
}

const OtherBankForm: React.FC<Props> = ({
  contacts,
  userAccounts,
  bankList,
  selectedBankObj,
  accountName,
  inputText,
  setInputText,
  formikRef,
  onPress,
  interUsedLeft,
  updateBankInfo,
  handleItemPress,
  selectedBeneficiariesHash,
  getAccBalance,
  loading,
}) => {
  const { colors } = useTheme();
  const { styles } = otherBankStyles(colors);
  const { accounts } = useAppSelector(state => state.transfer);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={selectedBeneficiariesHash}
      validationSchema={otherBankSchema}
      validateOnChange
      enableReinitialize
      validate={values => {
        const errors: Record<string, string> = {};
        const { customerAccountNumber } = values;

        const selectedAcc = accounts?.find(
          ({ accountNumber }) => accountNumber === customerAccountNumber,
        );
        const accBalance = Number(
          selectedAcc?.availableBalance ?? selectedAcc?.acctBalance,
        );

        const clrInputAmount = Number(clearFormatAmount(values.amount));

        if (clrInputAmount > +(interUsedLeft?.dailyRemaining ?? 0)) {
          errors.amount = `Daily limit exceeded.`;
        }
        if (clrInputAmount > accBalance) {
          errors.amount = 'Insufficient balance';
        }
        if (values.accountNumber === values.customerAccountNumber) {
          errors.accountNumber = 'Cannot send to self';
        }
        return errors;
      }}
      onSubmit={values => {
        const payload = {
          beneficiaryAccountNumber: values.accountNumber,
          beneficiaryAccountName: accountName ?? values.accountName,
          amount: values.amount,
          customerAccountNumber: values.customerAccountNumber,
          remarks: values.narration,
          beneficiaryBank: values.institutionCode,
          beneficiaryBankName:
            selectedBankObj?.institutionName ?? values.institutionName,
          saveBeneficiary: values?.saveBeneficiary,
        };
        onPress(payload);
      }}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        handleBlur,
        touched,
        errors,
        values,
        isValid,
        dirty,
      }) => {
        console.log('first log', {
          dirty,
          isValid,
          accountName,
          values,
          errors,
        });
        console.log('second log', {
          dirty,
          isValid,
          accountName,
          valuesAccountName: values.accountName,
        });
        return (
          <View marginTop={32} flex={1}>
            {!!contacts?.length && (
              <BeneficiaryScroll
                type="transfer"
                contacts={contacts}
                onPress={handleItemPress}
              />
            )}
            <YStack gap={20}>
              <Select
                label="Account to Debit"
                data={userAccounts}
                value={values.customerAccountNumber}
                onChange={v => {
                  setFieldValue('customerAccountNumber', v);
                  getAccBalance(v);
                }}
                loading={loading.debitAccounts}
                placeholder={'Account to Debit'}
                onBlur={handleBlur('customerAccountNumber')}
                error={
                  touched.customerAccountNumber && errors.customerAccountNumber
                }
              />
              <Select
                loading={loading.bankList}
                label="Beneficiary Bank Name"
                placeholder={'Bank Name'}
                data={bankList}
                value={values.institutionCode}
                onChange={(v: any) => {
                  setFieldValue('institutionCode', v);
                  updateBankInfo(v);
                }}
                onBlur={handleBlur('institutionCode')}
                error={touched.institutionCode && errors.institutionCode}
              />
              <Input
                label="Beneficiary account number"
                placeholder="Account number"
                value={values.accountNumber}
                onChangeText={v => {
                  setFieldValue('accountNumber', v);
                  setFieldTouched('accountNumber', true, false);
                  setInputText(v);
                }}
                onBlur={handleBlur('accountNumber')}
                keyboardType="number-pad"
                maxLength={10}
                error={touched.accountNumber && errors.accountNumber}
              />
              {loading?.nameEnquiry ? (
                <ActivityIndicator />
              ) : accountName && inputText.length === 10 ? (
                <View
                  style={{ ...global.flexEnd, marginTop: verticalScale(-5) }}
                >
                  <Text
                    style={{
                      ...styles.accountName,
                      color: colors.grey05,
                    }}
                  >
                    {accountName}
                  </Text>
                </View>
              ) : null}
              <AmountInput
                label="Amount"
                placeholder="Amount"
                keyboardType={'number-pad'}
                value={values.amount}
                onChangeText={v => {
                  setFieldValue('amount', v);
                  setFieldTouched('amount', true, false);
                }}
                onBlur={handleBlur('amount')}
                error={touched.amount && errors.amount}
                helperText={
                  loading.usedLeft ? (
                    <ActivityIndicator />
                  ) : (
                    `₦${formatToDecimal(
                      interUsedLeft?.dailyRemaining,
                    )} Daily Limit Left`
                  )
                }
              />
              <Input
                label="Narration"
                value={values.narration}
                onChangeText={handleChange('narration')}
                placeholder="Description"
              />
              <XStack justifyContent="space-between">
                <Text
                  color={colors.grey05}
                  fontSize={14}
                  fontFamily="Inter-Medium"
                >
                  Save Beneficiary
                </Text>
                <Switch
                  value={values.saveBeneficiary}
                  onValueChange={(val: string) =>
                    setFieldValue('saveBeneficiary', val)
                  }
                />
              </XStack>
            </YStack>
            <View marginVertical={24}>
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty) || !accountName}
              >
                Proceed
              </Button>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

export default OtherBankForm;
