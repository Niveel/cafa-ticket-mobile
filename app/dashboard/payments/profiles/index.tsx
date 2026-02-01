import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useState, useEffect, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Screen, RequireAuth, Nav, AppText } from "@/components";
import { getMyPaymentProfiles } from "@/lib/dashboard";
import type { BankTransferPaymentProfile } from "@/types/payments.types";
import colors from "@/config/colors";

const PaymentProfilesScreen = () => {
    const [profiles, setProfiles] = useState<BankTransferPaymentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch payment profiles
    const fetchProfiles = useCallback(async (showLoader = true) => {
        try {
            if (showLoader) setIsLoading(true);
            setError(null);

            const response = await getMyPaymentProfiles();
            if (response) {
                setProfiles(response.results);
            }
        } catch (err: any) {
            console.error("Error fetching profiles:", err);
            setError(err.message || "Failed to load payment profiles");
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchProfiles();
    }, [fetchProfiles]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfiles(false);
    }, [fetchProfiles]);

    const handleAddProfile = () => {
        router.push("/dashboard/payments/profiles/create");
    };

    const handleEditProfile = (profileId: string) => {
        router.push(`/dashboard/payments/profiles/${profileId}/edit`);
    };

    const handleDeleteProfile = (profileId: string, profileName: string) => {
        Alert.alert(
            "Delete Payment Profile",
            `Are you sure you want to delete "${profileName}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        // TODO: Implement delete API call
                        Alert.alert("Success", "Payment profile deleted successfully");
                        fetchProfiles(false);
                    },
                },
            ]
        );
    };

    const getStatusStyle = (isVerified: boolean) => {
        return isVerified
            ? { bg: colors.success + "33", color: colors.success, text: "Verified" }
            : { bg: colors.accent + "33", color: colors.accent, text: "Failed" };
    };

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Payment Profiles" />

                <View className="flex-1" style={{ backgroundColor: colors.primary }}>
                    {/* Loading State */}
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText styles="text-sm text-white mt-4" font="font-iregular" style={{ opacity: 0.6 }}>
                                Loading payment profiles...
                            </AppText>
                        </View>
                    ) : (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={false}
                            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        >
                            <View className="p-6 gap-6">
                                {/* Page Header */}
                                <View>
                                    <AppText styles="text-2xl text-white mb-2" font="font-ibold">
                                        Payment Profiles
                                    </AppText>
                                    <AppText styles="text-sm text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                                        Manage your payout methods
                                    </AppText>
                                </View>

                                {/* Info Card */}
                                <View
                                    className="p-4 rounded-xl border"
                                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                >
                                    <View className="flex-row items-start gap-3">
                                        <Ionicons name="information-circle" size={20} color={colors.accent50} style={{ marginTop: 2 }} />
                                        <View className="flex-1">
                                            <AppText styles="text-sm text-white mb-1" font="font-ibold">
                                                About Payment Profiles
                                            </AppText>
                                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.7 }}>
                                                Payment profiles are used to receive payouts from your event sales. Add your
                                                bank account details to get paid.
                                            </AppText>
                                        </View>
                                    </View>
                                </View>

                                {/* Add Profile Button */}
                                <TouchableOpacity
                                    onPress={handleAddProfile}
                                    className="flex-row items-center justify-center gap-2 px-6 py-4 rounded-xl"
                                    style={{ backgroundColor: colors.accent }}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="add-circle" size={20} color={colors.white} />
                                    <AppText styles="text-sm text-white" font="font-ibold">
                                        Add Payment Profile
                                    </AppText>
                                </TouchableOpacity>

                                {/* Error State */}
                                {error && (
                                    <View
                                        className="p-4 rounded-xl border-2"
                                        style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                                    >
                                        <AppText styles="text-sm text-white text-center" font="font-iregular">
                                            {error}
                                        </AppText>
                                    </View>
                                )}

                                {/* Profiles List */}
                                {profiles.length === 0 ? (
                                    <View
                                        className="p-12 rounded-xl border-2 items-center"
                                        style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                                    >
                                        <View
                                            className="w-20 h-20 rounded-2xl items-center justify-center mb-6"
                                            style={{ backgroundColor: colors.accent + "33" }}
                                        >
                                            <Ionicons name="wallet-outline" size={40} color={colors.accent50} />
                                        </View>
                                        <AppText styles="text-base text-white mb-3 text-center" font="font-ibold">
                                            No Payment Profiles Yet
                                        </AppText>
                                        <AppText
                                            styles="text-sm text-white text-center"
                                            font="font-iregular"
                                            style={{ opacity: 0.7, maxWidth: 300 }}
                                        >
                                            Add a payment profile to start receiving payouts from your event sales.
                                        </AppText>
                                    </View>
                                ) : (
                                    <View className="gap-4">
                                        {profiles.map((profile) => {
                                            const status = getStatusStyle(profile.is_verified);

                                            return (
                                                <View
                                                    key={profile.id}
                                                    className="rounded-xl border-2 p-4"
                                                    style={{
                                                        backgroundColor: profile.is_default
                                                            ? colors.accent + "1A"
                                                            : colors.primary100,
                                                        borderColor: profile.is_default
                                                            ? colors.accent
                                                            : colors.accent + "4D",
                                                    }}
                                                >
                                                    {/* Header */}
                                                    <View className="flex-row items-start justify-between mb-3">
                                                        <View className="flex-1">
                                                            <View className="flex-row items-center gap-2 mb-2">
                                                                <AppText styles="text-base text-white" font="font-ibold">
                                                                    {profile.name}
                                                                </AppText>
                                                                {profile.is_default && (
                                                                    <View
                                                                        className="px-2 py-0.5 rounded"
                                                                        style={{ backgroundColor: colors.accent }}
                                                                    >
                                                                        <AppText
                                                                            styles="text-xs text-white"
                                                                            font="font-ibold"
                                                                        >
                                                                            Default
                                                                        </AppText>
                                                                    </View>
                                                                )}
                                                            </View>
                                                        </View>

                                                        <View
                                                            className="px-3 py-1 rounded-lg"
                                                            style={{ backgroundColor: status.bg }}
                                                        >
                                                            <AppText
                                                                styles="text-xs"
                                                                font="font-isemibold"
                                                                style={{ color: status.color }}
                                                            >
                                                                {status.text}
                                                            </AppText>
                                                        </View>
                                                    </View>

                                                    {/* Account Details */}
                                                    <View className="gap-2 mb-4">
                                                        <View className="flex-row items-center gap-2">
                                                            <Ionicons
                                                                name="person-outline"
                                                                size={14}
                                                                color={colors.white}
                                                                style={{ opacity: 0.6 }}
                                                            />
                                                            <AppText
                                                                styles="text-sm text-white"
                                                                font="font-iregular"
                                                                style={{ opacity: 0.8 }}
                                                            >
                                                                {profile.account_details.account_name}
                                                            </AppText>
                                                        </View>

                                                        <View className="flex-row items-center gap-2">
                                                            <Ionicons
                                                                name="business-outline"
                                                                size={14}
                                                                color={colors.white}
                                                                style={{ opacity: 0.6 }}
                                                            />
                                                            <AppText
                                                                styles="text-sm text-white"
                                                                font="font-iregular"
                                                                style={{ opacity: 0.8 }}
                                                            >
                                                                {profile.account_details.bank_name}
                                                            </AppText>
                                                        </View>

                                                        <View className="flex-row items-center gap-2">
                                                            <Ionicons
                                                                name="card-outline"
                                                                size={14}
                                                                color={colors.white}
                                                                style={{ opacity: 0.6 }}
                                                            />
                                                            <AppText
                                                                styles="text-sm text-white"
                                                                font="font-iregular"
                                                                style={{ opacity: 0.8 }}
                                                            >
                                                                {profile.account_details.account_number}
                                                            </AppText>
                                                        </View>
                                                    </View>

                                                    {/* Actions */}
                                                    <View className="flex-row gap-3 pt-3 border-t" style={{ borderColor: colors.accent + "4D" }}>
                                                        <TouchableOpacity
                                                            onPress={() => handleEditProfile(profile.id)}
                                                            className="flex-1 flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl border-2"
                                                            style={{
                                                                backgroundColor: colors.primary100,
                                                                borderColor: colors.accent + "4D",
                                                            }}
                                                            activeOpacity={0.8}
                                                        >
                                                            <Ionicons name="create-outline" size={16} color={colors.white} />
                                                            <AppText styles="text-sm text-white" font="font-ibold">
                                                                Edit
                                                            </AppText>
                                                        </TouchableOpacity>

                                                        {!profile.is_default && (
                                                            <TouchableOpacity
                                                                onPress={() => handleDeleteProfile(profile.id, profile.name)}
                                                                className="px-4 py-3 rounded-xl border-2"
                                                                style={{
                                                                    backgroundColor: colors.accent + "1A",
                                                                    borderColor: colors.accent,
                                                                }}
                                                                activeOpacity={0.8}
                                                            >
                                                                <Ionicons name="trash-outline" size={16} color={colors.accent} />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    )}
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default PaymentProfilesScreen;