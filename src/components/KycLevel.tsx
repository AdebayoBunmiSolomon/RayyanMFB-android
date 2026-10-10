/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { Heading, XStack, YStack } from 'tamagui';

import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../hooks/hook';
import { useApi } from '../hooks/useApi';
import Stepper from './Stepper';
import { KycLevelProps, StepperProps } from '../types';
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import { normalizeSize } from '../util/size';
import ArrowRight from '../assets/svg/arrow-right-green.svg';
import { useNavigation } from '@react-navigation/native';
import { Accounts_ } from '../types/transactions.types';

const defaultSteps = [
  { label: 'KYC Tier 1', completed: false },
  { label: 'KYC Tier 2', completed: false },
  { label: 'KYC Tier 3', completed: false },
];

const KycLevel = ({ cta }: KycLevelProps) => {
  const [steps, setSteps] = useState<StepperProps['steps']>(defaultSteps);
  const { kycLevel } =
    useAppSelector(state => state?.account?.selectedAccount) ?? {};
  const [_, setKycUpgradeReq] = useState<any>({});
  const { requestInit, data } = useApi({
    endpoint: 'fetchSingleAccountUpgrade',
  });

  const [disableUpgrade, setDisableUpgrade] = useState(false);

  const { colors } = useTheme();

  const navigation = useNavigation<any>();

  const { selectedAccount } = useAppSelector(state => state?.account) ?? {};

  const updateStepByIndex = (
    index: number,
    updatedData?: Partial<StepperProps['steps'][0]>,
  ) => {
    setSteps(prevSteps => {
      const newSteps = prevSteps.map((step, i) => {
        if (i < index) {
          return { ...step, completed: true }; // Set completed to true for steps below the index
        } else if (i === index) {
          return {
            ...step,
            ...updatedData,
            completed: true,
            current: true,
            currentLabel: 'Your Current Tier', // Update the current index
          };
        }
        return { ...step }; // Leave other steps unchanged
      });

      return newSteps; // Return the updated array
    });
  };

  useEffect(() => {
    const fetchAccountUpgradeReq = async () => {
      const response = await requestInit();
      if (response?.data?.response?.length) {
        const fnMatchAcc = response?.data?.response?.filter(
          ({ accountNumber }: Accounts_) =>
            accountNumber === selectedAccount?.accountNumber,
        );
        const lastReq = fnMatchAcc?.at(-1);
        if (
          lastReq.status?.toLowerCase() === 'pending' ||
          +selectedAccount?.kycLevel > 2
        ) {
          return setDisableUpgrade(true);
        }
        setDisableUpgrade(false);
      }
    };
    fetchAccountUpgradeReq();
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccount) {
      const currentKycStep = +selectedAccount?.kycLevel - 1;
      updateStepByIndex(currentKycStep);
    }
  }, [selectedAccount]);

  useEffect(() => {
    const fetchAccountUpgradeReq = async () => {
      const response = await requestInit();
      if (response?.data?.response?.length) {
        const lastReq = response?.data?.response?.at?.(-1);
        setKycUpgradeReq(lastReq);
      }
    };
    fetchAccountUpgradeReq();
  }, []);

  return (
    <YStack
      borderWidth={1}
      borderColor={colors.borderColor}
      borderRadius={16}
      backgroundColor={colors.white}
      padding={normalizeSize(24)}
    >
      <XStack justifyContent="space-between" marginBottom={28}>
        <Heading
          color={colors.grey05}
          fontFamily="Inter-SemiBold"
          fontSize={normalizeSize(14)}
        >
          KYC Level
        </Heading>
        {!cta ? (
          +kycLevel < 3 ? (
            data?.response?.length ? (
              <TouchableOpacity
                disabled={disableUpgrade}
                onPress={() => navigation.navigate('AccountUpgrade')}
              >
                <XStack flexDirection="row" alignItems="center" gap={6}>
                  <Heading
                    opacity={disableUpgrade ? 0.6 : 1}
                    color={colors.lightPrimary}
                    fontFamily="Inter-Bold"
                    fontSize={normalizeSize(14)}
                  >
                    Upgrade Tier
                  </Heading>
                  <ArrowRight
                    opacity={disableUpgrade ? 0.6 : 1}
                    color={colors.lightPrimary}
                  />
                </XStack>
              </TouchableOpacity>
            ) : (
              <ActivityIndicator />
            )
          ) : undefined
        ) : (
          cta
        )}
      </XStack>
      <Stepper steps={steps} />
    </YStack>
  );
};

export default KycLevel;
