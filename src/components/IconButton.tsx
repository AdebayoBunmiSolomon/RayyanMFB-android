import { TouchableOpacity, TouchableOpacityProps } from 'react-native';
import React from 'react';
import iconButtonStyles from '../styles/iconButton';

const { styles } = iconButtonStyles();

const IconButton = ({ children, ...others }: TouchableOpacityProps) => {
  return (
    <TouchableOpacity style={styles.container} {...others}>
      {children}
    </TouchableOpacity>
  );
};

export default IconButton;
