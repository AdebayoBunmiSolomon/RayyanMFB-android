import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import global from '../theme/global';

interface IProps {
  children: React.ReactNode;
  bgColor?: string;
}

const MainContainer: React.FC<IProps> = ({ children, bgColor }) => {
  return (
    <SafeAreaView style={{ ...global.containerView, backgroundColor: bgColor }}>
      {children}
    </SafeAreaView>
  );
};

export default MainContainer;
