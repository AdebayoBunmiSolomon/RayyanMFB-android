/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import { Heading, Stack, Text, XStack, YStack } from 'tamagui';
import KycLevel from '../../../components/KycLevel';
// import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import Sizes, { normalizeSize } from '../../../util/size';
// import ArrowRight from '../../../assets/svg/arrow-right-green.svg';
import { Image, KeyboardOpen } from 'iconsax-react-native';

import { MainStackScreenProps } from '../../../types/navigation.types';
import AccountLimits from '../../../components/AccountLimits';
import { Tier } from '../../../types';
import { useAppSelector } from '../../../hooks/hook';
import { accountLimits, accountUpgradeRequirements } from '../../../mock';
import Button from '../../../components/Button';

const AccountUpgrade: FC<MainStackScreenProps<'AccountUpgrade'>> = ({
  navigation,
}) => {
  const [accLimits, setAccLimits] = useState<Tier | any>(undefined);

  const { colors } = useTheme();

  const { selectedAccount } = useAppSelector(state => state?.account);

  useEffect(() => {
    if (selectedAccount?.kycLevel) {
      const currentLimits = accountLimits?.[Number(selectedAccount?.kycLevel)];
      setAccLimits(currentLimits);
    }
  }, [selectedAccount]);

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Account Upgrade" />
      <YStack marginTop={32} gap={16}>
        <KycLevel
        // cta={
        //   +selectedAccount?.kycLevel === 1 ? (
        //     <TouchableOpacity
        //       onPress={() =>
        //         navigation.navigate('AccountUpgradeRequirements')
        //       }
        //     >
        //       <Stack flexDirection="row" alignItems="center" gap={6}>
        //         <Heading
        //           color={colors.lightPrimary}
        //           fontFamily="Inter-Bold"
        //           fontWeight="600"
        //           fontSize={normalizeSize(14)}
        //         >
        //           View More
        //         </Heading>
        //         <ArrowRight color={colors.lightPrimary} />
        //       </Stack>
        //     </TouchableOpacity>
        //   ) : (
        //     ''
        //   )
        // }
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
            {accLimits?.tier} Benefits
          </Heading>
          <XStack gap={14}>
            <AccountLimits limits={accLimits?.limits?.slice?.(0, 2)} />
            <AccountLimits limits={accLimits?.limits?.slice?.(2, 4)} />
          </XStack>
          <AccountLimits limits={accLimits?.limits?.slice?.(-1)} />
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
            {accLimits?.tier} Requirements
          </Heading>
          <XStack gap={14}>
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
              {accountUpgradeRequirements?.[
                Number(selectedAccount.kycLevel) - 1
              ]?.fields?.map?.(({ name, type }, index) => (
                <YStack gap={6} key={index}>
                  <XStack alignItems="center" gap={6}>
                    {type === 'string' ? (
                      <KeyboardOpen size={16} color={colors.grey06} />
                    ) : (
                      <Image size={16} color={colors.grey06} />
                    )}
                    <Text fontSize={Sizes.fontSmall} color={colors.grey06}>
                      {name}
                    </Text>
                  </XStack>
                </YStack>
              ))}
            </YStack>
          </XStack>
        </YStack>
        <Button
          marginTop={24}
          onPress={() => navigation.navigate('AccountUpgradeRequest')}
        >
          <Text
            fontFamily="Inter-SemiBold"
            fontSize={Sizes.fontMedium}
            fontWeight="600"
          >
            Upgrade To{' '}
            {accountLimits?.[Number(selectedAccount?.kycLevel)]?.tier}
          </Text>
        </Button>
      </YStack>
    </PageContainer>
  );
};

export default AccountUpgrade;
