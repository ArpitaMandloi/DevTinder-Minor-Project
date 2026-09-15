import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: null,
  reducers: {
    addConnections: (state, action) => action.payload,
    addSingleConnection: (state, action) => {
      if (!Array.isArray(state)) return [action.payload];
      if (state.some((c) => c?._id === action.payload?._id)) return state;
      return [action.payload, ...state];
    },
    removeConnections: () => null,
  },
});

export const { addConnections, addSingleConnection, removeConnections } =
  connectionSlice.actions;

export default connectionSlice.reducer;
