import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import { AppText } from "@/components";
import colors from "@/config/colors";
import { BestSellingEvent } from "@/types/dashboard.types";

type Props = {
    bestSellingEvent: BestSellingEvent;
    totalTicketsSold: number;
};

const AnalyticsBestSellingEvent = ({ bestSellingEvent, totalTicketsSold }: Props) => {
    if (!bestSellingEvent) {
        return (
            <View
                className="rounded-xl p-4 border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <View className="flex-row items-center gap-2 mb-4">
                    <Ionicons name="trophy-outline" size={18} color="#fbbf24" />
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Best Selling Event
                    </AppText>
                </View>
                <View className="items-center py-6">
                    <Ionicons name="calendar-outline" size={32} color={colors.accent50} style={{ opacity: 0.4 }} />
                    <AppText styles="text-xs text-white mt-3 text-center" font="font-iregular" style={{ opacity: 0.5 }}>
                        No events created yet
                    </AppText>
                    <TouchableOpacity
                        onPress={() => router.push("/events/create" as Href)}
                        className="mt-4 px-4 py-2 rounded-lg border"
                        style={{ borderColor: colors.accent, backgroundColor: colors.accent + "1A" }}
                        activeOpacity={0.7}
                        accessibilityRole="button"
                        accessibilityLabel="Create your first event"
                    >
                        <AppText styles="text-xs" font="font-ibold" style={{ color: colors.accent50 }}>
                            Create Your First Event
                        </AppText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const percentage = totalTicketsSold > 0 ? (bestSellingEvent.tickets_sold / totalTicketsSold) * 100 : 0;

    return (
        <View
            className="rounded-xl p-4 border-2 overflow-hidden"
            style={{ backgroundColor: colors.primary100, borderColor: "#f59e0b80" }}
        >
            {/* Ambient glow */}
            <View
                className="absolute top-0 right-0 w-32 h-32 rounded-full"
                style={{ backgroundColor: "#f59e0b0D", transform: [{ translateX: 40 }, { translateY: -40 }] }}
            />

            {/* Header */}
            <View className="flex-row items-center gap-2 mb-4">
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#f59e0b33" }}>
                    <Ionicons name="trophy-outline" size={18} color="#fbbf24" />
                </View>
                <View className="flex-1">
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Best Selling Event
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Your top performer
                    </AppText>
                </View>
            </View>

            {/* Event Card */}
            <View
                className="p-4 rounded-lg border mb-4"
                style={{ backgroundColor: colors.primary200, borderColor: "#f59e0b33" }}
                accessibilityLabel={`Best selling event: ${bestSellingEvent.title}. ${bestSellingEvent.tickets_sold} tickets sold, ${percentage.toFixed(1)}% of total sales`}
            >
                <AppText styles="text-base text-white mb-3" font="font-ibold" numberOfLines={2}>
                    {bestSellingEvent.title}
                </AppText>

                <View className="flex-row gap-4">
                    <View className="flex-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            Tickets Sold
                        </AppText>
                        <AppText styles="text-xl" font="font-ibold" style={{ color: "#fbbf24" }}>
                            {bestSellingEvent.tickets_sold.toLocaleString()}
                        </AppText>
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            Share of Total
                        </AppText>
                        <AppText styles="text-xl" font="font-ibold" style={{ color: "#34d399" }}>
                            {percentage.toFixed(1)}%
                        </AppText>
                    </View>
                </View>

                {/* Progress Bar */}
                <View className="mt-3 w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary100 }}>
                    <View
                        className="h-full rounded-full"
                        style={{ width: `${percentage}%`, backgroundColor: "#f59e0b" }}
                    />
                </View>
            </View>

            {/* Bottom Stats Row */}
            <View className="flex-row gap-3 mb-4">
                <View
                    className="flex-1 p-3 rounded-lg border"
                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-center gap-1.5 mb-1">
                        <Ionicons name="trending-up-outline" size={14} color="#34d399" />
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            Performance
                        </AppText>
                    </View>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Excellent
                    </AppText>
                </View>

                <View
                    className="flex-1 p-3 rounded-lg border"
                    style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-center gap-1.5 mb-1">
                        <Ionicons name="people-outline" size={14} color="#60a5fa" />
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            Total Sales
                        </AppText>
                    </View>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        {totalTicketsSold.toLocaleString()}
                    </AppText>
                </View>
            </View>

            {/* View Event Button */}
            <TouchableOpacity
                onPress={() => router.push(`/events/${bestSellingEvent.id}` as Href)}
                className="flex-row items-center justify-center gap-2 py-3 rounded-lg border"
                style={{ backgroundColor: "#f59e0b1A", borderColor: "#f59e0b4D" }}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`View details for ${bestSellingEvent.title}`}
            >
                <AppText styles="text-sm" font="font-ibold" style={{ color: "#fbbf24" }}>
                    View Event Details
                </AppText>
                <Ionicons name="arrow-forward-outline" size={16} color="#fbbf24" />
            </TouchableOpacity>
        </View>
    );
};

export default AnalyticsBestSellingEvent;