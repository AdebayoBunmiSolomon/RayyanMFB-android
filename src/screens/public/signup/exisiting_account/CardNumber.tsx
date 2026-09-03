import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { FC, useState } from 'react';

import Ray from '../../../../assets/svg/ray.svg';
import { Formik } from 'formik';
import * as yup from 'yup';
import Art from '../../../../assets/svg/art.svg';
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
const accountValidationSchema = yup.object().shape({
  acctNumber: yup
    .string()
    .min(10, ({ min }) => `Card number must be at least ${min} characters`)
    .max(10, ({ max }) => `Card number must not exceed ${max} characters`)
    .matches(/^\d+$/, 'Only numbers are allowed')
    .required('Card number is required'),
});

const CardNumber: FC<PublicStackScreenProps<'CardNumber'>> = ({
  navigation,
}) => {
  return (
    <Container>
      <Header
        color={colors.lightBackground}
        rightSvg={<Ray />}
        leftOnPress={() => navigation.goBack()}
        rightOnPress={() => {}}
        marginTop={10}
      />
      <MainContainer bgColor={colors.lightBackground}>
        <KeyboardAvoidWrapper>
          <Formik
            validationSchema={accountValidationSchema}
            initialValues={{
              acctNumber: '',
            }}
            onSubmit={async values => {
              // navigation.navigate('OTPVerification');
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              isValid,
            }) => (
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
                    Last 6 digits of your Card Number
                  </Text>
                </View>

                <View style={{ marginTop: verticalScale(4) }}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Eg. 332943"
                    placeholderTextColor={colors.black}
                    onChangeText={handleChange('acctNumber')}
                    onBlur={handleBlur('acctNumber')}
                    value={values.acctNumber}
                    maxLength={10}
                    keyboardType={'number-pad'}
                  />
                </View>

                {errors.acctNumber && (
                  <Text style={styles.error}>{errors.acctNumber}</Text>
                )}

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(9),
                  }}
                >
                  <View>
                    <Text style={styles.leftText}>Alternative signup with</Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => navigation.navigate('AccountInfo')}
                  >
                    <Text
                      style={{
                        ...styles.rightText,
                      }}
                    >
                      Account Number
                    </Text>
                  </TouchableWithoutFeedback>
                </View>

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(18),
                  }}
                >
                  <Button
                    label="Proceed"
                    onPress={() => handleSubmit()}
                    disabled={!isValid}
                    width={'100%'}
                    backgroundColor={colors.appPrimary}
                    labelColor={colors.white}
                  />
                </View>

                <View
                  style={{
                    ...global.flexRow,
                    marginTop: verticalScale(10),
                    marginBottom: verticalScale(150),
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

export default CardNumber;

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
