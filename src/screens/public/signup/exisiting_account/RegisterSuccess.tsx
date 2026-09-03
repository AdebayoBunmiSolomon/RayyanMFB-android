import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { FC } from 'react';

import Ray from '../../../../assets/svg/ray.svg';
import Art from '../../../../assets/svg/art.svg';
import Success from '../../../../assets/svg/success.svg';
import { PublicStackScreenProps } from '../../../../types/navigation.types';
import Container from '../../../../components/Container';
import MainContainer from '../../../../components/MainContainer';
import colors from '../../../../theme/color';
import {
  verticalScale,
  moderateScale,
  global,
} from '../../../../theme/metrics';
import Header from '../../../../components/Header';
import Button from '../../../../components/Button';

const RegisterSuccess: FC<PublicStackScreenProps<'RegisterSuccess'>> = ({
  navigation,
  route,
}) => {
  const { message } = route.params;
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

          <View
            style={{
              ...global.flexRow,
              marginTop: verticalScale(60),
            }}
          >
            <Success />
          </View>

          <View
            style={{
              ...global.flexRow,
              marginTop: verticalScale(18),
            }}
          >
            <Text style={styles.successText}>{message}</Text>
          </View>

          <View
            style={{
              ...global.flexRow,
              marginTop: verticalScale(91),
              marginBottom: verticalScale(60),
            }}
          >
            <Button
              onPress={() => navigation.navigate('Login')}
              disabled={false}
              width={'100%'}
            >
              Sign In
            </Button>
          </View>
        </ScrollView>
      </MainContainer>
    </Container>
  );
};

export default RegisterSuccess;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },

  successText: {
    fontSize: moderateScale(24),
    fontStyle: 'normal',
    fontWeight: '600',
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
