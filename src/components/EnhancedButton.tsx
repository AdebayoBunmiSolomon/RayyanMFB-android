import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { Text, Spinner } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EnhancedButtonProps {
  children: React.ReactNode;
  variant?:
    | 'primary'
    | 'secondary'
    | 'outlined'
    | 'ghost'
    | 'accent'
    | 'success'
    | 'warning'
    | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  borderRadius?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  pressed?: boolean;
  ripple?: boolean;
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onPress,
  fullWidth = false,
  icon,
  iconPosition = 'left',
  borderRadius = 'lg',
  pressed = false,
  // ripple = true,
}) => {
  const { colors } = useTheme();

  // const getButtonStyles = React.memo(() => {
  //   const baseStyles = {
  //     paddingHorizontal: getPaddingHorizontal(size),
  //     paddingVertical: getPaddingVertical(size),
  //     borderRadius: getBorderRadius(borderRadius),
  //     minHeight: getMinHeight(size),
  //     width: fullWidth ? '100%' : 'auto',
  //     justifyContent: 'center' as const,
  //     alignItems: 'center' as const,
  //     flexDirection: 'row' as const,
  //     opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
  //     transform: [{ scale: pressed ? 0.98 : 1 }],
  //   };

  //   switch (variant) {
  //     case 'primary':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: colors.primary,
  //         borderWidth: 0,
  //       };

  //     case 'secondary':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: colors.secondary,
  //         borderWidth: 0,
  //       };

  //     case 'outlined':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: 'transparent',
  //         borderWidth: 2,
  //         borderColor: colors.primary,
  //       };

  //     case 'ghost':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: 'transparent',
  //         borderWidth: 0,
  //       };

  //     case 'accent':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: colors.islamicBackground,
  //         borderWidth: 1,
  //         borderColor: colors.borderLine,
  //       };

  //     case 'success':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: colors.success,
  //         borderWidth: 0,
  //       };

  //     case 'warning':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: colors.warning,
  //         borderWidth: 0,
  //       };

  //     case 'danger':
  //       return {
  //         ...baseStyles,
  //         backgroundColor: colors.error,
  //         borderWidth: 0,
  //       };

  //     default:
  //       return baseStyles;
  //   }
  // });

  // const getTextStyles = React.memo(() => {
  //   const baseTextStyles = {
  //     fontFamily: typography.button.fontFamily,
  //     fontSize: getFontSize(size),
  //     lineHeight: getLineHeight(size),
  //     fontWeight: typography.button.fontWeight,
  //     letterSpacing: typography.button.letterSpacing,
  //   };

  //   switch (variant) {
  //     case 'primary':
  //     case 'secondary':
  //     case 'success':
  //     case 'warning':
  //     case 'danger':
  //       return {
  //         ...baseTextStyles,
  //         color: colors.white,
  //       };

  //     case 'outlined':
  //     case 'accent':
  //       return {
  //         ...baseTextStyles,
  //         color: colors.primary,
  //       };

  //     case 'ghost':
  //       return {
  //         ...baseTextStyles,
  //         color: colors.primary,
  //       };

  //     default:
  //       return baseTextStyles;
  //   }
  // });

  // const getPaddingHorizontal = React.memo((size: string) => {
  //   switch (size) {
  //     case 'xs':
  //       return spacing.component.padding.xs;
  //     case 'sm':
  //       return spacing.component.padding.sm;
  //     case 'md':
  //       return spacing.component.padding.md;
  //     case 'lg':
  //       return spacing.component.padding.lg;
  //     case 'xl':
  //       return spacing.component.padding.xl;
  //     default:
  //       return spacing.component.padding.md;
  //   }
  // });

  // const getPaddingVertical = React.memo((size: string) => {
  //   switch (size) {
  //     case 'xs':
  //       return 6;
  //     case 'sm':
  //       return 8;
  //     case 'md':
  //       return 12;
  //     case 'lg':
  //       return 16;
  //     case 'xl':
  //       return 20;
  //     default:
  //       return 12;
  //   }
  // });

  // const getMinHeight = React.memo((size: string) => {
  //   switch (size) {
  //     case 'xs':
  //       return 32;
  //     case 'sm':
  //       return 40;
  //     case 'md':
  //       return 48;
  //     case 'lg':
  //       return 56;
  //     case 'xl':
  //       return 64;
  //     default:
  //       return 48;
  //   }
  // });

  // const getFontSize = React.memo((size: string) => {
  //   switch (size) {
  //     case 'xs':
  //       return 12;
  //     case 'sm':
  //       return 14;
  //     case 'md':
  //       return 16;
  //     case 'lg':
  //       return 18;
  //     case 'xl':
  //       return 20;
  //     default:
  //       return 16;
  //   }
  // });

  // const getLineHeight = React.memo((size: string) => {
  //   switch (size) {
  //     case 'xs':
  //       return 16;
  //     case 'sm':
  //       return 20;
  //     case 'md':
  //       return 24;
  //     case 'lg':
  //       return 28;
  //     case 'xl':
  //       return 32;
  //     default:
  //       return 24;
  //   }
  // });

  // const getBorderRadius = React.memo((size: string) => {
  //   switch (size) {
  //     case 'sm':
  //       return 6;
  //     case 'md':
  //       return 8;
  //     case 'lg':
  //       return 12;
  //     case 'xl':
  //       return 16;
  //     case 'full':
  //       return 999;
  //     default:
  //       return 8;
  //   }
  // });

  const getButtonStyles = () => {
    const baseStyles = {
      paddingHorizontal: getPaddingHorizontal(size),
      paddingVertical: getPaddingVertical(size),
      borderRadius: getBorderRadius(borderRadius),
      minHeight: getMinHeight(size),
      width: fullWidth ? '100%' : 'auto',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      flexDirection: 'row' as const,
      opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
      transform: [{ scale: pressed ? 0.98 : 1 }],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyles,
          backgroundColor: colors.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          ...baseStyles,
          backgroundColor: colors.secondary,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      case 'accent':
        return {
          ...baseStyles,
          backgroundColor: colors.islamicBackground,
          borderWidth: 1,
          borderColor: colors.borderLine,
        };
      case 'success':
        return {
          ...baseStyles,
          backgroundColor: colors.success,
          borderWidth: 0,
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: colors.warning,
          borderWidth: 0,
        };
      case 'danger':
        return { ...baseStyles, backgroundColor: colors.error, borderWidth: 0 };
      default:
        return baseStyles;
    }
  };

  const getTextStyles = () => {
    const baseTextStyles = {
      fontFamily: typography.button.fontFamily,
      fontSize: getFontSize(size),
      lineHeight: getLineHeight(size),
      fontWeight: typography.button.fontWeight,
      letterSpacing: typography.button.letterSpacing,
    };

    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'success':
      case 'warning':
      case 'danger':
        return { ...baseTextStyles, color: colors.white };
      case 'outlined':
      case 'accent':
      case 'ghost':
        return { ...baseTextStyles, color: colors.primary };
      default:
        return baseTextStyles;
    }
  };

  const getPaddingHorizontal = (size: string) => {
    switch (size) {
      case 'xs':
        return spacing.component.padding.xs;
      case 'sm':
        return spacing.component.padding.sm;
      case 'md':
        return spacing.component.padding.md;
      case 'lg':
        return spacing.component.padding.lg;
      case 'xl':
        return spacing.component.padding.xl;
      default:
        return spacing.component.padding.md;
    }
  };

  const getPaddingVertical = (size: string) => {
    switch (size) {
      case 'xs':
        return 6;
      case 'sm':
        return 8;
      case 'md':
        return 12;
      case 'lg':
        return 16;
      case 'xl':
        return 20;
      default:
        return 12;
    }
  };

  const getMinHeight = (size: string) => {
    switch (size) {
      case 'xs':
        return 32;
      case 'sm':
        return 40;
      case 'md':
        return 48;
      case 'lg':
        return 56;
      case 'xl':
        return 64;
      default:
        return 48;
    }
  };

  const getFontSize = (size: string) => {
    switch (size) {
      case 'xs':
        return 12;
      case 'sm':
        return 14;
      case 'md':
        return 16;
      case 'lg':
        return 18;
      case 'xl':
        return 20;
      default:
        return 16;
    }
  };

  const getLineHeight = (size: string) => {
    switch (size) {
      case 'xs':
        return 16;
      case 'sm':
        return 20;
      case 'md':
        return 24;
      case 'lg':
        return 28;
      case 'xl':
        return 32;
      default:
        return 24;
    }
  };

  const getBorderRadius = (size: string) => {
    switch (size) {
      case 'sm':
        return 6;
      case 'md':
        return 8;
      case 'lg':
        return 12;
      case 'xl':
        return 16;
      case 'full':
        return 999;
      default:
        return 8;
    }
  };

  const buttonStyles = getButtonStyles();
  const textStyles = getTextStyles();

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyles]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {loading ? (
        <Spinner
          size="small"
          color={
            variant === 'primary' ||
            variant === 'secondary' ||
            variant === 'success' ||
            variant === 'warning' ||
            variant === 'danger'
              ? colors.white
              : colors.primary
          }
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeft}>{icon}</View>
          )}
          <Text style={[styles.text, textStyles]}>{children}</Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRight}>{icon}</View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // Base styles will be applied dynamically
  },
  text: {
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: spacing.component.gap.sm,
  },
  iconRight: {
    marginLeft: spacing.component.gap.sm,
  },
});

export default EnhancedButton;
