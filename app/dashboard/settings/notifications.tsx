import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    RequireAuth,
    Nav,
    AppText,
    NotificationPreferencesForm,
} from "@/components";
import colors from "@/config/colors";

// TODO: Replace with actual API call to fetch user's notification settings
const mockSettings = {
    marketing_emails: false,
    event_reminders: true,
    email_notifications: true,
    sms_notifications: false,
};

const NotificationsSettingsScreen = () => {
    return (
        <Screen>
            <RequireAuth>
                <Nav title="Notification Settings" />

                <View className="flex-1">
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                        <View className="gap-6">
                            {/* Header */}
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-12 h-12 rounded-xl items-center justify-center"
                                    style={{ backgroundColor: colors.primary200 + "80" }}
                                >
                                    <Ionicons name="notifications-outline" size={24} color={colors.accent50} />
                                </View>
                                <View className="flex-1">
                                    <AppText styles="text-xs text-black" style={{ opacity: 0.7 }}>
                                        Manage your email and SMS notification preferences
                                    </AppText>
                                </View>
                            </View>

                            {/* Info Banner */}
                            <View
                                className="p-4 rounded-xl border"
                                style={{ backgroundColor: "#3b82f6" + "1A", borderColor: "#3b82f6" + "33" }}
                            >
                                <View className="flex-row items-start gap-3">
                                    <Ionicons name="information-circle-outline" size={20} color="#60a5fa" style={{ marginTop: 2 }} />
                                    <View className="flex-1">
                                        <AppText styles="text-sm mb-1 font-nunbold" style={{ color: "#60a5fa" }}>
                                            Stay Updated
                                        </AppText>
                                        <AppText styles="text-xs" style={{ color: "#60a5fa", opacity: 0.85 }}>
                                            Choose how you want to receive updates about your tickets, upcoming events, and special offers. You can change these preferences at any time.
                                        </AppText>
                                    </View>
                                </View>
                            </View>

                            {/* Preferences Form */}
                            <NotificationPreferencesForm currentSettings={mockSettings} />
                        </View>
                    </ScrollView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default NotificationsSettingsScreen;