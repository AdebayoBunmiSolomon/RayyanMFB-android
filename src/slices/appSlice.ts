import { createSlice } from '@reduxjs/toolkit';
import { SelectDataProps } from '../types';

type StateTypes = {
  showBalance: boolean;
  rememberLogin: boolean;
  sheet: {
    isVisible: boolean;
    data:
      | SelectDataProps[]
      | {
          options: SelectDataProps[];
          type: 'bill' | 'transfer';
          onPress?: (value: string | number) => void;
        }
      | [];
    type: string;
    title: string | undefined;
    selectedValue: string;
    rememberLogin: boolean;
  };
};

const initialState: StateTypes = {
  showBalance: false,
  rememberLogin: false,
  sheet: {
    isVisible: false,
    data: [],
    type: 'select',
    title: undefined,
    selectedValue: '',
    rememberLogin: false,
  },
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSelectedValue: (state, { payload }) => {
      state.sheet.selectedValue = payload;
      state.sheet.isVisible = false;
    },
    showSheet: (state, { payload }) => {

      state.sheet.isVisible = true;
      state.sheet.data = payload.data;
      state.sheet.title = payload.title;
      state.sheet.type = payload.type;

    },
    hideSheet: state => {
      state.sheet.isVisible = false;
      // state.sheet.data = [];
    },
    setShowBalance: (state, { payload }) => {
      state.showBalance = payload;
    },
    setRememberLogin: (state, { payload }) => {
      state.rememberLogin = payload;
    },
  },
});
export const {
  showSheet,
  hideSheet,
  setRememberLogin,
  setSelectedValue,
  setShowBalance,
} = appSlice.actions;

export default appSlice.reducer;
