import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../theme/metrics';
import { useAppSelector } from '../hooks/hook';
import { useTheme } from '../context/ThemeContext';

type Tab = {
  id: number;
  title: string;
};

type TabProps = {
  activeTab: number;
  setActiveTab: (tabId: number) => void;
};

const tabs: Tab[] = [
  { id: 1, title: 'Airtime' },
  { id: 2, title: 'Data' },
];

const AirtimeTabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const { colors } = useTheme();
  const { currentTheme } = useAppSelector(state => state.theme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tabItem: {
      padding: 4,
      height: verticalScale(41),
      width: horizontalScale(160),
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.appPrimary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    activeTab: {
      height: verticalScale(41),
      width: horizontalScale(160),
      backgroundColor:
        currentTheme === 'dark' ? colors.white : colors.darkBackground,
      borderWidth: 1,
      borderColor: colors.appPrimary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    tabText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      fontStyle: 'normal',
      fontFamily: 'Poppins',
      color: currentTheme === 'dark' ? colors.white : colors.black,
      textTransform: 'capitalize',
    },

    activeTabText: {
      fontSize: moderateScale(14),
      fontWeight: '500',
      fontStyle: 'normal',
      fontFamily: 'Poppins',
      color: currentTheme === 'dark' ? colors.black : colors.white,
      textTransform: 'capitalize',
    },
  });
  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, tab.id === activeTab && styles.activeTab]}
          onPress={() => setActiveTab(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              tab.id === activeTab && styles.activeTabText,
            ]}
          >
            {tab.title}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default AirtimeTabs;
