import { View, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Screen, AppText, Nav, FormLoader, PaymentDetailsHeader, PaymentEventDetails, PaymentMethodInfo, PaymentTicketsList, PaymentBillingInfo, PaymentPriceBreakdown } from "@/components";
import { getPaymentDetailsById } from "@/lib/dashboard";
import { PaymentDetails } from "@/types/payments.types";
import colors from "@/config/colors";

const PaymentDetailsScreen = () => {
    const { payment_id } = useLocalSearchParams<{ payment_id: string }>();

    const [payment, setPayment] = useState<PaymentDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPaymentDetails = async () => {
            if (!payment_id) {
                setError("Payment ID is missing");
                setIsLoading(false);
                return;
            }

            try {
                const data = await getPaymentDetailsById(payment_id);

                if (!data) {
                    setError("Payment details not found");
                } else {
                    setPayment(data);
                }
            } catch (err) {
                console.error("Error fetching payment details:", err);
                setError(err instanceof Error ? err.message : "Failed to load payment details");
            } finally {
                setIsLoading(false);
            }
        };

        fetchPaymentDetails();
    }, [payment_id]);

    // Error State
    if (error && !isLoading) {
        return (
            <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
                <Nav title="Payment Details" />
                <View className="flex-1 items-center justify-center px-4">
                    <View className="items-center max-w-md">
                        {/* Icon */}
                        <View className="w-20 h-20 rounded-2xl bg-red-500/10 items-center justify-center mb-6">
                            <Ionicons name="alert-circle" size={40} color={colors.accent} />
                        </View>

                        {/* Title */}
                        <AppText styles="text-xl text-black mb-3 text-center font-nunbold">
                            Payment Details Not Found
                        </AppText>

                        {/* Description */}
                        <AppText styles="text-sm text-slate-300 mb-8 text-center">
                            The payment details you're looking for don't exist or may have been removed.
                        </AppText>

                        {/* Actions */}
                        <View className="gap-3 w-full">
                            <TouchableOpacity
                                onPress={() => router.push("/dashboard/payments/history")}
                                className="px-6 py-3 bg-accent rounded-xl"
                                activeOpacity={0.7}
                            >
                                <AppText styles="text-sm text-black text-center font-nunbold">
                                    View All Payments
                                </AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => router.push("/dashboard")}
                                className="px-6 py-3 bg-primary-100 rounded-xl border-2 border-accent/30"
                                activeOpacity={0.7}
                            >
                                <AppText styles="text-sm text-black text-center font-nunbold">
                                    Go to Dashboard
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Screen>
        );
    }

    return (
        <Screen statusBarStyle="dark-content" statusBarBg={colors.primary}>
            <Nav title="Payment Details" />

            {payment && (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                >
                    <PaymentDetailsHeader payment={payment} />
                    <PaymentEventDetails payment={payment} />
                    <PaymentMethodInfo payment={payment} />
                    <PaymentTicketsList tickets={payment.tickets} />
                    <PaymentBillingInfo billing={payment.billing_info} />
                    <PaymentPriceBreakdown breakdown={payment.breakdown} />
                </ScrollView>
            )}

            <FormLoader visible={isLoading} />
        </Screen>
    );
};

export default PaymentDetailsScreen;
