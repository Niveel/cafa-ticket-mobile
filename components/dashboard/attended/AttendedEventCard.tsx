import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { View } from "react-native";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { AttendedEvent } from "@/types/dash-events.types";

interface AttendedEventCardProps {
    attendedEvent: AttendedEvent;
}

const AttendedEventCard = ({ attendedEvent }: AttendedEventCardProps) => {
    const { event, ticket_id, ticket_type, attended_date, amount_paid } = attendedEvent;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GH", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatAmount = (amount: string) => {
        return parseFloat(amount).toLocaleString("en-GH");
    };

    return (
        <View className="bg-primary rounded-2xl overflow-hidden border-2 border-accent/30">
            {/* Image */}
            <View style={{ height: 160, position: "relative" }}>
                <Image
                    source={{ uri: event.featured_image }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                    transition={200}
                />

                {/* Attended Badge */}
                <View style={{ position: "absolute", top: 12, left: 12 }}>
                    <View
                        className="flex-row items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                            backgroundColor: "#10b98133",
                            borderWidth: 1,
                            borderColor: "#10b981",
                        }}
                    >
                        <Ionicons name="checkmark-circle" size={14} color="#34d399" />
                        <AppText styles="text-xs" font="font-ibold" style={{ color: "#34d399" }}>
                            Attended
                        </AppText>
                    </View>
                </View>

                {/* Gradient Overlay */}
                <View
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 60,
                        backgroundColor: "rgba(5, 14, 60, 0.8)",
                    }}
                />
            </View>

            {/* Content */}
            <View className="p-4">
                {/* Category */}
                <AppText styles="text-xs text-accent-50 mb-2" font="font-isemibold">
                    {event.category}
                </AppText>

                {/* Title */}
                <AppText styles="text-base text-white mb-3" font="font-ibold" numberOfLines={2}>
                    {event.title}
                </AppText>

                {/* Event Details */}
                <View style={{ gap: 8, marginBottom: 12 }}>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="calendar-outline" size={14} color="#94a3b8" />
                        <AppText styles="text-xs text-slate-300" font="font-iregular">
                            {formatDate(event.event_date)}
                        </AppText>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <Ionicons name="location-outline" size={14} color="#94a3b8" />
                        <AppText styles="text-xs text-slate-300" font="font-iregular" numberOfLines={1}>
                            {event.venue_name}
                        </AppText>
                    </View>
                </View>

                {/* Ticket Details Grid */}
                <View className="flex-row gap-3 mb-3">
                    <View
                        className="flex-1 p-3 rounded-lg border"
                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}
                    >
                        <View className="flex-row items-center gap-2 mb-1">
                            <Ionicons name="ticket-outline" size={14} color="#60a5fa" />
                            <AppText styles="text-xs text-slate-400" font="font-iregular">
                                Ticket Type
                            </AppText>
                        </View>
                        <AppText styles="text-sm text-white" font="font-isemibold" numberOfLines={1}>
                            {ticket_type}
                        </AppText>
                    </View>

                    <View
                        className="flex-1 p-3 rounded-lg border"
                        style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "33" }}
                    >
                        <View className="flex-row items-center gap-2 mb-1">
                            <Ionicons name="cash-outline" size={14} color="#34d399" />
                            <AppText styles="text-xs text-slate-400" font="font-iregular">
                                Amount Paid
                            </AppText>
                        </View>
                        <AppText styles="text-sm" font="font-isemibold" style={{ color: "#34d399" }}>
                            GH₵ {formatAmount(amount_paid)}
                        </AppText>
                    </View>
                </View>

                {/* Attended Info */}
                <View
                    className="p-3 rounded-lg mb-3"
                    style={{ backgroundColor: "#10b98115", borderWidth: 1, borderColor: "#10b98133" }}
                >
                    <View className="flex-row items-center justify-between">
                        <View>
                            <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                                Attended On
                            </AppText>
                            <AppText styles="text-sm" font="font-isemibold" style={{ color: "#34d399" }}>
                                {formatDateTime(attended_date)}
                            </AppText>
                        </View>
                        <Ionicons name="checkmark-circle" size={20} color="#34d399" />
                    </View>
                </View>

                {/* Ticket ID */}
                <View
                    className="pt-3"
                    style={{ borderTopWidth: 1, borderTopColor: colors.accent + "50" }}
                >
                    <AppText styles="text-xs text-slate-400 mb-1" font="font-iregular">
                        Ticket ID
                    </AppText>
                    <AppText styles="text-xs text-slate-300" font="font-imedium">
                        {ticket_id}
                    </AppText>
                </View>
            </View>
        </View>
    );
};

export default memo(AttendedEventCard);
