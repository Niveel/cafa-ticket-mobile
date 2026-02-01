import { View, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import {
    Screen,
    RequireAuth,
    Nav,
    AppText,
    AnalyticsMetricCard,
    AnalyticsQuickActions,
    AnalyticsRecentActivity,
    AnalyticsTicketsByCategory,
    AnalyticsBestSellingEvent,
    AnalyticsRevenueChart,
} from "@/components";
import { getUserStats } from "@/lib/dashboard";
import colors from "@/config/colors";
import type { UserStats } from "@/types/dashboard.types";

const getAccountAge = (days: number, display: string) => {
    if (days === 0) return display;
    if (days < 30) return `${days} day${days > 1 ? "s" : ""}`;
    if (days < 365) {
        const months = Math.floor(days / 30);
        return `${months} month${months > 1 ? "s" : ""}`;
    }
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""}`;
};

const formatGHS = (amount: string | number) =>
    `GH₵ ${parseFloat(amount.toString()).toLocaleString("en-GH", { minimumFractionDigits: 2 })}`;

const AnalyticsScreen = () => {
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getUserStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Loading state
    if (loading) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Analytics" />
                    <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.primary }}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    // Error / no data state
    if (!stats) {
        return (
            <Screen>
                <RequireAuth>
                    <Nav title="Analytics" />
                    <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: colors.primary }}>
                        <View
                            className="w-16 h-16 rounded-2xl items-center justify-center mb-4"
                            style={{ backgroundColor: colors.primary200 }}
                        >
                            <Ionicons name="warning-outline" size={32} color={colors.accent50} />
                        </View>
                        <AppText styles="text-base text-white text-center" font="font-ibold">
                            Unable to load analytics
                        </AppText>
                        <AppText styles="text-xs text-white mt-2 text-center" font="font-iregular" style={{ opacity: 0.6 }}>
                            Please check your connection and try again.
                        </AppText>
                    </View>
                </RequireAuth>
            </Screen>
        );
    }

    const metricCards = [
        {
            title: "Tickets Purchased",
            value: stats.overview.tickets_purchased,
            icon: "ticket-outline",
            subtitle: `${stats.purchasing_stats.active_tickets} active`,
            iconBgColor: "#3b82f633",
            iconColor: "#60a5fa",
        },
        {
            title: "Events Organized",
            value: stats.overview.events_organized,
            icon: "calendar-outline",
            subtitle: `${stats.organizing_stats.active_events} active`,
            iconBgColor: "#a855f733",
            iconColor: "#c084fc",
        },
        {
            title: "Events Attended",
            value: stats.overview.events_attended,
            icon: "people-outline",
            subtitle: `${stats.purchasing_stats.upcoming_events} upcoming`,
            iconBgColor: "#10b98133",
            iconColor: "#34d399",
        },
        {
            title: "Total Spent",
            value: formatGHS(stats.overview.total_spent),
            icon: "cash-outline",
            subtitle: "On purchases",
            iconBgColor: colors.accent + "33",
            iconColor: colors.accent50,
        },
        {
            title: "Total Revenue",
            value: formatGHS(stats.overview.total_revenue),
            icon: "trending-up-outline",
            subtitle: "From sales",
            iconBgColor: "#10b98133",
            iconColor: "#34d399",
        },
        {
            title: "Account Age",
            value: getAccountAge(stats.overview.account_age_days, stats.overview.account_age_display),
            icon: "trophy-outline",
            subtitle: `${stats.overview.account_age_days} days`,
            iconBgColor: "#f59e0b33",
            iconColor: "#fbbf24",
        },
    ];

    // Chunk into pairs for 2-column grid
    const metricRows = metricCards.reduce<typeof metricCards[]>((rows, card, i) => {
        if (i % 2 === 0) rows.push([]);
        rows[rows.length - 1].push(card);
        return rows;
    }, []);

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Analytics" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                        <View className="gap-6">
                            {/* Welcome Header */}
                            <View className=" pt-2">
                                <AppText styles="text-xl text-white" font="font-ibold">
                                    Welcome back, {stats.username}
                                </AppText>
                                <AppText styles="text-xs text-white mt-1" font="font-iregular" style={{ opacity: 0.6 }}>
                                    Here's your activity summary
                                </AppText>
                            </View>

                            {/* Metric Cards — 2-column grid */}
                            <View>
                                {metricRows.map((row, rowIndex) => (
                                    <View key={rowIndex} className="flex-row gap-3 mb-3">
                                        {row.map((card, cardIndex) => (
                                            <AnalyticsMetricCard key={cardIndex} {...card} />
                                        ))}
                                    </View>
                                ))}
                            </View>

                            {/* Quick Actions — horizontal scroll */}
                            <AnalyticsQuickActions />

                            {/* Recent Activity */}
                            <AnalyticsRecentActivity activities={stats.recent_activity} />

                            {/* Tickets by Category */}
                            <AnalyticsTicketsByCategory
                                ticketsByCategory={stats.purchasing_stats.tickets_by_category}
                                totalSpent={stats.purchasing_stats.total_spent}
                            />

                            {/* Best Selling Event */}
                            <AnalyticsBestSellingEvent
                                bestSellingEvent={stats.organizing_stats.best_selling_event}
                                totalTicketsSold={stats.organizing_stats.total_tickets_sold}
                            />

                            {/* Revenue Chart */}
                            <AnalyticsRevenueChart
                                revenueData={stats.organizing_stats.revenue_by_month}
                                totalRevenue={stats.organizing_stats.total_revenue}
                            />
                        </View>
                    </ScrollView>
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default AnalyticsScreen;