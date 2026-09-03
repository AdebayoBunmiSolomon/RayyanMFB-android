import { useEffect } from 'react';
import { AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const APP_CLOSED_FLAG = 'app_closed_flag';

const useDetectAppClose = () => {
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: string) => {
      if (nextAppState === 'background') {
        // Set flag only when going to background
        await AsyncStorage.setItem(APP_CLOSED_FLAG, 'true');
      } else if (nextAppState === 'active') {
        // Remove flag when app is reopened
        await AsyncStorage.removeItem(APP_CLOSED_FLAG);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);
};

// Check if the app was fully closed
export const wasAppClosed = async () => {
  const closedFlag = await AsyncStorage.getItem(APP_CLOSED_FLAG);
  return closedFlag === 'true';
};

// Reset the logout state when the user logs in
export const resetAppClosedFlag = async () => {
  await AsyncStorage.removeItem(APP_CLOSED_FLAG);
};

export default useDetectAppClose;
