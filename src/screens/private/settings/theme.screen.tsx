import React, { FC, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import HeaderAuth from '../../../components/HeaderAuth';
import { YStack } from 'tamagui';
import ChangeTheme from '../../../components/cards/ChangeTheme';
import Shortuts from '../../../components/cards/Shortcuts';

const ThemeScreen: FC<MainStackScreenProps<'Theme'>> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  return (
    <PageContainer>
      {
        <LoadingModal
          isVisible={loading}
          onBackdropPress={() => setLoading(true)}
          onBackButtonPress={() => setLoading(true)}
        />
      }

      <HeaderAuth noLogo headerTitle="Theme & Appearance" />

      <YStack marginTop={32} gap={12}>
        <ChangeTheme />
        <Shortuts navigation={navigation} />
      </YStack>
    </PageContainer>
  );
};

export default ThemeScreen;
