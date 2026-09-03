// Define the HTTP methods type
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Base type for API endpoint configuration
export type ApiEndpoint = {
  url: string;
  method: RequestMethod;
};

// Consolidated API options type
export type ApiDataOptions = Record<string, Record<string, ApiEndpoint>>;

// Define the API options
export const apiOptions: ApiDataOptions = {
  retail: {
    login: { url: '/user/signin', method: 'POST' },
    requestForgotPasswordQuestions: {
      url: '/retrieval/retail/security-questions',
      method: 'GET',
    },
    bvnCustomerDetails: { url: '/register/bvn', method: 'GET' },
    registerExistingAccount: { url: '/self-registrations', method: 'POST' },
    existingAccountOtpRequest: {
      url: '/self-registrations/otp-request',
      method: 'POST',
    },
    verifyAccountOtpRequest: {
      url: '/self-registrations/otp-verification',
      method: 'POST',
    },
    resetDevice: { url: '/retrieval/retail/device', method: 'POST' },
    getAllAccounts: { url: '/v1/account/all', method: 'GET' },
    getDebitAccounts: { url: '/v1/localtransfer/nairaaccount', method: 'GET' },
    getAccountOfficer: {
      url: '/v1/customer/retail/account-officers',
      method: 'GET',
    },
    generateStatement: { url: '/v1/account/statements/data', method: 'GET' },
    sendStatementViaEmail: {
      url: '/v1/account/accountstatement',
      method: 'POST',
    },
    getTenTransactions: { url: '/v1/account/last10tran', method: 'GET' },
    searchTransactions: { url: '/v1/account/accountstatement', method: 'POST' },
    interBankNameEnquiry: { url: '/v1/transfer', method: 'GET' },
    addBeneficiary: { url: '/v1/beneficiary/retail/local/add', method: 'POST' },
    getAllBeneficiaries: {
      url: '/v1/beneficiary/retail/local/view/all',
      method: 'GET',
    },
    deleteBeneficiary: {
      url: '/v1/beneficiary/retail/local/delete',
      method: 'POST',
    },
    listCategories: { url: '/v1/bills-payment/categories', method: 'GET' },
    listBillersByCategoryName: {
      url: '/v1/bills-payment/categories',
      method: 'GET',
    },
    addBillerBeneficiary: { url: '/v1/biller-beneficiaries', method: 'POST' },
    listAirtimePaymentCodes: {
      url: '/v1/bills-payment/airtime-payment-codes',
      method: 'GET',
    },
    listDataSubscriptionCategories: {
      url: '/v1/bills-payment/data-subscription-categories',
      method: 'GET',
    },
    listProductsByBillerID: { url: '/v1/bills-payment/bills', method: 'GET' },
    listBillerDetailsByBillerID: {
      url: '/v1/bills-payment/bills',
      method: 'GET',
    },
    getBillerBeneficiariesByBC: {
      url: '/v1/biller-beneficiaries/find/category-and-biller',
      method: 'GET',
    },
    listPaymentItemWithCode: {
      url: '/v1/bills-payment/payment-items',
      method: 'GET',
    },
    makePayment: { url: '/v1/bills-payment', method: 'POST' },
    updateBillerBeneficiary: { url: '/v1/biller-beneficiaries', method: 'PUT' },
    deleteBillerBeneficiary: {
      url: '/v1/biller-beneficiaries',
      method: 'DELETE',
    },
    getSingleBillerBeneficiaryByID: {
      url: '/v1/biller-beneficiaries/:id',
      method: 'GET',
    },
    getAllBillerBeneficiaries: {
      url: '/v1/biller-beneficiaries/find-all-by-user',
      method: 'GET',
    },
    getBankList: { url: '/v1/localtransfer/localfinancialinst', method: 'GET' },
    resetPassword: { url: '/retrieval/retail/password', method: 'POST' },
    listServiceOptions: { url: '/retail/requests/configs', method: 'GET' },
    serviceRequestFields: { url: '/retail/requests/configs', method: 'GET' },
    newServiceRequest: { url: '/retail/requests/process', method: 'POST' },
    serviceRequests: { url: '/retail/requests/user-requests', method: 'GET' },
    accountUpgrade: { url: '/v1/account-upgrades', method: 'POST' },
    fetchAccountUpgrade: { url: '/v1/account-upgrades', method: 'GET' },
    fetchSingleAccountUpgrade: { url: '/v1/account-upgrades', method: 'GET' },
    listInterBankBeneficiaries: {
      url: '/v1/interbank/beneficiary',
      method: 'GET',
    },
    listIntraBankBeneficiaries: {
      url: '/v1/localtransfer/beneficiary',
      method: 'GET',
    },
    getSingleBillsHistory: {
      url: '',
      method: 'GET',
    },
    getPaginatedBillsHistory: {
      url: '',
      method: 'GET',
    },
    getProfileInfo: {
      url: '/v1/customer/retail/info',
      method: 'GET',
    },
    getFaq: {
      url: '/faqs',
      method: 'GET',
    },
    saveProfilePicture: {
      url: '/v1/customer/retail/profile-image',
      method: 'POST',
    },

    interBankNameEnquiryQuery: {
      url: '/v1/transfer',
      method: 'GET',
    },
    getInterBankUsedLeft: {
      url: '/v1/transfer/limit',
      method: 'GET',
    },
    updateDailyLimit: {
      url: '/v1/transfer/limit/daily',
      method: 'POST',
    },
    intraBankNameEnquiry: {
      url: '/v1/transfer',
      method: 'POST',
    },
    getInterBankFee: {
      url: '/v1/interbank',
      method: 'GET',
    },
    interBankTranfer: {
      url: '/v1/interbank/nip',
      method: 'POST',
    },
    intraBankTranfer: {
      url: '/v1/localtransfer/process',
      method: 'POST',
    },
    getTransferReceipt: {
      url: '/v1/transfer',
      method: 'GET',
    },
    getSingleTransactionDetails: {
      url: '/v1/transfer',
      method: 'GET',
    },
    changeUserPassword: {
      url: '/v1/customer/retail/credentials',
      method: 'POST',
    },
    maintainTransactionPIN: {
      url: '/v1/customer/retail/transaction-pin',
      method: 'POST',
    },
    getUserSecurityQuestions: {
      url: '/v1/customer/retail/security-questions',
      method: 'GET',
    },
    getSecurityQuestions: {
      url: '/v1/customer/retail/security-questions',
      method: 'GET',
    },
    regSecurityQuestions: {
      url: '/register/security-questions',
      method: 'GET',
    },
    maintainSecretQuestions: {
      url: '/v1/customer/retail/security-questions',
      method: 'POST',
    },
    sendToken: {
      url: '/v1/token/send/otp',
      method: 'GET',
    },
    validateOTP: {
      url: '/register/bvn/validate-otp',
      method: 'POST',
    },
    forgotPasswordQAVerify: {
      url: '/retrieval/corp/forgot-password/validate-security-questions',
      method: 'POST',
    },
    sendOtp: {
      url: '/retrieval/retail/send-otp',
      method: 'GET',
    },
    forgotPasswordVerifyOtp: {
      url: '/retrieval/retail/verify-otp',
      method: 'POST',
    },
    //for security questions reset
    getAvailableSecurityQuestions: {
      url: '/register/security-questions',
      method: 'GET',
    },
    //for sending OTP
    sendSecurityQuestionResetOtp: {
      url: '/retrieval/retail/security-question-reset/send-otp',
      method: 'GET',
    },
    //verifying OTP and resetting security questions
    verifyOtpAndResetSecurityQuestionResetOtp: {
      url: '/retrieval/retail/security-question-reset',
      method: 'POST',
    },
    createStandingOrder: {
      url: '/v1/retail/directdebit',
      method: 'POST',
    },
    getStandingOrderOfAUser: {
      url: '/v1/retail/directdebit?page=0&size=20&sort=id,desc',
      method: 'GET',
    },
    deleteStandingOrder:{
      url: "/v1/retail/directdebit/{{directDebitId}}?transactionPin={{transactionPin}}",
      method: 'DELETE'
    }
  },
  corp: {
    login: { url: '/user/signin', method: 'POST' },
    requestForgotPasswordQuestions: {
      url: '/retrieval/corp/security-questions',
      method: 'GET',
    },
    forgotPasswordQAVerify: {
      url: '/retrieval/corp/forgot-password/validate-security-questions',
      method: 'POST',
    },
    forgotPasswordSendToken: {
      url: '/retrieval/corp/send-otp',
      method: 'GET',
    },
    forgotPassword: {
      url: '/retrieval/corp/forgot-password',
      method: 'POST',
    },
    bvnCustomerDetails: { url: '/register/bvn', method: 'GET' },
    registerExistingAccount: { url: '/self-registrations', method: 'POST' },
    existingAccountOtpRequest: {
      url: '/self-registrations/otp-request',
      method: 'POST',
    },
    verifyAccountOtpRequest: {
      url: '/self-registrations/otp-verification',
      method: 'POST',
    },
    resetDevice: { url: '/retrieval/corp/device', method: 'POST' },
    getAllAccounts: { url: '/v1/corp/account/all', method: 'GET' },
    getDebitAccounts: {
      url: '/v1/corp/account/all',
      method: 'GET',
    },
    getAccountOfficer: {
      url: '/v1/customer/corp/account-officers',
      method: 'GET',
    },
    generateStatement: { url: '/v1/account/statements/data', method: 'GET' },
    sendStatementViaEmail: {
      url: '/v1/account/accountstatement',
      method: 'POST',
    },
    getTenTransactions: { url: '/v1/account/last10tran', method: 'GET' },
    searchTransactions: { url: '/v1/account/accountstatement', method: 'POST' },
    interBankNameEnquiry: { url: '/v1/transfer', method: 'GET' },
    addBeneficiary: { url: '/v1/beneficiary/corp/local/add', method: 'POST' },
    getAllBeneficiaries: {
      url: '/v1/beneficiary/corp/local/view/all',
      method: 'GET',
    },
    deleteBeneficiary: {
      url: '/v1/beneficiary/corp/local/delete',
      method: 'POST',
    },
    listCategories: { url: '/v1/bills-payment/categories', method: 'GET' },
    listBillersByCategoryName: {
      url: '/v1/bills-payment/categories',
      method: 'GET',
    },
    addBillerBeneficiary: {
      url: '/v1/corp-biller-beneficiaries',
      method: 'POST',
    },
    listAirtimePaymentCodes: {
      url: '/v1/bills-payment/airtime-payment-codes',
      method: 'GET',
    },
    listDataSubscriptionCategories: {
      url: '/v1/bills-payment/data-subscription-categories',
      method: 'GET',
    },
    listProductsByBillerID: { url: '/v1/bills-payment/bills', method: 'GET' },
    listBillerDetailsByBillerID: {
      url: '/v1/bills-payment/bills',
      method: 'GET',
    },
    getBillerBeneficiariesByBC: {
      url: '/v1/biller-beneficiaries/find/category-and-biller',
      method: 'GET',
    },
    listPaymentItemWithCode: {
      url: '/v1/bills-payment/payment-items',
      method: 'GET',
    },
    makePayment: { url: '/v1/bills-payment/corporate', method: 'POST' },
    updateBillerBeneficiary: { url: '/v1/biller-beneficiaries', method: 'PUT' },
    deleteBillerBeneficiary: {
      url: '/v1/biller-beneficiaries',
      method: 'DELETE',
    },
    getSingleBillerBeneficiaryByID: {
      url: '/v1/biller-beneficiaries/:id',
      method: 'GET',
    },
    getAllBillerBeneficiaries: {
      url: '/v1/corp-biller-beneficiaries/find-all-by-user',
      method: 'GET',
    },
    getBankList: { url: '/v1/localtransfer/localfinancialinst', method: 'GET' },
    resetPassword: { url: '/retrieval/corp/password', method: 'POST' },
    listServiceOptions: { url: '/retail/requests/configs', method: 'GET' },
    serviceRequestFields: { url: '/retail/requests/configs', method: 'GET' },
    newServiceRequest: { url: '/retail/requests/process', method: 'POST' },
    serviceRequests: { url: '/retail/requests/user-requests', method: 'GET' },
    accountUpgrade: { url: '/v1/account-upgrades', method: 'POST' },
    fetchAccountUpgrade: { url: '/v1/account-upgrades', method: 'GET' },
    fetchSingleAccountUpgrade: { url: '/v1/account-upgrades', method: 'GET' },
    listInterBankBeneficiaries: {
      url: '/v1/corp/interbank/beneficiary',
      method: 'GET',
    },
    listIntraBankBeneficiaries: {
      url: '/v1/corp/localtransfer/beneficiary',
      method: 'GET',
    },
    getSingleBillsHistory: {
      url: '',
      method: 'GET',
    },
    getPaginatedBillsHistory: {
      url: '',
      method: 'GET',
    },
    getProfileInfo: {
      url: '/v1/customer/corp/info',
      method: 'GET',
    },
    getFaq: {
      url: '/faqs',
      method: 'GET',
    },
    saveProfilePicture: {
      url: '/v1/customer/corp/profile-image',
      method: 'POST',
    },

    interBankNameEnquiryQuery: {
      url: '/v1/transfer',
      method: 'GET',
    },
    getInterBankUsedLeft: {
      url: '/v1/transfer/limit',
      method: 'GET',
    },
    intraBankNameEnquiry: {
      url: '/v1/transfer',
      method: 'POST',
    },
    getInterBankFee: {
      url: '/v1/interbank',
      method: 'GET',
    },
    interBankTranfer: {
      url: '/v1/corp/interbank/nip',
      method: 'POST',
    },
    intraBankTranfer: {
      url: '/v1/corp/localtransfer/process',
      method: 'POST',
    },
    getTransferReceipt: {
      url: '/v1/transfer',
      method: 'GET',
    },
    getSingleTransactionDetails: {
      url: '/v1/transfer',
      method: 'GET',
    },
    changeUserPassword: {
      url: '/v1/customer/corp/credentials',
      method: 'POST',
    },
    maintainTransactionPIN: {
      url: '/v1/customer/corp/transaction-pin',
      method: 'POST',
    },
    getUserSecurityQuestions: {
      url: '/v1/customer/corp/security-questions',
      method: 'GET',
    },
    getSecurityQuestions: {
      url: '/v1/customer/corp/security-questions',
      method: 'GET',
    },
    regSecurityQuestions: {
      url: '/register/security-questions',
      method: 'GET',
    },
    maintainSecretQuestions: {
      url: '/v1/customer/corp/security-questions',
      method: 'POST',
    },
    createBulk: {
      url: '/v1/corp/transfer/bulk/create',
      method: 'POST',
    },
    bulkRequests: {
      url: '/v1/corp/transfer/requests/all?unpaged=true',
      method: 'GET',
    },
    approveTransfer: {
      url: '/v1/corp/transfer/bulk/authorization',
      method: 'POST',
    },
    sendToken: {
      url: '/v1/corp/token/send/otp',
      method: 'GET',
    },
  },
};

// Export the default configuration
export default apiOptions;
