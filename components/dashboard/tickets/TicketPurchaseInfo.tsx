import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";
import type { TicketPurchaseInfo as PurchaseInfoType } from "@/types/tickets.types";

type Props = {
    purchaseInfo: PurchaseInfoType;
};

const statusConfigs: Record<string, { icon: string; color: string; label: string }> = {
    completed: { icon: "checkmark-circle-outline", color: "#34d399", label: "Completed" },
    pending: { icon: "time-outline", color: "#fbbf24", label: "Pending" },
    failed: { icon: "close-circle-outline", color: "#f87171", label: "Failed" },
    refunded: { icon: "refresh-outline", color: "#60a5fa", label: "Refunded" },
};

const paymentMethodLabels: Record<string, string> = {
    card: "Credit/Debit Card",
    mobile_money: "Mobile Money",
    bank_transfer: "Bank Transfer",
};

const formatDateTime = (dateTime: string) =>
    new Date(dateTime).toLocaleString("en-GH", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

const TicketPurchaseInfo = ({ purchaseInfo }: Props) => {
    const status = statusConfigs[purchaseInfo.payment_status] || statusConfigs.completed;

    const rows = [
        {
            icon: "calendar-outline",
            label: "Purchase Date",
            value: formatDateTime(purchaseInfo.purchase_date),
        },
        {
            icon: "card-outline",
            label: "Payment Method",
            value: paymentMethodLabels[purchaseInfo.payment_method] || purchaseInfo.payment_method,
        },
        {
            icon: "receipt-outline",
            label: "Payment Reference",
            value: purchaseInfo.payment_reference,
            mono: true,
        },
    ];

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-3 mb-4">
                <View className="w-9 h-9 rounded-lg items-center justify-center" style={{ backgroundColor: "#10b98133" }}>
                    <Ionicons name="receipt-outline" size={18} color="#34d399" />
                </View>
                <View>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        Purchase Information
                    </AppText>
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                        Payment and transaction details
                    </AppText>
                </View>
            </View>

            {/* Rows */}
            <View className="gap-2">
                {rows.map((row) => (
                    <View
                        key={row.label}
                        className="flex-row items-center gap-3 p-3 rounded-lg"
                        style={{ backgroundColor: colors.primary200 }}
                        
                        accessibilityLabel={`${row.label}: ${row.value}`}
                    >
                        <Ionicons name={row.icon as any} size={18} color={colors.accent50} />
                        <View className="flex-1">
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                {row.label}
                            </AppText>
                            <AppText
                                styles="text-xs text-white"
                                font={row.mono ? "font-iregular" : "font-isemibold"}
                                style={row.mono ? { opacity: 0.8, fontFamily: "monospace" } : undefined}
                                numberOfLines={1}
                            >
                                {row.value}
                            </AppText>
                        </View>
                    </View>
                ))}

                {/* Payment Status */}
                <View
                    className="flex-row items-center gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary200 }}
                    
                    accessibilityLabel={`Payment Status: ${status.label}`}
                >
                    <Ionicons name={status.icon as any} size={18} color={status.color} />
                    <View className="flex-1">
                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                            Payment Status
                        </AppText>
                        <View
                            className="self-start mt-1 px-2.5 py-0.5 rounded-md border"
                            style={{
                                backgroundColor: status.color + "1A",
                                borderColor: status.color + "33",
                            }}
                        >
                            <AppText styles="text-xs" font="font-isemibold" style={{ color: status.color }}>
                                {status.label}
                            </AppText>
                        </View>
                    </View>
                </View>

                {/* Amount */}
                <View
                    className="flex-row items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: colors.primary200 }}
                    accessibilityLabel={`Amount Paid: ${purchaseInfo.currency} ${purchaseInfo.amount_paid}`}
                >
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Amount Paid
                    </AppText>
                    <AppText styles="text-sm text-white" font="font-ibold">
                        {purchaseInfo.currency} {parseFloat(purchaseInfo.amount_paid).toLocaleString("en-GH")}
                    </AppText>
                </View>
            </View>
        </View>
    );
};

export default TicketPurchaseInfo;