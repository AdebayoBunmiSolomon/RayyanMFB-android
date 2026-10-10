// export default Transfer;/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import {
  MainStackScreenProps,
  ReviewRoute,
} from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import Rayyan from './Rayyan';
import OwnAccount from './OwnAccount';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import {
  listBanks,
  listIntraBankBeneficiaries,
  setDebitAccounts,
  setIntraUsedLeft,
} from '../../../slices/transferSlice';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import TransferTypes from '../../../components/TransferTypes';
import OtherBanks from './OtherBanks';

const Transfer: FC<MainStackScreenProps<'Transfer'>> = ({
  navigation,
  route,
}) => {
  const getDebitAccounts = useApi({ endpoint: 'getDebitAccounts' });
  const getIntraBankUsedLeft = useApi({ endpoint: 'getIntraBankUsedLeft' });

  const { transDetails, type } = (route.params as any) ?? {};
  console.log('From Transfer', transDetails);
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState(0);

  const { accounts } = useAppSelector(state => state.transfer);
  const account = useAppSelector(
    state => state.account.selectedAccount.accountNumber,
  );

  useEffect(() => {
    if (transDetails && type === 'other') {
      setSelected(2);
    }
  }, [transDetails, type]);

  useEffect(() => {
    const getUserDebitAccounts = async () => {
      try {
        const res = await getDebitAccounts.requestInit();
        if (res?.data?.code === '00') {
          dispatch(setDebitAccounts(res?.data));
        }
      } catch (err) {
        console.log('err', err);
      }
    };
    getUserDebitAccounts();
  }, []);

  useEffect(() => {
    const getInterUsedLeft = async () => {
      try {
        const res = await getIntraBankUsedLeft.requestInit(
          undefined,
          `/v1/transfer/limit/${accounts[0]?.accountNumber}/INTRABANK`,
        );
        if (res?.data) {
          dispatch(setIntraUsedLeft(res?.data));
        }
      } catch (err) {
        console.log('err', err);
      }
    };
    getInterUsedLeft();
  }, [accounts]);

  useEffect(() => {
    dispatch(listBanks());
    dispatch(listIntraBankBeneficiaries());
  }, []);

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Transfer" />
      <TransferTypes setSelected={setSelected} selected={selected} />

      {selected === 0 && (
        <OwnAccount
          account={account}
          onPress={item =>
            navigation.navigate('ReviewsOwnAccount', {
              item: { ...item, type: 'self' },
            })
          }
        />
      )}
      {selected === 1 && (
        <Rayyan
          onPress={(item: ReviewRoute) =>
            navigation.navigate('ReviewsOwnAccount', {
              item: { ...item, type: 'rayyan' },
            })
          }
          account={account}
        />
      )}
      {selected === 2 && (
        <OtherBanks
          transDetails={transDetails}
          onPress={(item: ReviewRoute) => {
            console.log('payload from OtherBanks', item);
            navigation.navigate('ReviewsOwnAccount', {
              item: { ...item, type: 'other' },
              transDetailsFromTransferHistory: {
                institutionName: item?.beneficiaryBankName,
                institutionCode: item?.beneficiaryBank,
                accountName: item?.beneficiaryAccountName,
                customerAccountNumber: item?.customerAccountNumber,
                accountNumber: item?.beneficiaryAccountNumber,
                beneficiaryBank: item?.beneficiaryBank,
                amount: item?.amount,
                narration: item?.remarks,
              },
            });
          }}
          account={account}
        />
      )}
    </PageContainer>
  );
};

export default Transfer;
