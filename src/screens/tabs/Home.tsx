/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { TabsStackScreenProps } from '../../types/navigation.types';
// import { global } from '../../theme/metrics';
import PageContainer from '../../components/PageContainer';
import { useAppDispatch, useAppSelector } from '../../hooks/hook';
import { setDebitAccounts } from '../../slices/transferSlice';
import DashboardSlides from '../../components/DashboardSlides';
import { useApi } from '../../hooks/useApi';
import homeStyles from '../../styles/home';
import Features from '../../components/Features';
import { Text, View, XStack, YStack } from 'tamagui';
import { useTheme } from '../../context/ThemeContext';
import Adverts from '../../components/Adverts';
import cameraOptions from '../../util/cameraOptions';
import { ProfilePicture } from '../../types/settings.types';
import { setProfile } from '../../slices/profileSlice';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Sheet from '../../components/Sheet';
import { Camera, Image } from 'iconsax-react-native';
import { setAccounts } from '../../slices/accountSlice';
import AlertCard from '../../components/AlertCard';
import { Accounts_ } from '../../types/transactions.types';
import { KycRequestTypes } from '../../types/account.types';
import { setKycRequest } from '../../slices/kycRequestSlice';
import Button from '../../components/Button';
import { useAppToast } from '../../hooks/useAppToast';
import ProgressModal from '../../components/modals/ProgressModal';

const { styles } = homeStyles();

