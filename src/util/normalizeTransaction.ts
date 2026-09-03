import {
  LegacyTransaction,
  NormalizedTransaction,
  TenTransactions,
} from '../types/transactions.types';
import Moment from 'moment';

export const normalizeTransaction = (
  tx: TenTransactions | LegacyTransaction,
): NormalizedTransaction => {
  if ('postedDate' in tx) {
    // New API
    return {
      narration: tx.narration,
      postedAt: Moment(tx.postedDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
      valueDate: tx.valueDate,
      tranType: tx.tranType,
      tranId: tx.tranId,
      uniqueIdentifier: tx.uniqueIdentifier,
      balance: tx.balance,
      debitAmount: tx.debitAmount,
      creditAmount: tx.creditAmount,
    };
  }

  // Legacy API
  return {
    narration: tx.narration,
    postedAt: Moment(tx.postDate, 'YYYY-MM-DD HH:mm:ss').toDate(),
    valueDate: tx.valueDate,
    tranType: tx.tranType,
    tranId: tx.tranId,
    uniqueIdentifier: tx.uniqueIdentifier,
    balance: tx.accountBalance,
    debitAmount: tx.debitAmount,
    creditAmount: tx.creditAmount,
  };
};
