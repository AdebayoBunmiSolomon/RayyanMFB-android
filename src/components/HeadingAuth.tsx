import React from 'react';
import { Text, YStack } from 'tamagui';
import { HeadingAuthProps } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Capitalize } from '../util/format';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

const HeadingAuth = ({
  title,
  subtitle,
  user,
  swap = true,
  ...others
}: HeadingAuthProps) => {
  const { colors } = useTheme();

  return (
    <YStack
      gap={spacing.component.gap.sm}
      marginTop={spacing.layout.section}
      flexDirection={swap ? 'column-reverse' : 'column'}
      {...others}
    >
      <Text
        style={{
          lineHeight: typography.bodyMedium.lineHeight,
          fontSize: typography.bodyMedium.fontSize,
          fontFamily: typography.bodyMedium.fontFamily,
          color: colors.textSecondary,
        }}
      >
        {subtitle} {Capitalize(user?.username ?? '')}
      </Text>

      <Text
        style={{
          fontWeight: '600',
          fontFamily: typography.h4.fontFamily,
          fontSize: typography.h4.fontSize,
          lineHeight: typography.h4.lineHeight,
          color: colors.textPrimary,
        }}
      >
        {title}
      </Text>
    </YStack>
  );
};

export default HeadingAuth;
