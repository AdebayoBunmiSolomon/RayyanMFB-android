import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  verticalScale,
  global,
  moderateScale,
  colors,
} from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainerHeader from '../../../components/PageContainerHeader';
import MainContainer from '../../../components/MainContainer';
import Line from '../../../assets/svg/line.svg';
import Biometric from '../../../assets/svg/biometric.svg';
import Button from '../../../components/Button';
import PinModal from '../../../components/modals/PinModal';
import TransferSuccessModal from '../../../components/modals/TransferSuccessModal';
import {
  AddBeneficiary_,
  IntraBank,
  IntraBankResponse,
} from '../../../types/transfer.types';
import SuccessModal from '../../../components/modals/SuccessModal';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setDebitAccounts } from '../../../slices/transferSlice';
import { GET_P, SAVE_P } from '../../../services/storage';
// import TouchID from 'react-native-touch-id';
import { useApi } from '../../../hooks/useApi';
import runBiometricAuth from '../../../services/biometricAuth';

const ReviewsRayyan: FC<MainStackScreenProps<'ReviewsRayyan'>> = ({
  navigation,
  route,
}) => {
  const getDebitAccounts = useApi({
    endpoint: 'getDebitAccounts',
  });
  const intraBankTranfer = useApi({
    endpoint: 'intraBankTranfer',
  });
  const addBeneficiary = useApi({
    endpoint: 'addBeneficiary',
  });

  const { item } = route.params;

  const { currentTheme } = useAppSelector(state => state.theme);

  const amount = item.amount.replace(/,/g, '');

  const [value, setValue] = useState('');

  const [p, setP] = useState('');

  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState(false);

  const [modalData, setModalData] = useState({});

  const [successModal, setSuccessModal] = useState(false);

  const [loadingModal, setLoadingModal] = useState(false);

  const [beneficiaryAdded, setBeneficiaryAdded] = useState(false);

  const dispatch = useAppDispatch();

  const getUserDebitAccounts = async () => {
    try {
      const res = await getDebitAccounts.requestInit();
      if (res?.data?.code === '00') {
        dispatch(setDebitAccounts(res?.data));
      }
    } catch (error) {
    } finally {
    }
  };

  const [payload, setPayload] = useState({
    accountName: '',
    accountNumber: '',
    beneficiaryBank: '',
    beneficiaryBankName: '',
  });

  const addNewBeneficiary = async (val: AddBeneficiary_) => {
    setSuccessModal(false);
    setLoadingModal(true);
    try {
      const res = await addBeneficiary.requestInit(val);
      if (res?.data?.code === '00') {
        setBeneficiaryAdded(true);
      }
    } catch (error) {
    } finally {
      setLoadingModal(false);
    }
  };

  const transferRayyanBank = async (val: IntraBank) => {
    setLoading(true);
    try {
      const res = await intraBankTranfer.requestInit(val);
      if (res?.data?.code === '00') {
        const payload_ = {
          accountName: res?.data?.data?.customerAccountName as string,
          accountNumber: res?.data?.data?.customerAccountNumber,
          beneficiaryBank: res?.data?.data?.beneficiaryBank as string,
          beneficiaryBankName: res?.data?.data.beneficiaryBankName as string,
        };
        setValue('');
        setModalData(res?.data);
        setPayload(payload_);
        setSuccessModal(true);
      }
    } catch (error) {
      setValue('');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricAuth = async () => {
    await runBiometricAuth(async () => {
      const payload = {
        ...item,
        beneficiaryBank: item.beneficiaryBank as string,
        amount: Number(amount),
        transactionPin: p,
        addBeneficiaryFlag: 'N',
        beneficiaryPrefferedName: item.beneficiaryAccountName,
      };
      await transferRayyanBank(payload);
    });
  };

  useEffect(() => {
    (async () => {
      const res = await GET_P();
      if (res) {
        setP(res);
      }
    })();
  }, []);
  return (
    <PageContainer>
      {modal && (
        <PinModal
          isVisible={modal}
          onBackdropPress={() => setModal(false)}
          onBackButtonPress={() => setModal(false)}
          value={value}
          setValue={async val => {
            setValue(val);
            if (val.length === 4) {
              setModal(false);
              const payload = {
                ...item,
                beneficiaryBank: item.beneficiaryBank as string,
                amount: Number(amount),
                transactionPin: val,
                addBeneficiaryFlag: 'N',
                beneficiaryPrefferedName: item.beneficiaryAccountName,
              };
              await SAVE_P(val);
              await transferRayyanBank(payload);
            }
          }}
        />
      )}

      {
        <LoadingModal
          isVisible={loading}
          onBackdropPress={() => setLoading(false)}
          onBackButtonPress={() => setLoading(false)}
        />
      }

      {loadingModal && (
        <LoadingModal
          isVisible={loadingModal}
          onBackdropPress={() => setLoadingModal(true)}
          onBackButtonPress={() => setLoadingModal(true)}
        />
      )}

      {successModal && (
        <TransferSuccessModal
          message="Transaction Successful"
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(true)}
          onBackButtonPress={() => setSuccessModal(true)}
          onSwipeComplete={() => setSuccessModal(true)}
          closeModal={async () => {
            setSuccessModal(false);
            await getUserDebitAccounts();
          }}
          onViewReceipt={() => {
            setSuccessModal(false);
            navigation.navigate('RayyanReceipt', {
              item: modalData as IntraBankResponse,
            });
          }}
          onAddBeneficiary={async () => {
            setSuccessModal(false);
            await addNewBeneficiary(payload);
          }}
        />
      )}

      {beneficiaryAdded && (
        <SuccessModal
          isVisible={beneficiaryAdded}
          onBackdropPress={() => setBeneficiaryAdded(false)}
          onBackButtonPress={() => setBeneficiaryAdded(false)}
          onSwipeComplete={() => setBeneficiaryAdded(false)}
          closeModal={() => setBeneficiaryAdded(false)}
          onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          title={`Beneficiary Added ${`\n`} Successful`}
        />
      )}
      <PageContainerHeader
        title="Review"
        onPress={() => navigation.goBack()}
        height={verticalScale(90)}
      />

      <MainContainer bgColor={'transparent'}>
        <ScrollView
          style={styles.scroll}
          // keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ ...global.flexRow, marginTop: verticalScale(23) }}>
            <Text
              style={{
                ...styles.amountText,
                color: currentTheme === 'dark' ? colors.white : colors.userText,
              }}
            >
              ₦{item?.amount}
            </Text>
          </View>

          <View style={{ ...global.flexRow, marginTop: verticalScale(2) }}>
            <Line />
          </View>

          <View
            style={{ ...global.flexRowSpace, marginTop: verticalScale(14) }}
          >
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
                fontSize: moderateScale(13),
              }}
            >
              From
            </Text>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
                fontSize: moderateScale(13),
              }}
            >
              To
            </Text>
          </View>

          <View style={{ ...global.flexRowSpace, marginTop: verticalScale(8) }}>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              {item?.customerAccountNumber}
            </Text>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              {item?.beneficiaryAccountNumber}
            </Text>
          </View>

          <View style={{ ...global.flexRowSpace, marginTop: verticalScale(8) }}>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
                fontSize: moderateScale(13),
              }}
            >
              savings account
            </Text>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
                fontSize: moderateScale(13),
                textTransform: 'capitalize',
              }}
            >
              {item?.beneficiaryAccountName}
            </Text>
          </View>

          <View
            style={{ ...global.flexRowSpace, marginTop: verticalScale(48) }}
          >
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              Commission
            </Text>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              ₦0.00
            </Text>
          </View>

          <View
            style={{
              ...styles.border,
            }}
          ></View>

          <View
            style={{ ...global.flexRowSpace, marginTop: verticalScale(34) }}
          >
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              Narration
            </Text>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              {item.remarks}
            </Text>
          </View>

          <View
            style={{
              ...styles.border,
            }}
          ></View>

          <View
            style={{ ...global.flexRowSpace, marginTop: verticalScale(34) }}
          >
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              Total Debit
            </Text>
            <Text
              style={{
                ...styles.leftText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
                fontSize: moderateScale(16),
              }}
            >
              ₦{item.amount}
            </Text>
          </View>

          <View
            style={{
              ...styles.border,
            }}
          ></View>

          <View
            style={{
              ...global.flexRowSpace,
              marginTop: verticalScale(27),
              marginBottom: verticalScale(60),
            }}
          >
            <Button
              onPress={() => {
                setModal(true);
              }}
              disabled={false}
              width={'46%'}
            >
              PIN
            </Button>

            {p ? (
              <Button
                onPress={() => {
                  handleBiometricAuth();
                }}
                disabled={false}
                width={'46%'}
                backgroundColor={colors.lightPrimary}
                iconAfter={<Biometric />}
              >
                Biometrics
              </Button>
            ) : null}
          </View>
        </ScrollView>
      </MainContainer>
    </PageContainer>
  );
};

export default ReviewsRayyan;

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },

  amountText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: moderateScale(12),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.userText,
  },

  rightText: {
    fontWeight: '500',
    fontStyle: 'normal',
    fontFamily: 'JosefinSans-Regular',
  },

  leftText: {
    fontWeight: '500',
    fontStyle: 'normal',
    fontFamily: 'JosefinSans-Regular',
  },

  border: {
    width: '100%',
    borderBottomColor: colors.appPrimary,
    borderBottomWidth: 1,
    marginTop: verticalScale(17),
  },
});
