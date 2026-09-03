import React from 'react';
import Feature from './Feature';
import { XStack } from 'tamagui';
import { Calendar2, StatusUp, Category2 } from 'iconsax-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';

const Features = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <XStack gap={18} alignItems="center" justifyContent="center">
      <Feature
        onPress={() => navigation.navigate('TransactionHistory')}
        title="History"
        icon={<Calendar2 variant="Bulk" size={28} color={colors.grey06} />}
        backgroundColor={colors.semiLightBackground}
        color={colors.grey06}
      />
      <Feature
        onPress={() => navigation.navigate('AccountInsight')}
        title="Insight"
        icon={<StatusUp variant="Bulk" size={28} color="#fff" />}
        borderColor={colors.semiLightBackground}
      />
      <Feature
        onPress={() => navigation.navigate('Menu')}
        title="More"
        icon={<Category2 variant="Bulk" size={28} color={colors.grey06} />}
        borderColor="#0D901A"
        backgroundColor={colors.whiteSmoke}
        color={colors.grey06}
      />
    </XStack>
  );
};

export default Features;
