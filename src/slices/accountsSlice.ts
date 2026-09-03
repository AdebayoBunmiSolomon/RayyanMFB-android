import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Accounts_ } from '../types/transactions.types';

const initialState: Accounts_[] = [
  {
    id: 0,
    accountNumber: '',
    accountName: '',
    preferredName: '',
    customerId: '',
    schemeType: '',
    accountType: '',
    schemeCode: '',
    solId: '',
    primaryFlag: '',
    hiddenFlag: '',
    currencyCode: '',
    status: '',
    kycLevel: '',
    acctBalance: 0,
  },
];

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setAllTransactionsAccounts: (
      state,
      { payload }: PayloadAction<Accounts_[]>,
    ) => {
      return (state = payload);
    },
  },
});

export const { setAllTransactionsAccounts } = accountsSlice.actions;

export default accountsSlice.reducer;
