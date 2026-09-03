// redux/slices/selectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchQuery: '',
  selectedValue: null,
  options: [
    { label: 'Nigeria', value: 'nigeria' },
    { label: 'United States', value: 'us' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Canada', value: 'canada' },
    { label: 'Germany', value: 'germany' },
    // Add more options here
  ],
};

const selectSlice = createSlice({
  name: 'select',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedValue(state, action) {
      state.selectedValue = action.payload;
    },
    setOptions(state, action) {
      state.options = action.payload;
    },
  },
});

export const { setSearchQuery, setSelectedValue, setOptions } =
  selectSlice.actions;
export default selectSlice.reducer;
