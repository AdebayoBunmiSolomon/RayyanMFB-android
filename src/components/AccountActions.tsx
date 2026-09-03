/* eslint-disable react-native/no-inline-styles */
import { TouchableOpacity } from 'react-native';
import React from 'react';
import accountActionStyles from '../styles/accountActions';
import { useNavigation } from '@react-navigation/native';
import { Text, View } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../hooks/hook';
import * as Icons from 'iconsax-react-native';
import { MenuTypes } from '../types';
import { IS_CORPORATE } from '../../config';
import { corpAccountActions, retailAccountActions } from '../context/default';

const { styles } = accountActionStyles();

const DEFAULT_SHORTCUTS: MenuTypes[] = IS_CORPORATE
  ? corpAccountActions
  : retailAccountActions;

const AccountActions = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();

  const { selectedShortcuts } = useAppSelector(state => state.shortcut);

  // If no shortcuts are selected, use default ones
  const shortcuts =
    selectedShortcuts.length > 0 ? selectedShortcuts : DEFAULT_SHORTCUTS;

  return (
    <View
      style={{
        ...styles.container,
      }}
      backgroundColor={colors.white}
    >
      {shortcuts?.map(({ icon, name, type, link, details }, index) => {
        const iconProps: keyof typeof Icons | null = icon;
        const Icon = Icons[iconProps ?? 'Home'];
        return (
          <TouchableOpacity
            style={[
              styles.service,
              index === 1 && {
                borderLeftWidth: 1,
                borderRightWidth: shortcuts?.length === 2 ? 0 : 1,
                borderColor: colors.borderColor,
              },
            ]}
            onPress={() => {
              navigation.navigate(link, { type, ...details });
              console.log('type', type);
            }}
          >
            <View style={styles.icon}>
              <Icon
                variant="TwoTone"
                size={24}
                color={colors.primary}
                style={{ marginLeft: icon === 'Mobile' ? 5 : undefined }}
              />
            </View>
            <Text style={styles.label} color={colors.grey06} numberOfLines={1}>
              {name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default AccountActions;
