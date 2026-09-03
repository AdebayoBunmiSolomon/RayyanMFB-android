/* eslint-disable react-hooks/exhaustive-deps */
import { TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, XStack } from 'tamagui';
import ContactCard from './ContactCard';
import { SearchNormal1 } from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { showSheet } from '../slices/appSlice';
import { SelectDataProps } from '../types';
import { Beneficiaries } from '../types/transfer.types';
import { useAppSelector } from '../hooks/hook';
import { useTheme } from '../context/ThemeContext';
import { AddBillBeneficiary_ } from '../types/bills-payments.types';
import truncate from '../util/truncate';

export type BeneficiaryTypes = Beneficiaries & AddBillBeneficiary_;

type BeneficiaryScrollTypes = {
  contacts: BeneficiaryTypes[];
  type: 'bill' | 'transfer';
  onPress: any;
};

const BeneficiaryScroll = ({
  contacts,
  onPress,
  type,
}: BeneficiaryScrollTypes) => {
  const { colors } = useTheme();

  const [sheetData, setSheetData] = useState<SelectDataProps[] | undefined>(
    undefined,
  );

  const { selectedValue } = useAppSelector(state => state.app.sheet);

  const dispatch = useDispatch();

  const openSheet = () => {
    dispatch(
      showSheet({
        data: { options: sheetData, type, onPress },
        title: 'Beneficiaries',
        type: 'beneficiary',
      }),
    );
    return () => {
      dispatch(showSheet({ data: '', title: '', type: '', isVisible: false }));
    };
  };

  useEffect(() => {
    if (!Array.isArray(contacts)) {
      setSheetData([]);
      return;
    }

    let newContacts;

    if (type === 'transfer') {
      newContacts = contacts.map(({ accountName, id, institutionName }) => ({
        label: `${accountName ?? 'Unknown'} - ${institutionName ?? 'Unknown'}`,
        value: id ?? '',
        key: Number(id) || Math.floor(Math.random() * 100000), // Ensure key is a number
      }));
    } else {
      newContacts = contacts.map(
        ({ beneficiaryId, category, id }: AddBillBeneficiary_) => ({
          label: `${category ?? 'N/A'} - ${beneficiaryId ?? 'N/A'}`,
          value: beneficiaryId ? String(beneficiaryId) : '',
          key: typeof id === 'number' ? id : Math.floor(Math.random() * 100000),
        }),
      );
    }

    setSheetData(newContacts);
  }, [contacts, type]);

  useEffect(() => {
    selectedValue && onPress?.(selectedValue);
  }, [selectedValue]);

  return (
    <View marginBottom={12}>
      <Text color={colors.grey05} fontFamily="Inter-Medium">
        Beneficiaries
      </Text>
      <XStack alignItems="flex-start" marginTop={12}>
        <TouchableOpacity
          onPress={openSheet}
          style={{
            marginRight: 12,
          }}
        >
          <View
            marginTop={13}
            alignItems="center"
            justifyContent="center"
            width={65}
            height={65}
            maxHeight={65}
            flex={1}
            borderRadius={16}
            backgroundColor={colors.input}
          >
            <SearchNormal1 color={colors.primary} size={24} />
          </View>
          <Text textAlign="center" color={colors.grey06} marginTop={8}>
            Search
          </Text>
        </TouchableOpacity>
        <ScrollView
          width="100%"
          horizontal={true}
          contentContainerStyle={{ flexGrow: 1, paddingVertical: 16 }}
          showsHorizontalScrollIndicator={false}
        >
          {Array.isArray(contacts) &&
            contacts.map(
              ({
                accountName,
                id,
                category,
                beneficiaryId,
                beneficiaryBank,
                institutionName,
              }) => (
                <ContactCard
                  key={id ?? beneficiaryId} // fallback to beneficiaryId if id is missing
                  avatar={accountName ?? category ?? 'N/A'}
                  name={`${truncate(
                    accountName ?? beneficiaryId ?? 'Unknown',
                    15,
                  )}${
                    beneficiaryBank || institutionName
                      ? ` - (${institutionName ?? beneficiaryBank})`
                      : ''
                  }`}
                  id={id}
                  onPress={onPress}
                />
              ),
            )}
        </ScrollView>
      </XStack>
    </View>
  );
};

export default BeneficiaryScroll;
