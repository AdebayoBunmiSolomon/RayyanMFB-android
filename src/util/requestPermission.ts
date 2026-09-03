import { PermissionsAndroid, Platform } from 'react-native';

export const requestContactPermission = async () => {
  const APP_NAME = 'Rayyan';

  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: `${APP_NAME} Contacts Permission`,
          message: `${APP_NAME} needs access to your contacts to allow you to select a contact for airtime subscription.`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  // For iOS, permissions are handled via Info.plist
  return true;
};
