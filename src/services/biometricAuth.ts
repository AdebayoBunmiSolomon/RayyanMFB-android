// runBiometricAuth.ts
import { Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();

// Module-scoped flag to prevent multiple prompts
let isAuthenticating = false;

/**
 * Prompts the user for biometric authentication and executes the provided callback on success.
 * Prevents multiple prompts from being shown too quickly.
 *
 * @param onAuthenticated A callback to run after successful authentication.
 * @param options Optional config to customize prompt and error handling.
 * @returns true if authentication succeeded, false otherwise.
 */
const runBiometricAuth = async (
  onAuthenticated: () => Promise<void> | void,
  options?: {
    promptMessage?: string;
    cancelButtonText?: string;
    showAlerts?: boolean;
  },
): Promise<boolean> => {
  if (isAuthenticating) {
    console.warn('Authentication already in progress');
    return false;
  }

  isAuthenticating = true;

  const {
    promptMessage = 'Authenticate',
    cancelButtonText = 'Cancel',
    showAlerts = true,
  } = options || {};

  try {
    const { available } = await rnBiometrics.isSensorAvailable();

    if (!available) {
      if (showAlerts) {
        Alert.alert(
          'Biometrics Not Available',
          'Your device does not support biometric authentication.',
        );
      }
      return false;
    }

    const { success } = await rnBiometrics.simplePrompt({
      promptMessage,
      cancelButtonText,
    });

    if (success) {
      await onAuthenticated?.();
      return true;
    } else {
      if (showAlerts) {
        Alert.alert(
          'Authentication Failed',
          'User cancelled or failed authentication.',
        );
      }
      return false;
    }
  } catch (error: any) {
    if (showAlerts) {
      Alert.alert(
        'Biometric Error',
        error?.message || 'An unexpected error occurred during authentication.',
      );
    } else {
      console.warn('Biometric error:', error);
    }
    return false;
  } finally {
    isAuthenticating = false;
  }
};

export default runBiometricAuth;
