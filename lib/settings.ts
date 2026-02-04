import client from "./client";
import * as Sentry from '@sentry/react-native';

// =====================
// Security Settings
// =====================

export async function changePassword(data: {
    current_password: string;
    new_password: string;
    confirm_password: string;
}) {
    try {
        const response = await client.post("/auth/change-password/", data);
        return response.data;
    } catch (error) {
        console.error("changePassword error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function changeEmail(data: {
    new_email: string;
    password: string;
}) {
    try {
        const response = await client.post("/auth/update-email/", data);
        return response.data;
    } catch (error) {
        console.error("changeEmail error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function changeUsername(data: {
    username: string;
    password: string;
}) {
    try {
        const response = await client.post("/auth/change-username/", data);
        return response.data;
    } catch (error) {
        console.error("changeUsername error:", error);
        Sentry.captureException(error);
        throw error;
    }
}

export async function deleteAccount(data: {
    password: string;
    confirmation: string;
}) {
    try {
        const response = await client.delete("/auth/delete-account/", { data });
        return response.data;
    } catch (error) {
        console.error("deleteAccount error:", error);
        Sentry.captureException(error);
        throw error;
    }
}