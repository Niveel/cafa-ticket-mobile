import axios, { AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";

import { API_BASE_URL } from "@/config/settings";

export const AUTH_TOKEN_KEY = "cafa_auth_token";
export const REFRESH_TOKEN_KEY = "cafa_refresh_token";

// atob is globally available in Hermes (React Native 0.64+ / Expo SDK 48+).
function decodeJwtPayload(token: string): { exp?: number } | null {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

/**
 * Returns true when the token is already expired OR will expire within
 * `bufferSeconds` (default 60 s).  The buffer keeps us safely ahead of the
 * clock-skew window so the server never sees an expired token.
 */
function isTokenExpiredOrExpiring(token: string, bufferSeconds = 60): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true; // can't read exp → treat as expired
    return Math.floor(Date.now() / 1000) >= payload.exp - bufferSeconds;
}

// ---------------------------------------------------------------------------
// Refresh mutex
// ---------------------------------------------------------------------------
// Only one refresh call lives at a time.  Every caller that needs a fresh
// token while a refresh is already in-flight will await the *same* promise
// instead of firing its own request (which would burn the single-use refresh
// token and leave the other callers with a dead one).
let refreshPromise: Promise<string> | null = null;

async function getRefreshedAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise; // piggyback on the in-flight refresh

    refreshPromise = (async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (!refreshToken) throw new Error("no refresh token stored");

            const res = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
                refresh: refreshToken,
            });

            const { access, refresh } = res.data;

            await SecureStore.setItemAsync(AUTH_TOKEN_KEY, access);

            // Simple JWT only returns a new refresh token when
            // ROTATE_REFRESH_TOKENS is enabled — store it if present.
            if (refresh) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
            }

            return access as string;
        } finally {
            refreshPromise = null; // release the lock regardless of outcome
        }
    })();

    return refreshPromise;
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------
const client = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
});

// ── Request interceptor ─────────────────────────────────────────────────────
// Proactively refresh the access token *before* the request leaves the device.
// This eliminates the 401 → retry round-trip for the common case and, more
// importantly, ensures every concurrent request waits on the same single
// refresh instead of each one triggering its own.
client.interceptors.request.use(
    async (config) => {
        try {
            let token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY);

            if (token && isTokenExpiredOrExpiring(token)) {
                token = await getRefreshedAccessToken();
            }

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch {
            // Refresh failed (refresh token expired / revoked / network error).
            // Clear everything — the app's auth context will pick up the empty
            // tokens on its next check and route to login.
            await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY).catch(() => {});
            await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {});
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────────────────
// Safety net for anything the request interceptor couldn't catch (e.g. the
// server's clock is ahead of the device and rejects a token we thought was
// still valid).  Uses the same mutex, so it will never conflict with a
// proactive refresh that's already running.
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccess = await getRefreshedAccessToken();
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccess}`,
                };
                return client(originalRequest);
            } catch {
                await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY).catch(() => {});
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => {});
            }
        }

        return Promise.reject(error);
    }
);

export default client;