import { Platform, StatusBar, StyleSheet } from 'react-native';
import {
  colors,
  global,
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../theme/metrics';
import Sizes from '../util/size';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;

const loginStyles = () => {
  const styles = StyleSheet.create({
    statusBar: {
      height: STATUSBAR_HEIGHT,
    },
    appBar: {
      backgroundColor: '#79B45D',
      height: APPBAR_HEIGHT,
    },
    container: {
      flex: 1,
    },
    content: {
      ...global.containerView,
      backgroundColor: colors.lightBackground,
    },
    main: {
      // ...global.containerView,
      flex: 1,
      backgroundColor: colors.lightBackground,
    },
    welcomeText: {
      fontSize: moderateScale(16),
      fontStyle: 'normal',
      fontWeight: '600',
      color: '#222831',
    },

    textInputWrapper: {
      borderWidth: 1,
      borderColor: colors.rgba20,
      height: 48,
      backgroundColor: colors.white,
      flexDirection: 'row',
      paddingHorizontal: 12,
      borderRadius: 6,
      overflow: 'hidden',
    },

    textInput: {
      borderWidth: 1,
      borderColor: colors.rgba20,
      padding: 0,
      height: verticalScale(54),
      backgroundColor: colors.white,
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(12),
      fontStyle: 'normal',
      fontWeight: '700',
      color: colors.black,
    },

    textInput_: {
      height: verticalScale(54),
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(12),
      fontStyle: 'normal',
      fontWeight: '700',
      color: colors.black,
      flex: 1,
    },

    error: {
      fontSize: moderateScale(10),
      fontFamily: 'Inter-Regular',
      fontWeight: '400',
      fontStyle: 'normal',
      color: colors.error,
      marginTop: verticalScale(5),
    },

    passwordInputView: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: -15,
      zIndex: -1,
    },

    showView: {
      flex: 0.1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: 3,
    },

    iconView: {
      flex: 0.1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },

    forgetText: {
      fontSize: 15,
      fontStyle: 'normal',
      fontWeight: '600',
      marginLeft: 'auto',
    },

    leftText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(11),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.textSecondary,
    },

    rightText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(11),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.appPrimary,
      marginLeft: horizontalScale(4),
    },

    baseLinks: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: verticalScale(10),
    },

    baseLinkText: {
      fontFamily: 'Inter-Regular',
      fontSize: moderateScale(9),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.appPrimary,
    },

    logoTextView: {
      position: 'absolute',
      bottom: 0,
      left: 20,
      right: 10,
    },

    logoText: {
      fontFamily: 'JosefinSans-Regular',
      fontSize: moderateScale(95),
      fontStyle: 'normal',
      fontWeight: '600',
      color: colors.primary,
    },
  });

  return { styles };
};

export default loginStyles;
