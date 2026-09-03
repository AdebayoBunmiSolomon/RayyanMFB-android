import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import { colors, moderateScale, verticalScale } from '../theme/metrics';
import Calendar from '../assets/svg/calendar.svg';

interface DatePickerProps {
  onValueChange: (date: string) => void;
  placeholder: string;
  width: any;
  height: number;
  marginTop?: number;
}

const DateSelect = ({
  onValueChange,
  placeholder,
  width,
  height,
  marginTop,
}: DatePickerProps) => {
  const [selectedDate, setSelectedDate] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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
    <View style={{ width: width, height: height }}>
      <Pressable
        style={{
          ...styles.dateContainer,
          height,
          marginTop,
          justifyContent: 'space-between',
        }}
        onPress={showDatePicker}
      >
        <Text style={styles.dateText}>
          {selectedDate
            ? Moment(selectedDate).format('YYYY-MM-DD')
            : placeholder}
        </Text>
        <Calendar />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'date'}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate}
        display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // paddingHorizontal: horizontalScale(16),
    borderWidth: 1,
    borderColor: colors.rgba20,
    padding: 15,
    height: verticalScale(54),
    backgroundColor: colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(12),
    fontStyle: 'normal',
    fontWeight: '700',
    color: colors.black,
  },

  dateText: {
    color: colors.rgba30,
    fontSize: moderateScale(12),
    fontStyle: 'normal',
    fontWeight: '700',
    fontFamily: 'Inter-Regular',
  },
});
export default DateSelect;
