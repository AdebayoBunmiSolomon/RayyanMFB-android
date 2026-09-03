import React, { memo } from 'react';
import { StyledButton } from '../styles/button';
import { ButtonProps } from '../types';
import { Spinner } from 'tamagui';

import { useTheme } from '../context/ThemeContext';
import { Platform } from 'react-native';
import { normalizeSize } from '../util/size';

const Button = memo(
  ({ children, loading, variant, disabled, ...others }: ButtonProps) => {
    const { colors } = useTheme();

    return (
      <StyledButton
        size={Platform.OS === 'ios' ? 50 : 45}
        scaleSpace={0.4}
        backgroundColor={
          variant === 'outlined' ? 'transparent' : colors.primary
        }
        textProps={{
          color: variant === 'outlined' ? colors.primary : 'white',
        }}
        borderRadius={normalizeSize(16)}
        borderColor={variant === 'outlined' ? colors.borderColor : ''}
        borderWidth={variant === 'outlined' ? 1 : 0}
        disabled={loading || disabled}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        {...others}
        icon={loading ? <Spinner size="small" /> : undefined}
      >
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = 'Button';

export default Button;
