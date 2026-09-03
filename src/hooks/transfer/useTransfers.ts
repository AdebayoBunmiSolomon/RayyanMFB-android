import { useApi } from '../../hooks/useApi';
import { useAppDispatch } from '../../hooks/hook';
import { setDebitAccounts } from '../../slices/transferSlice';

export const useTransfers = () => {
  const intraBank = useApi({ endpoint: 'intraBankTranfer' });
  const interBank = useApi({ endpoint: 'interBankTranfer' });
  const getFee = useApi({ endpoint: 'getInterBankFee' });
  const addBeneficiary = useApi({ endpoint: 'addBeneficiary' });
  const getDebitAccounts = useApi({ endpoint: 'getDebitAccounts' });

  const dispatch = useAppDispatch();

  const fetchUserAccounts = async () => {
    try {
      const res = await getDebitAccounts.requestInit();
      if (res?.data?.code === '00') {
        dispatch(setDebitAccounts(res.data));
      }
    } catch {}
  };

  return {
    intraBank,
    interBank,
    getFee,
    addBeneficiary,
    fetchUserAccounts,
  };
};
