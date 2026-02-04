import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../../ui/AppText";
import colors from "@/config/colors";

interface ActiveFilter {
    key: string;
    label: string;
    value: string;
}

interface PastEventActiveFiltersDisplayProps {
    activeFilters: ActiveFilter[];
    onRemoveFilter: (key: string) => void;
    onClearAll: () => void;
}

const PastEventActiveFiltersDisplay = ({ activeFilters, onRemoveFilter, onClearAll }: PastEventActiveFiltersDisplayProps) => {
    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <View className="flex-row flex-wrap items-center gap-2">
            <AppText styles="text-xs text-white" style={{ opacity: 0.7 }}>
                Filters:
            </AppText>

            {/* Filter Chips */}
            {activeFilters.map((filter) => (
                <View
                    key={filter.key}
                    className="flex-row items-center gap-2 px-3 py-2 rounded-lg border"
                    style={{ backgroundColor: colors.accent + "33", borderColor: colors.accent }}
                >
                    <AppText styles="text-xs text-white">
                        {filter.label}: {filter.value}
                    </AppText>
                    <TouchableOpacity
                        onPress={() => onRemoveFilter(filter.key)}
                        className="w-4 h-4 rounded-full items-center justify-center"
                        style={{ backgroundColor: colors.accent + "4D" }}
                        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                    >
                        <Ionicons name="close" size={12} color={colors.white} />
                    </TouchableOpacity>
                </View>
            ))}

            {/* Clear All Button */}
            {activeFilters.length > 1 && (
                <TouchableOpacity
                    onPress={onClearAll}
                    className="px-3 py-2 rounded-lg border"
                    style={{ backgroundColor: colors.primary100, borderColor: colors.accent }}
                    activeOpacity={0.7}
                >
                    <AppText styles="text-xs text-white font-nunbold">
                        Clear All
                    </AppText>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default PastEventActiveFiltersDisplay;