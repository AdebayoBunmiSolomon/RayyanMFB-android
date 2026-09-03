import React, { useEffect, useState } from 'react';
import { Alert, FlatList } from 'react-native';
import { StandingOrderResponse } from '../../types/transfer.types';
import { Text, XStack, YStack } from 'tamagui';
import typography from '../../theme/typography';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../hooks/hook';
import Button from '../Button';
import Sizes from '../../util/size';
import { useApi } from '../../hooks/useApi';
import { useAppToast } from '../../hooks/useAppToast';
import PinModal from '../modals/PinModal';
import { useGetStandingOrder } from '../../hooks/services/useGetStandingOrder';

type IStandingOrderType = {
  data: StandingOrderResponse[];
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);

  const day = date.getDate();

  const getOrdinalSuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th';

    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };

  const month = date.toLocaleString('en-US', {
    month: 'long',
  });

  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} of ${month} ${year}`;
};

export const StandingOrderList: React.FC<IStandingOrderType> = ({ data }) => {
  const { colors } = useTheme();
  const { currentTheme } = useAppSelector(state => state.theme);
  const { showSuccess, showError } = useAppToast();
  const [stopping, setStopping] = useState<boolean>(false);
  const [showTransPinModal, setShowTransPinModal] = useState<boolean>(false);
  const [transPinValue, setTransPinVal] = useState<string>('');
  const [directDebitId, setDirectDebitId] = useState<string>('');
  const { initiateGetStandingOrder } = useGetStandingOrder();

  const deleteStandingOrderAPI = useApi({
    endpoint: 'deleteStandingOrder',
    onSuccess: () => {
      showSuccess('Standing order deleted successfully');
    },
    onError(_error, errorDetails) {
      showError(
        String(errorDetails?.code),
        errorDetails?.message || 'Failed to delete standing order',
      );
    },
  });

  const stopStandingOrder = async (id: any) => {
    setDirectDebitId(id);
    setShowTransPinModal(true);
  };

  // useEffect(() => {
  //   if (!transPinValue || transPinValue.length !== 4) return;

  //   setShowTransPinModal(false); // ← close PIN modal first

  //   const initiateStopStandingOrder = async () => {
  //     setStopping(true);

  //     try {
  //       const res = await deleteStandingOrderAPI.requestInit(
  //         undefined,
  //         `v1/retail/directdebit/${directDebitId}?transactionPin=${transPinValue}`,
  //       );

  //       if (res?.status === 200) {
  //         await initiateGetStandingOrder();
  //       }
  //     } catch (err) {
  //       console.log('Error stopping standing order', err);
  //     } finally {
  //       setStopping(false);
  //       setTransPinVal(''); // ← reset PIN so effect doesn't re-fire
  //     }
  //   };

  //   initiateStopStandingOrder();
  // }, [transPinValue, directDebitId]);

  useEffect(() => {
    if (!transPinValue || transPinValue.length !== 4) return;

    const pin = transPinValue;

    Alert.alert(
      'Stop Standing Order',
      'Are you sure you want to stop this standing order?',
      [
        {
          text: 'Cancel',
          onPress: () => {
            setShowTransPinModal(false);
            setTransPinVal('');
          },
        },
        {
          text: 'Confirm',
          onPress: async () => {
            setStopping(true);
            setShowTransPinModal(false);
            try {
              const res = await deleteStandingOrderAPI.requestInit(
                undefined,
                `v1/retail/directdebit/${directDebitId}?transactionPin=${pin}`,
              );

              if (res?.status === 200) {
                await initiateGetStandingOrder();
              }
            } catch (err) {
              console.log('Error stopping standing order', err);
            } finally {
              setStopping(false);
              setTransPinVal('');
            }
          },
        },
      ],
    );
  }, [transPinValue, directDebitId]);

  return (
    <>
      <PinModal
        isVisible={showTransPinModal}
        onBackdropPress={() => {
          setShowTransPinModal(false);
          setTransPinVal('');
        }}
        onBackButtonPress={() => {
          setShowTransPinModal(false);
          setTransPinVal('');
        }}
        value={transPinValue}
        setValue={val => setTransPinVal(val)}
      />
      <FlatList
        data={data}
        contentContainerStyle={{
          gap: 5,
          marginTop: 10,
        }}
        keyExtractor={(__, index) => `${__.id}${index.toString()}`}
        renderItem={({ item, index }) => (
          <YStack
            key={index}
            borderWidth={1}
            borderColor={colors.primary}
            borderRadius={10}
            paddingVertical={10}
            paddingHorizontal={10}
          >
            <XStack justifyContent="space-between">
              <Text
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontSize: 11,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color: colors.primary,
                }}
              >
                {item?.benAccountName}
              </Text>

              <Text
                fontSize={9}
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color: currentTheme === 'light' ? colors.black : colors.grey,
                  fontWeight: '600',
                }}
              >
                Created, {formatDate(item?.dateCreated)}
              </Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontSize: typography.bodyXSmall.fontSize,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color: colors.primary,
                }}
              >
                {item?.benAccountNumber}
              </Text>
              <Text
                fontSize={9}
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color: currentTheme === 'light' ? colors.black : colors.grey,
                  fontWeight: '600',
                }}
              >
                ₦{item?.amount}.00
              </Text>
            </XStack>
            <XStack justifyContent="space-between">
              <Text
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontSize: typography.bodyXSmall.fontSize,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color: currentTheme === 'light' ? colors.black : colors.grey,
                }}
              >
                {item?.benBankName}
              </Text>
              <Text
                fontSize={9}
                style={{
                  lineHeight: typography.bodyMedium.lineHeight,
                  fontFamily: typography.bodyMedium.fontFamily,
                  color: currentTheme === 'light' ? colors.black : colors.grey,
                  fontWeight: '600',
                }}
              >
                {item?.intervalDays < 7
                  ? 'Daily'
                  : item?.intervalDays < 28
                  ? 'Weekly'
                  : 'Monthly'}
              </Text>
            </XStack>
            <Button
              onPress={async () => stopStandingOrder(item?.id)}
              disabled={stopping}
              loading={stopping}
              fontSize={Sizes.fontSmall}
              borderRadius={5}
              style={{
                height: 20,
                backgroundColor: colors.primary,
              }}
            >
              Cancel Standing Order
            </Button>
          </YStack>
        )}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        maxToRenderPerBatch={2}
        initialNumToRender={2}
        windowSize={2}
        updateCellsBatchingPeriod={100}
      />
    </>
  );
};
