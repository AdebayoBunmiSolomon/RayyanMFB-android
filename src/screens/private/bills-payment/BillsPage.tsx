/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableOpacity } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import PageContainer from '../../../components/PageContainer';

import { Formik, FormikProps, FormikValues } from 'formik';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import {
  listBanks,
  listInterBankBeneficiaries,
} from '../../../slices/transferSlice';
import LoadingModal from '../../../components/modals/LoadingModal';
import { formatToDecimal, formatToNaira } from '../../../util/format';
import {
  AddBillBeneficiary_,
  BillsDetails,
} from '../../../types/bills-payments.types';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, View, XStack, YStack } from 'tamagui';
import Select from '../../../components/Select';
import Input from '../../../components/Input';
import { Accounts } from '../../../types/transfer.types';
import { UserAdd } from 'iconsax-react-native';
import { SelectDataProps, SelectOption } from '../../../types';
import pickContact from '../../../util/phoneNumerPicker';
import { useTheme } from '../../../context/ThemeContext';
import { othersValidationSchema } from '../../../schema';
import Switch from '../../../components/Switch';
import { useBillsLogic } from '../../../hooks/bills-payment/useBillsLogic';
import BeneficiaryScroll from '../../../components/BeneficiaryScroll';

const defaultDetails = {
  amount: 0,
  billerId: '',
  billerName: '',
  categoryId: 0,
  categoryName: '',
  customerAccountNumber: '',
  customerId: '',
  paymentItemId: '',
  paymentItemName: '',
  amountFixed: false,
  customerField1: '',
  customerIdNo: '',
  customerName: '',
  paymentCode: '',
  saveBeneficiary: false,
};

