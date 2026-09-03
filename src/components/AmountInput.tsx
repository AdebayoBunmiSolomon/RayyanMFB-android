import React from 'react';
import Input from './Input';
import { InputProps } from '../types';

const AmountInput = ({ value, onChangeText, ...props }: InputProps) => {
  const formatAmount = (amount: string) => {
    // Extract digits and parse into an integer
    const number = parseInt(amount.replace(/\D/g, ''), 10);

    // Handle case where input is empty
    if (!amount) {
      return '';
    }

    // Handle case where number is NaN (e.g., when input has only non-digit characters)
    if (isNaN(number)) {
      return '';
    }

    // Format the number with two decimal places and commas
    const formattedValue = new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    })
      .format(number / 100)
      .replaceAll('₦', '');

    return formattedValue;
  };

  const handleChange = (text: string) => {
    const formattedText = formatAmount(text);
    onChangeText?.(formattedText);
  };

  return (
    <Input
      value={value}
      onChangeText={handleChange}
      keyboardType="numeric"
      {...props}
    />
  );
};

export default AmountInput;
