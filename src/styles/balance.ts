import { StyleSheet } from 'react-native';

const balanceStyles = () => {
  const styles = StyleSheet.create({
    amount: {
      fontFamily: 'Inter-ExtraBold',
      color: '#fff',
      fontSize: 32,
      paddingHorizontal: 2,
    },
    decimal: {
      fontSize: 26,
      fontWeight: '400',
      fontFamily: 'Inter-SemiBold',
      color: 'rgba(255,255,255,.7)',
    },
  });

  return { styles };
};

export default balanceStyles;
