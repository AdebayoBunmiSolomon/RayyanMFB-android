import { styled, Button as ButtonCore } from 'tamagui';
import colors from '../theme/color';
import Sizes from '../util/size';
import { Platform } from 'react-native';

export const StyledButton = styled(ButtonCore, {
  name: 'Button',
  height: Platform.OS === 'ios' ? 50 : 48,
  fontFamily: 'Inter-SemiBold',
  fontSize: Sizes.fontLarge,
  fontWeight: '600',
  disabledStyle: {
    opacity: 0.4,
  },
  backgroundColor: colors.primary,
});
