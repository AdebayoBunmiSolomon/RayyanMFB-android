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
import ArrowBack from '../../assets/svg/arrow_back.svg';
import Search from '../../assets/svg/search.svg';
import Empty from '../../assets/svg/empty.svg';
import { BillItems } from '../../types/bills-payments.types';
import { useAppSelector } from '../../hooks/hook';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';

interface DataBundlesModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  onSwipeComplete: () => void;
  closeModal: () => void;
  setSelectedBundle: (item: BillItems) => void;
  dataBundles: BillItems[];
}

const DataBundlesModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  onSwipeComplete,
  closeModal,
  setSelectedBundle,
  dataBundles,
}: DataBundlesModalProps) => {
  const { currentTheme } = useAppSelector(state => state.theme);

  const [search, setSearch] = useState('');

  const [filteredDataSource, setFilteredDataSource] = useState<BillItems[]>([]);

  const [bundles, setBundles] = useState<BillItems[]>([]);

  const searchFilterFunction = (text: string) => {
    if (text) {
      // Inserted text is not blank
      // Filter the bundles lists
      // Update FilteredDataSource
      const newData = bundles.filter(function (item) {
        const itemData = item.paymentItemName
          ? item.paymentItemName.toUpperCase()
          : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      // Inserted text is blank
      // Update FilteredDataSource with bundles
      setFilteredDataSource(bundles);
      setSearch(text);
    }
  };

  const ListEmptyView = () => {
    return (
      <View style={styles.listEmpty}>
        <View style={styles.emptyView}>
          <ArrowBack />
          <Text
            style={{
              ...styles.emptyText,
              color: currentTheme === 'dark' ? colors.white : colors.black,
            }}
          >
            Empty Data Bundles
          </Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    setBundles(dataBundles);
    setFilteredDataSource(dataBundles);
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
                Select Bundle
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
                placeholder="Search Bundle...."
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
                  style={{ marginTop: verticalScale(14) }}
                  key={index}
                  onPress={() => {
                    const picked = filteredDataSource.find(
                      _ => _.id === item.id,
                    );
                    setSelectedBundle(picked as BillItems);
                    closeModal();
                  }}
                >
                  <Text
                    style={{
                      ...styles.bankText,
                      color:
                        currentTheme === 'dark' ? colors.white : colors.black,
                    }}
                  >
                    {item.paymentItemName}
                  </Text>
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

export default DataBundlesModal;

const styles = StyleSheet.create({
  // Modal

  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
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
    marginTop: verticalScale(45),
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
    fontSize: moderateScale(13),
    fontStyle: 'normal',
    fontWeight: '500',
    color: colors.black,
  },

  border: {
    width: '100%',
    borderBottomColor: colors.appPrimary,
    borderBottomWidth: 1,
    marginTop: verticalScale(12),
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
