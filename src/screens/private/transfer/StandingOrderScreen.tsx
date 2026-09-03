import React, { useEffect, useState } from 'react';
import { Text, validPseudoKeys, View, XStack } from 'tamagui';
import StandingOrderForm, {
  CreateStandingOrderType,
} from '../../../components/form/StandingOrderForm';
import { useStandingOrderLogic } from '../../../hooks/transfer/useStandingOrderLogic';
import { TouchableOpacity } from 'react-native';
import typography from '../../../theme/typography';
import colors from '../../../theme/color';
import { useApi } from '../../../hooks/useApi';
import { useAppSelector } from '../../../hooks/hook';
import LoadingModal from '../../../components/modals/LoadingModal';
import { useAppToast } from '../../../hooks/useAppToast';
import { StandingOrderList } from '../../../components/form/StandingOrderList';
import PinModal from '../../../components/modals/PinModal';
import HeaderAuth from '../../../components/HeaderAuth';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { useGetStandingOrder } from '../../../hooks/services/useGetStandingOrder';

const StandingOrderScreen: React.FC<
  MainStackScreenProps<'StandingOrderScreen'>
> = ({ route }) => {
  const account = useAppSelector(
    state => state.account.selectedAccount.accountNumber,
  );
  const { transDetails } = (route.params as any) ?? {};
  const { showError, showSuccess } = useAppToast();
  const [showTransPinModal, setShowTransPinModal] = useState<boolean>(false);
  const [transPinValue, setTransPinValue] = useState<string>('');
  const { loadingGetReq, standingOrderData, orderState, setOrderState } =
    useGetStandingOrder();

  const [creating, setCreating] = useState(false);
  const [createStandingOrderPayload, setCreateStandingOrderPayload] = useState<
    CreateStandingOrderType | {}
  >({});
  const orderTypes = ['History', 'Transfer'];

  const createStandingOrderAPI = useApi({
    endpoint: 'createStandingOrder',
    onSuccess() {
      showSuccess('Standing created successfully');
    },
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.code as string,
        _errorDetails?.message || 'Failed to create standing order',
      );
    },
  });

  const createStandingOrder = async (values: any) => {
    console.log('payload', values);
    setShowTransPinModal(true);
    setCreateStandingOrderPayload({
      debitAccount: values?.sourceAcct,
      amount: values?.amount,
      intervalDays: values?.intervalDays,
      start: values?.startDate,
      end: values?.endDate,
      benAccountNumber: values?.beneficiaryAccountNumber,
      bankCode: values?.institutionCode,
      benAccountName: values?.beneficiaryAccountName,
      narration: values?.narration,
      transactionPin: '',
    });
  };

  useEffect(() => {
    if (!transPinValue || transPinValue.length < 4) return;

    const initiateCreateStandingOrder = async () => {
      setShowTransPinModal(false);
      setTimeout(() => {
        setCreating(true);
      }, 400);
      const payload = {
        ...createStandingOrderPayload,
        transactionPin: transPinValue,
      };

      try {
        const res = await createStandingOrderAPI.requestInit(payload);

        if (res?.status === 201) {
          setTransPinValue('');

          setTimeout(() => {
            setOrderState('History');
          }, 400);
        } else {
          console.log('Unexpected response:', res, 'payload', payload);
        }
      } catch (err) {
        console.log('error', err);
        setTransPinValue('');
      } finally {
        setCreating(false);
      }
    };

    initiateCreateStandingOrder();
  }, [transPinValue]);

  const {
    contacts,
    userAccounts,
    bankList,
    selectedBankObj,
    accountName,
    inputText,
    setInputText,
    formikRef,
    interUsedLeft,
    updateBankInfo,
    handleItemPress,
    selectedBeneficiariesHash,
    getAccBalance,
    loading,
  } = useStandingOrderLogic({
    onPress: createStandingOrder,
    account,
    transDetails,
  });

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Standing Order" />
      <View flex={1}>
        <LoadingModal
          isVisible={creating || loadingGetReq}
          onBackdropPress={() => {}}
          onBackButtonPress={() => {}}
        />

        <PinModal
          isVisible={showTransPinModal}
          onBackdropPress={() => {
            setShowTransPinModal(false);
            setTransPinValue('');
          }}
          onBackButtonPress={() => {
            setShowTransPinModal(false);
            setTransPinValue('');
          }}
          value={transPinValue}
          setValue={val => setTransPinValue(val)}
        />

        <XStack gap={10} justifyContent="center" paddingHorizontal={10}>
          {orderTypes.map((value, index) => (
            <TouchableOpacity
              style={{
                borderBottomWidth: orderState === value ? 2 : 0,
                borderBottomColor:
                  orderState === value ? colors.primary : colors.grey,
                width: '50%',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 7,
              }}
              key={index}
              onPress={() => setOrderState(value as 'History' | 'Transfer')}
            >
              <Text
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontSize: typography.bodyMedium.fontSize,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color:
                    orderState === value ? colors.textSecondary : colors?.grey,
                }}
              >
                {value}
              </Text>
            </TouchableOpacity>
          ))}
        </XStack>

        {orderState === 'History' ? (
          <StandingOrderList data={standingOrderData} />
        ) : (
          <StandingOrderForm
            loading={loading}
            contacts={contacts}
            userAccounts={userAccounts}
            bankList={bankList}
            selectedBankObj={selectedBankObj}
            accountName={accountName}
            inputText={inputText}
            setInputText={setInputText}
            formikRef={formikRef}
            onPress={createStandingOrder}
            interUsedLeft={interUsedLeft}
            updateBankInfo={updateBankInfo}
            handleItemPress={handleItemPress}
            selectedBeneficiariesHash={selectedBeneficiariesHash}
            getAccBalance={getAccBalance}
            creating={creating}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default StandingOrderScreen;
