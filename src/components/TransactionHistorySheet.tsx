import React, { useState } from 'react';
import { Text, View, YStack } from 'tamagui';
import SelectOption from './SelectOption';
import MaskedDateSelect from './MaskedDateSelect';
import moment from 'moment';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';

const filterOptions = [
  {
    key: 2,
    label: 'Credit',
    value: 'C',
  },
  {
    key: 3,
    label: 'Debit',
    value: 'D',
  },
];

const today = moment().startOf('day');

const TransactionHistorySheet = ({ onSubmit, closeSheet, setFilter }: any) => {
  const { colors } = useTheme();

  const [filters, setFilters] = useState({
    tranType: 'B',
    fromDate: undefined,
    toDate: undefined,
  });

  const [dateError, setDateError] = useState<string | undefined>();

  const handleChange = (key: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleFromDateChange = (itemValue: string) => {
    const selected = moment(itemValue, 'DD-MM-YYYY');
    handleChange('fromDate', selected.format('DD-MM-YYYY'));

    // auto-clear toDate if it's now invalid
    if (filters.toDate) {
      const currentToDate = moment(filters.toDate, 'DD-MM-YYYY');
      if (currentToDate.isBefore(selected)) {
        handleChange('toDate', undefined);
      }
    }
  };

  const handleToDateChange = (itemValue: string) => {
    const selected = moment(itemValue, 'DD-MM-YYYY');
    handleChange('toDate', selected.format('DD-MM-YYYY'));
  };

  const submitHandler = () => {
    setFilter(filters);
    closeSheet();
    onSubmit(filters);
  };

  return (
    <View paddingInline={24} paddingBlock={16} flex={1}>
      <Text
        textAlign="center"
        color={colors.grey06}
        fontFamily="Inter-SemiBold"
        fontSize={16}
      >
        Filter Transactions
      </Text>
      <YStack marginTop={32} gap={20}>
        <SelectOption
          label="Transaction Type"
          placeholderLabel="All Transactions"
          defaultValue="B"
          selected={filters.tranType}
          onChange={value => {
            handleChange('tranType', value);
            console.log('selected value', value);
          }}
          data={filterOptions}
        />
        <MaskedDateSelect
          label="From Date"
          placeholder="DD-MM-YYYY"
          width={'100%'}
          onValueChange={handleFromDateChange}
          value={filters.fromDate}
          maxDate={today?.toDate()}
        />
        <MaskedDateSelect
          label="To Date"
          placeholder="DD-MM-YYYY"
          width={'100%'}
          onValueChange={handleToDateChange}
          value={filters.toDate}
          minDate={
            // must be >= fromDate, fallback to today if not set
            filters.fromDate
              ? moment(filters.fromDate, 'DD-MM-YYYY').toDate()
              : today.toDate()
          }
        />
        {dateError && (
          <Text
            color={colors.error ?? 'red'}
            fontSize={12}
            fontFamily="Inter-Regular"
          >
            {dateError}
          </Text>
        )}
      </YStack>
      <Button
        marginTop={20}
        marginBottom={32}
        onPress={submitHandler}
        disabled={!filters?.fromDate || !filters?.toDate}
        width={'100%'}
        loading={false}
      >
        Filter
      </Button>
    </View>
  );
};

export default TransactionHistorySheet;
