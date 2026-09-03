/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../hook';
import { useApi } from '../useApi';
import { useErrorHandler } from '../useErrorHandler';
import { useAppToast } from '../useAppToast';
import { setIntraUsedLeft } from '../../slices/transferSlice';
import { IS_RETAIL } from '../../../config';
import { formatToNaira } from '../../util/format';
import { Accounts } from '../../types/transfer.types';
import { FormikProps, FormikValues } from 'formik';

// Types
export interface RayyanTransferFormData {
  id: string;
  preferredName: string;
  institutionName: string;
  accountName: string;
  accountNumber: string;
  customerAccountNumber: string;
  beneficiaryBank: any;
  amount: string;
  narration: string;
  saveBeneficiary: boolean;
}

export interface UserAccount {
  label: string;
  value: string;
  key: number;
}

// Constants
const API_ENDPOINTS = {
  INTRA_BANK_NAME_ENQUIRY: 'intraBankNameEnquiry',
  LIST_INTRA_BANK_BENEFICIARIES: 'listIntraBankBeneficiaries',
  GET_INTER_BANK_USED_LEFT: 'getInterBankUsedLeft',
} as const;

const TRANSFER_LIMITS_URL = (customerType: string, accountNumber: string) =>
  `/v1/transfer/limits?customerType=${customerType}&accountNumber=${accountNumber}&channel=WITHIN_BANK_TRANSFER`;

const NAME_ENQUIRY_URL = (accountNumber: string) =>
  `/v1/transfer/${accountNumber}/intrabank/nameenquiry`;

// Utils
const createUserAccounts = (accounts: Accounts[]): UserAccount[] => {
  if (!accounts || !Array.isArray(accounts)) {
    return [];
  }

  return accounts.map(
    ({ accountNumber, availableBalance, acctBalance }, index) => ({
      label: `${accountNumber} - ${formatToNaira(
        Number(availableBalance ?? acctBalance),
      )}`,
      value: accountNumber,
      key: index,
    }),
  );
};

