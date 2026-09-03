import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserProfile } from '../types/settings.types';

const initialState: UserProfile = {
  bvn: '',
  email: '',
  firstName: '',
  lastName: '',
  phoneNumber: '',
  profileImage: '',
  userName: '',
  hasTransactionPin: undefined,
  userType: 'retail',
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile: (state, { payload }: PayloadAction<UserProfile>) => {
      state.email = payload.email;
      if (payload.userType) {
        state.userType = payload.userType;
      }
      state.profileImage = payload.profileImage;
      state.phoneNumber = payload.phoneNumber;
      state.firstName = payload.firstName;
      state.lastName = payload.lastName;
      state.userName = payload.userName;
      state.bvn = payload.bvn;
      state.hasTransactionPin = payload.hasTransactionPin;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
