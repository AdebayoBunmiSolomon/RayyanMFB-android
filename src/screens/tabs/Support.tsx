import React, { FC } from 'react';
import { TabsStackScreenProps } from '../../types/navigation.types';
import PageContainer from '../../components/PageContainer';
import HeaderAuth from '../../components/HeaderAuth';
import HeadingAuth from '../../components/HeadingAuth';
import ListCard from '../../components/ListCard';
import { _miscellaneous, _socialNetworks, _supports } from '../../mock';
import { View } from 'tamagui';
import { useTheme } from '../../context/ThemeContext';

const Support: FC<TabsStackScreenProps<'Support'>> = () => {
  const { colors } = useTheme();

  return (
    <>
      <PageContainer>
        <HeaderAuth noLogo headerTitle="Contact Us" />

        <HeadingAuth
          title="Need Help?"
          subtitle="Find answers to the most common questions or contact us directly"
          swap
          marginTop={32}
          small
        />

        <ListCard marginTop={32} list={_supports} />
        <View
          marginTop={24}
          flex={1}
          borderColor={colors.borderColor}
          borderTopWidth={1}
          paddingInline={16}
        />
        {/* social media and website */}
        <ListCard marginBlock={24} list={_socialNetworks} />
        <View
          marginTop={24}
          flex={1}
          borderColor={colors.borderColor}
          borderTopWidth={1}
          paddingInline={16}
        />
        {/* social media and website */}
        <ListCard marginBlock={24} list={_miscellaneous} />
      </PageContainer>
    </>
  );
};

export default Support;
