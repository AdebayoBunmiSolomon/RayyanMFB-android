import * as Keychain from 'react-native-keychain';

interface SetTouchFace {
  userName: string;
  passWord: string;
}

interface PinBiometrics {
  userName: string;
  pin: string;
  server: string;
}

export const storeCredentials = async ({
  userName,
  passWord,
}: SetTouchFace) => {
  await Keychain.setGenericPassword(userName, passWord);
};

export const getCredentials = async () => {
  const credentials = await Keychain.getGenericPassword({
    authenticationPrompt: {
      title: 'Authentication Required',
      subtitle: 'Please authenticate to proceed',
    },
  });
  return credentials;
};

export const clearStoredCredentials = async () => {
  try {
    await Keychain.resetGenericPassword();

  } catch (error) {

  }
};

export const storeInternetCredentials = async ({
  server,
  userName,
  pin,
}: PinBiometrics) => {
  await Keychain.setInternetCredentials(server, userName, pin);
};

export const getInternetCredentials = async (server: string) => {
  const credentials = await Keychain.getInternetCredentials(server);
  return credentials;
};
