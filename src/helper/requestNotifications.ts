import { Platform } from 'react-native';
import { RESULTS, requestNotifications } from 'react-native-permissions';

const isIos = () => Platform.OS === 'ios';
const isAndroid = () => Platform.OS === 'android';
const getPlatformVersion = () => Number(Platform.Version);

const requestNotificationsPermission = async (
  onGranted: () => void,
  onBlocked?: () => void,
) => {
  const { status } = await requestNotifications(['alert', 'sound', 'badge']);
  if (status === RESULTS.GRANTED) {
    onGranted();
  } else {
    onBlocked?.();
  }
};

/**
 * Sets up notifications permissions (for iOS or Android 13+).
 * Call this inside a component (e.g., in useEffect).
 */
export const setNotificationsHandler = (
  onGranted: () => void,
  onBlocked?: () => void,
) => {
  if (isIos() || (isAndroid() && getPlatformVersion() >= 33)) {
    requestNotificationsPermission(onGranted, onBlocked);
  }
};
