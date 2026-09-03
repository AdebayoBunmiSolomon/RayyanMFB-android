/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { colors, moderateScale, verticalScale } from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import History from '../../../components/History';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { useLazyGetDebitAccountsQuery } from '../../../api/transfer';
import { setDebitAccounts } from '../../../slices/transferSlice';
import LoadingModal from '../../../components/modals/LoadingModal';
import {
  SearchParams,
  TenTransactions,
} from '../../../types/transactions.types';
import SearchTransactionsModal from '../../../components/modals/SearchTransactionsModal';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import DashboardSlides from '../../../components/DashboardSlides';
import Input from '../../../components/Input';
import { YStack } from 'tamagui';
import { Filter } from 'iconsax-react-native';
import Sheet from '../../../components/Sheet';
import TransactionHistorySheet from '../../../components/TransactionHistorySheet';
import { useAppToast } from '../../../hooks/useAppToast';

const tranType = {
  B: 'All',
  D: 'Debit',
  C: 'Credit',
};

export type filterType = {
  tranType: string;
  fromDate: string;
  toDate: string;
};

const TransactionHistory: FC<MainStackScreenProps<'TransactionHistory'>> = ({
  navigation,
}) => {
  const { showError } = useAppToast();
  const getTenTransactions = useApi({
    endpoint: 'getTenTransactions',
    onSuccess: () => {},
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.code as string,
        _errorDetails?.message || 'An Error occurred',
      );
    },
  });
  const searchTransactions = useApi({ endpoint: 'searchTransactions' });

  const dispatch = useAppDispatch();

  const { currentTheme } = useAppSelector(state => state.theme);
  const { accounts } = useAppSelector(state => state.account);
  const [debitAccount] = useLazyGetDebitAccountsQuery();
  const [activeSlide, setActiveSlide] = useState(0);
  const [modal, setModal] = useState(false);
  const [searchModal, setSearchModal] = useState(false);
  const [transactions, setTransactions] = useState<TenTransactions[]>([]);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [filter, setFilter] = useState<filterType | undefined>(undefined);

  const handleOpenSheet = () => {
    setSheetVisible(true);
  };
  const handleCloseSheet = () => {
    setSheetVisible(false);
  };

  const { userType } = useAppSelector(state => state.profile);

  const ListEmptyView = () => {
    return (
      <View style={styles.listEmpty}>
        <View style={styles.emptyView}>
          <Svg width={51} height={50} fill="none">
            <G
              fill={currentTheme === 'dark' ? colors.white : colors.black}
              clipPath="url(#a)"
            >
              <Path d="M45.292 45.835H5.708A5.214 5.214 0 0 1 .5 40.626V26.043c0-.146.031-.294.092-.427L8.86 7.24a5.221 5.221 0 0 1 4.75-3.073h23.78a5.221 5.221 0 0 1 4.75 3.073l8.268 18.375c.06.133.092.281.092.427v14.583a5.214 5.214 0 0 1-5.208 5.209ZM2.583 26.265v14.361a3.129 3.129 0 0 0 3.125 3.125h39.584a3.129 3.129 0 0 0 3.125-3.125v-14.36L40.24 8.093a3.135 3.135 0 0 0-2.85-1.842H13.61a3.133 3.133 0 0 0-2.85 1.844l-8.177 18.17Z" />
              <Path d="M35.514 35.417H15.485a3.137 3.137 0 0 1-2.925-2.027l-2.112-5.632a1.042 1.042 0 0 0-.975-.675h-7.41a1.042 1.042 0 0 1 0-2.083h7.41c1.295 0 2.47.815 2.927 2.027l2.11 5.631c.152.404.544.675.975.675h20.027c.434 0 .825-.27.975-.675l2.11-5.63A3.147 3.147 0 0 1 41.528 25h7.931a1.042 1.042 0 0 1 0 2.083h-7.931c-.434 0-.825.271-.975.675l-2.11 5.632a3.144 3.144 0 0 1-2.928 2.027Z" />
            </G>
            <Defs>
              <ClipPath id="a">
                <Path
                  fill={currentTheme === 'dark' ? colors.black : colors.white}
                  d="M.5 0h50v50H.5z"
                />
              </ClipPath>
            </Defs>
          </Svg>
          <Text
            style={{
              ...styles.emptyText,
              color: currentTheme === 'dark' ? colors.white : colors.black,
            }}
          >
            Empty Search List
          </Text>
        </View>
      </View>
    );
  };

  const getUserDebitAccounts = async () => {
    setModal(true);
    try {
      const res = await debitAccount().unwrap();
      if (res.code === '00') {
        dispatch(setDebitAccounts(res));
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  const getLast10Transactions = async () => {
    setModal(true);
    try {
      const res = await getTenTransactions.requestInit(
        undefined,
        `${
          userType === 'retail'
            ? '/v1/account/last10tran/'
            : '/v1/corp/account/last10tran/'
        }${accounts[0]?.id}`,
      );
      if (res?.data?.code === '00') {
        setTransactions(res?.data.data);
      }
    } catch (_error) {
    } finally {
      setModal(false);
    }
  };

  const searchUserTransactions = async (val: SearchParams) => {
    setModal(true);
    let filteredTrans: TenTransactions[] = [];
    try {
      const res = await searchTransactions.requestInit(val);
      if (res?.data?.code === '00' && val.tranType === 'C') {
        filteredTrans = res?.data?.data?.transactionDetails.filter(
          (trans: any) => trans.tranType === 'C',
        );
        setTransactions(filteredTrans);
        return;
      }

      if (res?.data?.code === '00' && val.tranType === 'D') {
        filteredTrans = res?.data?.data?.transactionDetails.filter(
          (trans: any) => trans.tranType === 'D',
        );
        setTransactions(filteredTrans);
        return;
      }
      if (res?.data?.code === '00' && val.tranType === 'B') {
        setTransactions(res?.data?.data?.transactionDetails);
        return;
      }
    } catch (error) {
    } finally {
      setModal(false);
    }
  };

  useEffect(() => {
    getUserDebitAccounts();
    getLast10Transactions();
  }, []);

  useEffect(() => {
    console.log('filtered transactions', transactions);
  }, [transactions]);

  useEffect(() => {
    if (!modal) {
      console.log('Hello');
      setSheetVisible(false);
    }
  }, [modal]);

  return (
    <>
      <PageContainer>
        {modal && (
          <LoadingModal
            isVisible={modal}
            onBackdropPress={() => setModal(true)}
            onBackButtonPress={() => setModal(true)}
          />
        )}

        {searchModal && (
          <SearchTransactionsModal
            isVisible={searchModal}
            onBackdropPress={() => setSearchModal(false)}
            onBackButtonPress={() => setSearchModal(false)}
            closeModal={() => setSearchModal(false)}
            setValues={async val => {
              const payload = {
                ...val,
                tranType: 'B',
                acctNum: accounts[0]?.accountNumber,
              };

              await searchUserTransactions(payload);
            }}
          />
        )}

        <HeaderAuth noLogo headerTitle="Transaction History" />

        {accounts?.length ? (
          <View style={{ width: '100%', marginTop: 14 }}>
            <DashboardSlides
              views={accounts}
              activeSlide={activeSlide}
              setActiveSlide={slide => setActiveSlide(slide)}
              noActions
            />
          </View>
        ) : (
          <ActivityIndicator />
        )}

        <YStack marginTop={24}>
          <Input
            label="Search Parameter"
            placeholder="Search..."
            editable={false}
            onPressIn={handleOpenSheet}
            value={
              filter
                ? `${tranType[filter?.tranType]} TRAN FROM ${
                    filter?.fromDate
                  } TO ${filter?.toDate} `
                : undefined
            }
            endIcon={
              <TouchableOpacity
                onPress={handleOpenSheet}
                style={{
                  backgroundColor: colors.lightPrimary,
                  padding: 8,
                  borderRadius: 12,
                }}
              >
                <Filter variant="Bold" color={colors.white} size={22} />
              </TouchableOpacity>
            }
          />
        </YStack>

        <FlatList
          data={transactions}
          keyExtractor={item => item?.tranId}
          showsVerticalScrollIndicator={false}
          style={styles.flatlist}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={ListEmptyView}
          renderItem={({ item, index }) => (
            <History
              setLoadingModal={setModal}
              onPress={() => {
                if (item.tranType === 'D') {
                  navigation.navigate('RayyanReceipt', {
                    item: {
                      data: {
                        tranId: item.tranId,
                        narration: item?.narration,
                        amount: +item.debitAmount,
                        uniqueIdentifier: item?.uniqueIdentifier,
                        customerId: item?.customerId,
                      },
                    } as any,
                  });
                }
              }}
              item={item}
            />
          )}
        />
      </PageContainer>
      <Sheet
        isVisible={sheetVisible}
        sheetHeight={'90%'}
        onClose={handleCloseSheet}
      >
        <TransactionHistorySheet
          closeSheet={handleCloseSheet}
          setFilter={setFilter}
          onSubmit={(val: SearchParams) => {
            console.log('Hello', val);
            searchUserTransactions({
              ...val,
              acctNum: accounts[0]?.accountNumber,
            });
          }}
        />
      </Sheet>
    </>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: '100%',
    marginBottom: verticalScale(40),
    marginTop: verticalScale(15),
  },

  listEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(28),
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});
