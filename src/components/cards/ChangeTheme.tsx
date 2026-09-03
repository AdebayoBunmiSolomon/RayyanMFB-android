import { TouchableOpacity } from 'react-native';
import React, { useMemo, useState } from 'react';
import { ColorSwatch, ArrowDown2 } from 'iconsax-react-native';
import { useDispatch } from 'react-redux';
import { YStack, XStack, Heading, Paragraph, View } from 'tamagui';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import { useAppSelector } from '../../hooks/hook';
import { _theme } from '../../mock';
import { setTheme } from '../../slices/themeSlice';
import { useTheme } from '../../context/ThemeContext';
import Sizes from '../../util/size';

const ChangeTheme = () => {
  const { currentTheme } = useAppSelector(state => state.theme);
  const { colors } = useTheme();

  const [openThemeOptions, setOpenThemeOptions] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<undefined | string>(
    currentTheme,
  );

  const dispatch = useDispatch();

  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: 'dark',
        label: 'Dark',
        value: 'dark',
      },
      {
        id: 'light',
        label: 'Light',
        value: 'light',
      },
      {
        id: 'default',
        label: 'System Default',
        value: 'default',
      },
    ],
    [],
  );

  const handleThemeChange = (value: string) => {
    setSelectedTheme(value);
    dispatch(setTheme(value));
  };

  return (
    <YStack
      backgroundColor={colors.input} // Dark background
      borderColor={colors.borderColor}
      borderRadius={Sizes.radiusLarge}
      borderWidth={1}
      gap={4}
    >
      {_theme?.map(({ id, title, subtitle }, index) => {
        return (
          <>
            <TouchableOpacity
              key={id}
              onPress={() => setOpenThemeOptions(prev => !prev)}
            >
              <XStack gap={14} alignItems="center" padding={16}>
                <ColorSwatch color={colors.primary} variant="Bulk" size={26} />
                <YStack gap={4}>
                  <Heading color={colors.grey06} fontWeight="600" fontSize={16}>
                    {title}
                  </Heading>
                  {subtitle && (
                    <Paragraph
                      fontSize={15}
                      numberOfLines={1}
                      color={colors.grey04}
                    >
                      {subtitle}
                    </Paragraph>
                  )}
                </YStack>
                <View
                  marginLeft="auto"
                  rotate={openThemeOptions ? '180deg' : '0deg'}
                >
                  <ArrowDown2 color={colors.grey06} size={18} />
                </View>
              </XStack>
            </TouchableOpacity>
            {index < _theme.length - 1 && (
              <View
                flex={1}
                borderColor={colors.borderColor}
                borderTopWidth={1}
                paddingInline={16}
              />
            )}
          </>
        );
      })}

      {openThemeOptions ? (
        <>
          <View borderTopWidth={1} borderColor={colors.borderColor} />
          <YStack alignItems="flex-start" padding={16}>
            <RadioGroup
              radioButtons={radioButtons}
              onPress={handleThemeChange}
              selectedId={selectedTheme}
              labelStyle={{
                color: colors.grey05,
                fontFamily: 'Inter-Medium',
              }}
              containerStyle={{
                borderColor: '#fff',
                alignItems: 'flex-start',
                gap: 4,
              }}
            />
          </YStack>
        </>
      ) : null}
    </YStack>
  );
};

export default ChangeTheme;
