import { Dimensions, StyleSheet } from 'react-native';
import { colors, moderateScale, verticalScale } from '../theme/metrics';

const screenWidth = Dimensions.get('window').width - 32;

const accountSlideStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    slideWrapper: {
      height: 270,
    },
    slide: {
      maxHeight: 200,
      flex: 1,
      width: screenWidth,
      borderRadius: moderateScale(16),
      paddingHorizontal: 22,
      paddingVertical: 20,
      marginTop: 8,
      overflow: 'hidden',
      backgroundColor: colors.primary,
    },
    accountType: {
      color: colors.secondary,
      fontFamily: 'Inter-Medium',
      fontSize: 14,
    },
    accountState: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    accountStatus: {
      backgroundColor: 'rgba(45, 193, 202, .1)',
      borderRadius: 16,
      paddingHorizontal: 8,
      paddingVertical: 2,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 4,
    },
    statusName: {
      fontSize: 12,
      color: '#fff',
      fontFamily: 'Inter-SemiBold',
    },
    statusColor: {
      width: 5,
      height: 5,
      borderRadius: 100,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: verticalScale(18),
    },
    accountBalance: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      height: 40,
      gap: 8,
    },
    amount: {
      fontFamily: 'Inter-ExtraBold',
      color: '#fff',
      fontSize: 28,
    },
    decimal: {
      fontSize: 22,
      fontWeight: '400',
      color: '#E9E9E9',
    },
    accountDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 28,
    },
    accountName: {
      fontFamily: 'Inter-Medium',
      color: '#ffff',
      fontSize: 14,
    },
    accountNumber: {
      flexDirection: 'row',
      gap: 5,
      alignItems: 'center',
    },
  });

  return { styles };
};

export default accountSlideStyles;
