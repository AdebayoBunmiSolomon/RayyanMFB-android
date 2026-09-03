import { createSlice } from '@reduxjs/toolkit';

export type Theme = 'light' | 'dark' | 'default';

interface ThemeState {
  currentTheme: Theme;
}

const initialState: ThemeState = {
  currentTheme: 'default',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, { payload }) => {
      state.currentTheme = payload;
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;
