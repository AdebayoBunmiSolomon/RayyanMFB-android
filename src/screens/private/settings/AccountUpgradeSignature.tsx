/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { Image, Text, View, XStack, YStack } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import { MainStackScreenProps } from '../../../types/navigation.types';
import Button from '../../../components/Button';
import { useTheme } from '../../../context/ThemeContext';
import HeadingAuth from '../../../components/HeadingAuth';
import { useApi } from '../../../hooks/useApi';
import { useAppSelector } from '../../../hooks/hook';
import SuccessModal from '../../../components/modals/SuccessModal';
import { normalizeSize } from '../../../util/size';
import {
  Camera,
  DirectboxSend,
  Image as ImageIcon,
} from 'iconsax-react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import cameraOptions from '../../../util/cameraOptions';
import { TouchableOpacity } from 'react-native';
import Sheet from '../../../components/Sheet';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useAppToast } from '../../../hooks/useAppToast';

const AccountUpgradeSignature: FC<
  MainStackScreenProps<'AccountUpgradeSignature'>
> = ({ navigation }) => {
  const [successModal, setSuccessModal] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { kyc, profile } = useAppSelector(state => state);
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const { requestInit, loading } = useApi({
    endpoint: 'accountUpgrade',
    onError: (error, errorDetails) => {

      showError('Failed to submit account upgrade. Please try again.');
    },
  });

  const fetchAccountUpgrade = useApi({
    endpoint: 'fetchAccountUpgrade',
    onError: (error, errorDetails) => {

      showError('Failed to load account upgrade details. Please try again.');
    },
  });

  const { colors } = useTheme();

  // const dispatch = useDispatch();

  // const handleSave = React.memo(() => {
  //   // Retrieve the signature
  //   ref.current.readSignature();
  // };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      if (!photo) {
        showError('Please upload a signature image before submitting.');
        return;
      }

      if (!kyc) {
        showError(
          'KYC information is missing. Please go back and complete the previous steps.',
        );
        return;
      }

      const payload = {
        signatureImage: photo,
        photoImage: profile?.profileImage || '',
        targetAccountTier: 2,
        ...kyc,
        currentAccountTier: 1,
      };

      const response = await requestInit(payload);
      if (response?.status === 200) {
        setSuccessModal(true);
      } else {
        showError('Failed to submit account upgrade. Please try again.');
      }
    } catch (error) {

      handleError(error as Error, 'AccountUpgradeSignature:handleSubmit');
      showError('Failed to submit account upgrade. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleOK = async (signatureData: string) => {
  //   setSign(signatureData);
  //   setPhoto(signatureData);
  //   handleSubmit(signatureData);
  // };

  // const handleEmpty = React.memo(() => {
  //   ref?.current?.clearSignature?.();
  // };

  useEffect(() => {
    const fetchAccountUpgradeReq = async () => {
      try {
        await fetchAccountUpgrade?.requestInit();
      } catch (error) {

        handleError(
          error as Error,
          'AccountUpgradeSignature:fetchAccountUpgrade',
        );
      }
    };
    fetchAccountUpgradeReq();
  }, []);

  const capturePhoto = async (type: string) => {
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

          handleError(error as Error, 'AccountUpgradeSignature:processImage');
          showError('Failed to process image. Please try again.');
        }
      });
    } catch (error) {

      handleError(error as Error, 'AccountUpgradeSignature:launchImagePicker');
      showError('Failed to open image picker. Please try again.');
    }
  };

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
            <HeaderAuth noLogo />
            <View marginTop="$8" alignItems="center">
              <Button onPress={() => navigation.goBack()}>Go Back</Button>
            </View>
          </View>
        </PageContainer>
      }
    >
      <PageContainer scrollable={false}>
        {/* header */}
        <HeaderAuth noLogo />
        <HeadingAuth
          title="Signature"
          subtitle="Upload your signature below"
          swap
        />
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

        <View flex={1} marginTop={0}>
          <YStack>
            {/* <View borderRadius={14} height={200}>
              <Signature
                ref={ref}
                onOK={handleOK}
                onEmpty={handleEmpty}
                descriptionText="Sign"
                clearText="Clear"
                confirmText="Save"
                webStyle={style}
                style={{
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.inputBorder,
                  overflow: 'hidden',
                  borderStyle: 'dotted',
                }}
              />
            </View> */}

            <YStack marginTop={32}>
              {/* <Label
                color={colors.grey05}
                fontFamily="Inter-Medium"
                fontSize={Sizes.fontMedium}
                marginBottom={12}>
                Signature Image
              </Label> */}

              <Button
                borderWidth={1}
                borderColor={colors.inputBorder}
                backgroundColor={colors.input}
                fontWeight="500"
                borderRadius={normalizeSize(16)}
                height={56}
                paddingHorizontal={normalizeSize(18)}
                justifyContent="space-between"
                fontFamily="Inter-Bod"
                onPress={() => setOptionsModal(true)}
              >
                <Text color={colors.grey05}>Upload Signature</Text>
                <DirectboxSend color={colors.lightPrimary} size={22} />
              </Button>
            </YStack>
            {photo && (
              <View
                marginTop={24}
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
          <XStack marginTop="auto" gap={14}>
            {/* <Button flex={1} onPress={handleEmpty} variant="outlined">
              Clear
            </Button> */}
            <Button
              flex={2}
              onPress={() => {
                try {
                  handleSubmit().catch(error => {

                    handleError(
                      error as Error,
                      'AccountUpgradeSignature:buttonPress',
                    );
                  });
                } catch (error) {

                  handleError(
                    error as Error,
                    'AccountUpgradeSignature:buttonPress',
                  );
                  showError('Failed to submit. Please try again.');
                }
              }}
              loading={loading || isSubmitting}
              disabled={!photo}
            >
              Submit
            </Button>
          </XStack>
        </View>

        {/* upload sheet/modal */}
        <Sheet
          isVisible={optionsModal}
          sheetHeight={300}
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
                      'AccountUpgradeSignature:openLibrary',
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
                      'AccountUpgradeSignature:openCamera',
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

export default AccountUpgradeSignature;
