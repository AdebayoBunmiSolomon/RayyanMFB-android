import {
  Alert,
  BackHandler,
  Linking,
  LogBox,
  useColorScheme,
} from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import RNBootSplash from 'react-native-bootsplash';
import { Toaster } from 'sonner-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { persistor, store } from './src/stores/store';
import SwitchNavigator from './src/navigations/SwitchNavigator';
import VersionCheck from 'react-native-version-check';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './src/theme/tamagui.config';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GET, SAVE } from './src/services/storage';
import { ThemeProvider } from './src/context/ThemeContext';
// import ErrorBoundary from './src/components/ErrorBoundary';
import errorService from './src/services/errorService';
import { APP_VERSION } from './src/constants/appVersion';
import { useCallback, useEffect } from 'react';
import { disableFontScaling } from './src/util/disableFontScaling';

disableFontScaling();

LogBox.ignoreAllLogs(true);
export default function App() {
  const appearance = useColorScheme();

  const setAppTheme = useCallback(async () => {
    const IS_FIRST = await GET('IS_FIRST');
    if (IS_FIRST === null) {
      SAVE('Theme', appearance);
      SAVE('IsDefault', true);
      SAVE('IS_FIRST', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAppTheme();
  });

  useEffect(() => {
    const init = async () => {
      // Initialize app
    };

    init().finally(async () => {
      await RNBootSplash.hide({ fade: true });
    });
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    ); // Disable back button

    const checkVersion = async () => {
      try {
        const updateNeeded = await VersionCheck.needUpdate();

        if (updateNeeded?.isNeeded) {
          Alert.alert(
            'Update Required',
            'A new version of the app is available. Please update to continue using the app.',
            [
              {
                text: 'Update Now',
                onPress: async () => {
                  const url = updateNeeded.storeUrl;
                  const supported = await Linking.canOpenURL(url);
                  if (supported) {
                    Linking.openURL(url);
                    BackHandler.exitApp(); // Exit app after redirection
                  } else {
                    Alert.alert('Error', 'Unable to open the update URL.');
                  }
                },
              },
            ],
            { cancelable: false }, // Prevent dismissing the alert
          );
        } else {
          console.log('No update needed or app is up to date.');
        }
      } catch (error) {
        console.error('Update check failed:', error);
        Alert.alert(
          'Error',
          'Failed to check for updates. Please try again later.',
        );
      }
    };

    checkVersion();

    return () => backHandler.remove(); // Clean up back handler
  }, []);

  // Initialize error service
  useEffect(() => {
    // Set up error service with app version
    try {
      // Use the simple version constant instead of complex version checking
      errorService.setAppVersion(APP_VERSION);
    } catch (error) {
      console.warn('Failed to initialize error service with version:', error);
      errorService.setAppVersion('unknown');
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <ThemeProvider>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={'light'}>
            <PersistGate loading={null} persistor={persistor}>
              <RootSiblingParent>
                <SafeAreaProvider>
                  <SwitchNavigator />
                  <Toaster
                    position="top-center"
                    duration={3000}
                    theme="light"
                    visibleToasts={1}
                    richColors
                    offset={60}
                  />
                </SafeAreaProvider>
              </RootSiblingParent>
            </PersistGate>
          </TamaguiProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
