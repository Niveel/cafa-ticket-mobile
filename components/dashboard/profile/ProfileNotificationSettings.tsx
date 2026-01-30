import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";

interface ProfileNotificationSettingsProps {
    settings: CurrentUser['settings'];
}

const ProfileNotificationSettings = ({ settings }: ProfileNotificationSettingsProps) => {
    const settingsData = [
        {
            key: 'marketing_emails',
            title: 'Marketing Emails',
            description: 'Receive promotional emails from Cafa Ticket',
            icon: 'mail-outline' as const,
            enabled: settings.marketing_emails,
        },
        {
            key: 'event_reminders',
            title: 'Event Reminders',
            description: 'Get notified before your events start',
            icon: 'notifications-outline' as const,
            enabled: settings.event_reminders,
        },
        {
            key: 'email_notifications',
            title: 'Email Notifications',
            description: 'Receive updates via email',
            icon: 'mail-open-outline' as const,
            enabled: settings.email_notifications,
        },
        {
            key: 'sms_notifications',
            title: 'SMS Notifications',
            description: 'Receive updates via text message',
            icon: 'chatbubble-outline' as const,
            enabled: settings.sms_notifications,
        },
    ];

    const enabledCount = Object.values(settings).filter(Boolean).length;

    return (
        <View className="bg-primary-100 rounded-2xl p-2">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                    <AppText styles="text-lg text-white mb-1" font="font-ibold">
                        Notification Preferences
                    </AppText>
                    <AppText styles="text-sm text-slate-300" font="font-iregular">
                        {enabledCount} of {settingsData.length} enabled
                    </AppText>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/dashboard/settings')}
                    className="px-4 py-2 rounded-lg flex-row items-center gap-2"
                    style={{ 
                        backgroundColor: colors.accent + '33',
                        borderWidth: 1,
                        borderColor: colors.accent + '4D'
                    }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="settings-outline" size={16} color={colors.accent50} />
                    <AppText styles="text-xs" font="font-ibold">
                        Manage
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Settings List */}
            <View className="gap-3">
                {settingsData.map((setting, index) => (
                    <View 
                        key={index}
                        className="flex-row items-center justify-between p-4 bg-primary-200 rounded-xl"
                    >
                        <View className="flex-row items-center gap-3 flex-1">
                            <View 
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ 
                                    backgroundColor: setting.enabled 
                                        ? 'rgba(16, 185, 129, 0.2)' 
                                        : 'rgba(100, 116, 139, 0.2)'
                                }}
                            >
                                <Ionicons 
                                    name={setting.icon} 
                                    size={20} 
                                    color={setting.enabled ? '#10b981' : '#94a3b8'} 
                                />
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-sm text-white mb-0.5" font="font-isemibold">
                                    {setting.title}
                                </AppText>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    {setting.description}
                                </AppText>
                            </View>
                        </View>

                        {/* Status Badge */}
                        <View 
                            className="px-3 py-1.5 rounded-lg"
                            style={{ 
                                backgroundColor: setting.enabled
                                    ? 'rgba(16, 185, 129, 0.2)'
                                    : 'rgba(100, 116, 139, 0.2)',
                                borderWidth: 1,
                                borderColor: setting.enabled
                                    ? 'rgba(16, 185, 129, 0.3)'
                                    : 'rgba(100, 116, 139, 0.3)'
                            }}
                        >
                            <AppText 
                                styles="text-xs" 
                                font="font-ibold"
                                color={setting.enabled ? 'text-emerald-400' : 'text-slate-400'}
                            >
                                {setting.enabled ? 'Enabled' : 'Disabled'}
                            </AppText>
                        </View>
                    </View>
                ))}
            </View>

            {/* Info Note */}
            <View 
                className="mt-6 p-4 rounded-lg"
                style={{ 
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 1,
                    borderColor: 'rgba(59, 130, 246, 0.2)'
                }}
            >
                <AppText styles="text-xs" font="font-iregular" color="text-blue-300">
                    💡 Manage all notification settings in the Settings page
                </AppText>
            </View>
        </View>
    );
};

export default ProfileNotificationSettings;