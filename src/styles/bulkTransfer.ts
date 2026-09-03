import { StyleSheet } from 'react-native';
import colors from '../theme/color';

const bulkTransferStyles = (theme: 'dark' | 'light') => {
  const styles = StyleSheet.create({
    divider: {
      borderTopWidth: 1,
      borderColor: colors.borderColor,
    },
    options: {
      marginTop: 24,
      display: 'flex',
      gap: 12,
    },
    option: {
      width: '100%',
      height: 58,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme === 'dark' ? '#fff' : colors.borderColor,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
    },
    optionText: {
      fontSize: 14,
    },
    rightArrow: {
      marginLeft: 'auto',
    },
  });
  return { styles };
};

export default bulkTransferStyles;
