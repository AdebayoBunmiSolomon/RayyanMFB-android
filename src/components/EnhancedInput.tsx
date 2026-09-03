import React, { useState, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { Label, Spinner, XStack, YStack, Text } from 'tamagui';
// import { Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface EnhancedInputProps {
  children?: React.ReactNode;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  error?: string;
  label?: string;
  helperText?: string;
  loading?: boolean;
  required?: boolean;
  success?: boolean;
  disabled?: boolean;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  children,
  startIcon,
  endIcon,
  error,
  label,
  helperText,
  loading,
  required = false,
  success = false,
  disabled = false,
  onFocus,
  onBlur,
  ...others
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  // const inputRef = useRef<any>(null);

  // const handleFocus = React.memo(() => {
  //   setIsFocused(true);
  //   onFocus?.();
  //   Animated.timing(animatedValue, {
  //     toValue: 1,
  //     duration: 200,
  //     useNativeDriver: false,
  //   }).start();
  // });

  // const handleBlur = React.memo(() => {
  //   setIsFocused(false);
  //   onBlur?.();
  //   Animated.timing(animatedValue, {
  //     toValue: isFilled ? 0.5 : 0,
  //     duration: 200,
  //     useNativeDriver: false,
  //   }).start();
  // });

  // const handleChangeText = React.memo((text: string) => {
  //   setIsFilled(text.length > 0);
  //   others.onChangeText?.(text);
  // });

  // const getInputStyles = React.memo(() => {
  //   const baseStyles = {
  //     borderWidth: 2,
  //     borderRadius: 12,
  //     paddingHorizontal: spacing.component.padding.md,
  //     paddingVertical: spacing.component.padding.sm,
  //     fontSize: typography.bodyMedium.fontSize,
  //     fontFamily: typography.bodyMedium.fontFamily,
  //     lineHeight: typography.bodyMedium.lineHeight,
  //     backgroundColor: colors.input,
  //     color: colors.textPrimary,
  //     minHeight: 48,
  //   };

  //   if (disabled) {
  //     return {
  //       ...baseStyles,
  //       backgroundColor: colors.lightGrey,
  //       borderColor: colors.borderColor,
  //       opacity: 0.6,
  //     };
  //   }

  //   if (error) {
  //     return {
  //       ...baseStyles,
  //       borderColor: colors.error,
  //       backgroundColor: colors.input,
  //     };
  //   }

  //   if (success) {
  //     return {
  //       ...baseStyles,
  //       borderColor: colors.success,
  //       backgroundColor: colors.input,
  //     };
  //   }

  //   if (isFocused) {
  //     return {
  //       ...baseStyles,
  //       borderColor: colors.inputFocus,
  //       backgroundColor: colors.white,
  //       shadowColor: colors.shadow,
  //       shadowOffset: { width: 0, height: 2 },
  //       shadowOpacity: 0.1,
  //       shadowRadius: 4,
  //       elevation: 2,
  //     };
  //   }

  //   return {
  //     ...baseStyles,
  //     borderColor: colors.inputBorder,
  //     backgroundColor: colors.input,
  //   };
  // });

  // const getLabelStyles = React.memo(() => {
  //   const baseStyles = {
  //     fontFamily: typography.label.fontFamily,
  //     fontSize: typography.label.fontSize,
  //     lineHeight: typography.label.lineHeight,
  //     fontWeight: typography.label.fontWeight,
  //     marginBottom: spacing.component.gap.sm,
  //   };

  //   if (isFocused || isFilled) {
  //     return {
  //       ...baseStyles,
  //       color: colors.primary,
  //     };
  //   }

  //   if (error) {
  //     return {
  //       ...baseStyles,
  //       color: colors.error,
  //     };
  //   }

  //   return {
  //     ...baseStyles,
  //     color: colors.textSecondary,
  //   };
  // });

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
    Animated.timing(animatedValue, {
      toValue: isFilled ? 0.5 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleChangeText = (text: string) => {
    setIsFilled(text.length > 0);
    others.onChangeText?.(text);
  };

  const getInputStyles = () => {
    const baseStyles = {
      borderWidth: 2,
      borderRadius: 12,
      paddingHorizontal: spacing.component.padding.md,
      paddingVertical: spacing.component.padding.sm,
      fontSize: typography.bodyMedium.fontSize,
      fontFamily: typography.bodyMedium.fontFamily,
      lineHeight: typography.bodyMedium.lineHeight,
      backgroundColor: colors.input,
      color: colors.textPrimary,
      minHeight: 48,
    };

    if (disabled) {
      return {
        ...baseStyles,
        backgroundColor: colors.lightGrey,
        borderColor: colors.borderColor,
        opacity: 0.6,
      };
    }

    if (error) {
      return {
        ...baseStyles,
        borderColor: colors.error,
        backgroundColor: colors.input,
      };
    }

    if (success) {
      return {
        ...baseStyles,
        borderColor: colors.success,
        backgroundColor: colors.input,
      };
    }

    if (isFocused) {
      return {
        ...baseStyles,
        borderColor: colors.inputFocus,
        backgroundColor: colors.white,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      };
    }

    return {
      ...baseStyles,
      borderColor: colors.inputBorder,
      backgroundColor: colors.input,
    };
  };

  const getLabelStyles = () => {
    const baseStyles = {
      fontFamily: typography.label.fontFamily,
      fontSize: typography.label.fontSize,
      lineHeight: typography.label.lineHeight,
      fontWeight: typography.label.fontWeight,
      marginBottom: spacing.component.gap.sm,
    };

    if (isFocused || isFilled) {
      return {
        ...baseStyles,
        color: colors.primary,
      };
    }

    if (error) {
      return {
        ...baseStyles,
        color: colors.error,
      };
    }

    return {
      ...baseStyles,
      color: colors.textSecondary,
    };
  };

  const inputStyles = getInputStyles();
  const labelStyles = getLabelStyles();

  return (
    <YStack space={spacing.component.gap.sm}>
      {/* Label */}
      {label && (
        <XStack alignItems="center" space={spacing.component.gap.xs}>
          <Label style={labelStyles}>{label}</Label>
          {required && (
            <Text style={{ color: colors.error, fontSize: 12 }}>*</Text>
          )}
        </XStack>
      )}

      {/* Input Container */}
      <XStack position="relative" alignItems="center">
        {/* Start Icon */}
        {startIcon && <View style={styles.startIcon}>{startIcon}</View>}

        {/* Input Field */}
        <View style={[styles.inputContainer, inputStyles]}>{children}</View>

        {/* End Icon or Loading */}
        {(endIcon || loading) && (
          <View style={styles.endIcon}>
            {loading ? (
              <Spinner size="small" color={colors.primary} />
            ) : (
              endIcon
            )}
          </View>
        )}
      </XStack>

      {/* Helper Text or Error */}
      {(error || helperText) && (
        <XStack
          marginTop={spacing.component.gap.xs}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {error ? (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {error}
            </Text>
          ) : null}
          {helperText ? (
            <Text style={[styles.helperText, { color: colors.textTertiary }]}>
              {helperText}
            </Text>
          ) : null}
        </XStack>
      )}

      {/* Character Count */}
      {others.maxLength && (
        <Text style={[styles.charCount, { color: colors.textTertiary }]}>
          {others.value?.length || 0}/{others.maxLength}
        </Text>
      )}
    </YStack>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  startIcon: {
    position: 'absolute',
    left: spacing.component.padding.sm,
    zIndex: 1,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endIcon: {
    position: 'absolute',
    right: spacing.component.padding.sm,
    zIndex: 1,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
  },
  charCount: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
});

export default EnhancedInput;
