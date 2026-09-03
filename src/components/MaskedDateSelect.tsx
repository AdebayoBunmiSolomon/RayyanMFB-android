import React, { useState } from 'react';
import { Text, Pressable, StyleSheet, Platform, DimensionValue } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import { moderateScale } from '../theme/metrics';
import { Label, View, YStack } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { Calendar } from 'iconsax-react-native';

interface MaskedDatePickerProps {
  onValueChange: (date: string) => void;
  placeholder?: string;
  label: string;
  width?: DimensionValue;
  height?: DimensionValue;
  marginTop?: number;
  value?: string;
  disabled?:boolean
  maxDate?: Date;
  minDate?: Date;
}

const MaskedDateSelect = ({
  onValueChange,
  placeholder,
  width,
  height,
  marginTop,
  label,
  value,
  disabled,
  maxDate,
  minDate,
}: MaskedDatePickerProps) => {
  const { colors } = useTheme();

  const [selectedDate, setSelectedDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const displayDate = value
    ? Moment(value, 'DD-MM-YYYY').format('YYYY-MM-DD')
    : placeholder;

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    hideDatePicker();
    setSelectedDate(date);
    onValueChange(date);
  };

  return (
    <YStack style={{ width: width, height: height }}>
      <Label
        color={colors.grey05}
        fontFamily="Inter-Medium"
        fontSize={14}
        marginBottom={12}
      >
        {label}
      </Label>
      <Pressable
        style={{
          ...styles.dateContainer,
          height,
          marginTop,
          justifyContent: 'space-between',
          borderColor: colors.inputBorder,
          paddingRight: 40,
          width: '100%'

        }}
        onPress={showDatePicker}
      >
        <View width={"56%"}>
          <Text style={{ ...styles.dateText, color: colors.grey05 }}>
            {displayDate}
          </Text>
        </View>
        <Calendar color={colors.grey05}/>
      </Pressable>
      <DateTimePickerModal
      disabled={disabled}
        isVisible={isDatePickerVisible}
        mode={'date'}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={value ? Moment(value, 'DD-MM-YYYY').toDate() : new Date()}
        display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
        maximumDate={maxDate}
        minimumDate={minDate}
      />
    </YStack>
  );
};
const styles = StyleSheet.create({
  dateContainer: {
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    fontFamily: 'Inter-Medium',
    fontWeight: '500',
    fontSize: 14,
    padding: 18,
    borderRadius: 16,
    placeholderTextColor: '#868A8A',
    color: '#424444',
  },

  dateText: {
    fontSize: moderateScale(12),
    fontStyle: 'normal',
    fontWeight: '600',
    fontFamily: 'Inter-Regular',
  },
});
export default MaskedDateSelect;
