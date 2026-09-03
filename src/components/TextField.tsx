import React from 'react';
import { StyleSheet } from 'react-native';
import { Input, InputProps } from 'tamagui';
import colors from '../theme/color';

export default function TextField({
  style,
  leadingIcon,
  ...others
}: InputProps) {
  return (
    <Input
      {...others}
      style={{ ...styles.input, borderWidth: leadingIcon ? 0 : 1 }}
      placeholderTextColor={colors.rgba30}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#FFFFFF',
    height: 48,
    paddingHorizontal: 12,
    paddingVertical: 0,
    fontSize: 14,
    borderRadius: 6,
    borderColor: colors.rgba20,
    fontWeight: '600',
    width: '100%',
  },
});
