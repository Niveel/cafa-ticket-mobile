import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import {
    Screen,
    RequireAuth,
    Nav,
    AppText,
    PayoutStatusCard,
    RevenueByEventTable,
    RevenueByMonthChart,
} from "@/components";
import { getMyRevenueSummary, getMyPaymentProfiles } from "@/lib/dashboard";
import type { RevenueSummary } from "@/types/payments.types";
import colors from "@/config/colors";

const PaymentsScreen = () => {
    const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
    const [hasVerifiedProfile, setHasVerifiedProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const [revenueData, profilesData] = await Promise.all([
                getMyRevenueSummary(),
                getMyPaymentProfiles(),
            ]);

            if (!revenueData) {
                setError("Unable to load revenue data");
                return;
            }

            setRevenueSummary(revenueData);

            // Check if user has verified payment profile
            const hasVerified =
                profilesData?.results?.some((profile) => profile.is_default && profile.is_verified) ?? false;
            setHasVerifiedProfile(hasVerified);
        } catch (err: any) {
            console.error("Error fetching revenue data:", err);
            setError(err.message || "Failed to load revenue data");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData(false);
    }, [fetchData]);

    const handleRequestPayout = () => {
        if (!hasVerifiedProfile) {
            router.push("/dashboard/payments/profiles");
        } else {
            // TODO: Implement payout request
            alert("Payout request functionality coming soon");
        }
    };

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Revenue Dashboard" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    {/* Loading State */}
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText styles="text-sm text-white mt-4" font="font-iregular" style={{ opacity: 0.6 }}>
                                Loading revenue data...
                            </AppText>
                        </View>
                    ) : error ? (
                        <ScrollView className="flex-1">
                            <View className="p-6">
                                <View
                                    className="p-12 rounded-xl border-2"
                                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                >
                                    <AppText styles="text-lg text-white text-center" font="font-ibold">
                                        {error}
                                    </AppText>
                                </View>
                            </View>
                        </ScrollView>
                    ) : revenueSummary ? (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <View className="p-2 gap-6">
                                {/* Page Header */}
                                <View>
                                    <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                                        Track your earnings and manage payouts
                                    </AppText>
                                </View>

                                {/* Quick Actions */}
                                <View className="gap-3">
                                    {/* Request Payout Button */}
                                    <TouchableOpacity
                                        onPress={handleRequestPayout}
                                        className="p-6 rounded-xl border-2"
                                        style={{
                                            backgroundColor: hasVerifiedProfile
                                                ? colors.accent + "1A"
                                                : colors.primary100,
                                            borderColor: hasVerifiedProfile ? colors.accent : colors.accent + "4D",
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View
                                                className="w-12 h-12 rounded-xl items-center justify-center"
                                                style={{ backgroundColor: colors.accent + "33" }}
                                            >
                                                <Ionicons name="cash-outline" size={24} color={colors.accent50} />
                                            </View>
                                            <View className="flex-1">
                                                <AppText styles="text-base text-white mb-1" font="font-ibold">
                                                    Request Payout
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
                                                    font="font-iregular"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    Available: GH₵{" "}
                                                    {parseFloat(
                                                        revenueSummary.payout_status.available_balance
                                                    ).toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                                                </AppText>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color={colors.white} />
                                        </View>
                                    </TouchableOpacity>

                                    {/* Payment History */}
                                    <TouchableOpacity
                                        onPress={() => router.push("/dashboard/payments/history/index")}
                                        className="p-6 rounded-xl border-2"
                                        style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                        activeOpacity={0.8}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View
                                                className="w-12 h-12 rounded-xl items-center justify-center"
                                                style={{ backgroundColor: colors.primary200 }}
                                            >
                                                <Ionicons name="receipt-outline" size={24} color={colors.accent50} />
                                            </View>
                                            <View className="flex-1">
                                                <AppText styles="text-base text-white mb-1" font="font-ibold">
                                                    Payment History
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
                                                    font="font-iregular"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    View ticket purchases
                                                </AppText>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color={colors.white} />
                                        </View>
                                    </TouchableOpacity>

                                    {/* Payment Profiles */}
                                    <TouchableOpacity
                                        onPress={() => router.push("/dashboard/payments/profiles")}
                                        className="p-6 rounded-xl border-2"
                                        style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                        activeOpacity={0.8}
                                    >
                                        <View className="flex-row items-center gap-4">
                                            <View
                                                className="w-12 h-12 rounded-xl items-center justify-center"
                                                style={{ backgroundColor: colors.primary200 }}
                                            >
                                                <Ionicons name="wallet-outline" size={24} color={colors.accent50} />
                                            </View>
                                            <View className="flex-1">
                                                <AppText styles="text-base text-white mb-1" font="font-ibold">
                                                    Payment Profiles
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
                                                    font="font-iregular"
                                                    style={{ opacity: 0.7 }}
                                                >
                                                    Manage payout methods
                                                </AppText>
                                            </View>
                                            <Ionicons name="chevron-forward" size={20} color={colors.white} />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Payout Status Card */}
                                <PayoutStatusCard
                                    payoutStatus={revenueSummary.payout_status}
                                    summary={revenueSummary.summary}
                                    revenueByMonth={revenueSummary.revenue_by_month}
                                />

                                {/* Revenue by Event */}
                                <RevenueByEventTable revenueByEvent={revenueSummary.revenue_by_event} />

                                {/* Monthly Revenue Chart */}
                                <RevenueByMonthChart revenueByMonth={revenueSummary.revenue_by_month} />
                            </View>
                        </ScrollView>
                    ) : null}
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default PaymentsScreen;