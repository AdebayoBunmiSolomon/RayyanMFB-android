import React from 'react';
import { Formik, FormikProps, FormikValues } from 'formik';
import { Text, View, XStack, YStack } from 'tamagui';
import { ActivityIndicator } from 'react-native';
import * as yup from 'yup';
import { global, verticalScale } from '../../theme/metrics';
import { formatToDecimal } from '../../util/format';
import Button from '../Button';
import Input from '../Input';
import Select from '../Select';
import Switch from '../Switch';
import AmountInput from '../AmountInput';
import BeneficiaryScroll from '../BeneficiaryScroll';
import { useTheme } from '../../context/ThemeContext';
import { useErrorHandler } from '../../hooks/useErrorHandler';
import { useAppToast } from '../../hooks/useAppToast';
import { clearFormatAmount } from '../../util/format';
import { Accounts } from '../../types/transfer.types';
import { NARRATION_REGEX, sanitizeNarration } from '../../util/sanitize';

// Types
export interface RayyanTransferFormData {
  id: string;
  preferredName: string;
  institutionName: string;
  accountName: string;
  accountNumber: string;
  customerAccountNumber: string;
  beneficiaryBank: any;
  amount: string;
  narration: string;
  saveBeneficiary: boolean;
}

export interface UserAccount {
  label: string;
  value: string;
  key: number;
}

// Validation Schema
const rayyanValidationSchema = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  accountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed'),
  customerAccountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
  narration: yup
    .string()
    .max(100, 'Narration must not exceed 100 characters')
    .matches(NARRATION_REGEX, {
      message: 'Narration cannot contain emojis or special characters',
      excludeEmptyString: true,
    }),
});

interface RayyanFormProps {
  selectedBeneficiariesHash: RayyanTransferFormData;
  setSelectedBeneficiariesHash: React.Dispatch<
    React.SetStateAction<RayyanTransferFormData>
  >;
  inputText: string | undefined;
  setInputText: React.Dispatch<React.SetStateAction<string | undefined>>;
  userAccounts: UserAccount[];
  contacts: any[];
  intraUsedLeft: any;
  loadingModal: boolean;
  getInterBankUsedLeft: any;
  handleOnChange: (value: string | null) => void;
  handleItemPress: (id: string) => void;
  onPress: (payload: any) => void;
  account?: number;
  accounts: Accounts[];
  formikRef: React.RefObject<FormikProps<FormikValues> | null>;
}

