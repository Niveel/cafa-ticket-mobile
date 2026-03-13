import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AppText from "../../ui/AppText";

const ProfileQuickActions = () => {
    const actions = [
        {
            title: 'Change Password',
            description: 'Update your password',
            icon: 'lock-closed-outline' as const,
            onPress: () => router.push('/dashboard/settings/security'),
            color: '#8b5cf6',
        },
        {
            title: 'Notifications',
            description: 'Manage preferences',
            icon: 'notifications-outline' as const,
            onPress: () => router.push('/dashboard/settings/notifications'),
            color: '#10b981',
        },
        {
            title: 'Payment Profile',
            description: 'Manage payments',
            icon: 'card-outline' as const,
            onPress: () => router.push('/dashboard/payments/profiles'),
            color: '#ec4899',
        },
    ];

    return (
        <View className="bg-primary-100 rounded-2xl p-2">
            {/* Header */}
            <View className="mb-4">
                <AppText styles="text-lg text-black mb-1 font-nunbold">
                    Quick Actions
                </AppText>
                <AppText styles="text-sm text-slate-500">
                    Manage your account and activities
                </AppText>
            </View>

            {/* Actions Grid */}
            <View className="gap-3">
                {actions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={action.onPress}
                        className="p-4 bg-primary-200 rounded-xl active:opacity-80 border border-accent"
                        activeOpacity={0.7}
                    >
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-12 h-12 rounded-xl items-center justify-center"
                                style={{ backgroundColor: action.color + '33' }}
                            >
                                <Ionicons name={action.icon} size={24} color={action.color} />
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-base text-black mb-1 font-nunbold">
                                    {action.title}
                                </AppText>
                                <AppText styles="text-xs text-slate-600">
                                    {action.description}
                                </AppText>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default ProfileQuickActions;
