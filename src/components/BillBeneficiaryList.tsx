/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import {
  moderateScale,
  global,
  verticalScale,
  horizontalScale,
} from '../theme/metrics';
import { Avatar, Text, View, YStack } from 'tamagui';
import getAvatarName from '../util/getAvatarName';
import { Trash } from 'iconsax-react-native';
import hexToRgbA from '../util/hexToRgbA';
import { useTheme } from '../context/ThemeContext';
import { AddBillBeneficiary_ } from '../types/bills-payments.types';

interface Props {
  onEdit: () => void;
  onDelete: () => void;
  item: AddBillBeneficiary_;
  len: number;
  key: number;
}

const BillBeneficiaryList: React.FC<Props> = ({ onDelete, item }) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    avatarView: {
      width: horizontalScale(36),
      height: verticalScale(36),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: moderateScale(50),
    },

    avatarText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(13),
      fontStyle: 'normal',
      fontWeight: '500',
      // color: colors.black,
    },

    nameText: {
      fontFamily: 'Inter-Medium',
      fontSize: moderateScale(13),
      fontStyle: 'normal',
      fontWeight: '500',
      textTransform: 'capitalize',
    },

    bankText: {
      fontSize: moderateScale(12),
    },

    border: {
      width: '100%',
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 1,
      marginTop: verticalScale(18),
    },

    actionText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(7),
      fontStyle: 'normal',
      fontWeight: '500',
    },
  });

  return (
    <View>
      <View style={{ ...global.flexRowSpace, marginTop: verticalScale(15) }}>
        <View style={{ ...global.rowCenter }}>
          {item?.beneficiaryName && (
            <Avatar
              circular
              size="$8"
              width={45}
              height={45}
              backgroundColor={colors.input}
            >
              <Avatar.Image accessibilityLabel={item?.beneficiaryName} />
              <Text color={colors.primary} fontSize={14} fontWeight="500">
                {getAvatarName(item?.beneficiaryName)}
              </Text>
            </Avatar>
          )}

          <YStack gap={6} style={{ marginLeft: horizontalScale(10) }}>
            <Text
              style={{
                ...styles.nameText,
              }}
              color={colors.grey06}
            >
              {item?.beneficiaryId}{' '}
            </Text>
            <Text
              style={{
                ...styles.bankText,
              }}
              color={colors.grey04}
            >
              {item?.category}
            </Text>
          </YStack>
        </View>

        <View style={{ ...global.rowCenter }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: hexToRgbA(colors.error, 0.05),
              borderRadius: 100,
            }}
            onPress={onDelete}
          >
            <Trash color={colors.error} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          ...styles.border,
        }}
      ></View>
    </View>
  );
};

export default BillBeneficiaryList;