const Home: FC<TabsStackScreenProps<'Home'>> = ({ navigation }) => {
  // fetch all user accounts
  const fetchUserAccounts = useApi({ endpoint: 'getAllAccounts' });
  const saveProfilePicture = useApi({ endpoint: 'saveProfilePicture' });

  // fetch all debit accounts
  const fetchDebitAccounts = useApi({ endpoint: 'getDebitAccounts' });
  const { currentTheme } = useAppSelector(state => state.theme);
  const [refreshing, setRefreshing] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const [kycRequest, setRequest] = useState<KycRequestTypes | undefined>(
    undefined,
  );
  const [showSetPin, setShowSetPin] = useState(false);

  const { colors } = useTheme();

  const { accounts, selectedAccount } = useAppSelector(state => state.account);
  const { hasTransactionPin } = useAppSelector(state => state.profile);
  const fetchAccUpgrade = useApi({ endpoint: 'fetchSingleAccountUpgrade' });
  const fetchProfile = useApi({ endpoint: 'getProfileInfo' });

  const { showSuccess } = useAppToast();
  const dispatch = useAppDispatch();

  const openModal = () => {
    setShowSetPin(true);
  };

  const closeModal = () => {
    setShowSetPin(false);
  };

  const openPinSetScreen = () => {
    closeModal();
    navigation.navigate('MaintainPin');
  };

  // show set transaction pin modal if not set
  useEffect(() => {
    hasTransactionPin !== undefined &&
      hasTransactionPin === false &&
      openModal();
  }, [hasTransactionPin]);

  const getAllUsersAccount = async () => {
    try {
      const res = await fetchUserAccounts.requestInit(undefined);
      if (res?.data?.code === '00') {
        dispatch(setAccounts(res?.data?.data));
        console.log('all accounts', res);
      }
    } catch (error) {}
  };

  const getCustomerInfo = async () => {
    setLoading(true);
    try {
      const res = await fetchProfile.requestInit();
      if (res?.data?.code === '00') {
        const { data } = res?.data;
        setPhoto(data?.profileImage);
        dispatch(setProfile(data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const saveProfilePhoto = async (val: ProfilePicture) => {
    setLoading(true);
    try {
      const res = await saveProfilePicture.requestInit(val);

      if (res?.data?.code === '00') {
        showSuccess(res?.data?.message);
        await getCustomerInfo();
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const capturePhoto = async (type: string) => {
    type === 'capture'
      ? launchCamera(cameraOptions, async response => {
          if (response?.assets) {
            setOptionsModal(false);
            setPhoto('data:image/png;base64,' + '' + response.assets[0].base64);
            await saveProfilePhoto({
              profileImage:
                'data:image/png;base64,' + '' + response.assets[0].base64,
            });
          } else {
            setOptionsModal(false);
          }
        })
      : launchImageLibrary(cameraOptions, async response => {
          if (response?.assets) {
            setOptionsModal(false);
            setPhoto('data:image/png;base64,' + '' + response.assets[0].base64);
            await saveProfilePhoto({
              profileImage:
                'data:image/png;base64,' + '' + response.assets[0].base64,
            });
          } else {
            setOptionsModal(false);
          }
        });
  };

  const getUserDebitAccounts = async () => {
    try {
      const res = await fetchDebitAccounts.requestInit(undefined);
      if (res?.data?.code === '00') {
        dispatch(setDebitAccounts(res?.data));
      }
    } catch (error) {
    } finally {
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    getAllUsersAccount();
    getUserDebitAccounts();
    getCustomerInfo();
    setRefreshing(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const unsubscribe = navigation.addListener('focus', async () => {
          getAllUsersAccount();
          getUserDebitAccounts();
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
      } catch (error) {}
    })();
  }, []);

  useEffect(() => {
    const fetchAccountUpgradeReq = async () => {
      const response = await fetchAccUpgrade?.requestInit();
      console.log('response', response);
      if (response?.data?.response?.length) {
        const fnMatchAcc = response?.data?.response?.filter(
          ({ accountNumber }: Accounts_) =>
            accountNumber === selectedAccount?.accountNumber,
        );
        const lastReq = fnMatchAcc?.at(-1);
        console.log('last-req', lastReq);
        dispatch(setKycRequest(lastReq));
        setRequest(lastReq);
      }
    };
    fetchAccountUpgradeReq();
  }, [selectedAccount]);

  return (
    <YStack flex={1}>
      <PageContainer
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme === 'dark' ? colors.white : colors.primary}
          />
        }
        photo={photo as string}
        setOptionsModal={setOptionsModal}
        enableAppBar
      >
        {/* notification */}
        {kycRequest ? (
          <AlertCard
            title={
              kycRequest?.status === 'PENDING'
                ? 'Pending KYC Approval'
                : 'KYC Request Rejected'
            }
            subtitle={
              kycRequest?.status === 'PENDING'
                ? 'Your details are being reviewed. Approval may take some time.'
                : kycRequest?.rejectReason
            }
            currentKYCRequestId={String(kycRequest?.id)}
            type={kycRequest?.status === 'PENDING' ? 'warning' : 'error'}
            liinkTo={
              kycRequest?.status === 'REJECTED'
                ? () => navigation.navigate('KycRequestStatus')
                : undefined
            }
          />
        ) : null}

        <Modal
          visible={showSetPin}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalContent}
              backgroundColor={colors.background}
            >
              {/* Header for modal */}
              <YStack
                gap={8}
                height={'100%'}
                maxWidth="100%"
                flex={1}
                padding={32}
              >
                <Text
                  color={colors.grey06}
                  fontFamily="Inter-Bold"
                  fontSize={18}
                  textAlign="center"
                >
                  Set Your Transaction PIN
                </Text>
                <Text
                  color={colors.grey04}
                  fontFamily="Inter-Medium"
                  fontSize={15}
                  textAlign="center"
                  lineHeight={22}
                  maxWidth="100%"
                >
                  You need to set your transaction PIN to proceed. This PIN is
                  required for secure transactions.
                </Text>
                <Button marginTop="auto" onPress={openPinSetScreen}>
                  Set PIN Now
                </Button>
              </YStack>
            </View>
          </View>
        </Modal>

        {loading && (
          <ProgressModal
            isVisible={loading}
            onBackdropPress={() => setLoading(true)}
            onBackButtonPress={() => setLoading(true)}
          />
        )}
        {/* {optionsModal && launchCameraModal()} */}

        <View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.scroll}
          >
            <View style={{ width: '100%', marginTop: 6 }}>
              <DashboardSlides
                views={accounts}
                activeSlide={activeSlide}
                setActiveSlide={slide => setActiveSlide(slide)}
              />
            </View>
            <View style={styles.features}>
              <Features />
            </View>

            <View
              style={{
                marginTop: 32,
                marginBottom: 20,
                width: '100%',
                alignItems: 'center',
                backgroundColor: 'transparent',
              }}
            >
              <Adverts />
            </View>
          </ScrollView>
        </View>
      </PageContainer>
      <Sheet
        isVisible={optionsModal}
        sheetHeight={280}
        onClose={() => setOptionsModal(false)}
      >
        <YStack
          backgroundColor={colors.background}
          flex={1}
          paddingInline={24}
          paddingBlock={16}
          paddingBottom={20}
          alignItems="center"
        >
          <Text
            maxWidth={220}
            textAlign="center"
            lineHeight={24}
            color={colors.grey06}
            fontSize={18}
            marginTop={8}
            fontWeight="600"
          >
            Update Profile Picture
          </Text>
          <Text
            lineHeight={24}
            textAlign="center"
            color={colors.grey05}
            fontSize={15}
            marginTop={8}
            maxWidth={290}
            fontWeight="500"
          >
            Select an image from your library or take a new photo with your
            camera.
          </Text>
          <XStack marginTop={32} gap={32} alignItems="center">
            <TouchableOpacity onPress={() => capturePhoto('library')}>
              <YStack gap={12} alignItems="center">
                <View
                  justifyContent="center"
                  alignItems="center"
                  width={70}
                  height={70}
                  borderRadius={100}
                  backgroundColor={colors.rgba10}
                >
                  <Image size={32} variant="Bold" color={colors.primary} />
                </View>

                <Text
                  color={colors.grey05}
                  fontFamily="Inter-Medium"
                  fontSize={16}
                  textAlign="center"
                >
                  Library
                </Text>
              </YStack>
            </TouchableOpacity>
            <View
              borderColor={colors.borderColor}
              borderWidth={0.3}
              height={70}
            />
            <TouchableOpacity onPress={() => capturePhoto('capture')}>
              <YStack gap={12} alignItems="center">
                <View
                  justifyContent="center"
                  alignItems="center"
                  width={70}
                  height={70}
                  borderRadius={100}
                  backgroundColor={colors.rgba10}
                >
                  <Camera size={32} variant="Bold" color={colors.primary} />
                </View>

                <Text
                  color={colors.grey05}
                  fontFamily="Inter-Medium"
                  fontSize={16}
                  textAlign="center"
                >
                  Camera
                </Text>
              </YStack>
            </TouchableOpacity>
          </XStack>
        </YStack>
      </Sheet>
    </YStack>
  );
};

export default Home;
