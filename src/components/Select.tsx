/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SectionList,
} from 'react-native';
import { Spinner, Text, View, XStack, YStack } from 'tamagui';
import Input from './Input';
import { ArrowDown2, CloseSquare } from 'iconsax-react-native';
import { InputProps, SelectOption } from '../types';

import { useTheme } from '../context/ThemeContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import { useAppToast } from '../hooks/useAppToast';

// Define the prop types for the component
type CustomSelectInputProps = {
  value: string;
  onChange: (value: string) => void;
  data: SelectOption[];
  label?: string;
  loading?: boolean;
  popularItems?: string[]; // Array of strings (labels of popular options)
} & InputProps;

const Select: React.FC<CustomSelectInputProps> = ({
  onChange,
  data,
  loading,
  popularItems,
  ...others
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredData, setFilteredData] = useState<SelectOption[] | any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { colors } = useTheme();
  const { showError } = useAppToast();
  const { handleError } = useErrorHandler({ showToast: false, logError: true });

  const openModal = useCallback(() => {
    try {
      if (!data || data.length === 0) {
        showError('No options available to select');
        return;
      }
      setModalVisible(true);
    } catch (error) {
      console.error('Error opening modal:', error);
      handleError(error as Error, 'Select:openModal');
    }
  }, [data]);

  const closeModal = () => {
    try {
      setModalVisible(false);
      setSearchQuery(''); // Clear search when closing
    } catch (error) {
      console.error('Error closing modal:', error);
      handleError(error as Error, 'Select:closeModal');
    }
  };

  const groupData = useCallback(
    (items: SelectOption[]) => {
      try {
        if (!popularItems || popularItems.length === 0) {
          return items;
        }

        const popularSet = new Set(popularItems);
        const popular = items.filter(item => popularSet.has(item?.label));
        const otherItems = items.filter(item => !popularSet.has(item?.label));

        const sections = [];
        if (popular.length > 0) {
          sections.push({ title: 'Popular', data: popular });
        }
        if (otherItems?.length > 0) {
          sections.push({ title: 'Others', data: otherItems });
        }
        return sections;
      } catch (error) {
        console.error('Error grouping data:', error);
        handleError(error as Error, 'Select:groupData');
        return items;
      }
    },
    [popularItems],
  );

  const handleSearch = useCallback(
    (query: string) => {
      try {
        setSearchQuery(query);
        const lowerQuery = query.toLowerCase();

        // Filter items by label match
        const filtered =
          data?.filter(item =>
            item?.label?.toLowerCase()?.includes(lowerQuery),
          ) || [];

        // Always maintain same data structure as initial render
        if (popularItems && popularItems.length > 0) {
          const grouped = groupData(filtered);
          setFilteredData(grouped);
        } else {
          setFilteredData(filtered);
        }
      } catch (error) {
        console.error('Error handling search:', error);
        handleError(error as Error, 'Select:handleSearch');
      }
    },
    [data, popularItems, groupData],
  );

  useEffect(() => {
    try {
      if (!data || data.length === 0) {
        setFilteredData([]);
        return;
      }

      if (popularItems && popularItems?.length > 0) {
        setFilteredData(groupData(data));
      } else {
        setFilteredData(data);
      }
    } catch (error) {
      console.error('Error setting filtered data:', error);
      handleError(error as Error, 'Select:useEffect');
      setFilteredData(data || []);
    }
  }, [data, popularItems, groupData]);

  const handleSelect = (selectedValue: string | number) => {
    try {
      const stringValue = String(selectedValue);
      onChange(stringValue);
      closeModal();
    } catch (error) {
      console.error('Error selecting item:', error);
      handleError(error as Error, 'Select:handleSelect');
      showError('Failed to select option. Please try again.');
    }
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: { title: string; data: SelectOption[] };
  }) => (
    <View style={styles.sectionHeader} backgroundColor={colors.section}>
      <Text
        color={colors.grey04}
        fontFamily="Inter-Bold"
        fontSize={14}
        marginVertical={8}
      >
        {section?.title || 'Section'}
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: SelectOption; index: number }) => {
    try {
      return (
        <TouchableOpacity onPress={() => handleSelect(item?.value)}>
          <View
            height={50}
            justifyContent="center"
            borderBottomWidth={1}
            borderBottomColor={colors.borderColor}
            paddingHorizontal={16}
          >
            <Text color={colors.grey05} fontSize={14} fontFamily="Inter-Medium">
              {item?.label || 'Unknown Option'}
            </Text>
          </View>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering item:', error);
      handleError(error as Error, 'Select:renderItem');
      return null;
    }
  };

  // Memoize the selected value display
  const selectedLabel = useMemo(() => {
    try {
      return data?.find(item => item.value === others?.value)?.label || '';
    } catch (error) {
      console.error('Error finding selected label:', error);
      return '';
    }
  }, [data, others?.value]);

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoidingView}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={openModal}
          disabled={loading}
        >
          <Input
            pointerEvents="none"
            disabled={loading}
            onPressIn={openModal}
            endIcon={
              <TouchableOpacity disabled={loading} onPress={openModal}>
                {loading ? (
                  <Spinner size="small" />
                ) : (
                  <ArrowDown2 color={colors.grey05} size={20} />
                )}
              </TouchableOpacity>
            }
            {...others}
            value={selectedLabel}
          />
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalContent}
              backgroundColor={colors.background}
            >
              <XStack
                justifyContent="space-between"
                alignItems="center"
                height={60}
                borderColor={colors.borderColor}
                borderBottomWidth={1}
                paddingHorizontal={24}
              >
                <Text
                  color={colors.grey06}
                  fontFamily="Inter-SemiBold"
                  fontSize={16}
                >
                  Select an Option
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={styles.closeButton}
                >
                  <CloseSquare variant="Bulk" size={34} color={colors.grey06} />
                </TouchableOpacity>
              </XStack>

              <YStack padding={24}>
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChangeText={handleSearch}
                  autoFocus={false}
                  marginBottom={12}
                />

                {popularItems && popularItems.length > 0 ? (
                  <SectionList
                    showsVerticalScrollIndicator={false}
                    sections={filteredData as any[]}
                    keyExtractor={item => String(item.key)}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                  />
                ) : (
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={filteredData}
                    keyExtractor={item => String(item.key)}
                    renderItem={renderItem}
                  />
                )}
              </YStack>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    maxHeight: '90%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 120,
  },
  closeButton: {
    borderRadius: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: -1,
  },
});

export default Select;
