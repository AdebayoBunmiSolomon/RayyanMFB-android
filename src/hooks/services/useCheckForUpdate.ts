import { useEffect, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import VersionCheck from 'react-native-version-check';
import { isUpdateRequired } from '../../util/compareAppversions';

export const useCheckForUpdate = () => {
  const [versionSheetVisible, setVersionSheetVisible] =
    useState<boolean>(false);
  const [updateUrl, setUpdateUrl] = useState<string | null>(null);

  const updateApp = () => {
    if (updateUrl) {
      Linking.canOpenURL(updateUrl)
        .then(supported => {
          if (supported) {
            Linking.openURL(updateUrl);
          } else {
            Alert.alert('Error', 'Unable to open the update URL.');
          }
        })
        .catch(_error => {
          Alert.alert('Error', _error?.toString());
        });
    }
  };

  const checkForUpdateAndShowSheet = async () => {
    try {
      // Get current version installed on the device
      const currentVersion = VersionCheck.getCurrentVersion();

      // Get the latest version from the App Store / Play Store
      const latestVersion = await VersionCheck.getLatestVersion({
        provider: Platform.OS === 'android' ? 'playStore' : 'appStore',
        packageName: 'com.rayyanmfb.app',
      });

      // Check if update is needed
      const updateNeeded = isUpdateRequired(currentVersion, latestVersion);

      if (updateNeeded) {
        const storeUrl = await VersionCheck.getStoreUrl({
          appID: Platform.OS === 'android' ? 'com.rayyanmfb.app' : '6463154681',
          //   packageName: 'com.rayyanmfb.app',
        });
        setVersionSheetVisible(true);
        setUpdateUrl(storeUrl);
        //   Platform.OS === 'ios'
        //     ? 'iOS Update Available'
        //     : 'Android Update Available',
        //   `A new version (${latestVersion}) is available. You are using version ${currentVersion}. Please update to continue.`,
        //   [
        //     {
        //       text: 'Update Now',
        //       onPress: () => {
        //         Linking.canOpenURL(updateNeeded.storeUrl).then(supported => {
        //           if (supported) {
        //             Linking.openURL(updateNeeded.storeUrl);
        //           }
        //         });
        //       },
        //     },
        //     { text: 'Later', style: 'cancel' },
        //   ],
        //   { cancelable: false },
        // );
      }
    } catch (_error) {
      Alert.alert('Error', _error?.toString());
    }
  };

  useEffect(() => {
    const initialCheck = async () => {
      await checkForUpdateAndShowSheet();
    };
    initialCheck();
  }, []);

  return {
    versionSheetVisible,
    updateApp,
  };
};
