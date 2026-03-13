import { View, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import { PaymentTransaction } from "@/types/payments.types";
import colors from "@/config/colors";
import { getFullImageUrl } from "@/utils/imageUrl";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    payment: PaymentTransaction;
};

const PaymentHistoryCard = ({ payment }: Props) => {
    const formatMoney = useFormatMoney();
    const getPaymentMethodIcon = (): keyof typeof Ionicons.glyphMap => {
        if (payment.payment_method === "card") return "card";
        if (payment.payment_method === "mobile_money") return "phone-portrait";
        return "card";
    };

    const getStatusConfig = () => {
        switch (payment.status) {
            case "completed":
                return {
                    icon: "checkmark-circle" as const,
                    text: "Completed",
                    bg: "bg-emerald-500/20",
                    text_color: "text-emerald-400",
                    border: "border-emerald-500/30",
                };
            case "pending":
                return {
                    icon: "time" as const,
                    text: "Pending",
                    bg: "bg-amber-500/20",
                    text_color: "text-amber-400",
                    border: "border-amber-500/30",
                };
            case "failed":
                return {
                    icon: "close-circle" as const,
                    text: "Failed",
                    bg: "bg-red-500/20",
                    text_color: "text-red-400",
                    border: "border-red-500/30",
                };
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GH", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const statusConfig = getStatusConfig();

    return (
        <TouchableOpacity
            onPress={() => router.push(`/dashboard/payments/history/${payment.payment_id}` as any)}
            className="bg-white rounded-xl p-4 border border-slate-200 mb-3"
            activeOpacity={0.7}
        >
            {/* Header with Image and Status */}
            <View className="flex-row gap-3 mb-3">
                {/* Event Image */}
                <View className="w-20 h-20 rounded-lg overflow-hidden border-2 border-accent/30">
                    <Image
                        source={{ uri: getFullImageUrl(payment.event.featured_image) }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>

                {/* Event Info and Status */}
                <View className="flex-1">
                    <AppText
                        styles="text-base text-black mb-1 font-nunbold"
                        numberOfLines={2}
                    >
                        {payment.event.title}
                    </AppText>
                    <AppText styles="text-xs text-slate-700 mb-2">
                        {formatDate(payment.created_at)}
                    </AppText>
                    <View
                        className={`self-start flex-row items-center gap-1.5 px-2 py-1 rounded-lg ${statusConfig.bg} border ${statusConfig.border}`}
                    >
                        <Ionicons name={statusConfig.icon} size={14} color={statusConfig.text_color === "text-emerald-400" ? colors.success : statusConfig.text_color === "text-amber-400" ? colors.warning : colors.accent} />
                        <AppText
                            styles={`text-xs ${statusConfig.text_color} font-nunbold`}
                        >
                            {statusConfig.text}
                        </AppText>
                    </View>
                </View>
            </View>

            {/* Payment Details Grid */}
            <View className="flex-row flex-wrap gap-2 mb-3">
                {/* Amount */}
                <View className="flex-1 min-w-[100px] p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <AppText styles="text-xs text-slate-700 mb-1">
                        Amount
                    </AppText>
                    <AppText styles="text-base text-primary font-nunbold">
                        {formatMoney(payment.amount)}
                    </AppText>
                </View>

                {/* Tickets Count */}
                <View className="flex-1 min-w-[100px] p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <AppText styles="text-xs text-slate-700 mb-1">
                        Tickets
                    </AppText>
                    <AppText styles="text-base text-primary font-nunbold">
                        {payment.tickets.length}
                    </AppText>
                </View>
            </View>

            {/* Payment Method and Reference */}
            <View className="flex-row items-center justify-between pt-3 border-t border-accent/20">
                <View className="flex-row items-center gap-2">
                    <Ionicons name={getPaymentMethodIcon()} size={16} color={colors.primary200} />
                    <AppText styles="text-xs text-slate-700">
                        {payment.payment_method.replace("_", " ")}
                    </AppText>
                </View>
                <AppText styles="text-xs text-accent font-mono">
                    {payment.reference}
                </AppText>
            </View>

            {/* View Details Arrow */}
            <View className="absolute top-4 right-4">
                <Ionicons name="chevron-forward" size={20} color={colors.accent50} />
            </View>
        </TouchableOpacity>
    );
};

export default PaymentHistoryCard;
