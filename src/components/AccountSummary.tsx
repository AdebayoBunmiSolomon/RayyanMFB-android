import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import { formatToDecimal } from '../util/format';
import { useTheme } from '../context/ThemeContext';

export default function AccountSummaryDetails({
  accountType,
  acctBalance,
  status,
  ledgerBalance,
  withdrwableBalance,
}: any) {
  const { colors } = useTheme();
  return (
    <YStack
      padding={20}
      borderRadius={16}
      borderWidth={1}
      borderColor={'#ECECEC'}
    >
      <Text
        color={colors.lightPrimary}
        fontSize={16}
        fontFamily="Inter-SemiBold"
      >
        Info
      </Text>
      <YStack marginTop={24}>
        <XStack gap={24}>
          <View flex={1}>
            <Text color={colors.grey05} fontFamily="Inter-SemiBold">
              Description
            </Text>
            <Text color={colors.grey04} marginTop={8} lineHeight={18}>
              {accountType}
            </Text>
          </View>
          <View flex={1}>
            <Text color={colors.grey05} fontFamily="Inter-SemiBold">
              Status
            </Text>
            <Text
              marginTop={8}
              textTransform="uppercase"
              fontFamily="Inter-SemiBold"
              color={status === 'A' ? '#1D9A6C' : '#FE2A2A'}
            >
              {status === 'A' ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <View flex={1}></View>
        </XStack>
        <XStack gap={24} marginTop={16}>
          <View flex={1}>
            <Text color={colors.grey05} fontFamily="Inter-SemiBold">
              Ledger Bal.
            </Text>
            <Text color={colors.grey04} marginTop={8} lineHeight={18}>
              ₦{formatToDecimal(ledgerBalance)}
            </Text>
          </View>
          <View flex={1}>
            <Text color={colors.grey05} fontFamily="Inter-SemiBold">
              Withdrawable
            </Text>
            <Text color={colors.grey04} marginTop={8} lineHeight={18}>
              ₦{formatToDecimal(withdrwableBalance)}
            </Text>
          </View>
          <View flex={1}>
            <Text color={colors.grey05} fontFamily="Inter-SemiBold">
              Available Bal.
            </Text>
            <Text color={colors.grey04} marginTop={8} lineHeight={18}>
              ₦{formatToDecimal(acctBalance)}
            </Text>
          </View>
        </XStack>
      </YStack>
    </YStack>
  );
}
