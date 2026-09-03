import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width - 76;

const accountActionStyles = () => {
  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      left: 22,
      bottom: 0,
      width: screenWidth,
      borderRadius: 12,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      paddingVertical: 14,
      // shadow
      shadowColor: 'rgba(249,249,249,.1)',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    service: {
      gap: 8,
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 12,
    },
    icon: {
      width: 54,
      height: 54,
      backgroundColor: 'rgba(22, 112, 118, 0.05)',
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 13,
      fontFamily: 'Inter-SemiBold',
    },
  });

  return { styles };
};

export default accountActionStyles;
