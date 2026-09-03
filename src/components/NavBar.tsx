import React from 'react';
import navbarStyles from '../styles/navbar';
import { Avatar, Image, Text, View } from 'tamagui';
import { useAppSelector } from '../hooks/hook';
import getGreeting from '../util/greeting';
import { useTheme } from '../context/ThemeContext';
// import UserAvatar from 'react-native-user-avatar';
import { TouchableOpacity } from 'react-native';
import Placeholder from '../assets/img/user.jpg';

const { styles } = navbarStyles();

const NavBar = ({ profilePicUpdate, photo }: any) => {
  const { firstName, lastName } = useAppSelector(state => state.auth?.data);
  const { profileImage } = useAppSelector(state => state.profile);

  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={profilePicUpdate}>
        <Avatar circular size={44} borderWidth={0} marginTop={3}>
          <Avatar.Image
            width={'100%'}
            height={'100%'}
            objectFit="cover"
            src={photo ?? (profileImage as string) ?? Placeholder}
          />
          {/* Fallback image */}
          {/* <View
            justifyContent="center"
            alignItems="center"
            backgroundColor={colors.rgba10}
            width={44}
            height={44}
          >
            <Text
              color={colors.grey05}
              fontSize={13}
              fontFamily="Inter-Medium"
            >{`${firstName?.[0]}${lastName?.[0]}`}</Text>
          </View> */}
          {/* <Avatar.Fallback delayMs={600} backgroundColor={colors.input} /> */}
        </Avatar>
      </TouchableOpacity>
      {/* profile name and greeting */}
      <View style={styles.profileName}>
        <Text style={styles.greeting} color={colors.grey05}>
          {getGreeting()}
        </Text>
        <Text style={styles.username} color={colors.grey06}>
          {firstName} {lastName}
        </Text>
      </View>
      {/* rayyan logo */}
      <Text style={styles.rayyanLogo} color={colors.primary}>
        Rayyan
      </Text>
    </View>
  );
};

export default NavBar;
