import axios from "axios";
import * as SecureStore from "expo-secure-store";
import client, { AUTH_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./client";
import { API_BASE_URL } from "@/config/settings";
import { CurrentUser, LoginCredentials, SignupData, LoginResponse } from "@/types";

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/login/`, credentials); 
  const data = response.data;

  // Store tokens
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, data.tokens.access);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.tokens.refresh);

  return data;
}

export async function signup(data: SignupData): Promise<LoginResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/register/`, data);
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
    console.error("Logout API error:", error);
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
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  } catch (error) {
    return null;
  }
}

export async function forgotPassword(email: string) {
    try {
        // Djoser returns 204 No Content on success
        const response = await client.post("/auth/password/reset/", { email });
        return response.data;
    } catch (error) {
        console.error("forgotPassword error:", error);
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
        console.error("resetPassword error:", error);
        throw error;
    }
}

