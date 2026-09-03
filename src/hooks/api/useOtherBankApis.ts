import { useApi } from '../useApi';

export const useOtherBankApis = () => {
  return {
    listInterBankBeneficiaries: useApi({
      endpoint: 'listInterBankBeneficiaries',
    }),
    interBankNameEnquiryQuery: useApi({
      endpoint: 'interBankNameEnquiryQuery',
    }),
    getInterBankUsedLeft: useApi({ endpoint: 'getInterBankUsedLeft' }),
    getDebitAccounts: useApi({ endpoint: 'getDebitAccounts' }),
    getBankList: useApi({ endpoint: 'getBankList' }),
  };
};
