/* eslint-disable react-hooks/exhaustive-deps */
import { Dimensions, TouchableOpacity } from 'react-native';
import React, { FC } from 'react';
import { TabsStackScreenProps } from '../../types/navigation.types';
import PageContainer from '../../components/PageContainer';
import { Heading, Text, View, XStack, YStack } from 'tamagui';

import HeaderAuth from '../../components/HeaderAuth';
import { _settings } from '../../mock';
import { MenuTypes } from '../../types';
import * as Icons from 'iconsax-react-native';
import { logOutUser } from '../../slices/authSlice';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../context/ThemeContext';
import KycLevel from '../../components/KycLevel';
import { normalizeSize } from '../../util/size';
import { useAppSelector } from '../../hooks/hook';
import { setAccounts } from '../../slices/accountSlice';

const width = Dimensions.get('window').width;

const containerPadding = 60;
const itemGap = 0;
const numberOfItems = 4;

// Calculate the width of each item
const itemWidth =
  (width - 2 * containerPadding - (numberOfItems - 1) * itemGap) /
  numberOfItems;

const Settings: FC<TabsStackScreenProps<'Settings'>> = ({ navigation }) => {
  const { userType } = useAppSelector(state => state.profile);
  const dispatch = useDispatch();

  const { colors } = useTheme();

  const logOutHandler = async () => {
    const payload = {
      isLoggedIn: false,
      showSplash: false,
      message: '',
      token: '',
    };
    // clear accounts
    dispatch(setAccounts([]));
    // clear user's details
    dispatch(logOutUser(payload));
  };

  return (
    <PageContainer>
      <HeaderAuth />

      <YStack marginTop={32} gap={16}>
        {userType === 'retail' && <KycLevel />}

        {_settings?.map(({ title, id, services }) => {
          const filteredServices = services?.filter(({ name }) => {
            if (userType === 'corp') {
              return name !== 'Account Limit';
            }
            return true;
          });

          return (
            <YStack
              key={id}
              borderWidth={1}
              borderColor={colors.borderColor}
              borderRadius={16}
              backgroundColor={colors.white}
              padding={normalizeSize(24)}
            >
              <Heading
                color={colors.grey05}
                fontFamily="Inter-SemiBold"
                fontSize={normalizeSize(14)}
              >
                {title}
              </Heading>
              <XStack
                marginTop={24}
                flexWrap="wrap"
                rowGap={24}
                justifyContent="space-between"
              >
                {filteredServices?.map(
                  ({ color, icon, name, link }: MenuTypes) => {
                    const iconKey = icon as keyof typeof Icons | undefined;

                    // Safe lookup: fall back to a known-good icon if the
                    // name from mock data doesn't match an actual export.
                    const Icon = (iconKey && Icons[iconKey]) ?? Icons.Home;

                    if (__DEV__ && iconKey && !Icons[iconKey]) {
                      console.warn(
                        `[Settings] No icon export named "${iconKey}" in iconsax-react-native. Check _settings mock data for id: ${id}, name: ${name}.`,
                      );
                    }

                    return (
                      <TouchableOpacity
                        key={`${id}-${name}`}
                        onPress={() =>
                          link === 'logout'
                            ? logOutHandler()
                            : navigation.navigate(link as any)
                        }
                        disabled={!link}
                      >
                        <YStack
                          flex={1}
                          gap={12}
                          width={itemWidth}
                          alignItems="center"
                          opacity={!link ? 0.5 : 1}
                        >
                          <View
                            justifyContent="center"
                            alignItems="center"
                            width={50}
                            height={50}
                            borderRadius={100}
                            backgroundColor={colors.rgba10}
                          >
                            <Icon color={color} size={28} variant="Bold" />
                          </View>
                          <XStack>
                            <Text
                              numberOfLines={2}
                              flexGrow={1}
                              color={colors.grey05}
                              fontFamily="Inter-Medium"
                              fontSize={normalizeSize(12)}
                              textAlign="center"
                            >
                              {name}
                            </Text>
                          </XStack>
                        </YStack>
                      </TouchableOpacity>
                    );
                  },
                )}
              </XStack>
            </YStack>
          );
        })}
      </YStack>
    </PageContainer>
  );
};

export default Settings;
