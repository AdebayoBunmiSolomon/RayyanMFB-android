import React, { FC } from 'react';
import PageContainer from '../../../components/PageContainer';
import { MainStackScreenProps } from '../../../types/navigation.types';
import { TouchableOpacity } from 'react-native';
import { options } from '../../../mock/BulkTransfer';
import bulkTransferStyles from '../../../styles/bulkTransfer';
import { useAppSelector } from '../../../hooks/hook';
import RightCaret from '../../../assets/svg/right-caret.svg';
import HeaderAuth from '../../../components/HeaderAuth';
import { Text, View } from 'tamagui';
import { useTheme } from '../../../context/ThemeContext';
import * as Icons from 'iconsax-react-native';

const BulkTransfer: FC<MainStackScreenProps<'BulkTransfer'>> = ({
  navigation,
}) => {
  const { currentTheme } = useAppSelector(state => state.theme);
  const { styles } = bulkTransferStyles(currentTheme);

  const { colors } = useTheme();

  return (
    <PageContainer>
      <HeaderAuth noLogo headerTitle="Bulk Transfer" />

      {/* options */}
      <View style={styles.options}>
        {options?.map(({ id, icon, title, link, type, nested }) => {
          const iconProps: keyof typeof Icons | null = icon;
          const Icon = Icons[iconProps ?? 'Home'];

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(link, {
                  screenType: type,
                  nested,
                })
              }
            >
              <View
                key={id}
                style={{ ...styles.option, backgroundColor: colors.white }}
                borderColor={colors.borderColor}
              >
                <View
                  justifyContent="center"
                  alignItems="center"
                  width={40}
                  height={40}
                  borderRadius={100}
                  backgroundColor={colors.rgba10}
                >
                  <Icon
                    size={24}
                    color={colors.lightPrimary}
                    variant="Linear"
                  />
                </View>
                <Text
                  style={styles.optionText}
                  color={colors.grey05}
                  fontWeight={'500'}
                >
                  {title}
                </Text>
                <View style={styles.rightArrow}>
                  <RightCaret />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </PageContainer>
  );
};

export default BulkTransfer;
