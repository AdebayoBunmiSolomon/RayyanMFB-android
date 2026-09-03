declare module '@env' {
  export const BASE_URL: string;
  export const APP_TYPE: string;
  export const APP_ID: string;
  export const APP_NAME: string;
}

declare module '*.svg' {
  import * as React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}
