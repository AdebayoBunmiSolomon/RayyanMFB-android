import { Text, TextInput } from 'react-native';
import {
  Text as TamaguiText,
  Input,
  TextArea,
  Label,
  Paragraph,
  SizableText,
} from 'tamagui';

const components = [
  Text,
  TextInput,
  TamaguiText,
  Input,
  TextArea,
  Label,
  Paragraph,
  SizableText,
];

export function disableFontScaling() {
  for (const Component of components) {
    (Component as any).defaultProps = (Component as any).defaultProps || {};
    (Component as any).defaultProps.allowFontScaling = false;
  }
}
