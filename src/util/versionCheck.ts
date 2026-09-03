import { Platform } from 'react-native';

/**
 * Safely gets the current app version using react-native-version-check
 * Falls back to 'unknown' if VersionCheck is not available
 */
export const getAppVersion = async (): Promise<string> => {
  try {
    // Try to import VersionCheck dynamically to avoid import errors
    let VersionCheck: any;

    try {
      VersionCheck = require('react-native-version-check');
    } catch (importError) {
      console.warn('Failed to import VersionCheck:', importError);
      return getFallbackVersion();
    }

    if (!VersionCheck) {
      console.warn('VersionCheck is not available');
      return getFallbackVersion();
    }

    // Try different possible method names for different versions
    if (typeof VersionCheck.getCurrentVersion === 'function') {
      try {
        const version = await VersionCheck.getCurrentVersion();
        if (version) return version;
      } catch (error) {
        console.warn('getCurrentVersion failed:', error);
      }
    }

    if (typeof VersionCheck.getCurrentVersionSync === 'function') {
      try {
        const version = VersionCheck.getCurrentVersionSync();
        if (version) return version;
      } catch (error) {
        console.warn('getCurrentVersionSync failed:', error);
      }
    }

    if (typeof VersionCheck.getVersion === 'function') {
      try {
        const version = await VersionCheck.getVersion();
        if (version) return version;
      } catch (error) {
        console.warn('getVersion failed:', error);
      }
    }

    // Try direct property access
    if (VersionCheck.currentVersion) {
      return VersionCheck.currentVersion;
    }

    if (VersionCheck.version) {
      return VersionCheck.version;
    }

    // If all else fails, use fallback
    console.warn('No known version method found on VersionCheck');
    return getFallbackVersion();
  } catch (error) {
    console.warn('Error getting app version:', error);
    return getFallbackVersion();
  }
};

/**
 * Gets a fallback version when VersionCheck is not available
 */
const getFallbackVersion = (): string => {
  // Return platform-specific fallback
  return Platform.OS === 'ios' ? 'iOS-unknown' : 'Android-unknown';
};

/**
 * Gets the app version synchronously (for cases where async is not needed)
 */
export const getAppVersionSync = (): string => {
  try {
    const VersionCheck = require('react-native-version-check');

    if (
      VersionCheck &&
      typeof VersionCheck.getCurrentVersionSync === 'function'
    ) {
      return VersionCheck.getCurrentVersionSync();
    }

    if (VersionCheck && VersionCheck.currentVersion) {
      return VersionCheck.currentVersion;
    }

    if (VersionCheck && VersionCheck.version) {
      return VersionCheck.version;
    }
  } catch (error) {
    console.warn('Failed to get version synchronously:', error);
  }

  return getFallbackVersion();
};
