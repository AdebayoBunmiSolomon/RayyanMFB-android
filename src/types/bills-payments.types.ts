import { SelectDataProps } from '.';

export interface Categories {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  enabled: boolean;
}

export type CategoryBills = {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  billerId: number;
  billerName: string;
  customerField1: string;
  customerField2: string | null;
  currencySymbol: string;
  logoUrl: string;
  enabled: boolean;
  supportemail: string | null;
  shortname: string;
  paydirectProductId: string | null;
  paydirectInstitutionId: string | null;
  surcharge: number;
  currencyCode: number;
  narration: string;
} & SelectDataProps;

export type BillItems = {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  paymentItemId: number;
  paymentItemName: string;
  amount: number;
  code: number;
  currencyCode: string | null;
  itemCurrencySymbol: string | null;
  sortOrder: string | null;
  pictureId: string | null;
  paymentCode: number;
  isAmountFixed: boolean;
  readonly: boolean;
  enabled: boolean;
  billerId: number;
  amountFixed: boolean;
} & SelectDataProps;

export interface SingleCategoryBillsByID {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  billerId: number;
  billerName: string;
  customerField1: string;
  customerField2: string | null;
  currencySymbol: string;
  logoUrl: string;
  enabled: boolean;
  supportemail: string | null;
  shortname: string;
  paydirectProductId: string | null;
  paydirectInstitutionId: string | null;
  surcharge: number;
  currencyCode: number;
  narration: string;
}

export interface BillsPayment {
  amount: string | undefined;
  billerId: number | undefined;
  billerName: string | undefined;
  categoryId: number;
  categoryName: string | undefined;
  customerAccountNumber: string | undefined;
  customerId: string | undefined;
  paymentItemId: string | undefined;
  paymentItemName: string | undefined;
  transactionPin: string | undefined;
  customerDepositSlipNumber: string;
  customerName: string | undefined;
  emailAddress: string | undefined;
  phoneNumber: string | undefined;
  paymentCode: string | undefined;
  saveBeneficiary: boolean | undefined;
}

export interface BillsPaymentResponse {
  message: string;
  data: {
    amount: string;
    authenticate: boolean;
    billerId: string | null;
    billerName: string;
    categoryId: string | null;
    categoryName: string;
    createdOn: string;
    customerAccountNumber: string | null;
    customerField1: string | null;
    customerField1Desc: string | null;
    customerField2: string | null;
    customerField2Desc: string | null;
    customerId: string | null;
    emailAddress: string | null;
    id: number;
    paymentCode: string | null;
    paymentItemId: string | null;
    paymentItemName: string;
    phoneNumber: string | null;
    requestReference: string | null;
    responseDescription: string | null;
    status: string;
    terminalId: string | null;
    token: string | null;
    transactionPin: string | null;
    transactionRef: string;
  };
  code: string;
  error: boolean;
}

export interface BillsDetails {
  amount?: number;
  billerId?: string;
  billerName?: string;
  categoryId?: number;
  categoryName?: string;
  customerAccountNumber: string;
  customerId: string;
  customerIdNo?: string;
  customerName?: string;
  paymentItemId?: string;
  paymentItemName?: string;
  amountFixed?: boolean;
  saveBeneficiary?: boolean;
  customerField1?: string;
  paymentCode?: string;
}

export interface ValidationFields {
  leafBean: string;
  fieldName: string;
  inputValue: string;
  message: string;
}

export interface BillerBeneficiary {
  id: number;
  version: number;
  category: string;
  biller: string;
  beneficiaryId: string;
  beneficiaryName: string;
}

export interface AddBillBeneficiary_ {
  beneficiaryId?: number | undefined;
  beneficiaryName?: string | undefined;
  biller?: number | undefined;
  category?: string | undefined;
  id?: string;
}

export interface UpdateBillBeneficiary_ {
  id: string;
  body: {
    beneficiaryId: string;
    beneficiaryName: string;
    biller: string;
    category: string;
  };
}

export interface DeleteBillBeneficiary_ {
  id: string;
  body: {
    beneficiaryId: string;
    beneficiaryName: string;
    biller: string;
    category: string;
  };
}

export interface AddBillBeneficiaryResponse {
  response: BillerBeneficiary;
  successMessage: string;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  errorContext: string | null;
  errorScope: string | null;
  fieldValidationErrors: ValidationFields[] | null;
  processErrors: string | null;
}

