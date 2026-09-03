import { StyleSheet } from 'react-native';

const bulkTxnSummaryStyles = (theme: 'dark' | 'light') => {
  const styles = StyleSheet.create({
    container: {
      display: 'flex',
      alignItems: 'center',
    },
    header: {
      backgroundColor: '#BFE1AF',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      width: 'auto',
      marginHorizontal: 'auto',
    },
    heading: {
      color: '#188977',
      textAlign: 'center',
      fontWeight: '500',
      fontSize: 12,
    },
    summary: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    summaryText: {
      color: theme === 'dark' ? '#fff' : '#132E3A',
      fontSize: 11,
      fontWeight: '600',
    },
    // underline
    underline: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 0,
    },
    line: {
      width: '96.5%',
      height: 1,
      backgroundColor: '#1D9A6C',
      borderWidth: 0,
    },
    circle: {
      backgroundColor: '#1D9A6C',
      width: 6,
      height: 6,
      borderRadius: 50,
    },
  });
  return { styles };
};

export default bulkTxnSummaryStyles;
