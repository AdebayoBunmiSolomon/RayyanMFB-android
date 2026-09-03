import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { Beneficiaries } from '../../types/transfer.types';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

interface BeneficiaryModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  onSwipeComplete: () => void;
  closeModal: () => void;
  setSelectedBeneficiary: (item: Beneficiaries) => void;
}

const BeneficiariesModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  onSwipeComplete,
  closeModal,
  setSelectedBeneficiary,
}: BeneficiaryModalProps) => {
  const { intra } = useAppSelector(state => state.transfer);

  const { currentTheme } = useAppSelector(state => state.theme);

  const [search, setSearch] = useState('');

  const [beneficiaries, setBeneficiaries] = useState<Beneficiaries[]>([]);

  const [filteredDataSource, setFilteredDataSource] = useState<Beneficiaries[]>(
    [],
  );

  const searchFilterFunction = (text: string) => {
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the beneficiaries lists
      // Update FilteredDataSource
      const newData = beneficiaries.filter(function (item) {
        const itemData = item?.accountName
          ? item?.accountName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with beneficiaries
      setFilteredDataSource(beneficiaries);
      setSearch(text);
    }
  };

  const ListEmptyView = () => {
    return (
      <View style={styles.listEmpty}>
        <View style={styles.emptyView}>
          <Svg width={51} height={50} fill="none">
            <G
              fill={currentTheme === 'dark' ? colors.white : colors.black}
              clipPath="url(#a)"
            >
              <Path d="M45.292 45.835H5.708A5.214 5.214 0 0 1 .5 40.626V26.043c0-.146.031-.294.092-.427L8.86 7.24a5.221 5.221 0 0 1 4.75-3.073h23.78a5.221 5.221 0 0 1 4.75 3.073l8.268 18.375c.06.133.092.281.092.427v14.583a5.214 5.214 0 0 1-5.208 5.209ZM2.583 26.265v14.361a3.129 3.129 0 0 0 3.125 3.125h39.584a3.129 3.129 0 0 0 3.125-3.125v-14.36L40.24 8.093a3.135 3.135 0 0 0-2.85-1.842H13.61a3.133 3.133 0 0 0-2.85 1.844l-8.177 18.17Z" />
              <Path d="M35.514 35.417H15.485a3.137 3.137 0 0 1-2.925-2.027l-2.112-5.632a1.042 1.042 0 0 0-.975-.675h-7.41a1.042 1.042 0 0 1 0-2.083h7.41c1.295 0 2.47.815 2.927 2.027l2.11 5.631c.152.404.544.675.975.675h20.027c.434 0 .825-.27.975-.675l2.11-5.63A3.147 3.147 0 0 1 41.528 25h7.931a1.042 1.042 0 0 1 0 2.083h-7.931c-.434 0-.825.271-.975.675l-2.11 5.632a3.144 3.144 0 0 1-2.928 2.027Z" />
            </G>
            <Defs>
              <ClipPath id="a">
                <Path
                  fill={currentTheme === 'dark' ? colors.black : colors.white}
                  d="M.5 0h50v50H.5z"
                />
              </ClipPath>
            </Defs>
          </Svg>
          <Text
            style={{
              ...styles.emptyText,
              color: currentTheme === 'dark' ? colors.white : colors.black,
            }}
          >
            Empty Beneficiary List
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setBeneficiaries(intra.data);
    setFilteredDataSource(intra.data);
  }, []);

  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
      onSwipeComplete={onSwipeComplete}
      swipeDirection={'down'}
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
                Beneficiaries
              </Text>
            </View>

            <View></View>
          </View>

          <View
            style={{
              ...styles.textInputWrapper,
              borderColor:
                currentTheme === 'dark'
                  ? colors.lightPrimary
                  : colors.otpBorderColor,
              width: '100%',
              marginTop: verticalScale(28),
            }}
          >
            <View style={{ ...styles.iconView, flex: 0.1 }}>
              <Svg width={19} height={18} fill="none">
                <G
                  stroke={
                    currentTheme === 'dark' ? colors.white : colors.stroke
                  }
                  strokeOpacity={0.3}
                >
                  <Path d="M12.87 6.522c.622 2.964-1.348 5.913-4.44 6.563-3.091.65-6.082-1.257-6.705-4.22C1.102 5.9 3.073 2.95 6.165 2.3c3.09-.65 6.082 1.257 6.705 4.221Z" />
                  <Path
                    d="M0-.5h5.451"
                    transform="matrix(.84557 .53386 -.55917 .82905 13.155 11.771)"
                  />
                </G>
              </Svg>
            </View>

            <View style={{ ...styles.searchInputView, flex: 0.9 }}>
              <TextInput
                style={{
                  ...styles.textInput_,
                  color: currentTheme === 'dark' ? colors.white : colors.black,
                }}
                placeholder="Search Beneficiaries...."
                placeholderTextColor={
                  currentTheme === 'dark' ? colors.white : colors.black
                }
                onChangeText={text => searchFilterFunction(text)}
                value={search}
              />
            </View>
          </View>

          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={ListEmptyView}
            renderItem={({ item, index }) => (
              <View>
                <TouchableOpacity
                  style={{ ...global.rowCenter, marginTop: verticalScale(15) }}
                  key={index}
                  onPress={() => {
                    const picked = filteredDataSource.find(
                      _ => _.id === item.id,
                    );
                    setSelectedBeneficiary(picked as Beneficiaries);
                    closeModal();
                  }}
                >
                  <View style={{ ...global.rowCenter }}>
                    <View style={styles.avatarView}>
                      {item?.accountName ? (
                        <Text
                          style={{
                            ...styles.avatarText,
                            color:
                              currentTheme === 'dark'
                                ? colors.white
                                : colors.black,
                          }}
                        >
                          {item?.accountName[0]}
                        </Text>
                      ) : null}
                    </View>

                    <View style={{ marginLeft: horizontalScale(10) }}>
                      <Text
                        style={{
                          ...styles.nameText,
                          color:
                            currentTheme === 'dark'
                              ? colors.white
                              : colors.black,
                        }}
                      >
                        {item?.accountName}
                      </Text>
                      <Text
                        style={{
                          ...styles.bankText,
                          color:
                            currentTheme === 'dark'
                              ? colors.white
                              : colors.black,
                        }}
                      >
                        {item?.accountNumber} {item?.beneficiaryBank} Bank
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    ...styles.border,
                  }}
                ></View>
              </View>
            )}
          />
        </View>
      </PageContainer>
    </Modal>
  );
};

export default BeneficiariesModal;

const styles = StyleSheet.create({
  // Modal

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

  textInputWrapper: {
    height: 54,
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
    textTransform: 'capitalize',
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

  listEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyView: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(28),
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: moderateScale(14),
    fontStyle: 'normal',
    fontWeight: '400',
    color: colors.black,
    textAlign: 'center',
    marginTop: verticalScale(20),
  },
});
