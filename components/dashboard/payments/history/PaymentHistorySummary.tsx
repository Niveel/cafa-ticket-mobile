import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../../ui/AppText";
import { PaymentSummary } from "@/types/payments.types";
import colors from "@/config/colors";
import { useFormatMoney } from "@/hooks/useFormatMoney";

type Props = {
    summary: PaymentSummary;
};

type CardData = {
    title: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    iconBg: string;
    iconColor: string;
    subtitle: string;
};

const PaymentHistorySummary = ({ summary }: Props) => {
    const formatMoney = useFormatMoney();
    const cards: CardData[] = [
        {
            title: "Total Spent",
            value: formatMoney(summary.total_spent),
            icon: "cash",
            iconBg: "bg-accent/20",
            iconColor: colors.accent50,
            subtitle: "All time spending",
        },
        {
            title: "Total Transactions",
            value: summary.total_transactions.toString(),
            icon: "swap-horizontal",
            iconBg: "bg-blue-500/20",
            iconColor: colors.primary200,
            subtitle: "All payments",
        },
        {
            title: "Completed",
            value: summary.completed_transactions.toString(),
            icon: "checkmark-circle",
            iconBg: "bg-emerald-500/20",
            iconColor: colors.success,
            subtitle: "Successful",
        },
        {
            title: "Pending",
            value: summary.pending_transactions.toString(),
            icon: "time",
            iconBg: "bg-amber-500/20",
            iconColor: colors.warning,
            subtitle: "Processing",
        },
    ];

    const failedTransactions =
        summary.total_transactions -
        summary.completed_transactions -
        summary.pending_transactions;

    if (failedTransactions > 0) {
        cards.push({
            title: "Failed",
            value: failedTransactions.toString(),
            icon: "close-circle",
            iconBg: "bg-red-500/20",
            iconColor: colors.accent,
            subtitle: "Failed payments",
        });
    }

    return (
        <View className="px-4 mb-6">
            <View className="flex-row flex-wrap gap-3">
                {cards.map((card, index) => (
                    <View
                        key={index}
                        className="flex-1 min-w-[160px] bg-white rounded-xl p-4 border border-slate-200"
                    >
                        <View className="flex-row items-start justify-between mb-3">
                            <View className="flex-1">
                                <AppText styles="text-xs text-slate-700 mb-2">
                                    {card.title}
                                </AppText>
                                <AppText styles="text-xl text-primary mb-1 font-nunbold">
                                    {card.value}
                                </AppText>
                                <AppText styles="text-xs text-slate-600">
                                    {card.subtitle}
                                </AppText>
                            </View>
                            <View className={`w-10 h-10 rounded-xl ${card.iconBg} items-center justify-center`}>
                                <Ionicons name={card.icon} size={20} color={card.iconColor} />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PaymentHistorySummary;
