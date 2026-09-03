import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import { verticalScale, global, colors, moderateScale } from '../theme/metrics';
import Moment from 'moment';
import { formatToDecimal } from '../util/format';
import { BillsContent } from '../types/bills-payments.types';
import { useAppSelector } from '../hooks/hook';

interface BillProps {
  onPress: () => void;
  item: BillsContent;
}

const Bill: React.FC<BillProps> = ({ onPress, item }) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          ...global.flexRowSpace,
          marginTop: verticalScale(13),
        }}
      >
        <Text style={styles.typeText}>{item?.categoryName}</Text>
        <Text
          style={{
            ...styles.amountText,
          }}
        >
          N{formatToDecimal(Number(item?.amount))}
        </Text>
      </View>
      <View style={{ marginTop: verticalScale(11) }}>
        <Text style={styles.transText}>{item?.billerName}</Text>
      </View>

      <View style={{ marginTop: verticalScale(11) }}>
        <Text style={styles.transText} numberOfLines={1}>
          {item?.customerId}
        </Text>
      </View>

      <View style={{ marginTop: verticalScale(11) }}>
        <Text style={styles.dateTime}>
          {Moment(item?.createdOn).format('LLL')}
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

export default Bill;

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
