import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SignInUserResponse } from '../types/public.types';

const initialState: SignInUserResponse = {
  isLoggedIn: false,
  showSplash: true,
  data: {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    token: '',
    username: '',
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<SignInUserResponse>) => {
      state.isLoggedIn = payload.isLoggedIn;
      state.data = payload.data;
    },
    clearToken: state => {
      state.data.token = '';
      state.isLoggedIn = false; // optional: depends on your app logic
    },
    logOutUser: (state, { payload }: PayloadAction<SignInUserResponse>) => {
      return {
        ...state,
        ...payload,
      };
    },
    resetUser: () => initialState,
  },
});
export const { setUser, resetUser, logOutUser, clearToken } = authSlice.actions;

export default authSlice.reducer;
