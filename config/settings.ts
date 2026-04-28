import Constants from "expo-constants";

const isProduction = !__DEV__;

const PROD_API_URL = "https://api.cafatickets.com/api/v1";
const FALLBACK_DEV_API_URL = "http://10.223.110.23:8000/api/v1";

function getExpoHostIp(): string | null {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) return null;
    return hostUri.split(":")[0] || null;
}

function getDevApiUrl(): string {
    const explicitDevUrl = process.env.EXPO_PUBLIC_DEV_API_URL;
    if (explicitDevUrl) return explicitDevUrl;

    const explicitIp = process.env.EXPO_PUBLIC_PC_IP;
    if (explicitIp) return `http://${explicitIp}:8000/api/v1`;

    const expoHostIp = getExpoHostIp();
    if (expoHostIp) return `http://${expoHostIp}:8000/api/v1`;

    return FALLBACK_DEV_API_URL;
}

export const API_BASE_URL = isProduction ? PROD_API_URL : getDevApiUrl();
