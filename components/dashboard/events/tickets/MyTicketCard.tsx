import { View, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

import AppText from "../../../ui/AppText";
import type { MyTicket } from "@/types/tickets.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getFullImageUrl } from "@/utils/imageUrl";

interface MyTicketCardProps {
    ticket: MyTicket;
}

const MyTicketCard = ({ ticket }: MyTicketCardProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const formatMoney = useFormatMoney();

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-GH", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatTime = (time: string) => {
        return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-GH", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusStyle = (status: string) => {
        const styles = {
            active: { bg: colors.accent + "33", color: colors.accent50 },
            used: { bg: colors.primary200 + "80", color: colors.white },
            cancelled: { bg: colors.accent + "1A", color: colors.accent },
        };
        return styles[status as keyof typeof styles] || styles.active;
    };

    const getEventStatusStyle = (status: string) => {
        const styles = {
            upcoming: { bg: colors.primary200 + "80", color: colors.accent50 },
            ongoing: { bg: colors.accent + "33", color: colors.accent },
            past: { bg: colors.primary200 + "80", color: colors.white },
        };
        return styles[status as keyof typeof styles] || styles.upcoming;
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            // API call to download ticket PDF
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_BASE_URL}/tickets/${ticket.ticket_id}/download/`
            );

            if (!response.ok) throw new Error("Failed to download ticket");

            Alert.alert("Success", "Ticket downloaded successfully!");
        } catch (error) {
            console.error("Download error:", error);
            Alert.alert("Error", "Failed to download ticket. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const ticketStatus = getStatusStyle(ticket.status);
    const eventStatus = getEventStatusStyle(ticket.event.status);

    return (
        <View
            className="rounded-xl border-2 overflow-hidden"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Event Image */}
            <View className="relative h-48">
                <Image
                    source={{ uri: getFullImageUrl(ticket.event.featured_image) || undefined }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View
                    className="absolute inset-0"
                    style={{
                        backgroundColor: "rgba(5, 14, 60, 0.5)",
                    }}
                />

                {/* Status Badges */}
                <View className="absolute top-3 right-3 flex-row gap-2">
                    <View className="px-2 py-1 rounded-lg border" style={{ backgroundColor: eventStatus.bg, borderColor: eventStatus.color }}>
                        <AppText styles="text-xs capitalize" font="font-isemibold" style={{ color: eventStatus.color }}>
                            {ticket.event.status}
                        </AppText>
                    </View>
                    <View className="px-2 py-1 rounded-lg border" style={{ backgroundColor: ticketStatus.bg, borderColor: ticketStatus.color }}>
                        <AppText styles="text-xs capitalize" font="font-isemibold" style={{ color: ticketStatus.color }}>
                            {ticket.status}
                        </AppText>
                    </View>
                </View>

                {/* Category Badge */}
                <View className="absolute top-3 left-3">
                    <View className="px-2 py-1 rounded-lg border" style={{ backgroundColor: colors.primary100 + "CC", borderColor: colors.accent + "4D" }}>
                        <AppText styles="text-xs text-black" font="font-isemibold">
                            {ticket.event.category.name}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View className="p-2 gap-3">
                {/* Event Title */}
                <TouchableOpacity onPress={() => router.push(`/events/${ticket.event.slug}`)}>
                    <AppText styles="text-base text-black underline" font="font-ibold" numberOfLines={2}>
                        {ticket.event.title}
                    </AppText>
                </TouchableOpacity>

                {/* Event Details Grid */}
                <View className="gap-3">
                    <View className="flex-row items-start gap-2">
                        <Ionicons name="calendar-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-black mb-0.5" font="font-iregular" style={{ opacity: 0.6 }}>
                                Date
                            </AppText>
                            <AppText styles="text-sm text-black" font="font-isemibold">
                                {formatDate(ticket.event.start_date)}
                            </AppText>
                        </View>
                        <View className="flex-1">
                            <View className="flex-row items-start gap-2">
                                <Ionicons name="time-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                                <View className="flex-1">
                                    <AppText styles="text-xs text-black mb-0.5" font="font-iregular" style={{ opacity: 0.6 }}>
                                        Time
                                    </AppText>
                                    <AppText styles="text-sm text-black" font="font-isemibold">
                                        {formatTime(ticket.event.start_time)}
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-start gap-2">
                        <Ionicons name="location-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-black mb-0.5" font="font-iregular" style={{ opacity: 0.6 }}>
                                Venue
                            </AppText>
                            <AppText styles="text-sm text-black" font="font-isemibold" numberOfLines={1}>
                                {ticket.event.venue_name}, {ticket.event.venue_city}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View className="border-t" style={{ borderColor: colors.accent }} />

                {/* Ticket Info */}
                <View className="flex-row items-center justify-between">
                    <View>
                        <AppText styles="text-xs text-black mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                            Ticket Type
                        </AppText>
                        <AppText styles="text-sm text-black" font="font-ibold">
                            {ticket.ticket_type.name}
                        </AppText>
                    </View>
                    <View className="items-end">
                        <AppText styles="text-xs text-black mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                            Amount Paid
                        </AppText>
                        <AppText styles="text-sm text-black" font="font-ibold" style={{ color: colors.accent50 }}>
                            {formatMoney(ticket.amount_paid)}
                        </AppText>
                    </View>
                </View>

                {/* Check-in Status */}
                {ticket.is_checked_in && (
                    <View className="p-3 rounded-lg border" style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}>
                        <View className="flex-row items-center gap-2">
                            <Ionicons name="checkmark-circle" size={20} color={colors.accent50} />
                            <View>
                                <AppText styles="text-sm text-black" font="font-isemibold" style={{ color: colors.accent50 }}>
                                    Checked In
                                </AppText>
                                {ticket.checked_in_at && (
                                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                                        {formatDate(ticket.checked_in_at)}
                                    </AppText>
                                )}
                            </View>
                        </View>
                    </View>
                )}

                {/* Attendee Info */}
                <View className="p-3 rounded-lg" style={{ backgroundColor: colors.primary200 }}>
                    <AppText styles="text-xs text-black mb-1" font="font-iregular" style={{ opacity: 0.6 }}>
                        Attendee
                    </AppText>
                    <AppText styles="text-sm text-black mb-1" font="font-isemibold">
                        {ticket.attendee_info.name}
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-imedium" style={{ opacity: 0.5 }}>
                        {ticket.ticket_id}
                    </AppText>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => router.push(`/dashboard/tickets/${ticket.ticket_id}`)}
                        className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="eye-outline" size={16} color={colors.white} />
                        <AppText styles="text-sm text-black" font="font-ibold">
                            View
                        </AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleDownload}
                        disabled={isDownloading}
                        className="px-4 py-3 rounded-xl"
                        style={{ backgroundColor: colors.primary200, opacity: isDownloading ? 0.5 : 1 }}
                        activeOpacity={0.8}
                    >
                        {isDownloading ? (
                            <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                            <Ionicons name="download-outline" size={20} color={colors.white} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default MyTicketCard;
