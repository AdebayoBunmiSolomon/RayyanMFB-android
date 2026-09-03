import { StyleSheet } from 'react-native';

const bottomTabsStyles = () => {
  const styles = StyleSheet.create({
    container: {
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
    },
    profileName: {
      marginLeft: 16,
      gap: 2,
    },
    username: {
      fontWeight: '700',
      fontSize: 16,
      fontFamily: 'Inter-Black',
      color: '#232525',
    },
    greeting: {
      color: '#636666',
      fontSize: 14,
      fontFamily: 'Inter-Medium',
    },
    rayyanLogo: {
      fontFamily: 'IvyMode-SemiBold',
      marginLeft: 'auto',
      fontSize: 35,
      color: '#167076',
    },
  });

  return { styles };
};

export default bottomTabsStyles;