export const useRayyanLogic = ({
  onPress,
  account,
}: {
  onPress: (item: any) => void;
  account?: number;
}) => {
  const { accounts, intraUsedLeft } = useAppSelector(state => state.transfer);
  const dispatch = useDispatch();
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const [selectedBeneficiariesHash, setSelectedBeneficiariesHash] =
    useState<RayyanTransferFormData>({
      id: '',
      preferredName: '',
      institutionName: '',
      accountName: '',
      accountNumber: '',
      customerAccountNumber: '',
      beneficiaryBank: undefined,
      amount: '',
      narration: '',
      saveBeneficiary: false,
    });

  const [loadingModal, setLoadingModal] = useState(false);
  const [inputText, setInputText] = useState<string | undefined>(undefined);
  const [userAccounts, setUserAccounts] = useState<UserAccount[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  // API hooks with error handling
  const intraBankNameEnquiry = useApi({
    endpoint: API_ENDPOINTS.INTRA_BANK_NAME_ENQUIRY,
    onError: (error, errorDetails) => {

      handleError(error as Error, 'Rayyan:intraBankNameEnquiry');
      showError('Failed to verify account name. Please try again.');
    },
  });

  const listIntraBankBeneficiaries = useApi({
    endpoint: API_ENDPOINTS.LIST_INTRA_BANK_BENEFICIARIES,
    onError: (error, errorDetails) => {

      handleError(error as Error, 'Rayyan:listIntraBankBeneficiaries');
      showError('Failed to load beneficiaries. Please try again.');
    },
  });

  const getInterBankUsedLeft = useApi({
    endpoint: API_ENDPOINTS.GET_INTER_BANK_USED_LEFT,
    onError: (error, errorDetails) => {

      handleError(error as Error, 'Rayyan:getInterBankUsedLeft');
      showError('Failed to load transfer limits. Please try again.');
    },
  });

  // Fetch beneficiaries on mount
  useEffect(() => {
    const fetchBeneficiaries = async () => {
      try {
        setLoadingModal(true);
        const res = await listIntraBankBeneficiaries.requestInit();
        if (res?.data?.data && Array.isArray(res.data.data)) {
          setContacts(res.data.data);
        } else {

          setContacts([]);
        }
      } catch (error) {

        handleError(error as Error, 'Rayyan:fetchBeneficiaries');
        setContacts([]);
      } finally {
        setLoadingModal(false);
      }
    };
    fetchBeneficiaries();
  }, []);

  // Memoize user accounts
  const userAccountsMemo = useMemo(() => {
    return createUserAccounts(accounts);
  }, [accounts]);

  useEffect(() => {
    setUserAccounts(userAccountsMemo);
  }, [userAccountsMemo]);

  // Fetch transfer limits
  useEffect(() => {
    const fetchTransferLimits = async () => {
      try {
        if (!accounts || !accounts[0]?.accountNumber) {

          return;
        }

        setLoadingModal(true);
        const newReqUrl = TRANSFER_LIMITS_URL(
          IS_RETAIL ? 'RETAIL' : 'CORPORTATE',
          accounts[0].accountNumber,
        );

        const res = await getInterBankUsedLeft.requestInit(
          undefined,
          newReqUrl,
        );

        if (res?.data) {
          dispatch(setIntraUsedLeft(res.data));

        } else {

        }
      } catch (error) {

        handleError(error as Error, 'Rayyan:fetchTransferLimits');
      } finally {
        setLoadingModal(false);
      }
    };

    fetchTransferLimits();
  }, [accounts]);

  // Name enquiry function
  const getIntraName = useCallback(async (accountNo: string) => {
    try {
      if (!accountNo || accountNo.length !== 10) {

        return;
      }

      setSelectedBeneficiariesHash(prev => ({
        ...prev,
        accountName: '',
      }));
      setLoadingModal(true);

      const res = await intraBankNameEnquiry.requestInit(
        undefined,
        NAME_ENQUIRY_URL(accountNo),
      );

      if (res?.data?.success && res?.data?.message) {
        setSelectedBeneficiariesHash(prev => ({
          ...prev,
          accountNumber: accountNo,
          accountName: res.data.message,
        }));

      } else {

        setSelectedBeneficiariesHash(prev => ({
          ...prev,
          accountName: '',
        }));
      }
    } catch (error) {

      handleError(error as Error, 'Rayyan:getIntraName');
      setSelectedBeneficiariesHash(prev => ({
        ...prev,
        accountName: '',
      }));
    } finally {
      setLoadingModal(false);
    }
  }, []);

  // Handle account change
  const handleOnChange = useCallback((_value: string | null) => {
    try {
      // Handle account change logic if needed
    } catch (error) {

      handleError(error as Error, 'Rayyan:handleOnChange');
    }
  }, []);

  // Handle beneficiary selection
  const handleItemPress = useCallback(
    (id: string) => {
      try {
        if (!id) {

          return;
        }

        const item = contacts?.find(props => props.id === id);
        if (!item) {
          showError('Selected beneficiary not found. Please try again.');
          return;
        }

        setSelectedBeneficiariesHash(prev => ({
          ...prev,
          accountName: item.accountName || '',
          accountNumber: item.accountNumber || '',
          beneficiaryBank: item.beneficiaryBank,
          institutionName: item.institutionName || '',
          id: item.id || '',
        }));

        setInputText(item.accountNumber || '');

      } catch (error) {

        handleError(error as Error, 'Rayyan:handleItemPress');
        showError('Failed to select beneficiary. Please try again.');
      }
    },
    [contacts, handleError, showError],
  );

  // Auto name enquiry when account number is complete
  useEffect(() => {
    if (inputText?.length === 10) {
      getIntraName(inputText);
    }
  }, [inputText]);

  // Set initial account value when account prop is provided
  useEffect(() => {
    if (account) {
      formikRef.current?.setFieldValue(
        'customerAccountNumber',
        String(account),
      );
      setSelectedBeneficiariesHash(prev => ({
        ...prev,
        customerAccountNumber: String(account),
      }));
    }
  }, [account]);

  // Form submission handler
  const handleSubmit = useCallback(
    (values: any) => {
      try {

        const payload = {
          ...values,
          beneficiaryAccountNumber: values.accountNumber,
          beneficiaryAccountName: selectedBeneficiariesHash.accountName,
          amount: values.amount,
          customerAccountNumber: values.customerAccountNumber,
          remarks: values.narration || '',
          beneficiaryBank: selectedBeneficiariesHash?.beneficiaryBank,
          beneficiaryBankName: selectedBeneficiariesHash?.institutionName || '',
          saveBeneficiary: values?.saveBeneficiary || false,
        };

        onPress(payload);
      } catch (error) {

        handleError(error as Error, 'Rayyan:onSubmit');
        showError('Failed to process transfer. Please try again.');
      }
    },
    [selectedBeneficiariesHash, onPress, handleError, showError],
  );

  return {
    // State
    selectedBeneficiariesHash,
    setSelectedBeneficiariesHash,
    loadingModal,
    setLoadingModal,
    inputText,
    setInputText,
    userAccounts,
    contacts,
    intraUsedLeft,
    accounts,
    formikRef,

    // API states
    intraBankNameEnquiry,
    listIntraBankBeneficiaries,
    getInterBankUsedLeft,

    // Functions
    getIntraName,
    handleOnChange,
    handleItemPress,
    onPress: handleSubmit,
  };
};
