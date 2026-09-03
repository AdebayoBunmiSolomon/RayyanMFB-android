/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, View, FlatList, Text } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { verticalScale, moderateScale, colors } from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainerHeader from '../../../components/PageContainerHeader';
import MainContainer from '../../../components/MainContainer';
import { useAppSelector } from '../../../hooks/hook';

import LoadingModal from '../../../components/modals/LoadingModal';
import Bill from '../../../components/Bill';
import {
  BillsContent,
  BillsHistoryParams,
} from '../../../types/bills-payments.types';
import { useLazyGetPaginatedBillsHistoryQuery } from '../../../api/bills';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

const BillsHistory: FC<MainStackScreenProps<'BillsHistory'>> = ({
  navigation,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);

  const [loading, setLoading] = useState(false);

  const [pageNumber] = useState(0);

  const [pageSize] = useState(20);

  const [history, setHistory] = useState<BillsContent[]>([]);

  const [bills] = useLazyGetPaginatedBillsHistoryQuery();

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
            Empty Bills List
          </Text>
        </View>
      </View>
    );
  };

  const fetchBillsHistory = async ({
    pageNumber,
    pageSize,
  }: BillsHistoryParams) => {
    setLoading(true);

    try {
      const res = await bills({ pageNumber, pageSize }).unwrap();
      if (res?.content) {
        setHistory(res.content);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBillsHistory({ pageNumber, pageSize });
  }, [pageNumber, pageSize]);

  return (
    <PageContainer>
      {
        <LoadingModal
          isVisible={loading}
          onBackdropPress={() => setLoading(true)}
          onBackButtonPress={() => setLoading(true)}
        />
      }
      <PageContainerHeader
        title="Bills Payment History"
        onPress={() => navigation.goBack()}
        height={verticalScale(90)}
      />

      <MainContainer bgColor={'transparent'}>
        <FlatList
          data={history}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          style={styles.flatlist}
          contentContainerStyle={{ flexGrow: 1 }}
          ListEmptyComponent={ListEmptyView}
          renderItem={({ item, index }) => (
            <Bill
              onPress={() =>
                navigation.navigate('BillReceipt', {
                  id: item.id?.toString() as string,
                })
              }
              item={item}
              key={index}
            />
          )}
        />
      </MainContainer>
    </PageContainer>
  );
};

export default BillsHistory;

const styles = StyleSheet.create({
  flatlist: {
    flex: 1,
    width: '100%',
    marginBottom: verticalScale(30),
  },

  border: {
    width: '100%',
    borderBottomColor: colors.appPrimary,
    borderBottomWidth: 1,
    marginTop: verticalScale(18),
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
