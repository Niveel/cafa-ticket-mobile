import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { AppText } from "@/components";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";

interface ProfileHeaderProps {
    user: CurrentUser;
}

const ProfileHeader = ({ user }: ProfileHeaderProps) => {
    const memberSince = new Date(user.date_joined);
    const lastLogin = new Date(user.last_login || user.date_joined);
    
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const getTimeSince = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return formatDate(date);
    };

    return (
        <View className="bg-primary-100 rounded-2xl py-6">
            {/* Avatar Section */}
            <View className="items-center mb-6">
                <View className="relative mb-4">
                    <View 
                        className="w-32 h-32 rounded-2xl overflow-hidden"
                        style={{ 
                            borderWidth: 4, 
                            borderColor: colors.accent,
                            backgroundColor: colors.white 
                        }}
                    >
                        <Image
                            source={{ uri: user.profile_image || 'https://via.placeholder.com/160' }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    </View>
                    {user.is_email_verified && (
                        <View 
                            className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full items-center justify-center"
                            style={{ 
                                backgroundColor: '#10b981',
                                borderWidth: 4,
                                borderColor: colors.primary 
                            }}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                        </View>
                    )}
                </View>

                {/* Name & Username */}
                <AppText styles="text-2xl text-white mb-2 text-center" font="font-ibold">
                    {user.full_name}
                </AppText>
                <AppText styles="text-base text-accent-50 mb-3" font="font-isemibold">
                    @{user.username}
                </AppText>

                {user.is_email_verified && (
                    <View 
                        className="px-3 py-1.5 rounded-lg flex-row items-center gap-2"
                        style={{ 
                            backgroundColor: 'rgba(16, 185, 129, 0.2)',
                            borderWidth: 1,
                            borderColor: 'rgba(16, 185, 129, 0.3)'
                        }}
                    >
                        <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                        <AppText styles="text-xs" font="font-isemibold" color="text-emerald-400">
                            Verified Account
                        </AppText>
                    </View>
                )}

                {/* Edit Profile Button */}
                <TouchableOpacity
                    onPress={() => router.push('/dashboard/profile/edit')}
                    className="mt-4 px-6 py-3 rounded-xl flex-row items-center gap-2"
                    style={{ backgroundColor: colors.accent }}
                    activeOpacity={0.8}
                >
                    <Ionicons name="create-outline" size={18} color="#fff" />
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Edit Profile
                    </AppText>
                </TouchableOpacity>
            </View>

            {/* Bio */}
            {user.bio && (
                <View 
                    className="bg-primary rounded-xl p-4 mb-4"
                    style={{ borderWidth: 1, borderColor: colors.accent }}
                >
                    <AppText styles="text-sm text-slate-200 italic text-center" font="font-iregular">
                        "{user.bio}"
                    </AppText>
                </View>
            )}

            {/* Contact Info */}
            <View className="gap-3">
                {/* Email */}
                <View className="flex-row items-center gap-3 p-3 bg-primary-200 rounded-xl">
                    <View 
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                    >
                        <Ionicons name="mail-outline" size={20} color="#60a5fa" />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-0.5" font="font-isemibold">
                            Email
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-imedium">
                            {user.email}
                        </AppText>
                    </View>
                </View>

                {/* Phone */}
                <View className="flex-row items-center gap-3 p-3 bg-primary-200 rounded-xl">
                    <View 
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                    >
                        <Ionicons name="call-outline" size={20} color="#10b981" />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-0.5" font="font-isemibold">
                            Phone
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-imedium">
                            {user.phone_number}
                        </AppText>
                    </View>
                </View>

                {/* Location */}
                <View className="flex-row items-center gap-3 p-3 bg-primary-200 rounded-xl">
                    <View 
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: 'rgba(168, 85, 247, 0.2)' }}
                    >
                        <Ionicons name="location-outline" size={20} color="#a855f7" />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-0.5" font="font-isemibold">
                            Location
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-imedium">
                            {user.city}, {user.country}
                        </AppText>
                    </View>
                </View>

                {/* Member Since */}
                <View className="flex-row items-center gap-3 p-3 bg-primary-200 rounded-xl">
                    <View 
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.accent + '33' }}
                    >
                        <Ionicons name="calendar-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-slate-400 mb-0.5" font="font-isemibold">
                            Member Since
                        </AppText>
                        <AppText styles="text-sm text-white" font="font-imedium">
                            {formatDate(memberSince)}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Last Active */}
            <View className="flex-row items-center gap-2 mt-2 justify-center">
                <View className="w-2 h-2 bg-emerald-400 rounded-full" />
                <AppText styles="text-xs text-slate-400" font="font-iregular">
                    Last active:{' '}
                    <AppText styles="text-xs text-slate-300" font="font-isemibold">
                        {getTimeSince(lastLogin)}
                    </AppText>
                </AppText>
            </View>
        </View>
    );
};

export default ProfileHeader;