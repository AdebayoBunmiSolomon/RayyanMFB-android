// // ThemeContext.tsx
// import React, {
//   createContext,
//   ReactNode,
//   useContext,
//   useEffect,
//   useState,
// } from 'react';
// import { darkColors, lightColors } from '../theme/color';
// import { useAppSelector } from '../hooks/hook';
// import { useColorScheme } from 'react-native';

// const themes = {
//   light: lightColors,
//   dark: darkColors,
// };

// interface ThemeProviderProps {
//   children: ReactNode; // ReactNode is the recommended type for children
// }

// type ThemeType = 'light' | 'dark';

// interface ThemeContextProps {
//   theme: ThemeType;
//   toggleTheme: () => void;
//   colors: typeof themes.light;
// }

// const ThemeContext = createContext<ThemeContextProps>({
//   theme: 'light',
//   toggleTheme: () => {},
//   colors: themes.light,
// });

// export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
//   const { currentTheme } = useAppSelector(state => state.theme);
//   const colorScheme = useColorScheme();

//   const initialTheme: ThemeType =
//     currentTheme === 'default'
//       ? (colorScheme as ThemeType)
//       : (currentTheme as ThemeType);

//   const [theme, setTheme] = useState<ThemeType>(initialTheme);

//   const toggleTheme = React.memo(() => {
//     setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
//   });

//   useEffect(() => {
//     if (currentTheme === 'default') {
//       setTheme(colorScheme as ThemeType);
//     } else {
//       setTheme(currentTheme as ThemeType);
//     }
//   }, [currentTheme, colorScheme]);

//   return (
//     <ThemeContext.Provider
//       value={{ theme, toggleTheme, colors: themes[theme] }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// export const useTheme = React.memo(() => useContext(ThemeContext));

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import { darkColors, lightColors } from '../theme/color';

import { useAppSelector } from '../hooks/hook';

import { useColorScheme } from 'react-native';

const themes = {
  light: lightColors,

  dark: darkColors,
};

interface ThemeProviderProps {
  children: ReactNode;
}

type ThemeType = 'light' | 'dark';

interface ThemeContextProps {
  theme: ThemeType;

  toggleTheme: () => void;

  colors: typeof themes.light;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',

  toggleTheme: () => {},

  colors: themes.light,
});

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { currentTheme } = useAppSelector(state => state.theme);

  const colorScheme = useColorScheme();

  const initialTheme: ThemeType =
    currentTheme === 'default'
      ? (colorScheme as ThemeType)
      : (currentTheme as ThemeType);

  const [theme, setTheme] = useState<ThemeType>(initialTheme);

  // ✅ useCallback, not React.memo

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    if (currentTheme === 'default') {
      setTheme(colorScheme as ThemeType);
    } else {
      setTheme(currentTheme as ThemeType);
    }
  }, [currentTheme, colorScheme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, colors: themes[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// ✅ just return the context – no memo here

export const useTheme = () => {
  return useContext(ThemeContext);
};
