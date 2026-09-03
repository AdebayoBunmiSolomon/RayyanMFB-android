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
import { Trash } from 'iconsax-react-native';
import hexToRgbA from '../util/hexToRgbA';
import { useTheme } from '../context/ThemeContext';
import { RequestTypes } from '../types';
import * as Icons from 'iconsax-react-native';
import { serviceRequests } from '../util/logoMap';
import moment from 'moment';

interface Props {
  item: RequestTypes;
  len: number;
  key: number;
}

const RequestList: React.FC<Props> = ({ item }) => {
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

  const icon = serviceRequests[item?.requestName];
  const iconProps: keyof typeof Icons | null = icon;
  const Icon = Icons[iconProps ?? 'Home'];

  return (
    <View>
      <View style={{ ...global.flexRowSpace, marginTop: verticalScale(15) }}>
        <View style={{ ...global.rowCenter }}>
          <Avatar
            circular
            size="$8"
            width={42}
            height={42}
            backgroundColor={colors.input}
          >
            <Icon color={colors.primary} variant="Bulk" size={22} />
          </Avatar>

          <YStack gap={5} style={{ marginLeft: horizontalScale(10) }}>
            <Text
              style={{
                ...styles.nameText,
              }}
              color={colors.grey06}
            >
              {item?.requestName}{' '}
            </Text>
            <Text
              style={{
                ...styles.bankText,
              }}
              color={colors.grey04}
            >
              {moment(item?.dateRequested).format('LL')} -{' '}
              {item?.approvalStatus ?? 'Under Review'}
            </Text>
          </YStack>
        </View>

        <View style={{ ...global.rowCenter }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              padding: 10,
              backgroundColor: hexToRgbA(
                item?.currentStatus === 'P'
                  ? colors.amberYellow
                  : colors.softGreen,
                0.05,
              ),
              borderRadius: 100,
            }}
          >
            {item?.currentStatus === 'P' ? (
              <Icons.Timer1 color={colors.amberYellow} size={22} />
            ) : (
              <Icons.TickCircle color={colors.softGreen} size={22} />
            )}
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

export default RequestList;
