import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuTypes } from '../types';

interface ShortcutState {
  selectedShortcuts: MenuTypes[];
}

const initialState: ShortcutState = {
  selectedShortcuts: [],
};

const shortcutSlice = createSlice({
  name: 'shortcut',
  initialState,
  reducers: {
    toggleShortcut: (state, action: PayloadAction<MenuTypes>) => {
      const exists = state.selectedShortcuts.find(
        item => item.name === action.payload.name,
      );

      if (exists) {
        state.selectedShortcuts = state.selectedShortcuts.filter(
          item => item.name !== action.payload.name,
        );
      } else if (state.selectedShortcuts.length < 3) {
        state.selectedShortcuts.push(action.payload);
      }
    },
  },
});

export const { toggleShortcut } = shortcutSlice.actions;
export default shortcutSlice.reducer;
