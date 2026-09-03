import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { FC } from 'react';
import { TabsStackScreenProps } from '../../types/navigation.types';
import PageContainer from '../../components/PageContainer';
import PageContainerHeader from '../../components/PageContainerHeader';
import { colors, moderateScale, verticalScale } from '../../theme/metrics';
import MainContainer from '../../components/MainContainer';
import Transfer from '../../assets/svg/transfer.svg';
import OtherBank from '../../assets/svg/other_bank.svg';
import Topup from '../../assets/svg/topup.svg';
import History from '../../assets/svg/transaction.svg';
import Statement from '../../assets/svg/statement.svg';
import Beneficiary from '../../assets/svg/beneficiary.svg';
import Summary from '../../assets/svg/summary.svg';
import Tickets from '../../assets/svg/buy_ticket.svg';
import Officer from '../../assets/svg/officer.svg';
import Card from '../../assets/svg/card.svg';
import Create from '../../assets/svg/create_pin.svg';
import Profile from '../../assets/svg/profile.svg';
import Link from '../../assets/svg/link.svg';
import Govt from '../../assets/svg/government.svg';
import Cable from '../../assets/svg/cable.svg';
import Power from '../../assets/svg/power.svg';
import Water from '../../assets/svg/water.svg';
import Waste from '../../assets/svg/waste.svg';
import Cheque from '../../assets/svg/cheque.svg';
import Token from '../../assets/svg/token.svg';
import Standing from '../../assets/svg/standing.svg';
import Schedule from '../../assets/svg/schedule.svg';
import { useAppSelector } from '../../hooks/hook';

const { width } = Dimensions.get('window');

const boxSize = width / 2 - 32;

const Account: FC<TabsStackScreenProps<'Account'>> = ({ navigation }) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  return (
    <PageContainer>
      <PageContainerHeader
        title="My Favorites"
        onPress={() => navigation.goBack()}
        height={verticalScale(90)}
      />
      <MainContainer>
        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={{ marginTop: verticalScale(10) }}>
            <Text
              style={{
                ...styles.favText,
                color: currentTheme === 'dark' ? colors.white : colors.black,
              }}
            >
              Account
            </Text>
          </View>

          <View style={{ ...styles.row, marginTop: verticalScale(5) }}>
            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Create />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Create Account
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('AccountSummary')}
            >
              <View>
                <Summary />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Account Summary
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('GenerateStatement')}
            >
              <View>
                <Statement />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Generate Statement
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() =>
                navigation.navigate('Tabs', { screen: 'Settings' })
              }
            >
              <View>
                <Profile />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Profile
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('AccountOfficer')}
            >
              <View>
                <Officer />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Account Officer
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('Beneficiaries')}
            >
              <View>
                <Beneficiary />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    fontSize: moderateScale(9),
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Beneficiaries
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Link />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Link BVN
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: verticalScale(10) }}>
            <Text
              style={{
                ...styles.favText,
                color: currentTheme === 'dark' ? colors.white : colors.black,
              }}
            >
              Transfers
            </Text>
          </View>

          <View style={{ ...styles.row, marginTop: verticalScale(5) }}>
            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('Transfer')}
            >
              <View>
                <Transfer />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Rayyan Transfer
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('OtherBanks')}
            >
              <View>
                <OtherBank />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Other Bank Transfer
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('TransactionHistory')}
            >
              <View>
                <History />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Transaction History
                </Text>
              </View>
            </TouchableOpacity>

            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Schedule />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Scheduled Transfer
                </Text>
              </View>
            </View>
          </View>

          <View style={{ marginTop: verticalScale(10) }}>
            <Text
              style={{
                ...styles.favText,
                color: currentTheme === 'dark' ? colors.white : colors.black,
              }}
            >
              Bills & Utility
            </Text>
          </View>

          <View style={{ ...styles.row, marginTop: verticalScale(5) }}>
            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('AirtimeData')}
            >
              <View>
                <Topup />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Airtime Top-Up
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('BillsPage')}
            >
              <View>
                <Govt />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Govt Taxes
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('BillsPage')}
            >
              <View>
                <Tickets />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Buy Tickets
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('BillsPage')}
            >
              <View>
                <Cable />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Cable TV
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('BillsPage')}
            >
              <View>
                <Power />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Power Bill
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('BillsPage')}
            >
              <View>
                <Water />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Water Bill
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                ...styles.cardView,
                backgroundColor:
                  currentTheme === 'dark'
                    ? colors.darkBox
                    : colors.lightBackground,
              }}
              onPress={() => navigation.navigate('BillsPage')}
            >
              <View>
                <Waste />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text
                  style={{
                    ...styles.cardText,
                    textAlign: 'center',
                    color:
                      currentTheme === 'dark' ? colors.white : colors.black,
                  }}
                >
                  Waste Disposal
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: verticalScale(10) }}>
            <Text
              style={{
                ...styles.favText,
                color: currentTheme === 'dark' ? colors.white : colors.black,
              }}
            >
              Service Request
            </Text>
          </View>

          <View
            style={{
              ...styles.row,
              marginTop: verticalScale(5),
              marginBottom: verticalScale(30),
            }}
          >
            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Cheque />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Cheque Book Request
                </Text>
              </View>
            </View>

            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Card />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Account Cards
                </Text>
              </View>
            </View>

            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Token />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Token Request
                </Text>
              </View>
            </View>

            <View
              style={{ ...styles.cardView, backgroundColor: colors.whiteSmoke }}
            >
              <View>
                <Standing />
              </View>
              <View style={{ marginTop: verticalScale(10) }}>
                <Text style={{ ...styles.cardText, textAlign: 'center' }}>
                  Standing Order
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </MainContainer>
    </PageContainer>
  );
};

export default Account;

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },

  favText: {
    fontSize: moderateScale(12),
    fontStyle: 'normal',
    fontWeight: '600',
    color: colors.userText,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cardView: {
    backgroundColor: colors.lightBackground,
    margin: 3,
    width: boxSize / 2,
    height: 98,
    alignItems: 'center',
    padding: 10, //previously 13
  },

  cardText: {
    fontSize: moderateScale(10),
    fontStyle: 'normal',
    fontWeight: '400',
    color: colors.black,
  },
});
