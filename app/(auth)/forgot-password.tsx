import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Yup from "yup";

import { Screen, AppText, AppForm, AppFormField, SubmitButton, FormLoader } from "@/components";
import { forgotPassword } from "@/lib/auth";
import colors from "@/config/colors";

const ForgotPasswordValidationSchema = Yup.object().shape({
    email: Yup.string()
        .required("Email is required")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Please enter a valid email address"),
});

type ForgotPasswordFormValues = {
    email: string;
};

const ForgotPasswordScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [resetEmail, setResetEmail] = useState("");

    const handleSubmit = async (values: ForgotPasswordFormValues) => {
        try {
            setIsLoading(true);

            await forgotPassword(values.email);

            setResetEmail(values.email);
            setEmailSent(true);
        } catch (error: any) {
            console.error("Forgot password error:", error);
            const errorMessage =
                error.response?.data?.email?.[0] ||
                error.response?.data?.detail ||
                error.response?.data?.error ||
                error.message ||
                "Failed to send reset email. Please try again.";
            Alert.alert("Error", errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendEmail = async () => {
        try {
            await forgotPassword(resetEmail);
            Alert.alert("Success", "New reset link sent! Please check your email inbox.");
        } catch (error: any) {
            console.error("Resend error:", error);
            Alert.alert("Error", "Failed to resend link. Please try again later.");
        }
    };

    return (
        <Screen>
            <FormLoader visible={isLoading} />

            <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                {/* Header */}
                <View className="flex-row items-center gap-4 px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.primary200, borderWidth: 1, borderColor: colors.accent + "4D" }}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="chevron-back" size={20} color="#fff" />
                    </TouchableOpacity>
                    <View className="flex-1">
                        <AppText styles="text-xl text-white font-nunbold">
                            Forgot Password
                        </AppText>
                        <AppText styles="text-sm text-white" style={{ opacity: 0.6 }}>
                            Reset your account password
                        </AppText>
                    </View>
                </View>

                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {!emailSent ? (
                        <View className="p-6">
                            {/* Icon Header */}
                            <View className="items-center mb-8">
                                <View
                                    className="w-20 h-20 rounded-2xl items-center justify-center mb-4"
                                    style={{ backgroundColor: colors.accent }}
                                >
                                    <Ionicons name="mail-outline" size={40} color={colors.white} />
                                </View>
                                <AppText styles="text-2xl text-white mb-2 text-center font-nunbold">
                                    Password Reset
                                </AppText>
                                <AppText
                                    styles="text-sm text-white text-center"
                                    style={{ opacity: 0.7, maxWidth: 300 }}
                                >
                                    Enter your email address and we'll send you a link to reset your password
                                </AppText>
                            </View>

                            {/* Form */}
                            <View
                                className="rounded-2xl p-6 border-2"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
                            >
                                <AppForm
                                    initialValues={{ email: "" }}
                                    onSubmit={handleSubmit}
                                    validationSchema={ForgotPasswordValidationSchema}
                                >
                                    <View className="gap-6">
                                        <AppFormField
                                            name="email"
                                            label="Email Address"
                                            placeholder="you@example.com"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                            icon="mail-outline"
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
                                                styles="text-xs text-white"
                                                style={{ opacity: 0.7 }}
                                            >
                                                💡 Enter the email address you used to create your account. We'll send you
                                                a secure link to reset your password.
                                            </AppText>
                                        </View>

                                        <SubmitButton title="Send Reset Link" />

                                        {/* Divider */}
                                        <View className="relative my-2">
                                            <View
                                                className="absolute inset-0 flex-row items-center"
                                                style={{ borderTopWidth: 1, borderColor: colors.accent + "4D" }}
                                            />
                                            <View className="flex-row justify-center">
                                                <View
                                                    className="px-4"
                                                    style={{ backgroundColor: colors.primary100 }}
                                                >
                                                    <AppText
                                                        styles="text-xs text-white"
                                                        style={{ opacity: 0.6 }}
                                                    >
                                                        Remember your password?
                                                    </AppText>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Back to Login Button */}
                                        <TouchableOpacity
                                            onPress={() => router.replace("/login")}
                                            className="py-4 px-6 rounded-xl items-center border-2"
                                            style={{ backgroundColor: colors.primary200, borderColor: colors.accent }}
                                            activeOpacity={0.8}
                                        >
                                            <AppText styles="text-sm text-white font-nunbold">
                                                Sign In Instead
                                            </AppText>
                                        </TouchableOpacity>
                                    </View>
                                </AppForm>
                            </View>
                        </View>
                    ) : (
                        <View className="p-6">
                            {/* Success Icon */}
                            <View className="items-center mb-6">
                                <View
                                    className="w-20 h-20 rounded-full items-center justify-center mb-4"
                                    style={{ backgroundColor: "#10b981" + "33" }}
                                >
                                    <Ionicons name="checkmark-circle" size={60} color="#34d399" />
                                </View>
                                <AppText styles="text-2xl text-white mb-2 text-center font-nunbold">
                                    Check Your Email
                                </AppText>
                                <AppText
                                    styles="text-sm text-white text-center mb-2"
                                    style={{ opacity: 0.7 }}
                                >
                                    We've sent a password reset link to
                                </AppText>
                                <AppText styles="text-base text-white text-center font-nunbold" style={{ color: colors.accent50 }}>
                                    {resetEmail}
                                </AppText>
                            </View>

                            {/* Instructions */}
                            <View
                                className="rounded-2xl p-6 border-2"
                                style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                            >
                                {/* Header */}
                                <View className="flex-row items-start gap-4 mb-6">
                                    <View
                                        className="w-12 h-12 rounded-xl items-center justify-center"
                                        style={{ backgroundColor: colors.primary200 + "80" }}
                                    >
                                        <Ionicons name="mail-outline" size={24} color={colors.accent50} />
                                    </View>
                                    <View className="flex-1">
                                        <AppText styles="text-base text-white mb-1 font-nunbold">
                                            Next Steps
                                        </AppText>
                                        <AppText
                                            styles="text-xs text-white"
                                            style={{ opacity: 0.6 }}
                                        >
                                            Follow these steps to reset your password
                                        </AppText>
                                    </View>
                                </View>

                                {/* Steps */}
                                <View className="gap-4">
                                    <View
                                        className="flex-row items-start gap-3 p-4 rounded-xl border"
                                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}
                                    >
                                        <View
                                            className="w-6 h-6 rounded-full items-center justify-center"
                                            style={{ backgroundColor: colors.accent }}
                                        >
                                            <AppText styles="text-xs text-white font-nunbold">
                                                1
                                            </AppText>
                                        </View>
                                        <View className="flex-1">
                                            <AppText styles="text-sm text-white mb-1 font-nunbold">
                                                Check your inbox
                                            </AppText>
                                            <AppText
                                                styles="text-xs text-white"
                                                style={{ opacity: 0.6 }}
                                            >
                                                Look for an email from Cafa Tickets with the subject "Password Reset
                                                Request"
                                            </AppText>
                                        </View>
                                    </View>

                                    <View
                                        className="flex-row items-start gap-3 p-4 rounded-xl border"
                                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}
                                    >
                                        <View
                                            className="w-6 h-6 rounded-full items-center justify-center"
                                            style={{ backgroundColor: colors.accent }}
                                        >
                                            <AppText styles="text-xs text-white font-nunbold">
                                                2
                                            </AppText>
                                        </View>
                                        <View className="flex-1">
                                            <AppText styles="text-sm text-white mb-1 font-nunbold">
                                                Click the reset link
                                            </AppText>
                                            <AppText
                                                styles="text-xs text-white"
                                                style={{ opacity: 0.6 }}
                                            >
                                                The link will take you to a secure page to set your new password
                                            </AppText>
                                        </View>
                                    </View>

                                    <View
                                        className="flex-row items-start gap-3 p-4 rounded-xl border"
                                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}
                                    >
                                        <View
                                            className="w-6 h-6 rounded-full items-center justify-center"
                                            style={{ backgroundColor: colors.accent }}
                                        >
                                            <AppText styles="text-xs text-white font-nunbold">
                                                3
                                            </AppText>
                                        </View>
                                        <View className="flex-1">
                                            <AppText styles="text-sm text-white mb-1 font-nunbold">
                                                Create a new password
                                            </AppText>
                                            <AppText
                                                styles="text-xs text-white"
                                                style={{ opacity: 0.6 }}
                                            >
                                                Choose a strong password and login with your new credentials
                                            </AppText>
                                        </View>
                                    </View>
                                </View>

                                {/* Security Notice */}
                                <View
                                    className="mt-6 p-4 rounded-xl border"
                                    style={{ backgroundColor: "#f59e0b" + "1A", borderColor: "#f59e0b" + "33" }}
                                >
                                    <AppText styles="text-xs" style={{ color: "#fbbf24" }}>
                                        🔒 <AppText styles="font-nunbold">Security Notice:</AppText> If you didn't request a
                                        password reset, please ignore this email. Your account remains secure.
                                    </AppText>
                                </View>

                                {/* Didn't Receive Email */}
                                <View
                                    className="mt-4 p-4 rounded-xl border"
                                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                                >
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                                        💡 <AppText styles="font-nunbold">Didn't receive the email?</AppText> Check your spam
                                        folder or{" "}
                                        <AppText
                                            styles="text-xs font-nunbold"
                                            style={{ color: colors.accent50 }}
                                            onPress={handleResendEmail}
                                        >
                                            request a new link
                                        </AppText>
                                    </AppText>
                                </View>

                                {/* Back to Login */}
                                <TouchableOpacity
                                    onPress={() => router.replace("/login")}
                                    className="mt-6 py-4 px-6 rounded-xl items-center"
                                    style={{ backgroundColor: colors.accent }}
                                    activeOpacity={0.8}
                                >
                                    <AppText styles="text-sm text-white font-nunbold">
                                        Back to Login
                                    </AppText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </ScrollView>
            </View>
        </Screen>
    );
};

export default ForgotPasswordScreen;