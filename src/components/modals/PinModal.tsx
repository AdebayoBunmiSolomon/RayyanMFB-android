import { StyleSheet } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import { global, horizontalScale, verticalScale } from '../../theme/metrics';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
  MaskSymbol,
  isLastFilledCell,
} from 'react-native-confirmation-code-field';
import { Text, View } from 'tamagui';
import { useTheme } from '../../context/ThemeContext';

interface RendererProps {
  index: number;
  symbol: any;
  isFocused: boolean;
}

interface PinModalProps {
  isVisible: boolean;
  onBackdropPress: () => void;
  onBackButtonPress: () => void;
  value: string;
  setValue: (val: string) => void;
}

const CELL_COUNT = 4;

const PinModal = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
  value,
  setValue,
}: PinModalProps) => {
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });

  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const { colors } = useTheme();

  const styles = StyleSheet.create({
    bottomModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },

    modal: {
      width: '90%',
      backgroundColor: colors.white,
      paddingHorizontal: horizontalScale(10),
      paddingTop: 32,
      paddingBottom: 52,
      borderRadius: 12,
    },

    codeFiledRoot: {
      paddingHorizontal: horizontalScale(40),
    },
    cell: {
      width: 56,
      height: 56,
      lineHeight: 55,
      fontSize: 16,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      color: colors.grey06,
      backgroundColor: colors.input,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    focusCell: {
      borderColor: colors.primary,
    },

    pinText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      fontStyle: 'normal',
      fontWeight: '600',
    },
  });

  const renderCell = ({ index, symbol, isFocused }: RendererProps) => {
    let textChild = null;

    if (symbol) {
      textChild = (
        <MaskSymbol
          maskSymbol="*"
          isLastFilledCell={isLastFilledCell({ index, value })}
        >
          {symbol}
        </MaskSymbol>
      );
    } else if (isFocused) {
      textChild = <Cursor />;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}
      >
        {textChild}
      </Text>
    );
  };
  return (
    <Modal
      avoidKeyboard
      propagateSwipe={true}
      style={styles.bottomModal}
      isVisible={isVisible}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}
    >
      <View style={styles.modal}>
        <View style={{ ...global.flexRow }}>
          <Text style={styles.pinText} color={colors.grey06}>
            Enter PIN
          </Text>
        </View>
        <View style={{ marginTop: verticalScale(24) }}>
          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={text => {
              setValue(text);
            }}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFiledRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={renderCell}
          />
        </View>
      </View>
    </Modal>
  );
};

export default PinModal;
