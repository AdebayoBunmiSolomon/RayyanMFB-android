import { createFont, createTamagui, createTokens } from '@tamagui/core'; // or 'tamagui'

const tokens = createTokens({
  color: {
    primary: '#167076',
    secondary: '#761640',
    background: '#FFFFFF',
    text: '#232525',
  },
  fonts: {
    heading: 'Inter-Bold',
    body: 'Inter-Regular',
  },
  space: {},
  size: {},
  radius: {},
  zIndex: {},
});

const defaultFont = createFont({
  family: 'Inter-Regular',
  size: {
    1: 14,
    2: 18,
    3: 22,
  },
  lineHeight: {
    1: 15,
    2: 20,
  },
  weight: {
    4: '300',
    7: '600',
  },
  letterSpacing: {
    4: 0,
    7: -1,
  },
});

// you usually export this from a tamagui.config.ts file
const tamaguiConfig = createTamagui({
  tokens,
  font: {
    title: defaultFont,
    body: defaultFont,
  },
  themes: {
    dark: {
      background: '#000',
      color: '#fff',
    },
    light: {
      color: '#000',
      background: '#fff',
    },
  },
});

// make TypeScript type everything based on your config
type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  // or 'tamagui'
  interface TamaguiCustomConfig extends Conf {}
}

export default tamaguiConfig;
