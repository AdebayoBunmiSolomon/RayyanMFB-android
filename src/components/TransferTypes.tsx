import React, { useEffect, useState } from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import { _transferTypes } from '../mock';
import { TouchableOpacity } from 'react-native';
import * as Icons from 'iconsax-react-native';
import CheckIcon from '../assets/svg/check-circle.svg';
import { TransferTypesProps } from '../types';
import { useTheme } from '../context/ThemeContext';

const TransferTypes = ({
  setSelected,
  selected,
  ...others
}: TransferTypesProps) => {
  const [selectedMethod, setSelectedMethod] = useState(0);

  const { colors } = useTheme();

  const handleSelected = (index: number) => {
    setSelected(index);
    setSelectedMethod(index);
  };

  useEffect(() => {
    setSelectedMethod(selected);
  }, [selected]);

  return (
    <View
      {...others}
      paddingBlock={32}
      borderBottomWidth={1}
      borderBottomColor={colors.borderColor}
    >
      <Text color={colors.grey06} fontSize={16} fontWeight="500">
        Transfer to
      </Text>
      <XStack marginTop={16} gap={16}>
        {_transferTypes?.map(({ id, title, icon }, index) => {
          const Icon = Icons[icon ?? 'Home'];
          const selected = selectedMethod === index;
          return (
            <TouchableOpacity
              key={id}
              style={{ flex: 1 }}
              onPress={() => handleSelected(index)}
            >
              <XStack
                justifyContent="space-between"
                borderRadius={16}
                borderWidth={1}
                borderColor={colors.primary}
                backgroundColor={
                  selected ? 'rgba(56, 168, 110, 0.1)' : colors.white
                }
                padding={12}
              >
                <YStack gap={12} alignItems="flex-start">
                  {/* icon */}
                  <View>
                    <Icon variant="Bulk" color={colors.primary} size={24} />
                  </View>
                  {/* heading */}

                  <Text
                    color={selected ? colors.primary : colors.grey04}
                    maxWidth={60}
                    fontWeight="500"
                    fontSize={14}
                  >
                    {title}
                  </Text>
                </YStack>
                {selected && (
                  <View>
                    <CheckIcon color={colors.primary} height={16} />
                  </View>
                )}
              </XStack>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </View>
  );
};

export default TransferTypes;
