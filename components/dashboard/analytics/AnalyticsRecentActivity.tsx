import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import colors from "@/config/colors";

type Activity = {
    type: string;
    date: string;
    event_title: string;
    amount?: string;
};

type Props = {
    activities: Activity[];
};

const activityConfig: Record<string, { icon: string; color: string; label: string }> = {
    ticket_purchase: { icon: "cart-outline", color: "#3b82f6", label: "Ticket Purchased" },
    event_created: { icon: "add-circle-outline", color: "#a855f7", label: "Event Created" },
    ticket_sale: { icon: "cash-outline", color: "#10b981", label: "Ticket Sold" },
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-GH", {
        month: "short",
        day: "numeric",
        ...(date.getFullYear() !== now.getFullYear() ? { year: "numeric" } : {}),
    });
};

const AnalyticsRecentActivity = ({ activities }: Props) => {
    return (
        <View
            className="rounded-xl p-4 border-2"
            style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
        >
            {/* Header */}
            <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="time-outline" size={18} color={colors.accent50} />
                <AppText styles="text-sm text-white" font="font-ibold">
                    Recent Activity
                </AppText>
            </View>

            {activities.length === 0 ? (
                <View className="items-center py-6">
                    <Ionicons name="notifications-outline" size={32} color={colors.accent50} style={{ opacity: 0.4 }} />
                    <AppText styles="text-xs text-white mt-3 text-center" font="font-iregular" style={{ opacity: 0.5 }}>
                        No recent activity
                    </AppText>
                </View>
            ) : (
                <View className="gap-3">
                    {activities.map((activity, index) => {
                        const config = activityConfig[activity.type] || {
                            icon: "time-outline",
                            color: "#94a3b8",
                            label: "Activity",
                        };

                        return (
                            <View
                                key={index}
                                className="flex-row items-start gap-3 p-3 rounded-lg"
                                style={{ backgroundColor: colors.primary200 }}
                                accessibilityLabel={`${config.label}: ${activity.event_title}${activity.amount ? `. GH₵ ${activity.amount}` : ""}. ${formatDate(activity.date)}`}
                            >
                                <View
                                    className="w-9 h-9 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: config.color + "33" }}
                                >
                                    <Ionicons name={config.icon as any} size={18} color={config.color} />
                                </View>

                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between">
                                        <AppText styles="text-xs text-white" font="font-isemibold">
                                            {config.label}
                                        </AppText>
                                        <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.5 }}>
                                            {formatDate(activity.date)}
                                        </AppText>
                                    </View>
                                    <AppText
                                        styles="text-xs text-white mt-0.5"
                                        font="font-iregular"
                                        style={{ opacity: 0.7 }}
                                        numberOfLines={1}
                                    >
                                        {activity.event_title}
                                    </AppText>
                                    {activity.amount && (
                                        <AppText
                                            styles="text-xs mt-1"
                                            font="font-ibold"
                                            style={{ color: colors.accent50 }}
                                        >
                                            GH₵ {parseFloat(activity.amount).toLocaleString("en-GH", { minimumFractionDigits: 2 })}
                                        </AppText>
                                    )}
                                </View>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

export default AnalyticsRecentActivity;