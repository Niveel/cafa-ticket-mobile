import { View, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import PastEventCompactCard from "./PastEventCompactCard";
import { Event } from "@/types";
import colors from "@/config/colors";

interface PastEventsSectionProps {
    events: Event[];
    isLoading: boolean;
}

const PastEventsSection = ({ events, isLoading }: PastEventsSectionProps) => {
    if (isLoading) {
        return (
            <View className="mb-6">
                <View className="flex-row items-center justify-between mb-4 px-2">
                    <View className="h-6 w-32 bg-white/10 rounded" />
                    <View className="h-6 w-16 bg-white/10 rounded" />
                </View>
                <View className="flex-row gap-3 px-2">
                    {[1, 2].map((i) => (
                        <View key={i} className="w-44 h-44 bg-white/5 rounded-xl" />
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
                        style={{ backgroundColor: colors.primary200 + "80" }}
                    >
                        <Ionicons name="time-outline" size={20} color={colors.white} style={{ opacity: 0.6 }} />
                    </View>
                    <View>
                        <AppText styles="text-lg text-black" font="font-ibold">
                            Past Events
                        </AppText>
                        <AppText styles="text-xs text-black" font="font-iregular" style={{ opacity: 0.6 }}>
                            Relive the memories
                        </AppText>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => router.push("/events/past")}
                    className="flex-row items-center gap-1"
                    activeOpacity={0.7}
                >
                    <AppText styles="text-sm" font="font-isemibold" style={{ color: colors.accent50 }}>
                        See All
                    </AppText>
                    <Ionicons name="chevron-forward" size={16} color={colors.accent50} />
                </TouchableOpacity>
            </View>

            {/* Events List */}
            <View className="flex-row gap-3 px-2">
                {events.slice(0, 2).map((event) => (
                    <View key={event.id} className="flex-1">
                        <PastEventCompactCard event={event} />
                    </View>
                ))}
            </View>
        </View>
    );
};

export default PastEventsSection;
