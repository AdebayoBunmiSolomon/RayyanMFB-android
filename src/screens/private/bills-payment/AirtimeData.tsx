/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setDebitAccounts } from '../../../slices/transferSlice';
import {
  verticalScale,
  moderateScale,
  horizontalScale,
  colors,
} from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { Formik, FormikProps, FormikValues } from 'formik';
import * as yup from 'yup';
import Button from '../../../components/Button';

import {
  AirtimeCodes,
  BillBeneficiaryByBCParams,
  BillerBeneficiary,
  BillsDetails,
  CustomAmount,
} from '../../../types/bills-payments.types';
import { formatToDecimal, formatToNaira } from '../../../util/format';
import Amount from '../../../mock/Amount';
import BillsBeneficiariesModal from '../../../components/modals/BillsBeneficiariesModal';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import Input from '../../../components/Input';
import Select from '../../../components/Select';
import { SelectDataProps } from '../../../types';
import { Accounts } from '../../../types/transfer.types';
import { Text, View, XStack, YStack } from 'tamagui';
import BeneficiaryScroll from '../../../components/BeneficiaryScroll';
import Switch from '../../../components/Switch';
import { UserAdd } from 'iconsax-react-native';
import { useTheme } from '../../../context/ThemeContext';
import pickContact from '../../../util/phoneNumerPicker';
import InputPhone from '../../../components/inputPhone';

const phoneRegExp = /^(\+?234|0)([789][01]\d{8})$/;

const airtimeValidationSchema = yup.object().shape({
  amount: yup
    .string()
    // .typeError('Amount must be a number')
    // .min(1, 'Amount must be greater than or equal to 1')
    // .max(200, 'Amount must be less than or equal to 200')
    .required('Amount is required'),
  customerId: yup
    .string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .required('Phone number is required'),
});

