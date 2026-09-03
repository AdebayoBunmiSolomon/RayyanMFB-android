export interface DownloadStatementParams {
  acctNumber: string;
  fromDate: string;
  toDate: string;
  tranType: string;
  format: string;
}

export interface DownloadStatementResponse {
  fileContent: string;
}

export interface Accounts_ {
  id: number;
  accountNumber: string;
  accountName: string;
  preferredName: string;
  customerId: string;
  schemeType: string;
  accountType: string;
  schemeCode: string;
  solId: string;
  primaryFlag: string;
  hiddenFlag: string;
  currencyCode: string;
  status: string;
  kycLevel: string;
  acctBalance: number;
}

export interface UserAccounts {
  message?: string;
  data: Accounts_[];
  code?: string;
  error?: boolean;
}

export interface TenTransactions {
  narration: string;
  postedDate: string;
  valueDate: string;
  tranType: string;
  tranId: string;
  balance: string;
  debitAmount: string;
  creditAmount: string;
  uniqueIdentifier: string;
  customerId?: string;
}

// comes from /bills or older endpoint
export interface LegacyTransaction {
  currencyCode: string | null;
  postDate: string; // "27-Jan-2026"
  valueDate: string;
  narration: string;
  accountBalance: string;
  tranType: string;
  tranAmount: string;
  tranId: string;
  uniqueIdentifier: string;
  tranDate: string;
  tranSN: string | null;
  debitAmount: string;
  creditAmount: string;
  customerId?: string;
}

export interface NormalizedTransaction {
  narration: string;
  postedAt: Date; // 🔥 unified, real Date object
  valueDate: string;
  tranType: string;
  tranId: string;
  uniqueIdentifier: string;
  balance: string;
  debitAmount: string;
  creditAmount: string;
  customerId?: string;
}

export interface LastTenTransactions {
  message?: string;
  data: TenTransactions[];
  code?: string;
  error?: boolean;
}

export interface AllAccountsResponse {
  all: Accounts_[];
}

export interface SearchParams {
  acctNum: string;
  fromDate: string;
  toDate: string;
  tranType: string;
}

export interface GenerateParams {
  acctNum: string;
  fromDate: string;
  toDate: string;
  tranType: string;
  format?: string;
}

export interface EmailStatementParams {
  acctNum: string;
  fromDate: string;
  toDate: string;
  tranType: string;
  email: string;
  format: string;
}

export interface GenerateResponse {
  fileContent: string;
  fileFormat: string;
  fileName: string;
}

export interface EmailStatementResponse {
  // fileContent: string;
  // fileFormat: string;
  // fileName: string;
}

export interface TransactionDetails {
  currencyCode: string | null;
  postDate: string;
  valueDate: string;
  narration: string;
  accountBalance: string;
  tranType: string;
  tranAmount: string;
  tranId: string;
  tranDate: string;
  tranSN: string;
  debitAmount: string;
  creditAmount: string;
  uniqueIdentifier: string;
}

export interface SingleTransParams {
  tranId: string;
  tranDate?: string;
  narration: string;
  amount: string;
  uniqueIdentifier: string;
}

export interface SearchResponse {
  message: string;
  data: {
    accountNumber: string;
    openingBalance: string;
    closingBalance: string;
    totalCredit: string;
    totalDebit: string;
    customerName: string;
    currencyCode: string;
    creditCount: string;
    debitCount: string;
    hasMoreData: string;
    transactionDetails: TransactionDetails[];
    address: string;
  };
  code: string;
  error: boolean;
}
