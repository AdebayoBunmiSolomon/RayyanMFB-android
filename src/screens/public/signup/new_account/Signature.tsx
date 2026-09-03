import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import React, { FC, useState } from 'react';

import { PublicStackScreenProps } from '../../../../types/navigation.types';

import {
  verticalScale,
  horizontalScale,
  moderateScale,
  global,
} from '../../../../theme/metrics';
import Button from '../../../../components/Button';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Gallery from '../../../../assets/svg/image-gallery.svg';
import Camera_ from '../../../../assets/svg/photo-camera.svg';
import PageContainer from '../../../../components/PageContainer';
import { Text, View, XStack } from 'tamagui';
import HeaderAuth from '../../../../components/HeaderAuth';
import HeadingAuth from '../../../../components/HeadingAuth';
import { useTheme } from '../../../../context/ThemeContext';

const DEFAULT_OPTIONS: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  quality: 0.5,
  maxWidth: 500,
  maxHeight: 500,
  includeBase64: true,
  cameraType: 'back',
  saveToPhotos: false,
};

const Signature: FC<PublicStackScreenProps<'Signature'>> = ({
  navigation,
  route,
}) => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    scroll: {
      flexGrow: 1,
    },
    labelText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(12),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.rgba,
    },
    textInput: {
      borderWidth: 1,
      borderColor: colors.rgba20,
      padding: 15,
      height: verticalScale(54),
      backgroundColor: colors.white,
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(12),
      fontStyle: 'normal',
      fontWeight: '700',
      color: colors.black,
    },

    error: {
      fontSize: moderateScale(10),
      fontFamily: 'Inter-Regular',
      fontWeight: '400',
      fontStyle: 'normal',
      color: colors.error,
      marginTop: verticalScale(5),
    },

    leftText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(11),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.rgba,
    },

    rightText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(11),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.appPrimary,
      marginLeft: horizontalScale(4),
    },

    imageView: {
      width: '100%',
      height: verticalScale(223),
      backgroundColor: colors.white,
      marginTop: verticalScale(8),
      borderRadius: 16,
      overflow: 'hidden',
    },

    scanInfo: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(14),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.rgba65,
      textAlign: 'center',
      wordWrap: 'break-word',
    },

    // Picker Modal

    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },

    modal: {
      width: '100%',
      height: verticalScale(120),
      backgroundColor: colors.white,
      paddingHorizontal: horizontalScale(20),
      borderTopRightRadius: moderateScale(23),
      borderTopLeftRadius: moderateScale(23),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },

    modal_: {
      width: '100%',
      height: verticalScale(400),
      backgroundColor: colors.white,
      paddingHorizontal: horizontalScale(20),
      borderTopRightRadius: moderateScale(23),
      borderTopLeftRadius: moderateScale(23),
    },

    cameraGallery: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
    },

    centerColumn: { flexDirection: 'column', alignItems: 'center' },

    text_: {
      fontSize: moderateScale(14),
      fontFamily: 'Inter-Regular',
      fontWeight: '600',
      fontStyle: 'normal',
      marginTop: 8,
    },

    logoTextView: {
      position: 'absolute',
      bottom: 0,
      left: 20,
      right: 10,
    },

    logoText: {
      fontFamily: 'JosefinSans-Regular',
      fontSize: moderateScale(95),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.rayyanText,
    },
  });

  const { item } = route.params;

  const [_, setSignature] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [pickerModal, setPickerModal] = useState(false);
  const [pickerModal_, setPickerModal_] = useState(false);

  const openModal = () => {
    setPickerModal(true);
  };

  // const openModal_ = React.memo(() => {
  //   setPickerModal_(true);
  // };

  const capturePhoto = async (type: string) => {
    // setPickerModal(false);

    (await type) === 'capture'
      ? launchCamera(DEFAULT_OPTIONS, response => {
          if (response?.assets) {
            setPickerModal(false);
            setProfilePicture(
              'data:image/png;base64,' + '' + response.assets[0].base64,
            );
          } else {
            setPickerModal(false);
          }
        })
      : launchImageLibrary(DEFAULT_OPTIONS, response => {
          if (response?.assets) {
            setPickerModal(false);
            setProfilePicture(
              'data:image/png;base64,' + '' + response.assets[0].base64,
            );
          } else {
            setPickerModal(false);
          }
        });
  };

  const capturePhoto_ = async (type: string) => {
    (await type) === 'capture'
      ? launchCamera(DEFAULT_OPTIONS, response => {
          if (response?.assets) {
            setPickerModal_(false);
            setSignature(
              'data:image/png;base64,' + '' + response.assets[0].base64,
            );
          } else {
            setPickerModal_(false);
          }
        })
      : launchImageLibrary(DEFAULT_OPTIONS, response => {
          if (response?.assets) {
            setPickerModal_(false);
            setSignature(
              'data:image/png;base64,' + '' + response.assets[0].base64,
            );
          } else {
            setPickerModal_(false);
          }
        });
  };

  const launchCameraModal = () => {
    return (
      <Modal
        avoidKeyboard
        propagateSwipe={true}
        style={styles.bottomModal}
        isVisible={pickerModal}
        onBackdropPress={() => setPickerModal(false)}
        onBackButtonPress={() => setPickerModal(false)}
      >
        <View style={styles.modal}>
          <View style={styles.cameraGallery}>
            <TouchableOpacity
              style={styles.centerColumn}
              onPress={() => capturePhoto('library')}
            >
              <Gallery width={40} height={30} fill={colors.grey05} />
              <Text style={styles.text_} color={colors.grey05}>
                Library
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => capturePhoto('capture')}
              style={styles.centerColumn}
            >
              <Camera_ width={40} height={30} fill={colors.grey05} />
              <Text style={styles.text_} color={colors.grey05}>
                Camera
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const launchCameraModal_ = () => {
    return (
      <Modal
        avoidKeyboard
        propagateSwipe={true}
        style={styles.bottomModal}
        isVisible={pickerModal_}
        onBackdropPress={() => setPickerModal_(false)}
        onBackButtonPress={() => setPickerModal_(false)}
      >
        <View style={styles.modal}>
          <View style={styles.cameraGallery}>
            <TouchableOpacity
              style={styles.centerColumn}
              onPress={() => capturePhoto_('library')}
            >
              <Gallery width={40} height={30} />
              <Text style={styles.text_}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => capturePhoto_('capture')}
              style={styles.centerColumn}
            >
              <Camera_ width={40} height={30} />
              <Text style={styles.text_}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <PageContainer>
      {/* header */}
      <HeaderAuth />
      {/* heading - title - subtitle */}
      <HeadingAuth title="Create New Account" subtitle="Photo Upload" />
      {/* form */}
      {pickerModal && launchCameraModal()}
      {pickerModal_ && launchCameraModal_()}
      <View
        style={{
          ...global.flexRow,
          marginTop: verticalScale(30),
        }}
      >
        <Button onPress={() => openModal()} disabled={false} width={'100%'}>
          Take a Photo
        </Button>
      </View>

      <View style={styles.imageView}>
        <Image
          source={{ uri: profilePicture }}
          style={{ width: '100%', height: '100%' }}
          resizeMode={'cover'}
        />
      </View>

      {/* bottom elements */}
      <View marginTop={48} marginBottom={16}>
        <Button
          onPress={() => {
            // navigation.navigate('Question', {
            //   item: {...item, profilePicture, signature},
            // });

            navigation.navigate('Question', {
              item: { ...item, profilePicture },
            });
          }}
          disabled={!profilePicture}
          width={'100%'}
        >
          Confirm OK and Proceed
        </Button>

        {/* sign in */}
        <XStack marginInline="auto" marginTop={12} gap={4}>
          <Text color={colors.grey05} fontSize={14} fontWeight={'500'}>
            Already Activated
          </Text>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Login')}
          >
            <Text color={colors.primary} fontWeight="500">
              Sign In
            </Text>
          </TouchableWithoutFeedback>
        </XStack>
      </View>
    </PageContainer>
  );
};

export default Signature;
