import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, { FC, useState } from 'react';
import { PublicStackScreenProps } from '../../types/navigation.types';
import Container from '../../components/Container';
import Header from '../../components/Header';
import {
  colors,
  global,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../theme/metrics';
import Ray from '../../assets/svg/ray.svg';
import MainContainer from '../../components/MainContainer';
import Art from '../../assets/svg/art.svg';

const QuestionPage: FC<PublicStackScreenProps<'QuestionPage'>> = ({
  navigation,
}) => {
  return (
    <Container>
      <Header
        color={colors.lightBackground}
        rightSvg={<Ray />}
        leftOnPress={() => navigation.goBack()}
        rightOnPress={() => {}}
      />
      <MainContainer bgColor={colors.lightBackground}>
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={{ ...global.flexRow, marginTop: verticalScale(44) }}>
            <Art width={'100%'} />
          </View>

          <View style={{ ...global.flexRow, marginTop: verticalScale(128) }}>
            <Text style={styles.questionText}>
              Do you have a Rayyan Bank Account?
            </Text>
          </View>

          <View
            style={{
              ...global.flexRowSpace,
              marginTop: verticalScale(120),
              marginBottom: verticalScale(60),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Bvn');
              }}
              style={[
                styles.btn,
                {
                  borderWidth: 1,
                  borderColor: colors.appPrimary,
                  width: horizontalScale(150),
                  height: verticalScale(41),
                },
              ]}
              disabled={false}
            >
              <Text style={{ ...styles.label, color: colors.black }}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AccountInfo');
              }}
              style={[
                styles.btn,
                {
                  backgroundColor: colors.appPrimary,
                  width: horizontalScale(150),
                  height: verticalScale(41),
                },
              ]}
              disabled={false}
            >
              <Text style={{ ...styles.label, color: colors.white }}>Yes</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </MainContainer>
    </Container>
  );
};

export default QuestionPage;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
  questionText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(16),
    fontStyle: 'normal',
    fontWeight: '600',
    color: colors.black,
  },

  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontFamily: 'Poppins-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
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
