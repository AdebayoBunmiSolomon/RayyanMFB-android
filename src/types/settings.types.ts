export interface ChangePassword_ {
  confirmPassword: string;
  newPassword: string;
  oldPassword: string;
}

export interface UserSecutiyQuestionResponse {
  message: string;
  data: string[];
  code: string;
  error: boolean;
}

export interface UserSecutiyQuestionParams {
  acctNum: string;
}

export interface SecretQuestion {
  transactionPin: string;
  questionsAndAnswers: {};
}

export interface TnxPIN {
  command: string;
  request: {
    newPin: string;
    // oldPin: string;
    questionsAndAnswers: {};
  };
}

export interface AccountOfficeResponse {
  officerCode: string;
  officerName: string;
  branchName: string;
  gender: string;
  phoneNumber: string;
  emailAddress: string;
  account: {
    accountId: string;
    accountNumber: string;
    accountCurrency: string;
    accountOpenDate: string;
    accountName: string;
    accountStatus: string;
    customerId: string;
    schemeType: string;
    schemeCode: string;
    solId: string;
    freezeCode: string | null;
    availableBalance: string;
    bookBalance: string;
    sanctionLimit: string | null;
    drawingPower: string | null;
  };
}

export interface ProfilePicture {
  profileImage: string;
}

export interface GetProfileResponse {
  code: string;
  data: {
    bvn: string;
    email: string;
    firstName: string;
    lastLoginDate: string;
    lastName: string;
    phoneNumber: string;
    profileImage: string | null;
    userName: string;
    hasTransactionPin: boolean;
  };
  error: boolean;
  message: string;
}

export interface UserProfile {
  bvn?: string;
  email?: string;
  firstName?: string;
  lastLoginDate?: string;
  lastName?: string;
  phoneNumber?: string;
  profileImage?: string | null;
  userName?: string;
  userType: 'corp' | 'retail';
  hasTransactionPin?: boolean | undefined;
}

export interface SavePhotoResponse {
  code: string;
  data: string | null;
  error: boolean;
  message: string;
}

export interface KycTypes {
  bvn?: string;
  ninNumber?: string;
  sourceOfIncome?: string;
  placeOfWork?: string;
  workAddress?: string;
  workAddressState?: string;
  modeOfIdentification?: string;
  idImage?: string;
  accountNumber?: string;
  maidenName?: string;
  nextOfKin?: string;
}
