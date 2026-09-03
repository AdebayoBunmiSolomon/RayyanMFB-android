import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StandingOrderResponse } from '../types/transfer.types';

type StandingOrderState = {
  data: StandingOrderResponse[];
};

const initialState: StandingOrderState = {
  data: [],
};

const standingOrderSlice = createSlice({
  name: 'standingOrder',
  initialState,
  reducers: {
    setStandingOrders(state, action: PayloadAction<StandingOrderResponse[]>) {
      state.data = action.payload;
    },
    clearStandingOrders(state) {
      state.data = [];
    },
  },
});

export const { setStandingOrders, clearStandingOrders } = standingOrderSlice.actions;
export default standingOrderSlice.reducer;