const RayyanForm: React.FC<RayyanFormProps> = ({
  selectedBeneficiariesHash,
  setSelectedBeneficiariesHash,
  inputText,
  setInputText,
  userAccounts,
  contacts,
  intraUsedLeft,
  loadingModal,
  getInterBankUsedLeft,
  handleOnChange,
  handleItemPress,
  onPress,
  account,
  accounts,
  formikRef,
}) => {
  const { colors } = useTheme();
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,
        beneficiaryAccountNumber: values.accountNumber,
        beneficiaryAccountName: selectedBeneficiariesHash.accountName,
        amount: values.amount,
        customerAccountNumber: values.customerAccountNumber,
        remarks: sanitizeNarration(values.narration || ''),
        beneficiaryBank: selectedBeneficiariesHash?.beneficiaryBank,
        beneficiaryBankName: selectedBeneficiariesHash?.institutionName || '',
        saveBeneficiary: values?.saveBeneficiary || false,
      };

      onPress(payload);
    } catch (error) {
      handleError(error as Error, 'Rayyan:onSubmit');
      showError('Failed to process transfer. Please try again.');
    }
  };

  const validateForm = (values: any) => {
    try {
      const errors: any = {};

      if (values?.narration && !NARRATION_REGEX.test(values.narration)) {
        errors.narration =
          'Narration cannot contain emojis or special characters';
      }

      // Validate customer account
      if (!values?.customerAccountNumber) {
        errors.customerAccountNumber = 'Please select an account to debit';
      }

      // Validate beneficiary account
      if (!values?.accountNumber) {
        errors.accountNumber = 'Account number is required';
      } else if (values.accountNumber.length !== 10) {
        errors.accountNumber = 'Account number must be 10 digits';
      }

      // Validate amount
      if (!values?.amount) {
        errors.amount = 'Amount is required';
      } else {
        const clrInputAmount = clearFormatAmount(values.amount);
        if (isNaN(clrInputAmount) || clrInputAmount <= 0) {
          errors.amount = 'Please enter a valid amount';
        } else {
          // Check account balance
          const accountBalance = accounts?.find(
            ({ accountNumber }) =>
              accountNumber === values?.customerAccountNumber,
          );

          if (accountBalance) {
            const { availableBalance, acctBalance } =
              accountBalance as Accounts;
            const clrBalance = availableBalance ?? acctBalance;

            if (+clrInputAmount > +clrBalance) {
              errors.amount = 'Insufficient balance';
            }
          }

          // Check daily limit
          if (clrInputAmount > +(intraUsedLeft?.dailyRemaining ?? 0)) {
            errors.amount = 'Daily limit exceeded';
          }
        }
      }

      // Validate same account numbers
      if (values?.accountNumber === values?.customerAccountNumber) {
        errors.accountNumber =
          'Customer and Beneficiary Account Numbers cannot be the same';
      }

      // Validate account name
      if (
        !selectedBeneficiariesHash?.accountName &&
        values?.accountNumber?.length === 10
      ) {
        errors.accountNumber =
          'Account name verification failed. Please check the account number.';
      }

      return errors;
    } catch (error) {
      handleError(error as Error, 'Rayyan:validate');
      return { general: 'Validation error occurred' };
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      enableReinitialize
      validationSchema={rayyanValidationSchema}
      initialValues={selectedBeneficiariesHash || {}}
      validate={validateForm}
      onSubmit={handleSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        setFieldTouched,
        values,
        errors,
        touched,
        isValid,
        dirty,
      }) => (
        <View flex={1} marginTop={32}>
          <BeneficiaryScroll
            type="transfer"
            contacts={contacts}
            onPress={handleItemPress}
          />

          <YStack marginTop={24} marginBottom={24} gap={20}>
            <Select
              value={values.customerAccountNumber || ''}
              onChange={value => {
                try {
                  handleOnChange(value as string);
                  setFieldValue('customerAccountNumber', value);
                } catch (error) {
                  handleError(error as Error, 'Rayyan:selectAccount');
                  showError('Failed to select account. Please try again.');
                }
              }}
              data={userAccounts || []}
              label="Account to Debit"
              placeholder={'Account to Debit'}
              error={
                touched.customerAccountNumber && errors.customerAccountNumber
              }
            />

            <Input
              label="Account to Credit"
              value={values.accountNumber || ''}
              onChangeText={text => {
                try {
                  handleChange('accountNumber')(text);
                  setInputText(text);
                  setFieldTouched('accountNumber', true, false);
                } catch (error) {
                  handleError(error as Error, 'Rayyan:enterAccountNumber');
                }
              }}
              onBlur={handleBlur('accountNumber')}
              placeholder="Account to Credit"
              maxLength={10}
              error={touched.accountNumber && errors.accountNumber}
              keyboardType={'number-pad'}
            />

            {selectedBeneficiariesHash?.accountName &&
            inputText?.length === 10 ? (
              <View style={{ ...global.flexEnd, marginTop: verticalScale(-5) }}>
                <Text
                  style={{
                    color: colors.grey04,
                  }}
                >
                  {selectedBeneficiariesHash?.accountName}
                </Text>
              </View>
            ) : null}

            <AmountInput
              placeholder="Amount"
              keyboardType={'number-pad'}
              onChangeText={value => {
                try {
                  setFieldValue('amount', value);
                  setFieldTouched('amount', true, false);
                } catch (error) {
                  handleError(error as Error, 'Rayyan:enterAmount');
                }
              }}
              onBlur={handleBlur('amount')}
              error={touched.amount && errors.amount}
              value={values.amount || ''}
              label="Amount"
              helperText={
                getInterBankUsedLeft?.loading ? (
                  <ActivityIndicator />
                ) : (
                  `₦${formatToDecimal(
                    intraUsedLeft?.dailyRemaining || 0,
                  )} Daily Limit Left`
                )
              }
            />

            <Input
              label="Narration"
              value={values.narration || ''}
              onChangeText={text => {
                try {
                  const sanitized = sanitizeNarration(text);
                  console.log('RAYYAN raw:', JSON.stringify(text));
                  console.log('RAYYAN sanitized:', JSON.stringify(sanitized));
                  handleChange('narration')(sanitized);
                } catch (error) {
                  handleError(error as Error, 'Rayyan:enterNarration');
                }
              }}
              placeholder="Narration"
              onBlur={handleBlur('narration')}
              error={touched.narration && errors.narration}
            />

            <XStack
              alignItems="center"
              justifyContent="space-between"
              marginTop={4}
              marginBottom={24}
            >
              <Text
                color={colors.grey05}
                fontSize={14}
                fontFamily="Inter-Medium"
              >
                Save Beneficiary
              </Text>
              <Switch
                value={values?.saveBeneficiary || false}
                onValueChange={(newValue: boolean) => {
                  try {
                    setFieldValue('saveBeneficiary', newValue);
                  } catch (error) {
                    handleError(error as Error, 'Rayyan:toggleSaveBeneficiary');
                  }
                }}
              />
            </XStack>
          </YStack>

          <View flexDirection="row" marginTop="auto" marginBottom={16}>
            <Button
              onPress={() => {
                try {
                  handleSubmit();
                } catch (error) {
                  handleError(error as Error, 'Rayyan:submitForm');
                  showError('Failed to submit transfer. Please try again.');
                }
              }}
              disabled={
                !(isValid && dirty) ||
                selectedBeneficiariesHash?.accountName === '' ||
                loadingModal
              }
              width={'100%'}
              loading={loadingModal}
            >
              Proceed
            </Button>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default RayyanForm;
