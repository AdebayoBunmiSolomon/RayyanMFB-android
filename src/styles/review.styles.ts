import { StyleSheet } from 'react-native';
import colors from '../theme/color';

const reviewStyles = () => {
  const styles = StyleSheet.create({
    title: {
      fontSize: 16,
      fontFamily: 'Inter-Medium',
    },
    value: {
      fontSize: 16,
      maxWidth: '50%',
      textAlign: 'right',
      lineHeight: 22,
      fontFamily: 'Inter-Medium',
    },
    listRow: {
      borderBottomWidth: 1,
      minHeight: 36,
      alignItems: 'flex-start',
      marginBottom: 36,
    },
  });

  return { styles };
};

export default reviewStyles;
