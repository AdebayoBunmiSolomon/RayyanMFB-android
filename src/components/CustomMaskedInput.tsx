import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { colors, moderateScale, verticalScale } from '../theme/metrics';
import { useAppSelector } from '../hooks/hook';

type Props = React.ComponentProps<typeof TextInput> & {
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightIconPress: () => void;
};

const CustomMaskedInput: React.FC<Props> = ({
  leftIcon,
  rightIcon,
  rightIconPress,
  label,
  ...props
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  return (
    <View
      style={{
        ...styles.inputContainer,
        borderColor: currentTheme === 'dark' ? colors.white : colors.black,
      }}
    >
      {leftIcon && <View>{leftIcon}</View>}
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
      {rightIcon && (
        <TouchableOpacity onPress={rightIconPress}>
          {rightIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: moderateScale(5),
    paddingHorizontal: 10,
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
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    color: colors.black,
    fontFamily: 'Inter-Regular',
    fontStyle: 'normal',
    fontWeight: '500',
  },
});

export default CustomMaskedInput;
