export type InterBank = {
  beneficiaryBank: string;
  beneficiaryAccountNumber: string;
  beneficiaryAccountName: string;
  amount: number | null;
  customerAccountNumber: string | null;
  transactionPin: string;
  transferType: string;
  remarks: string;
  charge: string;
  addBeneficiaryFlag?: string;
  saveBeneficiary?: boolean;
  customerAccountName: string | null;
  beneficiaryBankName: string | null;
  tranDate: string;
  status: string;
};

export interface InterBankResponse {
  message: string;
  data: {
    version: number;
    customerAccountNumber: string;
    customerAccountName: string | null;
    transferType: string;
    bankCode: string;
    financialInstitution: {
      id: number;
      version: number;
      delFlag: string;
      deletedOn: string | null;
      sortCode: string;
      institutionCode: string;
      institutionType: string;
      institutionName: string;
    };
    quicktellerBankCode: string | null;
    beneficiaryEmail: string | null;
    beneficiaryBank: string;
    beneficiaryAccountNumber: string;
    beneficiaryAccountName: string;
    remarks: string;
    status: string;
    tranDate: string;
    referenceNumber: string;
    userReferenceNumber: string;
    narration: string | null;
    sessionId: string | null;
    currencyCode: string | null;
    amount: 1;
    statusDescription: string;
    charge: string;
    token: string | null;
    addBeneficiaryFlag: string | null;
    beneficiaryPrefferedName: string | null;
    lastname: string | null;
    firstname: string | null;
    transferCode: string | null;
    countryCode: string | null;
    deviceNumber: string | null;
    headerProxyAuthorization: string | null;
    headerUserAgent: string | null;
    ip: string | null;
    loginName: string | null;
    sessionkey: string | null;
    sfactorAuthIndicator: string | null;
    tranLocation: string | null;
    channel: string;
    beneficiaryBVN: string | null;
    beneficiaryBankName: string | null;
    beneficiarySortCode: string | null;
    instrumentType: string | null;
    collectionType: string | null;
    payerName: string | null;
    currency: string | null;
    beneficiaryCurrencyCode: string | null;
    beneficiaryType: string | null;
    DT_RowId: number;
  };
  code: string;
  error: boolean;
}

export interface IntraBank {
  addBeneficiaryFlag?: string; //if it's a new beneficiary use Y
  amount: number;
  beneficiaryAccountName: string;
  beneficiaryAccountNumber: string;
  beneficiaryPrefferedName: string;
  customerAccountNumber: string;
  remarks: string;
  narration?: string;
  saveBeneficiary?: boolean;
}

export interface IntraBankResponse {
  message: string;
  data: {
    version: number;
    code?: string;
    customerAccountNumber: string;
    customerAccountName: string | null;
    transferType: string;
    bankCode: string | null;
    financialInstitution?: {
      id: number;
      version: number;
      delFlag: string;
      deletedOn: string | null;
      sortCode: string;
      institutionCode: string;
      institutionType: string;
      institutionName: string;
    };
    customerId?: string | null;
    quicktellerBankCode?: string | null;
    beneficiaryEmail: string | null;
    beneficiaryBank: string | null;
    beneficiaryAccountNumber: string;
    beneficiaryAccountName: string;
    remarks: string;
    status: string;
    tranDate: string;
    referenceNumber: string;
    userReferenceNumber: string;
    narration: string;
    sessionId: string | null;
    currencyCode: string | null;
    amount: number;
    statusDescription: string;
    charge: string | null;
    token: string | null;
    addBeneficiaryFlag: string | null;
    beneficiaryPrefferedName: string | null;
    lastname: string | null;
    firstname: string | null;
    transferCode: string | null;
    countryCode: string | null;
    deviceNumber: string | null;
    headerProxyAuthorization: string | null;
    headerUserAgent: string | null;
    ip: string | null;
    loginName: string | null;
    sessionkey: string | null;
    sfactorAuthIndicator: string | null;
    tranLocation: string | null;
    channel: string;
    beneficiaryBVN: string | null;
    beneficiaryBankName: string | null;
    beneficiarySortCode: string | null;
    instrumentType: string | null;
    collectionType: string | null;
    payerName: string | null;
    currency: string | null;
    beneficiaryCurrencyCode: string | null;
    beneficiaryType: string | null;
    DT_RowId: string;
    tranId?: string;
    tranIdnarration?: string;
    customerDepositSlipNumber?: string;
    categoryName?: string;
    uniqueIdentifier?: string;
    transactionRef?: string;
    paymentItemName?: string;
  };
  code: string;
  error: boolean;
}

export interface BankTransferResponse {
  message?: string;
  data?: {
    version: number;
    customerAccountNumber: string;
    customerAccountName: string | null;
    transferType: string;
    bankCode: string | null;
    financialInstitution: {
      id: number;
      version: number;
      delFlag: string;
      deletedOn: string | null;
      sortCode: string;
      institutionCode: string;
      institutionType: string;
      institutionName: string;
    };
    quicktellerBankCode: string | null;
    beneficiaryEmail: string | null;
    beneficiaryBank: string | null;
    beneficiaryAccountNumber: string;
    beneficiaryAccountName: string;
    remarks: string;
    status: string;
    tranDate: string;
    referenceNumber: string;
    userReferenceNumber: string;
    narration: string;
    sessionId: string | null;
    currencyCode: string | null;
    amount: number;
    statusDescription: string;
    charge: string | null;
    token: string | null;
    addBeneficiaryFlag: string | null;
    beneficiaryPrefferedName: string | null;
    lastname: string | null;
    firstname: string | null;
    transferCode: string | null;
    countryCode: string | null;
    deviceNumber: string | null;
    headerProxyAuthorization: string | null;
    headerUserAgent: string | null;
    ip: string | null;
    loginName: string | null;
    sessionkey: string | null;
    sfactorAuthIndicator: string | null;
    tranLocation: string | null;
    channel: string;
    beneficiaryBVN: string | null;
    beneficiaryBankName: string | null;
    beneficiarySortCode: string | null;
    instrumentType: string | null;
    collectionType: string | null;
    payerName: string | null;
    currency: string | null;
    beneficiaryCurrencyCode: string | null;
    beneficiaryType: string | null;
    DT_RowId: string;
  };
  code?: string;
  error?: boolean;
}

