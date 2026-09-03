import React, { FC, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import HeaderAuth from '../../../components/HeaderAuth';
import { YStack } from 'tamagui';
import { _transactionLimit } from '../../../mock';
import CardOption from '../../../components/cards/CardOption.tsx';
import * as Icons from 'iconsax-react-native';
import { useTheme } from '../../../context/ThemeContext.tsx';

const ThemeScreen: FC<MainStackScreenProps<'TransactionLimit'>> = ({
  navigation,
}) => {
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();

  return (
    <PageContainer>
      {
        <LoadingModal
          isVisible={loading}
          onBackdropPress={() => setLoading(true)}
          onBackButtonPress={() => setLoading(true)}
        />
      }

      <HeaderAuth noLogo headerTitle="Transaction Limit" />

      <YStack marginTop={32} gap={12}>
        {_transactionLimit?.map(({ icon, key, subtitle, title, link }) => {
          const iconProps: keyof typeof Icons | null = icon;
          const Icon = Icons[iconProps ?? 'Home'];
          return (
            <CardOption
              key={key}
              title={title}
              subtitle={subtitle}
              onPress={() => navigation.navigate(link)}
              icon={<Icon color={colors.primary} variant="Bulk" size={26} />}
            />
          );
        })}
      </YStack>
    </PageContainer>
  );
};

export default ThemeScreen;
