import * as yup from 'yup';

import { IS_CORPORATE } from '../../config';
import { NARRATION_REGEX } from '../util/sanitize';
import { clearFormatAmount } from '../util/format';

export const loginValidationSchema = yup.object().shape({
  userName: yup.string().required('Username is required'),
  corporateId: IS_CORPORATE
    ? yup.string().required('Corporate ID is required')
    : yup.string().notRequired(),
  passWord: yup
    .string()
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .matches(/\d/, 'Password must have a number')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must have a special character',
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
});

export const confirmUserAccSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  corpID: yup.string().required('Corporate ID is required'),
  email: yup.string().email().required('Email address is required'),
});

export const newPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .matches(/\w*[a-z]\w*/, 'Password must have a small letter')
    .matches(/\w*[A-Z]\w*/, 'Password must have a capital letter')
    .matches(/\d/, 'Password must have a number')
    .matches(
      /[!@#$%^&*()\-_"=+{}; :,<.>]/,
      'Password must have a special character',
    )
    .min(8, ({ min }) => `Password must be at least ${min} characters`)
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords do not match')
    .required('Confirm password is required'),
});

export const accountValidationSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
  lastFourDigitsOfBVN: yup
    .string()
    .min(4, ({ min }) => `Must be at least ${min} characters`)
    .max(4, ({ max }) => `Must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('BVN last four digits is required'),
  username: yup.string().required('Username is required'),
});

export const othersValidationSchema = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  customerId: yup.string().required('Customer ID is required'),
});

export const accountUpgradeSchema = yup.object().shape({
  accountNumber: yup.string().required('Account number is required'),
  ninNumber: yup.string().length(11).required('NIN is required'),
  sourceOfIncome: yup.string().required('Source of income is required'),
  placeOfWork: yup.string().required('Place of work is required'),
  workAddress: yup.string().required('Work address is required'),
  workAddressState: yup.string().required('Work address state is required'),
});

export const accountUpgradeIdSchema = yup.object().shape({
  modeOfIdentification: yup
    .string()
    .required('Mode of identification is required'),
});

export const otherBankSchema = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  customerAccountNumber: yup
    .string()
    .min(10, 'Must be 10 digits')
    .max(10, 'Must be 10 digits')
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
  institutionCode: yup.string().required('Beneficiary bank is required'),
  accountNumber: yup
    .string()
    .min(10, 'Must be 10 digits')
    .max(10, 'Must be 10 digits')
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

export const standingOrderSchema = yup.object().shape({
  customerAccountNumber: yup.string().required('Account to debit is required'),
  accountNumber: yup.string().required('Account to credit is required'),
  // accountName: yup.string().required('Account name is required'),
  amount: yup.string().required('Amount is required'),
  frequency: yup.string().required('Frequency is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  narration: yup.string().required('Narration is required'),
});

export const ownValidationSchema = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  debitAccount: yup.number().required('Account to debit is required'),
  creditAccount: yup.number().required('Account to credit is required'),
});

export const limitValidationSchema = yup.object().shape({
  customerAccountNumber: yup.string().required('Please choose a debit account'),
  channel: yup.string().required('Please choose a transfer type'),

  newLimit: yup
    .string()
    .required('New transfer limit required')
    .test(
      'newLimit-non-zero',
      'New transfer limit must be greater than zero',
      value => {
        console.log(
          '[schema] newLimit test running with:',
          JSON.stringify(value),
        );
        if (!value) return false;
        const numeric = Number(clearFormatAmount(value));
        console.log('[schema] newLimit parsed numeric:', numeric);
        return !isNaN(numeric) && numeric > 0;
      },
    ),

  newSingleCap: yup
    .string()
    .test(
      'newSingleCap-non-zero',
      'Single transaction cap must be greater than zero',
      value => {
        console.log(
          '[schema] newSingleCap test running with:',
          JSON.stringify(value),
        );
        if (!value) return true;
        const numeric = Number(clearFormatAmount(value));
        console.log('[schema] newSingleCap parsed numeric:', numeric);
        return !isNaN(numeric) && numeric > 0;
      },
    ),
});
