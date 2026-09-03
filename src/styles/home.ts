import { StyleSheet } from 'react-native';
import colors from '../theme/color';

const homeStyles = () => {
  const styles = StyleSheet.create({
    scroll: {
      height: '100%',
    },
    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },

    favText: {
      fontSize: 14,
      color: '#232525',
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
    },
    cameraGallery: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
    },

    centerColumn: { flexDirection: 'column', alignItems: 'center' },

    text_: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      fontWeight: '600',
      fontStyle: 'normal',
      color: colors.black,
      marginTop: 5,
    },

    imageView: {
      height: 136,
      width: 136,
    },

    modal: {
      width: '100%',
      height: 120,
      backgroundColor: colors.white,
      paddingHorizontal: 20,
      borderTopRightRadius: 23,
      borderTopLeftRadius: 23,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },

    features: {
      marginTop: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center', // Aligns the modal content at the bottom
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background for overlay
      padding: 16,
    },
    modalContent: {
      maxHeight: 250, // Set the height of the modal to half the screen
      height: '100%',
      borderRadius: 16,
      width: '90%',
    },
  });

  return { styles };
};

export default homeStyles;
