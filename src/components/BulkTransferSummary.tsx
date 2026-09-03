import { Text, View } from 'react-native';
import React from 'react';

import { useAppSelector } from '../hooks/hook';
import bulkTxnSummaryStyles from '../styles/bulkTransferSummary';
import { selectTotalAmount } from '../slices/bulkSlice';
import { formatToNaira } from '../util/format';

const BulkTransferSummary = ({ title, entries, totalAmount }: any) => {
  const summary = useAppSelector(state => state.bulkTransfer);
  const selectedTotalAmount = selectTotalAmount(summary);

  const { currentTheme } = useAppSelector(state => state.theme);
  const { styles } = bulkTxnSummaryStyles(currentTheme as any);

  return (
    <View style={styles.container}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.heading}>{title ?? 'Batch Summary'}</Text>
      </View>
      {/* summary */}
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {entries ?? summary?.length} Entries
        </Text>
        <Text style={styles.summaryText}>
          {formatToNaira(totalAmount ?? selectedTotalAmount)}
        </Text>
      </View>
      {/* underline */}
      <View style={styles.underline}>
        <View style={styles.circle} />
        <View style={styles.line} />
        <View style={styles.circle} />
      </View>
    </View>
  );
};

export default BulkTransferSummary;
