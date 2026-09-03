import { StyleSheet } from 'react-native';
import Sizes, { normalizeSize } from '../util/size';

const navbarStyles = () => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 4,
    },
    profileName: {
      marginLeft: 14,
      gap: 3,
    },
    username: {
      fontWeight: '700',
      fontSize: Sizes.fontLarge,
      fontFamily: 'Inter-Black',
    },
    greeting: {
      fontSize: 13,
      fontFamily: 'Inter-Medium',
    },
    rayyanLogo: {
      fontFamily: 'IvyMode-SemiBold',
      marginLeft: 'auto',
      fontSize: normalizeSize(40),
    },
  });

  return { styles };
};

export default navbarStyles;
