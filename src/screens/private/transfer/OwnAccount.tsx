import React, { useEffect, useRef, useState } from 'react';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import { global } from '../../../theme/metrics';
import Button from '../../../components/Button';
import { useAppSelector } from '../../../hooks/hook';
import { ReviewRoute } from '../../../types/navigation.types';
import { clearFormatAmount, formatToNaira } from '../../../util/format';
import Select from '../../../components/Select';
import { View, YStack } from 'tamagui';
import AmountInput from '../../../components/AmountInput';
import { Accounts } from '../../../types/transfer.types';
import { ownValidationSchema } from '../../../schema';

type OwnAccountProps = {
  onPress: (item: ReviewRoute) => void;
  account: string;
};

const OwnAccount: React.FC<OwnAccountProps> = ({ onPress, account }) => {
  const { accounts } = useAppSelector(state => state.transfer);
  const [userAccounts, setUserAccounts] = useState<
    { label: string; value: string; key: number }[]
  >([]);

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  useEffect(() => {
    const accountMap = accounts.map(
      ({ accountNumber, availableBalance, acctBalance }, index) => ({
        label: `${accountNumber} - ${formatToNaira(
          Number(availableBalance ?? acctBalance),
        )}`,
        value: accountNumber,
        key: index,
      }),
    );
    setUserAccounts(accountMap);
  }, [accounts]);

  useEffect(() => {
    if (formikRef.current) {
      formikRef.current.setFieldValue('debitAccount', account);
    }
  }, [account]);

  return (
    <View flex={1}>
      <Formik
        validationSchema={ownValidationSchema}
        innerRef={formikRef}
        initialValues={{
          debitAccount: '',
          creditAccount: '',
          amount: '',
        }}
        enableReinitialize={true}
        validate={values => {
          const errors = {} as any;

          const accountBalance = accounts.find(
            ({ accountNumber }) => +accountNumber === +values?.debitAccount,
          );

          const { availableBalance, acctBalance } = accountBalance as Accounts;

          const clrBalance = availableBalance ?? acctBalance;
          const clrInputAmount = clearFormatAmount(values?.amount);

          // Validate amount
          if (!values.amount) {
            errors.amount = 'Amount is required';
          } else if (clrInputAmount > clrBalance) {
            errors.amount = 'Insufficient balance';
          }

          if (values?.debitAccount === values?.creditAccount) {
            errors.creditAccount =
              'Customer and Beneficiary Account Numbers cannot be the same';
          }

          return errors;
        }}
        onSubmit={async values => {
          const payload = {
            beneficiaryAccountNumber: values.creditAccount,
            beneficiaryAccountName: accounts.find(
              ({ accountNumber }) => accountNumber === values.creditAccount,
            )?.accountName as string,
            amount: values.amount,
            customerAccountNumber: values.debitAccount,
            remarks: 'Intra Bank Transfer',
          };
          onPress(payload as any);
        }}
      >
        {({
          handleBlur,
          handleSubmit,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          isValid,
          touched,
          dirty,
        }) => (
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              <Select
                value={values.debitAccount as string}
                onChange={value => {
                  setFieldValue('debitAccount', value);
                }}
                data={userAccounts}
                label="Account to Debit"
                placeholder={'Account to Debit'}
                error={touched.debitAccount && errors.debitAccount}
              />
              <Select
                value={values.creditAccount as string}
                onChange={value => {
                  setFieldValue('creditAccount', value);
                  setFieldTouched('creditAccount', true, false);
                }}
                data={userAccounts}
                label="Account to Credit"
                placeholder={'Account to Credit'}
                error={touched.creditAccount && errors.creditAccount}
              />

              <AmountInput
                placeholder="Amount"
                keyboardType={'number-pad'}
                value={values.amount}
                onChangeText={value => {
                  setFieldValue('amount', value);
                  setFieldTouched('amount', true, false);
                }}
                onBlur={handleBlur('amount')}
                label="Amount"
                error={touched.amount && errors.amount}
              />
            </YStack>

            <View
              style={{
                ...global.flexRow,
                marginTop: 'auto',
                marginBottom: 16,
              }}
            >
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                loading={false}
              >
                Proceed
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
};

export default OwnAccount;
