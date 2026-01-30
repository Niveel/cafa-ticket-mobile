import { View, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";
import { memo } from "react";

import { AppText } from "@/components";
import type { MyEvent } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface MyEventCardProps {
    event: MyEvent;
    onDelete: (eventId: number, eventSlug: string, eventTitle: string) => void;
}

const MyEventCard = ({ event, onDelete }: MyEventCardProps) => {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "upcoming":
                return { bg: "#3b82f620", text: "#60a5fa", border: "#3b82f6" };
            case "ongoing":
                return { bg: "#10b98120", text: "#34d399", border: "#10b981" };
            case "past":
                return { bg: "#64748b20", text: "#94a3b8", border: "#64748b" };
            default:
                return { bg: "#64748b20", text: "#94a3b8", border: "#64748b" };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const statusColors = getStatusBadge(event.status);
    const salesPercentage = event.analytics.sales_percentage;

    return (
        <View className="bg-primary rounded-2xl overflow-hidden border-2 border-accent">
            {/* Image */}
            <View style={{ height: 180, position: "relative" }}>
                <Image
                    source={{ uri: event.featured_image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={200}
                />

                {/* Badges */}
                <View style={{ position: "absolute", top: 12, left: 12, flexDirection: "row", gap: 8 }}>
                    <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: statusColors.bg, borderWidth: 1, borderColor: statusColors.border }}>
                        <AppText styles="text-xs capitalize" font="font-ibold" style={{ color: statusColors.text }}>{event.status}</AppText>
                    </View>
                    {!event.is_published && (
                        <View className="px-3 py-1.5 rounded-lg" style={{ backgroundColor: "#f59e0b20", borderWidth: 1, borderColor: "#f59e0b" }}>
                            <AppText styles="text-xs" font="font-ibold" style={{ color: "#fbbf24" }}>Unpublished</AppText>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View style={{ position: "absolute", top: 12, right: 12, flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity onPress={() => router.push(`/dashboard/events/${event.slug}/edit` as Href)} className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: "#3b82f6" }} activeOpacity={0.8}>
                        <Ionicons name="pencil" size={18} color={colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(event.id, event.slug, event.title)} className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: "#ef4444" }} activeOpacity={0.8}>
                        <Ionicons name="trash" size={18} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Content */}
            <View className="p-4">
                <AppText styles="text-xs text-accent-50 mb-2" font="font-isemibold">{event.category.name}</AppText>
                <TouchableOpacity onPress={() => router.push(`/dashboard/events/${event.slug}` as Href)} activeOpacity={0.8}>
                    <AppText styles="text-base text-white mb-3" font="font-ibold" numberOfLines={2}>{event.title}</AppText>
                </TouchableOpacity>

                <View style={{ gap: 8, marginBottom: 12 }}>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                        <AppText styles="text-xs text-slate-300" font="font-iregular">{formatDate(event.start_date)}{event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}</AppText>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="location-outline" size={14} color="#94a3b8" />
                        <AppText styles="text-xs text-slate-300" font="font-iregular">{event.venue_name}, {event.venue_city}</AppText>
                    </View>
                </View>

                {/* Stats */}
                <View className="flex-row gap-3 mb-3">
                    <View className="flex-1 p-3 rounded-lg border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}>
                        <View className="flex-row items-center gap-2 mb-1">
                            <Ionicons name="ticket-outline" size={14} color="#60a5fa" />
                            <AppText styles="text-xs text-slate-400" font="font-iregular">Sold</AppText>
                        </View>
                        <AppText styles="text-sm text-white" font="font-ibold">{event.analytics.tickets_sold}/{event.analytics.total_tickets}</AppText>
                    </View>
                    <View className="flex-1 p-3 rounded-lg border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}>
                        <View className="flex-row items-center gap-2 mb-1">
                            <Ionicons name="cash-outline" size={14} color="#34d399" />
                            <AppText styles="text-xs text-slate-400" font="font-iregular">Revenue</AppText>
                        </View>
                        <AppText styles="text-sm" font="font-ibold" style={{ color: "#34d399" }}>GH₵ {parseFloat(event.analytics.gross_revenue).toLocaleString()}</AppText>
                    </View>
                </View>

                {/* Progress */}
                <View className="mb-3">
                    <View className="flex-row items-center justify-between mb-2">
                        <AppText styles="text-xs text-slate-400" font="font-iregular">Sales Progress</AppText>
                        <AppText styles="text-xs text-accent-50" font="font-ibold">{salesPercentage.toFixed(1)}%</AppText>
                    </View>
                    <View className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary100 }}>
                        <View className="h-full rounded-full" style={{ width: `${salesPercentage}%`, backgroundColor: colors.accent }} />
                    </View>
                </View>

                {/* Button */}
                <TouchableOpacity onPress={() => router.push(`/dashboard/events/${event.slug}` as Href)} className="flex-row items-center justify-center gap-2 w-full py-3 px-4 rounded-xl" style={{ backgroundColor: colors.accent }} activeOpacity={0.8}>
                    <Ionicons name="eye-outline" size={16} color={colors.white} />
                    <AppText styles="text-xs text-white" font="font-isemibold">View Details</AppText>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default memo(MyEventCard);