import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import colors from "@/config/colors";

interface ActiveFilter {
    key: string;
    label: string;
    value: string;
}

interface ActiveFiltersDisplayProps {
    activeFilters: ActiveFilter[];
    onRemoveFilter: (key: string) => void;
    onClearAll: () => void;
}

const ActiveFiltersDisplay = ({
    activeFilters,
    onRemoveFilter,
    onClearAll,
}: ActiveFiltersDisplayProps) => {
    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <View>
            <AppText styles="text-xs text-black mb-3" font="font-isemibold">
                Active Filters:
            </AppText>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12 }}
            >
                {/* Filter Chips */}
                {activeFilters.map((filter) => (
                    <View
                        key={filter.key}
                        className="flex-row items-center gap-2 px-3 py-2 bg-accent/20 border border-accent rounded-lg"
                    >
                        <AppText styles="text-xs text-accent-50" font="font-isemibold">
                            {filter.label}: {filter.value}
                        </AppText>
                        <TouchableOpacity
                            onPress={() => onRemoveFilter(filter.key)}
                            className="w-4 h-4 rounded-full bg-accent/30 items-center justify-center"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={12} color={colors.white} />
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Clear All Button */}
                {activeFilters.length > 1 && (
                    <TouchableOpacity
                        onPress={onClearAll}
                        className="px-3 py-2 bg-primary-100 border border-accent rounded-lg"
                        activeOpacity={0.7}
                    >
                        <AppText styles="text-xs text-black" font="font-ibold">
                            Clear All
                        </AppText>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

export default ActiveFiltersDisplay;
