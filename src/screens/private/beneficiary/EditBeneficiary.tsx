/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  horizontalScale,
  verticalScale,
  global,
  moderateScale,
  colors,
} from '../../../theme/metrics';
import { Formik } from 'formik';
import * as yup from 'yup';
import { MainStackScreenProps } from '../../../types/navigation.types';
import PageContainerHeader from '../../../components/PageContainerHeader';
import MainContainer from '../../../components/MainContainer';
import KeyboardAvoidWrapper from '../../../components/KeyboardAvoidWrapper';
import Button from '../../../components/Button';
import MaskTextInput from '../../../components/MaskTextInput';
import DownLight from '../../../assets/svg/down_light.svg';
import BanksModal from '../../../components/modals/BanksModal';
import SuccessModal from '../../../components/modals/SuccessModal';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { listBanks } from '../../../slices/transferSlice';

const editValidationSchema = yup.object().shape({
  accountNumber: yup
    .string()
    .min(10, ({ min }) => `Account number must be at least ${min} characters`)
    .max(10, ({ max }) => `Account number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Account number is required'),
});

const EditBeneficiary: FC<MainStackScreenProps<'EditBeneficiary'>> = ({
  navigation,
  route,
}) => {
  const { item } = route.params;

  const dispatch = useAppDispatch();

  const { currentTheme } = useAppSelector(state => state.theme);

  const [bankModal, setBankModal] = useState(false);

  const [successModal, setSuccessModal] = useState(false);

  const [selectedBeneficiariesHash, setSelectedBeneficiariesHash] = useState({
    id: '',
    preferredName: '',
    institutionName: '',
    accountName: '',
    accountNumber: '',
    beneficiaryBank: '',
  });

  useEffect(() => {
    setSelectedBeneficiariesHash({
      ...selectedBeneficiariesHash,
      id: item?.id,
      preferredName: item?.preferredName,
      institutionName: item?.institutionName,
      accountName: item?.accountName,
      accountNumber: item?.accountNumber,
      beneficiaryBank: item.beneficiaryBank,
    });
  }, [item]);

  useEffect(() => {
    dispatch(listBanks());
  }, []);
  return (
    <PageContainer>
      {bankModal && (
        <BanksModal
          isVisible={bankModal}
          onBackdropPress={() => setBankModal(false)}
          onBackButtonPress={() => setBankModal(false)}
          onSwipeComplete={() => setBankModal(false)}
          closeModal={() => setBankModal(false)}
          setSelectedBank={item => {
            setSelectedBeneficiariesHash({
              ...selectedBeneficiariesHash,
              institutionName: item.institutionName,
              beneficiaryBank: item.institutionCode,
            });
          }}
        />
      )}

      {successModal && (
        <SuccessModal
          isVisible={successModal}
          onBackdropPress={() => setSuccessModal(false)}
          onBackButtonPress={() => setSuccessModal(false)}
          onSwipeComplete={() => setSuccessModal(false)}
          closeModal={() => setSuccessModal(false)}
          message={`Beneficiary ${`\n`} Maintained Successful`}
          onPress={() => { } } title={''}        />
      )}
      <PageContainerHeader
        title="Edit Beneficiaries"
        onPress={() => navigation.goBack()}
        height={verticalScale(90)}
      />

      <MainContainer bgColor={'transparent'}>
        <KeyboardAvoidWrapper>
          <Formik
            validationSchema={editValidationSchema}
            initialValues={
              (selectedBeneficiariesHash && selectedBeneficiariesHash) || {}
            }
            enableReinitialize={true}
            onSubmit={async () => {
              setSuccessModal(true);
            }}
          >
            {({ handleChange, handleSubmit, values, errors, isValid }) => (
              <>
                <TouchableOpacity
                  style={{
                    ...styles.selectContainer,
                    borderColor:
                      currentTheme === 'dark' ? colors.white : colors.black,
                    marginTop: verticalScale(28),
                  }}
                  onPress={() => setBankModal(true)}
                >
                  <Text style={styles.label}>Bank</Text>

                  <View style={{ ...global.flexRowSpace }}>
                    <Text
                      style={{
                        ...styles.selectText,
                        color:
                          currentTheme === 'dark' ? colors.white : colors.black,
                      }}
                    >
                      {selectedBeneficiariesHash?.institutionName
                        ? selectedBeneficiariesHash?.institutionName
                        : 'Select Bank'}
                    </Text>
                    <DownLight
                      fill={currentTheme === 'dark' ? colors.white : 'none'}
                    />
                  </View>
                </TouchableOpacity>

                <View style={{ marginTop: verticalScale(15) }}>
                  <MaskTextInput
                    value={values.accountNumber}
                    onChangeText={handleChange('accountNumber')}
                    label="Account Number"
                    placeholder="Account Number"
                    maxLength={10}
                    keyboardType={'number-pad'}
                  />
                </View>

                {errors.accountNumber && (
                  <Text
                    style={{
                      ...styles.error,
                      color:
                        currentTheme === 'dark'
                          ? colors.white
                          : colors.otpBorderColor,
                    }}
                  >
                    {errors.accountNumber}
                  </Text>
                )}

                {/* <View style={{marginTop: verticalScale(15)}}>
                  <MaskTextInput
                    value={values.accountName}
                    onChangeText={handleChange('accountName')}
                    label="Account Name"
                    placeholder="Account Name"
                  />
                </View>

                {errors.accountName && (
                  <Text   style={{
                    ...styles.error,
                    color:
                      currentTheme === 'dark'
                        ? colors.white
                        : colors.otpBorderColor,
                  }}>{errors.accountName}</Text>
                )} */}

                <View
                  style={{
                    ...styles.selectContainer,
                    borderColor:
                      currentTheme === 'dark' ? colors.white : colors.black,
                    marginTop: verticalScale(15),
                  }}
                >
                  <Text style={styles.label}>Account Name</Text>
                  <View style={{ ...global.flexRowSpace }}>
                    <Text
                      style={{
                        ...styles.selectText,
                        color:
                          currentTheme === 'dark' ? colors.white : colors.black,
                      }}
                    >
                      {selectedBeneficiariesHash?.accountName}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(18),
                  }}
                >
                  <Button
                    label="Edit"
                    onPress={() => handleSubmit()}
                    disabled={!isValid}
                    width={'100%'}
                    backgroundColor={colors.appPrimary}
                    labelColor={colors.white}
                  />
                </View>
              </>
            )}
          </Formik>
        </KeyboardAvoidWrapper>
      </MainContainer>
    </PageContainer>
  );
};

export default EditBeneficiary;

const styles = StyleSheet.create({
  textInputWrapper: {
    height: verticalScale(35),
    flexDirection: 'row',
    paddingHorizontal: horizontalScale(17),
    borderWidth: 1,
    borderColor: colors.otpBorderColor,
    borderRadius: moderateScale(5),
  },

  textInput_: {
    flex: 1,
    width: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(11),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
  },

  error: {
    fontSize: moderateScale(12),
    fontFamily: 'Raleway-Regular',
    fontWeight: '400',
    fontStyle: 'normal',
    color: colors.error,
    marginTop: verticalScale(5),
  },

  searchInputView: {
    flex: 0.7,
    flexDirection: 'row',
  },
  iconView: {
    flex: 0.3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  flatlist: {
    flex: 1,
    width: '100%',
    marginBottom: verticalScale(80),
    marginTop: verticalScale(24),
  },

  avatarView: {
    width: horizontalScale(36),
    height: verticalScale(36),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: moderateScale(50),
    backgroundColor: colors.inactive,
  },

  avatarText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(13),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
  },

  nameText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(13),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
  },

  bankText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(10),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.semiLightTextColor,
  },

  border: {
    width: '100%',
    borderBottomColor: colors.appPrimary,
    borderBottomWidth: 1,
    marginTop: verticalScale(18),
  },

  fixedView: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },

  selectContainer: {
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: moderateScale(5),
    padding: 10,
    height: verticalScale(48),
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    top: -10,
    left: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 2,
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(10),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.userText,
  },
  selectText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    // color: colors.otpBorderColor,
    color: colors.black,
    padding: 8,
    textTransform: 'capitalize',
  },
});
