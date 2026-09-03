import { ArrowRight2 } from 'iconsax-react-native';
import React, { useState } from 'react';
import { Heading, Paragraph, Text, View, XStack, YStack } from 'tamagui';
import { Linking, TouchableOpacity, Image, Platform } from 'react-native';
import * as Icons from 'iconsax-react-native';
import { ListCardProps } from '../types';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import Modal from 'react-native-modal';
import AnimatedLottieView from 'lottie-react-native';
import Button from './Button';
import { ANDROID_APP_ID, IOS_APP_ID } from '../util';

const ListCard = ({ list, onItemPress, ...others }: ListCardProps) => {
  const { navigate } = useNavigation<any>();

  const [rateUsModal, setRateUsModal] = useState(false);

  const closeRateUsModal = () => {
    setRateUsModal(false);
  };

  const APP_STORE_LINK = `itms-apps://apps.apple.com/app/id${IOS_APP_ID}?action=write-review`;
  const PLAY_STORE_LINK = `market://details?id=${ANDROID_APP_ID}`;

  const STORE_LINK = Platform.select({
    ios: APP_STORE_LINK,
    android: PLAY_STORE_LINK,
  });

  const handlePressLink = (link?: string, key?: string, external?: boolean) => {
    if (key === 'rate') return setRateUsModal(true);
    link && external && Linking.openURL(link);
    link && !external && navigate(link);
  };

  const { colors } = useTheme();

  return (
    <>
      {rateUsModal && (
        <Modal
          avoidKeyboard
          propagateSwipe={true}
          isVisible={rateUsModal}
          onBackdropPress={closeRateUsModal}
          onBackButtonPress={closeRateUsModal}
          onSwipeComplete={closeRateUsModal}
          swipeDirection={'down'}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            width: '90%',
          }}
        >
          <YStack
            backgroundColor={colors.input}
            borderWidth={1}
            borderColor={colors.borderColor}
            borderRadius={16}
            width={'100%'}
            alignItems="center"
            padding={24}
          >
            <View
              width={150}
              height={150}
              marginTop={-16}
              overflow="hidden"
              justifyContent="center"
              alignItems="center"
            >
              <AnimatedLottieView
                source={require('../assets/json/stars.json')}
                autoPlay
                loop={false}
                style={{ height: 170, width: 170 }}
              />
            </View>
            <Text color={colors.grey06} fontWeight={'600'} fontSize={20}>
              Enjoying Rayyan?
            </Text>
            <Text
              lineHeight={20}
              color={colors.grey05}
              textAlign="center"
              maxWidth="90%"
              fontSize={16}
              marginTop={8}
            >
              If you enjoyed your experience we'd like you to tell others too.
              Would you like to rate us?
            </Text>
            <XStack gap={10} marginTop={24}>
              <Button
                flex={2}
                onPress={() => Linking.openURL(STORE_LINK as string)}
              >
                Rate Now
              </Button>
              <Button flex={1} variant="outlined" onPress={closeRateUsModal}>
                Later
              </Button>
            </XStack>
          </YStack>
        </Modal>
      )}
      <YStack gap={12} borderRadius={16} {...others}>
        {list.length &&
          list?.map(
            ({ id, title, subtitle, icon, link, key, img, external }) => {
              const iconProps: keyof typeof Icons | null = icon;
              const Icon = Icons[iconProps ?? 'Home'];
              return (
                <>
                  <TouchableOpacity
                    key={id}
                    onPress={() =>
                      onItemPress
                        ? onItemPress(id as unknown as string)
                        : handlePressLink(link, key, external)
                    }
                  >
                    <XStack
                      borderRadius={12}
                      gap={14}
                      alignItems="center"
                      padding={16}
                      backgroundColor={colors.white}
                    >
                      {img ? (
                        <Image
                          source={img}
                          style={{ width: 24, height: 24 }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Icon color={colors.primary} variant="Bulk" size={26} />
                      )}
                      <YStack gap={4}>
                        <Heading
                          color={colors.grey06}
                          fontWeight="600"
                          fontSize={15}
                        >
                          {title}
                        </Heading>
                        {subtitle && (
                          <View minWidth={'90%'}>
                            <Paragraph
                              maxWidth="90%"
                              fontSize={14}
                              color={colors.grey05}
                            >
                              {subtitle}
                            </Paragraph>
                          </View>
                        )}
                      </YStack>
                      <View marginLeft="auto">
                        <ArrowRight2 color={colors.grey06} size={18} />
                      </View>
                    </XStack>
                  </TouchableOpacity>
                </>
              );
            },
          )}
      </YStack>
    </>
  );
};

export default ListCard;
