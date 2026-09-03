/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import HeaderAuth from '../../../components/HeaderAuth';
import { Heading, Text, XStack, YStack, View } from 'tamagui';
import Sizes, { normalizeSize } from '../../../util/size';
import { useTheme } from '../../../context/ThemeContext';
import { accountLimits, accountUpgradeRequirements } from '../../../mock';
import { Image, KeyboardOpen } from 'iconsax-react-native';
import Button from '../../../components/Button';
import { useAppSelector } from '../../../hooks/hook';
import AccountLimits from '../../../components/AccountLimits';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useAppToast } from '../../../hooks/useAppToast';

const AccountUpgradeRequirements: FC<
  MainStackScreenProps<'AccountUpgradeRequirements'>
> = ({ navigation }) => {
  const [loading_, setLoading_] = useState(false);
  const { colors } = useTheme();
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const { selectedAccount } = useAppSelector(state => state.account);

  const handleUpgradePress = useCallback(() => {
    try {
      if (!selectedAccount) {
        showError('Account information is missing. Please try again.');
        return;
      }
      navigation.navigate('AccountUpgradeRequest');
    } catch (error) {
      console.error('Navigation error:', error);
      handleError(error as Error, 'AccountUpgradeRequirements:navigate');
      showError('Failed to navigate. Please try again.');
    }
  }, [selectedAccount]);

  return (
    <ErrorBoundary
      fallback={
        <PageContainer>
          <View
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
          >
            <HeaderAuth headerTitle="Tier 3 Overview" noLogo />
            <View marginTop="$8" alignItems="center">
              <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </View>
          </View>
        </PageContainer>
      }
    >
      <PageContainer>
        {loading_ && (
          <LoadingModal
            isVisible={loading_}
            onBackdropPress={() => setLoading_(true)}
            onBackButtonPress={() => setLoading_(true)}
          />
        )}

        <HeaderAuth headerTitle="Tier 3 Overview" noLogo />

        <YStack marginTop={32} marginBottom={24} gap={16}>
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
              {accountLimits?.at(-1)?.tier || 'Tier 3'} Benefits
            </Heading>
            <XStack gap={14}>
              <AccountLimits
                limits={accountLimits?.at(-1)?.limits?.slice(0, 2) || []}
              />
              <AccountLimits
                limits={accountLimits?.at(-1)?.limits?.slice(2, 4) || []}
              />
            </XStack>
            <AccountLimits
              limits={accountLimits?.at(-1)?.limits?.slice(-1) || []}
            />
          </YStack>
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
              {accountUpgradeRequirements?.at(-1)?.tier || 'Tier 3'}{' '}
              Requirements
            </Heading>
            <YStack
              gap={12}
              padding={Sizes.paddingMedium}
              flex={1}
              borderWidth={1}
              borderRadius={Sizes.radiusLarge}
              marginTop={Sizes.marginMedium}
              borderStyle="dashed"
              borderColor={colors.grey05}
            >
              {accountUpgradeRequirements
                ?.at(-1)
                ?.fields?.map(({ name, type }, index) => (
                  <YStack gap={6} key={index}>
                    <XStack alignItems="center" gap={6}>
                      {type === 'string' ? (
                        <KeyboardOpen size={16} color={colors.grey06} />
                      ) : (
                        <Image size={16} color={colors.grey06} />
                      )}
                      <Text fontSize={Sizes.fontSmall} color={colors.grey06}>
                        {name || 'Requirement'}
                      </Text>
                    </XStack>
                  </YStack>
                )) || []}
            </YStack>
          </YStack>
        </YStack>
        <Button
          marginBottom={12}
          marginTop={'auto'}
          gap={0}
          onPress={handleUpgradePress}
        >
          <Text
            fontFamily="Inter-SemiBold"
            fontSize={Sizes.fontMedium}
            fontWeight="600"
          >
            Upgrade To{' '}
            {accountLimits?.[Number(selectedAccount?.kycLevel || 0)]?.tier ||
              'Next Tier'}
          </Text>
        </Button>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default AccountUpgradeRequirements;
