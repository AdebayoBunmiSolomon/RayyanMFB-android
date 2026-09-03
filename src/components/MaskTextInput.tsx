import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors, moderateScale, verticalScale } from '../theme/metrics';
import { useAppSelector } from '../hooks/hook';

type Props = React.ComponentProps<typeof TextInput> & { label: string };

const MaskTextInput: React.FC<Props> = ({ label, ...props }) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  return (
    <View
      style={{
        ...styles.inputContainer,
        borderColor:
          currentTheme === 'dark' ? colors.lightPrimary : colors.black,
      }}
    >
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={{
          ...styles.input,
          color: currentTheme === 'dark' ? colors.white : colors.black,
        }}
        placeholderTextColor={
          currentTheme === 'dark' ? colors.white : colors.black
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: moderateScale(5),
    padding: 10,
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 2,
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(10),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.userText,
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
    flex: 1,
    height: 54,
    width: '100%',
  },
});

export default MaskTextInput;
