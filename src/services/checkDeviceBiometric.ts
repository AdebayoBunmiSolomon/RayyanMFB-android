import * as Keychain from 'react-native-keychain';

const checkDeviceBiometric = async () =>
  await TouchID.isSupported().then(
    (biometryType: string) => biometryType === 'FaceID',
  );

export default checkDeviceBiometric;
