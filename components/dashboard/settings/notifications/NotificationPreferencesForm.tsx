import { View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useState } from "react";
import * as Sentry from '@sentry/react-native';
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import AppSwitch from "../../../ui/AppSwitch";
import colors from "@/config/colors";

type NotificationSettings = {
    marketing_emails: boolean;
    event_reminders: boolean;
    email_notifications: boolean;
    sms_notifications: boolean;
};

interface NotificationPreferencesFormProps {
    currentSettings: NotificationSettings;
}

const notificationOptions = [
    {
        key: "email_notifications" as keyof NotificationSettings,
        icon: "mail-outline" as const,
        title: "Email Notifications",
        description: "Receive important updates and notifications via email",
        color: "#3b82f6",
    },
    {
        key: "event_reminders" as keyof NotificationSettings,
        icon: "calendar-outline" as const,
        title: "Event Reminders",
        description: "Get notified before your events start",
        color: "#a855f7",
    },
    {
        key: "sms_notifications" as keyof NotificationSettings,
        icon: "chatbubble-outline" as const,
        title: "SMS Notifications",
        description: "Receive critical updates via text message",
        color: "#10b981",
    },
    {
        key: "marketing_emails" as keyof NotificationSettings,
        icon: "trending-up-outline" as const,
        title: "Marketing Emails",
        description: "Get updates about promotions, new events, and special offers",
        color: "#f59e0b",
    },
];

const NotificationPreferencesForm = ({ currentSettings }: NotificationPreferencesFormProps) => {
    const [settings, setSettings] = useState<NotificationSettings>(currentSettings);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const hasChanges = JSON.stringify(settings) !== JSON.stringify(currentSettings);

    const handleToggle = (key: keyof NotificationSettings) => {
        setSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
        setSuccess(false);
    };

    const handleSave = async () => {
        try {
            setIsSubmitting(true);

            // TODO: Replace with actual API call
            // await updateNotificationSettings(settings);
            await new Promise((resolve) => setTimeout(resolve, 1500));

            setSuccess(true);
        } catch (error: any) {
            console.error("Error updating notification settings:", error);
            Sentry.captureException(error);
            const errorMessage =
                error.response?.data?.message || error.message || "Failed to update settings";
            Alert.alert("Error", errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View className="rounded-xl p-4 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: colors.primary200 + "80" }}>
                    <Ionicons name="notifications-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-white font-nunbold">
                        Notification Preferences
                    </AppText>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                        Control how and when you receive notifications
                    </AppText>
                </View>
            </View>

            {/* Success Banner */}
            {success && (
                <View
                    className="p-3 rounded-lg border mb-4"
                    style={{ backgroundColor: "#10b981" + "1A", borderColor: "#10b981" + "33" }}
                >
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="checkmark-circle" size={16} color="#34d399" />
                        <AppText styles="text-xs" style={{ color: "#34d399" }}>
                            Settings updated successfully!
                        </AppText>
                    </View>
                </View>
            )}

            {/* Notification Options */}
            <View className="gap-3 mb-6">
                {notificationOptions.map((option) => {
                    const isEnabled = settings[option.key];

                    return (
                        <View
                            key={option.key}
                            className="flex-row items-center p-4 rounded-xl border"
                            style={{
                                backgroundColor: colors.primary200,
                                borderColor: colors.accent + "4D",
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => handleToggle(option.key)}
                                className="flex-1 flex-row items-center"
                                activeOpacity={0.7}
                            >
                                {/* Icon */}
                                <View
                                    className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                                    style={{ backgroundColor: option.color + "33" }}
                                >
                                    <Ionicons name={option.icon} size={20} color={option.color} />
                                </View>

                                {/* Text */}
                                <View className="flex-1">
                                    <AppText styles="text-sm text-white">
                                        {option.title}
                                    </AppText>
                                    <AppText styles="text-xs text-white mt-0.5" style={{ opacity: 0.6 }}>
                                        {option.description}
                                    </AppText>
                                </View>
                            </TouchableOpacity>

                            <AppSwitch
                                value={isEnabled}
                                onValueChange={() => handleToggle(option.key)}
                                trackColor={{ false: colors.primary200, true: colors.accent }}
                                thumbColor={colors.white}
                                accessibilityLabel={option.title}
                                accessibilityHint={`Toggle ${option.title.toLowerCase()}`}
                            />
                        </View>
                    );
                })}
            </View>

            {/* Save Button */}
            <TouchableOpacity
                onPress={handleSave}
                disabled={isSubmitting || !hasChanges}
                className="w-full py-4 rounded-xl items-center justify-center"
                style={{
                    backgroundColor: colors.accent,
                    opacity: isSubmitting || !hasChanges ? 0.5 : 1,
                }}
                activeOpacity={0.8}
            >
                {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <AppText styles="text-sm text-white font-nunbold">
                        Save Preferences
                    </AppText>
                )}
            </TouchableOpacity>

            {/* No changes hint */}
            {!hasChanges && !isSubmitting && (
                <AppText styles="text-xs text-white text-center mt-3" style={{ opacity: 0.4 }}>
                    No changes to save
                </AppText>
            )}
        </View>
    );
};

export default NotificationPreferencesForm;
