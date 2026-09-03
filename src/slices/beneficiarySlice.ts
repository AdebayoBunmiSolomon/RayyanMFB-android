import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BeneficiariesResponse,
  BeneficiaryResponse,
} from '../types/transfer.types';

const initialState: BeneficiaryResponse = {
  loading: false,
  beneficiaries: {
    data: [],
  },
};

export const beneficiarySlice = createSlice({
  name: 'beneficiary',
  initialState,
  reducers: {
    setBeneficiariesList: (
      state,
      { payload }: PayloadAction<BeneficiariesResponse>,
    ) => {
      state.beneficiaries.data = payload.data;
    },
  },
  extraReducers(builder) {
    builder;
  },
});

export const { setBeneficiariesList } = beneficiarySlice.actions;

export default beneficiarySlice.reducer;
