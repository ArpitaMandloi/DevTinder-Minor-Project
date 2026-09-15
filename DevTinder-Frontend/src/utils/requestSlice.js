import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: null,
  reducers: {
    addRequests: (state, action) => action.payload,
    addSingleRequest: (state, action) => {
      if (!Array.isArray(state)) return [action.payload];
      if (state.some((r) => r._id === action.payload._id)) return state;
      return [action.payload, ...state];
    },
    removeRequest: (state, action) => {
      if (!Array.isArray(state)) return [];
      return state.filter((request) => request._id !== action.payload);
    },
    removeRequests: () => null,
  },
});

export const {
  addRequests,
  addSingleRequest,
  removeRequest,
  removeRequests,
} = requestSlice.actions;

export default requestSlice.reducer;
