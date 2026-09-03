import { FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SelectDataProps } from '../types';
import Input from './Input';
import { Text, View } from 'tamagui';
import SafeHighlightText from './SafeHighlightText';
import { hideSheet, setSelectedValue } from '../slices/appSlice';
import { useDispatch } from 'react-redux';
import { useTheme } from '../context/ThemeContext';

type SelectSheetContentProps = {
  data: SelectDataProps[] | undefined;
  title: string | undefined;
};

const SelectSheetContent = ({ data, title }: SelectSheetContentProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState<
    SelectDataProps[] | undefined
  >(undefined);

  const { colors } = useTheme();

  const dispatch = useDispatch();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    const filtered = data?.filter(item =>
      item.label.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  const handleClick = (value: string) => {
    dispatch(setSelectedValue(value));
    dispatch(hideSheet());
  };

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const renderItem = ({ item }: { item: SelectDataProps }) => (
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
          textToHighlight={item.label}
          style={{
            color: colors.grey05,
            fontSize: 14,
            fontFamily: 'Inter-Medium',
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View paddingInline={24} paddingBlock={16}>
      <Text
        textAlign="center"
        color={colors.grey06}
        marginBottom={18}
        fontFamily="Inter-SemiBold"
        fontSize={16}
      >
        Select {title}
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
        keyExtractor={item => item?.key?.toString?.()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default SelectSheetContent;
