import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, XStack, YStack } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EnhancedStatusProps {
  type: 'success' | 'error' | 'warning' | 'info' | 'neutral';
  title?: string;
  message?: string;
  showIcon?: boolean;
  variant?: 'inline' | 'card' | 'banner';
  size?: 'sm' | 'md' | 'lg';
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onPress: () => void;
  };
}

const EnhancedStatus: React.FC<EnhancedStatusProps> = ({
  type,
  title,
  message,
  showIcon = true,
  variant = 'inline',
  size = 'md',
  dismissible = false,
  onDismiss,
  action,
}) => {
  const { colors } = useTheme();

  // const getStatusConfig = React.memo(() => {
  //   switch (type) {
  //     case 'success':
  //       return {
  //         backgroundColor: colors.islamicBackground,
  //         borderColor: colors.success,
  //         iconColor: colors.success,
  //         textColor: colors.textPrimary,
  //       };
  //     case 'error':
  //       return {
  //         backgroundColor: colors.input,
  //         borderColor: colors.error,
  //         iconColor: colors.error,
  //         textColor: colors.textPrimary,
  //       };
  //     case 'warning':
  //       return {
  //         backgroundColor: colors.input,
  //         borderColor: colors.warning,
  //         iconColor: colors.warning,
  //         textColor: colors.textPrimary,
  //       };
  //     case 'info':
  //       return {
  //         backgroundColor: colors.input,
  //         borderColor: colors.info,
  //         iconColor: colors.info,
  //         textColor: colors.textPrimary,
  //       };
  //     case 'neutral':
  //       return {
  //         backgroundColor: colors.lightGrey,
  //         borderColor: colors.borderColor,
  //         iconColor: colors.textTertiary,
  //         textColor: colors.textPrimary,
  //       };
  //     default:
  //       return {
  //         backgroundColor: colors.input,
  //         borderColor: colors.borderColor,
  //         iconColor: colors.textTertiary,
  //         textColor: colors.textPrimary,
  //       };
  //   }
  // });

  // const getSizeConfig = React.memo(() => {
  //   switch (size) {
  //     case 'sm':
  //       return {
  //         padding: spacing.component.padding.sm,
  //         fontSize: typography.bodySmall.fontSize,
  //         iconSize: 16,
  //         borderRadius: 6,
  //       };
  //     case 'md':
  //       return {
  //         padding: spacing.component.padding.md,
  //         fontSize: typography.bodyMedium.fontSize,
  //         iconSize: 20,
  //         borderRadius: 8,
  //       };
  //     case 'lg':
  //       return {
  //         padding: spacing.component.padding.lg,
  //         fontSize: typography.bodyLarge.fontSize,
  //         iconSize: 24,
  //         borderRadius: 12,
  //       };
  //     default:
  //       return {
  //         padding: spacing.component.padding.md,
  //         fontSize: typography.bodyMedium.fontSize,
  //         iconSize: 20,
  //         borderRadius: 8,
  //       };
  //   }
  // });

  // const getVariantStyles = React.memo(() => {
  //   const statusConfig = getStatusConfig();
  //   const sizeConfig = getSizeConfig();

  //   switch (variant) {
  //     case 'inline':
  //       return {
  //         flexDirection: 'row' as const,
  //         alignItems: 'center',
  //         padding: sizeConfig.padding,
  //         backgroundColor: statusConfig.backgroundColor,
  //         borderWidth: 1,
  //         borderColor: statusConfig.borderColor,
  //         borderRadius: sizeConfig.borderRadius,
  //       };

  //     case 'card':
  //       return {
  //         padding: sizeConfig.padding,
  //         backgroundColor: statusConfig.backgroundColor,
  //         borderWidth: 1,
  //         borderColor: statusConfig.borderColor,
  //         borderRadius: sizeConfig.borderRadius,
  //         shadowColor: colors.shadow,
  //         shadowOffset: { width: 0, height: 2 },
  //         shadowOpacity: 0.1,
  //         shadowRadius: 4,
  //         elevation: 2,
  //       };

  //     case 'banner':
  //       return {
  //         padding: sizeConfig.padding,
  //         backgroundColor: statusConfig.backgroundColor,
  //         borderLeftWidth: 4,
  //         borderLeftColor: statusConfig.borderColor,
  //         borderRadius: sizeConfig.borderRadius,
  //       };

  //     default:
  //       return {};
  //   }
  // });

  // const renderIcon = React.memo(() => {
  //   if (!showIcon) return null;

  //   const statusConfig = getStatusConfig();
  //   const sizeConfig = getSizeConfig();

  //   // Simple icon representation - you can replace with actual icons
  //   const iconStyle = {
  //     width: sizeConfig.iconSize,
  //     height: sizeConfig.iconSize,
  //     borderRadius: sizeConfig.iconSize / 2,
  //     backgroundColor: statusConfig.iconColor,
  //     marginRight: spacing.component.gap.sm,
  //   };

  //   return <View style={iconStyle} />;
  // });

  const getStatusConfig = () => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: colors.islamicBackground,
          borderColor: colors.success,
          iconColor: colors.success,
          textColor: colors.textPrimary,
        };
      case 'error':
        return {
          backgroundColor: colors.input,
          borderColor: colors.error,
          iconColor: colors.error,
          textColor: colors.textPrimary,
        };
      case 'warning':
        return {
          backgroundColor: colors.input,
          borderColor: colors.warning,
          iconColor: colors.warning,
          textColor: colors.textPrimary,
        };
      case 'info':
        return {
          backgroundColor: colors.input,
          borderColor: colors.info,
          iconColor: colors.info,
          textColor: colors.textPrimary,
        };
      case 'neutral':
        return {
          backgroundColor: colors.lightGrey,
          borderColor: colors.borderColor,
          iconColor: colors.textTertiary,
          textColor: colors.textPrimary,
        };
      default:
        return {
          backgroundColor: colors.input,
          borderColor: colors.borderColor,
          iconColor: colors.textTertiary,
          textColor: colors.textPrimary,
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'sm':
        return {
          padding: spacing.component.padding.sm,
          fontSize: typography.bodySmall.fontSize,
          iconSize: 16,
          borderRadius: 6,
        };
      case 'md':
        return {
          padding: spacing.component.padding.md,
          fontSize: typography.bodyMedium.fontSize,
          iconSize: 20,
          borderRadius: 8,
        };
      case 'lg':
        return {
          padding: spacing.component.padding.lg,
          fontSize: typography.bodyLarge.fontSize,
          iconSize: 24,
          borderRadius: 12,
        };
      default:
        return {
          padding: spacing.component.padding.md,
          fontSize: typography.bodyMedium.fontSize,
          iconSize: 20,
          borderRadius: 8,
        };
    }
  };

  const getVariantStyles = () => {
    const statusConfig = getStatusConfig();
    const sizeConfig = getSizeConfig();

    switch (variant) {
      case 'inline':
        return {
          flexDirection: 'row' as const,
          alignItems: 'center',
          padding: sizeConfig.padding,
          backgroundColor: statusConfig.backgroundColor,
          borderWidth: 1,
          borderColor: statusConfig.borderColor,
          borderRadius: sizeConfig.borderRadius,
        };

      case 'card':
        return {
          padding: sizeConfig.padding,
          backgroundColor: statusConfig.backgroundColor,
          borderWidth: 1,
          borderColor: statusConfig.borderColor,
          borderRadius: sizeConfig.borderRadius,
          shadowColor: colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        };

      case 'banner':
        return {
          padding: sizeConfig.padding,
          backgroundColor: statusConfig.backgroundColor,
          borderLeftWidth: 4,
          borderLeftColor: statusConfig.borderColor,
          borderRadius: sizeConfig.borderRadius,
        };

      default:
        return {};
    }
  };

  const renderIcon = () => {
    if (!showIcon) return null;

    const statusConfig = getStatusConfig();
    const sizeConfig = getSizeConfig();

    // Simple icon representation - you can replace with actual icons
    const iconStyle = {
      width: sizeConfig.iconSize,
      height: sizeConfig.iconSize,
      borderRadius: sizeConfig.iconSize / 2,
      backgroundColor: statusConfig.iconColor,
      marginRight: spacing.component.gap.sm,
    };

    return <View style={iconStyle} />;
  };

  const statusStyles = getVariantStyles();
  const sizeConfig = getSizeConfig();

  return (
    <View style={[styles.container, statusStyles]}>
      <XStack alignItems="flex-start" space={spacing.component.gap.sm}>
        {renderIcon()}

        <YStack flex={1} space={spacing.component.gap.xs}>
          {title && (
            <Text
              style={[
                styles.title,
                {
                  fontSize: sizeConfig.fontSize,
                  fontFamily: typography.label.fontFamily,
                  fontWeight: typography.label.fontWeight,
                  color: getStatusConfig().textColor,
                },
              ]}
            >
              {title}
            </Text>
          )}

          {message && (
            <Text
              style={[
                styles.message,
                {
                  fontSize: sizeConfig.fontSize - 2,
                  fontFamily: typography.bodySmall.fontFamily,
                  color: getStatusConfig().textColor,
                  opacity: 0.8,
                },
              ]}
            >
              {message}
            </Text>
          )}
        </YStack>

        {/* Action Button */}
        {action && (
          <Text
            style={[
              styles.actionButton,
              {
                fontSize: sizeConfig.fontSize - 2,
                fontFamily: typography.label.fontFamily,
                fontWeight: typography.label.fontWeight,
                color: getStatusConfig().borderColor,
              },
            ]}
            onPress={action.onPress}
          >
            {action.label}
          </Text>
        )}
      </XStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Base styles applied dynamically
  },
  title: {
    // Styles applied dynamically
  },
  message: {
    // Styles applied dynamically
  },
  actionButton: {
    // Styles applied dynamically
  },
});

export default EnhancedStatus;
