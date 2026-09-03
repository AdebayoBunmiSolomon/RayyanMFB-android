/* eslint-disable react-hooks/exhaustive-deps */
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useEffect, useRef, useState } from 'react';
import Rayyan from '../../assets/svg/rayyan_art.svg';
import Moment from 'moment';
import ViewShot from 'react-native-view-shot';
// import {
//   useLazyDownloadTransferReceiptQuery,
//   useLazyGetTransferReceiptQuery,
// } from '../../api/transfer';
import MainContainer from '../../components/MainContainer';
import PageContainer from '../../components/PageContainer';
import LoadingModal from '../../components/modals/LoadingModal';
import { shareJpgReceipt } from '../../services/base64ToPdf';
import colors from '../../theme/color';
import {
  moderateScale,
  verticalScale,
  horizontalScale,
  global,
} from '../../theme/metrics';
import { MainStackScreenProps } from '../../types/navigation.types';
import { BankTransferResponse } from '../../types/transfer.types';
import { replaceCharacters, formatToDecimal } from '../../util/format';
import Header from '../../components/Header';
import { useAppSelector } from '../../hooks/hook';
import Svg, { Path } from 'react-native-svg';
import { useApi } from '../../hooks/useApi';

const TransactionReceipt: FC<MainStackScreenProps<'TransactionReceipt'>> = ({
  navigation,
  route,
}) => {
  const getSingleTransactionDetails = useApi({
    endpoint: 'getSingleTransactionDetails',
  });
  // tranDate,
  const { tranId, narration, amount, uniqueIdentifier } = route.params;

  const { currentTheme } = useAppSelector(state => state.theme);

  const [loadingModal, setLoadingModal] = useState(false);

  const ref = useRef<any>(null);

  // const [uri, setUri] = useState('');

  const [data, setData] = useState<BankTransferResponse>({});

  // const [receipt] = useLazyGetTransferReceiptQuery();

  // const [download] = useLazyDownloadTransferReceiptQuery();

  // const generatePdfReceiptShare = async (val: TransferReceiptParams) => {
  //   setLoadingModal(true);
  //   try {
  //     const res = await receipt(val).unwrap();
  //     if (res?.fileContent) {
  //       await convertBase64ToPdf(res.fileContent, res.fileName);
  //     }
  //   } catch (error) {
  //   } finally {
  //     setLoadingModal(false);
  //   }
  // };

  const getTransactionDetails = async () => {
    setLoadingModal(true);

    try {
      // const _newDate = Moment(tranDate).format('YYYY-MM-DD');

      const res = await getSingleTransactionDetails.requestInit(
        undefined,
        `/v1/transfer/${tranId}?narration=${narration}&amount=${amount}&uniqueIdentifier=${uniqueIdentifier}`,
      );
      if (
        res?.data?.code === '00' ||
        res?.data?.code === '06' ||
        res?.data?.code === '31'
      ) {
        setData(res?.data);
      }
    } catch (error) {
    } finally {
      setLoadingModal(false);
    }
  };

  // useEffect(() => {
  //   ref?.current?.capture().then((newUrl: any) => {
  //     setUri(newUrl);
  //   });
  // }, [route.params]);

  useEffect(() => {
    getTransactionDetails();
  }, [tranId, narration, amount, uniqueIdentifier]);

  const shareReceiptHandler = () => {
    ref?.current?.capture().then((uri: string) => {
      shareJpgReceipt(uri);
    });
  };

  const { selectedAccount } = useAppSelector(state => state.account);

  return (
    <PageContainer>
      <LoadingModal
        isVisible={loadingModal}
        onBackdropPress={() => setLoadingModal(true)}
        onBackButtonPress={() => setLoadingModal(true)}
      />

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
            <Text
              style={{
                ...styles.doneText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
              }}
            >
              Done
            </Text>
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
                  <Text style={styles.onlineText}>Online Banking</Text>
                  <Text style={styles.transText}>Transaction Receipt</Text>
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
                <Text style={styles.leftText}>Payer</Text>
                <Text style={styles.rightText}>
                  {data?.data?.customerAccountName ??
                    selectedAccount?.accountName}
                </Text>
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text
                  style={{ ...styles.rightText, fontSize: moderateScale(16) }}
                >
                  {replaceCharacters(
                    data?.data?.customerAccountNumber as string,
                  )}
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
                <Text style={styles.leftText}>Receiver</Text>
                <Text
                  style={{ ...styles.rightText, textTransform: 'capitalize' }}
                >
                  {data?.data?.beneficiaryAccountName}
                </Text>
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text
                  style={{ ...styles.rightText, fontSize: moderateScale(16) }}
                >
                  {data?.data?.beneficiaryAccountNumber}
                </Text>
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text style={styles.rightText}>
                  {data?.data?.financialInstitution?.institutionName}
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
                <Text style={styles.leftText}>Transaction</Text>
                {data?.data?.amount ? (
                  <Text style={styles.rightText}>
                    NGN {formatToDecimal(data?.data?.amount as number)}
                  </Text>
                ) : null}
              </View>

              <View style={{ ...global.flexEnd, marginTop: verticalScale(9) }}>
                <Text
                  style={{ ...styles.rightText, textTransform: 'capitalize' }}
                >
                  {data?.data?.transferType?.replace(/_/g, ' ')}
                </Text>
              </View>

              {data?.data?.tranDate ? (
                <View
                  style={{ ...global.flexEnd, marginTop: verticalScale(9) }}
                >
                  <Text style={styles.rightText}>
                    {Moment(data?.data?.tranDate).format('LLL')}
                  </Text>
                </View>
              ) : null}

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
                <Text style={styles.leftText}>Narration</Text>
                <Text style={styles.rightText}>{data?.data?.remarks}</Text>
              </View>

              <View
                style={{
                  ...styles.border,
                  marginTop: verticalScale(63),
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
                {data?.data?.status ? (
                  <Text
                    style={{
                      ...styles.rightText,
                    }}
                  >
                    {data?.data?.status === '00'
                      ? 'Transaction Successful'
                      : 'Transaction Failed'}
                  </Text>
                ) : null}

                {/* <Text
                  style={{
                    ...styles.rightText,
                  }}>
                  {data?.data?.statusDescription}
                </Text> */}
              </View>
            </View>
          </ViewShot>

          <TouchableOpacity
            style={{
              ...global.flexEnd,
              marginTop: verticalScale(25),
              marginBottom: verticalScale(60),
            }}
            // onPress={() =>
            //   generatePdfReceiptShare({
            //     transferId: Number(tranId),
            //   })
            // }
            onPress={shareReceiptHandler}
            disabled={!data?.data}
          >
            <View>
              <Svg width={23} height={38} fill="none">
                <Path
                  stroke={
                    currentTheme === 'dark'
                      ? colors.white
                      : colors.darkBackground
                  }
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeOpacity={0.6}
                  d="M1 12.813v6.562A2.625 2.625 0 0 0 3.625 22h15.75A2.625 2.625 0 0 0 22 19.375v-6.563M6.25 6.25 11.5 1m0 0 5.25 5.25M11.5 1v15.75"
                />
                <Path
                  fill={currentTheme === 'dark' ? colors.white : colors.black}
                  fillOpacity={0.65}
                  d="M3.736 32.781a.776.776 0 0 0-.335-.58c-.196-.138-.45-.207-.762-.207-.22 0-.408.034-.565.1a.836.836 0 0 0-.36.27.656.656 0 0 0-.046.704.754.754 0 0 0 .23.227c.096.061.203.112.32.154.118.041.237.077.356.105l.545.136c.22.052.431.12.634.208.204.087.387.197.548.33.163.132.292.292.386.48.095.187.143.407.143.659 0 .34-.088.64-.262.9-.174.258-.426.46-.755.605-.328.144-.725.216-1.19.216-.453 0-.846-.07-1.18-.21a1.756 1.756 0 0 1-.778-.614c-.186-.269-.286-.596-.301-.983H1.4a.881.881 0 0 0 .187.506c.11.134.253.235.429.301.178.066.377.1.597.1.229 0 .43-.035.602-.103a.976.976 0 0 0 .409-.29.7.7 0 0 0 .15-.437.556.556 0 0 0-.133-.375.977.977 0 0 0-.366-.25 3.536 3.536 0 0 0-.546-.182l-.662-.17c-.479-.123-.858-.31-1.136-.56-.277-.252-.415-.586-.415-1.003a1.5 1.5 0 0 1 .278-.9c.188-.258.443-.458.765-.6a2.652 2.652 0 0 1 1.093-.216c.413 0 .775.072 1.086.216.312.142.557.34.735.594.178.252.27.542.276.87H3.736Zm3.016 1.662V37H5.724v-5.818h1.005v2.196h.052c.102-.246.26-.44.474-.583.216-.144.49-.215.824-.215.303 0 .567.063.792.19.226.127.4.312.523.557.125.244.188.542.188.895V37H8.553v-2.62c0-.293-.075-.521-.227-.684-.15-.165-.36-.247-.63-.247a.993.993 0 0 0-.49.12.835.835 0 0 0-.335.337 1.12 1.12 0 0 0-.119.537Zm5.134 2.645a1.82 1.82 0 0 1-.747-.148 1.22 1.22 0 0 1-.523-.443 1.296 1.296 0 0 1-.19-.721c0-.247.045-.45.136-.611.09-.161.215-.29.372-.387.157-.096.334-.17.531-.218a4.31 4.31 0 0 1 .617-.111c.255-.027.463-.05.622-.071a.922.922 0 0 0 .346-.102c.074-.048.111-.12.111-.22v-.016c0-.214-.063-.38-.19-.497-.127-.118-.31-.176-.548-.176-.252 0-.452.054-.6.164a.817.817 0 0 0-.295.39l-.96-.137c.075-.265.2-.487.375-.665.174-.18.387-.314.639-.403.252-.091.53-.136.835-.136.21 0 .42.024.628.073.208.05.398.131.57.245.173.111.311.264.415.457.107.193.16.435.16.725V37H13.2v-.6h-.034a1.257 1.257 0 0 1-.688.594 1.706 1.706 0 0 1-.593.094Zm.267-.756c.206 0 .385-.04.537-.122a.904.904 0 0 0 .35-.33.84.84 0 0 0 .124-.445v-.515a.484.484 0 0 1-.165.074 2.353 2.353 0 0 1-.255.06 7.843 7.843 0 0 1-.282.045l-.241.035c-.153.02-.29.054-.412.102a.683.683 0 0 0-.287.199.486.486 0 0 0-.105.323c0 .19.069.333.207.43a.902.902 0 0 0 .529.144Zm3.07.668v-4.364h.998v.728h.045a1.089 1.089 0 0 1 1.077-.79c.057 0 .12.003.19.008.072.004.132.01.18.02v.946a1.08 1.08 0 0 0-.208-.04 1.917 1.917 0 0 0-.27-.02c-.187 0-.356.041-.506.123a.893.893 0 0 0-.349.332.936.936 0 0 0-.128.492V37h-1.028Zm4.925.085c-.438 0-.816-.09-1.134-.273a1.847 1.847 0 0 1-.73-.778c-.17-.337-.256-.734-.256-1.19 0-.45.086-.843.256-1.182.172-.341.413-.606.722-.795a2.023 2.023 0 0 1 1.088-.287c.269 0 .522.043.761.13.24.085.453.218.636.398.186.18.332.409.438.688.106.276.16.605.16.988v.315H18.51v-.693h2.591a1.105 1.105 0 0 0-.128-.525.93.93 0 0 0-.349-.367.982.982 0 0 0-.517-.133c-.21 0-.395.05-.554.153-.16.1-.283.233-.372.398a1.145 1.145 0 0 0-.134.537v.605c0 .254.047.471.14.653.092.18.222.319.389.415.166.095.361.142.585.142.15 0 .285-.02.406-.062a.901.901 0 0 0 .316-.19.792.792 0 0 0 .201-.31l.96.108c-.06.253-.176.475-.346.664a1.69 1.69 0 0 1-.648.438 2.48 2.48 0 0 1-.903.153Z"
                />
              </Svg>
            </View>
            {/* <View>
              <Text style={styles.shareText}>Share</Text>
            </View> */}
          </TouchableOpacity>
        </ScrollView>
      </MainContainer>
    </PageContainer>
  );
};

export default TransactionReceipt;

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
