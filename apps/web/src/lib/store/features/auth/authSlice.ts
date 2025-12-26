import { IUser } from "@/schema/userSchema";
import { UserUpdateProfile } from "@/schema/UserUpdateProfileSchema";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  user: null | IUser;
  isAuthPreflightCompleted: boolean;
  token: {
    accessToken: string;
    expiresAt: number;
  };
}

const initialState: AuthState = {
  user: null,
  isAuthPreflightCompleted: false,
  token: {
    accessToken: "",
    expiresAt: 0,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<IUser>) {
      state.isAuthPreflightCompleted = true;
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      const token = action.payload;
      const parts = token.split(".");
      const payload = parts[1];
      if (!payload) throw new Error("Invalid JWT: missing payload");

      // Convert URL-safe Base64 to standard Base64
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      // Add padding if needed (Base64 strings must be multiples of 4)
      const padded = base64.padEnd(
        base64.length + ((4 - (base64.length % 4)) % 4),
        "=",
      );
      // Decode and parse
      const decoded = JSON.parse(atob(padded));

      state.token.accessToken = token;
      state.token.expiresAt = decoded.exp * 1000;
    },
    resetAccessToken(state) {
      state.token = {
        accessToken: "",
        expiresAt: 0,
      };
    },
    resetUser(state) {
      state.user = null;
    },
    setAuthPreflightCompleted(state, action: PayloadAction<true>) {
      state.isAuthPreflightCompleted = action.payload;
    },
    updateAuthUserProfile(state, action: PayloadAction<UserUpdateProfile>) {
      if (!state.user) return;
      if (state.user._id !== action.payload.userId) return;

      if (action.payload.updatedProfilePicture)
        state.user.profilePicture = action.payload.updatedProfilePicture;
      if (action.payload.updatedName)
        state.user.name = action.payload.updatedName;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setUser,
  resetUser,
  setAuthPreflightCompleted,
  updateAuthUserProfile,
  setAccessToken,
  resetAccessToken,
} = authSlice.actions;

export default authSlice.reducer;
