import React from 'react';
import { Text, View, XStack } from 'tamagui';
import HeaderAuth from './HeaderAuth';
import { colors, global, moderateScale, verticalScale } from '../theme/metrics';
import { formatToDecimal, replaceCharacters } from '../util/format';
import { StyleSheet } from 'react-native';
import moment from 'moment';
import { useAppSelector } from '../hooks/hook';

const ReceiptExport = ({ details }: any) => {
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
      backgroundColor: colors.white,
      width: '100%',
      height: 'auto',
      borderRadius: 16,
      marginTop: 24,
      overflow: 'hidden',
    },
  });

  const { selectedAccount } = useAppSelector(state => state.account);

  return (
    <>
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
            `${details?.firstName} ${details?.lastName}`}
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
            details?.customerDepositSlipNumber}
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
            details?.paymentItemName}
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
          {moment(details?.tranDate).format('LLL')}
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
        <Text style={styles.rightText}>{details?.remarks}</Text>
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
    </>
  );
};

export default ReceiptExport;
