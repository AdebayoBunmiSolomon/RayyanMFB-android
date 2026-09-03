import AsyncStorage from '@react-native-async-storage/async-storage';

export const SAVE_FCM_TOKEN = (data: string) => {
  AsyncStorage.setItem('token', data);
};

export const GET_FCM_TOKEN = async () => {
  const value = await AsyncStorage.getItem('token');
  return value || '';
};

export const GET_FCM_TOKEN_STATUS = async () => {
  const value = await AsyncStorage.getItem('isSavedFcm');
  return !!value;
};

export const SET_FCM_TOKEN_STATUS = async (value: any) => {
  AsyncStorage.setItem('isSavedFcm', value + '');
};

export const SAVE_P = (data: string) => {

  AsyncStorage.setItem('pin', data);
};

export const GET_P = async () => {
  const value = await AsyncStorage.getItem('pin');
  return value;
};

export const SAVE_STRING = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (error) {
    return false;
  }
};

export const SAVE = async (key: any, value: any) =>
  SAVE_STRING(key, JSON.stringify(value));

export const GET = async (key: string) => {
  try {
    const itemString = await AsyncStorage.getItem(key);
    if (itemString) {
      return JSON.parse(itemString);
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};
