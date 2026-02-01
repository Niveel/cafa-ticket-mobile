import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import type { Href } from "expo-router";

import { AppText } from "@/components";
import colors from "@/config/colors";

const quickActions = [
    {
        title: "My Tickets",
        description: "View your tickets",
        icon: "ticket-outline",
        color: "#3b82f6",
        route: "/my-tickets",
    },
    {
        title: "My Events",
        description: "Manage your events",
        icon: "calendar-outline",
        color: "#a855f7",
        route: "/my-events",
    },
    {
        title: "Create Event",
        description: "Start a new event",
        icon: "add-circle-outline",
        color: "#10b981",
        route: "/events/create",
    },
    {
        title: "Browse Events",
        description: "Explore events",
        icon: "search-outline",
        color: "#f59e0b",
        route: "/events",
    },
];

const AnalyticsQuickActions = () => {
    return (
        <View>
            <AppText styles="text-sm text-white mb-3" font="font-ibold">
                Quick Actions
            </AppText>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                accessibilityLabel="Quick Actions"
            >
                <View className="flex-row gap-3">
                    {quickActions.map((action, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => router.push(action.route as Href)}
                            className="w-36 rounded-xl p-4 border"
                            style={{
                                backgroundColor: colors.primary100,
                                borderColor: colors.accent,
                            }}
                            activeOpacity={0.7}
                            accessibilityRole="button"
                            accessibilityLabel={`${action.title}. ${action.description}`}
                        >
                            <View
                                className="w-10 h-10 rounded-lg items-center justify-center mb-3"
                                style={{ backgroundColor: action.color + "33" }}
                            >
                                <Ionicons name={action.icon as any} size={20} color={action.color} />
                            </View>
                            <AppText styles="text-sm text-white" font="font-ibold">
                                {action.title}
                            </AppText>
                            <AppText styles="text-xs text-white mt-0.5" font="font-iregular" style={{ opacity: 0.6 }}>
                                {action.description}
                            </AppText>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default AnalyticsQuickActions;