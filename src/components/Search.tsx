import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { verticalScale, global, colors, moderateScale } from '../theme/metrics';
import {
  TenTransactions,
  TransactionDetails,
} from '../types/transactions.types';
import Moment from 'moment';
import { formatToDecimal } from '../util/format';
import { useAppSelector } from '../hooks/hook';

interface SearchProps {
  onPress: () => void;
  item: TransactionDetails;
}

const Search: React.FC<SearchProps> = ({ onPress, item }) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  return (
    <TouchableOpacity
      style={{ marginTop: verticalScale(11) }}
      onPress={onPress}
    >
      <View>
        <Text
          style={{
            ...styles.transText,
            color:
              currentTheme === 'dark' ? colors.white : colors.otpBorderColor,
          }}
        >
          {item?.narration}
        </Text>
      </View>

      <View style={{ marginTop: verticalScale(11) }}>
        <Text
          style={{
            ...styles.dateTime,
            color: currentTheme === 'dark' ? colors.white : colors.date,
          }}
        >
          {/* {Moment(item.tranDate).format('LLL')} */}
          {item?.tranDate}
        </Text>
      </View>

      <View
        style={{
          ...global.flexRowSpace,
          marginTop: verticalScale(11),
        }}
      >
        <Text
          style={{
            ...styles.typeText,
            color:
              currentTheme === 'dark' ? colors.white : colors.otpBorderColor,
          }}
        >
          {item.tranType === 'C' ? 'Credit' : 'Debit'}
        </Text>
        <Text
          style={{
            ...styles.amountText,
            color: item.tranType === 'C' ? colors.credit : colors.debit,
          }}
        >
          N
          {item.tranType === 'C'
            ? formatToDecimal(Number(item.creditAmount))
            : formatToDecimal(Number(item.debitAmount))}
        </Text>
      </View>

      <View
        style={{
          ...styles.border,
        }}
      ></View>
    </TouchableOpacity>
  );
};

export default Search;

const styles = StyleSheet.create({
  border: {
    width: '100%',
    borderBottomColor: colors.appPrimary,
    borderBottomWidth: 1,
    marginTop: verticalScale(10),
  },

  transText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },

  dateTime: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.date,
  },

  amountText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
  },

  typeText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },
});
