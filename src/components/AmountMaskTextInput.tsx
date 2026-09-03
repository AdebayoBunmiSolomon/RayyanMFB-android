import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { colors, moderateScale } from '../theme/metrics';

interface AmountMaskTextInputProps {
  setValue: (text: string) => void;
  value: string;
}

const AmountMaskTextInput: React.FC<AmountMaskTextInputProps> = ({
  value,
  setValue,
}) => {
  // const formatAmount = React.memo((text: string): string => {
  //   // Format the amount with commas and a Naira symbol
  //   const number = parseInt(text.replace(/\D/g, ''), 10); // Extract digits
  //   const formattedValue = new Intl.NumberFormat('en-NG', {
  //     style: 'currency',
  //     currency: 'NGN',
  //   }).format(number / 100);
  //   return formattedValue;
  // });

  const formatAmount = (text: string) => {
    // Format the amount with commas and a Naira symbol
    const number = parseInt(text.replace(/\D/g, ''), 10); // Extract digits
    const formattedValue = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(number / 100);
    return formattedValue;
  };

  // const onChangeText = React.memo((text: string) => {
  //   const formattedText = formatAmount(text);
  //   setValue(formattedText);
  // });

  const onChangeText = (text: string) => {
    const formattedText = formatAmount(text);
    setValue(formattedText);
  };

  return (
    <View
      style={{
        ...styles.inputContainer,
        borderColor: colors.black,
      }}
    >
      <Text style={styles.label}>Amount</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Amount"
        style={styles.input}
        keyboardType={'number-pad'}
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
    fontSize: moderateScale(13),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
    padding: 8,
  },
});

export default AmountMaskTextInput;
