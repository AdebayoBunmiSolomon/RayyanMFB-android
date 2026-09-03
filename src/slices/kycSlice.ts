import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KycTypes } from '../types/settings.types';

const initialState: KycTypes = {
  bvn: '',
  ninNumber: '',
  sourceOfIncome: '',
  placeOfWork: '',
  workAddress: '',
  workAddressState: '',
  idImage: '',
  modeOfIdentification: '',
  accountNumber: '',
  maidenName: '',
  nextOfKin: '',
};

export const kycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    setKyc: (state, { payload }: PayloadAction<KycTypes>) => {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
export const { setKyc } = kycSlice.actions;

export default kycSlice.reducer;
