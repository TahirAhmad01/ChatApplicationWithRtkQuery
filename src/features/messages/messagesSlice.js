import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {},
});

// eslint-disable-next-line no-empty-pattern
export const {} = messagesSlice.actions;
export default messagesSlice.reducer;
