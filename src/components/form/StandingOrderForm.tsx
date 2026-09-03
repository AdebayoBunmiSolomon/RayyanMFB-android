import React from 'react';
import { View, Text, YStack, XStack } from 'tamagui';
import { Formik, FormikValues } from 'formik';
import Input from '../Input';
import AmountInput from '../AmountInput';
import Select from '../Select';
// import Switch from '../Switch';
import Button from '../Button';
import BeneficiaryScroll, { BeneficiaryTypes } from '../BeneficiaryScroll';
import { standingOrderSchema } from '../../schema';
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
import { SelectOption } from '../../types';
import MaskedDateSelect from '../MaskedDateSelect';
import moment from 'moment';

const freqOptions: SelectOption[] = [
  {
    key: 1,
    label: 'Daily',
    value: 'Daily',
  },
  {
    key: 2,
    label: 'Weekly',
    value: 'Weekly',
  },
  {
    key: 3,
    label: 'Monthly',
    value: 'Monthly',
  },
];

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
  creating?: boolean;
}

export type CreateStandingOrderType = {
  debitAccount: string;
  amount: number;
  intervalDays: number;
  start: string;
  end: string;
  benAccountNumber: string;
  bankCode: string;
  benAccountName: string;
  narration: string;
  transactionPin: string;
};

const getMaxEndDate = (
  frequency: string,
  startDate: string,
): moment.Moment | null => {
  if (!frequency || !startDate) return null;
  const start = moment(startDate, 'DD-MM-YYYY');
  if (!start.isValid()) return null;
  const durationMap: Record<string, moment.Duration> = {
    Daily: moment.duration(1, 'day'),
    Weekly: moment.duration(7, 'days'),
    Monthly: moment.duration(1, 'month'),
  };
  return durationMap[frequency]
    ? start.clone().add(durationMap[frequency])
    : null;
};

const snapToValidEnd = (
  rawDate: string,
  frequency: string,
  startDate: string,
): { snappedDate: string; intervalDays: number } => {
  const start = moment(startDate, 'DD-MM-YYYY');
  const picked = moment(rawDate, 'DD-MM-YYYY');

  if (!start.isValid() || !picked.isValid()) {
    return {
      snappedDate: startDate,
      intervalDays: frequency === 'Monthly' ? 30 : 7,
    };
  }

  if (frequency === 'Daily') {
    // Clamp between 1 and 6 days from start (never reach a full week)
    const diffDays = picked.diff(start, 'days');
    const clamped = Math.min(6, Math.max(1, diffDays));
    const snapped = start.clone().add(clamped, 'days');
    return {
      snappedDate: snapped.format('DD-MM-YYYY'),
      intervalDays: clamped,
    };
  }

  if (frequency === 'Weekly') {
    const diffDays = picked.diff(start, 'days');
    const weeks = Math.max(1, Math.round(diffDays / 7));
    const snapped = start.clone().add(weeks * 7, 'days');
    return {
      snappedDate: snapped.format('DD-MM-YYYY'),
      intervalDays: weeks * 7,
    };
  }

  if (frequency === 'Monthly') {
    const diffMonths = picked.diff(start, 'months');
    const months = Math.max(1, Math.round(diffMonths));
    const snapped = start.clone().add(months, 'months');
    return {
      snappedDate: snapped.format('DD-MM-YYYY'),
      intervalDays: months * 30,
    };
  }

  return { snappedDate: rawDate, intervalDays: 1 };
};

