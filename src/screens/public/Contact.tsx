/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import { PublicStackScreenProps } from '../../types/navigation.types';
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
import Accordion from '../../components/Accordion';
import ArrowBack from '../../assets/svg/expand_left.svg';
import Telephone from '../../assets/svg/telephone.svg';
import Whatsapp from '../../assets/svg/whatsapp.svg';
import Twitter from '../../assets/svg/twitter.svg';
import Instagram from '../../assets/svg/instagram.svg';
import Facebook from '../../assets/svg/facebook.svg';
import Mail from '../../assets/svg/mail.svg';
import Website from '../../assets/svg/website.svg';
import ArrowRight from '../../assets/svg/expand.svg';
import ArrowDown from '../../assets/svg/down_.svg';
import LoadingModal from '../../components/modals/LoadingModal';
import { useLazyGetFaqQuery } from '../../api/public';
import { FAQ } from '../../types/public.types';

const Contact: FC<PublicStackScreenProps<'Contact'>> = ({ navigation }) => {
  const [toggle, setToggle] = useState(false);

  const [loading, setLoading] = useState(false);

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const onToggleSwitch = () => setToggle(!toggle);

  const [faq] = useLazyGetFaqQuery();

  const phoneNumber = '2349049712650';
  const emailAddress = 'customercare@rayyanbank.com.ng';

  const openPhoneDialer = () => {
    const phoneUrl = `tel:${phoneNumber}`;
    Linking.openURL(phoneUrl);
  };

  const openEmailApp = () => {
    const emailUrl = `mailto:${emailAddress}`;
    Linking.openURL(emailUrl);
  };

  const openWhatsApp = () => {
    const whatsappLink = `https://wa.me/${phoneNumber}`;
    Linking.openURL(whatsappLink);
  };

  const getFrequentlyAskedQuestions = async () => {
    setLoading(true);
    try {
      const res = await faq().unwrap();
      if (res) {
        setFaqs(res);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFrequentlyAskedQuestions();
  }, [faq]);

  return (
    <View style={global.container}>
      <SafeAreaView style={global.content}>
        <StatusBar translucent barStyle="dark-content" />
        {
          <LoadingModal
            isVisible={loading}
            onBackdropPress={() => setLoading(true)}
            onBackButtonPress={() => setLoading(true)}
          />
        }
        <Header
          color={colors.lightBackground}
          rightSvg={<Ray />}
          leftSvg={<ArrowBack />}
          leftOnPress={() => navigation.goBack()}
          rightOnPress={() => {}}
        />
        <MainContainer bgColor={colors.lightBackground}>
          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ ...global.flexRow, marginTop: verticalScale(44) }}>
              <Art width={'100%'} />
            </View>

            <TouchableOpacity
              style={{
                ...global.flexRowSpace,
                marginTop: verticalScale(23),
                height: verticalScale(54),
                backgroundColor: colors.white,
                paddingHorizontal: horizontalScale(10),
              }}
              onPress={onToggleSwitch}
            >
              <Text style={styles.contactText}>FAQ</Text>
              {toggle ? <ArrowDown /> : <ArrowRight />}
            </TouchableOpacity>

            {toggle ? (
              <>
                <View style={{ marginTop: verticalScale(10) }}>
                  <Text style={styles.contactText}>FAQ</Text>
                </View>

                <View style={styles.srollViewArea}>
                  <FlatList
                    data={faqs}
                    keyExtractor={(item, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    style={{
                      width: '100%',
                      marginBottom: verticalScale(20),
                    }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    renderItem={({ item, index }) => (
                      <Accordion
                        key={index}
                        initialState={false}
                        title={item.question}
                      >
                        <View style={{ marginTop: verticalScale(5) }}>
                          <Text style={styles.answerText}>
                            <Text
                              style={{
                                ...styles.answerText,
                                fontWeight: '800',
                              }}
                            >
                              Ans.
                            </Text>
                            {item.answer}
                          </Text>
                        </View>
                      </Accordion>
                    )}
                  />
                </View>
              </>
            ) : null}

            <View style={{ marginTop: verticalScale(23) }}>
              <Text style={styles.contactText}>Contact Details</Text>
            </View>

            <View style={styles.contactViewArea}>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={styles.contactTitle}>Telephone</Text>
              </View>

              <TouchableOpacity
                style={{ ...global.rowCenter, marginTop: verticalScale(5) }}
                onPress={openPhoneDialer}
              >
                <Telephone />
                <Text style={styles.socialText}>+{phoneNumber}</Text>
              </TouchableOpacity>

              <View style={{ marginTop: verticalScale(20) }}>
                <Text style={styles.contactTitle}>Social</Text>
              </View>

              <TouchableOpacity
                style={{ ...global.rowCenter, marginTop: verticalScale(5) }}
                onPress={openWhatsApp}
              >
                <Whatsapp />
                <Text style={styles.socialText}>+{phoneNumber}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...global.rowCenter, marginTop: verticalScale(5) }}
                onPress={() =>
                  Linking.openURL(
                    'https://twitter.com/rayyanbank?t=sV0lTbvhsXAxtBrmyE3dhQ&s=08',
                  )
                }
              >
                <Twitter />
                <Text style={styles.socialText}>@rayyanbank</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...global.rowCenter, marginTop: verticalScale(5) }}
                onPress={() =>
                  Linking.openURL(
                    'https://www.instagram.com/rayyanbank.ng?igsh=MzRlODBiNWFlZA==',
                  )
                }
              >
                <Instagram />
                <Text style={styles.socialText}>@rayyanbank.ng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ ...global.rowCenter, marginTop: verticalScale(5) }}
                onPress={() =>
                  Linking.openURL(
                    'https://www.facebook.com/profile.php?id=61550051434651&is_tour_dismissed=true',
                  )
                }
              >
                <Facebook />
                <Text style={styles.socialText}>@rayyanbank</Text>
              </TouchableOpacity>

              <View style={{ marginTop: verticalScale(20) }}>
                <Text style={styles.contactTitle}>Mails</Text>
              </View>

              <TouchableOpacity
                style={{ ...global.rowCenter, marginTop: verticalScale(5) }}
                onPress={openEmailApp}
              >
                <Mail />
                <Text style={styles.socialText}>{emailAddress}</Text>
              </TouchableOpacity>

              <View style={{ marginTop: verticalScale(20) }}>
                <Text style={styles.contactTitle}>Website</Text>
              </View>

              <TouchableOpacity
                style={{
                  ...global.rowCenter,
                  marginTop: verticalScale(5),
                  marginBottom: 10,
                }}
                onPress={() => Linking.openURL('https://www.rayyanbank.com.ng')}
              >
                <Website />
                <Text style={styles.socialText}>www.rayyanbank.com.ng</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </MainContainer>
      </SafeAreaView>
    </View>
  );
};

export default Contact;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
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

  srollViewArea: {
    width: '100%',
    height: verticalScale(460),
    backgroundColor: colors.white,
    marginTop: verticalScale(10),
  },

  contactViewArea: {
    width: '100%',
    backgroundColor: colors.white,
    marginTop: verticalScale(10),
    paddingHorizontal: horizontalScale(15),
    marginBottom: verticalScale(30),
  },

  answerText: {
    color: colors.black,
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
  },

  contactText: {
    color: colors.contact,
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
  },

  contactTitle: {
    color: colors.black,
    fontSize: moderateScale(12),
    fontWeight: '700',
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
  },

  socialText: {
    color: colors.black,
    fontSize: moderateScale(12),
    fontWeight: '600',
    fontStyle: 'normal',
    fontFamily: 'Inter-Regular',
    marginLeft: horizontalScale(30),
  },
});
