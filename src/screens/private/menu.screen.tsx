import React from 'react';
import { Heading, Text, View, XStack, YStack } from 'tamagui';
import PageContainer from '../../components/PageContainer';
import HeaderAuth from '../../components/HeaderAuth';
import { _menu } from '../../mock';
import { Dimensions, TouchableOpacity } from 'react-native';
import * as Icons from 'iconsax-react-native';
import { MenuTypes } from '../../types';
import { useTheme } from '../../context/ThemeContext';
import { useAppSelector } from '../../hooks/hook';
import { IS_CORPORATE } from '../../../config';

const width = Dimensions.get('window').width;

const containerPadding = 55;
const itemGap = 0;
const numberOfItems = 4;

// Calculate the width of each item
const itemWidth =
  (width - 2 * containerPadding - (numberOfItems - 1) * itemGap) /
  numberOfItems;

const MenuScreen = ({ navigation }: any) => {
  const { userType } = useAppSelector(state => state.profile);

  const { colors } = useTheme();

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Menu" />
      <YStack marginTop={32} gap={16}>
        {_menu
          ?.filter(({ access }) =>
            IS_CORPORATE
              ? access !== 'retail' || access === undefined
              : access === 'retail' || access === undefined,
          )
          ?.map(({ title, id, services }) => {
            const filteredServices = services?.filter(({ name }) => {
              if (userType === 'retail') {
                return name !== 'Bulk Bank Transfer' && name !== 'Approval';
              }
              if (userType === 'corp') {
                return name !== 'Upgrade Account';
              }
              return true;
            });

            return (
              <YStack
                key={id}
                borderWidth={1}
                borderColor={colors.borderColor}
                backgroundColor={colors.white}
                borderRadius={16}
                padding={24}
              >
                <Heading
                  color={colors.grey05}
                  fontFamily="Inter-SemiBold"
                  fontSize={18}
                >
                  {title}
                </Heading>
                <XStack
                  marginTop={24}
                  columnGap={8}
                  rowGap={16}
                  flexWrap="wrap"
                  justifyContent="flex-start"
                >
                  {filteredServices?.map(
                    ({
                      color,
                      icon,
                      name,
                      link,
                      type,
                      details,
                      nested,
                    }: MenuTypes) => {
                      const iconProps: keyof typeof Icons | null = icon;
                      const Icon = Icons[iconProps ?? 'Home'];
                      return (
                        <TouchableOpacity
                          key={id}
                          onPress={() =>
                            navigation.navigate(link, {
                              type,
                              screenType: type,
                              nested,
                              ...details,
                            })
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
                                fontSize={12}
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

export default MenuScreen;
