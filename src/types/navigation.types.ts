import {
  NavigatorScreenParams,
  CompositeScreenProps,
} from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import {
  BvnCustomerDetails,
  CreateNewAccountResponse,
  OtpRequest,
  OtpVerification,
} from './public.types';
import {
  Beneficiaries,
  InterBankResponse,
  IntraBankResponse,
  OtherBanksRoute,
  StandingOrderRoute,
} from './transfer.types';
import { BillsDetails } from './bills-payments.types';

// React Navigation

export type TabsStackParamList = {
  Home: undefined;
  Account: undefined;
  Notifications: undefined;
  Support: undefined;
  Settings: undefined;
};

export type PublicStackParamList = {
  OTPVerification: Record<'item', OtpRequest>;
  ConfirmUserAccount: undefined;
  Splash: undefined;
  Advert: undefined;
  Support: undefined;
  AccountInformation: { userName: string };
  AccountCorpInfo: { userName: string };
  ForgotPasswordSecurityQA: Record<'item', SecurityQARoute>;
  NewTokenPassword: undefined;
  SecurityQACorp: Record<'item', SecurityQARoute>;
  DeviceSuccess: undefined;
  SecurityQA: Record<'item', SecurityQARoute>;
  DeviceOTP: Record<'item', ForgotPasswordOTPRoute>;
  AcctInfo: undefined;
  ConfirmTokenPassword: undefined;
  NewPassword: Record<'item', NewPasswordRoute>;
  PasswordSuccess: { message: string };
  SecQuestion: Record<'item', SecQuestionRoute>;
  ForgotPasswordOTP: Record<'item', ForgotPasswordOTPRoute>;
  AccountInfo: undefined;
  CardNumber: undefined;
  CreateUsername: Record<'item', CreateUsernameRoute>;
  RegisterSuccess: { message: string };
  SecurityQuestion: Record<'item', OtpVerification>;
  Bvn: undefined;
  Identification: Record<'item', IdentificationRoute>;
  Kyc: Record<'item', BvnCustomerDetails>;
  Signature: Record<'item', SignatureRoute>;
  Success: Record<'item', CreateNewAccountResponse>;
  Username: Record<'item', UsernameRoute>;
  Login: undefined;
  QuestionPage: undefined;
  Question: Record<'item', QuestionsRoute>;
  PDF: { item: string };
  Contact: undefined;
  SecurityQuestionReset:
    | {
        username?: string;
      }
    | undefined;
  SecQuestionResetOTP: {
    secQes: string[];
    secQesAns: string[];
    username: string;
  };
};

export interface CreateUsernameRoute {
  accountNumber: string;
  lastFourDigitsOfBVN: string;
  otp: string;
  secQes: string[];
  secAns: string[];
}

export interface SecQuestionRoute {
  data: string[];
  username: string;
}

export interface NewPasswordRoute {
  username: string;
  secretQuestion: string;
  secretAnswer: string;
}

export interface ForgotPasswordOTPRoute {
  username: string;
  secretQuestion: string[];
  secretAnswer: string[];
}

export interface SecurityQARoute {
  userName: string;
  email: string;
  accountNum?: string;
  data: string[];
  lastFourDigitsOfBVN?: string;
  corpID?: string;
}

export interface IdentificationRoute {
  bvn: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  gender: string;
  address: string;
  email: string;
}

export interface SignatureRoute {
  bvn: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  gender: string;
  // meansOfIdentity: string;
  // photo: string;
  address: string;
  email: string;
}

export interface QuestionsRoute {
  bvn: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  gender: string;
  // meansOfIdentity: string;
  // photo: string;
  profilePicture: string;
  // signature: string;
  address: string;
  email: string;
}

export interface UsernameRoute {
  bvn: string;
  dateOfBirth: string;
  firstName: string;
  lastName: string;
  middleName: string;
  phone: string;
  gender: string;
  // meansOfIdentity: string;
  // photo: string;
  profilePicture: string;
  // signature: string;
  secQes: string[];
  secAns: string[];
  address: string;
  email: string;
}

