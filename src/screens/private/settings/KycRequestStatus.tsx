/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useState } from 'react';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainer from '../../../components/PageContainer';
import LoadingModal from '../../../components/modals/LoadingModal';
import HeaderAuth from '../../../components/HeaderAuth';
import { Heading, Text, View, XStack, YStack } from 'tamagui';
import { useAppSelector } from '../../../hooks/hook';
import LottieView from 'lottie-react-native';
import Sizes, { normalizeSize } from '../../../util/size';
import { useTheme } from '../../../context/ThemeContext';
import moment from 'moment';
import { ActivityIndicator } from 'react-native';
import Button from '../../../components/Button';

const KycRequestStatus: FC<MainStackScreenProps<'KycRequestStatus'>> = ({
  navigation,
}) => {
  const [loading_, setLoading_] = useState(false);

  const { rejectReason, rejectedBy, rejectedOn } = useAppSelector(
    state => state.kycRequest,
  );

  const { colors } = useTheme();

  return (
    <PageContainer>
      {loading_ && (
        <LoadingModal
          isVisible={loading_}
          onBackdropPress={() => setLoading_(true)}
          onBackButtonPress={() => setLoading_(true)}
        />
      )}

      <HeaderAuth headerTitle="KYC Review Status" noLogo />

      <YStack marginTop={48} gap={16} alignItems="center">
        <LottieView
          source={require('../../../assets/json/warning.json')}
          autoPlay
          loop={false}
          style={{ height: 100, width: 100 }}
        />
        <YStack alignItems="center" gap={6} marginTop={6}>
          <Text
            fontFamily="Inter-Bold"
            fontSize={Sizes.fontXLarge}
            color={colors.grey06}
            fontWeight="600"
          >
            Issue Found
          </Text>
          <Text
            fontFamily="Inter-Regular"
            fontSize={Sizes.fontMedium}
            color={colors.grey05}
            textAlign="center"
            lineHeight={19}
            fontWeight="500"
            maxWidth="70%"
          >
            Please review and resolve the items below to proceed further.
          </Text>
        </YStack>
        {rejectReason ? (
          <YStack
            width={'100%'}
            marginTop={24}
            borderWidth={1}
            borderColor={colors.borderColor}
            borderRadius={16}
            backgroundColor={colors.white}
            paddingHorizontal={normalizeSize(24)}
            paddingVertical={Sizes.paddingMedium}
          >
            <Heading
              textAlign="center"
              color={colors.grey05}
              fontWeight={'600'}
              fontFamily="Inter-SemiBold"
              fontSize={Sizes.fontMedium}
            >
              {rejectReason}
            </Heading>
            <View
              marginVertical={14}
              borderTopWidth={1}
              borderColor={colors.borderColor}
            />
            <XStack
              alignItems="center"
              flexWrap="wrap"
              gap={10}
              justifyContent="space-between"
            >
              <XStack alignItems="center">
                <Text
                  color={colors.grey05}
                  fontWeight={'600'}
                  fontFamily="Inter-SemiBold"
                  fontSize={Sizes.fontSmall}
                >
                  Rejected On:{' '}
                </Text>
                <View
                  backgroundColor={'#F5B30D'}
                  paddingHorizontal={5}
                  paddingVertical={2}
                  borderRadius={2}
                >
                  <Text
                    color={'#232525'}
                    fontWeight={'600'}
                    fontFamily="Inter-Bold"
                    fontSize={Sizes.fontSmall}
                  >
                    {moment(rejectedOn).format('L')}
                  </Text>
                </View>
              </XStack>
              {rejectedBy ? (
                <XStack alignItems="center">
                  <Text
                    color={colors.grey05}
                    fontWeight={'600'}
                    fontFamily="Inter-SemiBold"
                    fontSize={Sizes.fontSmall}
                  >
                    Rejected By:{' '}
                  </Text>
                  <View
                    backgroundColor={colors.grey}
                    paddingHorizontal={5}
                    paddingVertical={2}
                    borderRadius={2}
                  >
                    <Text
                      color={'#232525'}
                      fontWeight={'600'}
                      fontFamily="Inter-Bold"
                      fontSize={Sizes.fontSmall}
                    >
                      {rejectedBy?.firstName}
                    </Text>
                  </View>
                </XStack>
              ) : (
                ''
              )}
            </XStack>
          </YStack>
        ) : (
          <ActivityIndicator style={{ marginTop: 38 }} />
        )}
      </YStack>
      <Button
        onPress={() => navigation.navigate('AccountUpgradeRequest')}
        marginTop="auto"
        marginBottom={12}
      >
        Resolve Issue
      </Button>
    </PageContainer>
  );
};

export default KycRequestStatus;
