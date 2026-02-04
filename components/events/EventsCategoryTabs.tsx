import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import { EventCategory } from "@/types/tickets.types";
import colors from "@/config/colors";

interface EventsCategoryTabsProps {
    selectedCategory: string | null;
    onCategorySelect: (slug: string | null) => void;
    categories: EventCategory[];
}

const EventsCategoryTabs = ({
    selectedCategory,
    onCategorySelect,
    categories,
}: EventsCategoryTabsProps) => {
    const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
        // Map category icons to Ionicons
        const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            music: "musical-notes",
            sports: "trophy",
            tech: "code-slash",
            food: "restaurant",
            art: "color-palette",
            business: "briefcase",
            education: "school",
            health: "fitness",
            entertainment: "game-controller",
        };
        return iconMap[iconName.toLowerCase()] || "calendar";
    };

    return (
        <View className="bg-primary-100 mb-2">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
                {/* All Events Tab */}
                <TouchableOpacity
                    onPress={() => onCategorySelect(null)}
                    className={`px-6 py-3 rounded-xl border-2 ${selectedCategory === null
                        ? "bg-accent border-accent"
                        : "bg-primary border-accent/30"
                        }`}
                    activeOpacity={0.7}
                >
                    <AppText
                        styles={`text-sm font-nunbold ${selectedCategory === null ? "text-white" : "text-slate-200"}`}
                    >
                        All Events
                    </AppText>
                </TouchableOpacity>

                {/* Category Tabs */}
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.slug;
                    const iconName = getIconName(category.icon);

                    return (
                        <TouchableOpacity
                            key={category.id}
                            onPress={() => onCategorySelect(category.slug)}
                            className={`flex-row items-center gap-2 px-6 py-3 rounded-xl border-2 ${isSelected
                                ? "bg-accent border-accent"
                                : "bg-primary border-accent/30"
                                }`}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={iconName}
                                size={16}
                                color={isSelected ? colors.white : colors.accent50}
                            />
                            <AppText
                                styles={`text-xs font-nunbold ${isSelected ? "text-white" : "text-slate-200"}`}
                            >
                                {category.name}
                            </AppText>
                            {isSelected && (
                                <View className="w-2 h-2 bg-white rounded-full" />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

export default EventsCategoryTabs;