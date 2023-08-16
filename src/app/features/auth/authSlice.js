import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: localStorage.getItem("userId"),
  currentUserDisplayName: localStorage.getItem("firstName"),
  isAdmin: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      state.currentUser = action.payload;
    },

    setAdmin: (state, action) => {
      state.isAdmin = action.payload;
    },
  },
});

export const { loginUser, setAdmin } = authSlice.actions;

export default authSlice.reducer;
