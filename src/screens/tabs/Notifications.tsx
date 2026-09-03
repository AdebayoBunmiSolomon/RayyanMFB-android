import React, { FC } from 'react';
import { TabsStackScreenProps } from '../../types/navigation.types';
import PageContainer from '../../components/PageContainer';
import { Avatar, Heading, Text, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../components/HeaderAuth';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import RayyanLogo from '../../assets/svg/logo.svg';

const Notifications: FC<TabsStackScreenProps<'Notifications'>> = () => {
  const { colors } = useTheme();

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Notifications" />
      <TouchableOpacity>
        <YStack
          backgroundColor={colors.white}
          marginTop={24}
          padding={16}
          gap={16}
          borderRadius={16}
        >
          <XStack alignItems="center" gap={8}>
            <Avatar size={32} borderRadius={8}>
              <RayyanLogo width={32} height={32} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <Heading color={colors.grey05} fontSize={16} fontWeight="700">
              Welcome to Rayyan Digital Banking!
            </Heading>
          </XStack>
          {/* content */}
          <Text color={colors.grey05} lineHeight={20}>
            You're now connected to convenient & secure banking. If you need
            assistance, our dedicated customer support team is always here to
            help.
          </Text>
          {/* <View borderTopColor="#ECECEC" borderTopWidth={1} /> */}
          {/* footer cta */}
          {/* <XStack justifyContent="space-between">
            <Text color={colors.grey04} fontSize={13} fontWeight="500">
              Today 3:21 PM
            </Text>
            <XStack gap={4} alignItems="center">
              <Text color={colors.primary} fontSize={13} fontWeight="500">
                View
              </Text>
              <ArrowRight2 size={18} color={colors.primary} />
            </XStack>
          </XStack> */}
        </YStack>
      </TouchableOpacity>
    </PageContainer>
  );
};

export default Notifications;
