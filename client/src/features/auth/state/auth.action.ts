import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import {
  loginApi,
  registerApi,
  getProfileApi,
  logoutApi,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  type ApiResponse,
} from "../api/auth.api";

// Helper to extract error message safely
const getErrorMessage = (error: unknown, fallback: string): string => {
  const axiosError = error as AxiosError<ApiResponse<null>>;
  return (
    axiosError?.response?.data?.message ||
    axiosError?.message ||
    fallback
  );
};

// ---------- Async Thunks ----------

export const loginUser = createAsyncThunk<
  AuthUser,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (credentials, thunkApi) => {
  try {
    const response = await loginApi(credentials, {
      signal: thunkApi.signal,
    });
    return response.data.data.user;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to sign in. Please check your credentials.")
    );
  }
});

export const registerUser = createAsyncThunk<
  AuthUser,
  RegisterPayload,
  { rejectValue: string }
>("auth/register", async (credentials, thunkApi) => {
  try {
    const response = await registerApi(credentials, {
      signal: thunkApi.signal,
    });
    return response.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to sign up. Please try again.")
    );
  }
});

export const getProfile = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/profile", async (_, thunkApi) => {
  try {
    const response = await getProfileApi({
      signal: thunkApi.signal,
    });
    return response.data.data;
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to restore session.")
    );
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/logout", async (_, thunkApi) => {
  try {
    await logoutApi({
      signal: thunkApi.signal,
    });
  } catch (error) {
    return thunkApi.rejectWithValue(
      getErrorMessage(error, "Unable to sign out cleanly.")
    );
  }
});

// Aliases for convenience / backward-compatibility
export const Login = loginUser;
export const Register = registerUser;
export const getMe = getProfile;
export const Logout = logoutUser;
