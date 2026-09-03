import { TouchableOpacity } from 'react-native';
import React from 'react';
import * as Icons from 'iconsax-react-native';
import { YStack, XStack, Heading, Paragraph } from 'tamagui';
import { useTheme } from '../../context/ThemeContext';
import Sizes from '../../util/size';

type CardOptionProps = {
  title: string;
  subtitle: string;
  icon: keyof typeof Icons | null;
  onPress?: () => void;
};

const CardOption = ({ icon, title, subtitle, onPress }: CardOptionProps) => {
  const { colors } = useTheme();

  return (
    <YStack
      backgroundColor={colors.input} // Dark background
      borderColor={colors.borderColor}
      borderRadius={Sizes.radiusLarge}
      borderWidth={1}
      gap={4}
    >
      <TouchableOpacity onPress={onPress}>
        <XStack gap={14} alignItems="center" padding={16}>
          {icon}
          <YStack gap={4}>
            <Heading color={colors.grey06} fontWeight="600" fontSize={16}>
              {title}
            </Heading>

            <Paragraph numberOfLines={1} fontSize={15} color={colors.grey04}>
              {subtitle}
            </Paragraph>
          </YStack>
        </XStack>
      </TouchableOpacity>
    </YStack>
  );
};

export default CardOption;
