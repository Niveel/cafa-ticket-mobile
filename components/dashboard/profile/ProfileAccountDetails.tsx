import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";

interface ProfileAccountDetailsProps {
    user: CurrentUser;
}

const ProfileAccountDetails = ({ user }: ProfileAccountDetailsProps) => {
    const accountAge = () => {
        const joined = new Date(user.date_joined);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - joined.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const months = Math.floor(diffDays / 30);
        const days = diffDays % 30;
        
        if (months === 0) return `${days} days`;
        if (days === 0) return `${months} ${months === 1 ? 'month' : 'months'}`;
        return `${months} ${months === 1 ? 'month' : 'months'}, ${days} days`;
    };

    // ⬅️ Calculate email icon separately
    const emailIcon = user.is_email_verified ? 'shield-checkmark' : 'key-outline';

    const accountDetails = [
        {
            title: 'Account ID',
            value: `#${user.id.toString().padStart(6, '0')}`,
            icon: 'person-circle-outline' as const,
            iconBg: 'rgba(59, 130, 246, 0.2)',
            iconColor: '#60a5fa',
            description: 'Unique account identifier',
        },
        {
            title: 'Username',
            value: `@${user.username}`,
            icon: 'shield-checkmark-outline' as const,
            iconBg: 'rgba(168, 85, 247, 0.2)',
            iconColor: '#a855f7',
            description: 'Public display name',
        },
        {
            title: 'Email Status',
            value: user.is_email_verified ? 'Verified' : 'Not Verified',
            icon: emailIcon, // ⬅️ Use the variable
            iconBg: user.is_email_verified ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
            iconColor: user.is_email_verified ? '#10b981' : '#f59e0b',
            description: user.email,
            badge: user.is_email_verified,
        },
        {
            title: 'Account Age',
            value: accountAge(),
            icon: 'time-outline' as const,
            iconBg: colors.accent + '33',
            iconColor: colors.accent50,
            description: new Date(user.date_joined).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            }),
        },
    ];

    return (
        <View className="bg-primary-100 rounded-2xl p-2">
            {/* Header */}
            <View className="mb-4">
                <AppText styles="text-lg text-white mb-1" font="font-ibold">
                    Account Details
                </AppText>
                <AppText styles="text-sm text-slate-300" font="font-iregular">
                    Your account information and verification status
                </AppText>
            </View>

            {/* Details Grid */}
            <View className="gap-4">
                {accountDetails.map((detail, index) => (
                    <View 
                        key={index}
                        className="p-4 bg-primary-200 rounded-xl"
                    >
                        <View className="flex-row items-start gap-3">
                            <View 
                                className="w-10 h-10 rounded-lg items-center justify-center shrink-0"
                                style={{ backgroundColor: detail.iconBg }}
                            >
                                <Ionicons name={detail.icon as any} size={20} color={detail.iconColor} />
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-xs text-slate-400 mb-1" font="font-isemibold">
                                    {detail.title}
                                </AppText>
                                <View className="flex-row items-center gap-2 flex-wrap mb-1">
                                    <AppText styles="text-base text-white" font="font-ibold">
                                        {detail.value}
                                    </AppText>
                                    {detail.badge && (
                                        <View 
                                            className="px-2 py-0.5 rounded-md"
                                            style={{ 
                                                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                                                borderWidth: 1,
                                                borderColor: 'rgba(16, 185, 129, 0.3)'
                                            }}
                                        >
                                            <AppText styles="text-xs" font="font-ibold" color="text-emerald-400">
                                                ✓ Verified
                                            </AppText>
                                        </View>
                                    )}
                                </View>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">
                                    {detail.description}
                                </AppText>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Security Notice */}
            <View 
                className="mt-6 p-4 rounded-lg"
                style={{ 
                    backgroundColor: colors.accent + '1A',
                    borderWidth: 1,
                    borderColor: colors.accent + '33'
                }}
            >
                <View className="flex-row items-start gap-3">
                    <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent50} />
                    <View className="flex-1">
                        <AppText styles="text-sm text-white mb-1" font="font-isemibold">
                            Security Recommendation
                        </AppText>
                        <AppText styles="text-xs text-slate-300" font="font-iregular">
                            {user.is_email_verified 
                                ? 'Your account is secure. Keep your password safe for extra security.'
                                : 'Please verify your email address to secure your account and unlock all features.'
                            }
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProfileAccountDetails;