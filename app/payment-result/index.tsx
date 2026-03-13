import { View, ActivityIndicator, TouchableOpacity, Image, ScrollView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Screen, AppText } from "@/components";
import colors from "@/config/colors";
import { verifyPayment } from "@/lib/tickets";
import { useFormatMoney } from "@/hooks/useFormatMoney";
import { getFullImageUrl } from "@/utils/imageUrl";

type PaymentStatus = "verifying" | "success" | "failed" | "error";

interface Ticket {
    ticket_id: string;
    attendee_name: string;
    qr_code?: string;
    attendee_info?: {
        name: string;
    };
}

interface PurchaseDetails {
    purchase_id: string;
    amount: number;
    ticket_count: number;
}

const PaymentResultScreen = () => {
    const formatMoney = useFormatMoney();
    const { reference } = useLocalSearchParams<{ reference: string }>();
    const [status, setStatus] = useState<PaymentStatus>("verifying");
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [purchaseDetails, setPurchaseDetails] = useState<PurchaseDetails | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!reference) {
            setStatus("error");
            setErrorMessage("No payment reference found");
            return;
        }

        verifyPaymentStatus(reference);
    }, [reference]);

    const verifyPaymentStatus = async (paymentReference: string) => {
        try {
            const data = await verifyPayment(paymentReference);

            if (data.success && data.status === "completed") {
                setStatus("success");
                setTickets(data.tickets || []);
                setPurchaseDetails({
                    purchase_id: data.purchase_id,
                    amount: data.amount,
                    ticket_count: data.ticket_count,
                });
            } else {
                setStatus("failed");
                setErrorMessage(data.message || "Payment verification failed");
            }
        } catch (error) {
            console.error("Verification error:", error);
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Failed to verify payment. Please contact support.");
        }
    };

    // Verifying State
    if (status === "verifying") {
        return (
            <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
                <View className="flex-1 items-center justify-center px-4">
                    <View
                        className="w-full max-w-md p-8 rounded-2xl items-center"
                        style={{ backgroundColor: colors.primary100, borderWidth: 2, borderColor: colors.accent }}
                    >
                        <View
                            className="w-16 h-16 mb-4 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.accent + "33" }}
                        >
                            <ActivityIndicator size="large" color={colors.accent50} />
                        </View>
                        <AppText styles="text-xl text-black text-center mb-2 font-nunbold">
                            Verifying Payment
                        </AppText>
                        <AppText styles="text-sm text-slate-300 text-center">
                            Please wait while we confirm your payment...
                        </AppText>
                    </View>
                </View>
            </Screen>
        );
    }

    // Success State
    if (status === "success") {
        return (
            <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
                <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                    {/* Success Header */}
                    <View
                        className="p-6 rounded-2xl mb-4"
                        style={{ backgroundColor: colors.primary100, borderWidth: 2, borderColor: colors.success }}
                    >
                        <View
                            className="w-20 h-20 mx-auto mb-4 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.success + "33" }}
                        >
                            <Ionicons name="checkmark-circle" size={48} color={colors.success} />
                        </View>
                        <AppText styles="text-2xl text-black text-center mb-2 font-nunbold">
                            Payment Successful! 🎉
                        </AppText>
                        <AppText styles="text-sm text-slate-300 text-center mb-4">
                            Your tickets have been confirmed and sent to your email.
                        </AppText>
                        <View
                            className="px-4 py-2 rounded-lg self-center"
                            style={{ backgroundColor: colors.primary200 }}
                        >
                            <View className="flex-row items-center gap-2">
                                <AppText styles="text-xs text-slate-400">
                                    Purchase ID:
                                </AppText>
                                <AppText styles="text-sm text-black font-nunbold">
                                    {purchaseDetails?.purchase_id}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Purchase Summary */}
                    <View
                        className="p-4 rounded-2xl mb-4"
                        style={{ backgroundColor: colors.primary100, borderWidth: 1, borderColor: colors.accent + "4D" }}
                    >
                        <AppText styles="text-lg text-black mb-4 font-nunbold">
                            Purchase Summary
                        </AppText>
                        <View className="flex-row gap-4">
                            <View className="flex-1">
                                <AppText styles="text-xs text-slate-400 mb-1">
                                    Total Paid
                                </AppText>
                                <AppText styles="text-xl text-accent-50 font-nunbold">
                                    {formatMoney(purchaseDetails?.amount || 0)}
                                </AppText>
                            </View>
                            <View className="flex-1">
                                <AppText styles="text-xs text-slate-400 mb-1">
                                    Tickets
                                </AppText>
                                <AppText styles="text-xl text-black font-nunbold">
                                    {purchaseDetails?.ticket_count} Ticket
                                    {purchaseDetails && purchaseDetails.ticket_count > 1 ? "s" : ""}
                                </AppText>
                            </View>
                        </View>
                    </View>

                    {/* Tickets Display */}
                    <View
                        className="p-4 rounded-2xl mb-4"
                        style={{ backgroundColor: colors.primary100, borderWidth: 1, borderColor: colors.accent + "4D" }}
                    >
                        <View className="flex-row items-center gap-3 mb-4">
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center"
                                style={{ backgroundColor: colors.accent + "33" }}
                            >
                                <Ionicons name="ticket" size={20} color={colors.accent50} />
                            </View>
                            <AppText styles="text-lg text-black font-nunbold">
                                Your Tickets
                            </AppText>
                        </View>

                        <View className="gap-3">
                            {tickets.map((ticket, index) => (
                                <View
                                    key={ticket.ticket_id}
                                    className="p-4 rounded-xl"
                                    style={{ backgroundColor: colors.primary200, borderWidth: 1, borderColor: colors.accent + "33" }}
                                >
                                    <View className="flex-row items-start justify-between gap-4">
                                        <View className="flex-1">
                                            <AppText styles="text-xs text-slate-400 mb-1">
                                                Ticket #{index + 1}
                                            </AppText>
                                            <AppText styles="text-sm text-black mb-1 font-nunbold">
                                                {ticket.ticket_id}
                                            </AppText>
                                            <AppText styles="text-xs text-slate-300">
                                                {ticket.attendee_info?.name || ticket.attendee_name}
                                            </AppText>
                                        </View>
                                        {ticket.qr_code && (
                                            <View className="bg-white p-2 rounded-lg">
                                                <Image
                                                    source={{ uri: getFullImageUrl(ticket.qr_code) || undefined }}
                                                    style={{ width: 80, height: 80 }}
                                                    resizeMode="contain"
                                                />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="gap-3 mb-4">
                        <TouchableOpacity
                            onPress={() => router.push("/dashboard/tickets")}
                            className="py-4 px-6 rounded-xl items-center"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-black font-nunbold">
                                View All My Tickets
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/")}
                            className="py-4 px-6 rounded-xl items-center flex-row justify-center gap-2"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.8}
                        >
                            <Ionicons name="home" size={20} color={colors.white} />
                            <AppText styles="text-sm text-black font-nunbold">
                                Browse Events
                            </AppText>
                        </TouchableOpacity>
                    </View>

                    {/* Important Note */}
                    <View
                        className="p-4 rounded-xl"
                        style={{ backgroundColor: colors.accent + "1A", borderWidth: 1, borderColor: colors.accent + "4D" }}
                    >
                        <AppText styles="text-xs text-slate-300 text-center">
                            📧 A confirmation email with your tickets has been sent to your email address. Please check
                            your inbox and spam folder.
                        </AppText>
                    </View>
                </ScrollView>
            </Screen>
        );
    }

    // Failed or Error State
    return (
        <Screen statusBarStyle="light-content" statusBarBg={colors.primary}>
            <View className="flex-1 items-center justify-center px-4">
                <View
                    className="w-full max-w-md p-8 rounded-2xl"
                    style={{ backgroundColor: colors.primary100, borderWidth: 2, borderColor: colors.error }}
                >
                    <View
                        className="w-16 h-16 mx-auto mb-4 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.error + "33" }}
                    >
                        <Ionicons name="close-circle" size={48} color={colors.error} />
                    </View>
                    <AppText styles="text-xl text-black text-center mb-2 font-nunbold">
                        {status === "failed" ? "Payment Failed" : "Something Went Wrong"}
                    </AppText>
                    <AppText styles="text-sm text-slate-300 text-center mb-6">
                        {errorMessage || "We couldn't complete your payment. Please try again or contact support."}
                    </AppText>
                    <View className="gap-3">
                        <TouchableOpacity
                            onPress={() => router.push("/")}
                            className="py-3 px-4 rounded-xl items-center"
                            style={{ backgroundColor: colors.accent }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-black font-nunbold">
                                Back to Events
                            </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => router.push("/contact")}
                            className="py-3 px-4 rounded-xl items-center"
                            style={{ backgroundColor: colors.primary200 }}
                            activeOpacity={0.8}
                        >
                            <AppText styles="text-sm text-black font-nunbold">
                                Contact Support
                            </AppText>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Screen>
    );
};

export default PaymentResultScreen;
