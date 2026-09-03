import React, { FC, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import HeaderAuth from '../../../components/HeaderAuth';
import { Heading, XStack, YStack } from 'tamagui';
import { normalizeSize } from '../../../util/size';
import { useTheme } from '../../../context/ThemeContext';
import AccountLimits from '../../../components/AccountLimits';
import { accountLimits } from '../../../mock';

const AccountAllLimit: FC<MainStackScreenProps<'AccountAllLimit'>> = ({}) => {
  const [loading_, setLoading_] = useState(false);

  const { colors } = useTheme();

  return (
    <PageContainer>
      {loading_ && (
        <LoadingModal
          isVisible={loading_}
          onBackdropPress={() => setLoading_(true)}
          onBackButtonPress={() => setLoading_(true)}
        />
      )}

      <HeaderAuth headerTitle="All Transaction Limits" noLogo />

      <YStack marginTop={32} gap={16}>
        {accountLimits?.map(({ tier, limits }) => (
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
              {tier}
            </Heading>
            <XStack gap={14}>
              <AccountLimits limits={limits?.slice(0, 2)} />
              <AccountLimits limits={limits?.slice(2, 4)} />
            </XStack>
            <AccountLimits limits={limits?.slice(-1)} />
          </YStack>
        ))}
      </YStack>
    </PageContainer>
  );
};

export default AccountAllLimit;
