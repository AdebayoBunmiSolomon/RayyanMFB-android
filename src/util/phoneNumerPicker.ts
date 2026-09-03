import { Alert } from 'react-native';
import { requestContactPermission } from './requestPermission';
import { selectContactPhone } from 'react-native-select-contact';

const APP_NAME = 'Rayyan';

const pickContact = async () => {
  const hasPermission = await requestContactPermission();
  if (!hasPermission) {
    Alert.alert(
      `${APP_NAME} Permission`,
      'Cannot access contacts without permission. Please enable contacts access in settings.',
      [{ text: 'OK' }],
    );
    return;
  }

  try {
    const selection = await selectContactPhone();
    if (selection) {
      const { selectedPhone } = selection;
      return selectedPhone.number;
    } else {
      Alert.alert('No Contact Selected', 'You did not select any contact.');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default pickContact;
