import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import AppText from "@/components/ui/AppText";
import Screen from "../ui/Screen";
import colors from "@/config/colors";

interface EmailVerificationPromptProps {
    email: string;
}

const EmailVerificationPrompt = ({ email }: EmailVerificationPromptProps) => {
    return (
        <Screen statusBarStyle="dark-content" statusBarBg={colors.white}>
            <LinearGradient
                colors={[colors.primary, colors.primary200, colors.primary]}
                style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}
            />

            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-1 px-4 pt-12">
                    {/* Success Icon */}
                    <View className="items-center mb-6">
                        <View
                            className="w-20 h-20 rounded-full items-center justify-center"
                            style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
                        >
                            <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                        </View>
                    </View>

                    {/* Header */}
                    <View className="items-center mb-8">
                        <AppText
                            styles="text-3xl text-white text-center mb-3"
                            font="font-ibold"
                        >
                            Check Your Email
                        </AppText>
                        <AppText
                            styles="text-base text-slate-200 text-center mb-2"
                            font="font-iregular"
                        >
                            We've sent a verification link to
                        </AppText>
                        <AppText
                            styles="text-base text-center"
                            color="text-green-400"
                            font="font-isemibold"
                        >
                            {email}
                        </AppText>
                    </View>

                    {/* Instructions Card */}
                    <View className="bg-primary-100/80 rounded-3xl p-6 border-2 border-accent/30">
                        {/* Header Section */}
                        <View className="flex-row items-start gap-4 mb-6">
                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center"
                                style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                            >
                                <Ionicons name="mail" size={24} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <AppText
                                    styles="text-lg text-white mb-2"
                                    font="font-ibold"
                                >
                                    Next Steps
                                </AppText>
                                <AppText
                                    styles="text-sm text-slate-300"
                                    font="font-iregular"
                                >
                                    Follow these steps to activate your account
                                </AppText>
                            </View>
                        </View>

                        {/* Step 1 */}
                        <View className="flex-row items-start gap-3 p-4 bg-primary/50 rounded-xl border border-accent/20 mb-4">
                            <View
                                className="w-6 h-6 rounded-full items-center justify-center"
                                style={{ backgroundColor: colors.accent }}
                            >
                                <AppText styles="text-xs text-white" font="font-ibold">
                                    1
                                </AppText>
                            </View>
                            <View className="flex-1">
                                <AppText
                                    styles="text-sm text-white mb-1"
                                    font="font-isemibold"
                                >
                                    Check your inbox
                                </AppText>
                                <AppText
                                    styles="text-xs text-slate-200"
                                    font="font-iregular"
                                >
                                    Look for an email from Cafa Tickets with the subject "Verify
                                    your email address"
                                </AppText>
                            </View>
                        </View>

                        {/* Step 2 */}
                        <View className="flex-row items-start gap-3 p-4 bg-primary/50 rounded-xl border border-accent/20 mb-4">
                            <View
                                className="w-6 h-6 rounded-full items-center justify-center"
                                style={{ backgroundColor: colors.accent }}
                            >
                                <AppText styles="text-xs text-white" font="font-ibold">
                                    2
                                </AppText>
                            </View>
                            <View className="flex-1">
                                <AppText
                                    styles="text-sm text-white mb-1"
                                    font="font-isemibold"
                                >
                                    Click the verification link
                                </AppText>
                                <AppText
                                    styles="text-xs text-slate-200"
                                    font="font-iregular"
                                >
                                    The link will activate your account instantly
                                </AppText>
                            </View>
                        </View>

                        {/* Step 3 */}
                        <View className="flex-row items-start gap-3 p-4 bg-primary/50 rounded-xl border border-accent/20">
                            <View
                                className="w-6 h-6 rounded-full items-center justify-center"
                                style={{ backgroundColor: colors.accent }}
                            >
                                <AppText styles="text-xs text-white" font="font-ibold">
                                    3
                                </AppText>
                            </View>
                            <View className="flex-1">
                                <AppText
                                    styles="text-sm text-white mb-1"
                                    font="font-isemibold"
                                >
                                    Login to your account
                                </AppText>
                                <AppText
                                    styles="text-xs text-slate-200"
                                    font="font-iregular"
                                >
                                    After activation, you can login and start exploring events
                                </AppText>
                            </View>
                        </View>

                        {/* Additional Info */}
                        <View className="mt-6 p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <View className="flex-row items-start gap-2">
                                <AppText styles="text-sm text-blue-300" font="font-iregular">
                                    💡
                                </AppText>
                                <View className="flex-1">
                                    <AppText
                                        styles="text-xs text-blue-300"
                                        font="font-iregular"
                                    >
                                        <AppText
                                            styles="text-xs text-blue-300"
                                            font="font-ibold"
                                        >
                                            Didn't receive the email?
                                        </AppText>{" "}
                                        Check your spam folder or contact support
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={() => router.replace("/login")}
                        className="mt-6 py-4 px-6 rounded-xl items-center"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Go to Login
                        </AppText>
                    </TouchableOpacity>

                    {/* Bottom spacing */}
                    <View className="h-8" />
                </View>
            </ScrollView>
        </Screen>
    );
};

export default EmailVerificationPrompt;
