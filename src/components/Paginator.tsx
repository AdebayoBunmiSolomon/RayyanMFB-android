import React from 'react';
import { StyleSheet } from 'react-native';
import { ExpandingDot } from 'react-native-animated-pagination-dots';
import { paginator } from '../types/paginator.types';
import { useTheme } from '../context/ThemeContext';

const Paginator = ({ data, scrollX }: paginator) => {
  const { colors } = useTheme();

  return (
    <ExpandingDot
      data={data}
      expandingDotWidth={25}
      activeDotColor={colors.primary}
      scrollX={scrollX}
      inActiveDotOpacity={0.6}
      inActiveDotColor="#E3E5E5"
      dotStyle={styles.dotStyles}
      containerStyle={styles.containerStyle}
    />
  );
};

const styles = StyleSheet.create({
  dotStyles: {
    width: 8,
    height: 4,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  containerStyle: {
    top: -10,
  },
});

export default Paginator;
