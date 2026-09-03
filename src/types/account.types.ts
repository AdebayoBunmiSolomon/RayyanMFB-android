import { Accounts_ } from './transactions.types';

export type AccountSliceTypes = {
  selectedAccount: Accounts_;
  accounts: Accounts_[];
};

export type AccountSlideTypes = {
  noActions: boolean | undefined;
} & Accounts_;

export type AccountUpgradeTypes = {
  accountNumber: string;
  bvn: string;
  currentAccountTier: number;
  idImage: string;
  modeOfIdentification: string;
  ninNumber: string;
  photoImage: string;
  placeOfWork: string;
  signatureImage: string;
  sourceOfIncome: string;
  targetAccountTier: number;
  workAddress: string;
  workAddressState: string;
  status: string;
};

export type AccountUpgradeTypes2 = {
  accountNumber: string;
  bvn: string;
  currentAccountTier: number;
  idImage: string;
  modeOfIdentification: string;
  ninNumber: string;
  photoImage: string;
  placeOfWork: string;
  signatureImage: string;
  sourceOfIncome: string;
  targetAccountTier: number;
  workAddress: string;
  workAddressState: string;
  status: string;
  maidenName: string;
  nextOfKin: string;
};

export type KycRequestTypes = {
  accountNumber: string;
  approvedBy: null | string;
  approvedOn: null | string;
  createdOn: string;
  currentAccountTier: number;
  id: number;
  idImage: string;
  maidenName: string;
  modeOfIdentification: string;
  nextOfKin: string;
  ninNumber: string;
  photoImage: string;
  placeOfWork: string;
  proofOfAddressImage: null;
  rejectReason: null;
  rejectedBy: {
    firstName: null;
  };
  rejectedOn: null;
  remarks: null;
  signatureImage: string;
  sourceOfIncome: string;
  status: string;
  targetAccountTier: number;
  workAddress: string;
  workAddressState: string;
};
