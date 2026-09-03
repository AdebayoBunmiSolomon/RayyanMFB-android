/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { useAppSelector } from '../hooks/hook';
import PublicNavigator from './PublicNavigator';
// import ComponentInactivity from './ComponentInactivity';
import axiosInstance from '../api/axiosInstance';
import AppComponentInactivity from './AppComponentInactivity';

const SwitchNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  const {
    isLoggedIn,
    data: { token },
  } = useAppSelector(state => state.auth);

  useEffect(() => {
    // Set the token in Axios headers
    if (token) {
      axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
    }
  }, [token]);

  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? (
        <AppComponentInactivity />
      ) : (
        <PublicNavigator />
        // <View
        //   style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        // >
        //   <Text>Loaded from main app</Text>
        // </View>
      )}
    </NavigationContainer>
  );
};

export default SwitchNavigator;
