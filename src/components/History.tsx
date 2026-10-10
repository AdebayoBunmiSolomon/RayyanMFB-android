/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { TenTransactions } from '../types/transactions.types';
import { formatToNaira, parseTransactionDate } from '../util/format';
import { Text, View, XStack, YStack } from 'tamagui';
import { ExportSquare, ImportSquare, Repeat } from 'iconsax-react-native';
import { useTheme } from '../context/ThemeContext';
import { useApi } from '../hooks/useApi';
import { useNavigation } from '@react-navigation/native';
import { isTransactionRepeatable } from '../util/isTransactionRepeatable';
import { useAppToast } from '../hooks/useAppToast';

interface HistoryProps {
  onPress: () => void;
  setLoadingModal: (arg0: boolean) => void;
  item: TenTransactions;
}

const History: React.FC<HistoryProps> = ({
  onPress,
  setLoadingModal,
  item,
}) => {
  const navigation = useNavigation();
  const { showSuccess, showError } = useAppToast();

  const transactionDate = parseTransactionDate(item);
  const formattedDate = transactionDate?.isValid()
    ? transactionDate.format('LLL')
    : 'Invalid Date';

  const canRepeatTransaction = isTransactionRepeatable(
    item?.tranType,
    item?.uniqueIdentifier,
  );

  const { colors } = useTheme();
  // const {showToast} = useToast();

  const getSingleTransactionDetails = useApi({
    endpoint: 'getSingleTransactionDetails',
    onSuccess: () => {},
    onError: (_error, _errorDetails) => {
      showError(
        String(_errorDetails?.code),
        _errorDetails?.message || 'Failed to repeat transaction.',
      );
    },
  });

  useEffect(() => {
    const getTransactionBillDetails = async () => {
      setLoadingModal(true);

      try {
        const res = await getSingleTransactionDetails.requestInit(
          undefined,
          `/v1/bills-payment/4208263`,
        );
      } catch (error) {
      } finally {
        setLoadingModal(false);
      }
    };
    getTransactionBillDetails();
  }, []);

  const getTransactionDetails = async () => {
    setLoadingModal(true);

    try {
      const res = await getSingleTransactionDetails.requestInit(
        undefined,
        `/v1/transfer/${item?.tranId}?narration=${item?.narration}&amount=${item?.debitAmount}&uniqueIdentifier=${item?.uniqueIdentifier}`,
      );
      if (
        res?.data.code === '00' ||
        res?.data.code === '06' ||
        res?.data.code === '31'
      ) {
        const {
          financialInstitution,
          beneficiaryAccountName,
          customerAccountNumber,
          beneficiaryAccountNumber,
          beneficiaryBank,
          amount,
          remarks,
        } = res?.data?.data;

        // console.log('from history', res?.data?.data);

        const payload = {
          institutionName: financialInstitution?.institutionName,
          institutionCode: financialInstitution?.institutionCode,
          accountName: beneficiaryAccountName,
          customerAccountNumber: customerAccountNumber,
          accountNumber: beneficiaryAccountNumber,
          beneficiaryBank,
          amount: formatToNaira(amount).replaceAll('₦', ''),
          narration: remarks,
        };

        console.log('payload from history', payload);
        navigation.navigate('Transfer', {
          type: 'other',
          transDetails: payload,
        });
      }
    } catch (_error) {
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <TouchableOpacity>
      <XStack
        gap={10}
        maxWidth="100%"
        paddingBlock={16}
        borderBottomWidth={1}
        borderBottomColor={colors.borderColor}
      >
        <XStack flex={1} gap={10} onPress={onPress}>
          <View>
            {item.tranType === 'C' ? (
              <ImportSquare size={18} color={colors.primary} />
            ) : (
              <ExportSquare size={18} color={colors.primary} />
            )}
          </View>
          <YStack gap={4} flex={1}>
            <Text color={colors.grey05} fontFamily="Inter-Medium">
              {item?.narration}
            </Text>
            <Text color={colors.grey04}>{formattedDate}</Text>
          </YStack>
          {/* amount */}
          <View paddingRight={8} justifyContent="center">
            <Text
              fontFamily="Inter-SemiBold"
              color={item.tranType === 'C' ? colors.credit : colors.debit}
            >
              {item.tranType === 'C'
                ? formatToNaira(Number(item.creditAmount))
                : formatToNaira(Number(item.debitAmount))}
            </Text>
          </View>
        </XStack>
        {/* repeat transaction */}
        {canRepeatTransaction ? (
          <TouchableOpacity>
            <YStack
              onPress={getTransactionDetails}
              gap={4}
              alignItems="center"
              justifyContent="center"
              paddingInline={12}
              borderColor={colors.borderColor}
              borderLeftWidth={1}
              borderRadius={8}
            >
              <Repeat color={colors.primary} size={20} />
              <Text
                color={colors.grey05}
                fontSize={13}
                fontFamily="Inter-Medium"
              >
                Repeat
              </Text>
            </YStack>
          </TouchableOpacity>
        ) : null}
      </XStack>
    </TouchableOpacity>
  );
};

export default History;
