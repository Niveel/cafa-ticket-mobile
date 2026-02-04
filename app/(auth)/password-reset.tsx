import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Yup from "yup";

import { Screen, AppText, AppForm, AppFormField, SubmitButton, FormLoader } from "@/components";
import { resetPassword } from "@/lib/auth";
import colors from "@/config/colors";

const PasswordResetValidationSchema = Yup.object().shape({
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("password")], "Passwords must match"),
});

type PasswordResetFormValues = {
    password: string;
    confirmPassword: string;
};

type ResetState = "form" | "success" | "error";

const PasswordResetScreen = () => {
    const { uid, token } = useLocalSearchParams<{ uid: string; token: string }>();
    const [status, setStatus] = useState<ResetState>("form");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [countdown, setCountdown] = useState(3);

    // Validate uid and token
    useEffect(() => {
        if (!uid || !token) {
            Alert.alert(
                "Invalid Link",
                "This password reset link is invalid or incomplete.",
                [
                    {
                        text: "Request New Link",
                        onPress: () => router.replace("/forgot-password"),
                    },
                ]
            );
        }
    }, [uid, token]);

    // Countdown timer for success state
    useEffect(() => {
        if (status === "success" && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);

            if (countdown === 1) {
                setTimeout(() => {
                    router.replace("/login");
                }, 1000);
            }

            return () => clearTimeout(timer);
        }
    }, [status, countdown]);

    const handleSubmit = async (values: PasswordResetFormValues) => {
        if (!uid || !token) {
            Alert.alert("Error", "Invalid reset link");
            return;
        }

        try {
            setIsLoading(true);
            setError("");

            await resetPassword({
                uid: uid as string,
                token: token as string,
                new_password: values.password,
            });

            setStatus("success");
        } catch (err: any) {
            console.error("Password reset error:", err);

            const errorMessage =
                err.response?.data?.new_password?.[0] ||
                err.response?.data?.uid?.[0] ||
                err.response?.data?.token?.[0] ||
                err.response?.data?.detail ||
                err.response?.data?.error ||
                err.message ||
                "Failed to reset password. The link may be invalid or expired.";

            setError(errorMessage);
            setStatus("error");
        } finally {
            setIsLoading(false);
        }
    };

    if (!uid || !token) {
        return null;
    }

    return (
        <Screen>
            <FormLoader visible={isLoading} />

            <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                {/* Header */}
                <View className="flex-row items-center gap-4 px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.replace("/login")}
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{
                            backgroundColor: colors.primary200,
                            borderWidth: 1,
                            borderColor: colors.accent + "4D",
                        }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <AppText styles="text-xl text-white font-nunbold">
                            Reset Password
                        </AppText>
                        <AppText styles="text-sm text-white" style={{ opacity: 0.6 }}>
                            Create a new password
                        </AppText>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {/* Form State */}
                    {status === "form" && (
                        <View className="p-6">
                            {/* Icon Header */}
                            <View className="items-center mb-8">
                                <View
                                    className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
                                    style={{ backgroundColor: colors.accent }}
                                >
                                    <Ionicons name="lock-closed-outline" size={40} color={colors.white} />
                                </View>
                                <AppText styles="text-2xl text-white mb-2 text-center font-nunbold">
                                    Set New Password
                                </AppText>
                                <AppText
                                    styles="text-sm text-white text-center"
                                    style={{ opacity: 0.7, maxWidth: 300 }}
                                >
                                    Choose a strong password for your account
                                </AppText>
                            </View>

                            {/* Form */}
                            <View
                                className="rounded-2xl p-6 border-2"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
                            >
                                {error && (
                                    <View
                                        className="p-4 rounded-xl mb-4 border"
                                        style={{ backgroundColor: "#ef4444" + "1A", borderColor: "#ef4444" + "33" }}
                                    >
                                        <AppText styles="text-sm" style={{ color: "#f87171" }}>
                                            {error}
                                        </AppText>
                                    </View>
                                )}

                                <AppForm
                                    initialValues={{
                                        password: "",
                                        confirmPassword: "",
                                    }}
                                    onSubmit={handleSubmit}
                                    validationSchema={PasswordResetValidationSchema}
                                >
                                    <View className="gap-6">
                                        <AppFormField
                                            name="password"
                                            label="New Password"
                                            placeholder="Enter new password"
                                            type={passwordVisible ? "text" : "password"}
                                            icon={passwordVisible ? "eye-off" : "eye"}
                                            iconClick={() => setPasswordVisible((prev) => !prev)}
                                            iconAria={passwordVisible ? "Hide password" : "Show password"}
                                            required
                                        />

                                        <AppFormField
                                            name="confirmPassword"
                                            label="Confirm New Password"
                                            placeholder="Confirm new password"
                                            type={confirmPasswordVisible ? "text" : "password"}
                                            icon={confirmPasswordVisible ? "eye-off" : "eye"}
                                            iconClick={() => setConfirmPasswordVisible((prev) => !prev)}
                                            iconAria={confirmPasswordVisible ? "Hide password" : "Show password"}
                                            required
                                        />

                                        <View
                                            className="p-4 rounded-xl border"
                                            style={{
                                                backgroundColor: colors.primary200 + "80",
                                                borderColor: colors.accent + "4D",
                                            }}
                                        >
                                            <AppText
                                                styles="text-xs text-white mb-2 font-nunbold"
                                                style={{ opacity: 0.8 }}
                                            >
                                                Password Requirements:
                                            </AppText>
                                            <View className="gap-1">
                                                <AppText
                                                    styles="text-xs text-white"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    • At least 8 characters long
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    • Mix of letters and numbers recommended
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    • Avoid common passwords
                                                </AppText>
                                            </View>
                                        </View>

                                        <SubmitButton title="Reset Password" />
                                    </View>
                                </AppForm>
                            </View>
                        </View>
                    )}

                    {/* Success State */}
                    {status === "success" && (
                        <View className="p-6">
                            <View className="items-center mb-6">
                                <View
                                    className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                    style={{ backgroundColor: "#10b981" + "33" }}
                                >
                                    <Ionicons name="checkmark-circle" size={60} color="#34d399" />
                                </View>
                                <AppText styles="text-2xl text-white mb-2 text-center font-nunbold">
                                    Password Reset Successful!
                                </AppText>
                                <AppText
                                    styles="text-sm text-white text-center"
                                    style={{ opacity: 0.7, maxWidth: 300 }}
                                >
                                    Your password has been changed successfully
                                </AppText>
                            </View>

                            <View
                                className="rounded-2xl p-6 border-2"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                            >
                                <View className="items-center">
                                    <AppText
                                        styles="text-sm text-white mb-4 text-center"
                                        style={{ opacity: 0.7 }}
                                    >
                                        You can now login with your new password. Redirecting you to login page in...
                                    </AppText>
                                    <View className="flex-row items-center gap-3 mb-6">
                                        <AppText styles="text-4xl font-nunbold" style={{ color: colors.accent }}>
                                            {countdown}
                                        </AppText>
                                        <AppText styles="text-sm text-white" style={{ opacity: 0.6 }}>
                                            {countdown === 1 ? "second" : "seconds"}
                                        </AppText>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() => router.replace("/login")}
                                        className="px-6 py-4 rounded-xl items-center w-full"
                                        style={{ backgroundColor: colors.accent }}
                                        activeOpacity={0.8}
                                    >
                                        <AppText styles="text-sm text-white font-nunbold">
                                            Go to Login Now
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Error State */}
                    {status === "error" && (
                        <View className="p-6">
                            <View className="items-center mb-6">
                                <View
                                    className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                    style={{ backgroundColor: "#ef4444" + "33" }}
                                >
                                    <Ionicons name="close-circle" size={60} color="#f87171" />
                                </View>
                                <AppText styles="text-2xl text-white mb-2 text-center font-nunbold">
                                    Password Reset Failed
                                </AppText>
                                <AppText
                                    styles="text-sm text-white text-center"
                                    style={{ opacity: 0.7, maxWidth: 300 }}
                                >
                                    We couldn't reset your password
                                </AppText>
                            </View>

                            <View
                                className="rounded-2xl p-6 border-2"
                                style={{ backgroundColor: colors.primary100, borderColor: "#ef4444" + "4D" }}
                            >
                                <View
                                    className="p-4 rounded-xl border mb-6"
                                    style={{ backgroundColor: "#ef4444" + "1A", borderColor: "#ef4444" + "33" }}
                                >
                                    <AppText styles="text-sm" style={{ color: "#f87171" }}>
                                        {error}
                                    </AppText>
                                </View>

                                <View className="mb-6">
                                    <AppText
                                        styles="text-xs text-white mb-3 text-center"
                                        style={{ opacity: 0.6 }}
                                    >
                                        Possible reasons:
                                    </AppText>
                                    <View className="gap-2">
                                        <AppText
                                            styles="text-xs text-white"
                                            style={{ opacity: 0.6 }}
                                        >
                                            • The reset link has expired
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            style={{ opacity: 0.6 }}
                                        >
                                            • The link has already been used
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            style={{ opacity: 0.6 }}
                                        >
                                            • The link is invalid or corrupted
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            style={{ opacity: 0.6 }}
                                        >
                                            • The password doesn't meet requirements
                                        </AppText>
                                    </View>
                                </View>

                                <View className="gap-3">
                                    <TouchableOpacity
                                        onPress={() => router.replace("/forgot-password")}
                                        className="py-4 px-6 rounded-xl items-center"
                                        style={{ backgroundColor: colors.accent }}
                                        activeOpacity={0.8}
                                    >
                                        <AppText styles="text-sm text-white font-nunbold">
                                            Request New Link
                                        </AppText>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => router.replace("/login")}
                                        className="py-4 px-6 rounded-xl items-center border-2"
                                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}
                                        activeOpacity={0.8}
                                    >
                                        <AppText styles="text-sm text-white font-nunbold">
                                            Back to Login
                                        </AppText>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Screen>
    );
};

export default PasswordResetScreen;