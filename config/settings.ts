const isProduction = !__DEV__;

const PROD_API_URL = "https://api.cafatickets.com/api/v1";
const DEV_API_URL = "http://10.233.113.23:8000/api/v1";

// Prefer explicit build-profile URL when provided (EAS env per profile).
const PROFILE_API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const API_BASE_URL = PROFILE_API_URL || (isProduction ? PROD_API_URL : DEV_API_URL);
