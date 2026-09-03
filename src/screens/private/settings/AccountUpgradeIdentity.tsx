import React, { FC, useCallback, useMemo, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import { Text, View, XStack, YStack, Image, Label } from 'tamagui';
import HeaderAuth from '../../../components/HeaderAuth';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { Formik } from 'formik';
import Button from '../../../components/Button';
import Select from '../../../components/Select';
import { meansOfIdentification } from '../../../mock';
import { accountUpgradeIdSchema } from '../../../schema';
import { useDispatch } from 'react-redux';
import { setKyc } from '../../../slices/kycSlice';
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
import Sizes, { normalizeSize } from '../../../util/size';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { useAppToast } from '../../../hooks/useAppToast';

const AccountUpgradeIdentity: FC<
  MainStackScreenProps<'AccountUpgradeIdentity'>
> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [optionsModal, setOptionsModal] = useState(false);

  const { colors } = useTheme();
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: true, logError: true });

  const dispatch = useDispatch();

  // Debug: Log the meansOfIdentification data

  // Create the select data once to avoid re-mapping on every render
  const selectData = useMemo(() => {
    const data =
      meansOfIdentification?.map((res, key) => ({
        key: key.toString(),
        label: res,
        value: res,
      })) || [];

    return data;
  }, []);

  const capturePhoto = useCallback(
    async (type: string) => {
      try {

        setLoading(true);
        setOptionsModal(false); // Close modal immediately to prevent multiple taps

        const launchFunction =
          type === 'capture' ? launchCamera : launchImageLibrary;

        // Add timeout to prevent hanging
        const timeoutId = setTimeout(() => {

          showError('Image picker is taking too long. Please try again.');
          setLoading(false);
        }, 30000); // 30 second timeout

        // Create safer camera options for this specific use case
        const safeCameraOptions = {
          ...cameraOptions,
          quality: 0.2 as const, // Even lower quality to prevent crashes
          maxWidth: 600,
          maxHeight: 600,
        };

        try {
          launchFunction(safeCameraOptions, response => {
            try {

              clearTimeout(timeoutId); // Clear timeout on response

              // Handle cancellation
              if (response.didCancel) {

                setLoading(false);
                return;
              }

              // Handle errors
              if (response.errorMessage) {

                showError('Failed to select image. Please try again.');
                setLoading(false);
                return;
              }

              // Handle no assets
              if (!response.assets || response.assets.length === 0) {

                showError('No image selected. Please try again.');
                setLoading(false);
                return;
              }

              const asset = response.assets[0];

              // Validate asset
              if (!asset) {

                showError('Invalid image. Please try again.');
                setLoading(false);
                return;
              }

              // Check file size (prevent memory issues)
              if (asset.fileSize && asset.fileSize > 10 * 1024 * 1024) {
                // 10MB limit
                showError('Image is too large. Please select a smaller image.');
                setLoading(false);
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
                'AccountUpgradeIdentity:processImage',
              );
              showError('Failed to process image. Please try again.');
            } finally {
              setLoading(false);
            }
          });
        } catch (launchError) {

          clearTimeout(timeoutId);
          handleError(
            launchError as Error,
            'AccountUpgradeIdentity:launchFunction',
          );
          showError('Failed to open image picker. Please try again.');
          setLoading(false);
        }
      } catch (error) {

        handleError(error as Error, 'AccountUpgradeIdentity:launchImagePicker');
        showError('Failed to open image picker. Please try again.');
        setLoading(false);
      }
    },
    [showError, handleError],
  );

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

        {/* form */}
        <Formik
          validationSchema={accountUpgradeIdSchema}
          initialValues={{
            modeOfIdentification: '',
          }}
          onSubmit={async values => {
            try {
              setLoading(true);

              if (!photo) {
                showError(
                  'Please upload an identification image before proceeding.',
                );
                return;
              }

              dispatch(setKyc({ ...values, idImage: photo }));
              navigation.navigate('AccountUpgradeSignature');
            } catch (error) {

              handleError(error as Error, 'AccountUpgradeIdentity:onSubmit');
              showError('Failed to submit form. Please try again.');
            } finally {
              setLoading(false);
            }
          }}
        >
          {({
            handleBlur,
            handleSubmit,
            values,
            errors,
            isValid,
            touched,
            dirty,
            setFieldValue,
          }) => (
            <View flex={1} marginTop={32}>
              <YStack marginTop={24} gap={20}>
                <Select
                  label="Means of Identification"
                  placeholder="DRIVERS LICENSE"
                  onChange={value => {
                    try {
                      setFieldValue('modeOfIdentification', value);
                    } catch (error) {

                    }
                  }}
                  onBlur={handleBlur('modeOfIdentification')}
                  value={values.modeOfIdentification || ''}
                  error={
                    touched.modeOfIdentification && errors.modeOfIdentification
                  }
                  data={selectData}
                />

                {/* <Input
                onPressIn={() => setOptionsModal(true)}
                editable={false}
                label="Identification Image"
                placeholder="Upload File"
              /> */}

                <YStack>
                  <Label
                    color={colors.grey05}
                    fontFamily="Inter-Medium"
                    fontSize={Sizes.fontMedium}
                    marginBottom={12}
                  >
                    Identification Image
                  </Label>

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
                    <Text color={colors.grey05}>Upload File</Text>
                    <DirectboxSend size={22} color={colors.lightPrimary} />
                  </Button>
                </YStack>

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
              <View marginTop="auto">
                <Button
                  onPress={() => {
                    try {
                      handleSubmit();
                    } catch (error) {

                      handleError(
                        error as Error,
                        'AccountUpgradeIdentity:buttonPress',
                      );
                      showError('Failed to submit form. Please try again.');
                    }
                  }}
                  disabled={!(isValid && dirty) || !photo}
                  loading={loading}
                >
                  Next
                </Button>
              </View>
            </View>
          )}
        </Formik>
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
                      'AccountUpgradeIdentity:openLibrary',
                    );
                    showError(
                      'Failed to open image library. Please try again.',
                    );
                  }
                }}
                disabled={loading}
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
                      'AccountUpgradeIdentity:openCamera',
                    );
                    showError('Failed to open camera. Please try again.');
                  }
                }}
                disabled={loading}
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

export default AccountUpgradeIdentity;
