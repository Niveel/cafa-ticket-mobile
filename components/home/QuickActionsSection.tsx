import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";

const quickActions = [
    {
        icon: "calendar" as keyof typeof Ionicons.glyphMap,
        title: "Create Event",
        description: "Host your own event",
        route: "/dashboard/events/create",
        color: colors.accent,
    },
    {
        icon: "ticket" as keyof typeof Ionicons.glyphMap,
        title: "My Tickets",
        description: "View purchased tickets",
        route: "/dashboard/tickets",
        color: "#3b82f6",
    },
    {
        icon: "receipt" as keyof typeof Ionicons.glyphMap,
        title: "My Events",
        description: "Manage your events",
        route: "/dashboard/events",
        color: "#8b5cf6",
    },
    {
        icon: "stats-chart" as keyof typeof Ionicons.glyphMap,
        title: "Analytics",
        description: "Track performance",
        route: "/dashboard/analytics",
        color: "#10b981",
    },
];

interface QuickActionsSectionProps {
    isLoading?: boolean;
}

const QuickActionsSection = ({ isLoading = false }: QuickActionsSectionProps) => {
    if (isLoading) {
        return (
            <View className="mb-6">
                <View className="h-6 w-32 bg-white/10 rounded mb-4 px-2" />
                <View className="grid grid-cols-2 gap-3 px-2">
                    {[1, 2, 3, 4].map((i) => (
                        <View key={i} className="h-28 bg-white/5 rounded-2xl" />
                    ))}
                </View>
            </View>
        );
    }

    return (
        <View className="mb-6">
            {/* Section Header */}
            <View className="mb-4 px-2">
                <AppText styles="text-lg text-white font-nunbold">
                    Quick Actions
                </AppText>
                <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                    Get things done faster
                </AppText>
            </View>

            {/* Actions Grid */}
            <View className="flex-row flex-wrap gap-3 px-2">
                {quickActions.map((action, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => router.push(action.route as any)}
                        className="rounded-2xl p-4"
                        style={{
                            backgroundColor: colors.primary100,
                            width: "48%",
                            borderWidth: 1,
                            borderColor: action.color + "33",
                        }}
                        activeOpacity={0.8}
                    >
                        <View
                            className="w-12 h-12 rounded-xl items-center justify-center mb-3"
                            style={{ backgroundColor: action.color + "33" }}
                        >
                            <Ionicons name={action.icon} size={24} color={action.color} />
                        </View>
                        <AppText styles="text-sm text-white mb-1 font-nunbold">
                            {action.title}
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                            {action.description}
                        </AppText>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default QuickActionsSection;