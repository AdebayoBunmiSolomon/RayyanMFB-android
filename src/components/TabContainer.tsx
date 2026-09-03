import { StyleSheet, SafeAreaView } from 'react-native';
import React from 'react';
import global from '../theme/global';

interface IProps {
  children: React.ReactNode;
}

const TabContainer: React.FC<IProps> = ({ children }) => {
  return (
    <SafeAreaView style={{ ...global.container }}>{children}</SafeAreaView>
  );
};

export default TabContainer;
