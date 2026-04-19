import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFormikContext } from "formik";
import { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import AppText from "../../../ui/AppText";
import type { EventFormValues } from "@/data/eventCreationSchema";
import type { PaymentProfile } from "@/types/payments.types";
import { getMyPaymentProfiles } from "@/lib/dashboard";
import colors from "@/config/colors";

const EventPaymentProfileSection = () => {
    const { values, setFieldValue } = useFormikContext<EventFormValues>();
    const [profiles, setProfiles] = useState<PaymentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const selectedCardBg = "#047857";
    const selectedCardBorder = "#10B981";

    const fetchProfiles = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getMyPaymentProfiles();

            // Handle null response
            if (!data || !data.results) {
                setProfiles([]);
                return;
            }

            const verifiedProfiles = data.results.filter((p) => p.is_verified);
            setProfiles(verifiedProfiles);

            // Auto-select default profile
            const defaultProfile = verifiedProfiles.find((p) => p.is_default);
            if (!values.payment_profile_id && defaultProfile) {
                setFieldValue("payment_profile_id", defaultProfile.id);
            }
        } catch (error) {
            console.error("Failed to fetch payment profiles:", error);
            setProfiles([]);
        } finally {
            setIsLoading(false);
        }
    }, [setFieldValue, values.payment_profile_id]);

    useEffect(() => {
        void fetchProfiles();
    }, [fetchProfiles]);

    useFocusEffect(
        useCallback(() => {
            void fetchProfiles();
        }, [fetchProfiles])
    );

    const hasVerifiedProfiles = profiles.length > 0;

    if (isLoading) {
        return (
            <View className="gap-4">
                {/* Section Header */}
                <View className="flex-row items-center gap-3">
                    <View
                        className="w-10 h-10 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="wallet-outline" size={20} color={colors.accent50} />
                    </View>
                    <View className="flex-1">
                        <AppText styles="text-base text-black" font="font-ibold">
                            Payment Profile
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                            Where to receive revenue
                        </AppText>
                    </View>
                </View>

                <View
                    className="flex-row items-center gap-3 p-4 rounded-xl"
                    style={{ backgroundColor: colors.primary100 }}
                    accessible
                    accessibilityLabel="Loading payment profiles"
                >
                    <ActivityIndicator size="small" color={colors.accent} />
                    <AppText styles="text-sm text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Loading payment profiles...
                    </AppText>
                </View>
            </View>
        );
    }

    return (
        <View className="gap-4">
            {/* Section Header */}
            <View className="flex-row items-center gap-3">
                <View
                    className="w-10 h-10 rounded-lg items-center justify-center"
                    style={{ backgroundColor: colors.accent + "33" }}
                >
                    <Ionicons name="wallet-outline" size={20} color={colors.accent50} />
                </View>
                <View className="flex-1">
                    <AppText styles="text-base text-black" font="font-ibold">
                        Payment Profile
                    </AppText>
                    <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                        Where to receive revenue
                    </AppText>
                </View>
            </View>

            {/* No Verified Profiles Warning */}
            {!hasVerifiedProfiles && (
                <View
                    className="p-4 rounded-xl border-2"
                    style={{ backgroundColor: colors.accent + "1A", borderColor: colors.accent }}
                >
                    <View className="flex-row items-start gap-3 mb-4">
                        <Ionicons name="alert-circle" size={20} color={colors.accent} />
                        <View className="flex-1">
                            <AppText styles="text-sm text-black mb-2" font="font-ibold" style={{ color: colors.accent }}>
                                No Verified Payment Profile
                            </AppText>
                            <AppText styles="text-xs text-black mb-4" font="font-iregular" style={{ opacity: 0.8 }}>
                                You need at least one verified payment profile to receive ticket revenue.
                            </AppText>
                            <TouchableOpacity
                                onPress={() => router.push("/dashboard/payments/profiles/create")}
                                className="flex-row items-center gap-2 px-4 py-3 rounded-lg"
                                style={{ backgroundColor: colors.accent }}
                                activeOpacity={0.8}
                                accessibilityRole="button"
                                accessibilityLabel="Create payment profile"
                                accessibilityHint="Opens payment profile creation screen"
                            >
                                <Ionicons name="add-circle-outline" size={18} color={colors.white} />
                                <AppText styles="text-sm text-white" font="font-ibold">
                                    Create Payment Profile
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Verified Profiles List */}
            {hasVerifiedProfiles && (
                <>
                    <View className="flex-row items-center justify-between mb-2">
                        <AppText styles="text-sm text-black" font="font-isemibold">
                            Select Payment Profile
                        </AppText>
                        <TouchableOpacity
                            onPress={() => router.push("/dashboard/payments/profiles")}
                            activeOpacity={0.7}
                            accessibilityRole="button"
                            accessibilityLabel="Manage payment profiles"
                            accessibilityHint="Opens payment profiles management screen"
                        >
                            <AppText styles="text-xs text-accent-50" font="font-isemibold">
                                Manage Profiles
                            </AppText>
                        </TouchableOpacity>
                    </View>

                    <View className="gap-3">
                        {profiles.map((profile) => {
                            const accountDetails = profile.account_details as any;
                            const isSelected = values.payment_profile_id === profile.id;

                            return (
                                <TouchableOpacity
                                    key={profile.id}
                                    onPress={() => setFieldValue("payment_profile_id", profile.id)}
                                    className="p-4 rounded-xl border-2"
                                    style={{
                                        backgroundColor: isSelected ? selectedCardBg : colors.primary100,
                                        borderColor: isSelected ? selectedCardBorder : colors.accent + "4D",
                                    }}
                                    activeOpacity={0.7}
                                    accessibilityRole="radio"
                                    accessibilityState={{ selected: isSelected }}
                                    accessibilityLabel={`Payment profile ${profile.name}${profile.is_default ? ", default" : ""}`}
                                    accessibilityHint="Select this profile to receive event revenue"
                                >
                                    <View className="flex-row items-start gap-3">
                                        {/* Radio Button */}
                                        <View
                                            className="w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5"
                                            style={{
                                                borderColor: isSelected ? colors.accent : colors.white + "80",
                                            }}
                                        >
                                            {isSelected && (
                                                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.accent }} />
                                            )}
                                        </View>

                                        {/* Profile Details */}
                                        <View className="flex-1">
                                            {/* Method Icon & Name */}
                                            <View className="flex-row items-center gap-2 mb-2">
                                                <View
                                                    className="w-8 h-8 rounded-lg items-center justify-center"
                                                    style={{
                                                        backgroundColor: colors.accent + "33",
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={"business-outline"}
                                                        size={16}
                                                        color={colors.accent50}
                                                    />
                                                </View>

                                                <AppText styles="text-sm text-white" font="font-ibold">
                                                    {profile.name}
                                                </AppText>

                                                {profile.is_default && (
                                                    <View
                                                        className="px-2 py-0.5 rounded"
                                                        style={{ backgroundColor: colors.accent + "33" }}
                                                    >
                                                        <AppText
                                                            styles={`text-xs ${isSelected ? "text-white" : "text-accent-50"}`}
                                                            font="font-isemibold"
                                                        >
                                                            Default
                                                        </AppText>
                                                    </View>
                                                )}
                                            </View>

                                            {/* Account Details */}
                                            <View className="gap-1">
                                                <AppText
                                                    styles="text-xs text-white"
                                                    font="font-iregular"
                                                    style={{ opacity: 0.6 }}
                                                >
                                                    Bank:{" "}
                                                    <AppText styles="text-xs text-white" font="font-isemibold">
                                                        {accountDetails?.bank_name}
                                                    </AppText>
                                                </AppText>
                                                <AppText
                                                    styles="text-xs text-white"
                                                    font="font-iregular"
                                                    style={{ opacity: 0.6 }}
                                                >
                                                    Account:{" "}
                                                    <AppText styles="text-xs text-white" font="font-imedium">
                                                        {accountDetails?.account_number}
                                                    </AppText>
                                                </AppText>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </>
            )}

            {/* Info Note */}
            <View
                className="p-3 rounded-lg border flex-row items-start gap-2"
                style={{ backgroundColor: colors.primary200 + "80", borderColor: colors.accent + "4D" }}
            >
                <Ionicons name="information-circle-outline" size={16} color={colors.accent50} style={{ marginTop: 2 }} />
                <View className="flex-1">
                    <AppText styles="text-xs text-black mb-1" font="font-isemibold" style={{ opacity: 0.9 }}>
                        How Payment Works
                    </AppText>
                    <View className="gap-1">
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Revenue sent to selected profile
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Platform fee (5%) deducted
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.7 }}>
                            • Immediate after ticket purchase
                        </AppText>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default EventPaymentProfileSection;
