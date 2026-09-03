/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useOtherBankApis } from '../api/useOtherBankApis';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { setDebitAccounts, setInterUsedLeft } from '../../slices/transferSlice';
import { formatToNaira } from '../../util/format';
import { IS_RETAIL } from '../../../config';
import { Banks, StandingOrderLoading } from '../../types/transfer.types';
import { BeneficiaryTypes } from '../../components/BeneficiaryScroll';
import { FormikProps, FormikValues } from 'formik';

interface LogicParams {
  account?: string;
  transDetails?: Partial<FormikValues>;
  onPress: (values: any) => void;
}

export const useStandingOrderLogic = ({
  account,
  transDetails,
  onPress,
}: LogicParams) => {
  const dispatch = useAppDispatch();
  const { accounts, interUsedLeft } = useAppSelector(state => state.transfer);
  const {
    listInterBankBeneficiaries,
    interBankNameEnquiryQuery,
    getInterBankUsedLeft,
    getDebitAccounts,
    getBankList,
  } = useOtherBankApis();

  const [loading, setLoading] = useState<StandingOrderLoading>({
    debitAccounts: false,
    usedLeft: false,
    beneficiaries: false,
    bankList: false,
    nameEnquiry: false,
  });

  const setLoadingState = (key: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [key]: value }));
  };

  const [contacts, setContacts] = useState<BeneficiaryTypes[]>([]);
  const [banks, setBanks] = useState<Banks[]>([]);
  const [bankList, setBankList] = useState<
    { label: string; value: string; key: number }[]
  >([]);
  const [userAccounts, setUserAccounts] = useState<
    { label: string; value: string; key: number }[]
  >([]);
  const [selectedBankObj, setSelectedBankObj] = useState<Banks | undefined>();
  const [accountName, setAccountName] = useState<string | undefined>();
  const [inputText, setInputText] = useState('');
  const formikRef = useRef<FormikProps<FormikValues>>(null);

  const selectedBeneficiariesHash: FormikValues = {
    id: '',
    preferredName: '',
    institutionName: '',
    institutionCode: '',
    accountName: '',
    customerAccountNumber: '',
    accountNumber: '',
    beneficiaryBank: '',
    amount: '',
    narration: '',
    saveBeneficiary: false,
    intervalDays: 1,
  };

  useEffect(() => {
    const fetch = async () => {
      setLoadingState('debitAccounts', true);
      try {
        const res = await getDebitAccounts.requestInit();
        if (res?.data?.code === '00') dispatch(setDebitAccounts(res.data));
      } catch {}
      setLoadingState('debitAccounts', false);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoadingState('usedLeft', true);
      const newReqUrl = `/v1/transfer/limits?customerType=${
        IS_RETAIL ? 'RETAIL' : 'CORPORTATE'
      }&accountNumber=${
        accounts[0]?.accountNumber
      }&channel=INTER_BANK_TRANSFER`;
      try {
        const res = await getInterBankUsedLeft.requestInit(
          undefined,
          newReqUrl,
        );
        if (res?.data) {
          dispatch(setInterUsedLeft(res.data));
        }
      } catch {}
      setLoadingState('usedLeft', false);
    };
    if (accounts[0]) fetch();
  }, [accounts]);

  useEffect(() => {
    const fetch = async () => {
      setLoadingState('beneficiaries', true);
      try {
        const res = await listInterBankBeneficiaries.requestInit();
        if (res?.data?.data) setContacts(res.data.data);
      } catch {}
      setLoadingState('beneficiaries', false);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoadingState('bankList', true);
      try {
        const res = await getBankList.requestInit();
        if (res?.data) setBanks(res.data);
      } catch {}
      setLoadingState('bankList', false);
    };
    fetch();
  }, []);

  useEffect(() => {
    setBankList(
      banks.map(({ institutionName, institutionCode }, index) => ({
        label: institutionName,
        value: institutionCode,
        key: index,
      })),
    );
  }, [banks]);

  useEffect(() => {
    setUserAccounts(
      accounts.map(
        ({ accountNumber, availableBalance, acctBalance }, index) => ({
          label: `${accountNumber} - ${formatToNaira(
            availableBalance ?? acctBalance,
          )}`,
          value: accountNumber,
          key: index,
        }),
      ),
    );
  }, [accounts]);

  useEffect(() => {
    if (account || transDetails?.customerAccountNumber) {
      formikRef.current?.setFieldValue(
        'customerAccountNumber',
        account ?? transDetails?.customerAccountNumber,
      );
    }
  }, [account, transDetails?.customerAccountNumber, accounts]);

  useEffect(() => {
    if (inputText.length === 10 && selectedBankObj?.institutionCode) {
      (async () => {
        setLoadingState('nameEnquiry', true);
        setAccountName('');
        try {
          const res = await interBankNameEnquiryQuery.requestInit(
            undefined,
            `/v1/transfer/${inputText}/${selectedBankObj.institutionCode}/interbank/nameenquiry`,
          );
          if (res?.data?.success) setAccountName(res.data.message);
        } catch {}
        setLoadingState('nameEnquiry', false);
      })();
    }
  }, [inputText, selectedBankObj?.institutionCode]);

  const handleItemPress = (id: string) => {
    const item = contacts.find(x => x.id === id);
    const selected = banks.find(
      b =>
        b.institutionName?.toLowerCase() ===
        item?.institutionName?.toLowerCase(),
    );

    setSelectedBankObj(selected);
    if (formikRef.current && item) {
      const customerAccountNumber =
        formikRef?.current.values.customerAccountNumber;
      formikRef.current.setValues({
        ...item,
        customerAccountNumber,
        institutionCode: selected?.institutionCode,
      });
      setInputText(item.accountNumber || '');
    }
  };

  const updateBankInfo = (code: string | null) => {
    const selected = banks.find(b => b.institutionCode === code);
    setSelectedBankObj(selected);
  };

  const getAccBalance = () => {};

  return {
    loading,
    contacts,
    userAccounts,
    bankList,
    selectedBankObj,
    accountName,
    inputText,
    setInputText,
    accounts,
    formikRef,
    onPress,
    interUsedLeft,
    updateBankInfo,
    handleItemPress,
    selectedBeneficiariesHash,
    getAccBalance,
  };
};
