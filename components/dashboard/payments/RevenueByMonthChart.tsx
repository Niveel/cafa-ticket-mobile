import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import type { RevenueSummary } from "@/types/payments.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    revenueByMonth: RevenueSummary["revenue_by_month"];
};

const RevenueByMonthChart = ({ revenueByMonth }: Props) => {
    const formatMoney = useFormatMoney();
    if (!revenueByMonth || revenueByMonth.length === 0) {
        return (
            <View className="rounded-xl p-6 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
                <View className="py-12 items-center">
                    <AppText styles="text-sm text-white" style={{ opacity: 0.6 }}>
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
                        <AppText styles="text-lg text-white font-nunbold">
                            Monthly Revenue
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
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
                                        <AppText styles="text-xs text-white font-nunbold" style={{ color: colors.accent50 }}>
                                            {index + 1}
                                        </AppText>
                                    </View>
                                    <View>
                                        <AppText styles="text-base text-white font-nunbold">
                                            {formatMonth(month.month)}
                                        </AppText>
                                        <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                            {month.tickets_sold} tickets sold
                                        </AppText>
                                    </View>
                                </View>
                                <View>
                                    <AppText styles="text-base text-white font-nunbold" style={{ color: colors.accent50 }}>
                                        {formatMoney(month.gross_revenue)}
                                    </AppText>
                                    <AppText styles="text-xs text-white text-right" style={{ opacity: 0.6 }}>
                                        Net: {formatMoney(month.net_revenue)}
                                    </AppText>
                                </View>
                            </View>

                            {/* Revenue Bar */}
                            <View className="gap-2">
                                <View className="flex-row items-center justify-between">
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                        Gross Revenue
                                    </AppText>
                                    <AppText styles="text-xs" style={{ color: colors.accent50 }}>
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
                                    <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                        Tickets Sold
                                    </AppText>
                                    <AppText styles="text-xs" style={{ color: colors.accent50 }}>
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
                                <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                    Platform Fee (5%)
                                </AppText>
                                <AppText styles="text-xs" style={{ color: colors.accent }}>
                                    -{formatMoney(month.platform_fee)}
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