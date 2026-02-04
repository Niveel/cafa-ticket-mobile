import { View, Modal, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import AppText from "../ui/AppText";
import AppButton from "../ui/AppButton";
import colors from "@/config/colors";

export interface FilterOptions {
    city: string | null;
    status: "upcoming" | "ongoing" | "all";
    date_from: string;
    date_to: string;
    price_min: string;
    price_max: string;
}

interface EventsFilterProps {
    filters: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
    onClearFilters: () => void;
    activeFiltersCount: number;
}

const EventsFilter = ({
    filters,
    onFilterChange,
    onClearFilters,
    activeFiltersCount,
}: EventsFilterProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleFilterUpdate = (key: keyof FilterOptions, value: string | null) => {
        onFilterChange({
            ...filters,
            [key]: value,
        });
    };

    const handleApply = () => {
        setIsOpen(false);
    };

    return (
        <>
            {/* Filter Toggle Button */}
            <TouchableOpacity
                onPress={() => setIsOpen(true)}
                className="flex-row items-center gap-3 px-6 py-3 bg-primary-100 rounded-xl border-2 border-accent"
                activeOpacity={0.7}
            >
                <Ionicons name="filter" size={20} color={colors.accent50} />
                <AppText styles="text-sm text-white font-nunbold">
                    Filters
                </AppText>
                {activeFiltersCount > 0 && (
                    <View className="px-2 py-0.5 bg-accent rounded-full">
                        <AppText styles="text-xs text-white font-nunbold">
                            {activeFiltersCount}
                        </AppText>
                    </View>
                )}
                <Ionicons name="chevron-down" size={16} color={colors.white} />
            </TouchableOpacity>

            {/* Filter Modal */}
            <Modal
                visible={isOpen}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsOpen(false)}
            >
                <View className="flex-1 bg-primary/90 justify-end">
                    <View className="bg-primary rounded-t-3xl border-2 border-accent max-h-[80%]">
                        {/* Header */}
                        <View className="flex-row items-center justify-between p-6 border-b border-accent">
                            <View>
                                <AppText styles="text-lg text-white mb-1 font-nunbold">
                                    Filter Events
                                </AppText>
                                <AppText styles="text-xs text-slate-300">
                                    Refine your search
                                </AppText>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsOpen(false)}
                                className="w-10 h-10 rounded-lg bg-primary-100 border border-accent items-center justify-center"
                                activeOpacity={0.7}
                            >
                                <Ionicons name="close" size={20} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Filter Content */}
                        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>

                            {/* Status Filter */}
                            <View className="mb-6">
                                <View className="flex-row items-center gap-2 mb-3">
                                    <Ionicons name="calendar" size={16} color={colors.accent50} />
                                    <AppText styles="text-sm text-white font-nunbold">
                                        Event Status
                                    </AppText>
                                </View>
                                <View className="flex-row gap-3">
                                    {[
                                        { value: "upcoming", label: "Upcoming" },
                                        { value: "ongoing", label: "Ongoing" },
                                        { value: "all", label: "All" },
                                    ].map((status) => (
                                        <TouchableOpacity
                                            key={status.value}
                                            onPress={() =>
                                                handleFilterUpdate("status", status.value as any)
                                            }
                                            className={`flex-1 py-3 px-4 rounded-xl border-2 ${filters.status === status.value
                                                ? "bg-accent border-accent"
                                                : "bg-primary-100 border-accent/30"
                                                }`}
                                            activeOpacity={0.7}
                                        >
                                            <AppText
                                                styles={`text-xs text-center font-nunbold ${filters.status === status.value
                                                    ? "text-white"
                                                    : "text-slate-200"
                                                    }`}
                                            >
                                                {status.label}
                                            </AppText>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Bottom spacing */}
                            <View className="h-20" />
                        </ScrollView>

                        {/* Action Buttons */}
                        <View className="flex-row gap-3 p-6 border-t border-accent">
                            <View className="flex-1">
                                <AppButton
                                    title="Clear All"
                                    variant="outline"
                                    size="md"
                                    onClick={() => {
                                        onClearFilters();
                                        setIsOpen(false);
                                    }}
                                />
                            </View>
                            <View className="flex-1">
                                <AppButton
                                    title="Apply"
                                    variant="primary"
                                    size="md"
                                    onClick={handleApply}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default EventsFilter;