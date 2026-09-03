import { StyleSheet } from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../theme/metrics';
import { fonts } from '../theme/typography';
import Sizes from '../util/size';

const otherBankStyles = (colors: any) => {
  const styles = StyleSheet.create({
    headerText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.semiLightTextColor,
    },
    scroll: { flexGrow: 1 },

    amountText: {
      fontFamily: 'JosefinSans-Regular',
      fontSize: moderateScale(8),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    freqText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(10),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.otpBorderColor,
    },

    findText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(10),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.semiLightTextColor,
    },

    beneficiariesView: {
      flexDirection: 'row',
      width: '100%',
      marginTop: verticalScale(16),
      height: verticalScale(70),
    },

    cardView: {
      marginRight: horizontalScale(3),
      alignItems: 'center',
      height: verticalScale(61),
      width: horizontalScale(65),
      backgroundColor: colors.lightBackground,
    },

    activeCardView: {
      backgroundColor: colors.semiLightTextColor,
    },

    initialsText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(13),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    nameText: {
      fontFamily: 'Poppins',
      fontSize: moderateScale(7),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    error: {
      fontSize: moderateScale(11),
      fontFamily: 'JosefinSans-Regular',
      fontWeight: '500',
      fontStyle: 'normal',
      color: colors.otpBorderColor,
      marginTop: verticalScale(5),
    },

    accountName: {
      fontFamily: 'JosefinSans-Regular',
      fontSize: Sizes.fontMedium,
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
      textTransform: 'capitalize',
    },

    selectContainer: {
      borderWidth: 1,
      borderColor: colors.black,
      borderRadius: moderateScale(5),
      padding: 10,
      height: 54,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },

    selectText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '500',
      // color: colors.otpBorderColor,
      height: 'auto',
      marginVertical: 'auto',
      color: colors.black,
      paddingHorizontal: 4,
    },

    inputContainer: {
      borderWidth: 1,
      borderColor: colors.black,
      borderRadius: moderateScale(5),
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: verticalScale(15),
      height: 54,
      marginBottom: 8,
    },
    label: {
      position: 'absolute',
      top: -10,
      left: 10,
      backgroundColor: colors.white,
      paddingHorizontal: 2,
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(10),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.userText,
    },

    input: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(13),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.black,
      padding: 8,
      flex: 1,
    },

    nairaText_: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '500',
      color: colors.otpBorderColor,
    },
  });
  return { styles };
};

export default otherBankStyles;
