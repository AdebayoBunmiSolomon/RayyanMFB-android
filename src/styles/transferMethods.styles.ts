import { StyleSheet } from 'react-native';
import colors from '../theme/color';

const transferMethodStyles = () => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      minHeight: 80,
      borderRadius: 16,
      justifyContent: 'center',
      padding: 16,
      gap: 16,
    },
    icon: {
      width: 50,
      height: 50,
      backgroundColor: 'rgba(22, 112, 118, 0.05)',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: colors.grey06,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
    },
    subtitle: {
      color: colors.grey04,
      fontSize: 14,
      fontWeight: '400',
      fontFamily: 'Inter-Regular',
    },
    divider: {
      flex: 1,
      borderColor: '#ECECEC',
      borderTopWidth: 1,
    },
  });

  return { styles };
};

export default transferMethodStyles;
