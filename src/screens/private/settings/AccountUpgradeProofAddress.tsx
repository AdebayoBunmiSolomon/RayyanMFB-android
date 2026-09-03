/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { Text, View, XStack, YStack, Image } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import cameraOptions from '../../../util/cameraOptions';
import Sheet from '../../../components/Sheet';
import { useTheme } from '../../../context/ThemeContext';
import { TouchableOpacity } from 'react-native';
import {
  Camera,
  DirectboxSend,
  Image as ImageIcon,
} from 'iconsax-react-native';
import { useApi } from '../../../hooks/useApi';
import { AccountUpgradeTypes } from '../../../types/account.types';
import SuccessModal from '../../../components/modals/SuccessModal';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useAppToast } from '../../../hooks/useAppToast';
import { useAppSelector } from '../../../hooks/hook';
import { Accounts_ } from '../../../types/transactions.types';

const AccountUpgradeProofAddress: FC<
  MainStackScreenProps<'AccountUpgradeProofAddress'>
> = ({ navigation }) => {
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [optionsModal, setOptionsModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [kycDetails, setKycDetails] = useState<AccountUpgradeTypes | undefined>(
    undefined,
  );
  const [isFetchingAcctUpgrade, setIsFetchingAcctUpgrade] =
    useState<boolean>(false);
  const {
    maidenName,
    nextOfKin,
    accountNumber: customerAccountNumber,
  } = useAppSelector(state => state.kyc);

  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const fetchAccountUpgrade = useApi({
    endpoint: 'fetchAccountUpgrade',
    onError: (_error, _errorDetails) => {
      showError('Failed to load account upgrade details. Please try again.');
    },
  });

  const {
    requestInit,
    loading,
    error: errors,
    errorDetails,
  } = useApi({
    endpoint: 'accountUpgrade',
    onError: (_error, _errorDetails) => {
      showError(
        _errorDetails?.message ||
          'Failed to submit account upgrade. Please try again.',
      );
    },
  });

  const { colors } = useTheme();

  const capturePhoto = useCallback(
    async (type: string) => {
      try {
        setOptionsModal(false); // Close modal immediately to prevent multiple taps

        const launchFunction =
          type === 'capture' ? launchCamera : launchImageLibrary;

        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {
          showError('Image picker is taking too long. Please try again.');
        }, 30000); // 30 second timeout

        launchFunction(cameraOptions, response => {
          try {
            clearTimeout(timeoutId); // Clear timeout on response

            // Handle cancellation
            if (response.didCancel) {
              return;
            }

            // Handle errors
            if (response.errorMessage) {
              showError('Failed to select image. Please try again.');
              return;
            }

            // Handle no assets
            if (!response.assets || response.assets.length === 0) {
              showError('No image selected. Please try again.');
              return;
            }

            const asset = response.assets[0];

            // Validate asset
            if (!asset) {
              showError('Invalid image. Please try again.');
              return;
            }

            // Check file size (prevent memory issues)
            if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
              // 10MB limit
              showError('Image is too large. Please select a smaller image.');
              return;
            }

            // Process base64 image
            if (asset.base64) {
              // Validate base64 string
              if (asset.base64.length > 0) {
                const base64String = 'data:image/jpeg;base64,' + asset.base64;
                setPhoto(base64String);
              } else {
                showError('Failed to process image data. Please try again.');
              }
            } else {
              showError('Failed to process image. Please try again.');
            }
          } catch (error) {
            clearTimeout(timeoutId);

            handleError(
              error as Error,
              'AccountUpgradeProofAddress:processImage',
            );
            showError('Failed to process image. Please try again.');
          }
        });
      } catch (error) {
        handleError(
          error as Error,
          'AccountUpgradeProofAddress:launchImagePicker',
        );
        showError('Failed to open image picker. Please try again.');
      }
    },
    [showError, handleError],
  );

  useEffect(() => {
    const fetchAccountUpgradeReq = async () => {
      setIsFetchingAcctUpgrade(true);
      try {
        const response = await fetchAccountUpgrade?.requestInit();
        if (
          response?.data?.response &&
          Array.isArray(response.data.response) &&
          response.data.response.length > 0
        ) {
          const fnMatchAcc = response.data.response.filter(
            ({ accountNumber }: Accounts_) =>
              accountNumber === customerAccountNumber,
          );
          const lastReq = fnMatchAcc?.at?.(-1);
          console.log('account-upgrade proof of address req', lastReq);
          setKycDetails(lastReq);
        }
      } catch (error) {
        handleError(
          error as Error,
          'AccountUpgradeProofAddress:fetchAccountUpgrade',
        );
      } finally {
        setIsFetchingAcctUpgrade(false);
      }
    };
    fetchAccountUpgradeReq();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      if (!photo) {
        showError('Please upload a proof of address image before submitting.');
        return;
      }

      if (!kycDetails) {
        showError(
          'KYC information is missing. Please go back and complete the previous steps.',
        );
        return;
      }

      const payload = {
        ...kycDetails,
        signatureImage: kycDetails.signatureImage,
        photoImage: kycDetails.photoImage,
        proofOfAddressImage: photo,
        targetAccountTier: 3,
        currentAccountTier: kycDetails.currentAccountTier,
        maidenName: maidenName,
        nextOfKin: nextOfKin,
      };

      const response = await requestInit(payload);
      if (response?.status === 200) {
        setSuccessModal(true);
      } else {
        console.log('error 1', errors);
        console.log('error 2', errorDetails);
      }
    } catch (error: any) {
      console.log('Error', error);
      // showError(error?.message || error?.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [photo, kycDetails]);

  return (
    <ErrorBoundary
      fallback={
        <PageContainer>
          <View
            flex={1}
            justifyContent="center"
            alignItems="center"
            padding="$4"
          >
            <HeaderAuth noLogo headerTitle="Account Upgrade" />
            <View marginTop="$8" alignItems="center">
              <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </View>
          </View>
        </PageContainer>
      }
    >
      <PageContainer>
        {/* header */}
        <HeaderAuth noLogo headerTitle="Account Upgrade" />
        {/* heading - title - subtitle */}
        {/* heading - title - subtitle */}
        {successModal && (
          <SuccessModal
            title="Account Upgrade Request Successfully Submitted."
            isVisible={successModal}
            onBackdropPress={() => setSuccessModal(false)}
            onBackButtonPress={() => setSuccessModal(false)}
            onSwipeComplete={() => setSuccessModal(false)}
            closeModal={() => setSuccessModal(false)}
            onPress={() => navigation.navigate('Tabs', { screen: 'Home' })}
          />
        )}
        {/* form */}
        <View flex={1} marginTop={32}>
          <YStack marginTop={24} gap={20}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setOptionsModal(true);
              }}
            >
              <Input
                label="Proof of Address Image"
                placeholder="Upload Image"
                editable={false}
                pointerEvents="none"
                endIcon={<DirectboxSend color={colors.lightPrimary} />}
              />
            </TouchableOpacity>

            {photo && (
              <View
                borderRadius={14}
                overflow="hidden"
                borderWidth={1}
                borderStyle="dotted"
                width={'100%'}
                height={200}
                borderColor={colors.amberYellow}
              >
                <Image
                  borderRadius={14}
                  src={photo}
                  width={'100%'}
                  height={'100%'}
                />
              </View>
            )}
          </YStack>

          {/* bottom elements */}
          <View marginTop="auto" marginBottom={14}>
            <Button
              onPress={() => {
                try {
                  handleSubmit();
                } catch (error) {
                  handleError(
                    error as Error,
                    'AccountUpgradeProofAddress:buttonPress',
                  );
                  // showError('Failed to submit. Please try again.');
                }
              }}
              disabled={!photo || isFetchingAcctUpgrade}
              loading={loading || isSubmitting || isFetchingAcctUpgrade}
            >
              Submit
            </Button>
          </View>
        </View>

        {/* upload sheet/modal */}
        <Sheet
          isVisible={optionsModal}
          sheetHeight={350}
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
              Upload Document
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
              <TouchableOpacity
                onPress={() => {
                  try {
                    capturePhoto('library');
                  } catch (error) {
                    handleError(
                      error as Error,
                      'AccountUpgradeProofAddress:openLibrary',
                    );
                    showError(
                      'Failed to open image library. Please try again.',
                    );
                  }
                }}
                disabled={isSubmitting}
              >
                <YStack gap={12} alignItems="center">
                  <View
                    justifyContent="center"
                    alignItems="center"
                    width={70}
                    height={70}
                    borderRadius={100}
                    backgroundColor={colors.rgba10}
                  >
                    <ImageIcon
                      size={32}
                      variant="Bold"
                      color={colors.primary}
                    />
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
              <TouchableOpacity
                onPress={() => {
                  try {
                    capturePhoto('capture');
                  } catch (error) {
                    handleError(
                      error as Error,
                      'AccountUpgradeProofAddress:openCamera',
                    );
                    showError('Failed to open camera. Please try again.');
                  }
                }}
                disabled={isSubmitting}
              >
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
      </PageContainer>
    </ErrorBoundary>
  );
};

export default AccountUpgradeProofAddress;
