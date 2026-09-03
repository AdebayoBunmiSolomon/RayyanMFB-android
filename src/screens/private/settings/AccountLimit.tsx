/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import HeaderAuth from '../../../components/HeaderAuth';
import { Heading, Stack, Text, XStack, YStack } from 'tamagui';
import KycLevel from '../../../components/KycLevel';
import { TouchableOpacity } from 'react-native';
import Sizes, { normalizeSize } from '../../../util/size';
import ArrowRight from '../../../assets/svg/arrow-right-green.svg';
import { useTheme } from '../../../context/ThemeContext';
import AccountLimits from '../../../components/AccountLimits';
import { useAppSelector } from '../../../hooks/hook';
import { accountLimits } from '../../../mock';
import { Tier } from '../../../types';
import Button from '../../../components/Button';
import { useApi } from '../../../hooks/useApi';
import { Accounts_ } from '../../../types/transactions.types';

const AccountLimit: FC<MainStackScreenProps<'AccountLimit'>> = ({
  navigation,
}) => {
  const [loading_, setLoading_] = useState(false);
  const [accLimits, setAccLimits] = useState<Tier | any>(undefined);
  const [disableUpgrade, setDisableUpgrade] = useState(false);

  const { requestInit, loading } = useApi({
    endpoint: 'fetchSingleAccountUpgrade',
  });

  const { colors } = useTheme();

  const { selectedAccount } = useAppSelector(state => state.account);

  useEffect(() => {
    const currentLimits = accountLimits[Number(selectedAccount.kycLevel) - 1];
    setAccLimits(currentLimits);
  }, [selectedAccount]);

  useEffect(() => {
    const fetchAccountUpgradeReq = async () => {
      const response = await requestInit();
      if (response?.data?.response.length) {
        const fnMatchAcc = response?.data?.response?.filter(
          ({ accountNumber }: Accounts_) =>
            accountNumber === selectedAccount?.accountNumber,
        );
        const lastReq = fnMatchAcc?.at(-1);
        if (
          Number(selectedAccount?.kycLevel) > 2 ||
          lastReq.status?.toLowerCase() === 'pending'
        ) {
          return setDisableUpgrade(true);
        }
        setDisableUpgrade(false);
      }
    };
    fetchAccountUpgradeReq();
  }, [selectedAccount]);

  return (
    <PageContainer>
      {loading_ && (
        <LoadingModal
          isVisible={loading_}
          onBackdropPress={() => setLoading_(true)}
          onBackButtonPress={() => setLoading_(true)}
        />
      )}

      <HeaderAuth headerTitle="Account Limits" noLogo />

      <YStack marginTop={32} gap={16}>
        <KycLevel
          cta={
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountAllLimit')}
            >
              <Stack flexDirection="row" alignItems="center" gap={6}>
                <Heading
                  color={colors.lightPrimary}
                  fontFamily="Inter-Bold"
                  fontWeight="600"
                  fontSize={normalizeSize(14)}
                >
                  View All Limits
                </Heading>
                <ArrowRight color={colors.lightPrimary} />
              </Stack>
            </TouchableOpacity>
          }
        />
        <YStack
          borderWidth={1}
          borderColor={colors.borderColor}
          borderRadius={16}
          backgroundColor={colors.white}
          padding={normalizeSize(24)}
        >
          <Heading
            color={colors.grey05}
            fontWeight={'600'}
            fontFamily="Inter-SemiBold"
            fontSize={normalizeSize(14)}
          >
            Current Tier Limits
          </Heading>
          <XStack gap={14}>
            <AccountLimits limits={accLimits?.limits?.slice(0, 2)} />
            <AccountLimits limits={accLimits?.limits?.slice(2, 4)} />
          </XStack>
          <AccountLimits limits={accLimits?.limits?.slice(-1)} />
        </YStack>
      </YStack>
      <YStack marginTop="auto">
        {/* <View
          backgroundColor={colors.rgba}
          paddingHorizontal={8}
          paddingVertical={4}
          borderRadius={5}
          alignSelf="center"
          left={2}
          top={-12}>
          <Text
            fontFamily="Inter-SemiBold"
            fontWeight={'600'}
            fontSize={Sizes.fontMedium}>
            KYC request pending
          </Text>
        </View> */}
        <Button
          disabled={disableUpgrade}
          loading={loading}
          onPress={() => navigation.navigate('AccountUpgrade')}
        >
          <Text
            fontFamily="Inter-SemiBold"
            fontWeight={'600'}
            fontSize={Sizes.fontMedium}
          >
            Upgrade Tier
          </Text>
        </Button>
      </YStack>
    </PageContainer>
  );
};

export default AccountLimit;
