import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import transferMethodStyles from '../styles/transferMethods.styles';
import { _transferMethods } from '../mock';
import RayyanLogo from '../assets/svg/rayyan-logo.svg';
import * as Icons from 'iconsax-react-native';
import colors from '../theme/color';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { styles } = transferMethodStyles();

const TransferMethods = ({ account }) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      {_transferMethods?.map(({ id, title, subtitle, icon, link }, index) => {
        const Icon = Icons[icon ?? 'Home'];
        return (
          <>
            <TouchableOpacity
              key={id}
              onPress={() => navigation.navigate(link, { account })}
            >
              <XStack gap={16} alignItems="center">
                {/* icon */}
                <View style={styles.icon}>
                  {!icon ? (
                    <RayyanLogo width={26} />
                  ) : (
                    <Icon
                      variant="Bulk"
                      color={colors.primary}
                      size={24}
                      style={{ top: -2 }}
                    />
                  )}
                </View>
                {/* heading */}
                <YStack gap={6}>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.subtitle}>{subtitle}</Text>
                </YStack>
              </XStack>
            </TouchableOpacity>
            {index < _transferMethods.length - 1 && (
              <View style={styles.divider} />
            )}
          </>
        );
      })}
    </View>
  );
};

export default TransferMethods;
