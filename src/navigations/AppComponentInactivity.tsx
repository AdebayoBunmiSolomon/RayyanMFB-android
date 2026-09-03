import React, { useCallback, useEffect } from 'react';
import { View, Alert, BackHandler } from 'react-native';
import PrivateNavigator from './PrivateNavigator';
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import { useApi } from '../hooks/useApi';
import { setProfile } from '../slices/profileSlice';
import { logOutUser } from '../slices/authSlice';
import useDetectAppClose from '../hooks/detectAppTermination';
import { useInactivityTimer } from '../hooks/useInActivityTimer';

const AppComponentInactivity = () => {
  const { requestInit } = useApi({ endpoint: 'getProfileInfo' });
  const dispatch = useAppDispatch();

  const {
    data: { firstName, lastName, username },
  } = useAppSelector(state => state.auth);

  const handleLogout = useCallback(() => {
    dispatch(
      logOutUser({
        isLoggedIn: false,
        showSplash: false,
        message: '',
        data: {
          firstName,
          lastName,
          phoneNumber: '',
          email: '',
          token: '',
          username,
        },
      }),
    );
  }, [dispatch, firstName, lastName, username]);

  useEffect(() => {
    const getCustomerInfo = async () => {
      try {
        const res = await requestInit();
        if (res?.data?.code === '00') dispatch(setProfile(res?.data?.data));
      } catch (_error) {
        console.log('Error', _error);
      }
    };
    getCustomerInfo();
  }, []);

  // restored: hardware back button → confirm exit/logout
  useEffect(() => {
    const handleBackButtonPress = () => {
      Alert.alert(
        'Exit App',
        'Are you sure you want to exit and log out?',
        [
          { text: 'Cancel', onPress: () => null, style: 'cancel' },
          { text: 'Yes', onPress: handleLogout },
        ],
        { cancelable: false },
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );
    return () => backHandler.remove();
  }, []);

  useDetectAppClose(); // restored: track background/foreground for app-close detection

  const resetTimer = useInactivityTimer(60000, handleLogout);

  return (
    <View
      style={{ flex: 1 }}
      onTouchStart={resetTimer}
      onStartShouldSetResponderCapture={() => {
        resetTimer();
        return false;
      }}
    >
      <PrivateNavigator />
    </View>
  );
};

export default AppComponentInactivity;
