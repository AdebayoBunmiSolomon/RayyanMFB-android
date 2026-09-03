/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';

import { InputProps } from '../types';
import StyledInput from '../styles/input';
import { Label, Text, View, XStack, YStack } from 'tamagui';
import { FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';

import { ArrowDown2, CloseSquare } from 'iconsax-react-native';
import LoadingModal from './modals/LoadingModal';
import { AirtimeCodes } from '../types/bills-payments.types';
import MTN from '../assets/svg/mtn.svg';
import Etisalat from '../assets/svg/9mobile.svg';
import Glo from '../assets/svg/glo.svg';
import Airtel from '../assets/svg/airtel.svg';
import detectNetworkProvider from '../util/detectProvider';

const networkProviders = [
  { name: 'MTN', icon: <MTN /> },
  { name: 'Airtel', icon: <Airtel /> },
  { name: '9Mobile', icon: <Etisalat /> },
  { name: 'Glo', icon: <Glo /> },
];

const InputPhone = ({
  children,
  endIcon,
  error,
  label,
  helperText,
  selectProvider,
  airtimeList,
  value,
  ...others
}: InputProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [providerName, setProviderName] = useState<undefined | string>(
    undefined,
  );
  const [modal, setModal] = useState(false);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const { colors } = useTheme();

  const handleSelect = (selectedValue?: number) => {
    selectedValue && selectProvider?.(selectedValue);
    closeModal();
  };

  useEffect(() => {
    if (value?.length === 11) {
      const newProviderName = detectNetworkProvider(value);
      const selectedProviderId = airtimeList?.find(
        ({ networkType }) => newProviderName === networkType,
      )?.id;
      selectedProviderId && selectProvider?.(selectedProviderId);
      return setProviderName(newProviderName);
    }
    setProviderName('');
  }, [value]);

  const renderItem = ({ item }: { item: AirtimeCodes }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          handleSelect(item.id);
          setProviderName(item.networkType);
        }}
      >
        <XStack
          height={50}
          alignItems="center"
          borderBottomWidth={1}
          borderBottomColor={colors.borderColor}
          gap={10}
        >
          <View borderRadius={100} overflow="hidden">
            {
              networkProviders.find(({ name }) => name === item.networkType)
                ?.icon
            }
          </View>
          <Text color={colors.grey05} fontSize={14} fontFamily="Inter-Medium">
            {item.networkType}
          </Text>
        </XStack>
      </TouchableOpacity>
    );
  };

  return (
    <YStack>
      <LoadingModal
        isVisible={modal}
        onBackdropPress={() => setModal(true)}
        onBackButtonPress={() => setModal(true)}
      />
      {/* label */}
      {label && (
        <Label
          color={colors.grey05}
          fontFamily="Inter-Medium"
          fontSize={14}
          marginBottom={12}
        >
          {label}
        </Label>
      )}
      <XStack position="relative">
        {/* icon left */}

        <TouchableOpacity
          style={{ position: 'relative', zIndex: 9999 }}
          onPress={openModal}
        >
          <View
            position="absolute"
            justifyContent="center"
            alignItems="center"
            width={30}
            height={30}
            left={28}
            bottom={12}
          >
            <XStack alignItems="center" gap={5}>
              <View borderRadius={100} width={28} height={28} overflow="hidden">
                {
                  networkProviders.find(({ name }) => name === providerName)
                    ?.icon
                }
              </View>
              <ArrowDown2 size={16} color={colors.grey04} />
              <View
                height={25}
                marginLeft={5}
                borderRightWidth={0.4}
                borderColor={colors.grey04}
              />
            </XStack>
          </View>
        </TouchableOpacity>

        <StyledInput
          borderColor={error ? colors.error : colors.inputBorder}
          flex={1}
          size={56}
          placeholderTextColor={colors.placeholder}
          backgroundColor={colors.input}
          color={colors.grey05}
          paddingLeft={85}
          value={value}
          {...others}
        >
          {children}
        </StyledInput>
        {/* icon right */}

        <View
          position="absolute"
          justifyContent="center"
          alignItems="center"
          width={30}
          height={30}
          right={15}
          bottom={12}
        >
          {endIcon}
        </View>
      </XStack>
      {/* error msg */}
      {error || helperText ? (
        <XStack
          marginTop={7}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {error ? (
            <Label fontSize={12} color={colors.error}>
              {error}
            </Label>
          ) : null}
          {helperText ? (
            <Label marginLeft="auto" fontSize={12} color={colors.grey05}>
              {helperText}
            </Label>
          ) : null}
        </XStack>
      ) : null}

      {/* Modal for displaying options (limited height and appears from bottom) */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent} backgroundColor={colors.background}>
            {/* Header for modal */}
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
                Select networ provider
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                style={{
                  ...styles.closeButton,
                }}
              >
                <CloseSquare variant="Bulk" size={34} color={colors.grey06} />
              </TouchableOpacity>
            </XStack>

            <YStack paddingHorizontal={24} paddingVertical={8}>
              {/* List of options */}
              <FlatList
                showsVerticalScrollIndicator={false}
                data={airtimeList}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
              />
            </YStack>
          </View>
        </View>
      </Modal>
    </YStack>
  );
};

// Add styles for better control over layout
const styles = StyleSheet.create({
  inputContainer: {
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Aligns the modal content at the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for overlay
  },
  modalContent: {
    maxHeight: 320, // Set the height of the modal to half the screen
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default InputPhone;
