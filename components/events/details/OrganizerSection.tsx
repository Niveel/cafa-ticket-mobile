import { View, TouchableOpacity, Linking } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";

import AppText from "../../ui/AppText";
import { EventDetails, RecurringEventDetails } from "@/types";
import { getFullImageUrl } from "@/utils/imageUrl";
import colors from "@/config/colors";

interface OrganizerSectionProps {
    event: EventDetails | RecurringEventDetails;
}

const OrganizerSection = ({ event }: OrganizerSectionProps) => {
    const { organizer } = event;

    const memberSince = new Date(organizer.member_since).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const handleContact = () => {
        Linking.openURL(`mailto:${organizer.email}`);
    };

    return (
        <Animated.View entering={FadeInDown.delay(800)} className="bg-primary py-2">
            <View className="px-2">
                {/* Header */}
                <View className="flex-row items-center gap-3 mb-4">
                    <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33", borderWidth: 1, borderColor: colors.accent }}>
                        <Ionicons name="person-outline" size={24} color={colors.accent50} />
                    </View>
                    <AppText styles="text-xl text-white font-nunbold">Meet The Organizer</AppText>
                </View>

                {/* Organizer Card */}
                <View className="bg-primary-100 rounded-2xl p-2 mb-2" style={{ borderWidth: 2, borderColor: colors.accent }}>
                    {/* Profile Section */}
                    <View className="items-center mb-4">
                        <View className="w-24 h-24 rounded-full overflow-hidden" style={{ borderWidth: 3, borderColor: colors.accent }}>
                            <Image
                                source={{ uri: getFullImageUrl(organizer.profile_image) || undefined }}
                                style={{ width: "100%", height: "100%" }}
                                contentFit="cover"
                            />
                        </View>

                        <AppText styles="text-xl text-white text-center font-nunbold">
                            {organizer.full_name}
                        </AppText>
                        <AppText styles="text-sm text-slate-300 text-center">
                            @{organizer.username}
                        </AppText>

                        {organizer.bio && (
                            <AppText styles="text-sm text-slate-300 text-center mt-3 leading-relaxed">
                                {organizer.bio}
                            </AppText>
                        )}

                        {/* Member Since Badge */}
                        <View className="flex-row items-center gap-2 px-4 py-2 bg-primary rounded-lg mt-2" style={{ borderWidth: 1, borderColor: colors.accent + "50" }}>
                            <Ionicons name="calendar-outline" size={16} color={colors.accent50} />
                            <AppText styles="text-xs text-slate-300">
                                Member since {memberSince}
                            </AppText>
                        </View>

                        {/* Contact Button */}
                        <TouchableOpacity
                            onPress={handleContact}
                            className="w-full mt-4 py-3 px-6 bg-accent rounded-xl flex-row items-center justify-center gap-2"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="mail-outline" size={20} color={colors.white} />
                            <AppText styles="text-sm text-white font-nunbold">Contact Organizer</AppText>
                        </TouchableOpacity>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-3 mb-3">
                        {/* Events Organized */}
                        <View className="flex-1 p-2 bg-primary rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                            <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center mb-3">
                                <Ionicons name="calendar-outline" size={24} color={colors.accent50} />
                            </View>
                            <AppText styles="text-xs text-slate-400 mb-1">Events Organized</AppText>
                            <AppText styles="text-2xl text-white font-nunbold">
                                {organizer.events_organized}
                            </AppText>
                            <AppText styles="text-xs text-slate-400 mt-1">Total successful events</AppText>
                        </View>

                        {/* Tickets Sold */}
                        <View className="flex-1 p-2 bg-primary rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                            <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center mb-3">
                                <Ionicons name="ticket-outline" size={24} color={colors.accent50} />
                            </View>
                            <AppText styles="text-xs text-slate-400 mb-1">Tickets Sold</AppText>
                            <AppText styles="text-2xl text-white font-nunbold">
                                {organizer.total_tickets_sold.toLocaleString()}
                            </AppText>
                            <AppText styles="text-xs text-slate-400 mt-1">Across all events</AppText>
                        </View>
                    </View>

                    {/* Trust Badges */}
                    <View className="p-2 bg-primary rounded-xl" style={{ borderWidth: 1, borderColor: colors.accent }}>
                        <View className="flex-row items-center gap-2 mb-3">
                            <Ionicons name="shield-checkmark-outline" size={20} color={colors.accent50} />
                            <AppText styles="text-base text-white font-nunbold">Why Trust This Organizer</AppText>
                        </View>

                        <View style={{ gap: 12 }}>
                            <View className="flex-row items-start gap-3">
                                <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                                    <AppText styles="text-sm text-accent-50 font-nunbold">✓</AppText>
                                </View>
                                <View className="flex-1">
                                    <AppText styles="text-sm text-white font-nunbold">Verified Organizer</AppText>
                                    <AppText styles="text-xs text-slate-300">Identity and credentials verified</AppText>
                                </View>
                            </View>

                            <View className="flex-row items-start gap-3">
                                <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                                    <AppText styles="text-sm text-accent-50 font-nunbold">✓</AppText>
                                </View>
                                <View className="flex-1">
                                    <AppText styles="text-sm text-white font-nunbold">Proven Track Record</AppText>
                                    <AppText styles="text-xs text-slate-300">{organizer.events_organized}+ successful events organized</AppText>
                                </View>
                            </View>

                            <View className="flex-row items-start gap-3">
                                <View className="w-8 h-8 rounded-lg bg-accent/20 items-center justify-center">
                                    <AppText styles="text-sm text-accent-50 font-nunbold">✓</AppText>
                                </View>
                                <View className="flex-1">
                                    <AppText styles="text-sm text-white font-nunbold">Secure Payments</AppText>
                                    <AppText styles="text-xs text-slate-300">All transactions are protected</AppText>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );
};

export default OrganizerSection;