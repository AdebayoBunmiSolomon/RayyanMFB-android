import React, { useEffect, useState } from 'react';
import { Text, Platform, View, Pressable, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Moment from 'moment';
import Calendar from '../assets/svg/calendar.svg';
import { verticalScale, moderateScale, colors } from '../theme/metrics';
// import { useAppSelector } from '../hooks/hook';

interface DateTimePickerProps {
  value: string; // Value received from the server// string
  onValueChange: (date: string) => void; // Callback function to handle value change
  placeholder: string;
  width: any;
  height: number;
  marginTop?: number;
  disabled: boolean;
}

const maximumDate = Moment().subtract(18, 'years').endOf('year').toDate();

const CustomDateSelect: React.FC<DateTimePickerProps> = ({
  value,
  onValueChange,
  placeholder,
  width,
  height,
  marginTop,
  disabled,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date(value));

  // const { currentTheme } = useAppSelector(state => state.theme);

  useEffect(() => {
    setSelectedDate(new Date(value));
  }, [value]);

  // const showDatePicker = React.memo(() => {
  //   setDatePickerVisibility(true);
  // });

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // const hideDatePicker = React.memo(() => {
  //   setDatePickerVisibility(false);
  // });

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // const handleConfirm = React.memo((date: Date) => {
  //   const formattedDate = Moment(date).toISOString(); // Format the date as per your server's requirement
  //   setSelectedDate(date);
  //   onValueChange(formattedDate);
  //   hideDatePicker();
  // });

  const handleConfirm = (date: Date) => {
    const formattedDate = Moment(date).toISOString(); // Format the date as per your server's requirement
    setSelectedDate(date);
    onValueChange(formattedDate);
    hideDatePicker();
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
          {selectedDate ? Moment(value).format('YYYY-MM-DD') : placeholder}
        </Text>
        <Calendar />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={'date'}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={selectedDate}
        display={Platform.OS === 'ios' ? 'inline' : 'spinner'}
        maximumDate={maximumDate}
        disabled={disabled}
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

export default CustomDateSelect;