export type MainStackParamList = {
  Tabs: NavigatorScreenParams<TabsStackParamList>;
  //Other Main Stack Screens below
  Advert: undefined;
  Shortcut: undefined;
  Theme: undefined;
  KycRequestStatus: undefined;
  AccountUpgradeRequirements: undefined;
  AccountUpgradeRequest: undefined;
  AccountInsight: undefined;
  ServiceRequest: undefined;
  NewServiceRequest: undefined;
  RequestForm: undefined;
  Faq: undefined;
  Menu: undefined;
  Transfer: undefined;
  TransactionOTP: Record<'item', { onSuccess?: () => void }>;
  BulkTransferStatus: undefined;
  BillBeneficiaries: undefined;
  BatchRequests: undefined;
  BulkTransfer: undefined;
  BulkDetails: undefined;
  BulkMultiTransfer: Record<'item', OtherBanksRoute>;
  TransferSummary: undefined;
  TransferTypes: undefined;
  Rayyan: undefined;
  OwnAccount: undefined;
  OtherBanks: Record<'item', OtherBanksRoute>;
  StandingOrder: Record<'item', StandingOrderRoute>;
  Reviews: Record<'item', ReviewRoute>;
  ReviewsRayyan: Record<'item', ReviewRoute>;
  ReviewsOwnAccount: Record<'item', ReviewRoute>;
  TransferReceipt: Record<'item', InterBankResponse>;
  RayyanReceipt: Record<'item', IntraBankResponse>;
  AddBeneficiary: undefined;
  Beneficiaries: undefined;
  EditBeneficiary: Record<'item', Beneficiaries>;
  ChangePassword: undefined;
  SecurityQuestions: undefined;
  MaintainPin:
    | {
        otpVerified?: boolean;
        securityData?: any;
        enteredOtp?: string;
        secretQuestion?: string;
        secretAnswer?: string;
      }
    | undefined;
  TransactionPinOTP: { item?: any };
  TransactionLimit: undefined;
  SetTransactionLimit: undefined;
  UpgradeTransactionLimit: undefined;
  AccountLimit: undefined;
  AccountAllLimit: undefined;
  TransactionHistory: undefined;
  GenerateStatement: undefined;
  TransactionReceipt: {
    tranId: string;
    // tranDate?: string;
    narration: string;
    amount: string;
    uniqueIdentifier: string;
  };
  AccountSummary: undefined;
  AccountUpgrade: undefined;
  AccountUpgradeIdentity: undefined;
  AccountUpgradeSignature: undefined;
  AccountUpgradeProofAddress: undefined;
  AirtimeData: undefined;
  BillsPage: undefined;
  BillsReview: Record<'item', BillsDetails>;
  AddBillBeneficiary: undefined;
  BillReceipt: { id: string };
  BillsHistory: undefined;
  AccountOfficer: undefined;
  StandingOrderScreen: undefined;
};

export interface ReviewRoute {
  // addBeneficiaryFlag: string;
  saveBeneficiary: boolean;
  beneficiaryAccountNumber: string;
  beneficiaryAccountName: string;
  amount: string;
  customerAccountNumber: string;
  remarks: string;
  beneficiaryBank?: string;
  beneficiaryBankName?: string;
  Faq?: string;
  type?: 'self' | 'rayyan' | 'other' | 'standing-order';
}

export type PublicStackScreenProps<Screen extends keyof PublicStackParamList> =
  NativeStackScreenProps<PublicStackParamList, Screen>;

export type MainStackScreenProps<Screen extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, Screen>;

export type TabsStackScreenProps<Screen extends keyof TabsStackParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabsStackParamList, Screen>,
    NativeStackScreenProps<MainStackParamList>
  >;
