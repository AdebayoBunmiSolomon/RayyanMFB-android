import { TouchableOpacity } from 'react-native';
import React from 'react';
import { Setting } from 'iconsax-react-native';
import { YStack, XStack, Heading, Paragraph } from 'tamagui';
import { useTheme } from '../../context/ThemeContext';
import Sizes from '../../util/size';
import { useNavigation } from '@react-navigation/native';

const Shortuts = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <YStack
      backgroundColor={colors.input} // Dark background
      borderColor={colors.borderColor}
      borderRadius={Sizes.radiusLarge}
      borderWidth={1}
      gap={4}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Shortcut')}>
        <XStack gap={14} alignItems="center" padding={16}>
          <Setting color={colors.primary} variant="Bulk" size={26} />
          <YStack gap={4}>
            <Heading color={colors.grey06} fontWeight="600" fontSize={16}>
              Shortcut Settings
            </Heading>

            <Paragraph numberOfLines={1} fontSize={15} color={colors.grey04}>
              Set up quick actions for easy access.
            </Paragraph>
          </YStack>
        </XStack>
      </TouchableOpacity>
    </YStack>
  );
};

export default Shortuts;
