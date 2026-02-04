import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import AppText from "../../ui/AppText";
import type { RevenueSummary } from "@/types/payments.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    revenueByEvent: RevenueSummary["revenue_by_event"];
};

const RevenueByEventTable = ({ revenueByEvent }: Props) => {
    const formatMoney = useFormatMoney();
    return (
        <View className="rounded-xl p-2 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: colors.primary200 + "80" }}>
                    <Ionicons name="trending-up" size={20} color={colors.accent50} />
                </View>
                <AppText styles="text-lg text-white font-nunbold">
                    Revenue by Event
                </AppText>
            </View>

            {/* Events List */}
            {revenueByEvent.length === 0 ? (
                <View className="py-10 items-center">
                    <AppText styles="text-sm text-white mb-4" style={{ opacity: 0.6 }}>
                        No revenue data yet
                    </AppText>
                    <TouchableOpacity
                        onPress={() => router.push("/dashboard/events/create")}
                        className="px-6 py-3 rounded-xl"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <AppText styles="text-sm text-white font-nunbold">
                            Create Your First Event
                        </AppText>
                    </TouchableOpacity>
                </View>
            ) : (
                <View className="gap-3">
                    {revenueByEvent.map((event, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => router.push(`/dashboard/events/${event.event_id}`)}
                            className="p-4 rounded-xl border-2"
                            style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}
                            activeOpacity={0.8}
                        >
                            {/* Event Title */}
                            <View className="flex-row items-center justify-between mb-3">
                                <AppText styles="text-base text-white flex-1 font-nunbold">
                                    {event.event_title}
                                </AppText>
                                <Ionicons name="chevron-forward" size={18} color={colors.white} style={{ opacity: 0.6 }} />
                            </View>

                            {/* Stats Grid */}
                            <View className="gap-2">
                                {/* Tickets Sold */}
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                        Tickets Sold
                                    </AppText>
                                    <AppText styles="text-sm text-white">
                                        {event.tickets_sold}
                                    </AppText>
                                </View>

                                {/* Gross Revenue */}
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                        Gross Revenue
                                    </AppText>
                                    <AppText styles="text-sm text-white">
                                        {formatMoney(event.gross_revenue)}
                                    </AppText>
                                </View>

                                {/* Platform Fee */}
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                        Platform Fee
                                    </AppText>
                                    <AppText styles="text-sm" style={{ color: colors.accent50 }}>
                                        -{formatMoney(event.platform_fee)}
                                    </AppText>
                                </View>

                                {/* Net Revenue */}
                                <View className="flex-row items-center justify-between pt-2 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                    <AppText styles="text-sm text-white font-nunbold">
                                        Net Revenue
                                    </AppText>
                                    <AppText styles="text-sm font-nunbold" style={{ color: colors.accent50 }}>
                                        {formatMoney(event.net_revenue)}
                                    </AppText>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

export default RevenueByEventTable;