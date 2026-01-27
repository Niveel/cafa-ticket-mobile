import axios from "axios";
import * as SecureStore from "expo-secure-store";

// http://192.168.1.192:8000/api/v1 - https://api.cafatickets.com/api/v1
export const API_BASE_URL = "http://10.181.154.23:8000/api/v1";
export const AUTH_TOKEN_KEY = "cafa_auth_token";
export const REFRESH_TOKEN_KEY = "cafa_refresh_token";

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor - attach token
client.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          await SecureStore.setItemAsync(AUTH_TOKEN_KEY, access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return client(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear tokens
        await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
