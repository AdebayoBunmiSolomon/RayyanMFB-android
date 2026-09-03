/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PageContainer from '../../../components/PageContainer';
import { View, YStack } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { Formik, FormikProps, FormikValues } from 'formik';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { useAppSelector } from '../../../hooks/hook';
import truncateMiddleString from '../../../util/truncateMiddleString';
import Select from '../../../components/Select';
import { sourcesOfIncome, statesInNigeria } from '../../../mock';
import { accountUpgradeSchema } from '../../../schema';
import { useDispatch } from 'react-redux';
import { setKyc } from '../../../slices/kycSlice';
import { SelectDataProps } from '../../../types';
import { Accounts } from '../../../types/transfer.types';
import { formatToNaira } from '../../../util/format';
import { useApi } from '../../../hooks/useApi';
import { AccountUpgradeTypes } from '../../../types/account.types';
import { Accounts_ } from '../../../types/transactions.types';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useAppToast } from '../../../hooks/useAppToast';

const AccountUpgradeRequest: FC<
  MainStackScreenProps<'AccountUpgradeRequest'>
> = ({ navigation }) => {
  const [kycDetails, setKycDetails] = useState<AccountUpgradeTypes | undefined>(
    undefined,
  );
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userAccounts, setUserAccounts] = useState<
    SelectDataProps | Accounts[] | undefined
  >(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const fetchAccountUpgrade = useApi({
    endpoint: 'fetchAccountUpgrade',
    onError: (error, errorDetails) => {
      console.error('Account upgrade fetch error:', error, errorDetails);
      showError('Failed to load account upgrade details. Please try again.');
    },
  });

  const { bvn } = useAppSelector(app => app.profile);
  const dispatch = useDispatch();
  const { accounts, selectedAccount } = useAppSelector(state => state?.account);

  // Memoized account mapping to prevent unnecessary re-renders
  const accountMap = useMemo(() => {
    if (!accounts || !Array.isArray(accounts)) return undefined;

    try {
      return accounts.map(({ accountNumber, acctBalance }, index) => ({
        label: `${accountNumber || 'N/A'} - ${formatToNaira(
          Number(acctBalance) || 0,
        )}`,
        value: accountNumber || '',
        key: index,
      }));
    } catch (error) {
      console.error('Error mapping accounts:', error);
      return undefined;
    }
  }, [accounts]);

  // Update user accounts when account map changes
  useEffect(() => {
    setUserAccounts(accountMap as unknown as SelectDataProps);
  }, [accountMap]);

  // Fetch account upgrade data with error handling
  const fetchAccountUpgradeReq = useCallback(async () => {
    if (!selectedAccount?.accountNumber) return;

    try {
      setLoading(true);
      const response = await fetchAccountUpgrade?.requestInit();
      // console.log('response', response);

      if (response?.data?.response && Array.isArray(response.data.response)) {
        const fnMatchAcc = response.data.response.filter(
          ({ accountNumber }: Accounts_) =>
            accountNumber === selectedAccount?.accountNumber,
        );
        const lastReq = fnMatchAcc?.at?.(-1);
        // console.log('req', lastReq);
        setKycDetails(lastReq);
      }
    } catch (error) {
      console.error('Error fetching account upgrade:', error);
      handleError(error as Error, 'AccountUpgradeRequest:fetchAccountUpgrade');
    } finally {
      setLoading(false);
    }
  }, [selectedAccount?.accountNumber]);

  // Initial data fetch
  useEffect(() => {
    if (!isInitialized && selectedAccount?.accountNumber) {
      fetchAccountUpgradeReq();
      setIsInitialized(true);
    }
  }, [isInitialized, selectedAccount?.accountNumber]);

  // Update form when selected account changes
  useEffect(() => {
    if (selectedAccount?.accountNumber && formikRef.current) {
      try {
        formikRef.current.setFieldValue(
          'accountNumber',
          selectedAccount.accountNumber,
        );
      } catch (error) {
        console.error('Error setting account number:', error);
      }
    }
  }, [selectedAccount?.accountNumber]);

  // Update form when KYC details change
  useEffect(() => {
    if (kycDetails && formikRef.current) {
      // console.log('kycDetails', kycDetails);
      try {
        const fields = [
          // { key: 'maidenName', value: kycDetails.maidenName },
          // { key: 'nextOfKin', value: kycDetails.nextOfKin },
          { key: 'ninNumber', value: kycDetails.ninNumber },
          { key: 'sourceOfIncome', value: kycDetails.sourceOfIncome },
          { key: 'placeOfWork', value: kycDetails.placeOfWork },
          { key: 'workAddress', value: kycDetails.workAddress },
          { key: 'workAddressState', value: kycDetails.workAddressState },
        ];

        fields.forEach(({ key, value }) => {
          if (value !== undefined && value !== null) {
            formikRef.current?.setFieldValue(key, value);
          }
        });
      } catch (error) {
        console.error('Error setting KYC details:', error);
      }
    }
  }, [kycDetails]);

  // Update disabled state based on KYC status
  useEffect(() => {
    try {
      const currentValues = formikRef.current?.values;
      const accountNumber = currentValues?.accountNumber;

      if (accountNumber && kycDetails) {
        const isActiveKyc =
          accounts[0]?.accountNumber === accountNumber &&
          accounts[0]?.status === 'A' &&
          accounts[0]?.kycLevel === '3';
        setDisabled(isActiveKyc);
      } else {
        setDisabled(false);
      }
    } catch (error) {
      console.error('Error updating disabled state:', error);
      setDisabled(false);
    }
  }, [kycDetails]);

  return (
    <ErrorBoundary
      fallback={
        <PageContainer>
          <View
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
          >
            <HeaderAuth noLogo headerTitle="Account Upgrade" />
            <View marginTop="$8" alignItems="center">
              <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </View>
          </View>
        </PageContainer>
      }
    >
      <PageContainer>
        {/* header */}
        <HeaderAuth noLogo headerTitle="Account Upgrade" />
        {/* heading - title - subtitle */}

        {/* form */}
        <Formik
          innerRef={formikRef}
          enableReinitialize={true}
          validationSchema={accountUpgradeSchema}
          validate={values => {
            const errors = {} as any;

            try {
              // Validate account number
              if (!values.accountNumber || values.accountNumber.trim() === '') {
                errors.accountNumber = 'Account number is required';
              }

              // Validate NIN
              if (!values.ninNumber || values.ninNumber.trim() === '') {
                errors.ninNumber = 'NIN number is required';
              } else if (values.ninNumber.length !== 11) {
                errors.ninNumber = 'NIN must be 11 digits';
              }

              // Validate source of income
              if (
                !values.sourceOfIncome ||
                values.sourceOfIncome.trim() === ''
              ) {
                errors.sourceOfIncome = 'Source of income is required';
              }

              // Validate place of work
              if (!values.placeOfWork || values.placeOfWork.trim() === '') {
                errors.placeOfWork = 'Place of work is required';
              }

              // Validate work address
              if (!values.workAddress || values.workAddress.trim() === '') {
                errors.workAddress = 'Work address is required';
              }

              // Validate work address state
              if (
                !values.workAddressState ||
                values.workAddressState.trim() === ''
              ) {
                errors.workAddressState = 'Work address state is required';
              }

              // Validate conditional fields for tier 2 upgrades
              if (
                accounts[0]?.status === 'A' &&
                accounts[0]?.kycLevel === '2'
              ) {
                if (!values.nextOfKin || values.nextOfKin.trim() === '') {
                  errors.nextOfKin = 'Next of Kin is required';
                }
                if (!values.maidenName || values.maidenName.trim() === '') {
                  errors.maidenName = 'Maiden name is required';
                }
              }
            } catch (error) {
              console.error('Validation error:', error);
              errors.general = 'Validation failed. Please check your inputs.';
            }

            return errors;
          }}
          initialValues={{
            accountNumber: '',
            ninNumber: '',
            sourceOfIncome: '',
            placeOfWork: '',
            workAddress: '',
            workAddressState: '',
            nextOfKin: '',
            maidenName: '',
          }}
          onSubmit={async values => {
            try {
              setLoading(true);

              // Validate required data
              if (!bvn) {
                showError('BVN information is missing. Please try again.');
                return;
              }

              // Dispatch KYC data
              dispatch(setKyc({ ...values, bvn }));

              // Navigate based on KYC status and tier
              if (
                accounts[0]?.status === 'A' &&
                accounts[0]?.kycLevel === '2'
              ) {
                navigation.navigate('AccountUpgradeProofAddress');
              } else {
                navigation.navigate('AccountUpgradeIdentity');
              }
            } catch (error) {
              console.error('Form submission error:', error);
              handleError(error as Error, 'AccountUpgradeRequest:onSubmit');
              showError('Failed to submit form. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            // <View />
            <View flex={1} marginTop={32}>
              <YStack marginTop={24} gap={20}>
                <Select
                  value={values.accountNumber || ''}
                  onChange={value => {
                    try {
                      setFieldValue('accountNumber', value);
                    } catch (error) {
                      console.error('Error setting account number:', error);
                    }
                  }}
                  data={(userAccounts as unknown as SelectDataProps[]) || []}
                  label="Account to Upgrade"
                  error={touched.accountNumber && errors.accountNumber}
                />
                {accounts[0]?.status === 'A' &&
                accounts[0]?.kycLevel === '2' ? (
                  <>
                    <Input
                      disabled={disabled}
                      label="Maiden Name"
                      onChangeText={handleChange('maidenName')}
                      onBlur={handleBlur('maidenName')}
                      value={values.maidenName}
                      error={touched.maidenName && errors.maidenName}
                    />
                    <Input
                      disabled={disabled}
                      label="Next of Kin"
                      onChangeText={handleChange('nextOfKin')}
                      onBlur={handleBlur('nextOfKin')}
                      value={values.nextOfKin}
                      error={touched.nextOfKin && errors.nextOfKin}
                    />
                  </>
                ) : (
                  <>
                    <Input
                      label="Your BVN"
                      placeholder="0000000000"
                      value={bvn ? truncateMiddleString(bvn as string) : ''}
                      disabled
                      maxLength={10}
                      keyboardType={'number-pad'}
                    />
                    <Input
                      disabled={disabled}
                      label="NIN Number"
                      onChangeText={handleChange('ninNumber')}
                      onBlur={handleBlur('ninNumber')}
                      value={values.ninNumber}
                      maxLength={11}
                      keyboardType={'number-pad'}
                      error={touched.ninNumber && errors.ninNumber}
                    />
                    <Select
                      disabled={disabled}
                      label="Source of Income"
                      onChange={value => {
                        try {
                          setFieldValue('sourceOfIncome', value);
                        } catch (error) {
                          console.error(
                            'Error setting source of income:',
                            error,
                          );
                        }
                      }}
                      onBlur={handleBlur('sourceOfIncome')}
                      value={values.sourceOfIncome || ''}
                      error={touched.sourceOfIncome && errors.sourceOfIncome}
                      data={
                        sourcesOfIncome?.map((res, key) => ({
                          key,
                          label: res,
                          value: res,
                        })) || []
                      }
                    />
                    <Input
                      disabled={disabled}
                      label="Place of Work"
                      onChangeText={handleChange('placeOfWork')}
                      onBlur={handleBlur('placeOfWork')}
                      value={values.placeOfWork}
                      error={touched.placeOfWork && errors.placeOfWork}
                    />
                    <Input
                      disabled={disabled}
                      label="Work Address"
                      onChangeText={handleChange('workAddress')}
                      onBlur={handleBlur('workAddress')}
                      value={values.workAddress}
                      error={touched.workAddress && errors.workAddress}
                    />
                    <Select
                      disabled={disabled}
                      label="Work Address State"
                      onChange={value => {
                        try {
                          setFieldValue('workAddressState', value);
                        } catch (error) {
                          console.error(
                            'Error setting work address state:',
                            error,
                          );
                        }
                      }}
                      onBlur={handleBlur('workAddressState')}
                      value={values.workAddressState || ''}
                      error={
                        touched.workAddressState && errors.workAddressState
                      }
                      data={
                        statesInNigeria?.map((res, key) => ({
                          key,
                          label: res,
                          value: res,
                        })) || []
                      }
                    />
                  </>
                )}
              </YStack>

              {/* bottom elements */}
              <View marginTop="auto" marginBottom={8} marginVertical={32}>
                <Button
                  onPress={() => {
                    try {
                      handleSubmit();
                    } catch (error) {
                      console.error('Button press error:', error);
                      handleError(
                        error as Error,
                        'AccountUpgradeRequest:buttonPress',
                      );
                      showError('Failed to submit form. Please try again.');
                    }
                  }}
                  loading={loading || fetchAccountUpgrade.loading}
                  // disabled={disabled}
                >
                  {disabled ? 'Account Already Upgraded' : 'Next'}
                </Button>
              </View>
            </View>
          )}
        </Formik>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default AccountUpgradeRequest;
