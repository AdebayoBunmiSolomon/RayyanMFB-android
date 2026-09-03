// userInactivitySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInactivityState {
  isActive: boolean;
}

const initialState: UserInactivityState = {
  isActive: true, // Assume the user is initially active
};

const userInactivitySlice = createSlice({
  name: 'userInactivity',
  initialState,
  reducers: {
    setUserActivity: (state, action: PayloadAction<boolean>) => {
      state.isActive = action.payload;
    },
  },
});

export const { setUserActivity } = userInactivitySlice.actions;
export default userInactivitySlice.reducer;
