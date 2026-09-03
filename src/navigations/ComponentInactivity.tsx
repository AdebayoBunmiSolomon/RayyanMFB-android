/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import UserInactivity from 'react-native-user-inactivity';
import { setUserActivity } from '../slices/userInactivitySlice';
import PrivateNavigator from './PrivateNavigator';
import { useAppDispatch, useAppSelector } from '../hooks/hook';
import { logOutUser } from '../slices/authSlice';
import { setProfile } from '../slices/profileSlice';
import { useApi } from '../hooks/useApi';
import { Alert, BackHandler } from 'react-native';
import useDetectAppClose, { wasAppClosed } from '../hooks/detectAppTermination';

const ComponentInactivity = () => {
  const { requestInit } = useApi({ endpoint: 'getProfileInfo' });

  const dispatch = useAppDispatch();

  const {
    data: { firstName, lastName, username },
  } = useAppSelector(state => state.auth);

  const { isActive } = useAppSelector(state => state.userInactivity);

  // BYPASS INACTIVITY TIMER FOR DEVELOPMENT
  const [timer] = useState(30000); //! return

  const handleLogout = () => {
    const payload = {
      isLoggedIn: false,
      showSplash: false,
      message: '',
      data: {
        firstName: firstName,
        lastName: lastName,
        phoneNumber: '',
        email: '',
        token: '',
        username: username,
      },
    };
    dispatch(logOutUser(payload));
  };

  useEffect(() => {
    const getCustomerInfo = async () => {
      try {
        const res = await requestInit();
        if (res?.data?.code === '00') {
          dispatch(setProfile(res?.data?.data));
        }
      } catch (_error) {
        console.log('Error fetching customer info', _error);
      } finally {
      }
    };
    getCustomerInfo();
  }, []);

  const handleBackButtonPress = () => {
    // Show an alert or directly logout and exit
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit and log out?',
      [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'Yes', onPress: () => handleLogout() },
      ],
      { cancelable: false },
    );
    return true; // Prevent default back button behavior
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButtonPress,
    );

    return () => backHandler.remove();
  }, []);

  useDetectAppClose(); // Track when the app goes into the background

  useEffect(() => {
    const checkAppClosure = async () => {
      const closed = await wasAppClosed();
      if (closed && isActive) {
        // handleLogout();
      }
    };

    checkAppClosure();
  }, []);

  return (
    <UserInactivity
      isActive={isActive}
      timeForInactivity={timer}
      onAction={userIsActive => {
        dispatch(setUserActivity(userIsActive));
        if (!userIsActive) {
          handleLogout();
        }
      }}
    >
      <PrivateNavigator />
    </UserInactivity>
  );
};

export default ComponentInactivity;
