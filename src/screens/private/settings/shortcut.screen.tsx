import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import PageContainer from '../../../components/PageContainer';
import HeaderAuth from '../../../components/HeaderAuth';
import { _menu } from '../../../mock';
import { Dimensions, TouchableOpacity } from 'react-native';
import * as Icons from 'iconsax-react-native';
import { MenuTypes } from '../../../types';
import { useTheme } from '../../../context/ThemeContext';
import HeadingAuth from '../../../components/HeadingAuth';
import Sizes from '../../../util/size';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../stores/store';
import { toggleShortcut } from '../../../slices/shortcutSlice';
import { useAppSelector } from '../../../hooks/hook';
import { IS_CORPORATE } from '../../../../config';

const width = Dimensions.get('window').width;
const gap = 10;
const listWidth = (width - 6 * gap) / 4;

const ShortcutScreen = () => {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const selectedShortcuts = useSelector(
    (state: RootState) => state.shortcut.selectedShortcuts,
  );

  const { userType } = useAppSelector(state => state.profile);

  return (
    <PageContainer>
      <HeaderAuth noLogo />
      <HeadingAuth
        swap
        title="Quick Actions"
        subtitle="Choose up to 3 shortcuts for instant access"
      />

      <YStack marginTop={32} gap={16}>
        {_menu
          ?.filter(({ access }) =>
            IS_CORPORATE
              ? access !== 'retail' || access === undefined
              : access === 'retail' || access === undefined,
          )
          ?.map(({ id, services }) => {
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
              <YStack key={id} borderRadius={16}>
                <XStack
                  columnGap={8}
                  rowGap={16}
                  flexWrap="wrap"
                  justifyContent="flex-start"
                >
                  {filteredServices?.map((service: MenuTypes) => {
                    const iconProps: keyof typeof Icons | null = service.icon;
                    const Icon = Icons[iconProps ?? 'Home'];
                    const isSelected = selectedShortcuts.some(
                      item => item.name === service.name,
                    );

                    return (
                      <TouchableOpacity
                        key={service.name}
                        onPress={() => dispatch(toggleShortcut(service))}
                        disabled={!service.link}
                      >
                        <YStack
                          padding={12}
                          backgroundColor={
                            isSelected ? colors.primary : colors.input
                          }
                          borderColor={
                            isSelected ? colors.primary : colors.borderColor
                          }
                          borderRadius={Sizes.radiusLarge}
                          justifyContent="center"
                          flex={1}
                          gap={12}
                          width={listWidth}
                          alignItems="center"
                          opacity={!service.link ? 0.5 : 1}
                        >
                          <View justifyContent="center" alignItems="center">
                            <Icon
                              color={isSelected ? 'white' : service.color}
                              size={28}
                              variant="Bold"
                            />
                          </View>
                          <XStack>
                            <Text
                              numberOfLines={2}
                              flexGrow={1}
                              color={isSelected ? 'white' : colors.grey05}
                              fontFamily="Inter-Medium"
                              fontSize={12}
                              textAlign="center"
                            >
                              {service.name}
                            </Text>
                          </XStack>
                        </YStack>
                      </TouchableOpacity>
                    );
                  })}
                </XStack>
              </YStack>
            );
          })}
      </YStack>
    </PageContainer>
  );
};

export default ShortcutScreen;