const AirtimeData: FC<MainStackScreenProps<'AirtimeData'>> = ({
  navigation,
  route,
}) => {
  const { account } = route.params as any;

  const { colors } = useTheme();

  const getDebitAccounts = useApi({ endpoint: 'getDebitAccounts' });
  const listAirtimePaymentCodes = useApi({
    endpoint: 'listAirtimePaymentCodes',
  });
  const listBillerDetailsByBillerID = useApi({
    endpoint: 'listBillerDetailsByBillerID',
  });
  const getBillerBeneficiariesByBC = useApi({
    endpoint: 'getBillerBeneficiariesByBC',
  });
  const listPaymentItemWithCode = useApi({
    endpoint: 'listPaymentItemWithCode',
  });

  const dispatch = useAppDispatch();

  const { accounts } = useAppSelector(state => state.transfer);

  const [activeTab, _] = useState(1);
  const [modal, setModal] = useState(false);
  const [beneficiaryModal, setBeneficiaryModal] = useState(false);
  const [list, setList] = useState<BillerBeneficiary[]>([]);
  const [activeIndex_, setActiveIndex_] = useState<number | null>(null);
  const [airtimeList, setAirtimeList] = useState<AirtimeCodes[]>([]);
  const [customAmount] = useState<CustomAmount[]>(Amount);
  const [provider, setProvider] = useState<number | null>(null);
  const [userAccounts, setUserAccounts] = useState<
    SelectDataProps | Accounts[] | undefined
  >(undefined);
  const { phoneNumber } = useAppSelector(state => state.profile);
  const { userType } = useAppSelector(state => state.profile);

  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const [details, setDetails] = useState<BillsDetails>({
    amount: '',
    billerId: '',
    billerName: '',
    categoryId: '',
    categoryName: '',
    customerAccountNumber: '',
    customerId: '',
    paymentItemId: '',
    paymentItemName: '',
    amountFixed: false,
    customerField1: '',
  });

  const [airtimeDetails, setAirtimeDetails] = useState<BillsDetails>({
    amount: '',
    billerId: '',
    billerName: '',
    categoryId: '',
    categoryName: '',
    customerAccountNumber: '',
    customerId: '',
    paymentItemId: '',
    paymentItemName: '',
    customerIdNo: '',
    customerName: '',
    paymentCode: '',
    amountFixed: false,
    customerField1: '',
    saveBeneficiary: false,
  });

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

  const fetchAirtimePaymentDetails = async (billerId: string) => {
    setModal(true);

    try {
      const res = await listBillerDetailsByBillerID.requestInit(
        undefined,
        `/v1/bills-payment/bills/${billerId}`,
      );
      if (res?.data?.billerName) {
        return setAirtimeDetails(prev => ({
          ...prev,
          billerId: res?.data?.billerId?.toString(),
          billerName: res?.data?.billerName,
          categoryId: res?.data?.categoryId?.toString(),
          categoryName: res?.data?.categoryName,
          customerField1: res?.data?.customerField1,
        }));
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  const fetchAirtimePaymentItems = async (paymentCode: string) => {
    setModal(true);
    console.log('payment-code-for airtime', paymentCode);
    try {
      const res = await listPaymentItemWithCode.requestInit(
        undefined,
        `/v1/bills-payment/payment-items/${paymentCode}`,
      );
      console.log('hello', res);
      if (res?.data) {
        return setAirtimeDetails(prev => ({
          ...prev,
          paymentCode: res.data?.paymentCode,
          paymentItemId: res?.data?.paymentItemId,
          paymentItemName: res?.data?.paymentItemName,
        }));
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  useEffect(() => {
    const handleAirtimeItemPress = async () => {
      const fnProvider = airtimeList.find(({ id }) => id === provider);
      fnProvider && fetchAirtimePaymentDetails(fnProvider?.billerId);
    };
    provider && handleAirtimeItemPress();
  }, [provider, airtimeList]);

  useEffect(() => {
    const fnProvider = airtimeList.find(({ id }) => id === provider);
    fnProvider && fetchAirtimePaymentItems(fnProvider?.paymentCode);
  }, [provider, airtimeList]);

  const handleItemPress_ = (index: number) => {
    setActiveIndex_(index);
    const amount_ = customAmount[index].value;

    if (formikRef) {
      formikRef?.current?.setFieldValue(
        'amount',
        formatToDecimal(Number(amount_)),
      );
    }
  };

  const getAirtimePaymentCodes = async () => {
    setModal(true);

    try {
      const res = await listAirtimePaymentCodes.requestInit();
      console.log('log from getAirtimrPaymentCode func', res);
      if (res?.data?.length) {
        setAirtimeList(res?.data);
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  const listBeneficiariesByBC = async (val: BillBeneficiaryByBCParams) => {
    setModal(true);

    try {
      const res = await getBillerBeneficiariesByBC.requestInit(
        undefined,
        `/v1/${
          userType === 'corp' ? 'corp-' : ''
        }biller-beneficiaries/find/category-and-biller?biller=${
          val.biller
        }&category=${val.category}`,
      );
      if (res?.data?.response) {
        setList(res.data?.response);
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  useEffect(() => {
    const setDefaultAccount = () => {
      const selectedUserAccount = accounts.find(
        props => +props.accountNumber === account,
      );

      setAirtimeDetails({
        ...airtimeDetails,
        customerIdNo: selectedUserAccount?.customerId,
        customerName: selectedUserAccount?.accountName,
      });

      if (formikRef) {
        formikRef?.current?.setFieldValue(
          'customerAccountNumber',
          selectedUserAccount?.accountNumber as string,
        );
      }
    };
    setDefaultAccount();
  }, [account, accounts]);

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
    setUserAccounts(accountMap as unknown as SelectDataProps);
  }, [accounts]);

  useEffect(() => {
    getUserDebitAccounts();
    getAirtimePaymentCodes();
  }, []);

  useEffect(() => {
    listBeneficiariesByBC({
      biller: airtimeDetails?.billerName,
      category: airtimeDetails?.categoryName,
    });
  }, [airtimeDetails?.billerName, airtimeDetails?.categoryName]);

  const getPhoneNumber = async () => {
    const selectedPhone = await pickContact();

    if (selectedPhone) {
      formikRef?.current?.setFieldValue(
        'customerId',
        selectedPhone?.replaceAll?.(' ', ''),
      );
      return selectedPhone;
    }
  };

  const autoFillPhoneNo = () => {
    if (phoneNumber) {
      formikRef?.current?.setFieldValue('customerId', phoneNumber);
    }
  };

  return (
    <PageContainer>
      <LoadingModal
        isVisible={modal}
        onBackdropPress={() => setModal(true)}
        onBackButtonPress={() => setModal(true)}
      />

      {beneficiaryModal && (
        <BillsBeneficiariesModal
          isVisible={beneficiaryModal}
          onBackdropPress={() => setBeneficiaryModal(false)}
          onBackButtonPress={() => setBeneficiaryModal(false)}
          onSwipeComplete={() => setBeneficiaryModal(false)}
          closeModal={() => setBeneficiaryModal(false)}
          onFabPress={() => {
            setBeneficiaryModal(false);
            navigation.navigate('AddBillBeneficiary');
          }}
          setSelectedBeneficiary={item => {
            if (activeTab === 1) {
              setAirtimeDetails({
                ...details,
                customerId: item?.beneficiaryId,
              });
            } else {
              setDetails({ ...details, customerId: item?.beneficiaryId });
            }
          }}
          data={list}
        />
      )}

      <HeaderAuth headerTitle="Airtime" noLogo />

      <Formik
        validationSchema={airtimeValidationSchema}
        initialValues={airtimeDetails}
        innerRef={formikRef}
        onSubmit={async values => {
          // console.log(values);
          const payload = {
            ...airtimeDetails,
            amount: values.amount,
            customerId: values.customerId,
            customerAccountNumber: values.customerAccountNumber,
          };
          // console.log('payload', payload);
          navigation.navigate('BillsReview', { item: payload });
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          setFieldValue,
          touched,
          dirty,
        }) => (
          <View flex={1} marginTop={32}>
            <BeneficiaryScroll
              contacts={list as any}
              type="bill"
              onPress={undefined}
            />

            <YStack marginTop={16} marginBottom={24} gap={20}>
              <Select
                value={values.customerAccountNumber}
                onChange={value => {
                  setFieldValue('customerAccountNumber', value);
                }}
                data={userAccounts as unknown as SelectDataProps[]}
                label="Account to Debit"
                placeholder={'Account to Debit'}
                error={
                  touched.customerAccountNumber && errors.customerAccountNumber
                }
              />
              <>
                <View>
                  <InputPhone
                    provider={provider as any}
                    airtimeList={airtimeList as any}
                    selectProvider={setProvider}
                    startIcon={
                      <TouchableOpacity onPress={getPhoneNumber}>
                        <UserAdd
                          color={colors.grey04}
                          variant="Bulk"
                          size={23}
                        />
                      </TouchableOpacity>
                    }
                    value={values.customerId}
                    onChangeText={text => setFieldValue('customerId', text)}
                    onBlur={handleBlur('customerId')}
                    label="Beneficiary Phone number"
                    placeholder="Phone number"
                    maxLength={11}
                    keyboardType={'number-pad'}
                    error={touched.customerId && errors.customerId}
                    endIcon={
                      <TouchableOpacity onPress={getPhoneNumber}>
                        <UserAdd
                          color={colors.grey04}
                          variant="Bulk"
                          size={23}
                        />
                      </TouchableOpacity>
                    }
                  />
                </View>

                <TouchableOpacity onPress={autoFillPhoneNo}>
                  <XStack
                    backgroundColor={colors.input}
                    maxWidth="min-content"
                    paddingBlock={8}
                    paddingInline={12}
                    borderRadius={12}
                    alignSelf="flex-start"
                  >
                    <Text
                      maxWidth="auto"
                      fontSize={13}
                      color={colors.grey05}
                      fontFamily="Inter-Medium"
                    >
                      Use my number
                    </Text>
                  </XStack>
                </TouchableOpacity>
              </>
              {/* ) : null} */}

              <View style={styles.unitViews}>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {customAmount?.map((_, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.tabItem,
                          index === activeIndex_ && styles.activeTab,
                        ]}
                        onPress={() => handleItemPress_(index)}
                      >
                        <Text style={[styles.tabText]}>
                          ₦{formatToDecimal(Number(_.value))}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              <Input
                label="Amount"
                placeholder="Amount"
                keyboardType={'number-pad'}
                value={values.amount as unknown as string}
                onChangeText={handleChange('amount')}
                onBlur={handleBlur('amount')}
                error={touched.amount && errors.amount}
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
                  Save Beneficiary
                </Text>
                <Switch
                  value={values?.saveBeneficiary}
                  onValueChange={(newValue: string) =>
                    setFieldValue('saveBeneficiary', newValue)
                  }
                />
              </XStack>
            </YStack>

            <Button
              onPress={() => handleSubmit()}
              disabled={Boolean(
                !isValid &&
                  dirty &&
                  airtimeDetails?.paymentItemId &&
                  airtimeDetails?.billerName,
              )}
              width={'100%'}
              marginTop="auto"
              marginBottom={16}
            >
              Proceeds
            </Button>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default AirtimeData;

const styles = StyleSheet.create({
  networkText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(10),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },

  networkType: {
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '700',
    color: colors.grey04,
  },

  networkViews: {
    flexDirection: 'row',
    width: '100%',
  },

  cardView: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: verticalScale(61),
    width: horizontalScale(65),
    backgroundColor: colors.input,
    borderRadius: 8,
    borderColor: colors.inputBorder,
    borderWidth: 1,
  },

  activeCardView: {
    borderColor: colors.primary,
    borderWidth: 1,
  },

  amountText: {
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.semiLightTextColor,
  },

  unitViews: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 12,
  },

  tabItem: {
    padding: 4,
    height: 40,
    width: 90,
    backgroundColor: colors.input,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activeTab: {
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.grey05,
    textTransform: 'capitalize',
    fontFamily: 'Inter-Medium',
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
    height: 54,
  },

  nairaText_: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },

  error: {
    fontSize: moderateScale(11),
    fontFamily: 'JosefinSans-Regular',
    fontWeight: '500',
    fontStyle: 'normal',
    color: colors.otpBorderColor,
    marginTop: verticalScale(5),
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
    fontSize: moderateScale(13),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
    padding: 8,
  },
});