export interface BillBeneficiaryErrorResponse {
  data: {
    response: BillerBeneficiary;
    successMessage: string;
    hasError: boolean;
    errorMessage: string | null;
    errorCode: string | null;
    errorContext: string | null;
    errorScope: string | null;
    fieldValidationErrors: ValidationFields[] | null;
    processErrors: string | null;
  };
}

export interface UpdateBillBeneficiaryResponse {
  response: BillerBeneficiary;
  successMessage: string;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  errorContext: string | null;
  errorScope: string | null;
  fieldValidationErrors: ValidationFields[] | null;
  processErrors: string | null;
}

export interface DeleteBillBeneficiaryResponse {
  response: boolean;
  successMessage: string;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  errorContext: string | null;
  errorScope: string | null;
  fieldValidationErrors: ValidationFields[] | null;
  processErrors: string | null;
}

export interface GetBillBeneficiaryResponse {
  response: BillerBeneficiary;
  successMessage: string;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  errorContext: string | null;
  errorScope: string | null;
  fieldValidationErrors: ValidationFields[] | null;
  processErrors: string | null;
}

export interface GetAllBillBeneficiaryResponse {
  response: BillerBeneficiary[];
  successMessage: string;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  errorContext: string | null;
  errorScope: string | null;
  fieldValidationErrors: ValidationFields[] | null;
  processErrors: string | null;
}

export interface BillBeneficiaryByBCResponse {
  response: BillerBeneficiary[];
  successMessage: string;
  hasError: boolean;
  errorMessage: string | null;
  errorCode: string | null;
  errorContext: string | null;
  errorScope: string | null;
  fieldValidationErrors: ValidationFields[] | null;
  processErrors: string | null;
}

export interface BillBeneficiaryByBCParams {
  biller: string | undefined;
  category: string | undefined;
}

export interface AirtimeCodes {
  id: number;
  paymentCode: string;
  networkType: string;
  billerId: string;
}

export interface DataSubscriptionCategories {
  id: number;
  billerId: string;
  networkType: string;
}

export interface PaymentItemsResponse {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  paymentItemId: number;
  paymentItemName: string;
  amount: number;
  code: number;
  currencyCode: string | null;
  itemCurrencySymbol: string | null;
  sortOrder: string | null;
  pictureId: string | null;
  paymentCode: number;
  isAmountFixed: boolean;
  readonly: boolean;
  enabled: boolean;
  billerId: number;
  amountFixed: boolean;
}

export interface BillerInformationResponse {
  id: number;
  version: number;
  delFlag: string;
  deletedOn: string | null;
  categoryId: number;
  categoryName: string;
  categoryDescription: string;
  billerId: number;
  billerName: string;
  customerField1: string;
  customerField2: string | null;
  currencySymbol: string;
  logoUrl: string;
  enabled: true;
  supportemail: string;
  shortname: string;
  paydirectProductId: string | null;
  paydirectInstitutionId: string | null;
  surcharge: number;
  currencyCode: number;
  narration: string;
}

export interface CustomAmount {
  id: string;
  value: string;
}

export interface BillsHistoryParams {
  pageNumber: number;
  pageSize: number;
}

export interface BillsContent {
  amount: string;
  authenticate: boolean;
  billerId: string | null;
  billerName: string;
  categoryId: string | null;
  categoryName: string;
  createdOn: string;
  customerAccountNumber: string | null;
  customerField1: string | null;
  customerField1Desc: string | null;
  customerField2: string | null;
  customerField2Desc: string | null;
  customerId: string | null;
  emailAddress: string | null;
  id: number;
  paymentCode: string | null;
  paymentItemId: string | null;
  paymentItemName: string;
  phoneNumber: string | null;
  requestReference: string | null;
  responseDescription: string;
  status: string;
  terminalId: string | null;
  token: string | null;
  transactionPin: string | null;
  transactionRef: string | null;
}

export interface BillPaymentDetails {
  amount?: number;
  approvedAmount?: string | null;
  billerId?: number;
  billerName?: string;
  categoryId?: number;
  categoryName?: string;
  createdOn?: string;
  customerAccountNumber?: string;
  customerId?: string;
  delFlag?: string;
  deletedOn?: string | null;
  emailAddress?: string;
  id?: number;
  miscData?: string | null;
  paymentCode?: number;
  paymentItemId?: number;
  paymentItemName?: string;
  phoneNumber?: string;
  rechargePin?: string | null;
  requestReference?: string;
  responseCode?: string;
  responseCodeGrouping?: string | null;
  responseDescription?: string;
  status?: string;
  terminalId?: string | null;
  transactionRef?: string;
  version?: number;
}

export interface BillsHistoryResponse {
  content: BillsContent[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  size: number;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
