import { FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectDataProps } from '../types';
import Input from './Input';
import { Text, View } from 'tamagui';
import SafeHighlightText from './SafeHighlightText';
import { hideSheet, setSelectedValue } from '../slices/appSlice';
import { useDispatch } from 'react-redux';
// import {useNavigation} from '@react-navigation/native';
// import CustomFab from './CustomFab';
import { useTheme } from '../context/ThemeContext';

type BeneficiarySheetContentProps = {
  data:
    | {
        options: SelectDataProps[];
        type: 'bill' | 'transfer';
        onPress?: (value: string | number) => void;
      }
    | undefined;
  title: string | undefined;
};

const BeneficiarySheetContent = ({
  data,
  title,
}: BeneficiarySheetContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<
    SelectDataProps[] | undefined
  >(undefined);

  const { colors } = useTheme();

  // const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (!data?.options) {
      setFilteredData([]);
      return;
    }

    const filtered = data.options.filter(item => {
      if (!item?.label) return false;
      return item.label.toLowerCase().includes(text.toLowerCase());
    });

    setFilteredData(filtered);
  };

  // const addNewBen = () => {
  //   // close sheet
  //   dispatch(hideSheet());

  //   navigation.navigate(
  //     data?.type === 'bill' ? 'AddBillBeneficiary' : 'AddBeneficiary',
  //   );
  // };

  const handleClick = (value: string | number) => {
    // Call the original onPress function if available
    if (data?.onPress) {
      data.onPress(value);
    } else {
      dispatch(setSelectedValue(String(value)));
    }

    dispatch(hideSheet());
  };

  useEffect(() => {
    setFilteredData(data?.options);
  }, [data]);

  const ListEmptyComponent = () => (
    <View padding={20} alignItems="center">
      <Text color={colors.grey05} fontSize={14}>
        No results found
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: SelectDataProps }) => {
    try {
      return (
        <TouchableOpacity onPress={() => handleClick(item.value)}>
          <View
            height={50}
            justifyContent="center"
            borderBottomWidth={1}
            borderBottomColor={colors.borderColor}
          >
            <SafeHighlightText
              highlightStyle={{ color: colors.lightPrimary }}
              searchWords={[searchQuery]}
              textToHighlight={item.label || ''}
              style={{
                color: colors.grey05,
                fontSize: 14,
                fontFamily: 'Inter-Medium',
              }}
            />
          </View>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering item:', error);
      return (
        <TouchableOpacity onPress={() => handleClick(item.value)}>
          <View
            height={50}
            justifyContent="center"
            borderBottomWidth={1}
            borderBottomColor={colors.borderColor}
          >
            <Text color={colors.grey05} fontSize={14} fontFamily="Inter-Medium">
              {item.label || 'Unknown'}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View paddingInline={24} paddingBlock={16} flex={1}>
      <Text
        textAlign="center"
        color={colors.grey06}
        marginBottom={18}
        fontFamily="Inter-SemiBold"
        fontSize={16}
      >
        {title}
      </Text>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChangeText={handleSearch}
        autoFocus={false}
      />
      <FlatList
        style={{ marginTop: 16, marginBottom: 120 }}
        data={filteredData}
        keyExtractor={(item, index) =>
          item?.key?.toString?.() || index.toString()
        }
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      {/* <TouchableOpacity
        style={{position: 'absolute', right: 40, bottom: 40}}
        onPress={addNewBen}>
        <View padding={14} backgroundColor={colors.primary} borderRadius={100}>
          <UserAdd color={colors.white} variant="Bulk" />
        </View>
      </TouchableOpacity> */}
      <View
        position="absolute"
        right={30}
        bottom={40}
        flexDirection="row"
        justifyContent="flex-end"
        padding={16}
      >
        {/* <CustomFab onPress={addNewBen} /> */}
      </View>
    </View>
  );
};

export default BeneficiarySheetContent;
