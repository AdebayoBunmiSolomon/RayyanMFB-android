import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';

import Ray from '../../../../assets/svg/ray.svg';
import { Formik } from 'formik';
import * as yup from 'yup';
import Art from '../../../../assets/svg/art.svg';
import ArrowBack from '../../../../assets/svg/arrow_back.svg';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Container from '../../../../components/Container';
import KeyboardAvoidWrapper from '../../../../components/KeyboardAvoidWrapper';
import MainContainer from '../../../../components/MainContainer';
import colors from '../../../../theme/color';
import {
  verticalScale,
  horizontalScale,
  moderateScale,
  global,
} from '../../../../theme/metrics';
import Header from '../../../../components/Header';
import Button from '../../../../components/Button';
import Select from '../../../../components/Select';
import identity from '../../../../mock/Identity';
import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Gallery from '../../../../assets/svg/image-gallery.svg';
import Camera_ from '../../../../assets/svg/photo-camera.svg';

interface Props {
  key: number;
  label: string;
  value: string;
}

const DEFAULT_OPTIONS: ImageLibraryOptions & CameraOptions = {
  mediaType: 'photo',
  quality: 0.5,
  maxWidth: 500,
  maxHeight: 500,
  includeBase64: true,
  cameraType: 'back',
  saveToPhotos: false,
};
const identityValidationSchema = yup.object().shape({
  meansOfIdentity: yup
    .string()
    .required('Select valid means of identification'),
});

const Identification: FC<PublicStackScreenProps<'Identification'>> = ({
  navigation,
  // route,
}) => {
  // const {item} = route.params;
  const [selectedMeans, setSelectedMeans] = useState('');

  const [means, setMeans] = useState<Props[]>([]);

  const [photo, setPhoto] = useState('');

  const [pickerModal, setPickerModal] = useState(false);

  const handleOnChange = (value: string | null) => {
    setSelectedMeans(value as string);
  };

  const openModal = () => {
    setPickerModal(true);
  };

  const capturePhoto = async (type: string) => {
    // setPickerModal(false);

    (await type) === 'capture'
      ? launchCamera(DEFAULT_OPTIONS, response => {
          if (response?.assets) {
            setPickerModal(false);
            setPhoto('data:image/png;base64,' + '' + response.assets[0].base64);
          } else {
            setPickerModal(false);
          }
        })
      : launchImageLibrary(DEFAULT_OPTIONS, response => {
          if (response?.assets) {
            setPickerModal(false);
            setPhoto('data:image/png;base64,' + '' + response.assets[0].base64);
          } else {
            setPickerModal(false);
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
              <Gallery width={40} height={30} />
              <Text style={styles.text_}>Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => capturePhoto('capture')}
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

  useEffect(() => {
    const getMeans = async () => {
      const means_ = identity.map((_, index) => {
        return {
          key: index,
          value: _.value,
          label: _.label,
        };
      });
      setMeans(means_);
    };

    getMeans();
  }, []);
  return (
    <Container>
      {pickerModal && launchCameraModal()}
      <Header
        color={colors.lightBackground}
        leftSvg={<ArrowBack />}
        rightSvg={<Ray />}
        leftOnPress={() => navigation.goBack()}
        rightOnPress={() => {}}
      />
      <MainContainer bgColor={colors.lightBackground}>
        <KeyboardAvoidWrapper>
          <Formik
            validationSchema={identityValidationSchema}
            initialValues={{
              meansOfIdentity: '',
            }}
            onSubmit={() => {
              // navigation.navigate('Signature', {
              //   item: {...item, photo, meansOfIdentity: values.meansOfIdentity},
              // });
            }}
          >
            {({ handleSubmit, setFieldValue, errors, isValid }) => (
              <>
                <View
                  style={{ ...global.flexRow, marginTop: verticalScale(44) }}
                >
                  <Art width={'100%'} />
                </View>

                <View
                  style={{
                    marginTop: verticalScale(69),
                  }}
                >
                  <Text style={styles.labelText}>
                    Means of Identification Type
                  </Text>
                </View>

                <View style={{ marginTop: verticalScale(4) }}>
                  <Select
                    value={selectedMeans}
                    onChange={value => {
                      handleOnChange(value);
                      setFieldValue('meansOfIdentity', value);
                    }}
                    data={means}
                    placeholder="Means of Identification"
                  />
                </View>

                {errors.meansOfIdentity && (
                  <Text style={styles.error}>{errors.meansOfIdentity}</Text>
                )}

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(10),
                  }}
                >
                  <Button
                    label="Scan"
                    onPress={() => openModal()}
                    disabled={false}
                    width={'100%'}
                    backgroundColor={colors.otpBorderColor}
                    labelColor={colors.white}
                  />
                </View>

                <View style={styles.imageView}>
                  <Image
                    source={{ uri: photo }}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode={'cover'}
                  />
                </View>

                <View
                  style={{ ...global.flexRow, marginTop: verticalScale(10) }}
                >
                  <Text style={styles.scanInfo}>
                    Line up your identity document image to fit the frame
                  </Text>
                </View>

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(18),
                  }}
                >
                  <Button
                    label="Confirm OK and Proceed"
                    onPress={() => handleSubmit()}
                    disabled={!isValid || !photo}
                    width={'100%'}
                    backgroundColor={colors.appPrimary}
                    labelColor={colors.white}
                  />
                </View>

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(60),
                  }}
                >
                  <View>
                    <Text style={styles.leftText}>Already Activated?</Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text
                      style={{
                        ...styles.rightText,
                      }}
                    >
                      Sign In
                    </Text>
                  </TouchableWithoutFeedback>
                </View>
              </>
            )}
          </Formik>
        </KeyboardAvoidWrapper>
      </MainContainer>
    </Container>
  );
};

export default Identification;

const styles = StyleSheet.create({
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
    color: colors.black,
    marginTop: 5,
  },
});
