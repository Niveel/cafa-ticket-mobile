import { View, ScrollView, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";

import { Screen, RequireAuth, Nav, AppText, EditPaymentProfileForm } from "@/components";
import { getMyPaymentProfiles } from "@/lib/dashboard";
import type { BankTransferPaymentProfile } from "@/types/payments.types";
import colors from "@/config/colors";

const EditPaymentProfileScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [profile, setProfile] = useState<BankTransferPaymentProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getMyPaymentProfiles();
                if (response) {
                    const foundProfile = response.results.find((p) => p.id === id);
                    if (foundProfile) {
                        setProfile(foundProfile);
                    } else {
                        setError("Payment profile not found");
                    }
                } else {
                    setError("Failed to load payment profiles");
                }
            } catch (err: any) {
                console.error("Error fetching profile:", err);
                setError(err.message || "Failed to load payment profile");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProfile();
        }
    }, [id]);

    return (
        <Screen>
            <RequireAuth>
                <Nav title="Edit Payment Profile" />

                <View className="flex-1">
                    {isLoading ? (
                        <View className="flex-1 items-center justify-center">
                            <ActivityIndicator size="large" color={colors.accent} />
                            <AppText styles="text-sm text-black mt-4" style={{ opacity: 0.6 }}>
                                Loading payment profile...
                            </AppText>
                        </View>
                    ) : error ? (
                        <View className="flex-1 items-center justify-center px-6">
                            <AppText styles="text-lg text-black mb-2 font-nunbold">
                                {error}
                            </AppText>
                            <AppText
                                styles="text-sm text-black mb-6"
                                style={{ opacity: 0.6, textAlign: "center" }}
                            >
                                We couldn't find the payment profile you're looking for.
                            </AppText>
                        </View>
                    ) : profile ? (
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                            <View className="p-2">
                                <EditPaymentProfileForm profile={profile} />
                            </View>
                        </ScrollView>
                    ) : null}
                </View>
            </RequireAuth>
        </Screen>
    );
};

export default EditPaymentProfileScreen;