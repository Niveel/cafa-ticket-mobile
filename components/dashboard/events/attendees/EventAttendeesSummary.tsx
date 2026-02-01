import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppText } from "@/components";
import type { EventAttendees } from "@/types/dash-events.types";
import colors from "@/config/colors";

interface EventAttendeesSummaryProps {
    summary: EventAttendees["summary"];
}

const EventAttendeesSummary = ({ summary }: EventAttendeesSummaryProps) => {
    const cards = [
        {
            title: "Total Attendees",
            value: summary.total_attendees.toString(),
            icon: "people-outline" as const,
            iconBg: colors.primary200 + "80",
            iconColor: colors.accent50,
            subtitle: "Ticket holders",
        },
        {
            title: "Checked In",
            value: summary.checked_in.toString(),
            icon: "checkmark-circle-outline" as const,
            iconBg: colors.accent + "33",
            iconColor: colors.accent50,
            subtitle: "At the event",
        },
        {
            title: "Not Checked In",
            value: summary.not_checked_in.toString(),
            icon: "close-circle-outline" as const,
            iconBg: colors.primary200 + "80",
            iconColor: colors.white,
            subtitle: "Still pending",
        },
        {
            title: "Attendance Rate",
            value: `${summary.check_in_percentage.toFixed(1)}%`,
            icon: "stats-chart-outline" as const,
            iconBg: colors.accent + "33",
            iconColor: colors.accent50,
            subtitle: "Check-in progress",
            showProgress: true,
            percentage: summary.check_in_percentage,
        },
    ];

    return (
        <View className="gap-4">
            {cards.map((card, index) => (
                <View
                    key={index}
                    className="rounded-xl p-4 border-2"
                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent + "4D" }}
                >
                    <View className="flex-row items-start justify-between mb-4">
                        <View className="flex-1">
                            <AppText styles="text-sm text-white mb-2" font="font-imedium" style={{ opacity: 0.7 }}>
                                {card.title}
                            </AppText>
                            <AppText styles="text-2xl text-white mb-1" font="font-ibold">
                                {card.value}
                            </AppText>
                            <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                                {card.subtitle}
                            </AppText>
                        </View>
                        <View
                            className="w-12 h-12 rounded-xl items-center justify-center"
                            style={{ backgroundColor: card.iconBg }}
                        >
                            <Ionicons name={card.icon} size={24} color={card.iconColor} />
                        </View>
                    </View>

                    {/* Progress Bar for Attendance Rate */}
                    {card.showProgress && (
                        <View className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: colors.primary200 }}>
                            <View
                                className="h-full rounded-full"
                                style={{
                                    backgroundColor: colors.accent,
                                    width: `${card.percentage}%`,
                                }}
                            />
                        </View>
                    )}
                </View>
            ))}
        </View>
    );
};

export default EventAttendeesSummary;