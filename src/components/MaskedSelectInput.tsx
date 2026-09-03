import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import { StyleSheet, View, Text } from 'react-native';
import colors from '../theme/color';
import ArrowDown from '../assets/svg/down_light.svg';

import {
  verticalScale,
  horizontalScale,
  moderateScale,
} from '../theme/metrics';
import { useAppSelector } from '../hooks/hook';

interface DataProps {
  key: number;
  label: string;
  value: string;
}

interface SelectProps {
  selected: string | null;
  onChange: (value: string | null) => void;
  data: DataProps[];
  placeholderLabel: string;
  label: string;
}

const MaskedSelectPicker: React.FC<SelectProps> = ({
  selected,
  onChange,
  data,
  placeholderLabel,
  label,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);

  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      paddingRight: horizontalScale(30), // to ensure the text is never behind the icon
      width: '100%',
      paddingHorizontal: horizontalScale(12),
      height: 54,
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(12),
      fontStyle: 'normal',
      fontWeight: '600',
      color: currentTheme === 'dark' ? colors.white : colors.black,
      // color: colors.rgba65,
    },
    inputAndroid: {
      paddingRight: horizontalScale(30), // to ensure the text is never behind the icon
      width: '100%',
      paddingHorizontal: horizontalScale(12),
      height: 54,
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(12),
      fontStyle: 'normal',
      fontWeight: '600',
      color: currentTheme === 'dark' ? colors.white : colors.black,
      // color: colors.rgba65,
    },
    placeholder: {
      // color: colors.rgba30,
      color: currentTheme === 'dark' ? colors.white : colors.black,
    },
  });
  return (
    <View
      style={{
        ...styles.container,
        borderColor:
          currentTheme === 'dark' ? colors.lightPrimary : colors.black,
      }}
    >
      <Text style={styles.label}>{label}</Text>
      <RNPickerSelect
        onValueChange={value => onChange(value)}
        items={data}
        value={selected}
        placeholder={{
          label: placeholderLabel,
          value: null,
        }}
        useNativeAndroidPickerStyle={false}
        style={{
          ...pickerSelectStyles,
          iconContainer: {
            top: 30,
            right: 15,
          },
        }}
        Icon={() => {
          return (
            <ArrowDown fill={currentTheme === 'dark' ? colors.white : 'none'} />
          );
        }}
      />
    </View>
  );
};

export default MaskedSelectPicker;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: moderateScale(5),
  },
  label: {
    position: 'absolute',
    left: 10,
    top: -10, // Adjust as needed
    backgroundColor: colors.white,
    paddingHorizontal: 2,
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(10),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.userText,
  },
});
