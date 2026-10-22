import React, { memo } from 'react';

import { InputProps } from '../types';
import StyledInput from '../styles/input';
import { Label, Spinner, Text, View, XStack, YStack } from 'tamagui';
import { Platform, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Sizes, { normalizeSize } from '../util/size';
import { usePasswordRule } from '../hooks/usePasswordRule';
import { TickCircle } from 'iconsax-react-native';

const RuleItem = memo(({ passed, text }: { passed: boolean; text: string }) => {
  const { colors } = useTheme();
  return (
    <XStack alignItems="center" gap={6}>
      <TickCircle
        size={Sizes.fontLarge}
        color={passed ? colors.primary : colors.grey}
        variant="Bold"
      />
      <Text color={passed ? colors.primary : colors.grey}>{text}</Text>
    </XStack>
  );
});

const Input = memo(
  ({
    children,
    startIcon,
    endIcon,
    error,
    label,
    helperText,
    loading,
    showRules = false,
    ...others
  }: InputProps) => {
    const { colors } = useTheme();
    const isReadOnly = others.editable === false;
    const { passwordRules, isRuleHasError, checkPasswordRules } =
      usePasswordRule();
    if (showRules)
      label?.toLowerCase().includes('password') && isRuleHasError
        ? 'Password does not meet the required criteria'
        : error;

    return (
      <YStack>
        {/* label */}
        {label && (
          <Label
            color={colors.grey04}
            fontFamily="Inter-Medium"
            fontSize={15}
            marginBottom={Platform.OS === 'ios' ? 12 : 8}
          >
            {label}
          </Label>
        )}
        <XStack position="relative">
          {/* icon left */}
          {startIcon && (
            <TouchableOpacity>
              <View
                position="absolute"
                justifyContent="center"
                alignItems="center"
                width={normalizeSize(30)}
                height={normalizeSize(30)}
                right={normalizeSize(20)}
                bottom={normalizeSize(12)}
              >
                {startIcon}
              </View>
            </TouchableOpacity>
          )}
          <StyledInput
            readOnly={isReadOnly}
            borderColor={error ? colors.errorBorder : colors.borderColor}
            flex={1}
            placeholderTextColor={colors.placeholder}
            backgroundColor={isReadOnly ? colors?.lightGrey : colors.input}
            color={colors.grey05}
            pointerEvents="auto"
            {...others}
            value={others.value}
            onChangeText={val => {
              others.onChangeText && others.onChangeText(val);
              if (showRules) checkPasswordRules(val);
            }}
          >
            {children}
          </StyledInput>
          {/* icon right */}
          {(endIcon || loading) && (
            <View
              position="absolute"
              justifyContent="center"
              alignItems="center"
              width={normalizeSize(30)}
              height={normalizeSize(30)}
              right={normalizeSize(16)}
              bottom={normalizeSize(16)}
            >
              {loading ? (
                <TouchableOpacity disabled={loading}>
                  <Spinner size="small" />
                </TouchableOpacity>
              ) : (
                endIcon
              )}
            </View>
          )}
        </XStack>
        {/* error msg */}
        {error || helperText ? (
          <XStack
            marginTop={7}
            alignItems="flex-start"
            justifyContent="space-between"
          >
            {error ? (
              <Label fontSize={normalizeSize(14)} color={colors.error}>
                {error}
              </Label>
            ) : null}
            {helperText ? (
              <Label
                marginLeft="auto"
                fontSize={normalizeSize(14)}
                color={colors.grey05}
              >
                {helperText}
              </Label>
            ) : null}
          </XStack>
        ) : null}
        {showRules && (
          <YStack marginTop={8}>
            <RuleItem
              passed={passwordRules.isEightStringLongerOrMore}
              text="Be at least 8 characters long"
            />
            <RuleItem
              passed={passwordRules.isContainAtLeastOneDigit}
              text="Contain at least 1 digit (0–9)"
            />
            <RuleItem
              passed={passwordRules.isContainAtLeastOneUppercase}
              text="Contain at least 1 uppercase letter (A–Z)"
            />
            <RuleItem
              passed={passwordRules.isContainAtLeastOneSpecialCharacter}
              text="Contain at least 1 special character (@#$&!+)"
            />
          </YStack>
        )}
      </YStack>
    );
  },
);

Input.displayName = 'Input';

export default Input;
