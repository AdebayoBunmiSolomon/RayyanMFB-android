import React from 'react';
import { Switch as RNSwitch } from 'react-native';

const Switch = ({ ...others }: any) => {
  return (
    <RNSwitch
      trackColor={{ false: '#D9D9D9', true: '#74C67A' }}
      thumbColor={'#f4f3f4'}
      ios_backgroundColor="#D9D9D9"
      style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
      {...others}
    />
  );
};

export default Switch;
