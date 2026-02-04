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
    FaceVerificationModal,
    RequestPayoutModal
} from "@/components";
import { getMyRevenueSummary, getMyPaymentProfiles } from "@/lib/dashboard";
import type { RevenueSummary } from "@/types/payments.types";
import colors from "@/config/colors";

const PaymentsScreen = () => {
    // ---- data ----
    const [revenueSummary, setRevenueSummary] = useState<RevenueSummary | null>(null);
    const [hasVerifiedProfile, setHasVerifiedProfile] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ---- payout modal orchestration ----
    const [isFaceVerificationOpen, setIsFaceVerificationOpen] = useState(false);
    const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

    // ---- fetch ----
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

            const hasVerified =
                profilesData?.results?.some((profile) => profile.is_verified) ?? false;
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

    // ---- payout button press ----
    const handleRequestPayout = () => {
        if (!hasVerifiedProfile) {
            // no verified profile → take them to profiles screen
            router.push("/dashboard/payments/profiles");
        } else {
            setIsFaceVerificationOpen(true);
        }
    };

    // ---- face verification callbacks ----
    const handleFaceVerificationSuccess = () => {
        setIsFaceVerificationOpen(false);
        setIsPayoutModalOpen(true);
    };

    const handleFaceVerificationClose = () => {
        setIsFaceVerificationOpen(false);
    };

    // ---- payout modal callbacks ----
    const handlePayoutModalClose = () => {
        setIsPayoutModalOpen(false);
    };

    /** called after a successful payout request — re-fetch so balances update */
    const handlePayoutSuccess = () => {
        fetchData(false);
    };

    // ==================================================================
    // Render
    // ==================================================================
    return (
        <Screen>
            <RequireAuth>
                <Nav title="Revenue Dashboard" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    {/* ---- Loading ---- */}
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText styles="text-sm text-white mt-4" style={{ opacity: 0.6 }}>
                                Loading revenue data...
                            </AppText>
                        </View>

                    ) : error ? (
                        /* ---- Error ---- */
                        <ScrollView className="flex-1">
                            <View className="p-6">
                                <View
                                    className="p-12 rounded-xl border-2"
                                    style={{ backgroundColor: colors.accent, borderColor: colors.accent }}
                                >
                                    <AppText styles="text-lg text-white text-center font-nunbold">
                                        {error}
                                    </AppText>
                                </View>
                            </View>
                        </ScrollView>

                    ) : revenueSummary ? (
                        /* ---- Main content ---- */
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <View className="p-2 gap-6">
                                {/* Page Header */}
                                <View>
                                    <AppText styles="text-sm text-white" style={{ opacity: 0.7 }}>
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
                                                ? colors.success + "33"
                                                : colors.primary100,
                                            borderColor: hasVerifiedProfile ? colors.success : colors.accent
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
                                                <AppText styles="text-base text-white mb-1 font-nunbold">
                                                    Request Payout
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
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
                                        onPress={() => router.push("/dashboard/payments/history")}
                                        className="p-6 rounded-xl border-2"
                                        style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
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
                                                <AppText styles="text-base text-white mb-1 font-nunbold">
                                                    Payment History
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
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
                                        style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
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
                                                <AppText styles="text-base text-white mb-1 font-nunbold">
                                                    Payment Profiles
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
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

                {/* Step 1 — Face verification */}
                <FaceVerificationModal
                    isOpen={isFaceVerificationOpen}
                    onClose={handleFaceVerificationClose}
                    onSuccess={handleFaceVerificationSuccess}
                    title="Verify Identity for Withdrawal"
                    description="For your security, please verify your identity before requesting a payout."
                />

                {/* Step 2 — Amount entry & confirmation */}
                {revenueSummary && (
                    <RequestPayoutModal
                        isOpen={isPayoutModalOpen}
                        onClose={handlePayoutModalClose}
                        onPayoutSuccess={handlePayoutSuccess}
                        availableBalance={revenueSummary.payout_status.available_balance}
                    />
                )}
            </RequireAuth>
        </Screen>
    );
};

export default PaymentsScreen;