import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Screen, RequireAuth, Nav, AppText } from "@/components";
import colors from "@/config/colors";

const settingsSections = [
    {
        title: "Security",
        description: "Password, email, and username management",
        icon: "shield-checkmark-outline" as const,
        route: "/dashboard/settings/security",
        color: "#8b5cf6",
    },
    {
        title: "Notifications",
        description: "Email and SMS notification preferences",
        icon: "notifications-outline" as const,
        route: "/dashboard/settings/notifications",
        color: "#3b82f6",
    },
    {
        title: "Privacy & Data",
        description: "Data management and account deletion",
        icon: "lock-closed-outline" as const,
        route: "/dashboard/settings/privacy",
        color: colors.accent,
    },
];

const SettingsScreen = () => {
    return (
        <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
            <RequireAuth>
                <Nav title="Settings" />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
                >
                    {/* Hero Banner */}
                    <View
                        className="rounded-2xl p-2 overflow-hidden"
                        style={{
                            backgroundColor: colors.primary100,
                            borderWidth: 1,
                            borderColor: colors.accent + "4D",
                        }}
                    >
                        {/* Decorative circles */}
                        <View
                            className="absolute -top-8 -right-8 w-40 h-40 rounded-full"
                            style={{ backgroundColor: colors.accent }}
                        />
                        <View
                            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full"
                            style={{ backgroundColor: colors.accent + "4d" }}
                        />

                        {/* Icon + Text row */}
                        <View className="flex-row items-start gap-4">
                            <View
                                className="w-14 h-14 rounded-2xl items-center justify-center"
                                style={{ backgroundColor: colors.accent + "22" }}
                            >
                                <Ionicons name="settings-outline" size={28} color={colors.accent50} />
                            </View>

                            <View className="flex-1">
                                <AppText styles="text-sm text-white mt-1">
                                    Manage your account preferences and security
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Section Label */}
                    <View className="px-1">
                        <AppText styles="text-xs text-slate-500 uppercase tracking-widest font-nunbold">
                            Account Settings
                        </AppText>
                    </View>

                    {/* Navigation Cards */}
                    <View className="gap-3">
                        {settingsSections.map((section, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => router.push(section.route as any)}
                                className="rounded-2xl overflow-hidden"
                                style={{
                                    backgroundColor: colors.primary100,
                                    borderWidth: 1,
                                    borderColor: colors.accent + "30",
                                }}
                                activeOpacity={0.7}
                            >
                                {/* Top accent strip */}
                                <View
                                    className="h-0.5"
                                    style={{ backgroundColor: section.color }}
                                />

                                <View className="p-4">
                                    {/* Icon row */}
                                    <View className="flex-row items-center justify-between">
                                        <View
                                            className="w-12 h-12 rounded-xl items-center justify-center"
                                            style={{ backgroundColor: section.color + "22" }}
                                        >
                                            <Ionicons name={section.icon} size={24} color={section.color} />
                                        </View>
                                        <Ionicons name="chevron-forward" size={20} color={colors.accent} />
                                    </View>

                                    {/* Title + Description */}
                                    <AppText styles="text-base text-white mt-3 font-nunbold">
                                        {section.title}
                                    </AppText>
                                    <AppText styles="text-sm text-white mt-1">
                                        {section.description}
                                    </AppText>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Help & Support footer */}
                    <TouchableOpacity
                        onPress={() => router.push("/contact")}
                        className="rounded-xl p-4 flex-row items-center gap-3"
                        style={{
                            backgroundColor: colors.primary100,
                            borderWidth: 1,
                            borderColor: colors.accent,
                        }}
                    >
                        <View
                            className="w-10 h-10 rounded-lg items-center justify-center border border-accent"
                            style={{ backgroundColor: colors.accent + "1A" }}
                        >
                            <Ionicons name="help-circle-outline" size={22} color={colors.accent50} />
                        </View>
                        <View className="flex-1">
                            <AppText styles="text-sm text-white font-nunbold">
                                Need help?
                            </AppText>
                            <AppText styles="text-xs text-slate-200">
                                Contact support for account issues
                            </AppText>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color={colors.accent} />
                    </TouchableOpacity>
                </ScrollView>
            </RequireAuth>
        </Screen>
    );
};

export default SettingsScreen;