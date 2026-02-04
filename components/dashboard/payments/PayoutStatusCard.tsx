import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import type { RevenueSummary } from "@/types/payments.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    payoutStatus: RevenueSummary["payout_status"];
    summary?: RevenueSummary["summary"];
    revenueByMonth?: RevenueSummary["revenue_by_month"];
};

const PayoutStatusCard = ({ payoutStatus, summary, revenueByMonth }: Props) => {
    const formatMoney = useFormatMoney();
    // Calculate actual monthly growth
    const calculateMonthlyGrowth = () => {
        if (!revenueByMonth || revenueByMonth.length < 2) {
            return 0;
        }

        // revenueByMonth is sorted desc (most recent first)
        const thisMonth = parseFloat(revenueByMonth[0].gross_revenue);
        const lastMonth = parseFloat(revenueByMonth[1].gross_revenue);

        if (lastMonth === 0) {
            return thisMonth > 0 ? 100 : 0;
        }

        return ((thisMonth - lastMonth) / lastMonth) * 100;
    };

    const monthlyGrowth = calculateMonthlyGrowth();
    const isPositiveGrowth = monthlyGrowth >= 0;

    const currentBalance = parseFloat(payoutStatus.available_balance);
    const totalRevenue = parseFloat(payoutStatus.total_paid_out);
    const averageTicketPrice = summary ? parseFloat(summary.average_ticket_price) : 0;
    const totalEvents = summary?.total_events || 0;
    const totalTicketsSold = summary?.total_tickets_sold || 0;

    return (
        <View className="rounded-xl p-2 border-2" style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}>
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-6">
                <View className="w-12 h-12 rounded-xl items-center justify-center" style={{ backgroundColor: colors.accent + "33" }}>
                    <Ionicons name="bar-chart-outline" size={24} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-lg text-white font-nunbold">
                        Revenue Insights
                    </AppText>
                    <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                        Your earnings analytics
                    </AppText>
                </View>
            </View>

            {/* Stats Grid - 2x2 */}
            <View className="gap-3 mb-6">
                {/* Row 1 */}
                <View className="flex-row gap-3">
                    {/* Total Revenue */}
                    <View className="flex-1 p-4 rounded-xl border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}>
                        <View className="flex-row items-center gap-2 mb-2">
                            <Ionicons name="trending-up" size={16} color={colors.accent50} />
                            <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                Total Revenue
                            </AppText>
                        </View>
                        <AppText styles="text-lg text-white font-nunbold" style={{ color: colors.success }}>
                            {formatMoney(totalRevenue)}
                        </AppText>
                        <AppText styles="text-xs text-white mt-1" style={{ opacity: 0.5 }}>
                            All time earnings
                        </AppText>
                    </View>

                    {/* Current Balance */}
                    <View className="flex-1 p-4 rounded-xl border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}>
                        <View className="flex-row items-center gap-2 mb-2">
                            <Ionicons name="wallet-outline" size={16} color={colors.accent50} />
                            <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                Balance
                            </AppText>
                        </View>
                        <AppText styles="text-lg text-white font-nunbold" style={{ color: Number(currentBalance) > 0 ? colors.success : colors.accent }}>
                            {formatMoney(currentBalance)}
                        </AppText>
                        {revenueByMonth && revenueByMonth.length >= 2 ? (
                            <View className="flex-row items-center gap-1 mt-1">
                                <Ionicons
                                    name="trending-up"
                                    size={12}
                                    color={isPositiveGrowth ? colors.accent50 : colors.accent}
                                    style={{ transform: [{ rotate: isPositiveGrowth ? "0deg" : "180deg" }] }}
                                />
                                <AppText
                                    styles="text-xs font-nunbold"
                                    style={{ color: isPositiveGrowth ? colors.accent50 : colors.accent }}
                                >
                                    {isPositiveGrowth ? "+" : ""}
                                    {Math.abs(monthlyGrowth).toFixed(1)}% growth
                                </AppText>
                            </View>
                        ) : (
                            <AppText styles="text-xs text-white mt-1" style={{ opacity: 0.5 }}>
                                Available to withdraw
                            </AppText>
                        )}
                    </View>
                </View>

                {/* Row 2 */}
                <View className="flex-row gap-3">
                    {/* Average Ticket Price */}
                    <View className="flex-1 p-4 rounded-xl border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}>
                        <View className="flex-row items-center gap-2 mb-2">
                            <Ionicons name="pricetag-outline" size={16} color={colors.accent50} />
                            <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                Avg. Price
                            </AppText>
                        </View>
                        <AppText styles="text-lg text-white font-nunbold" style={{ color: colors.accent50 }}>
                            {formatMoney(averageTicketPrice)}
                        </AppText>
                        <AppText styles="text-xs text-white mt-1" style={{ opacity: 0.5 }}>
                            Per ticket
                        </AppText>
                    </View>

                    {/* Total Tickets Sold */}
                    <View className="flex-1 p-4 rounded-xl border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}>
                        <View className="flex-row items-center gap-2 mb-2">
                            <Ionicons name="ticket-outline" size={16} color={colors.accent50} />
                            <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                                Tickets
                            </AppText>
                        </View>
                        <AppText styles="text-lg text-white font-nunbold" style={{ color: colors.accent50 }}>
                            {totalTicketsSold.toLocaleString()}
                        </AppText>
                        <AppText styles="text-xs text-white mt-1" style={{ opacity: 0.5 }}>
                            Total sold
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Key Metrics */}
            <View className="gap-2 mb-6">
                <View className="flex-row items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}>
                    <View className="flex-row items-center gap-2">
                        <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent50 }} />
                        <AppText styles="text-sm text-white" style={{ opacity: 0.8 }}>
                            Current Balance
                        </AppText>
                    </View>
                    <AppText styles="text-sm text-white font-nunbold" style={{ color: Number(currentBalance) > 0 ? colors.success : colors.accent }}>
                        {formatMoney(currentBalance)}
                    </AppText>
                </View>

                <View className="flex-row items-center justify-between p-3 rounded-lg border" style={{ backgroundColor: colors.primary200, borderColor: colors.accent + "4D" }}>
                    <View className="flex-row items-center gap-2">
                        <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.accent50 }} />
                        <AppText styles="text-sm text-white" style={{ opacity: 0.8 }}>
                            Total Events
                        </AppText>
                    </View>
                    <AppText styles="text-sm text-white font-nunbold">
                        {totalEvents} events
                    </AppText>
                </View>
            </View>

            {/* Info Note */}
            <View className="p-3 rounded-lg border" style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}>
                <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                    💡 Payments are sent directly to your verified payment profile when you request a withdrawal. Platform
                    fees are automatically deducted.
                </AppText>
            </View>
        </View>
    );
};

export default PayoutStatusCard;