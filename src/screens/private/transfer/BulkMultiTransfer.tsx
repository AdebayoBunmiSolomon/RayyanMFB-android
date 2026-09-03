/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import {
  horizontalScale,
  verticalScale,
  global,
  moderateScale,
} from '../../../theme/metrics';
import { Formik, FormikProps, FormikState, FormikValues } from 'formik';
import * as yup from 'yup';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setDebitAccounts } from '../../../slices/transferSlice';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useApi } from '../../../hooks/useApi';
import { Text, View, YStack } from 'tamagui';
import BeneficiaryScroll from '../../../components/BeneficiaryScroll';
import { clearFormatAmount, formatToNaira } from '../../../util/format';
import Input from '../../../components/Input';
import { Banks } from '../../../types/transfer.types';
import { SelectDataProps } from '../../../types';
import AmountInput from '../../../components/AmountInput';
import { useTheme } from '../../../context/ThemeContext';
import Select from '../../../components/Select';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import { useNavigation } from '@react-navigation/native';
import { setBulkTransfer } from '../../../slices/bulkSlice';
import BulkTransferSummary from '../../../components/BulkTransferSummary';

const othersValidationSchema = yup.object().shape({
  amount: yup.string().required('Amount is required'),
  customerAccountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
  institutionCode: yup.string(),
  accountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
});

