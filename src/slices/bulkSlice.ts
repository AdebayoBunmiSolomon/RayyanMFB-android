import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BulkTransfer } from '../types/transfer.types';

const initialState: BulkTransfer[] = [];

export const bulkTransferSlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {
    setBulkTransfer: (state, { payload }: PayloadAction<BulkTransfer>) => {
      state.push({ ...payload, id: state.length + 1 });
    },
    removeBulkTransfer: (state, { payload }: PayloadAction<number>) => {
      return state.filter(item => item.id !== payload);
    },
    resetBulkTransfer: () => {
      return [];
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const selectTotalAmount = (state: BulkTransfer[]): number => {
  return state.reduce(
    (total, transfer) => total + +transfer.amount.replaceAll(',', ''),
    0,
  );
};

export const { setBulkTransfer, removeBulkTransfer, resetBulkTransfer } =
  bulkTransferSlice.actions;

export default bulkTransferSlice.reducer;
