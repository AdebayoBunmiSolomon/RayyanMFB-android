/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { global } from '../../../theme/metrics';
import { Formik } from 'formik';
import * as yup from 'yup';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import BanksModal from '../../../components/modals/BanksModal';
import SuccessModal from '../../../components/modals/SuccessModal';
import { useAppDispatch } from '../../../hooks/hook';
import { listBanks } from '../../../slices/transferSlice';
import LoadingModal from '../../../components/modals/LoadingModal';
import { AddBeneficiary_ } from '../../../types/transfer.types';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import { View, YStack } from 'tamagui';
import Select from '../../../components/Select';
import { SelectDataProps } from '../../../types';
import Input from '../../../components/Input';

const addValidationSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
  institutionCode: yup.string().required('Beneficiary bank is required'),
});

const AddBeneficiary: FC<MainStackScreenProps<'AddBeneficiary'>> = ({
  navigation,
}) => {
  const interBankNameEnquiry = useApi({ endpoint: 'interBankNameEnquiry' });
  const addBeneficiary = useApi({ endpoint: 'addBeneficiary' });

  // const {banks} = useAppSelector(state => state.transfer);

  const [banks, setBanks] = useState([]);
  const getBankList = useApi({
    endpoint: 'getBankList',
  });
  useEffect(() => {
    const fetchBanks = async () => {
      // setModal(true);
      try {
        const res = await getBankList.requestInit();
        if (res) {
          setBanks(res?.data);
        }
        // setModal(false);
      } catch (error) {
      } finally {
        // setModal(false);
      }
    };

    fetchBanks();
  }, []);

  const dispatch = useAppDispatch();

  const [bankModal, setBankModal] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const [inputText, setInputText] = useState('');
  const [bankList, setBankList] = useState<SelectDataProps[]>([]);
  const [successModal, setSuccessModal] = useState(false);

  const [selectedBeneficiariesHash, setSelectedBeneficiariesHash] = useState({
    preferredName: '',
    institutionName: '',
    accountName: '',
    accountNumber: '',
    institutionCode: '',
    isAvailable: false,
  });

  const getIntraName = async (accountNo: string, bankCode: string) => {
    if (!bankCode) {
      return;
    }
    setLoadingModal(true);
    try {
      const res = await interBankNameEnquiry.requestInit(
        undefined,
        `/v1/transfer/${accountNo}/${bankCode}/interbank/nameenquiry`,
      );

      if (res?.data?.success) {
        setSelectedBeneficiariesHash({
          ...selectedBeneficiariesHash,
          accountNumber: inputText,
          accountName: res.data?.message,
          isAvailable: res.data?.success,
        });
      }
      setSelectedBeneficiariesHash({
        ...selectedBeneficiariesHash,
        accountNumber: inputText,
        accountName: res?.data?.message,
        isAvailable: res?.data?.success,
      });
    } catch (error) {
    } finally {
      setLoadingModal(false);
    }
  };

  const addNewBeneficiary = async (val: AddBeneficiary_) => {
    setLoading(true);
    try {
      const res = await addBeneficiary.requestInit(val);
      if (res?.data?.code === '00') {
        setSuccessModal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const updateBankInfo = (value: string | null) => {
    const selectedBank = banks?.find(
      ({ institutionCode }) => institutionCode === value,
    );
    setSelectedBeneficiariesHash({
      ...selectedBeneficiariesHash,
      institutionName: selectedBank?.institutionName ?? '',
      institutionCode: selectedBank?.institutionCode ?? '',
    });
  };

  useEffect(() => {
    const bankMap = banks?.map(
      ({ institutionName, institutionCode }, index) => ({
        label: institutionName,
        value: institutionCode,
        key: index,
      }),
    );
    setBankList(bankMap);
  }, [banks]);

  useEffect(() => {
    if (inputText.length === 10) {
      // Call your API here
      getIntraName(inputText, selectedBeneficiariesHash.institutionCode);
    }
  }, [inputText, selectedBeneficiariesHash.institutionCode]);

  useEffect(() => {
    dispatch(listBanks());
  }, [dispatch]);

  return (
    <PageContainer>
      {bankModal && (
        <BanksModal
          isVisible={bankModal}
          onBackdropPress={() => setBankModal(false)}
          onBackButtonPress={() => setBankModal(false)}
          onSwipeComplete={() => setBankModal(false)}
          closeModal={() => setBankModal(false)}
          setSelectedBank={item => {
            setSelectedBeneficiariesHash({
              ...selectedBeneficiariesHash,
              institutionName: item?.institutionName,
              institutionCode: item?.institutionCode,
            });
          }}
        />
      )}

      {successModal && (
        <SuccessModal
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(false)}
          onBackButtonPress={() => setSuccessModal(false)}
          onSwipeComplete={() => setSuccessModal(false)}
          closeModal={() => setSuccessModal(false)}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          title={`Beneficiary Added ${`\n`} Successful`}
        />
      )}

      {loadingModal && (
        <LoadingModal
          isVisible={loadingModal}
          onBackdropPress={() => setLoadingModal(true)}
          onBackButtonPress={() => setLoadingModal(true)}
        />
      )}
      <HeaderAuth headerTitle="Add Beneficiaries" noLogo />

      <Formik
        validationSchema={addValidationSchema}
        initialValues={{
          accountNumber: '',
          institutionCode: '',
        }}
        onSubmit={async values => {
          const payload = {
            ...values,
            accountName: selectedBeneficiariesHash?.accountName,
            beneficiaryBank: selectedBeneficiariesHash?.institutionCode,
            beneficiaryBankName: selectedBeneficiariesHash?.institutionName,
          };
          await addNewBeneficiary(payload);
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          isValid,
          touched,
          setFieldValue,
        }) => (
          <View flex={1} marginTop={32}>
            <YStack marginBottom={24} gap={20}>
              <Select
                value={values.institutionCode}
                onChange={value => {
                  updateBankInfo(value);
                  setFieldValue('institutionCode', value);
                }}
                data={bankList}
                label="Beneficiary Bank Name"
                placeholder={'Bank Name'}
                popularItems={['ACCESS BANK']}
                error={touched.institutionCode && errors.institutionCode}
              />

              <Input
                value={values.accountNumber}
                onChangeText={text => {
                  handleChange('accountNumber')(text);
                  setInputText(text);
                }}
                onBlur={handleBlur('accountNumber')}
                label="Account Number"
                placeholder="Account Number"
                maxLength={10}
                keyboardType={'number-pad'}
                error={touched.accountNumber && errors.accountNumber}
              />

              {selectedBeneficiariesHash?.accountName &&
              selectedBeneficiariesHash.isAvailable &&
              inputText.length === 10 ? (
                <Input
                  label="Account Name"
                  editable={false}
                  value={selectedBeneficiariesHash?.accountName}
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
                disabled={!isValid || !selectedBeneficiariesHash.isAvailable}
                width={'100%'}
                loading={loading}
              >
                Add Beneficiary
              </Button>
            </View>
          </View>
        )}
      </Formik>
    </PageContainer>
  );
};

export default AddBeneficiary;