const BillsPage: FC<MainStackScreenProps<'BillsPage'>> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { phoneNumber } = useAppSelector(state => state.profile);
  const { accounts } = useAppSelector(state => state.transfer);
  const { type, categoryId } = route.params as any;

  const account = useAppSelector(
    state => state.account.selectedAccount.accountNumber,
  );

  const {
    categories,
    billers,
    products,
    beneficiaries,
    loading,
    getCategories,
    getBillerBeneficiaries,
    getBillers,
    getProducts,
    getUserDebitAccounts,
  } = useBillsLogic();

  const [billBeneficiaries, setBillBeneficiaries] =
    useState<AddBillBeneficiary_[]>();
  const [details, setDetails] = useState<BillsDetails>(defaultDetails);
  const [beneficiaryId, setBeneficiaryId] = useState<string>();
  const [selectedBeneficiary, setSelectedBeneficiary] =
    useState<AddBillBeneficiary_>();
  const [modal, setModal] = useState(false);
  const [userAccounts, setUserAccounts] = useState<
    SelectDataProps | Accounts[]
  >();

  const formikRef = useRef<FormikProps<FormikValues>>(null);
  const { colors } = useTheme();

  useEffect(() => {
    getCategories();
    getUserDebitAccounts();
    getBillerBeneficiaries();
  }, []);

  const handleCategoryChange = (_categoryId: number) => {
    // setDetails(defaultDetails);
    const selectedCategory = categories?.find(
      item => item.value === _categoryId,
    );
    if (selectedCategory?.label) {
      setDetails(prev => ({
        ...prev,
        categoryId: +selectedCategory.value,
        categoryName: selectedCategory.label,
      }));
      getBillers(selectedCategory.label);
    }
  };

  const handleBillerChange = (billerId: string) => {
    // setDetails(defaultDetails);      a                               z
    const selectedBiller = billers?.find(props => props.value === billerId);
    setDetails(prev => ({
      ...prev,
      billerName: selectedBiller?.label,
      customerField1: selectedBiller?.customerField1,
    }));
    getProducts(billerId);
  };

  const handleProductChange = async (productId: string) => {
    if (!productId) return;
    const selectedProduct = products?.find(props => props.value === productId);
    if (selectedProduct?.amountFixed) {
      formikRef?.current?.setFieldValue('amount', selectedProduct.amount);
    }
    setDetails(prev => ({
      ...prev,
      ...selectedProduct,
    }));
  };

  const getPhoneNumber = async () => {
    const selectedPhone = await pickContact();
    if (selectedPhone) {
      formikRef?.current?.setFieldValue('customerId', selectedPhone);
      return selectedPhone;
    }
  };

  const autoFillPhoneNo = () => {
    if (phoneNumber) {
      formikRef?.current?.setFieldValue('customerId', phoneNumber);
    }
  };

  useEffect(() => {
    if (categoryId) {
      formikRef.current?.setFieldValue('categoryId', +categoryId);
      handleCategoryChange(+categoryId);
    }
  }, [categories, categoryId]);

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
    formikRef.current?.setFieldValue('customerAccountNumber', account);
  }, [account]);

  useEffect(() => {
    const value = formikRef.current?.values?.customerAccountNumber;
    const selectedUserAccount = accounts.find(
      props => +props.accountNumber === +value,
    );
    setDetails(prev => ({
      ...prev,
      customerIdNo: selectedUserAccount?.customerId,
      customerName: selectedUserAccount?.accountName,
    }));
  }, [formikRef.current?.values?.customerAccountNumber]);

  useEffect(() => {
    getUserDebitAccounts();
    getCategories();
  }, []);

  useEffect(() => {
    dispatch(listBanks());
    dispatch(listInterBankBeneficiaries());
  }, []);

  useEffect(() => {
    const newBeneficiaries = beneficiaries?.map(
      ({ beneficiaryName, ...others }) => {
        const matchedBiller = billers?.find(
          ({ value }) => value === beneficiaryName,
        );
        return {
          ...others,
          category: matchedBiller?.label ?? '',
        };
      },
    );
    setBillBeneficiaries(newBeneficiaries);
  }, [beneficiaries, billers]);

  useEffect(() => {
    if (beneficiaryId) {
      const selectedBene = beneficiaries?.find(
        ({ id }) => id === beneficiaryId,
      );
      selectedBene && setSelectedBeneficiary(selectedBene);
      const selectedCategory = categories?.find(
        ({ label }) => label === selectedBene?.category,
      )?.value;
      formikRef.current?.setFieldValue('categoryId', selectedCategory);
      handleCategoryChange(Number(selectedCategory));
      formikRef.current?.setFieldValue(
        'billerId',
        selectedBene?.beneficiaryName,
      );
      formikRef.current?.setFieldValue('paymentItemId', selectedBene?.biller);
      handleProductChange(String(selectedBene?.biller));
    }
  }, [beneficiaryId]);

  useEffect(() => {
    const { billerId } = formikRef.current?.values ?? {};
    if (beneficiaryId && billerId) {
      handleBillerChange(billerId);
    }
  }, [formikRef.current?.values, billers, beneficiaryId]);

  useEffect(() => {
    const { paymentItemId } = formikRef.current?.values ?? {};
    if (beneficiaryId && paymentItemId) {
      handleProductChange(paymentItemId);
    }
  }, [formikRef.current?.values, products, beneficiaryId]);

  useEffect(() => {
    const { paymentItemId } = formikRef.current?.values ?? {};
    if (beneficiaryId && paymentItemId && selectedBeneficiary) {
      formikRef.current?.setFieldValue(
        'customerId',
        selectedBeneficiary.beneficiaryId,
      );
    }
  }, [formikRef.current?.values, selectedBeneficiary]);

  return (
    <PageContainer>
      <HeaderAuth
        noLogo
        headerTitle={type ? `${type} Payment` : 'Bills Payment'}
      />

      <LoadingModal
        isVisible={modal || Object.values(loading).some(Boolean)}
        onBackdropPress={() => setModal(true)}
        onBackButtonPress={() => setModal(true)}
      />

      <Formik
        innerRef={formikRef}
        validationSchema={othersValidationSchema}
        initialValues={{}}
        enableReinitialize={true}
        onSubmit={async values => {
          const payload = {
            ...details,
            ...values,
            customerIdNo: values.customerId,
            customerName: '',
            paymentCode: '',
            customerId: values.customerId,
            saveBeneficiary: values.saveBeneficiary,
          };
          console.log('payload', payload);
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
              type="bill"
              contacts={billBeneficiaries}
              onPress={setBeneficiaryId}
            />
            <YStack marginTop={16} marginBottom={24} gap={20}>
              <Select
                value={values.customerAccountNumber}
                onChange={value => {
                  setFieldValue('customerAccountNumber', value);
                  setDetails(prev => ({
                    ...prev,
                    customerAccountNumber: String(value),
                  }));
                }}
                data={userAccounts as unknown as SelectOption[]}
                label="Account to Debit"
                placeholder={'Account to Debit'}
                error={
                  touched.customerAccountNumber && errors.customerAccountNumber
                }
              />
              <Select
                value={values?.categoryId}
                onChange={value => {
                  setFieldValue('categoryId', value);
                  setFieldValue('billerId', '');
                  setFieldValue('paymentItemId', '');
                  setFieldValue('amount', '');
                  handleCategoryChange(+value);
                }}
                data={categories}
                popularItems={[
                  'Airtime Top-up',
                  'Airtime and Data',
                  'Airtel Data',
                  'Cable TV',
                  'Utilities',
                ]}
                label="Category"
                loading={loading.category}
                placeholder={'Category'}
                error={touched.categoryId && errors.categoryId}
              />

              {details?.categoryName ? (
                <Select
                  value={values?.billerId}
                  onChange={value => {
                    setFieldValue('billerId', value);
                    setFieldValue('paymentItemId', '');
                    setFieldValue('amount', '');
                    handleBillerChange(value as string);
                  }}
                  data={billers}
                  label="Billers"
                  loading={loading.bill}
                  placeholder={'Biller'}
                  error={touched.billerId && errors.billerId}
                />
              ) : null}

              {details?.billerName ? (
                <Select
                  value={values?.paymentItemId}
                  onChange={value => {
                    setFieldValue('paymentItemId', value);
                    setFieldValue('amount', '');
                    handleProductChange(value as string);
                  }}
                  data={products}
                  loading={loading.product}
                  label="Products"
                  placeholder={'Product'}
                  error={touched.paymentItemId && errors.paymentItemId}
                />
              ) : null}

              {details?.paymentItemName ? (
                <Input
                  label="Amount"
                  placeholder="amount"
                  keyboardType={'number-pad'}
                  value={String(formatToDecimal(details?.amount ?? 0))}
                  disabled={details.amountFixed}
                  onChangeText={text => {
                    handleChange('amount')(text);
                    setDetails({ ...details, amount: +text });
                  }}
                  onBlur={handleBlur('amount')}
                  error={touched.amount && errors.amount}
                />
              ) : null}

              {details?.paymentItemName ? (
                <Input
                  value={values.customerId}
                  onChangeText={handleChange('customerId')}
                  onBlur={handleBlur('customerId')}
                  label={details?.customerField1}
                  placeholder={`${details?.customerField1?.toLowerCase()}`}
                  error={touched.customerId && errors.customerId}
                  endIcon={
                    <TouchableOpacity onPress={getPhoneNumber}>
                      <UserAdd color={colors.grey04} variant="Bulk" size={23} />
                    </TouchableOpacity>
                  }
                />
              ) : null}
              {details?.customerField1 &&
              details?.paymentItemName &&
              details?.customerField1?.includes('Phone') ? (
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
              ) : null}

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
                  onValueChange={(newValue: boolean) =>
                    setFieldValue('saveBeneficiary', newValue)
                  }
                />
              </XStack>
            </YStack>

            <View marginTop="auto">
              <Button
                onPress={() => handleSubmit()}
                disabled={!(isValid && dirty)}
                width={'100%'}
                marginBlock={24}
                loading={false}
              >
                Proceed
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default BillsPage;
