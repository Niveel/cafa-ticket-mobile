import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import client, { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./client";
import { API_BASE_URL } from "@/config/settings";
import { CurrentUser, LoginCredentials, SignupData, LoginResponse } from "@/types";
import * as Sentry from '@sentry/react-native';
import { captureAxiosContext, isAxios4xx, logAxiosError } from "@/utils/axiosError";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials, {
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
  const data = response.data;
  const accessToken = data?.tokens?.access || data?.access;
  const refreshToken = data?.tokens?.refresh || data?.refresh;

  if (!accessToken || !refreshToken) {
    const message =
      data?.message ||
      data?.error ||
      data?.detail ||
      (Array.isArray(data?.non_field_errors) ? data.non_field_errors[0] : data?.non_field_errors) ||
      "Login succeeded but token payload is invalid.";
    throw new Error(message);
  }

  // Store tokens
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);

  return {
    ...data,
    tokens: {
      access: accessToken,
      refresh: refreshToken,
    },
  };
}

export async function signup(data: SignupData): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/users/`, data);
  const result = response.data;

  // Store tokens
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, result.tokens.access);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.tokens.refresh);

  return result;
}

export async function logout(): Promise<void> {
  try {
    await client.post("/auth/logout/");
  } catch (error) {
    // Continue with local logout even if API fails
    logAxiosError("Logout API error", error);
    if (!isAxios4xx(error)) {
      Sentry.captureException(error, { extra: captureAxiosContext(error) });
    }
  } finally {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const response = await client.get("/auth/profile/");
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      return null;
    }

    logAxiosError("Error getting current user", error);
    if (!isAxios4xx(error)) {
      Sentry.captureException(error, { extra: captureAxiosContext(error) });
    }
    return null;
  }
}

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function forgotPassword(email: string) {
  try {
    // Djoser returns 204 No Content on success
    const response = await client.post("/auth/password/reset/", { email });
    return response.data;
  } catch (error) {
    logAxiosError("forgotPassword error", error);
    if (!isAxios4xx(error)) {
      Sentry.captureException(error, { extra: captureAxiosContext(error) });
    }
    throw error;
  }
}

export async function resetPassword(data: {
  uid: string;
  token: string;
  new_password: string;
}) {
  try {
    // Djoser returns 204 No Content on success
    const response = await client.post("/auth/password/reset/confirm/", data);
    return response.data;
  } catch (error) {
    logAxiosError("resetPassword error", error);
    if (!isAxios4xx(error)) {
      Sentry.captureException(error, { extra: captureAxiosContext(error) });
    }
    throw error;
  }
}
