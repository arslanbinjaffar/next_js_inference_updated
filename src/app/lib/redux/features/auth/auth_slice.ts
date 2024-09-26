// features/auth/authSlice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUser {
  UserId: string;
  account: string;
  userStatus: number;
  token: string;
  isAdmin: boolean;
}

const initialState: {
  userInfo: IUser;
  isInitialized: boolean;
} = {
  userInfo: {} as IUser,
  isInitialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    initialize: (_, action: PayloadAction<IUser>) => {
      return {
        userInfo: action.payload,
        isInitialized: true,
      };
    },

    logOut: () => {
      localStorage.removeItem("user_info");
      return {
        userInfo: {} as IUser,
        isInitialized: false,
      };
    },
  },
});

export const { initialize, logOut } = authSlice.actions;
export default authSlice.reducer;
