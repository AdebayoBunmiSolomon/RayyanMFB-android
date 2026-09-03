import React from 'react';
import { View, StyleSheet } from 'react-native';
import { YStack, XStack } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';

interface IslamicCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'islamic';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl';
  shadow?: boolean;
  border?: boolean;
  backgroundColor?: string;
  onPress?: () => void;
  disabled?: boolean;
}

const IslamicCard: React.FC<IslamicCardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  margin = 'sm',
  borderRadius = 'lg',
  shadow = true,
  border = false,
  backgroundColor,
  onPress,
  disabled = false,
}) => {
  const { colors } = useTheme();

  const getCardStyles = () => {
    const baseStyles = {
      padding: spacing.component.padding[padding],
      margin: spacing.component.margin[margin],
      borderRadius: getBorderRadius(borderRadius),
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || colors.cardBackground,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: shadow ? 0.1 : 0,
          shadowRadius: 8,
          elevation: shadow ? 4 : 0,
        };

      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.cardBorder,
        };

      case 'islamic':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || colors.islamicBackground,
          borderWidth: 1,
          borderColor: colors.borderLine,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: shadow ? 0.08 : 0,
          shadowRadius: 4,
          elevation: shadow ? 2 : 0,
        };

      default:
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || colors.cardBackground,
          borderWidth: border ? 1 : 0,
          borderColor: border ? colors.cardBorder : 'transparent',
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: shadow ? 0.06 : 0,
          shadowRadius: 4,
          elevation: shadow ? 2 : 0,
        };
    }
  };

  const getBorderRadius = (size: string) => {
    switch (size) {
      case 'sm':
        return 8;
      case 'md':
        return 12;
      case 'lg':
        return 16;
      case 'xl':
        return 20;
      default:
        return 16;
    }
  };

  const cardStyles = getCardStyles();

  return (
    <View style={[styles.container, cardStyles]}>
      <YStack space={spacing.component.gap.md}>{children}</YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base styles will be applied dynamically
  },
});

export default IslamicCard;
