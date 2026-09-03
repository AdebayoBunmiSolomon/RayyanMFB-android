/**
 * App version constants
 * This file provides a simple way to get the app version without complex version checking
 */

// You can manually update this when you release new versions
export const APP_VERSION = '1.0.0';

// Alternative: Import from package.json at build time
// Note: This will be replaced during the build process
export const BUILD_VERSION = process.env.npm_package_version || APP_VERSION;

// Platform-specific version info
export const getVersionInfo = () => ({
  version: APP_VERSION,
  buildVersion: BUILD_VERSION,
  platform: 'react-native',
});
