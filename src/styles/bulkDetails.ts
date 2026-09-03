import { StyleSheet } from 'react-native';
import colors from '../theme/color';

const bulkDetailStyles = (theme: 'dark' | 'light') => {
  const styles = StyleSheet.create({
    container: {
      marginTop: 24,
    },
    summary: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      marginBottom: 16,
      borderBottomWidth: 1,
      borderColor: '#1D9A6C',
    },
    name: {
      color: theme === 'dark' ? colors.whiteSmoke : colors.grey06,
      fontWeight: '500',
      fontFamily: 'Inter-Bold',
      fontSize: 13,
      lineHeight: 18,
    },
    account: {
      color: '#188977',
      fontSize: 12,
      marginTop: 2,
      fontWeight: '500',
    },
    narration: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 12,
      marginTop: 14,
      fontWeight: '500',
    },
    amount: {
      color: theme === 'dark' ? '#fff' : '#000',
      fontSize: 13,
      marginTop: 'auto',
      fontWeight: '500',
      marginLeft: 'auto',
    },
    actions: {
      marginLeft: 'auto',
      display: 'flex',
      marginBottom: 8,
      justifyContent: 'flex-end',
    },
    actionButton: {
      backgroundColor: '#fff',
      width: 28,
      height: 30,
      display: 'flex',
      justifyContent: 'flex-end',
      borderRadius: 2,
    },
    actionLabel: {
      fontSize: 8,
      color: '#000',
      fontWeight: '500',
      marginTop: 2,
    },
    floatButton: {
      display: 'flex',
      alignItems: 'center',
      marginLeft: 'auto',
      marginTop: 24,
      gap: 4,
    },
    floatIcon: {
      width: 40,
      height: 40,
      backgroundColor: '#1D9A6C',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
    },
    floatText: {
      color: theme === 'dark' ? '#fff' : '#000',
    },
  });
  return { styles };
};

export default bulkDetailStyles;
