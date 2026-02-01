import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";

type RevenueMonth = {
    month: string;
    revenue: string;
    tickets_sold: number;
};

type Props = {
    revenueData: RevenueMonth[];
    totalRevenue: string;
};

const CHART_HEIGHT = 160;

const formatMonth = (monthString: string) => {
    const date = new Date(monthString + "-01");
    return date.toLocaleDateString("en-US", { month: "short" });
};

const formatYLabel = (value: number) => {
    if (value >= 1000) return `₵${(value / 1000).toFixed(0)}k`;
    return `₵${value}`;
};

const AnalyticsRevenueChart = ({ revenueData, totalRevenue }: Props) => {
    const totalRevenueNum = parseFloat(totalRevenue);
    const totalTickets = revenueData.reduce((sum, item) => sum + item.tickets_sold, 0);
    const avgMonthlyRevenue = revenueData.length > 0 ? totalRevenueNum / revenueData.length : 0;

    if (!revenueData || revenueData.length === 0) {
        return (
            <View
                className="rounded-xl p-4 border-2"
                style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
            >
                <View className="flex-row items-center gap-2 mb-4">
                    <Ionicons name="trending-up-outline" size={18} color="#34d399" />
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Revenue Overview
                    </AppText>
                </View>
                <View className="items-center py-6">
                    <Ionicons name="trending-up-outline" size={32} color={colors.accent50} style={{ opacity: 0.4 }} />
                    <AppText styles="text-xs text-white mt-3 text-center" font="font-iregular" style={{ opacity: 0.5 }}>
                        No revenue data yet
                    </AppText>
                </View>
            </View>
        );
    }

    const values = revenueData.map((item) => parseFloat(item.revenue));
    const maxValue = Math.max(...values);

    // Generate Y-axis tick values (4 ticks)
    const tickCount = 4;
    const tickValues = Array.from({ length: tickCount }, (_, i) =>
        Math.round((maxValue / (tickCount - 1)) * i)
    );

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-2 mb-1">
                <Ionicons name="trending-up-outline" size={18} color="#34d399" />
                <AppText styles="text-sm text-white" font="font-ibold">
                    Revenue Overview
                </AppText>
            </View>
            <AppText styles="text-xs text-white mb-4" font="font-iregular" style={{ opacity: 0.6 }}>
                Total:{" "}
                <AppText styles="text-xs" font="font-ibold" style={{ color: "#34d399" }}>
                    GH₵ {totalRevenueNum.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                </AppText>
            </AppText>

            {/* Chart */}
            <View
                accessibilityRole="image"
                accessibilityLabel={`Revenue bar chart showing ${revenueData.length} months. Total revenue GH₵ ${totalRevenue}`}
            >
                <View className="flex-row">
                    {/* Y-Axis Labels */}
                    <View className="justify-between" style={{ height: CHART_HEIGHT, width: 40 }}>
                        {[...tickValues].reverse().map((val, i) => (
                            <AppText key={i} styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.4 }}>
                                {formatYLabel(val)}
                            </AppText>
                        ))}
                    </View>

                    {/* Bars area */}
                    <View className="flex-1">
                        {/* Grid lines */}
                        <View className="absolute inset-0">
                            {tickValues.map((_, i) => (
                                <View
                                    key={i}
                                    className="absolute left-0 right-0"
                                    style={{
                                        top: (i / (tickCount - 1)) * CHART_HEIGHT,
                                        height: 1,
                                        backgroundColor: "rgba(255,255,255,0.06)",
                                    }}
                                />
                            ))}
                        </View>

                        {/* Scrollable bars */}
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            className="flex-1"
                        >
                            <View className="flex-row items-end justify-around px-2" style={{ height: CHART_HEIGHT, minWidth: "100%" }}>
                                {revenueData.map((item, index) => {
                                    const value = parseFloat(item.revenue);
                                    const barHeightPercent = maxValue > 0 ? (value / maxValue) * 100 : 0;

                                    return (
                                        <View
                                            key={index}
                                            className="items-center gap-2"
                                            style={{ flex: 1, maxWidth: 48 }}
                                            accessibilityLabel={`${formatMonth(item.month)}: GH₵ ${item.revenue}, ${item.tickets_sold} tickets sold`}
                                        >
                                            {/* Bar */}
                                            <View className="justify-end" style={{ height: CHART_HEIGHT - 18 }}>
                                                <View
                                                    className="w-7 rounded-t-md"
                                                    style={{
                                                        height: `${Math.max(barHeightPercent, 4)}%`,
                                                        backgroundColor: colors.accent,
                                                    }}
                                                />
                                            </View>

                                            {/* Month label */}
                                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                                {formatMonth(item.month)}
                                            </AppText>
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>

            {/* Summary Cards */}
            <View className="flex-row gap-3 mt-4">
                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary200 }}
                    
                    accessibilityLabel={`Average monthly revenue: GH₵ ${avgMonthlyRevenue.toLocaleString("en-GH", { minimumFractionDigits: 2 })}`}
                >
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Avg. Monthly
                    </AppText>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        GH₵ {avgMonthlyRevenue.toLocaleString("en-GH", { minimumFractionDigits: 0 })}
                    </AppText>
                </View>
                <View
                    className="flex-1 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary200 }}
                    
                    accessibilityLabel={`Total tickets sold: ${totalTickets}`}
                >
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Total Tickets
                    </AppText>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        {totalTickets.toLocaleString()}
                    </AppText>
                </View>
            </View>
        </View>
    );
};

export default AnalyticsRevenueChart;