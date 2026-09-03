import React, { FC, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { TouchableOpacity } from 'react-native';
import { useAppSelector } from '../../../hooks/hook';
import BulkTransferSummary from '../../../components/BulkTransferSummary';
import bulkDetailStyles from '../../../styles/bulkDetails';
import { Text, View, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import UserFaceScanIcon from '../../../assets/svg/User_scan_duotone.svg';
import colors from '../../../theme/color';
import Button from '../../../components/Button';
import { BagCross, Edit } from 'iconsax-react-native';
import hexToRgbA from '../../../util/hexToRgbA';
import {
  removeBulkTransfer,
  resetBulkTransfer,
} from '../../../slices/bulkSlice';
import { useDispatch } from 'react-redux';
import { useApi } from '../../../hooks/useApi';
import CustomFab from '../../../components/CustomFab';
import SuccessModal from '../../../components/modals/SuccessModal';
import LoadingModal from '../../../components/modals/LoadingModal';
import normalizeAndCheckText from '../../../util/normalizeAndCheckText';
import { useAppToast } from '../../../hooks/useAppToast';
import TokenInputModal from '../../../components/modals/TokenInputModal';

const TransferSummary: FC<MainStackScreenProps<'TransferSummary'>> = ({
  navigation,
}) => {
  const summary = useAppSelector(state => state.bulkTransfer);
  const lastSummaryTxn = summary[summary.length - 1];
  const { currentTheme } = useAppSelector(state => state.theme);
  const [successModal, setSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTokenModal, setShowTokenModal] = useState(false);

  const { requestInit } = useApi({
    endpoint: 'createBulk',
  });
  const sendTokenApi = useApi({
    endpoint: 'sendToken',
  });

  const { styles } = bulkDetailStyles(currentTheme as any);
  const { showError, showSuccess } = useAppToast();

  const dispatch = useDispatch();

  const removeTxnHandler = (accountId: number) => {
    dispatch(removeBulkTransfer(accountId));
  };

  const handleSubmit = async (token: string) => {
    setLoading(true);
    try {
      const payload = {
        debitAccount: lastSummaryTxn.debitAccount,
        token,
        creditRequestList: summary.map(
          ({
            accountName,
            accountNameEnquiry,
            accountNumber,
            amount,
            narration,
            sortCode,
            beneficiaryBankCode,
            bank,
          }) => ({
            accountName,
            accountNameEnquiry,
            accountNumber,
            amount,
            sortCode,
            narration,
            beneficiaryBankCode: beneficiaryBankCode ?? undefined,
            bulkTransferType: normalizeAndCheckText(bank, 'RAYYAN MFB')
              ? 'WITHIN_BANK_TRANSFER'
              : 'INTER_BANK_TRANSFER',
          }),
        ),
      };
      const response = await requestInit(payload);
      if (response?.status === 200) {
        dispatch(resetBulkTransfer());
        setSuccessModal(true);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // send token
  const requestTokenHandler = async () => {
    setLoading(true);

    try {
      const res = await sendTokenApi.requestInit();
      if (res?.data?.error === false) {
        showSuccess(
          'We’ve sent a token to your email. Please check your inbox.',
        );
        return setShowTokenModal(true);
      }
      showError('Unable to send token. Please try again.');
    } catch (error) {
      showError('An error occurred while requesting token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageContainer>
        {successModal && (
          <SuccessModal
            title="Bulk Transfer Successfully Initiated"
            isVisible={successModal}
            onBackdropPress={() => setSuccessModal(false)}
            onBackButtonPress={() => setSuccessModal(false)}
            onSwipeComplete={() => setSuccessModal(false)}
            closeModal={() => setSuccessModal(false)}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          />
        )}

        {loading && (
          <LoadingModal
            isVisible={loading}
            onBackdropPress={() => setLoading(true)}
            onBackButtonPress={() => setLoading(true)}
          />
        )}

        {showTokenModal && (
          <TokenInputModal
            visible={showTokenModal}
            onClose={() => setShowTokenModal(false)}
            onSuccess={function (): void {
              throw new Error('Function not implemented.');
            }}
            requestTokenAPI={requestTokenHandler}
            validateTokenAPI={(token: string) => {
              setShowTokenModal(false);
              handleSubmit(token);
            }}
          />
        )}
        <HeaderAuth headerTitle="Transfer Summary" noLogo />
        <View marginTop={32} flex={1}>
          {/* divider */}
          <BulkTransferSummary />
          {/* summary */}
          <View style={styles.container}>
            {summary?.map(
              ({
                id,
                accountNameEnquiry,
                accountNumber,
                narration,
                amount,
                bank,
              }) => {
                return (
                  <View key={id} style={styles.summary}>
                    <View>
                      <Text style={styles.name}>{accountNameEnquiry}</Text>
                      <XStack gap={10} marginTop={4} alignItems="center">
                        <Text style={styles.account}>{accountNumber}</Text>
                        <View
                          width={5}
                          height={5}
                          borderRadius={100}
                          backgroundColor={colors.primary}
                        />
                        <Text style={styles.account}>{bank}</Text>
                      </XStack>
                      <Text style={{ ...styles.narration, marginTop: 'auto' }}>
                        {narration}
                      </Text>
                    </View>
                    <YStack justifyContent="space-between" flex={1} gap={16}>
                      {/* actions */}
                      <XStack
                        style={styles.actions}
                        marginBottom="auto"
                        gap={6}
                      >
                        <TouchableOpacity
                          style={{
                            backgroundColor: colors.rgba10,
                            padding: 5,
                            borderRadius: 6,
                          }}
                        >
                          <Edit
                            size={18}
                            variant="Bulk"
                            color={colors.grey05}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => removeTxnHandler(id as number)}
                          style={{
                            backgroundColor: hexToRgbA(colors.error, 0.1),
                            padding: 5,
                            borderRadius: 6,
                          }}
                        >
                          <BagCross
                            size={18}
                            variant="Bulk"
                            color={colors.error}
                          />
                        </TouchableOpacity>
                      </XStack>
                      <Text style={styles.amount}>{amount}</Text>
                    </YStack>
                  </View>
                );
              },
            )}
          </View>
          <XStack marginTop={'auto'} marginBottom={16} gap={10}>
            <Button
              onPress={requestTokenHandler}
              flex={1}
              disabled={!summary.length}
            >
              Request Token
            </Button>
          </XStack>
        </View>
      </PageContainer>
      <View bottom={100}>
        <CustomFab
          onPress={() =>
            navigation.navigate('BulkMultiTransfer', {
              screenType: lastSummaryTxn?.type,
            })
          }
          title="Add New Transfer"
        />
      </View>
    </>
  );
};

export default TransferSummary;
