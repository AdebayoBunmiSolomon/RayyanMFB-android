import { styled, Input as InputCore } from 'tamagui';
import Sizes, { normalizeSize } from '../util/size';
import { Platform } from 'react-native';

const StyledInput = styled(InputCore, {
  name: 'Input',
  height: Platform.OS === 'ios' ? 56 : 54,
  fontFamily: 'Inter-Medium',
  fontWeight: '500',
  fontSize: Sizes.fontLarge,
  padding: normalizeSize(18),
  borderRadius: normalizeSize(16),
  editable: true,
  selectTextOnFocus: false,
});

export default StyledInput;
