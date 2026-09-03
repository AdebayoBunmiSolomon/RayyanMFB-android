import React from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface SimpleSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const SimpleSheet: React.FC<SimpleSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const { colors } = useTheme();
  const screenHeight = Dimensions.get('window').height;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: screenHeight * 0.9,
            minHeight: screenHeight * 0.5,
          }}
        >
          <View
            style={{
              height: 4,
              width: 40,
              backgroundColor: colors.borderColor,
              borderRadius: 2,
              alignSelf: 'center',
              marginTop: 8,
              marginBottom: 16,
            }}
          />
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default SimpleSheet;
