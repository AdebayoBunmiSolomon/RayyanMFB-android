/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  MainStackScreenProps,
  TabsStackParamList,
} from '../types/navigation.types';
import Home from '../screens/tabs/Home';
import Support from '../screens/tabs/Support';
import Settings from '../screens/tabs/Settings';
import {
  Home as HomeIcon,
  Messages1,
  NotificationBing,
  Setting2,
} from 'iconsax-react-native';
import { Platform, Text } from 'react-native';
import Notifications from '../screens/tabs/Notifications';
import { useTheme } from '../context/ThemeContext';

const Tab = createBottomTabNavigator<TabsStackParamList>();

const TabNavigator: FC<MainStackScreenProps<'Tabs'>> = () => {
  const { colors } = useTheme();

  return (
    <React.Fragment>
      <Tab.Navigator
        screenOptions={() => ({
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grey04,
          headerShown: false,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 95 : 80,
            paddingTop: 8,
            paddingHorizontal: 24,
            backgroundColor: colors.white,
          },
          tabBarLabelStyle: {
            fontWeight: '500',
            fontFamily: 'Inter-Medium',
          },
          tabBarItemStyle: {
            height: 53,
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: ({ color, focused }) => (
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  color: color,
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                  fontWeight: focused ? '600' : '400',
                }}
              >
                Home
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <HomeIcon
                variant={focused ? 'Bold' : 'Linear'}
                size={focused ? 25 : 24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Support"
          component={Support}
          options={{
            tabBarLabel: ({ color, focused }) => (
              <Text
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  color: color,
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                  fontWeight: focused ? '600' : '400',
                }}
              >
                Support
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Messages1
                variant={focused ? 'Bold' : 'Linear'}
                size={focused ? 25 : 24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Notifications"
          component={Notifications}
          options={{
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarLabel: ({ color, focused }) => (
              <Text
                numberOfLines={1}
                // eslint-disable-next-line react-native/no-inline-styles
                style={{
                  color: color,
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                  fontWeight: focused ? '600' : '400',
                }}
              >
                Notifications
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <NotificationBing
                variant={focused ? 'Bold' : 'Linear'}
                size={focused ? 25 : 24}
                color={color}
              />
            ),
          }}
        />

        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            tabBarLabel: ({ color, focused }) => (
              <Text
                style={{
                  color: color,
                  fontSize: 12,
                  fontFamily: 'Inter-Regular',
                  fontWeight: focused ? '600' : '400',
                }}
              >
                Settings
              </Text>
            ),
            tabBarIcon: ({ color, focused }) => (
              <Setting2
                variant={focused ? 'Bold' : 'Linear'}
                size={focused ? 25 : 24}
                color={color}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </React.Fragment>
  );
};

export default TabNavigator;
