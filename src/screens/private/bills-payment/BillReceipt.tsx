import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import Rayyan from '../../../assets/svg/rayyan_art.svg';
import Share_ from '../../../assets/svg/share.svg';
import Moment from 'moment';
import ViewShot from 'react-native-view-shot';
import MainContainer from '../../../components/MainContainer';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import { shareJpgReceipt } from '../../../services/base64ToPdf';
import {
  moderateScale,
  verticalScale,
  horizontalScale,
  global,
  colors,
} from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { formatToDecimal } from '../../../util/format';
import Header from '../../../components/Header';
import { useLazyGetSingleBillsHistoryQuery } from '../../../api/bills';
import { BillPaymentDetails } from '../../../types/bills-payments.types';
import { useAppSelector } from '../../../hooks/hook';

const BillReceipt: FC<MainStackScreenProps<'BillReceipt'>> = ({
  navigation,
  route,
}) => {
  const { id } = route.params;

  const { currentTheme } = useAppSelector(state => state.theme);

  const [loadingModal, setLoadingModal] = useState(false);

  const ref = useRef<any>(null);

  const [uri, setUri] = useState('');

  const [data, setData] = useState<BillPaymentDetails>({});

  const [details] = useLazyGetSingleBillsHistoryQuery();

  const getTransactionDetails = async () => {
    setLoadingModal(true);
    try {
      const res = await details(id).unwrap();
      if (res) {
        setData(res as BillPaymentDetails);
      }
    } catch (error) {
    } finally {
      setLoadingModal(false);
    }
  };

  useEffect(() => {
    ref?.current?.capture().then((uri: any) => {
      setUri(uri);
    });
  }, []);

  useEffect(() => {
    getTransactionDetails();
  }, [id]);
  return (
    <PageContainer>
      {loadingModal && (
        <LoadingModal
          isVisible={loadingModal}
          onBackdropPress={() => setLoadingModal(true)}
          onBackButtonPress={() => setLoadingModal(true)}
        />
      )}
      <Header
        color={'transparent'}
        title="Transaction Receipt"
        labelColor={colors.appPrimary}
        fontSize={moderateScale(16)}
        leftSvg={<></>}
        rightSvg={
          <TouchableOpacity
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        }
        leftOnPress={() => {}}
        rightOnPress={() => {}}
      />

      <MainContainer bgColor={'transparent'}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <ViewShot
            ref={ref}
            options={{
              fileName: 'Transaction Receipt',
              format: 'jpg',
              quality: 0.9,
            }}
          >
            <View style={styles.receiptContainer}>
              <View style={{ ...global.flexEnd, marginTop: verticalScale(38) }}>
                <Rayyan />
              </View>

              <View style={{ marginTop: verticalScale(18) }}>
                <View>
                  <Text style={styles.onlineText}>{data?.billerName}</Text>
                  <Text style={styles.transText}>Payment Receipt</Text>
                </View>
              </View>

              <View
                style={{
                  ...styles.border,
                  marginTop: verticalScale(3),
                }}
              ></View>

              <View
                style={{
                  ...global.flexRowSpace,
                  marginTop: verticalScale(10),
                }}
              >
                <Text style={styles.leftText}>Transaction</Text>
                <Text style={styles.rightText}>
                  NGN {formatToDecimal(data?.amount as number)}
                </Text>
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text
                  style={{ ...styles.rightText, fontSize: moderateScale(16) }}
                >
                  {data?.categoryName as string}
                </Text>
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text
                  style={{ ...styles.rightText, fontSize: moderateScale(16) }}
                >
                  {Moment(data?.createdOn).format('LLL')}
                </Text>
              </View>

              <View
                style={{
                  ...styles.border,
                }}
              ></View>

              <View
                style={{
                  ...global.flexRowSpace,
                  marginTop: verticalScale(9),
                }}
              >
                <Text style={styles.leftText}>Beneficiary</Text>
                <Text
                  style={{ ...styles.rightText, textTransform: 'capitalize' }}
                >
                  {data?.paymentItemName as string}
                </Text>
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text
                  style={{
                    ...styles.rightText,
                    fontSize: moderateScale(16),
                    fontWeight: '700',
                  }}
                >
                  {data?.customerId}
                </Text>
              </View>

              <View
                style={{
                  ...styles.border,
                }}
              ></View>

              <View
                style={{
                  ...global.flexRowSpace,
                  marginTop: verticalScale(9),
                }}
              >
                <View style={{ flex: 4 }}>
                  <Text style={styles.leftText}>Narration</Text>
                </View>
                <View style={{ flex: 6 }}>
                  <Text numberOfLines={5} style={styles.rightText}>
                    {data?.responseDescription}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  ...styles.border,
                  marginTop: verticalScale(43),
                }}
              ></View>

              <View
                style={{
                  ...global.flexRowSpace,
                  marginTop: verticalScale(9),
                }}
              >
                <View style={{ flex: 4 }}>
                  <Text style={styles.leftText}>Tran Reference</Text>
                </View>
                <View style={{ flex: 6 }}>
                  <Text style={styles.rightText}>{data?.transactionRef}</Text>
                </View>
              </View>

              <View
                style={{
                  ...styles.border,
                  marginTop: verticalScale(33),
                }}
              ></View>
              <View
                style={{
                  ...global.flexRowSpace,
                  marginTop: verticalScale(9),
                  marginBottom: verticalScale(50),
                }}
              >
                <Text style={styles.leftText}>Status</Text>
                <Text
                  style={{
                    ...styles.rightText,
                  }}
                >
                  {data?.status === '00'
                    ? 'Transaction Successful'
                    : 'Transaction Failed'}
                </Text>
              </View>
            </View>
          </ViewShot>

          <TouchableOpacity
            style={{
              ...global.flexEnd,
              marginTop: verticalScale(25),
              marginBottom: verticalScale(60),
            }}
            onPress={async () => {
              ref?.current?.capture().then((uri: any) => {
                setUri(uri);
              });
              await shareJpgReceipt(uri);
            }}
          >
            <View>
              <Share_ />
            </View>
            <View>
              <Text style={styles.shareText}>Share</Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </MainContainer>
    </PageContainer>
  );
};

export default BillReceipt;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },

  onlineText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(24),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },

  transText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },

  border: {
    width: '100%',
    borderBottomColor: colors.appPrimary,
    borderBottomWidth: 1,
    marginTop: verticalScale(18),
  },

  rightText: {
    fontWeight: '500',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
    color: colors.otpBorderColor,
  },

  leftText: {
    fontWeight: '500',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
    color: colors.otpBorderColor,
  },

  doneText: {
    fontWeight: '500',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
    color: colors.otpBorderColor,
  },

  shareText: {
    fontWeight: '600',
    fontSize: moderateScale(8),
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
    color: colors.rgba65,
    marginTop: verticalScale(5),
  },

  receiptContainer: {
    backgroundColor: colors.white,
    width: '100%',
    height: 'auto',
    paddingHorizontal: horizontalScale(10),
  },
});
