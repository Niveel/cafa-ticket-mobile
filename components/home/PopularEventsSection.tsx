import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import EventCard from "../events/EventCard";
import { Event } from "@/types";
import colors from "@/config/colors";

interface PopularEventsSectionProps {
    events: Event[];
    isLoading: boolean;
}

const PopularEventsSection = ({ events, isLoading }: PopularEventsSectionProps) => {
    if (isLoading) {
        return (
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4 px-2">
                    <View className="h-6 w-32 bg-white/10 rounded" />
                    <View className="h-6 w-16 bg-white/10 rounded" />
                </View>
                <View className="flex-row gap-3 px-2">
                    {[1, 2].map((i) => (
                        <View key={i} className="w-44 h-64 bg-white/5 rounded-2xl" />
                    ))}
                </View>
            </View>
        );
    }

    if (!events || events.length === 0) {
        return null;
    }

    return (
        <View className="mb-6">
            {/* Section Header */}
            <View className="flex-row items-center justify-between mb-4 px-2">
                <View className="flex-row items-center gap-2">
                    <View
                        className="w-10 h-10 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.accent + "33" }}
                    >
                        <Ionicons name="flame" size={20} color={colors.accent} />
                    </View>
                    <View>
                        <AppText styles="text-lg text-white font-nunbold">
                            Popular Events
                        </AppText>
                        <AppText styles="text-xs text-white" style={{ opacity: 0.6 }}>
                            Trending now
                        </AppText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/(tabs)/events")}
                    className="flex-row items-center gap-1"
                    activeOpacity={0.7}
                >
                    <AppText styles="text-sm" style={{ color: colors.accent50 }}>
                        See All
                    </AppText>
                    <Ionicons name="chevron-forward" size={16} color={colors.accent50} />
                </TouchableOpacity>
            </View>

            {/* Events List */}
            <View className="flex-row gap-3 px-2">
                {events.slice(0, 2).map((event) => (
                    <View key={event.id} className="flex-1">
                        <EventCard event={event} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PopularEventsSection;