export interface Accounts {
  accountCurrency: string;
  accountId: string;
  accountName: string;
  accountNumber: string;
  accountOpenDate: string;
  accountStatus: string;
  availableBalance: number;
  acctBalance: number;
  bookBalance: string;
  customerId: string;
  drawingPower: string | null;
  freezeCode: string | null;
  sanctionLimit: string | null;
  schemeCode: string;
  schemeType: string;
  accountType: string;
  solId: string;
  noActions?: boolean;
}

export interface DebitAccounts {
  message?: string;
  data: Accounts[];
  code?: string;
  error?: boolean;
}

export interface TransferResponse {
  loading: boolean;
  accounts: Accounts[];
  banks: Banks[];
  inter: BeneficiariesResponse;
  intra: BeneficiariesResponse;
  interUsedLeft: UsedLeftResponse;
  intraUsedLeft: UsedLeftResponse;
}

export interface BeneficiaryResponse {
  loading: boolean;
  beneficiaries: BeneficiariesResponse;
}

export interface Banks {
  sortCode: string | null;
  institutionCode: string;
  institutionType: string;
  institutionName: string;
  version: number;
  DT_RowId: number;
}

export interface Beneficiaries {
  id: string;
  accountName: string;
  accountNumber: string;
  beneficiaryBank: string;
  institutionName: string;
  preferredName: string;
}
export interface OtherBanksRoute {
  account: string;
  transDetails: any;
}

export interface StandingOrderRoute {}

export interface Beneficiaries__ {
  id: string;
  accountName: string;
  accountNumber: string;
  beneficiaryBank: string;
  institutionName: string;
  preferredName: string;
}

export interface AddBeneficiary_ {
  accountName: string;
  accountNumber: string;
  beneficiaryBank: string;
  beneficiaryBankName: string;
}

export interface AddBillBeneficiary {
  accountName: string;
  accountNumber: string;
  beneficiaryBank: string;
  beneficiaryBankName: string;
}

export interface DeleteBeneficiary_ {
  id: number;
}

export interface DeleteBeneficiaryResponse {
  message?: string;
  data: [] | null;
  code?: string;
  error?: boolean;
}

export interface BeneficiariesResponse {
  message?: string;
  data: Beneficiaries[];
  code?: string;
  error?: boolean;
}

export interface InterBankNameEnqParams {
  accountNo: string;
  bankCode: string;
}

export interface IntraBankNameEnqParams {
  accountNo: string;
}

export interface BankNameEnqResponse {
  message: string;
  success: boolean;
}

export interface InterBankFeeParams {
  amount: string;
}

export interface TransferReceiptResponse {
  fileName: string;
  fileContent: string;
}

export interface TransferReceiptParams {
  transferId: number;
}

export interface InterBankFeeResponse {
  message: string;
  data: string;
  code: string;
  error: boolean;
}

export interface TransferLimitParams {
  acctNumber: string;
  channel: string;
}

export interface TransferLimitResponse {
  message: string;
  success: boolean;
}

export interface UsedLeftResponse {
  dailyRemaining: number;
  singleTransactionCap: number;
}

export type OtherBankLoading = {
  debitAccounts: boolean;
  usedLeft: boolean;
  beneficiaries: boolean;
  bankList: boolean;
  nameEnquiry: boolean;
};

export type StandingOrderLoading = {
  debitAccounts: boolean;
  usedLeft: boolean;
  beneficiaries: boolean;
  bankList: boolean;
  nameEnquiry: boolean;
};

export interface StandingOrderResponse {
  id: number;
  beneficiary: string | null;
  debitAccount: string;
  amount: number;
  intervalDays: number;
  nextDebitDate: string;
  dateCreated: string;
  retailUser: RetailUser;
  narration: string;
  start: string;
  end: string;
  startDate: string;
  endDate: string;
  corpLocalBeneficiary: string | null;
  benAccountNumber: string;
  bankCode: string;
  benBankName: string;
  benAccountName: string;
  channel: string;
}

export interface RetailUser {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  status: string;
  createdOnDate: string;
  expiryDate: string;
  lockedUntilDate: string | null;
  lastLoginDate: string;
  noOfLoginAttempts: number;
  noOfTokenAttempts: number;
  emailTemplate: string | null;
  userType: string;
  alertPreference: string;
  role: Role;
  entrustId: string | null;
  entrustGroup: string | null;
  bvn: string;
  customerId: string;
  birthDate: string | null;
  resetSecurityQuestion: boolean | null;
  feedBackStatus: string | null;
  coverage: string | null;
  customizedName: string | null;
  acceptedBvnMandate: boolean | null;
  acceptedTermsAndConditions: boolean;
  defaultPlatform: string;
  tempPassword: string | null;
  transactionPin: string;
  deviceId: string;
  eNairaUserName: string | null;
  eNairaWalletName: string | null;
  profileImage: string | null;
  enairaPassword: string | null;
}

export interface Role {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  name: string;
  email: string;
  description: string | null;
  userType: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  name: string;
  description: string;
  code: string;
  category: string;
  userType: string;
}