const StandingOrderForm: React.FC<Props> = ({
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
  creating,
}) => {
  const { colors } = useTheme();
  const { styles } = otherBankStyles(colors);
  const { accounts } = useAppSelector(state => state.transfer);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={selectedBeneficiariesHash}
      validationSchema={standingOrderSchema}
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

        if (inputText.length === 10 && !accountName) {
          errors.accountNumber = 'Account name could not be resolved';
        }

        return errors;
      }}
      onSubmit={values => {
        const payload = {
          sourceAcct: values.customerAccountNumber,
          beneficiaryAccountNumber: values.accountNumber,
          beneficiaryAccountName: accountName ?? values.accountName,
          amount: values.amount,
          intervalDays: values?.intervalDays,
          frequency: values?.frequency,
          startDate: values?.startDate,
          endDate: values.endDate,
          narration: values.narration,
          institutionCode: values.institutionCode,
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
      }) => (
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
                getAccBalance(v as string);
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
              <View style={{ ...global.flexEnd, marginTop: verticalScale(-5) }}>
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
            <Select
              label="Frequency"
              data={freqOptions}
              value={values.frequency}
              // onChange={v => {
              //   setFieldValue('frequency', v);

              //   // calculate intervalDays based on frequency
              //   const intervalMap: Record<string, number> = {
              //     Daily: 1,
              //     Weekly: 7,
              //     Monthly: 30,
              //   };
              //   setFieldValue('intervalDays', intervalMap[v as string] ?? 1);

              //   // existing date auto-fill logic
              //   const today = moment();
              //   let endDate = moment();

              //   if (v === 'Daily') {
              //     endDate = today.clone().add(1, 'day');
              //   } else if (v === 'Weekly') {
              //     endDate = today.clone().add(7, 'days');
              //   } else if (v === 'Monthly') {
              //     endDate = today.clone().add(1, 'month');
              //   }

              //   setFieldValue('startDate', today.format('DD-MM-YYYY'));
              //   setFieldValue('endDate', endDate.format('DD-MM-YYYY'));
              //   setFieldTouched('startDate', true, false);
              //   setFieldTouched('endDate', true, false);
              // }}

              onChange={v => {
                setFieldValue('frequency', v);

                const today = moment();
                let endDate = moment();

                if (v === 'Daily') {
                  endDate = today.clone().add(1, 'day');
                } else if (v === 'Weekly') {
                  endDate = today.clone().add(7, 'days');
                } else if (v === 'Monthly') {
                  endDate = today.clone().add(1, 'month');
                }

                // intervalDays from actual date diff, not fixed map
                const intervalDays = endDate.diff(today, 'days');

                setFieldValue('intervalDays', intervalDays);
                setFieldValue('startDate', today.format('DD-MM-YYYY'));
                setFieldValue('endDate', endDate.format('DD-MM-YYYY'));
                setFieldTouched('startDate', true, false);
                setFieldTouched('endDate', true, false);
              }}
              placeholder={'Frequency'}
              onBlur={handleBlur('frequency')}
              error={touched.frequency && errors.frequency}
            />
            <Input
              label="Narration"
              value={values.narration}
              onChangeText={handleChange('narration')}
              placeholder="Description"
            />
            <XStack justifyContent="space-between">
              <MaskedDateSelect
                label="Start Date"
                value={values.startDate}
                placeholder="DD-MM-YYYY"
                width={'47%'}
                // onValueChange={itemValue => {
                //   const selected = moment(itemValue).startOf('day');
                //   const today = moment().startOf('day');

                //   // clamp: not before today
                //   const clamped = selected.isBefore(today) ? today : selected;
                //   const formatted = clamped.format('DD-MM-YYYY');

                //   setFieldValue('startDate', formatted);
                //   setFieldTouched('startDate', true, false);

                //   // if frequency is set, auto-recalculate end date
                //   if (values.frequency) {
                //     const maxEnd = getMaxEndDate(values.frequency, formatted);
                //     if (maxEnd) {
                //       setFieldValue('endDate', maxEnd.format('DD-MM-YYYY'));
                //       setFieldTouched('endDate', true, false);
                //     }
                //   }
                // }}
                onValueChange={itemValue => {
                  const selected = moment(itemValue).startOf('day');
                  const today = moment().startOf('day');

                  const clamped = selected.isBefore(today) ? today : selected;
                  const formatted = clamped.format('DD-MM-YYYY');

                  setFieldValue('startDate', formatted);
                  setFieldTouched('startDate', true, false);

                  if (values.frequency) {
                    const maxEnd = getMaxEndDate(values.frequency, formatted);
                    if (maxEnd) {
                      const intervalDays = maxEnd.diff(clamped, 'days');
                      setFieldValue('endDate', maxEnd.format('DD-MM-YYYY'));
                      setFieldValue('intervalDays', intervalDays);
                      setFieldTouched('endDate', true, false);
                    }
                  }
                }}
              />
              <MaskedDateSelect
                label="End Date"
                value={values.endDate}
                placeholder="DD-MM-YYYY"
                width={'47%'}
                // Lock it for Daily; unlock for Weekly & Monthly
                disabled={!values.frequency} // only disabled when no frequency selected at all
                onValueChange={itemValue => {
                  if (!values.frequency) return;

                  const raw = moment(itemValue).format('DD-MM-YYYY');
                  const { snappedDate, intervalDays } = snapToValidEnd(
                    raw,
                    values.frequency,
                    values.startDate,
                  );

                  setFieldValue('endDate', snappedDate);
                  setFieldValue('intervalDays', intervalDays);
                  setFieldTouched('endDate', true, false);
                }}
              />
            </XStack>
          </YStack>
          <View marginVertical={24}>
            <Button
              onPress={() => handleSubmit()}
              disabled={!(isValid && dirty) || !accountName}
              loading={creating}
            >
              Create Standing Order
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default StandingOrderForm;
