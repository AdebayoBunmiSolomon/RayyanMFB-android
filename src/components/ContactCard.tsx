import React from 'react';
import { Avatar, Text, YStack } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import getAvatarName from '../util/getAvatarName';
import { useTheme } from '../context/ThemeContext';
import networkProviders from '../constants/networkLogos';

const ContactCard = ({ avatar, name, id, onPress }) => {
  const { colors } = useTheme();

  const provider = networkProviders.find(p =>
    avatar?.toLowerCase()?.includes(p?.name?.toLowerCase()),
  );

  const Icon = provider?.Icon;

  return (
    <TouchableOpacity onPress={() => onPress(id)}>
      <YStack marginRight={8} gap={8} width={80} alignItems="center">
        <Avatar
          circular
          size="$8"
          width={58}
          height={58}
          backgroundColor={colors.input}
          justifyContent="center"
          alignItems="center"
        >
          {Icon ? (
            <Icon width={58} height={58} />
          ) : (
            <Text color={colors.primary} fontSize={14} fontWeight="500">
              {getAvatarName(avatar ?? name)}
            </Text>
          )}
        </Avatar>
        <Text textAlign="center" color={colors.grey06}>
          {name}
        </Text>
      </YStack>
    </TouchableOpacity>
  );
};

export default ContactCard;
