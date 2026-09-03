import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { Platform, StyleSheet } from 'react-native';
import { Label, View, YStack } from 'tamagui';
import { SelectDataProps } from '../types';
import { ArrowDown2 } from 'iconsax-react-native';
import { useTheme } from '../context/ThemeContext';

interface SelectProps {
  selected: string | undefined;
  onChange: (value: string | null) => void;
  data: SelectDataProps[] | undefined;
  placeholderLabel: string;
  error?: string | boolean;
  label?: string;
  defaultValue?: string;
}

const SelectPicker: React.FC<SelectProps> = ({
  selected,
  onChange,
  data,
  placeholderLabel,
  error,
  label,
  defaultValue,
}) => {
  const { colors, theme } = useTheme();

  const pickerSelectStyles = StyleSheet.create({
    input: {
      paddingRight: 30, // to ensure the text is never behind the icon
      width: '100%',
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: colors.inputBorder,
      height: 56,
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.grey06,
      borderRadius: 16,
      backgroundColor: colors.input,
    },
    placeholder: {
      color: colors.placeholder,
    },
  });

  return (
    <YStack>
      {/* label */}
      {label && (
        <Label
          color={colors.grey05}
          fontFamily="Inter-Medium"
          fontSize={14}
          marginBottom={12}
        >
          {label}
        </Label>
      )}
      <RNPickerSelect
        onValueChange={value => onChange(value)}
        items={data ?? []}
        value={selected}
        placeholder={{
          label: placeholderLabel,
          value: defaultValue,
        }}
        darkTheme={Platform.OS === 'ios' ? undefined : theme}
        useNativeAndroidPickerStyle={false}
        style={{
          ...pickerSelectStyles,
          inputAndroid: pickerSelectStyles.input,
          inputIOS: pickerSelectStyles.input,
          backgroundColor: colors.input,
          iconContainer: {
            top: 30,
            right: 15,
          },
        }}
        Icon={() => {
          return (
            <View top={-13}>
              <ArrowDown2 color={colors.grey05} size={20} />
            </View>
          );
        }}
      />
      {/* error msg */}
      {error && (
        <Label fontSize={12} marginTop={6} color={colors.error}>
          {error}
        </Label>
      )}
    </YStack>
  );
};

export default SelectPicker;
