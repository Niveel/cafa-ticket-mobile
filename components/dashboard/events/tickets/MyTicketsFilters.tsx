import { View, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { AppText, AppInput, SelectInput } from "@/components";
import type { EventCategory } from "@/types/tickets.types";
import colors from "@/config/colors";

interface MyTicketsFiltersProps {
    search: string;
    status: string;
    category: string;
    eventCategories: EventCategory[];
    onFilterChange: (filters: { search: string; status: string; category: string }) => void;
    onClearFilters: () => void;
    hasActiveFilters: boolean;
}

const MyTicketsFilters = ({
    search,
    status,
    category,
    eventCategories,
    onFilterChange,
    onClearFilters,
    hasActiveFilters,
}: MyTicketsFiltersProps) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleSearchChange = (text: string) => {
        onFilterChange({ search: text, status, category });
    };

    const handleStatusChange = (value: string) => {
        onFilterChange({ search, status: value, category });
    };

    const handleCategoryChange = (value: string) => {
        onFilterChange({ search, status, category: value });
    };

    const statusOptions = [
        { label: "All Tickets", value: "all" },
        { label: "Active", value: "active" },
        { label: "Used", value: "used" },
        { label: "Cancelled", value: "cancelled" },
    ];

    return (
        <>
            {/* Search Bar & Filter Button */}
            <View className="flex-row gap-3 mb-4">
                {/* Search Input */}
                <View className="flex-1">
                    <AppInput
                        name="search"
                        value={search}
                        onChangeText={handleSearchChange}
                        placeholder="Search tickets..."
                        icon="search"
                    />
                </View>

                {/* Filter Button */}
                <TouchableOpacity
                    onPress={() => setIsModalVisible(true)}
                    className="w-12 h-12 rounded-xl items-center justify-center border-2"
                    style={{
                        backgroundColor: hasActiveFilters ? colors.accent + "33" : colors.primary100,
                        borderColor: hasActiveFilters ? colors.accent : colors.accent + "4D",
                    }}
                    activeOpacity={0.7}
                >
                    <Ionicons name="filter" size={20} color={hasActiveFilters ? colors.accent : colors.white} />
                    {hasActiveFilters && (
                        <View
                            className="absolute -top-1 -right-1 w-5 h-5 rounded-full items-center justify-center"
                            style={{ backgroundColor: colors.accent }}
                        >
                            <AppText styles="text-xs text-white" font="font-ibold">
                                !
                            </AppText>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Filters Modal */}
            <Modal visible={isModalVisible} animationType="slide" transparent>
                <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View
                        className="rounded-t-3xl p-6"
                        style={{ backgroundColor: colors.primary, maxHeight: "90%" }}
                    >
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-row items-center gap-3">
                                <View
                                    className="w-10 h-10 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: colors.accent + "33" }}
                                >
                                    <Ionicons name="filter" size={20} color={colors.accent50} />
                                </View>
                                <AppText styles="text-lg text-white" font="font-ibold">
                                    Filter Tickets
                                </AppText>
                            </View>
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                className="w-10 h-10 items-center justify-center"
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <Ionicons name="close" size={24} color={colors.white} />
                            </TouchableOpacity>
                        </View>

                        {/* Filters */}
                        <View className="gap-4">
                            {/* Status Filter */}
                            <SelectInput
                                name="status"
                                label="Ticket Status"
                                value={status}
                                onChange={handleStatusChange}
                                options={statusOptions}
                            />

                            {/* Category Filter */}
                            <SelectInput
                                name="category"
                                label="Event Category"
                                value={category}
                                onChange={handleCategoryChange}
                                options={[
                                    { label: "All Categories", value: "" },
                                    ...eventCategories.map((cat) => ({
                                        label: cat.name,
                                        value: cat.slug,
                                    })),
                                ]}
                            />

                            {/* Clear Filters */}
                            {hasActiveFilters && (
                                <TouchableOpacity
                                    onPress={() => {
                                        onClearFilters();
                                        setIsModalVisible(false);
                                    }}
                                    className="flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl border-2"
                                    style={{
                                        backgroundColor: colors.accent + "1A",
                                        borderColor: colors.accent,
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <Ionicons name="close-circle" size={18} color={colors.accent} />
                                    <AppText styles="text-sm text-accent" font="font-ibold">
                                        Clear All Filters
                                    </AppText>
                                </TouchableOpacity>
                            )}

                            {/* Apply Button */}
                            <TouchableOpacity
                                onPress={() => setIsModalVisible(false)}
                                className="px-4 py-4 rounded-xl"
                                style={{ backgroundColor: colors.accent }}
                                activeOpacity={0.8}
                            >
                                <AppText styles="text-sm text-white text-center" font="font-ibold">
                                    Apply Filters
                                </AppText>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <View className="flex-row flex-wrap gap-2 mb-4">
                    <AppText styles="text-xs text-white" font="font-iregular" style={{ opacity: 0.6 }}>
                        Active filters:
                    </AppText>

                    {status !== "all" && (
                        <View
                            className="px-3 py-1 rounded-lg border"
                            style={{ backgroundColor: colors.accent + "33", borderColor: colors.accent + "4D" }}
                        >
                            <AppText styles="text-xs text-white" font="font-isemibold">
                                Status: {statusOptions.find((s) => s.value === status)?.label}
                            </AppText>
                        </View>
                    )}

                    {category && (
                        <View
                            className="px-3 py-1 rounded-lg border"
                            style={{ backgroundColor: colors.accent + "33", borderColor: colors.accent + "4D" }}
                        >
                            <AppText styles="text-xs text-white" font="font-isemibold">
                                Category: {eventCategories.find((c) => c.slug === category)?.name}
                            </AppText>
                        </View>
                    )}

                    {search && (
                        <View
                            className="px-3 py-1 rounded-lg border"
                            style={{ backgroundColor: colors.accent + "33", borderColor: colors.accent + "4D" }}
                        >
                            <AppText styles="text-xs text-white" font="font-isemibold">
                                Search: "{search}"
                            </AppText>
                        </View>
                    )}
                </View>
            )}
        </>
    );
};

export default MyTicketsFilters;