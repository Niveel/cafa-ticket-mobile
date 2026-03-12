import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";

interface EventsEmptyStateProps {
    hasFilters: boolean;
    onClearFilters: () => void;
}

const EventsEmptyState = ({
    hasFilters,
    onClearFilters,
}: EventsEmptyStateProps) => {
    return (
        <View className="pb-16 px-4">
            {/* Icon */}
            <View
                className="w-24 h-24 rounded-full items-center justify-center  mx-auto mb-6 border-2 border-accent"
                style={{ backgroundColor: "rgba(220, 0, 0, 0.2)" }}
            >
                <Ionicons name="search" size={48} color={colors.accent50} />
            </View>

            {/* Message */}
            <AppText styles="text-xl text-black text-center mb-3 font-nunbold">
                {hasFilters ? "No Events Found" : "No Events Available"}
            </AppText>

            <AppText
                styles="text-sm text-slate-600 text-center mb-6 max-w-sm"
            >
                {hasFilters
                    ? "We couldn't find any events matching your filters. Try adjusting your search criteria."
                    : "There are no events available at the moment. Check back later!"}
            </AppText>

            {/* Actions */}
            {hasFilters && (
                <View className="w-full max-w-xs mb-6">
                    <TouchableOpacity
                        onPress={onClearFilters}
                        className="flex-row items-center justify-center gap-2 py-3 px-4 rounded-xl"
                        style={{ backgroundColor: colors.accent }}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="refresh" size={20} color={colors.white} />
                        <AppText styles="text-sm text-white font-nunbold">Clear All Filters</AppText>
                    </TouchableOpacity>
                </View>
            )}

            {/* Suggestions */}
            {hasFilters && (
                <View className="mt-8 p-6 bg-white rounded-xl border border-accent max-w-sm">
                    <AppText styles="text-sm text-black mb-3 font-nunbold">
                        Try these suggestions:
                    </AppText>
                    <View className="space-y-2">
                        {[
                            "Check your spelling and try again",
                            "Use broader search terms",
                            "Browse all categories instead",
                        ].map((suggestion, index) => (
                            <View key={index} className="flex-row items-start gap-2 mb-2">
                                <AppText styles="text-xs text-accent-50 mt-1 font-nunbold">
                                    •
                                </AppText>
                                <AppText styles="text-xs text-black flex-1">
                                    {suggestion}
                                </AppText>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </View>
    );
};

export default EventsEmptyState;
