/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import PageContainerHeader from '../../../components/PageContainerHeader';
import {
  colors,
  moderateScale,
  verticalScale,
  global,
} from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import MainContainer from '../../../components/MainContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import Button from '../../../components/Button';
import { AccountOfficeResponse } from '../../../types/settings.types';
// import {useLazyGetAccountOfficerQuery} from '../../../api/settings';
import { useAppSelector } from '../../../hooks/hook';
import { useApi } from '../../../hooks/useApi';

const AccountOfficer: FC<MainStackScreenProps<'AccountOfficer'>> = ({
  navigation,
}) => {
  const { requestInit } = useApi({ endpoint: 'getAccountOfficer' });

  const { currentTheme } = useAppSelector(state => state.theme);

  // const [officer_] = useLazyGetAccountOfficerQuery();

  const [loading, setLoading] = useState(false);

  const [officer, setOfficer] = useState<AccountOfficeResponse[]>([]);

  const getAccountOfficer = async () => {
    setLoading(true);
    try {
      const res = await requestInit();
      if (res?.data?.length) {
        setOfficer(res?.data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAccountOfficer();
  }, []);

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
        title="Account Officer"
        onPress={() => navigation.goBack()}
        height={verticalScale(90)}
      />

      <MainContainer>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={{ marginTop: verticalScale(31) }}>
            <Text
              style={{
                ...styles.headerText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
              }}
            >
              OFFICER INFO
            </Text>
          </View>

          <View style={{ marginTop: verticalScale(20) }}>
            <Text
              style={{
                ...styles.subText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
              }}
            >
              {officer[0]?.officerName}
            </Text>
          </View>

          <View style={{ marginTop: verticalScale(8) }}>
            <Text
              style={{
                ...styles.subText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
              }}
            >
              {officer[0]?.phoneNumber}
            </Text>
          </View>

          <View style={{ marginTop: verticalScale(8) }}>
            <Text
              style={{
                ...styles.subText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
              }}
            >
              {officer[0]?.emailAddress}
            </Text>
          </View>

          <View style={{ marginTop: verticalScale(36) }}>
            <Text
              style={{
                ...styles.headerText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
              }}
            >
              BRANCH NAME :
            </Text>
          </View>

          <View style={{ marginTop: verticalScale(20) }}>
            <Text
              style={{
                ...styles.subText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.otpBorderColor,
              }}
            >
              {officer[0]?.branchName}
            </Text>
          </View>

          {/* <View style={{marginTop: verticalScale(36)}}>
            <Text  style={{
                  ...styles.headerText,
                  color:
                    currentTheme === 'dark'
                      ? colors.white
                      : colors.semiLightTextColor,
                }}>BRANCH ADDRESS :</Text>
          </View>

          <View style={{marginTop: verticalScale(155)}}>
            <Text style={styles.subText}>
              27 - 29 ENITAN STREET, LEKKI PHASE 1,
            </Text>
          </View> */}
          <View
            style={{
              ...global.flexRow,
              marginTop: verticalScale(36),
              marginBottom: verticalScale(60),
            }}
          >
            <Button
              onPress={() => {
                navigation.navigate('Tabs', { screen: 'Home' });
              }}
              disabled={false}
              width={'100%'}
              loading={false}
            >
              Ok
            </Button>
          </View>
        </ScrollView>
      </MainContainer>
    </PageContainer>
  );
};

export default AccountOfficer;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },

  subText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.otpBorderColor,
  },

  headerText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.semiLightTextColor,
  },
});
