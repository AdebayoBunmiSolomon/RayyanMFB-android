import React, { ComponentType, forwardRef } from 'react';
import {
  ActivityIndicator,
  Image as RNImage,
  ScrollView as RNScrollView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity,
  View as RNView,
} from 'react-native';

type BaseProps = { children?: React.ReactNode };

const createComponent = <P extends object>(
  Component: ComponentType<P>,
  defaultProps: Partial<P> = {},
) =>
  forwardRef<any, P>((props, ref) => (
    <Component ref={ref} {...(defaultProps as P)} {...props} />
  ));

export const View = createComponent(RNView);
export const Text = createComponent(RNText);
export const XStack = createComponent(RNView);
export const YStack = createComponent(RNView);
export const Stack = createComponent(RNView);
export const Paragraph = createComponent(RNText);
export const Heading = createComponent(RNText);
export const Label = createComponent(RNText);
export const ScrollView = createComponent(RNScrollView);
export const Image = createComponent(RNImage);
export const Avatar = createComponent(RNImage);
export const Input = createComponent(RNTextInput);
export const Spinner = createComponent(ActivityIndicator, {
  size: 'small',
});

export const Button = ({
  children,
  style,
  ...rest
}: BaseProps & React.ComponentProps<typeof TouchableOpacity>) => (
  <TouchableOpacity style={style} {...rest}>
    {typeof children === 'string' ? <RNText>{children}</RNText> : children}
  </TouchableOpacity>
);

export const TamaguiProvider = ({ children }: BaseProps) => <>{children}</>;

export const Theme = ({ children }: BaseProps) => <>{children}</>;

export const styled =
  <P extends object>(Component: ComponentType<P>) =>
  (props: P) =>
    <Component {...props} />;

export const createFont = () => ({});
export const createTokens = () => ({});
export const createTamagui = () => ({});

export default {
  View,
  Text,
  XStack,
  YStack,
  Stack,
  Paragraph,
  Heading,
  Label,
  ScrollView,
  Image,
  Avatar,
  Input,
  Spinner,
  Button,
  TamaguiProvider,
  Theme,
  styled,
  createFont,
  createTokens,
  createTamagui,
};


