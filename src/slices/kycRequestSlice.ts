import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { KycRequestTypes } from '../types/account.types';

const initialState: KycRequestTypes = {
  accountNumber: '',
  approvedBy: null,
  approvedOn: null,
  createdOn: '',
  currentAccountTier: 0,
  id: 0,
  idImage: '',
  maidenName: '',
  modeOfIdentification: '',
  nextOfKin: '',
  ninNumber: '',
  photoImage: '',
  placeOfWork: '',
  proofOfAddressImage: null,
  rejectReason: null,
  rejectedBy: {
    firstName: null,
  },
  rejectedOn: null,
  remarks: null,
  signatureImage: '',
  sourceOfIncome: '',
  status: '',
  targetAccountTier: 0,
  workAddress: '',
  workAddressState: '',
};

export const kycRequestSlice = createSlice({
  name: 'kycRequest',
  initialState,
  reducers: {
    setKycRequest: (state, { payload }: PayloadAction<KycRequestTypes>) => {
      return (state = payload);
    },
  },
});

export const { setKycRequest } = kycRequestSlice.actions;

export default kycRequestSlice.reducer;
