import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Modal from 'react-native-modal';
import {
  colors,
  global,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/metrics';
import PageContainer from '../PageContainer';
import { useAppSelector } from '../../hooks/hook';
import { Formik } from 'formik';
import * as yup from 'yup';
import StatementSlides from '../StatementSlides';
import MaskedDateSelect from '../MaskedDateSelect';
import Moment from 'moment';
import Button from '../Button';
import KeyboardAvoidWrapper from '../KeyboardAvoidWrapper';
import Svg, { Path } from 'react-native-svg';

interface ValProps {
  fromDate: string;
  toDate: string;
}

interface SearchModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  closeModal: () => void;
  setValues: (val: ValProps) => void;
}

const statementValidationSchema = yup.object().shape({
  fromDate: yup.string().required('Start date is required'),
  toDate: yup.string().required('End date is required'),
});

const SearchTransactionsModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  closeModal,
  setValues,
}: SearchModalProps) => {
  const { accounts } = useAppSelector(state => state.transfer);

  const { currentTheme } = useAppSelector(state => state.theme);

  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
    >
      <PageContainer>
        <View style={{ flex: 1, paddingHorizontal: horizontalScale(20) }}>
          <View
            style={{ ...global.flexRowSpace, marginTop: verticalScale(80) }}
          >
            <TouchableOpacity onPress={closeModal}>
              <Svg width={20} height={33} fill="none">
                <Path
                  stroke={
                    currentTheme === 'dark' ? colors.white : colors.stroke
                  }
                  strokeWidth={2}
                  d="M17.778 3.168 4.444 16.501l13.334 13.334"
                />
              </Svg>
            </TouchableOpacity>

            <View>
              <Text
                style={{
                  ...styles.headerText,
                  color:
                    currentTheme === 'dark'
                      ? colors.white
                      : colors.semiLightTextColor,
                }}
              >
                Search History
              </Text>
            </View>

            <View></View>
          </View>

          {accounts?.length ? (
            <View
              style={{
                width: '100%',
                height: verticalScale(150),
                marginTop: verticalScale(20),
              }}
            >
              <StatementSlides
                views={accounts}
                activeSlide={activeSlide}
                setActiveSlide={slide => setActiveSlide(slide)}
              />
            </View>
          ) : null}

          <KeyboardAvoidWrapper
          // style={styles.scroll}
          // keyboardShouldPersistTaps={'handled'}
          // showsVerticalScrollIndicator={false}
          >
            <Formik
              validationSchema={statementValidationSchema}
              initialValues={{
                fromDate: '',
                toDate: '',
              }}
              enableReinitialize={true}
              onSubmit={async values => {
                closeModal();
                setValues(values);
              }}
            >
              {({ handleSubmit, setFieldValue, isValid, errors, values }) => (
                <>
                  <View style={{ marginTop: verticalScale(24) }}>
                    <MaskedDateSelect
                      label="From Date"
                      placeholder="Start Date"
                      width={'100%'}
                      height={verticalScale(55)}
                      onValueChange={itemValue => {
                        setFieldValue(
                          'fromDate',
                          Moment(itemValue).format('DD-MM-YYYY '),
                        );
                      }}
                    />
                  </View>

                  {errors.fromDate && (
                    <Text
                      style={{
                        ...styles.error,
                        color:
                          currentTheme === 'dark'
                            ? colors.white
                            : colors.otpBorderColor,
                      }}
                    >
                      {errors.fromDate}
                    </Text>
                  )}

                  <View style={{ marginTop: verticalScale(24) }}>
                    <MaskedDateSelect
                      label="To Date"
                      placeholder="End Date"
                      width={'100%'}
                      height={verticalScale(55)}
                      onValueChange={itemValue => {
                        setFieldValue(
                          'toDate',
                          Moment(itemValue).format('DD-MM-YYYY '),
                        );
                      }}
                    />
                  </View>

                  {errors.toDate && (
                    <Text
                      style={{
                        ...styles.error,
                        color:
                          currentTheme === 'dark'
                            ? colors.white
                            : colors.otpBorderColor,
                      }}
                    >
                      {errors.toDate}
                    </Text>
                  )}

                  <View
                    style={{
                      ...global.flexRow,
                      marginTop: verticalScale(34),
                      marginBottom: verticalScale(60),
                    }}
                  >
                    <Button
                      onPress={() => handleSubmit()}
                      disabled={!isValid || values.fromDate > values.toDate}
                      width={'100%'}
                      loading={false}
                    >
                      Search
                    </Button>
                  </View>
                </>
              )}
            </Formik>
          </KeyboardAvoidWrapper>
        </View>
      </PageContainer>
    </Modal>
  );
};

export default SearchTransactionsModal;

const styles = StyleSheet.create({
  // Modal

  scroll: { flexGrow: 1, marginTop: verticalScale(30) },

  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },

  modal: {
    width: '100%',
    height: '100%',
    paddingHorizontal: horizontalScale(32),
  },

  headerText: {
    fontFamily: 'Poppins',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.semiLightTextColor,
  },

  error: {
    fontSize: moderateScale(12),
    fontFamily: 'Raleway-Regular',
    fontWeight: '400',
    fontStyle: 'normal',
    color: colors.error,
    marginTop: verticalScale(5),
  },
});
