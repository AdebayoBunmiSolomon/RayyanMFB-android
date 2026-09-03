import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Text, XStack } from 'tamagui';
import { Pressable } from 'react-native-gesture-handler';
import { CheckboxProps } from '../../types/ui.types';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const Checkbox = ({ value, setValue, label }: CheckboxProps) => {
  const { colors } = useTheme();

  const toggleValue = () => setValue(!value);

  return (
    <Pressable
      onPress={toggleValue}
      style={{ flexDirection: 'row', alignItems: 'center' }}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <XStack alignItems="center">
        <BouncyCheckbox
          fillColor={colors.primary}
          isChecked={value}
          size={19}
          innerIconStyle={{
            borderRadius: 5,
            borderColor: value ? colors.primary : colors.grey04,
          }}
          iconStyle={{ borderRadius: 5 }}
          onPress={newValue => setValue(newValue)}
          textComponent={
            typeof label === 'string' ? (
              <Text
                marginLeft={8}
                fontFamily="Inter-Regular"
                color={colors.grey04}
                fontSize={15}
              >
                {label}
              </Text>
            ) : (
              label
            )
          }
        />
      </XStack>
    </Pressable>
  );
};

export default Checkbox;
