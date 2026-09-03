import React from 'react';
import { Text as TamaguiText, TextProps as TamaguiTextProps } from 'tamagui';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../theme/typography';

interface EnhancedTextProps extends Omit<TamaguiTextProps, 'style'> {
  variant?: keyof typeof typography;
  color?: string;
  align?: 'left' | 'center' | 'right' | 'justify';
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  lineHeight?: number;
  letterSpacing?: number;
  children: React.ReactNode;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
}

const EnhancedText: React.FC<EnhancedTextProps> = ({
  variant = 'bodyMedium',
  color,
  align = 'left',
  weight,
  size,
  lineHeight,
  letterSpacing,
  children,
  numberOfLines,
  ellipsizeMode = 'tail',
  selectable = false,
  onPress,
  onLongPress,
  ...props
}) => {
  const { colors } = useTheme();

  const getTextStyles = () => {
    const baseStyles = {
      ...typography[variant],
      textAlign: align,
      color: color || colors.textPrimary,
    };

    // Override with custom props if provided
    if (weight) baseStyles.fontWeight = weight;
    if (lineHeight) baseStyles.lineHeight = lineHeight;
    if (letterSpacing) baseStyles.letterSpacing = letterSpacing;

    // Size overrides
    if (size) {
      switch (size) {
        case 'xs':
          baseStyles.fontSize = 12;
          break;
        case 'sm':
          baseStyles.fontSize = 14;
          break;
        case 'md':
          baseStyles.fontSize = 16;
          break;
        case 'lg':
          baseStyles.fontSize = 18;
          break;
        case 'xl':
          baseStyles.fontSize = 20;
          break;
      }
    }

    return baseStyles;
  };

  const textStyles = getTextStyles();

  return (
    <TamaguiText
      style={textStyles}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      onPress={onPress}
      onLongPress={onLongPress}
      {...props}
    >
      {children}
    </TamaguiText>
  );
};

export default EnhancedText;
