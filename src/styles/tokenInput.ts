import { Dimensions, StyleSheet } from 'react-native';
import { normalizeSize } from '../util/size';

const { width: screenWidth } = Dimensions.get('window');
const CONTAINER_PADDING = 48; // adjust based on your Modal/View padding
const NUMBER_OF_CELLS = 6;
const SPACE_BETWEEN_CELLS = 0; // same as marginRight

const totalSpacing = (NUMBER_OF_CELLS - 1) * SPACE_BETWEEN_CELLS;
const availableWidth = screenWidth - CONTAINER_PADDING * 2 - totalSpacing;
const cellWidth = availableWidth / NUMBER_OF_CELLS;

const tokenInputStyles = (colors: any) => {
  const styles = StyleSheet.create({
    bottomModal: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    modal: {
      maxWidth: '90%',
      backgroundColor: colors.white,
      borderRadius: 12,
    },
    title: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.grey06,
      textAlign: 'center',
    },
    timer: {
      fontSize: 14,
      color: colors?.error,
      marginBottom: 20,
    },
    inputRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 10,
    },
    input: {
      width: 40,
      height: 50,
      borderBottomWidth: 2,
      borderColor: '#007bff',
      textAlign: 'center',
      fontSize: 22,
    },
    errorText: {
      color: colors.error,
      fontSize: 13,
    },
    buttonRow: {
      gap: 10,
    },
    cancelButton: {
      backgroundColor: '#ccc',
      padding: 12,
      borderRadius: 8,
    },
    submitButton: {
      backgroundColor: '#007bff',
      padding: 12,
      borderRadius: 8,
    },
    cancelText: {
      color: colors.grey05,
      fontWeight: '500',
      fontSize: 14,
    },
    submitText: {
      color: '#fff',
      fontWeight: '600',
    },
    resendButton: {
      marginTop: 20,
    },
    resendText: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    codeFieldRoot: {
      marginTop: 28,
    },
    cell: {
      width: cellWidth,
      height: 56,
      lineHeight: 55,
      fontSize: 16,
      borderRadius: normalizeSize(14),
      borderWidth: 1,
      borderColor: colors.inputBorder,
      backgroundColor: colors.input,
      color: colors.grey06,
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: SPACE_BETWEEN_CELLS,
    },
    focusCell: {
      borderColor: colors.primary,
    },
    cellText: {
      fontSize: 22,
      textAlign: 'center',
    },
  });
  return { styles };
};

export default tokenInputStyles;
