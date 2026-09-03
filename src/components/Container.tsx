import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React from 'react';
import global from '../theme/global';
import MyStatusBar from './StatusBar';
import colors from '../theme/color';

interface IProps {
  children: React.ReactNode;
}

const Container: React.FC<IProps> = ({ children }) => {
  return (
    <SafeAreaView style={global.container}>
      <MyStatusBar
        barStyle="dark-content"
        backgroundColor={colors.lightBackground}
      />
      {children}
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({});
