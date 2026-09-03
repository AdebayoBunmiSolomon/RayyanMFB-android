export interface SignInUser {
  deviceId?: string;
  corporateId?: string;
  passWord: string;
  userName: string;
}

export interface SignInUserResponse {
  isLoggedIn: boolean;
  showSplash?: boolean;
  error?: boolean;
  message?: string;
  data: {
    firstName: string;
    lastName: string | null;
    phoneNumber: string;
    email: string;
    token: string;
    username: string;
  };
  code?: string;
}

export interface ErrorResponse {
  message: string;
  data: {
    message: string;
    data: Object | null;
    code: string | null;
    error: boolean;
  };
  status: number;
}

export interface OtpRequest {
  accountNumber: string;
  lastFourDigitsOfBVN: string;
}

export interface OtpVerification {
  accountNumber: string;
  lastFourDigitsOfBVN: string;
  otp: string;
}

export interface SecQuestionnaire {
  code: string;
  type: string;
  description: string;
  extraInfo: string | null;
  version: number;
  DT_RowId: number;
}

export interface RegExistAccount {
  acctNumber: string;
  confirmPassword: string;
  acceptedTermsAndConditions: boolean;
  password: string;
  secAns: string[];
  secQes: string[];
  userName: string;
}

export interface RegExistAccountResponse {
  code: string;
  data: [] | null;
  error: boolean;
  message: string;
}

export interface BvnCustomerDetails {
  cifId: string | null;
  customerName: string | null;
  dateOfBirth: string;
  email: string;
  phone: string;
  bvn: string;
  lastName: string;
  firstName: string;
  middleName: string;
  preferredName: string | null;
  rcNo: string | null;
  taxId: string | null;
  corp: boolean;
}

export interface ForgotRequestQuestions {
  emailAddress: any;
  accountNumber: string;
  lastFourDigitsOfBvn: string;
  username: string;
}
export interface ForgotPasswordCorp {
  email: string;
  username: string;
  corpID: string;
}

export type ForgotPasswordCorpVerifyPayload = {
  corpID: string | undefined;
  userEmail: string;
  userName: string;
  secQesAns: string[];
  secQes: string[];
};

export interface ForgotRequestQuestionsResponse {
  code: string;
  data: string[];
  error: boolean;
  message: string;
}

export interface ResetPassword {
  newPassword: string;
  confirmPassword: string;
  userName: string;
  questionsAndAnswers: Object;
}

export interface ResetPassword_ {
  newPassword: string;
  confirmPassword: string;
  userName: string;
  secQesAns: string[];
  secQes: string[];
}

export interface ForgotPasswordOTPRequest {
  username: string;
  secretQuestion: string;
  secretAnswer: string;
}

export interface ForgotPasswordOTPVerification {
  username: string;
  secretQuestion: string;
  secretAnswer: string;
  otp: string;
}

export interface ResetDevice {
  accountNum: string;
  secQesAns: string[];
  secQes: string[];
  userName: string;
  deviceId: string;
}

export interface ResetDeviceResponse {}

export interface ResetPasswordResponse {
  code: string;
  data: any;
  error: boolean;
  message: string;
}

export interface CreateNewAccount {
  confirmPassword: string;
  acceptedTermsAndConditions: boolean;
  customerCreationRequest: {
    bvn: string;
    customerImage: string;
    dateOfBirth: string;
    gender: string;
    identificationImage: string;
    nationalIdentityNo: string;
    customerSignature: string;
    lastName: string;
    address: string;
    otherNames: string;
    phoneNo: string;
    email: string;
  };
  password: string;
  secAns: string[];
  secQes: string[];
  userName: string;
  // email: string;
}

export interface CreateNewAccountResponse {
  code: string;
  data: string;
  error: boolean;
  message: string;
}

export interface FAQTypes {
  DT_RowId: number;
  answer: string;
  question: string;
}

export interface ThemeState {
  theme?: 'dark' | 'light';
}
