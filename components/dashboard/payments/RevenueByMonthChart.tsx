import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import type { RevenueSummary } from "@/types/payments.types";
import colors from "@/config/colors";

type Props = {
    revenueByMonth: RevenueSummary["revenue_by_month"];
};

const RevenueByMonthChart = ({ revenueByMonth }: Props) => {
    if (!revenueByMonth || revenueByMonth.length === 0) {
        return (
            <View className="rounded-xl p-6 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
                <View className="py-12 items-center">
                    <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        No monthly revenue data yet
                    </AppText>
                </View>
            </View>
        );
    }

    const maxRevenue = Math.max(...revenueByMonth.map((item) => parseFloat(item.gross_revenue)));
    const maxTickets = Math.max(...revenueByMonth.map((item) => item.tickets_sold));

    const formatMonth = (monthString: string) => {
        const date = new Date(monthString + "-01");
        return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    };

    return (
        <View className="rounded-xl p-6 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            {/* Header */}
            <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-lg items-center justify-center" style={{ backgroundColor: colors.primary200 + "80" }}>
                        <Ionicons name="calendar-outline" size={20} color={colors.accent50} />
                    </View>
                    <View>
                        <AppText styles="text-lg text-white" font="font-ibold">
                            Monthly Revenue
                        </AppText>
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                            Last {revenueByMonth.length} months
                        </AppText>
                    </View>
                </View>
                <Ionicons name="trending-up" size={20} color={colors.accent50} />
            </View>

            {/* Chart */}
            <View className="gap-6">
                {revenueByMonth.map((month, index) => {
                    const revenuePercentage = (parseFloat(month.gross_revenue) / maxRevenue) * 100;
                    const ticketsPercentage = (month.tickets_sold / maxTickets) * 100;

                    return (
                        <View key={index} className="gap-3">
                            {/* Month Header */}
                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: colors.accent + "33" }}>
                                        <AppText styles="text-xs text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                                            {index + 1}
                                        </AppText>
                                    </View>
                                    <View>
                                        <AppText styles="text-base text-white" font="font-ibold">
                                            {formatMonth(month.month)}
                                        </AppText>
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                            {month.tickets_sold} tickets sold
                                        </AppText>
                                    </View>
                                </View>
                                <View>
                                    <AppText styles="text-base text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                                        GH₵ {parseFloat(month.gross_revenue).toLocaleString("en-GH")}
                                    </AppText>
                                    <AppText styles="text-xs text-white text-right" font="font-iregular" style={{ opacity: 0.6 }}>
                                        Net: GH₵ {parseFloat(month.net_revenue).toLocaleString("en-GH")}
                                    </AppText>
                                </View>
                            </View>

                            {/* Revenue Bar */}
                            <View className="gap-2">
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                        Gross Revenue
                                    </AppText>
                                    <AppText styles="text-xs" font="font-isemibold" style={{ color: colors.accent50 }}>
                                        {revenuePercentage.toFixed(0)}%
                                    </AppText>
                                </View>
                                <View className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary200 }}>
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${revenuePercentage}%`,
                                            backgroundColor: colors.accent50,
                                        }}
                                    />
                                </View>
                            </View>

                            {/* Tickets Bar */}
                            <View className="gap-2">
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                        Tickets Sold
                                    </AppText>
                                    <AppText styles="text-xs" font="font-isemibold" style={{ color: colors.accent50 }}>
                                        {ticketsPercentage.toFixed(0)}%
                                    </AppText>
                                </View>
                                <View className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary200 }}>
                                    <View
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${ticketsPercentage}%`,
                                            backgroundColor: colors.accent50,
                                        }}
                                    />
                                </View>
                            </View>

                            {/* Platform Fee */}
                            <View className="flex-row items-center justify-between pt-2 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                    Platform Fee (5%)
                                </AppText>
                                <AppText styles="text-xs" font="font-isemibold" style={{ color: colors.accent }}>
                                    -GH₵ {parseFloat(month.platform_fee).toLocaleString("en-GH")}
                                </AppText>
                            </View>

                            {/* Divider */}
                            {index < revenueByMonth.length - 1 && (
                                <View className="pt-6 border-t" style={{ borderColor: colors.accent + "4D" }} />
                            )}
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

export default RevenueByMonthChart;