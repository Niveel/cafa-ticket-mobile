import { View, TouchableOpacity, Image, Share, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Clipboard from 'expo-clipboard';

import { AppText } from "@/components";
import type { MyEventDetailsResponse } from "@/types/dash-events.types";
import colors from "@/config/colors";
import { APP_DOMAIN_NAME } from "@/data/constants";

interface MyEventDetailsHeaderProps {
    event: MyEventDetailsResponse;
    onOpenDeleteModal: () => void;
}

const MyEventDetailsHeader = ({ event, onOpenDeleteModal }: MyEventDetailsHeaderProps) => {
    const eventUrl = `${APP_DOMAIN_NAME}/events/${event.slug}`;

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${event.title} on Cafa Tickets!\n\n${eventUrl}`,
                url: eventUrl,
                title: event.title,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const handleCopyLink = async () => {
        try {
            await Clipboard.setStringAsync(eventUrl);
            Alert.alert("Success", "Event link copied to clipboard!");
        } catch (error) {
            console.error("Error copying link:", error);
            Alert.alert("Error", "Failed to copy link");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" };
            case "ongoing":
                return { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" };
            case "past":
                return { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" };
            default:
                return { bg: "bg-slate-500/20", text: "text-slate-400", border: "border-slate-500/30" };
        }
    };

    const statusColors = getStatusBadge(event.status);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <View className="bg-primary-100 rounded-2xl overflow-hidden border border-accent">
            {/* Event Image */}
            <View className="relative h-64">
                <Image
                    source={{ uri: event.featured_image }}
                    className="w-full h-full"
                    resizeMode="cover"
                />

                {/* Status Badges Overlay */}
                <View className="absolute top-4 left-4 flex-row gap-2">
                    <View
                        className={`px-3 py-1.5 rounded-lg border ${statusColors.bg} ${statusColors.border}`}
                    >
                        <AppText styles={`text-xs ${statusColors.text}`} font="font-ibold">
                            {event.status.toUpperCase()}
                        </AppText>
                    </View>

                    {!event.is_published && (
                        <View className="px-3 py-1.5 rounded-lg border bg-amber-500/20 border-amber-500/30">
                            <AppText styles="text-xs text-amber-400" font="font-ibold">
                                UNPUBLISHED
                            </AppText>
                        </View>
                    )}

                    {event.is_recurring && (
                        <View className="px-3 py-1.5 rounded-lg border bg-purple-500/20 border-purple-500/30">
                            <AppText styles="text-xs text-purple-400" font="font-ibold">
                                RECURRING
                            </AppText>
                        </View>
                    )}
                </View>

                {/* Gradient Overlay */}
                <View className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />

                {/* Event Info Overlay */}
                <View className="absolute bottom-0 left-0 right-0 p-4">
                    <AppText styles="text-xs text-accent-50 mb-2" font="font-isemibold">
                        {event.category.name}
                    </AppText>
                    <AppText styles="text-2xl text-white mb-3" font="font-ibold">
                        {event.title}
                    </AppText>

                    {/* Date & Location */}
                    <View className="gap-2">
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="calendar-outline" size={16} color={colors.white} />
                            <AppText styles="text-xs text-slate-200" font="font-imedium">
                                {formatDate(event.start_date)}
                                {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                            </AppText>
                        </View>

                        <View className="flex-row items-center gap-2">
                            <Ionicons name="location-outline" size={16} color={colors.white} />
                            <AppText styles="text-xs text-slate-200" font="font-imedium">
                                {event.venue_name}, {event.venue_city}
                            </AppText>
                        </View>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View className="p-4 gap-3 border-t border-accent">
                {/* Primary Actions Row */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.push(`/dashboard/events/${event.slug}/edit`)}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: "#3b82f6" }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="create-outline" size={18} color="#fff" />
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Edit
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onOpenDeleteModal}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: "#ef4444" }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                        <AppText styles="text-sm text-white" font="font-ibold">
                            Delete
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Secondary Actions Row */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.push(`/dashboard/events/${event.slug}/attendees`)}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-primary-200 rounded-xl border border-accent"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="people-outline" size={18} color={colors.white} />
                        <AppText styles="text-sm text-white" font="font-isemibold">
                            Attendees
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push(`/events/${event.slug}` as any)}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-primary-200 rounded-xl border border-accent"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="eye-outline" size={18} color={colors.white} />
                        <AppText styles="text-sm text-white" font="font-isemibold">
                            View Public
                        </AppText>
                    </TouchableOpacity>
                </View>

                {/* Share Actions Row */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={handleShare}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-primary-200 rounded-xl border border-accent"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="share-social-outline" size={18} color={colors.accent50} />
                        <AppText styles="text-sm text-accent-50" font="font-isemibold">
                            Share Event
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleCopyLink}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 bg-primary-200 rounded-xl border border-accent"
                        activeOpacity={0.8}
                    >
                        <Ionicons name="link-outline" size={18} color={colors.accent50} />
                        <AppText styles="text-sm text-accent-50" font="font-isemibold">
                            Copy Link
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MyEventDetailsHeader;