import { View, ScrollView, TouchableOpacity, Modal, ActivityIndicator, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";

import { AppText } from "@/components";
import { TicketType, EventDetails } from "@/types";
import { CurrentUser } from "@/types/general.types";
import colors from "@/config/colors";
import { API_BASE_URL } from "@/lib";

interface TicketPurchaseModalProps {
    visible: boolean;
    ticket: TicketType;
    quantity: number;
    event: EventDetails;
    currentUser: CurrentUser | null;
    onClose: () => void;
}

const TicketPurchaseModal = ({ visible, ticket, quantity, event, currentUser, onClose }: TicketPurchaseModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const subtotal = parseFloat(ticket.price) * quantity;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + serviceFee;

    // Login required
    if (!currentUser) {
        return (
            <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
                <View className="flex-1 bg-black/80 justify-center px-4">
                    <View className="bg-primary-100 rounded-2xl p-6" style={{ borderWidth: 2, borderColor: colors.accent }}>
                        <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-primary-200 items-center justify-center">
                            <Ionicons name="close" size={20} color={colors.white} />
                        </TouchableOpacity>

                        <View className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 items-center justify-center">
                            <Ionicons name="alert-circle-outline" size={32} color="#fbbf24" />
                        </View>

                        <AppText styles="text-lg text-white text-center mb-3" font="font-ibold">Login Required</AppText>
                        <AppText styles="text-sm text-slate-300 text-center mb-6 leading-relaxed" font="font-iregular">
                            You need to be logged in to purchase tickets. Please login or create an account to continue.
                        </AppText>

                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={() => router.push("/login")} className="flex-1 py-3 px-4 bg-accent rounded-xl items-center" activeOpacity={0.8}>
                                <AppText styles="text-sm text-white" font="font-ibold">Login</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push("/signup")} className="flex-1 py-3 px-4 bg-primary-200 rounded-xl items-center" activeOpacity={0.8}>
                                <AppText styles="text-sm text-white" font="font-ibold">Sign Up</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Phone required
    if (!currentUser.phone_number) {
        return (
            <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
                <View className="flex-1 bg-black/80 justify-center px-4">
                    <View className="bg-primary-100 rounded-2xl p-6" style={{ borderWidth: 2, borderColor: colors.accent }}>
                        <TouchableOpacity onPress={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-primary-200 items-center justify-center">
                            <Ionicons name="close" size={20} color={colors.white} />
                        </TouchableOpacity>

                        <View className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 items-center justify-center">
                            <Ionicons name="person-outline" size={32} color="#fbbf24" />
                        </View>

                        <AppText styles="text-lg text-white text-center mb-3" font="font-ibold">Complete Your Profile</AppText>
                        <AppText styles="text-sm text-slate-300 text-center mb-6 leading-relaxed" font="font-iregular">
                            Please add your phone number to your profile before purchasing tickets. This is required for ticket delivery and event updates.
                        </AppText>

                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={onClose} className="flex-1 py-3 px-4 bg-primary-200 rounded-xl items-center" activeOpacity={0.8}>
                                <AppText styles="text-sm text-white" font="font-ibold">Cancel</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => router.push("/dashboard/profile/edit")} className="flex-1 py-3 px-4 bg-accent rounded-xl items-center" activeOpacity={0.8}>
                                <AppText styles="text-sm text-white" font="font-ibold">Update Profile</AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }

    // Main purchase modal
    const handlePurchase = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            const response = await fetch(`${API_BASE_URL}/payments/initiate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event_slug: event.slug,
                    ticket_type_id: ticket.id,
                    quantity,
                    attendee_info: {
                        name: currentUser.full_name,
                        email: currentUser.email,
                        phone: currentUser.phone_number,
                    },
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Failed to initiate purchase");

            if (data.payment?.payment_url) {
                await Linking.openURL(data.payment.payment_url);
                onClose();
            } else {
                throw new Error("Payment URL not received");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to process purchase");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View className="flex-1 bg-black/80 justify-end">
                <View className="bg-primary-100 rounded-t-3xl max-h-[90%]" style={{ borderTopWidth: 2, borderColor: colors.accent }}>
                    {/* Header */}
                    <View className="p-4 flex-row items-center justify-between" style={{ borderBottomWidth: 1, borderColor: colors.accent + "30" }}>
                        <View className="flex-row items-center gap-3">
                            <View className="w-12 h-12 rounded-xl bg-accent/20 items-center justify-center">
                                <Ionicons name="cart-outline" size={24} color={colors.accent50} />
                            </View>
                            <View>
                                <AppText styles="text-lg text-white" font="font-ibold">Confirm Purchase</AppText>
                                <AppText styles="text-xs text-slate-400" font="font-iregular">{event.title}</AppText>
                            </View>
                        </View>
                        <TouchableOpacity onPress={onClose} disabled={isProcessing} className="w-10 h-10 rounded-xl bg-primary-200 items-center justify-center">
                            <Ionicons name="close" size={20} color={colors.white} />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Content */}
                    <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                        {error && (
                            <View className="p-4 bg-red-500/10 rounded-xl mb-4" style={{ borderWidth: 1, borderColor: "#ef4444" }}>
                                <AppText styles="text-sm text-red-400" font="font-iregular">{error}</AppText>
                            </View>
                        )}

                        {/* Ticket Details */}
                        <View className="mb-4">
                            <AppText styles="text-base text-white mb-3" font="font-ibold">Ticket Details</AppText>
                            <View className="p-4 bg-primary-200 rounded-xl" style={{ gap: 12 }}>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Ticket Type</AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">{ticket.name}</AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Quantity</AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">{quantity}</AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Price per ticket</AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">GH₵ {parseFloat(ticket.price).toFixed(2)}</AppText>
                                </View>
                            </View>
                        </View>

                        {/* Attendee Info */}
                        <View className="mb-4">
                            <AppText styles="text-base text-white mb-3" font="font-ibold">Attendee Information</AppText>
                            <View className="p-4 bg-primary-200 rounded-xl" style={{ gap: 12 }}>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Name</AppText>
                                    <AppText styles="text-sm text-white text-right flex-1 ml-4" font="font-isemibold" numberOfLines={1}>{currentUser.full_name}</AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Email</AppText>
                                    <AppText styles="text-sm text-white text-right flex-1 ml-4" font="font-isemibold" numberOfLines={1}>{currentUser.email}</AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Phone</AppText>
                                    <AppText styles="text-sm text-white" font="font-isemibold">{currentUser.phone_number}</AppText>
                                </View>
                            </View>
                        </View>

                        {/* Price Breakdown */}
                        <View className="mb-4">
                            <AppText styles="text-base text-white mb-3" font="font-ibold">Price Breakdown</AppText>
                            <View className="p-4 bg-primary-200 rounded-xl" style={{ gap: 12 }}>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Subtotal</AppText>
                                    <AppText styles="text-sm text-white" font="font-iregular">GH₵ {subtotal.toFixed(2)}</AppText>
                                </View>
                                <View className="flex-row justify-between">
                                    <AppText styles="text-sm text-slate-400" font="font-iregular">Service Fee (5%)</AppText>
                                    <AppText styles="text-sm text-white" font="font-iregular">GH₵ {serviceFee.toFixed(2)}</AppText>
                                </View>
                                <View style={{ height: 1, backgroundColor: colors.accent + "30" }} />
                                <View className="flex-row justify-between">
                                    <AppText styles="text-base text-white" font="font-ibold">Total</AppText>
                                    <AppText styles="text-xl text-accent-50" font="font-ibold">GH₵ {total.toFixed(2)}</AppText>
                                </View>
                            </View>
                        </View>

                        {/* Notice */}
                        <View className="p-4 bg-blue-500/10 rounded-xl" style={{ borderWidth: 1, borderColor: "#3b82f6" }}>
                            <View className="flex-row items-start gap-3">
                                <Ionicons name="information-circle-outline" size={20} color="#60a5fa" />
                                <View className="flex-1">
                                    <AppText styles="text-xs text-blue-300 mb-1" font="font-isemibold">Important:</AppText>
                                    <AppText styles="text-xs text-blue-300 leading-relaxed" font="font-iregular">
                                        You will be redirected to Paystack to complete your payment securely. Your tickets will be reserved for 10 minutes.
                                    </AppText>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer */}
                    <View className="p-4 bg-primary-200" style={{ borderTopWidth: 1, borderColor: colors.accent + "30" }}>
                        <View className="flex-row gap-3">
                            <TouchableOpacity onPress={onClose} disabled={isProcessing} className="flex-1 py-3 px-4 bg-primary-100 rounded-xl items-center" activeOpacity={0.8}>
                                <AppText styles="text-sm text-white" font="font-ibold">Cancel</AppText>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={handlePurchase}
                                disabled={isProcessing}
                                className="flex-1 py-3 px-4 rounded-xl items-center flex-row justify-center gap-2"
                                style={{ backgroundColor: colors.accent, opacity: isProcessing ? 0.5 : 1 }}
                                activeOpacity={0.8}
                            >
                                {isProcessing ? (
                                    <>
                                        <ActivityIndicator size="small" color={colors.white} />
                                        <AppText styles="text-sm text-white" font="font-ibold">Processing...</AppText>
                                    </>
                                ) : (
                                    <>
                                        <Ionicons name="card-outline" size={16} color={colors.white} />
                                        <AppText styles="text-sm text-white" font="font-ibold">Proceed to Payment</AppText>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TicketPurchaseModal;