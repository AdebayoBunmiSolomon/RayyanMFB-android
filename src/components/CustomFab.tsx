import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/metrics';
import { Text } from 'tamagui';
import { AddCircle } from 'iconsax-react-native';
import hexToRgbA from '../util/hexToRgbA';

interface CustomFabProps {
  onPress: () => void;
  title?: string;
}

const CustomFab: React.FC<CustomFabProps> = ({ onPress, title }) => {
  return (
    <TouchableOpacity style={styles.fabContainer} onPress={onPress}>
      <Text
        fontWeight="600"
        color={hexToRgbA(colors.white, 0.8)}
        fontSize={13}
        paddingLeft={5}
      >
        {title}
      </Text>
      <AddCircle
        variant="Bulk"
        size={26}
        color={hexToRgbA(colors.white, 0.6)}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 46,
    backgroundColor: colors.primary,
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // For Android shadow
  },
});

export default CustomFab;
