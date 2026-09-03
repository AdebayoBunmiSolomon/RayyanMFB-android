import React from 'react';
import { formatToCurrency } from '../util/format';
import truncate from '../util/truncate';
import CurrencyList from 'currency-list';

import balanceStyles from '../styles/balance';
import { Text, View } from 'tamagui';

const { styles } = balanceStyles();

type BalanceProps = {
  amount: string;
  currency: string;
  visible: boolean;
  onPress?: () => void;
  small?: boolean;
};

function Balance({ amount, currency, visible, onPress, small }: BalanceProps) {
  const fnAvalBalance = amount?.split?.('.');
  const currencySymbol = CurrencyList.get(currency).symbol;

  return (
    <View
      minHeight={40}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Text
        style={{
          ...styles.amount,
          fontSize: small ? 28 : 32,
          height: visible ? 'auto' : 25,
        }}
        onPress={onPress}
      >
        {visible ? (
          <>
            {currencySymbol}
            {truncate(formatToCurrency(+fnAvalBalance?.[0]), 13)}
            <Text style={{ ...styles.decimal, fontSize: small ? 20 : 26 }}>
              .{fnAvalBalance?.[1]}
            </Text>
          </>
        ) : (
          '*******'
        )}
      </Text>
    </View>
  );
}

export default Balance;
