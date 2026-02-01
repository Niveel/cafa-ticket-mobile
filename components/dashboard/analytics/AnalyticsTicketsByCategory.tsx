import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";

type Category = {
    category: string;
    count: number;
    total_spent: string;
};

type Props = {
    ticketsByCategory: Category[];
    totalSpent: string;
};

const categoryColors = [
    colors.accent,
    "#a855f7",
    "#10b981",
    "#3b82f6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
];

const AnalyticsTicketsByCategory = ({ ticketsByCategory, totalSpent }: Props) => {
    const totalSpentNum = parseFloat(totalSpent);
    const maxSpent = Math.max(...ticketsByCategory.map((cat) => parseFloat(cat.total_spent)));

    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="trending-up-outline" size={18} color={colors.accent50} />
                <AppText styles="text-sm text-white" font="font-ibold">
                    Tickets by Category
                </AppText>
            </View>

            {/* Total Spent Pill */}
            <View
                className="flex-row items-center justify-between p-3 rounded-lg mb-4"
                style={{ backgroundColor: colors.primary200 }}
            >
                <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                    Total Spent
                </AppText>
                <AppText styles="text-sm text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                    GH₵ {totalSpentNum.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                </AppText>
            </View>

            {ticketsByCategory.length === 0 ? (
                <View className="items-center py-6">
                    <Ionicons name="ticket-outline" size={32} color={colors.accent50} style={{ opacity: 0.4 }} />
                    <AppText styles="text-xs text-white mt-3 text-center" font="font-iregular" style={{ opacity: 0.5 }}>
                        No ticket purchases yet
                    </AppText>
                </View>
            ) : (
                <View className="gap-4">
                    {ticketsByCategory.map((category, index) => {
                        const spent = parseFloat(category.total_spent);
                        const percentage = totalSpentNum > 0 ? (spent / totalSpentNum) * 100 : 0;
                        const barWidth = maxSpent > 0 ? (spent / maxSpent) * 100 : 0;
                        const color = categoryColors[index % categoryColors.length];

                        return (
                            <View
                                key={index}
                                accessibilityLabel={`${category.category}: ${category.count} tickets, GH₵ ${category.total_spent}, ${percentage.toFixed(1)}% of total`}
                            >
                                <View className="flex-row items-center justify-between mb-2">
                                    <View className="flex-row items-center gap-2">
                                        <View
                                            className="w-8 h-8 rounded-lg items-center justify-center"
                                            style={{ backgroundColor: color + "33" }}
                                        >
                                            <AppText styles="text-xs" font="font-ibold" style={{ color }}>
                                                {category.count}
                                            </AppText>
                                        </View>
                                        <View>
                                            <AppText styles="text-xs text-white" font="font-isemibold">
                                                {category.category}
                                            </AppText>
                                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                                {category.count} {category.count === 1 ? "ticket" : "tickets"}
                                            </AppText>
                                        </View>
                                    </View>
                                    <View className="items-end">
                                        <AppText styles="text-xs text-white" font="font-ibold" style={{ color: colors.accent50 }}>
                                            GH₵ {spent.toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                                        </AppText>
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                            {percentage.toFixed(1)}%
                                        </AppText>
                                    </View>
                                </View>

                                {/* Progress Bar */}
                                <View className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: colors.primary200 }}>
                                    <View
                                        className="h-full rounded-full"
                                        style={{ width: `${barWidth}%`, backgroundColor: color }}
                                    />
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default AnalyticsTicketsByCategory;