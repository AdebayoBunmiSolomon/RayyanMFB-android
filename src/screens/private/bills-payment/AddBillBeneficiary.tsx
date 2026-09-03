/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { global } from '../../../theme/metrics';
import { Formik } from 'formik';
import * as yup from 'yup';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import LoadingModal from '../../../components/modals/LoadingModal';
import {
  AddBillBeneficiary_,
  Categories,
  CategoryBills,
} from '../../../types/bills-payments.types';
import BillersModal from '../../../components/modals/BillersModal';
import SuccessModal from '../../../components/modals/SuccessModal';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import { View, YStack } from 'tamagui';
import Select from '../../../components/Select';
import { SelectDataProps } from '../../../types';
import Input from '../../../components/Input';

const addValidationSchema = yup.object().shape({
  beneficiaryId: yup.string().required('Customer ID is required'),
  beneficiaryName: yup.string().required('Customer name is required'),
});

const AddBillBeneficiary: FC<
  MainStackScreenProps<'AddBillBeneficiary'>
> = ({}) => {
  const [details, setDetails] = useState({
    amount: '',
    billerId: '',
    billerName: '',
    categoryId: '',
    categoryName: '',
    customerAccountNumber: '',
    customerId: '',
    amountFixed: false,
    customerField1: '',
    beneficiaryId: '',
    beneficiaryName: '',
  });

  const listCategories = useApi({ endpoint: 'listCategories' });
  const listBillersByCategoryName = useApi({
    endpoint: 'listBillersByCategoryName',
  });
  const addBillerBeneficiary = useApi({
    endpoint: 'addBillerBeneficiary',
  });

  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [billersModal, setBillersModal] = useState(false);
  const [billers, setBillers] = useState<CategoryBills[]>([]);
  const [categories, setCategories] = useState<SelectDataProps[] | undefined>(
    undefined,
  );

  const getCategories = async () => {
    setModal(true);
    try {
      const res = await listCategories.requestInit();
      if (res?.data?.length) {
        const categoryMap = res?.data?.map(
          ({ categoryId, id, categoryName }: Categories) => ({
            label: categoryName,
            value: String(categoryId),
            key: id,
          }),
        );
        setCategories(categoryMap);
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  const getBillersByCategoryName = async (val: string) => {
    setModal(true);
    try {
      const res = await listBillersByCategoryName.requestInit(
        undefined,
        `/v1/bills-payment/categories/${val}/bills`,
      );
      if (res?.data?.length) {
        setBillers(res?.data);
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  const addBillBeneficiary = async (
    val: AddBillBeneficiary_,
    setErrors: any,
  ) => {
    setLoading(true);
    try {
      const res = await addBillerBeneficiary.requestInit(val);
      if (res?.data?.response?.id) {
        setSuccessModal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // categories
  const handleCategoryChange = async (categoryId: string | null) => {
    if (!categoryId) return;
    const fnCategory = categories?.find(props => props.value === categoryId);
    setDetails(prev => ({
      ...prev,
      categoryId: fnCategory?.value,
      categoryName: fnCategory?.label,
    }));
    await getBillersByCategoryName(fnCategory?.label);
  };

  // billers
  const handleBillerChange = async (billId: string | null) => {
    if (!billId) return;
    const fnBiller = billers?.find(props => props.value === billId);
    setDetails({
      ...details,
      billerId: fnBiller?.value,
      billerName: fnBiller?.label,
      customerField1: fnBiller?.customerField1,
    });
  };

  return (
    <PageContainer>
      {modal && (
        <LoadingModal
          isVisible={modal}
          onBackdropPress={() => setModal(true)}
          onBackButtonPress={() => setModal(true)}
        />
      )}
      {/* 
      {categoriesModal && (
        <CategoriesModal
          isVisible={categoriesModal}
          onBackdropPress={() => setCategoriesModal(false)}
          onBackButtonPress={() => setCategoriesModal(false)}
          onSwipeComplete={() => setCategoriesModal(false)}
          closeModal={() => setCategoriesModal(false)}
          setSelectedCategory={async item => {
            setDetails({
              ...details,
              categoryId: item?.categoryId.toString(),
              categoryName: item?.categoryName,
            });

            await getBillersByCategoryName(item?.categoryName);
          }}
          data={categories}
        />
      )} */}

      {billersModal && (
        <BillersModal
          isVisible={billersModal}
          onBackdropPress={() => setBillersModal(false)}
          onBackButtonPress={() => setBillersModal(false)}
          onSwipeComplete={() => setBillersModal(false)}
          closeModal={() => setBillersModal(false)}
          setSelectedBiller={async item => {
            setDetails({
              ...details,
              billerId: item?.billerId.toString(),
              billerName: item?.billerName,
              customerField1: item?.customerField1,
            });
          }}
          data={billers}
        />
      )}

      {successModal && (
        <SuccessModal
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(false)}
          onBackButtonPress={() => setSuccessModal(false)}
          onSwipeComplete={() => setSuccessModal(false)}
          closeModal={() => setSuccessModal(false)}
          title={`Beneficiary Added ${`\n`} Successfully`}
          onPress={() => {}}
        />
      )}

      <HeaderAuth headerTitle="Add Beneficiary" noLogo />

      <Formik
        validationSchema={addValidationSchema}
        initialValues={(details && details) || {}}
        onSubmit={async (values, { setErrors }) => {
          const payload = {
            beneficiaryId: values.beneficiaryId,
            beneficiaryName: values.beneficiaryName,
            biller: details.billerName,
            category: details.categoryName,
          };
          await addBillBeneficiary(payload, setErrors);
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
        }) => (
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              {/* <TouchableOpacity
              style={{
                ...styles.selectContainer,
                borderColor:
                  currentTheme === 'dark' ? colors.white : colors.black,
                marginTop: verticalScale(24),
              }}
              onPress={() => {
                setDetails({
                  ...details,
                  categoryId: '',
                  categoryName: '',
                  billerId: '',
                  billerName: '',
                });
                setCategoriesModal(true);
              }}>
              <Text style={styles.label}>Category</Text>

              <View style={{...global.flexRowSpace}}>
                <Text
                  style={{
                    ...styles.selectText,
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                  numberOfLines={1}>
                  {details?.categoryName
                    ? details.categoryName
                    : 'Select Category'}
                </Text>

                <DownLight
                  fill={currentTheme === 'dark' ? colors.white : 'none'}
                />
              </View>
            </TouchableOpacity> */}
              <Select
                value={values?.categoryId}
                onChange={value => {
                  handleCategoryChange(value);
                  setFieldValue('categoryId', value);
                  setFieldValue('billerId', '');
                  setFieldValue('paymentItemId', '');
                  setFieldValue('amount', '');
                }}
                data={categories}
                label="Category"
                placeholder={'Category'}
                error={touched.categoryId && errors.categoryId}
              />

              {/* {details?.categoryName ? (
              <TouchableOpacity
                style={{
                  ...styles.selectContainer,
                  borderColor:
                    currentTheme === 'dark' ? colors.white : colors.black,
                  marginTop: verticalScale(17),
                }}
                onPress={() => {
                  setDetails({
                    ...details,
                    billerId: '',
                    billerName: '',
                  });
                  setBillersModal(true);
                }}>
                <Text style={styles.label}>Billers</Text>

                <View style={{...global.flexRowSpace}}>
                  <Text
                    style={{
                      ...styles.selectText,
                      color:
                        currentTheme === 'dark' ? colors.white : colors.black,
                    }}
                    numberOfLines={1}>
                    {details?.billerName ? details.billerName : 'Select Biller'}
                  </Text>

                  <DownLight
                    fill={currentTheme === 'dark' ? colors.white : 'none'}
                  />
                </View>
              </TouchableOpacity>
            ) : null} */}

              {details?.categoryName ? (
                <Select
                  value={values?.billerId}
                  onChange={value => {
                    handleBillerChange(value);
                    setFieldValue('billerId', value);
                    setFieldValue('paymentItemId', '');
                    setFieldValue('amount', '');
                  }}
                  data={billers}
                  label="Billers"
                  placeholder={'Biller'}
                  error={touched.billerId && errors.billerId}
                />
              ) : null}

              {details?.customerField1 ? (
                <Input
                  value={values.beneficiaryId}
                  onChangeText={handleChange('beneficiaryId')}
                  onBlur={handleBlur('beneficiaryId')}
                  label={details?.customerField1}
                  placeholder={details?.customerField1}
                  error={touched.customerField1 && errors.customerField1}
                />
              ) : null}

              {details?.customerField1 ? (
                <Input
                  value={values.beneficiaryName}
                  onChangeText={handleChange('beneficiaryName')}
                  onBlur={handleBlur('beneficiaryName')}
                  label={'Beneficiary Nickname'}
                  placeholder={'Account Nick Name'}
                  error={touched.beneficiaryName && errors.beneficiaryName}
                />
              ) : null}
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
                disabled={!isValid}
                width={'100%'}
                loading={loading}
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

export default AddBillBeneficiary;
