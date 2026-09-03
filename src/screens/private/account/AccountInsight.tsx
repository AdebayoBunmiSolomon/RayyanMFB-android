/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import { useAppSelector } from '../../../hooks/hook';
import DashboardSlides from '../../../components/DashboardSlides';
import { formatToNaira } from '../../../util/format';
import { useTheme } from '../../../context/ThemeContext';
import moment from 'moment';
import { useApi } from '../../../hooks/useApi';

const AccountInsight = () => {
  const [balance, setBalance] = useState<any>({});
  const [activeSlide, setActiveSlide] = useState(0);

  const { requestInit } = useApi({ endpoint: 'getAccountOfficer' });
  const { accounts } = useAppSelector(state => state.account);

  useEffect(() => {
    setBalance(accounts[activeSlide]);
  }, [accounts, activeSlide]);

  useEffect(() => {
    const getAccountOfficer = async () => {
      try {
        const res = await requestInit();
        if (res?.data?.length) {
          setBalance(res?.data[activeSlide]);
        }
      } catch (error) {}
    };
    getAccountOfficer();
  }, [activeSlide]);

  const { colors } = useTheme();

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Account Insight" />
      {accounts?.length ? (
        <View style={{ width: '100%', marginTop: 14 }}>
          <DashboardSlides
            views={accounts}
            activeSlide={activeSlide}
            setActiveSlide={slide => setActiveSlide(slide)}
            noActions
          />
        </View>
      ) : null}

      <YStack
        padding={20}
        borderRadius={16}
        marginTop={24}
        borderWidth={1}
        borderColor={colors.borderColor}
      >
        <Text
          color={colors.lightPrimary}
          fontSize={16}
          fontFamily="Inter-SemiBold"
        >
          Account Info
        </Text>
        <YStack marginTop={24}>
          <XStack gap={24}>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Open Date
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {moment(balance?.account?.accountOpenDate).format('LL')}
              </Text>
            </View>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Type
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {balance?.account?.accountType}
              </Text>
            </View>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Available
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {formatToNaira(balance?.account?.availableBalance)}
              </Text>
            </View>
          </XStack>
          <XStack gap={24} marginTop={16}>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Withdrawable
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {formatToNaira(balance?.account?.withdrawableAmount)}
              </Text>
            </View>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Book Balance
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {formatToNaira(balance?.account?.bookBalance)}
              </Text>
            </View>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Freeze Status
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {balance?.account?.freezeCode ?? 'N/A'}
              </Text>
            </View>
          </XStack>
          <XStack gap={24} marginTop={16}>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Home Branch
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {balance?.branchName}
              </Text>
            </View>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Account Officer
              </Text>
              <Text color={colors.grey04} marginTop={8} lineHeight={18}>
                {balance?.officerName} {balance?.phoneNumber}
              </Text>
            </View>
            <View flex={1}>
              <Text color={colors.grey05} fontFamily="Inter-SemiBold">
                Activity
              </Text>
              {balance?.account?.accountStatus ? (
                <Text
                  marginTop={8}
                  textTransform="uppercase"
                  fontFamily="Inter-SemiBold"
                  color={
                    balance?.account?.accountStatus === 'A'
                      ? '#1D9A6C'
                      : '#FE2A2A'
                  }
                >
                  {balance?.account?.accountStatus === 'A'
                    ? 'Active'
                    : 'Inactive'}
                </Text>
              ) : null}
            </View>
          </XStack>
        </YStack>
      </YStack>
    </PageContainer>
  );
};

export default AccountInsight;