const BulkMultiTransfer: FC<MainStackScreenProps<'BulkMultiTransfer'>> = ({
  account,
  transDetails,
  route,
}: any) => {
  const { screenType } = (route.params as any) ?? {};
  const navigation = useNavigation<any>();

  const listInterBankBeneficiaries = useApi({
    endpoint: 'listInterBankBeneficiaries',
  });
  const interBankNameEnquiryQuery = useApi({
    endpoint: 'interBankNameEnquiryQuery',
  });
  const getDebitAccounts = useApi({
    endpoint: 'getAllAccounts',
  });
  const getBankList = useApi({
    endpoint: 'getBankList',
  });

  const dispatch = useAppDispatch();

  const { accounts } = useAppSelector(state => state.account);

  const { colors } = useTheme();

  const [selectedBeneficiariesHash] = useState({
    id: '',
    preferredName: '',
    institutionName: '',
    institutionCode: '',
    accountName: '',
    customerAccountNumber: null,
    accountNumber: '',
    beneficiaryBank: '',
    amount: '',
    narration: '',
    saveBeneficiary: false,
  });

  const [modal, setModal] = useState(false);
  const [inputText, setInputText] = useState('');
  const [userAccounts, setUserAccounts] = useState([]);
  const [bankList, setBankList] = useState<SelectDataProps[]>([]);
  const [selectedBankObj, setSelectedBankObj] = useState<Banks | undefined>(
    undefined,
  );
  // const [isAccDuplicate, setIsAccDuplicate] = useState<boolean | undefined>(
  //   undefined,
  // );
  const [accountName, setAccountName] = useState<string | undefined>(undefined);
  const [contacts, setContacts] = useState([]);

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const [banks, setBanks] = useState([]);

  const summary = useAppSelector(state => state.bulkTransfer);

  const setDefaultAccount = (selectedAcc: number) => {
    if (formikRef.current) {
      formikRef.current.setFieldValue(
        'customerAccountNumber',
        String(selectedAcc),
      );
    }
  };

  const getIntraName = async (accountNo: string) => {
    if (!selectedBankObj?.institutionCode && screenType !== 'rayyan') {
      return;
    }
    setModal(true);
    setAccountName('');
    try {
      const res = await interBankNameEnquiryQuery.requestInit(
        undefined,
        screenType === 'rayyan'
          ? `/v1/corp/transfer/local/name-enquiry/${accountNo}`
          : `/v1/transfer/${accountNo}/${selectedBankObj?.institutionCode}/interbank/nameenquiry`,
      );
      if (res?.data?.code === '00' || res?.data?.success) {
        setAccountName(res?.data?.message);
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  const updateInputFieds = (values: typeof selectedBeneficiariesHash) => {
    values?.accountName &&
      formikRef.current?.setFieldValue('accountName', values?.accountName);

    values?.institutionName &&
      formikRef.current?.setFieldValue(
        'institutionName',
        values?.institutionName,
      );

    values?.narration &&
      formikRef.current?.setFieldValue('narration', values?.narration);

    values?.amount &&
      formikRef.current?.setFieldValue('amount', values?.amount);

    if (values?.accountNumber) {
      formikRef.current?.setFieldValue('accountNumber', values?.accountNumber);
      setInputText(values?.accountNumber);
    }

    if (values?.beneficiaryBank) {
      formikRef.current?.setFieldValue(
        'institutionCode',
        bankList?.find(({ label }) => values?.beneficiaryBank === label)?.value,
      );

      formikRef.current?.setFieldValue(
        'beneficiaryBank',
        values?.beneficiaryBank,
      );

      updateBankInfo(values?.beneficiaryBank);
    }
  };

  const handleItemPress = (id: string) => {
    const item = contacts?.find(props => props?.id === id);
    updateInputFieds(item);
  };

  const updateBankInfo = (value: string | null) => {
    const selectedBank = banks?.find(
      ({ institutionCode }) => institutionCode === value,
    );
    setSelectedBankObj(selectedBank);
  };

  useEffect(() => {
    if (transDetails) {
      return updateInputFieds(transDetails);
    }
  }, [transDetails, banks]);

  useEffect(() => {
    if (inputText.length === 10) {
      getIntraName(inputText);
    }
  }, [inputText, selectedBankObj?.institutionCode]);

  useEffect(() => {
    const getUserDebitAccounts = async () => {
      setModal(true);
      try {
        const res = await getDebitAccounts.requestInit();
        if (res?.data?.code === '00') {
          dispatch(setDebitAccounts(res?.data));
        }
      } catch (error) {
      } finally {
        setModal(false);
      }
    };

    getUserDebitAccounts();
  }, []);

  useEffect(() => {
    const accountMap = accounts.map(
      ({ accountNumber, acctBalance }, index) => ({
        label: `${accountNumber} - ${formatToNaira(+acctBalance)}`,
        value: accountNumber,
        key: index,
      }),
    );
    setUserAccounts(accountMap as any);
  }, [accounts]);

  useEffect(() => {
    if (banks.length) {
      const bankMap = banks?.map(
        ({ institutionName, institutionCode }, index) => ({
          label: institutionName,
          value: institutionCode,
          key: index,
        }),
      );

      setBankList(bankMap);
    }
  }, [banks]);

  // useEffect(() => {
  //   const getInterUsedLeft = async () => {
  //     setModal(true);
  //     try {
  //       const res = await getInterBankUsedLeft.requestInit(
  //         undefined,
  //         `/v1/transfer/limit/${accounts[0]?.accountNumber}/NIP`,
  //       );
  //       if (res) {
  //         dispatch(setInterUsedLeft(res?.data));
  //         setModal(false);
  //       }
  //       setModal(false);
  //     } catch (error) {
  //       console.log(error?.response.data, '11dsdkskd111');

  //       setModal(false);
  //     }
  //   };

  //   getInterUsedLeft();
  // }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      setModal(true);
      try {
        const res = await getBankList.requestInit();
        if (res) {
          setBanks(res?.data);
        }
        setModal(false);
      } catch (error) {
      } finally {
        setModal(false);
      }
    };

    fetchBanks();
  }, []);

  useEffect(() => {
    setDefaultAccount(account ?? transDetails?.customerAccountNumber);
  }, [account, accounts, transDetails?.customerAccountNumber]);

  useEffect(() => {
    const getInterBankBeneficiaries = async () => {
      setModal(true);
      try {
        const res = await listInterBankBeneficiaries.requestInit();
        if (res?.data) {
          setContacts(res?.data?.data);
        }
      } catch (error) {
      } finally {
        setModal(false);
      }
    };
    getInterBankBeneficiaries();
  }, []);

  const styles = StyleSheet.create({
    headerText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.semiLightTextColor,
    },
    scroll: { flexGrow: 1 },

    amountText: {
      fontFamily: 'JosefinSans-Regular',
      fontSize: moderateScale(8),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    freqText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(10),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.otpBorderColor,
    },

    findText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(10),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.semiLightTextColor,
    },

    beneficiariesView: {
      flexDirection: 'row',
      width: '100%',
      marginTop: verticalScale(16),
      height: verticalScale(70),
    },

    cardView: {
      marginRight: horizontalScale(3),
      alignItems: 'center',
      height: verticalScale(61),
      width: horizontalScale(65),
      backgroundColor: colors.lightBackground,
    },

    activeCardView: {
      backgroundColor: colors.semiLightTextColor,
    },

    initialsText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(13),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    nameText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(7),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    error: {
      fontSize: moderateScale(11),
      fontFamily: 'JosefinSans-Regular',
      fontWeight: '500',
      fontStyle: 'normal',
      color: colors.otpBorderColor,
      marginTop: verticalScale(5),
    },

    accountName: {
      fontFamily: 'JosefinSans-Regular',
      fontSize: moderateScale(14),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
      textTransform: 'capitalize',
    },

    selectContainer: {
      borderWidth: 1,
      borderColor: colors.black,
      borderRadius: moderateScale(5),
      padding: 10,
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },

    selectText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '500',
      // color: colors.otpBorderColor,
      height: 'auto',
      marginVertical: 'auto',
      color: colors.black,
      paddingHorizontal: 4,
    },

    inputContainer: {
      borderWidth: 1,
      borderColor: colors.black,
      borderRadius: moderateScale(5),
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(15),
      height: 54,
      marginBottom: 8,
    },
    label: {
      position: 'absolute',
      top: -10,
      left: 10,
      backgroundColor: colors.white,
      paddingHorizontal: 2,
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(10),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    input: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(13),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.black,
      padding: 8,
      flex: 1,
    },

    nairaText_: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.otpBorderColor,
    },
  });

  const handleBulkAdd = (
    values: FormikValues,
    resetForm: {
      (nextState?: Partial<FormikState<FormikValues>> | undefined): void;
      (): void;
    },
  ) => {
    const payload = {
      accountName: accounts?.find(
        resp => values?.customerAccountNumber === resp?.accountNumber,
      )?.accountName as string,
      debitAccount: values?.customerAccountNumber,
      accountNumber: values?.accountNumber,
      amount: values?.amount,
      narration: values?.narration,
      accountNameEnquiry: accountName as string,
      bank: selectedBankObj?.institutionName ?? 'RAYYAN MFB',
      sortCode: selectedBankObj?.sortCode as string,
      beneficiaryBankCode: selectedBankObj?.institutionCode as string,
      type: screenType,
    };
    dispatch(setBulkTransfer(payload));
    navigation.navigate('TransferSummary');
    setInputText('');
    resetForm();
  };

  return (
    <PageContainer>
      <HeaderAuth
        headerTitle={`Multiple ${
          screenType === 'rayyan' ? 'Rayyan' : 'Other Bank'
        } A/c Transfer`}
        noLogo
      />

      {modal && (
        <LoadingModal
          isVisible={modal}
          onBackdropPress={() => setModal(true)}
          onBackButtonPress={() => setModal(true)}
        />
      )}

      <Formik
        validationSchema={othersValidationSchema}
        validate={values => {
          const errors = {} as any;

          const accountBalance = accounts.find(
            ({ accountNumber }) => +accountNumber === account,
          )?.acctBalance;

          const clrBalance = clearFormatAmount(accountBalance);
          const clrInputAmount = clearFormatAmount(values?.amount);

          // Validate amount
          if (!values.amount) {
            errors.amount = 'Amount is required';
          } else if (clrInputAmount > clrBalance) {
            errors.amount = 'Insufficient balance';
          }

          if (values?.accountNumber === values?.customerAccountNumber) {
            errors.accountNumber =
              'Customer and Beneficiary Account Numbers cannot be the same';
          }

          if (
            summary?.find(
              ({ accountNumber }) => values?.accountNumber === accountNumber,
            )
          ) {
            errors.accountNumber = 'Account number already added';
          }

          return errors;
        }}
        initialValues={selectedBeneficiariesHash}
        enableReinitialize={true}
        innerRef={formikRef}
        validateOnChange={true}
        onSubmit={(values, { resetForm }) => handleBulkAdd(values, resetForm)}
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
          setFieldTouched,
        }) => {
          return (
            <View flex={1} marginTop={32}>
              {/* summary */}
              <BulkTransferSummary />
              {/* beneficiaries */}
              {contacts?.length ? (
                <View marginTop={24}>
                  <BeneficiaryScroll
                    type="transfer"
                    contacts={contacts}
                    onPress={handleItemPress}
                  />
                </View>
              ) : (
                ''
              )}
              {/* form */}
              <YStack marginTop={38} marginBottom={24} gap={20}>
                <Select
                  value={values.customerAccountNumber}
                  onChange={value => {
                    setFieldValue('customerAccountNumber', value);
                  }}
                  data={userAccounts}
                  label="Account to Debit"
                  placeholder={'Account to Debit'}
                  onBlur={handleBlur('customerAccountNumber')}
                  error={
                    touched.customerAccountNumber &&
                    errors.customerAccountNumber
                  }
                />
                {screenType !== 'rayyan' ? (
                  <Select
                    loading={getBankList?.loading}
                    value={values.institutionCode}
                    onChange={value => {
                      setFieldValue('institutionCode', value);
                      updateBankInfo(value as string);
                    }}
                    data={bankList}
                    label="Beneficiary Bank Name"
                    placeholder={'Bank Name'}
                    onBlur={handleBlur('institutionCode')}
                    error={touched.institutionCode && errors.institutionCode}
                  />
                ) : (
                  ''
                )}
                <Input
                  value={values.accountNumber}
                  onChangeText={text => {
                    handleChange('accountNumber')(text);
                    setFieldTouched('accountNumber', true, false);
                    setInputText(text);
                  }}
                  onBlur={handleBlur('accountNumber')}
                  label="Beneficiary account number"
                  placeholder="Account number"
                  maxLength={10}
                  keyboardType={'number-pad'}
                  error={touched.accountNumber && errors.accountNumber}
                />
                {accountName && inputText.length === 10 ? (
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
                  onChangeText={value => {
                    setFieldValue('amount', value);
                    setFieldTouched('amount', true, false);
                  }}
                  onBlur={handleBlur('amount')}
                  error={touched.amount && errors.amount}
                  // helperText={`₦${formatToDecimal(
                  //   interUsedLeft?.amountLeft,
                  // )} of Daily Limit Remaining`}
                />
                <Input
                  value={values.narration}
                  onChangeText={handleChange('narration')}
                  label="Narration"
                  placeholder="Description"
                />
              </YStack>

              <View marginTop="auto">
                <Button
                  onPress={() => handleSubmit()}
                  disabled={!(isValid && dirty) || !accountName}
                  width={'100%'}
                  loading={false}
                >
                  Proceed
                </Button>
              </View>
            </View>
          );
        }}
      </Formik>
    </PageContainer>
  );
};

export default BulkMultiTransfer;
