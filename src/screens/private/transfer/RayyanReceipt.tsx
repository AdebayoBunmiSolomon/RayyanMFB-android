/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet } from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import { moderateScale, global, verticalScale } from '../../../theme/metrics';
import { formatToDecimal, replaceCharacters } from '../../../util/format';
import Moment from 'moment';
// import {useLazyGetTransferReceiptQuery} from '../../../api/transfer';
import LoadingModal from '../../../components/modals/LoadingModal';
// import {TransferReceiptParams} from '../../../types/transfer.types';
import { shareJpgReceipt } from '../../../services/base64ToPdf';
import ViewShot from 'react-native-view-shot';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, View, XStack } from 'tamagui';
import Button from '../../../components/Button';
import { IntraBankResponse } from '../../../types/transfer.types';
import { useApi } from '../../../hooks/useApi';
import { useTheme } from '../../../context/ThemeContext';
import ReceiptExport from '../../../components/ReceiptExport';
import { useAppSelector } from '../../../hooks/hook';

const RayyanReceipt: FC<MainStackScreenProps<'RayyanReceipt'>> = ({
  navigation,
  route,
}) => {
  const getSingleTransactionDetails = useApi({
    endpoint: 'getSingleTransactionDetails',
  });

  const { item } = route.params;

  const { firstName, lastName } = useAppSelector(state => state.profile);

  const { tranId, narration, amount, uniqueIdentifier } = item?.data ?? {};

  const [details, setDetails] = useState<null | IntraBankResponse['data']>(
    null,
  );

  const [loadingModal, setLoadingModal] = useState(false);
  const ref = useRef<any>(null);
  const [_, setUri] = useState('');

  useEffect(() => {
    setDetails(prev => ({ ...prev, ...item.data }));
  }, [item.data]);

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    scroll: {
      flexGrow: 1,
    },

    onlineText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(24),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.grey06,
    },

    transText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(14),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.grey05,
    },

    border: {
      width: '100%',
      borderBottomColor: '#1D9A6C',
      borderBottomWidth: 1,
      marginTop: verticalScale(18),
    },

    rightText: {
      fontWeight: '500',
      fontSize: 14,
      fontStyle: 'normal',
      fontFamily: 'Inter-Regular',
      color: colors.grey05,
      maxWidth: '50%',
      textAlign: 'right',
    },

    leftText: {
      fontWeight: '500',
      fontSize: moderateScale(14),
      fontStyle: 'normal',
      fontFamily: 'Inter-Regular',
      color: colors.grey05,
    },

    doneText: {
      fontWeight: '500',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontFamily: 'Inter-Regular',
      color: colors.otpBorderColor,
    },

    shareText: {
      fontWeight: '600',
      fontSize: moderateScale(8),
      fontStyle: 'normal',
      fontFamily: 'Inter-Regular',
      color: colors.rgba65,
      marginTop: verticalScale(5),
    },

    receiptContainer: {
      position: 'relative',
      backgroundColor: colors.white,
      width: '100%',
      height: 'auto',
      borderRadius: 16,
      marginTop: 24,
      overflow: 'hidden',
    },
  });

  useEffect(() => {
    if (uniqueIdentifier) {
      const getTransactionDetails = async () => {
        setLoadingModal(true);

        try {
          // const _newDate = Moment(tranDate).format('YYYY-MM-DD');

          const res = await getSingleTransactionDetails.requestInit(
            undefined,
            `/v1/transfer/${tranId}?narration=${narration}&amount=${10}&uniqueIdentifier=${uniqueIdentifier}`,
          );
          if (
            res?.data.code === '00' ||
            res?.data.code === '06' ||
            res?.data.code === '31'
          ) {

            setDetails(prev => ({ ...prev, ...res?.data?.data }));
            console.log("transaction details", res?.data?.data )
          }
        } catch (error) {
        } finally {
          setLoadingModal(false);
        }
      };
      getTransactionDetails();
    }
  }, [uniqueIdentifier]);

  // const [receipt] = useLazyGetTransferReceiptQuery();

  // const generatePdfReceiptShare = async (val: TransferReceiptParams) => {
  //   setLoadingModal(true);
  //   try {
  //     const res = await receipt(val).unwrap();
  //     if (res?.fileContent) {
  //       await convertBase64ToPdf(res.fileContent, res.fileName);
  //     }
  //   } catch (error) {
  //   } finally {
  //     setLoadingModal(false);
  //   }
  // };

  useEffect(() => {
    ref?.current?.capture().then((uri: any) => {
      setUri(uri);
    });
  }, []);

  const shareReceiptHandler = async () => {
    ref?.current?.capture().then(async (uri: any) => {
      setUri(uri);
      await shareJpgReceipt(uri);
    });
  };

  const { selectedAccount } = useAppSelector(state => state.account);

  return (
    <PageContainer>
      {loadingModal && (
        <LoadingModal
          isVisible={loadingModal}
          onBackdropPress={() => setLoadingModal(true)}
          onBackButtonPress={() => setLoadingModal(true)}
        />
      )}
      <HeaderAuth
        bckArrowFunc={() =>
          uniqueIdentifier
            ? navigation.goBack()
            : navigation.navigate('Tabs', { screen: 'Home' })
        }
        headerTitle="Transaction Receipt"
        noLogo
      />
      <View style={styles.receiptContainer}>
        {/* <TouchableOpacity onPress={shareReceiptHandler} style={{zIndex: 2}}>
          <View
            padding={16}
            backgroundColor={colors.rgba20}
            borderRadius={16}
            position="absolute"
            top={24}
            left={24}>
            <DirectSend color={colors.primary} variant="Outline" />
          </View>
        </TouchableOpacity> */}
        <View
          style={{
            padding: 24,
            backgroundColor: colors.white,
          }}
        >
          <XStack justifyContent="flex-end">
            <HeaderAuth noBckArrow />
          </XStack>

          <View style={{ marginTop: verticalScale(18) }}>
            <View gap={4}>
              <Text style={styles.onlineText}>Online Banking</Text>
              <Text style={styles.transText}>Transaction Receipt</Text>
            </View>
          </View>

          <View
            style={{
              ...styles.border,
              marginTop: verticalScale(14),
            }}
          ></View>

          <View
            style={{
              ...global.flexRowSpace,
              marginTop: verticalScale(10),
            }}
          >
            <Text style={styles.leftText}>Payer</Text>
            <Text style={styles.rightText}>
              {details?.customerAccountName ??
                selectedAccount?.accountName ??
                `${firstName} ${lastName}`}
            </Text>
          </View>

          <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
            <Text style={{ ...styles.rightText, fontSize: moderateScale(16) }}>
              {replaceCharacters(details?.customerAccountNumber as string)}
            </Text>
          </View>
          {/* Receiver start */}
          <View
            style={{
              ...styles.border,
            }}
          ></View>

          <View
            style={{
              ...global.flexRowSpace,
              marginTop: verticalScale(9),
            }}
          >
            <Text style={styles.leftText}>Receiver</Text>
            <Text style={{ ...styles.rightText, textTransform: 'capitalize' }}>
              {details?.beneficiaryAccountName ??
                details?.customerDepositSlipNumber ??
                details?.customerId}
            </Text>
          </View>

          {details?.beneficiaryAccountNumber ? (
            <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
              <Text style={{ ...styles.rightText }}>
                {details?.beneficiaryAccountNumber}
              </Text>
            </View>
          ) : (
            ''
          )}
          <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
            <Text style={{ ...styles.rightText }}>
              {details?.financialInstitution?.institutionName ??
                details?.paymentItemName ??
                'Rayyan'}
            </Text>
          </View>
          {/* Receiver end */}

          <View
            style={{
              ...styles.border,
            }}
          ></View>

          <View
            style={{
              ...global.flexRowSpace,
              marginTop: verticalScale(9),
            }}
          >
            <Text style={styles.leftText}>Transaction</Text>
            <Text style={styles.rightText}>
              NGN {formatToDecimal(details?.amount as number)}
            </Text>
          </View>

          <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
            <Text style={{ ...styles.rightText, textTransform: 'capitalize' }}>
              {details?.transferType
                ? details?.transferType?.replace(/_/g, ' ')
                : details?.categoryName}
            </Text>
          </View>

          <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
            <Text style={styles.rightText}>
              {Moment(details?.tranDate).format('LLL')}
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
              marginTop: verticalScale(9),
            }}
          >
            <Text style={styles.leftText}>Narration</Text>
            <Text style={styles.rightText}>
              {details?.remarks ?? details?.narration}
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
              marginTop: verticalScale(9),
              gap: 12,
            }}
          >
            <Text style={styles.leftText}>Txn Reference</Text>
            <Text style={styles.rightText}>
              {details?.referenceNumber ?? details?.transactionRef}
            </Text>
          </View>

          <View
            style={{
              ...styles.border,
              marginTop: 14,
            }}
          ></View>
          <View
            style={{
              ...global.flexRowSpace,
              marginTop: verticalScale(9),
              marginBottom: 24,
            }}
          >
            <Text style={styles.leftText}>Status</Text>
            <Text
              style={{
                ...styles.rightText,
              }}
            >
              {/* {statusDescription} */}
              {details?.status === '00' || details?.code === '00'
                ? 'Transaction Successful'
                : 'Transaction Failed'}
            </Text>
          </View>
        </View>
        {/* hidden snapshot */}
        <ViewShot
          style={{
            padding: 24,
            backgroundColor: 'white',
            position: 'absolute',
            zIndex: -1,
            left: 0,
            top: 0,
            height: '100%',
            width: '100%',
          }}
          ref={ref}
          options={{
            fileName: 'Transaction Receipt',
            format: 'jpg',
            quality: 0.9,
          }}
        >
          <ReceiptExport details={{ ...details, firstName, lastName }} />
        </ViewShot>
      </View>
      <Button marginTop={24} marginBottom={16} onPress={shareReceiptHandler}>
        Share Receipt
      </Button>
    </PageContainer>
  );
};

export default RayyanReceipt;
