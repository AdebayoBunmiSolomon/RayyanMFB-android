/* eslint-disable react-hooks/exhaustive-deps */
import { StyleSheet, View, FlatList, Text } from 'react-native';
import React, { FC, useEffect, useState } from 'react';
import PageContainer from '../../../components/PageContainer';
import {
  horizontalScale,
  verticalScale,
  moderateScale,
  colors,
} from '../../../theme/metrics';
import { MainStackScreenProps } from '../../../types/navigation.types';
import BeneficiaryList from '../../../components/BeneficiaryList';
import CustomFab from '../../../components/CustomFab';
import { useAppDispatch, useAppSelector } from '../../../hooks/hook';
import { setBeneficiariesList } from '../../../slices/beneficiarySlice';
import {
  Beneficiaries__,
  DeleteBeneficiary_,
} from '../../../types/transfer.types';
import LoadingModal from '../../../components/modals/LoadingModal';
import { listBanks } from '../../../slices/transferSlice';
import Svg, { G, Path, Defs, ClipPath } from 'react-native-svg';
import { useApi } from '../../../hooks/useApi';
import HeaderAuth from '../../../components/HeaderAuth';
import Input from '../../../components/Input';
import { YStack } from 'tamagui';
import { useAppToast } from '../../../hooks/useAppToast';

const Beneficiaries: FC<MainStackScreenProps<'Beneficiaries'>> = ({
  navigation,
}) => {
  const getAllBeneficiaries = useApi({ endpoint: 'getAllBeneficiaries' });
  const deleteBeneficiary = useApi({ endpoint: 'deleteBeneficiary' });

  const dispatch = useAppDispatch();

  const { currentTheme } = useAppSelector(state => state.theme);

  const { beneficiaries } = useAppSelector(state => state.beneficiary);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState('');

  const [beneficiaries_, setBeneficiaries_] = useState<Beneficiaries__[]>([]);

  const [filteredDataSource, setFilteredDataSource] = useState<
    Beneficiaries__[]
  >([]);

  const { showSuccess } = useAppToast();

  const searchFilterFunction = (text: string) => {
    if (text) {
      // Inserted text is not blank
      // Filter the beneficiaries_ lists
      // Update FilteredDataSource
      const newData = beneficiaries_.filter(function (item) {
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
      // Update FilteredDataSource with beneficiaries_
      setFilteredDataSource(beneficiaries_);
      setSearch(text);
    }
  };

  const getBeneficiariesList = async () => {
    setLoading(true);
    try {
      const res = await getAllBeneficiaries.requestInit();
      if (res?.data) {
        dispatch(setBeneficiariesList(res?.data));
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const deleteBeneficiaryUser = async (val: DeleteBeneficiary_) => {
    setLoading(true);
    try {
      const res = await deleteBeneficiary.requestInit(val);
      if (res?.data?.code === '00') {
        showSuccess(res?.data?.message as string);
        getBeneficiariesList();
      }
    } catch (error) {
    } finally {
      setLoading(false);
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
    getBeneficiariesList();
  }, []);

  useEffect(() => {
    setBeneficiaries_(beneficiaries?.data);
    setFilteredDataSource(beneficiaries?.data);
  }, [beneficiaries?.data]);

  useEffect(() => {
    dispatch(listBanks());
  }, []);

  return (
    <>
      <PageContainer>
        {
          <LoadingModal
            isVisible={loading}
            onBackdropPress={() => setLoading(true)}
            onBackButtonPress={() => setLoading(true)}
          />
        }
        <HeaderAuth headerTitle="Beneficiaries" noLogo />

        <YStack marginTop={32} flex={1}>
          <Input
            placeholder="Search Beneficiaries...."
            onChangeText={text => searchFilterFunction(text)}
            value={search}
          />

          <FlatList
            data={filteredDataSource}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            style={styles.flatlist}
            contentContainerStyle={{ flexGrow: 1 }}
            ListEmptyComponent={ListEmptyView}
            renderItem={({ item, index }) => (
              <BeneficiaryList
                onEdit={() => navigation.navigate('EditBeneficiary', { item })}
                onDelete={() => deleteBeneficiaryUser({ id: Number(item.id) })}
                key={index}
                item={item}
                len={filteredDataSource.length}
              />
            )}
          />
        </YStack>
      </PageContainer>
      <View style={styles.fixedView}>
        <CustomFab
          onPress={() => navigation.navigate('AddBeneficiary')}
          title="Add Beneficiary"
        />
      </View>
    </>
  );
};

export default Beneficiaries;

const styles = StyleSheet.create({
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
