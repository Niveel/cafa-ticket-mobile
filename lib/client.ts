import axios, { AxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import * as Sentry from '@sentry/react-native';

import { API_BASE_URL } from "@/config/settings";

export const AUTH_TOKEN_KEY = "cafa_auth_token";
export const REFRESH_TOKEN_KEY = "cafa_refresh_token";

function logAxiosNetworkDiagnostics(error: any) {
    if (error?.response) return;

    const method = (error?.config?.method || "GET").toUpperCase();
    const requestUrl = error?.config?.url || "(unknown url)";
    const baseURL = error?.config?.baseURL || API_BASE_URL;
    const fullUrl =
        requestUrl.startsWith("http://") || requestUrl.startsWith("https://")
            ? requestUrl
            : `${baseURL}${requestUrl}`;

    console.error("[API Network Error]", {
        method,
        url: fullUrl,
        code: error?.code ?? null,
        message: error?.message ?? "Network Error",
        likelyCause:
            "No HTTP response received. This usually indicates connectivity, DNS, SSL/TLS, VPN, or backend reachability issues.",
    });
}

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
 * `bufferSeconds` (default 120 s / 2 mins).  The buffer keeps us safely ahead of the
 * clock-skew window so the server never sees an expired token.
 */
function isTokenExpiredOrExpiring(token: string, bufferSeconds = 120): boolean {
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true; // can't read exp → treat as expired
    return Math.floor(Date.now() / 1000) >= payload.exp - bufferSeconds;
}

// ---------------------------------------------------------------------------
// Refresh mutex
// ---------------------------------------------------------------------------
let refreshPromise: Promise<string> | null = null;

async function getRefreshedAccessToken(): Promise<string> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
        try {
            const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
            if (!refreshToken) throw new Error("no refresh token stored");

            // Web version uses /auth/jwt/refresh/
            const res = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
                refresh: refreshToken,
            });

            // Handle nested or root-level token extraction
            const access = res.data.tokens?.access || res.data.access;
            const refresh = res.data.tokens?.refresh || res.data.refresh;

            if (!access) {
                console.error("Refresh response missing access token:", res.data);
                Sentry.captureMessage("Refresh response missing access token", { extra: { data: res.data } });
                throw new Error("no access token in refresh response");
            }

            await SecureStore.setItemAsync(AUTH_TOKEN_KEY, access);

            if (refresh) {
                await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refresh);
            }

            return access as string;
        } finally {
            refreshPromise = null;
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
        } catch (error: any) {
            // Only clear tokens if the refresh token is explicitly invalid/expired (401/403)
            // If it's a network error (no status), we don't want to log the user out.
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY).catch(() => { });
                await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => { });
            } else {
                Sentry.captureException(error);
            }
            // Re-throw if we want specific requests to handle the absence of a token
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor ────────────────────────────────────────────────────
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error?.response) {
            logAxiosNetworkDiagnostics(error);
        }

        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Handle expired token that wasn't caught by the request interceptor
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccess = await getRefreshedAccessToken();
                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccess}`,
                };
                return client(originalRequest);
            } catch (refreshError: any) {
                const status = refreshError.response?.status;
                if (status === 401 || status === 403) {
                    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY).catch(() => { });
                    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(() => { });
                }
                Sentry.captureException(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default client;
