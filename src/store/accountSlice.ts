import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../lib/api";
import { setUser, fetchMe, setUserAvatar } from "./userSlice";
import { AccountState } from "../types";
import { AxiosError } from "axios";
import { AppDispatch } from ".";


const initialState: AccountState = {
  profileLoading: false,
  emailLoading: false,
  passwordLoading: false,
  uploadLoading: false,
  error: null,
  successMessage: null,
};

// Async Thunks
export const updateUserProfile = createAsyncThunk(
  "account/updateProfile",
  async (
    profileData: { fullName?: string; avatarUrl?: string; bio?: string },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await api.put("/account/profile", profileData);
      (dispatch as AppDispatch)(fetchMe()); // Dispatch fetchMe here
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to update profile.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const updateUserEmail = createAsyncThunk(
  "account/updateEmail",
  async (emailData: { email: string }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.put("/account/email", emailData);
      (dispatch as AppDispatch)(fetchMe()); // Dispatch fetchMe here
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to update email.";

      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
        // Check for MongoDB duplicate key error for email
        if (
          error.response?.data?.error &&
          typeof error.response.data.error === "string" &&
          error.response.data.error.includes("E11000 duplicate key error") &&
          error.response.data.error.includes("email_1")
        ) {
          message =
            "This email is already registered. Please use a different email address.";
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      return rejectWithValue(message);
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "account/changePassword",
  async (
    passwordData: { oldPassword: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put("/account/password", passwordData);
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to change password.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const uploadProfileImage = createAsyncThunk(
  "account/uploadProfileImage",
  async (imageData: FormData, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/upload/image", imageData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      dispatch(setUserAvatar(response.data.imageUrl)); // Update user avatar directly
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to upload image.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

export const fetchAccountProfile = createAsyncThunk(
  "account/fetchAccountProfile",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.get("/account/profile");
      dispatch(setUser(response.data));
      return response.data;
    } catch (error: unknown) {
      let message = "Failed to fetch account profile.";
      if (error instanceof AxiosError && error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return rejectWithValue(message);
    }
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update User Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.successMessage =
          action.payload.message || "Profile updated successfully!";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload as string;
      })
      // Update User Email
      .addCase(updateUserEmail.pending, (state) => {
        state.emailLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserEmail.fulfilled, (state, action) => {
        state.emailLoading = false;
        state.successMessage =
          action.payload.message || "Email updated successfully!";
      })
      .addCase(updateUserEmail.rejected, (state, action) => {
        state.emailLoading = false;
        state.error = action.payload as string;
      })
      // Change User Password
      .addCase(changeUserPassword.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.successMessage =
          action.payload.message || "Password changed successfully!";
      })
      .addCase(changeUserPassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload as string;
      })
      // Upload Profile Image
      .addCase(uploadProfileImage.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(uploadProfileImage.fulfilled, (state, action) => {
        state.uploadLoading = false;
        // state.successMessage =
        //   action.payload.message || "Profile image uploaded successfully!";
      })
      .addCase(uploadProfileImage.rejected, (state, action) => {
        state.uploadLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Account Profile
      .addCase(fetchAccountProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchAccountProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.successMessage =
          action.payload.message || "Account profile fetched successfully!";
      })
      .addCase(fetchAccountProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload as string;
      });
  },
});
export const { clearMessages } = accountSlice.actions;

export default accountSlice.reducer;
