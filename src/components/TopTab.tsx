import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, moderateScale } from '../theme/metrics';
import { useAppSelector } from '../hooks/hook';

type Tab = {
  id: number;
  title: string;
};

type TabProps = {
  activeTab: number;
  setActiveTab: (tabId: number) => void;
};

const tabs: Tab[] = [
  { id: 1, title: 'Own Account' },
  { id: 2, title: 'Rayyan Account' },
];

const TopTab: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              tab.id === activeTab && {
                ...styles.activeTab,
                borderBottomColor:
                  currentTheme === 'dark' ? colors.white : colors.userText,
              },
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={{
                ...styles.tabText,
                color:
                  currentTheme === 'dark'
                    ? colors.white
                    : colors.semiLightTextColor,
              }}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    padding: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.userText, // Customize the active tab indicator color
  },
  tabText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    fontStyle: 'normal',
    color: colors.semiLightTextColor,
    textTransform: 'capitalize',
  },
});

export default TopTab;
