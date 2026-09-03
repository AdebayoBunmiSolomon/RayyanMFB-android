import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountSliceTypes } from '../types/account.types';

const initialState: AccountSliceTypes = {
  selectedAccount: undefined,
  accounts: [],
};

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setSelectedAccount: (
      state,
      { payload }: PayloadAction<AccountSliceTypes['selectedAccount']>,
    ) => {
      state.selectedAccount = payload;
    },
    setAccounts: (
      state,
      { payload }: PayloadAction<AccountSliceTypes['accounts']>,
    ) => {
      state.accounts = payload;
    },
  },
});
export const { setSelectedAccount, setAccounts } = accountSlice.actions;

export default accountSlice.reducer;
